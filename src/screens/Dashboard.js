import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Image, 
  ScrollView, 
  ActivityIndicator,
  Alert 
} from 'react-native';

export default function DashboardScreen({ navigation }) {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('user');
      navigation.replace('Login');
    } catch (error) {
      console.error('Error during logout:', error);
      Alert.alert('Error', 'Failed to logout properly');
    }
  };

  // Safe image import with fallback
  const getImageSource = (imageName) => {
    try {
      switch (imageName) {
        case 'doctor1':
          return require('../assets/doctor1.jpg');
        case 'doctor2':
          return require('../assets/doctor2.jpg');
        case 'meal-tracker':
          return require('../assets/meal-tracker.jpg');
        case 'health-tracker':
          return require('../assets/health-tracker.jpg');
        default:
          // Return a default placeholder or null
          return null;
      }
    } catch (error) {
      console.warn(`Image ${imageName} not found:`, error);
      return null;
    }
  };

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://192.168.1.20:5555/api/doctor/getalldoctors'); 

        if (!response.ok) {
          throw new Error(`Failed to fetch doctors: ${response.status}`);
        }

        const data = await response.json();

        // Safe image mapping with fallback
        const doctorImages = [
          getImageSource('doctor12'),
          getImageSource('doctor12')
        ].filter(img => img !== null); // Remove null images

        const doctorsWithImages = data.map((doctor, index) => ({
          ...doctor,
          img: doctorImages.length > 0 ? doctorImages[index % doctorImages.length] : null,
        }));

        setDoctors(doctorsWithImages);
      } catch (error) {
        console.error('Error fetching doctors:', error);
        Alert.alert('Error', 'Failed to load doctors. Please check your connection.');
        setDoctors([]); // Set empty array on error
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const renderDoctorCard = (doctor, index) => (
    <View style={styles.doctorCard} key={`doctor-${index}-${doctor.id || doctor.name}`}>
      {doctor.img ? (
        <Image source={doctor.img} style={styles.doctorImage} />
      ) : (
        <View style={[styles.doctorImage, styles.placeholderImage]}>
          <Text style={styles.placeholderText}>Dr</Text>
        </View>
      )}
      <Text style={styles.doctorName}>Dr. {doctor.name || 'Unknown'}</Text>
      <Text style={styles.doctorSpecialty}>
        {doctor.specialization || 'General Practice'}
      </Text>
    </View>
  );

  const renderServiceCard = (title, imageName, navigationTarget) => {
    const imageSource = getImageSource(imageName);
    
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate(navigationTarget)}
      >
        {imageSource ? (
          <Image source={imageSource} style={styles.cardImage} />
        ) : (
          <View style={[styles.cardImage, styles.placeholderCardImage]}>
            <Text style={styles.placeholderCardText}>{title.charAt(0)}</Text>
          </View>
        )}
        <Text style={styles.cardTitle}>{title}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Health & Meal Tracker</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* About Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About Health Tracker</Text>
        <Text style={styles.description}>
          Welcome to Health Tracker, your personal wellness companion. Track your meals, 
          monitor your health metrics, and connect with healthcare professionals all in one place.
          Start your journey towards better health today!
        </Text>
      </View>

      {/* Services Section */}
      <Text style={styles.sectionHeader}>Our Main Services</Text>
      <View style={styles.cardContainer}>
        {renderServiceCard('Meal Tracker', 'meal-tracker', 'MealTracker')}
        {renderServiceCard('Health Tracker', 'health-tracker', 'HealthTracker')}
      </View>

      {/* Doctors Section */}
      <Text style={styles.sectionHeader}>Our Doctors</Text>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0097A7" />
          <Text style={styles.loadingText}>Loading doctors...</Text>
        </View>
      ) : doctors.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No doctors available at the moment</Text>
        </View>
      ) : (
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.doctorList}
          contentContainerStyle={styles.doctorListContent}
        >
          {doctors.map(renderDoctorCard)}
        </ScrollView>
      )}

      {/* Bottom spacing */}
      <View style={styles.bottomSpacing} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#E0F7FA' 
  },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    padding: 15, 
    backgroundColor: '#0097A7',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  title: { 
    fontSize: 20, 
    color: '#fff', 
    fontWeight: 'bold',
    flex: 1
  },
  logoutButton: { 
    backgroundColor: '#D32F2F', 
    paddingHorizontal: 12,
    paddingVertical: 8, 
    borderRadius: 6,
    elevation: 2
  },
  logoutText: { 
    color: '#fff', 
    fontWeight: 'bold',
    fontSize: 14
  },
  section: { 
    padding: 15, 
    backgroundColor: '#fff', 
    margin: 15, 
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  sectionTitle: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    marginBottom: 8,
    color: '#0097A7'
  },
  description: { 
    fontSize: 14, 
    color: '#333',
    lineHeight: 20
  },
  sectionHeader: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    paddingLeft: 15, 
    marginTop: 20,
    marginBottom: 10,
    color: '#0097A7'
  },
  cardContainer: { 
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    marginTop: 10,
    paddingHorizontal: 15
  },
  card: { 
    width: 150, 
    backgroundColor: '#fff', 
    padding: 15, 
    borderRadius: 8, 
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  cardImage: { 
    width: 80, 
    height: 80, 
    marginBottom: 8,
    borderRadius: 8
  },
  placeholderCardImage: {
    backgroundColor: '#0097A7',
    justifyContent: 'center',
    alignItems: 'center'
  },
  placeholderCardText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold'
  },
  cardTitle: { 
    fontSize: 16, 
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333'
  },
  doctorList: { 
    marginTop: 10, 
    paddingLeft: 15 
  },
  doctorListContent: {
    paddingRight: 15
  },
  doctorCard: { 
    backgroundColor: '#fff', 
    padding: 12, 
    borderRadius: 8, 
    alignItems: 'center', 
    marginRight: 12,
    minWidth: 120,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  doctorImage: { 
    width: 80, 
    height: 80, 
    borderRadius: 40, 
    marginBottom: 8 
  },
  placeholderImage: {
    backgroundColor: '#0097A7',
    justifyContent: 'center',
    alignItems: 'center'
  },
  placeholderText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold'
  },
  doctorName: { 
    fontSize: 14, 
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
    marginBottom: 2
  },
  doctorSpecialty: { 
    fontSize: 12, 
    color: '#555',
    textAlign: 'center'
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 30
  },
  loadingText: {
    marginTop: 10,
    color: '#0097A7',
    fontSize: 14
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 30
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 16
  },
  bottomSpacing: {
    height: 20
  }
});