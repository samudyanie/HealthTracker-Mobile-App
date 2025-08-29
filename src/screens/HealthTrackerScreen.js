// app/screens/HealthTrackerScreen.js
import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  Platform,
  Linking,
  Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

// -----------------------------------------------------------------------------
// 🔧 EDIT THIS: If you prefer opening your web chat (like the web app),
// set your front-end base URL here. Example: https://myclinic.example
// -----------------------------------------------------------------------------
const WEB_CHAT_BASE_URL = 'https://your-site.example'; // ← change me

const HealthTrackerScreen = ({ navigation }) => {
  const [date, setDate] = useState('');
  const [user, setUser] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState(''); // keep as string

  // Health tracking categories (update routes to match your navigator)
  const cards = [
    { label: 'Blood Pressure', image: require('../assets/bloodpressure.png'), route: 'BloodPressure' },
    { label: 'Blood Sugar', image: require('../assets/bloodsugar.png'), route: 'BloodSugar' },
    { label: 'Lipid Profile', image: require('../assets/lipidprofile.png'), route: 'LipidProfile' },
    { label: 'FBC', image: require('../assets/fbc.png'), route: 'FBC' },
  ];

  // Find the full doctor object for the selected ID (coerce both to string)
  const selectedDoctorObj = useMemo(
    () => doctors.find((d) => String(d.doctorNumber) === String(selectedDoctor)),
    [doctors, selectedDoctor]
  );

  // Initial load: date, user (if you store it), doctors, and saved selection
  useEffect(() => {
    setDate(new Date().toLocaleDateString('en-GB'));

    // If you save user info in AsyncStorage, uncomment this:
    // (Otherwise this just leaves user null, which is fine.)
    (async () => {
      try {
        const saved = await AsyncStorage.getItem('user');
        if (saved) setUser(JSON.parse(saved));
      } catch {
        // ignore
      }
    })();

    const fetchDoctors = async () => {
      try {
        setLoading(true);
        setFetchError('');
        const response = await fetch('http://192.168.1.20:5555/api/doctor/getalldoctors');
        if (!response.ok) throw new Error(`Failed to fetch doctors (${response.status})`);
        const data = await response.json();
        setDoctors(Array.isArray(data) ? data : []);
      } catch (err) {
        setFetchError(err?.message || 'Failed to fetch doctors');
      } finally {
        setLoading(false);
      }
    };

    const loadSavedSelection = async () => {
      try {
        const savedDoctorId = await AsyncStorage.getItem('selectedDoctorId');
        if (savedDoctorId) setSelectedDoctor(String(savedDoctorId));
      } catch {
        // ignore
      }
    };

    fetchDoctors();
    loadSavedSelection();
  }, []);

  const handleDoctorChange = async (doctorId) => {
    const id = String(doctorId);
    setSelectedDoctor(id);
    try {
      await AsyncStorage.setItem('selectedDoctorId', id);
    } catch {
      // ignore
    }
  };

  const handleCardPress = (route) => {
    navigation.navigate(route, {
      doctorId: selectedDoctor || null,
    });
  };

  const handleChatPress = () => {
    if (!selectedDoctor) {
      Alert.alert('Select a doctor', 'Please select a doctor first.');
      return;
    }

    // -------------------------------------------------------------------------
    // OPTION A: Native chat screen (requires you to have a 'Chat' route)
    // -------------------------------------------------------------------------
    // navigation.navigate('Chat', { doctorId: String(selectedDoctor) });

    // -------------------------------------------------------------------------
    // OPTION B: Open the same web chat route your web app uses
    // (e.g., https://your-site.example/chat?doctor=123)
    // -------------------------------------------------------------------------
   navigation.navigate('Chat', { doctorId: String(selectedDoctor), doctorName: selectedDoctorObj?.name });
  };

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>Health Tracker</Text>
            <Text style={styles.dateText}>{date}</Text>
            {!!user?.name && <Text style={styles.welcome}>Hi, {user.name}</Text>}
          </View>
          <Image
            source={require('../assets/HEALTHTRACK.png')}
            style={styles.headerImage}
            resizeMode="contain"
          />
        </View>

        {/* Doctor picker */}
        <View style={styles.pickerBlock}>
          <Text style={styles.pickerLabel}>Select your doctor</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={selectedDoctor}
              onValueChange={handleDoctorChange}
              dropdownIconColor="#00796b"
              mode="dropdown"
              style={styles.picker}
            >
              <Picker.Item label="— Choose a doctor —" value="" />
              {doctors.map((doctor) => (
                <Picker.Item
                  key={doctor.doctorNumber}
                  label={`Dr. ${doctor.name} (${doctor.specialization})`}
                  value={String(doctor.doctorNumber)}
                />
              ))}
            </Picker>
          </View>
          {loading && (
            <View style={styles.loadingRow}>
              <ActivityIndicator size="small" />
              <Text style={styles.loadingText}>Loading doctors…</Text>
            </View>
          )}
          {!!fetchError && <Text style={styles.errorText}>{fetchError}</Text>}
        </View>

        {/* Cards */}
        <View style={styles.cardsGrid}>
          {cards.map((card) => (
            <TouchableOpacity
              key={card.label}
              style={styles.card}
              activeOpacity={0.9}
              onPress={() => handleCardPress(card.route)}
            >
              <View style={styles.cardRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.cardLabel}>{card.label}</Text>
                </View>
                <Image source={card.image} style={styles.image} />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Spacer to keep FAB clear of scroll content */}
        <View style={{ height: 96 }} />
      </ScrollView>

      {/* Floating Chat Button — only if a doctor is selected */}
      {!!selectedDoctor && (
        <TouchableOpacity
          onPress={handleChatPress}
          accessibilityRole="button"
          accessibilityLabel={
            selectedDoctorObj ? `Chat with Dr. ${selectedDoctorObj.name}` : 'Open chat'
          }
          style={styles.fab}
          activeOpacity={0.88}
        >
          <Text style={styles.fabIcon}>💬</Text>
          {selectedDoctorObj && (
            <Text style={styles.fabText}>Chat with Dr. {selectedDoctorObj.name}</Text>
          )}
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#e0f7fa',
    position: 'relative',
  },
  container: {
    flexGrow: 1,
    paddingTop: 40,
    paddingBottom: 20,
    paddingHorizontal: 16,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#004d40',
  },
  dateText: {
    marginTop: 4,
    fontSize: 14,
    color: '#00695c',
  },
  welcome: {
    marginTop: 6,
    fontSize: 16,
    fontWeight: '600',
    color: '#00695c',
  },
  headerImage: {
    width: 72,
    height: 72,
    borderRadius: 12,
  },

  // Picker
  pickerBlock: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 3,
      },
      android: { elevation: 2 },
    }),
  },
  pickerLabel: {
    fontSize: 14,
    color: '#00695c',
    marginBottom: 8,
    fontWeight: '600',
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#b2dfdb',
    borderRadius: 8,
    overflow: 'hidden',
  },
  picker: {
    height: 52,
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 10,
  },
  loadingText: {
    fontSize: 13,
    color: '#004d40',
  },
  errorText: {
    marginTop: 8,
    color: '#c62828',
    fontSize: 13,
  },

  // Cards
  cardsGrid: {
    gap: 12,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.12,
        shadowRadius: 6,
      },
      android: { elevation: 3 },
    }),
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  cardLabel: {
    fontSize: 20,
    fontWeight: '700',
    color: '#00796b',
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },

  // Floating Action Button
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    borderRadius: 9999,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#00796b',
    flexDirection: 'row',
    alignItems: 'center',

    // Shadow (iOS)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    // Elevation (Android)
    elevation: 6,
  },
  fabIcon: {
    fontSize: 18,
    marginRight: 8,
    color: '#fff',
  },
  fabText: {
    color: '#fff',
    fontWeight: '800',
  },
});

export default HealthTrackerScreen;
