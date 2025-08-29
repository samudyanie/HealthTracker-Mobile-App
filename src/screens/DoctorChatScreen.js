// app/screens/DoctorChatScreen.js
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRoute, useNavigation } from '@react-navigation/native';
import { io } from 'socket.io-client';
import { Picker } from '@react-native-picker/picker';

// =============================================================================
// 🔧 SERVER CONFIG (adjust to your environment)
// =============================================================================
const SERVER_URL = 'http://192.168.1.20:5555';
const API_BASE = `${SERVER_URL}/api/chat`;

/** ---------- Utilities to make patient IDs show correctly ---------- */
const normalizeMaybeObjectId = (v) => {
  // Accept numbers, strings, or objects like {$oid: ...} / {_id: ...}
  if (v == null) return '';
  if (typeof v === 'number' || typeof v === 'bigint') return String(v);
  if (typeof v === 'string') return v.trim();
  if (typeof v === 'object') {
    const cand =
      v.$oid ?? v.$id ?? v.oid ?? v._id ?? v.id ??
      (typeof v.toString === 'function' ? v.toString() : '');
    return cand ? String(cand).trim() : '';
  }
  try {
    return String(v).trim();
  } catch {
    return '';
  }
};

const extractPatientId = (row) => {
  if (!row || typeof row !== 'object') return '';
  // Try common keys (case variants included)
  const keys = [
    'patientId','patientID','patient_id','PatientId','PatientID','patientid','pid','PID',
    'userId','userID','user_id'
  ];
  for (const k of keys) {
    if (k in row && row[k] != null) {
      const id = normalizeMaybeObjectId(row[k]);
      if (id) return id;
    }
  }
  // Nested shapes
  if (row.patient) {
    const p = row.patient;
    const id = normalizeMaybeObjectId(p.id ?? p._id ?? p.patientId ?? p.patientID);
    if (id) return id;
  }
  // Some APIs embed in _id directly as string
  if (row._id) {
    const id = normalizeMaybeObjectId(row._id);
    if (id) return id;
  }
  return '';
};

const dedupeSortPatients = (arr) => {
  // Remove blanks, dedupe, then sort (numeric if all numeric, else alphanumeric)
  const set = new Set();
  const clean = [];
  for (const x of arr) {
    const id = normalizeMaybeObjectId(x?.id);
    if (!id) continue;
    if (!set.has(id)) {
      set.add(id);
      clean.push({ id, name: x?.name || '' });
    }
  }
  const allNumeric = clean.every((p) => /^\d+$/.test(p.id));
  clean.sort((a, b) => {
    if (allNumeric) return Number(a.id) - Number(b.id);
    return a.id.localeCompare(b.id);
  });
  return clean;
};
/** ------------------------------------------------------------------ */

const DoctorChatScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();

  // Doctor (from storage)
  const [doctor, setDoctor] = useState(null); // expects { doctornumber, name, ... }
  const doctorId = useMemo(() => String(doctor?.doctornumber || ''), [doctor]);
  const doctorName = doctor?.name || 'Doctor';

  // Patients (dropdown list)
  const [patients, setPatients] = useState([]); // [{id, name?}]
  const [loadingPatients, setLoadingPatients] = useState(false);

  // Selected patient (from nav, storage, or dropdown)
  const [patientId, setPatientId] = useState(route?.params?.patientId ? String(route.params.patientId) : '');
  const [patientName, setPatientName] = useState(route?.params?.patientName || '');

  // Chat state
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [connecting, setConnecting] = useState(true);
  const socketRef = useRef(null);

  // Load doctor + any preselected patient
  useEffect(() => {
    (async () => {
      try {
        const storedDoc = await AsyncStorage.getItem('doctor');
        if (storedDoc) setDoctor(JSON.parse(storedDoc));
      } catch {}
      if (!route?.params?.patientId) {
        try {
          const pre = await AsyncStorage.getItem('doctorChat.preselectPatientId');
          if (pre) setPatientId(String(pre));
        } catch {}
      }
    })();
  }, [route?.params?.patientId]);

  // Fetch and build the dropdown list from your report-by-doctor endpoints
  useEffect(() => {
    if (!doctorId) return;
    let isCancelled = false;

    const fetchJson = async (url) => {
      try {
        const r = await fetch(url);
        if (!r.ok) return [];
        const data = await r.json();
        // Some APIs return an array; some return {data: [...]}
        return Array.isArray(data) ? data : (Array.isArray(data?.data) ? data.data : []);
      } catch {
        return [];
      }
    };

    const fetchPatients = async () => {
      setLoadingPatients(true);
      try {
        const endpoints = [
          'getbloodpressurebydoc',
          'getbloodsugarbydoc',
          'getlipidbydoc',
          'getfbcbydoc',
        ].map((ep) => `${SERVER_URL}/api/patient/${ep}/${encodeURIComponent(doctorId)}`);

        const results = await Promise.all(endpoints.map(fetchJson));
        const rows = results.flat();

        // Extract + normalize ids
        const list = [];
        for (const row of rows) {
          const id = extractPatientId(row);
          if (id) list.push({ id });
        }

        let deduped = dedupeSortPatients(list);

        // If we already have a selected patient (e.g., navigated from history) but it's not in the list, add it
        if (patientId && !deduped.some((p) => p.id === patientId)) {
          deduped = deduped.concat({ id: patientId, name: patientName || '' });
        }

        if (!isCancelled) setPatients(deduped);
      } finally {
        if (!isCancelled) setLoadingPatients(false);
      }
    };

    fetchPatients();
    return () => { isCancelled = true; };
  }, [doctorId, patientId, patientName]);

  // Socket
  useEffect(() => {
    const socket = io(SERVER_URL, { transports: ['websocket'] });
    socketRef.current = socket;

    socket.on('connect', () => setConnecting(false));
    socket.on('disconnect', () => setConnecting(true));

    socket.on('receiveMessage', (msg) => {
      setMessages((prev) => [
        ...prev,
        {
          id: msg.id || `${Date.now()}-${Math.random()}`,
          senderType: msg.senderType || msg.sender || 'patient',
          message: msg.message || msg.text || '',
          timestamp: msg.timestamp || msg.ts || Date.now(),
        },
      ]);
    });

    return () => {
      socket.removeAllListeners();
      socket.disconnect();
      socketRef.current = null;
    };
  }, []);

  // Fetch chat history
  const fetchHistory = useCallback(async () => {
    if (!doctorId || !patientId) return;
    try {
      setLoadingHistory(true);
      const res = await fetch(
        `${API_BASE}/messages?doctorId=${encodeURIComponent(doctorId)}&patientId=${encodeURIComponent(patientId)}`
      );
      const data = await res.json();
      const normalized = (data?.messages || []).map((m, i) => ({
        id: m.id || `${i}-${m.timestamp || Date.now()}`,
        senderType: m.senderType || m.sender || 'patient',
        message: m.message || m.text || '',
        timestamp: m.timestamp || m.ts || Date.now(),
      }));
      setMessages(normalized);
    } catch (e) {
      console.error('history error', e);
    } finally {
      setLoadingHistory(false);
    }
  }, [doctorId, patientId]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const fmtDateTime = (t) => {
    const d = new Date(t);
    return d.toLocaleDateString('en-GB') + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const labelFor = (senderType) =>
    senderType === 'doctor'
      ? `Dr. ${doctorName}${doctorId ? ` (#${doctorId})` : ''}`
      : patientName
      ? `${patientName} (#${patientId || '—'})`
      : `Patient #${patientId || '—'}`;

  const handleSend = async () => {
    const text = newMessage.trim();
    if (!text) return;

    if (!doctorId) {
      Alert.alert('Missing doctor info', 'Doctor account not found in storage.');
      return;
    }
    if (!patientId) {
      Alert.alert('Select a patient', 'Please pick a patient from the dropdown first.');
      return;
    }

    const payload = {
      id: Date.now().toString() + Math.random(),
      senderId: String(doctorId),
      senderType: 'doctor',
      receiverId: String(patientId),
      receiverType: 'patient',
      message: text,
      timestamp: Date.now(),
    };

    try {
      await fetch(`${API_BASE}/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      socketRef.current?.emit('sendMessage', payload);

      setMessages((prev) => [
        ...prev,
        { id: payload.id, senderType: 'doctor', message: payload.message, timestamp: payload.timestamp },
      ]);
      setNewMessage('');
    } catch (err) {
      console.error('send error', err);
      Alert.alert('Send failed', 'Could not send your message. Please try again.');
    }
  };

  const renderItem = ({ item }) => {
    const mine = item.senderType === 'doctor';
    const isDoctor = item.senderType === 'doctor';
    return (
      <View style={[styles.msgRow, mine ? styles.rowEnd : styles.rowStart]}>
        <View style={[styles.bubble, isDoctor ? styles.bubbleDoctor : styles.bubblePatient]}>
          <Text style={[styles.sender, isDoctor ? styles.senderOnTeal : styles.senderOnWhite]}>
            {labelFor(item.senderType)}
          </Text>
          <Text style={styles.msgText}>{item.message}</Text>
          <Text style={[styles.time, isDoctor ? styles.timeOnTeal : styles.timeOnWhite]}>
            🕒 {fmtDateTime(item.timestamp)}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.safe}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 8 : 0}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={styles.backTxt}>‹ Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Doctor Chat</Text>
          <View style={{ width: 64 }} />
        </View>

        {/* Patient selector */}
        <View style={styles.selectorBar}>
          <Text style={styles.selectorLabel}>Patient:</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={patientId}
              onValueChange={(val) => {
                const v = String(val || '').trim();
                setPatientId(v);
                AsyncStorage.setItem('doctorChat.preselectPatientId', v).catch(() => {});
              }}
              mode="dropdown"
              style={styles.picker}
            >
              <Picker.Item label={loadingPatients ? 'Loading patients…' : '— Select a patient —'} value="" />
              {patients.map((p) => {
                const label = p.name ? `${p.name} (#${p.id})` : `Patient #${p.id}`;
                return <Picker.Item key={p.id} label={label} value={p.id} />;
              })}
            </Picker>
          </View>
          {patients.length === 0 && !loadingPatients && (
            <Text style={styles.helperText}>
              No patients found from reports. Try opening a patient’s report → History to preselect.
            </Text>
          )}
        </View>

        {/* Connection / history status */}
        {(connecting || loadingHistory) && (
          <View style={styles.statusBar}>
            {connecting && <Text style={styles.statusText}>Connecting…</Text>}
            {loadingHistory && (
              <View style={styles.statusRow}>
                <ActivityIndicator size="small" />
                <Text style={styles.statusText}>Loading messages…</Text>
              </View>
            )}
          </View>
        )}

        {/* Messages */}
        <FlatList
          data={messages}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
        />

        {/* Composer */}
        <View style={styles.composerBar}>
          <TextInput
            value={newMessage}
            onChangeText={setNewMessage}
            placeholder={
              patientId
                ? `Message Patient #${patientId} as Dr. ${doctorName}`
                : 'Select a patient first…'
            }
            editable={!!patientId}
            style={[styles.input, !patientId && { opacity: 0.6 }]}
            onSubmitEditing={handleSend}
            returnKeyType="send"
          />
          <TouchableOpacity
            onPress={handleSend}
            style={[styles.sendBtn, !patientId && { opacity: 0.6 }]}
            disabled={!patientId}
            activeOpacity={0.85}
          >
            <Text style={styles.sendTxt}>Send</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f3f4f6' },

  // Header
  header: {
    backgroundColor: '#0d9488',
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backBtn: { paddingRight: 12, paddingVertical: 4 },
  backTxt: { color: '#ffffff', fontSize: 16, fontWeight: '600' },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },

  // Selector
  selectorBar: {
    backgroundColor: '#ecfeff',
    borderBottomWidth: 1,
    borderBottomColor: '#99f6e4',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  selectorLabel: { fontSize: 12, color: '#115e59', marginBottom: 6, fontWeight: '700' },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#99f6e4',
    borderRadius: 10,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  picker: { height: 52 },
  helperText: { marginTop: 6, fontSize: 12, color: '#0f766e' },

  // Status
  statusBar: {
    backgroundColor: '#ecfeff',
    borderBottomWidth: 1,
    borderBottomColor: '#99f6e4',
    paddingVertical: 6,
    paddingHorizontal: 12,
    gap: 6,
  },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  statusText: { color: '#115e59', fontSize: 12, fontWeight: '600' },

  // Messages
  listContent: { padding: 12, gap: 8 },
  msgRow: { flexDirection: 'row' },
  rowEnd: { justifyContent: 'flex-end' },
  rowStart: { justifyContent: 'flex-start' },
  bubble: {
    maxWidth: '75%',
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
  bubbleDoctor: { backgroundColor: '#14b8a6' }, // doctor messages teal
  bubblePatient: { backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#e5e7eb' },
  sender: { fontSize: 11, marginBottom: 4, opacity: 0.8 },
  senderOnTeal: { color: '#ecfeff' },
  senderOnWhite: { color: '#475569' },
  msgText: { fontSize: 15, color: '#0f172a' },
  time: { fontSize: 10, marginTop: 4, opacity: 0.8 },
  timeOnTeal: { color: '#ecfeff' },
  timeOnWhite: { color: '#6b7280' },

  // Composer
  composerBar: {
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    backgroundColor: '#ffffff',
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    fontSize: 14,
  },
  sendBtn: {
    backgroundColor: '#0d9488',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  sendTxt: { color: '#fff', fontWeight: '700' },
});

export default DoctorChatScreen;
