import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, ActivityIndicator, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HealthTrackerScreen = ({ navigation }) => {
  const [date, setDate] = useState('');
  const [user, setUser] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDoctor, setSelectedDoctor] = useState('');

  // Health tracking categories
  const cards = [
    { label: 'Blood Pressure', image: require('../assets/bloodpressure.png'), route: 'BloodPressure' },
    { label: 'Blood Sugar', image: require('../assets/bloodsugar.png'), route: 'BloodSugar' },
    { label: 'Lipid Profile', image: require('../assets/lipidprofile.png'), route: 'LipidProfile' },
    { label: 'FBC', image: require('../assets/fbc.png'), route: 'FBC' },
  ];

  useEffect(() => {
    // Get current date in dd/mm/yyyy format
    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-GB');
    setDate(formattedDate);

    // Load user data from AsyncStorage
    const getUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
          setUser(JSON.parse(userData));
        }
      } catch (error) {
        console.error('Failed to load user data:', error);
      }
    };

    // Fetch doctors list from API
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://172.20.10.7:5555/api/doctor/getalldoctors');
        
        if (!response.ok) {
          throw new Error('Failed to fetch doctors');
        }
        
        const data = await response.json();
        setDoctors(data);
        
        // Check if there's a previously selected doctor
        const savedDoctorId = await AsyncStorage.getItem('selectedDoctorId');
        console.log("ssssss", savedDoctorId);
        if (savedDoctorId && Array.isArray(data)) {
          setSelectedDoctor(savedDoctorId);
        }
      } catch (error) {
        console.error('Error fetching doctors:', error);
      } finally {
        setLoading(false);
      }
    };

    getUserData();
    fetchDoctors();
  }, []);

  // Handle doctor selection
  const handleDoctorChange = async (doctorId) => {
    setSelectedDoctor(doctorId);
    
    console.log(selectedDoctor)
    try {
      await AsyncStorage.setItem('selectedDoctorId', doctorId);
      //await AsyncStorage.setItem('selectedDoctorId', JSON.stringify(response.data.doctorId));
    } catch (error) {
      console.error('Error saving selected doctor:', error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header Section */}
      <Text style={styles.title}>HELLO!</Text>
      <Text style={styles.userName}>{user ? user.name : "Guest"}</Text>
      <Text style={styles.date}>Date: {date}</Text>

      {/* Doctor Selection Section */}
      {loading ? (
        <ActivityIndicator size="large" color="#00796b" style={styles.loading} />
      ) : (
        <View style={styles.pickerContainer}>
          <Text style={styles.pickerLabel}>Select a Doctor:</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={selectedDoctor}
              onValueChange={(itemValue) => handleDoctorChange(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="-- Select a Doctor --" value="" />
              {doctors.map((doctor) => (
                <Picker.Item 
                  key={doctor.doctorNumber} 
                  label={`${doctor.name} (${doctor.specialization})`} 
                  value={doctor.doctorNumber} 
                />
              ))}
            </Picker>
          </View>
        </View>
      )}

      {/* Health Tracking Categories */}
      <View style={styles.cardContainer}>
        {cards.map((card, index) => (
          <TouchableOpacity
            key={index}
            style={styles.card}
            onPress={() => navigation.navigate(card.route)}
          >
            <Image source={card.image} style={styles.image} />
            <Text style={styles.cardLabel}>{card.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flexGrow: 1, 
    backgroundColor: '#e0f7fa', 
    alignItems: 'center', 
    paddingTop: 40,
    paddingBottom: 20
  },
  title: {
    fontSize: 24, 
    fontWeight: 'bold', 
    color: '#00796b', 
    marginBottom: 5
  },
  userName: {
    fontSize: 18,
    color: '#333',
    marginBottom: 5
  },
  date: {
    fontSize: 14, 
    color: '#004d40', 
    marginBottom: 20
  },
  loading: {
    marginVertical: 20
  },
  pickerContainer: {
    width: '90%',
    marginBottom: 20
  },
  pickerLabel: {
    fontSize: 16,
    color: '#00796b',
    marginBottom: 8
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#fff',
    ...Platform.select({
      ios: {
        paddingHorizontal: 10
      }
    })
  },
  picker: {
    width: '100%',
    height: 50
  },
  cardContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
  },
  card: {
    width: '85%',
    height: 120,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    paddingHorizontal: 20
  },
  cardLabel: { 
    fontSize: 20, 
    fontWeight: '600', 
    color: '#00796b',
    flex: 1,
    textAlign: 'right'
  },
  image: { 
    width: 70,
    height: 70,
    borderRadius: 35,
  },
});

export default HealthTrackerScreen;