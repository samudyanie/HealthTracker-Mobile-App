// app/screens/ChatScreen.js
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
import { io } from 'socket.io-client';

// =============================================================================
// 🔧 SERVER CONFIG
// Replace with your backend base URL. On a device, "localhost" won't work.
//  • Physical device on same Wi-Fi: http://<your-computer-LAN-IP>:5555
//  • Android emulator: http://10.0.2.2:5555
//  • iOS simulator (Mac): http://localhost:5555
// =============================================================================
const SERVER_URL = 'http://192.168.1.20:5555';
const API_BASE = `${SERVER_URL}/api/chat`;

const ChatScreen = ({ navigation, route }) => {
  // You can pass doctorId/doctorName via navigation (recommended from your FAB)
  const navDoctorId = route?.params?.doctorId ? String(route.params.doctorId) : '';
  const navDoctorName = route?.params?.doctorName || '';

  // Loaded from storage (fallbacks)
  const [patient, setPatient] = useState();   // { id, name, ... }
  const [doctor, setDoctor] = useState(null);     // { doctorNumber, name, ... }

  // Effective doctor values (prefer navigation param)
  const [doctorId, setDoctorId] = useState(navDoctorId);
  const [doctorName, setDoctorName] = useState(navDoctorName);

  // Role: patient (default) or doctor (if you also build a doctor app)
  const role = doctor ? 'doctor' : 'patient';

  // UI state
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [connecting, setConnecting] = useState(true);

  // Socket
  const socketRef = useRef(null);

  // Labels like web
  const patientName = patient?.name || 'Patient';
  const patientId = patient?.id ? String(patient.id) : 'Unknown';

  const effectiveDoctorId = useMemo(() => {
    return String(doctorId || doctor?.doctorNumber || '');
  }, [doctorId, doctor]);

  const effectiveDoctorName = useMemo(() => {
    return doctor?.name || doctorName || (effectiveDoctorId ? `Doctor #${effectiveDoctorId}` : 'Doctor');
  }, [doctor?.name, doctorName, effectiveDoctorId]);

  // Load user/doctor and saved doctor selection from AsyncStorage
  useEffect(() => {
    (async () => {
      try {
        const savedUser = await AsyncStorage.getItem('user');
        if (savedUser) {
            const userJson = JSON.parse(savedUser);
            const extractedUser = userJson.patient; // 👈 this holds the object with `id`
          const userIdValue = extractedUser?.id;
            setPatient(userIdValue);
        }
      } catch {}

      try {
        const savedDoctor = await AsyncStorage.getItem('doctor'); // if you store a full doctor object anywhere
        if (savedDoctor) setDoctor(JSON.parse(savedDoctor));
      } catch {}

      try {
        const savedDoctorId = await AsyncStorage.getItem('selectedDoctorId');
        if (!navDoctorId && savedDoctorId) setDoctorId(String(savedDoctorId));
      } catch {}

      // If you also store doctorName elsewhere, you could setDoctorName here.
    })();
  }, [navDoctorId]);

  // Fetch history (REST): /api/chat/messages?doctorId=&patientId=
  const fetchHistory = useCallback(async () => {
    if (!effectiveDoctorId || !patient) return;
    try {
      setLoadingHistory(true);
      const res = await fetch(`${API_BASE}/messages?doctorId=${encodeURIComponent(effectiveDoctorId)}&patientId=${encodeURIComponent(patient)}`);
      const data = await res.json();
      if (data?.success) {
        // Normalize shapes to align with web
        const normalized = (data.messages || []).map((m, i) => ({
          id: m.id || `${i}-${m.timestamp || Date.now()}`,
          senderType: m.senderType || m.sender || 'patient',
          message: m.message || m.text || '',
          timestamp: m.timestamp || m.ts || Date.now(),
        }));
        setMessages(normalized);
      }
    } catch (err) {
      console.error('Error fetching chat history:', err);
    } finally {
      setLoadingHistory(false);
    }
  }, [effectiveDoctorId, patient]);

  // Connect socket and subscribe like web ("receiveMessage")
  useEffect(() => {
    const socket = io(SERVER_URL, { transports: ['websocket'] }); // force ws for RN
    socketRef.current = socket;

    socket.on('connect', () => setConnecting(false));
    socket.on('disconnect', () => setConnecting(true));

    socket.on('receiveMessage', (msg) => {
      // Normalize to RN shape and append
      const payload = {
        id: msg.id || `${Date.now()}-${Math.random()}`,
        senderType: msg.senderType || msg.sender || 'patient',
        message: msg.message || msg.text || '',
        timestamp: msg.timestamp || msg.ts || Date.now(),
      };
      setMessages((prev) => [...prev, payload]);
    });

    return () => {
      socket.removeAllListeners();
      socket.disconnect();
      socketRef.current = null;
    };
  }, []);

  // Fetch history whenever participants are known
  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const fmtDateTime = (t) => {
    const d = new Date(t);
    return (
      d.toLocaleDateString('en-GB') +
      ' ' +
      d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    );
  };

  const labelFor = (senderType) =>
    senderType === 'patient'
      ? `${patientName} (${patient})`
      : `Dr. ${effectiveDoctorName}`;

  const handleSend = async () => {
    const text = newMessage.trim();
    if (!text) return;

    if (!effectiveDoctorId || !patient) {
      Alert.alert('Missing info', 'Doctor or patient information is missing.');
      return;
    }

    const payload = {
      id: Date.now().toString() + Math.random(), // unique like web
      senderId: role === 'doctor' ? String(effectiveDoctorId) : String(patient),
      senderType: role,
      receiverId: role === 'doctor' ? String(patient) : String(effectiveDoctorId),
      receiverType: role === 'doctor' ? 'patient' : 'doctor',
      message: text,
      timestamp: Date.now(),
    };

    try {
      // Persist to DB
      await fetch(`${API_BASE}/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      // Realtime
      socketRef.current?.emit('sendMessage', payload);

      // Optimistic UI
      setMessages((prev) => [
        ...prev,
        {
          id: payload.id,
          senderType: payload.senderType,
          message: payload.message,
          timestamp: payload.timestamp,
        },
      ]);
      setNewMessage('');
    } catch (err) {
      console.error('Error sending message:', err);
      Alert.alert('Send failed', 'Could not send your message. Please try again.');
    }
  };

  const renderItem = ({ item }) => {
    const mine = item.senderType === role;
    const isPatient = item.senderType === 'patient';

    return (
      <View style={[styles.msgRow, mine ? styles.rowEnd : styles.rowStart]}>
        <View
          style={[
            styles.bubble,
            isPatient ? styles.bubblePatient : styles.bubbleDoctor,
          ]}
        >
          <Text style={[styles.sender, isPatient ? styles.senderOnTeal : styles.senderOnWhite]}>
            {labelFor(item.senderType)}
          </Text>
          <Text style={styles.msgText}>{item.message}</Text>
          <Text style={[styles.time, isPatient ? styles.timeOnTeal : styles.timeOnWhite]}>
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
          <Text style={styles.headerTitle}>
            Chat with {effectiveDoctorName} {effectiveDoctorId ? `( #${effectiveDoctorId} )` : ''}
          </Text>
          <View style={{ width: 64 }} />
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
          onContentSizeChange={() => {}}
        />

        {/* Composer */}
        <View style={styles.composerBar}>
          <TextInput
            value={newMessage}
            onChangeText={setNewMessage}
            placeholder={`Message as ${role === 'patient' ? `${patientName} (${patient})` : `Dr. ${effectiveDoctorName}`}…`}
            style={styles.input}
            onSubmitEditing={handleSend}
            returnKeyType="send"
          />
          <TouchableOpacity onPress={handleSend} style={styles.sendBtn} activeOpacity={0.85}>
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
  listContent: {
    padding: 12,
    gap: 8,
  },
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
  bubblePatient: { backgroundColor: '#14b8a6' },
  bubbleDoctor: { backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#e5e7eb' },
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

export default ChatScreen;
