import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native';

export default function DashboardScreen({ navigation }) {
  const handleLogout = async () => {
    await AsyncStorage.removeItem('user');
    navigation.replace('Login');
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
          Welcome to Health Tracker, your personal wellness companion...
        </Text>
      </View>

      {/* Services Section */}
      <Text style={styles.sectionHeader}>Our Main Services</Text>
      <View style={styles.cardContainer}>
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('MealTracker')} // Navigates to Meal Tracker
        >
          <Image source={require('../assets/meal-tracker.jpg')} style={styles.cardImage} />
          <Text style={styles.cardTitle}>Meal Tracker</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('HealthTracker')}
        >
          <Image source={require('../assets/health-tracker.jpg')} style={styles.cardImage} />
          <Text style={styles.cardTitle}>Health Tracker</Text>
        </TouchableOpacity>
      </View>

      {/* Doctors Section */}
      <Text style={styles.sectionHeader}>Our Doctors</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.doctorList}>
        <View style={styles.doctorCard}>
          <Image source={require('../assets/doctor1.jpg')} style={styles.doctorImage} />
          <Text style={styles.doctorName}>Dr. Kasun Ranga</Text>
          <Text style={styles.doctorSpecialty}>Orthopedic Surgeon</Text>
        </View>
        <View style={styles.doctorCard}>
          <Image source={require('../assets/doctor2.jpg')} style={styles.doctorImage} />
          <Text style={styles.doctorName}>Dr. Kalindu Senarath</Text>
          <Text style={styles.doctorSpecialty}>Cardiologist</Text>
        </View>
        <View style={styles.doctorCard}>
          <Image source={require('../assets/doctor3.jpg')} style={styles.doctorImage} />
          <Text style={styles.doctorName}>Dr. Pasindu Senarathne</Text>
          <Text style={styles.doctorSpecialty}>Pediatrician</Text>
        </View>
      </ScrollView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#E0F7FA' },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 15, backgroundColor: '#0097A7' },
  title: { fontSize: 20, color: '#fff', fontWeight: 'bold' },
  logoutButton: { backgroundColor: '#D32F2F', padding: 8, borderRadius: 5 },
  logoutText: { color: '#fff', fontWeight: 'bold' },
  section: { padding: 15, backgroundColor: '#fff', margin: 10, borderRadius: 8 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 5 },
  description: { fontSize: 14, color: '#333' },
  sectionHeader: { fontSize: 20, fontWeight: 'bold', paddingLeft: 15, marginTop: 15 },
  cardContainer: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 10 },
  card: { width: 150, backgroundColor: '#fff', padding: 10, borderRadius: 8, alignItems: 'center' },
  cardImage: { width: 100, height: 100, marginBottom: 5 },
  cardTitle: { fontSize: 16, fontWeight: 'bold' },
  doctorList: { marginTop: 10, paddingLeft: 15 },
  doctorCard: { backgroundColor: '#fff', padding: 10, borderRadius: 8, alignItems: 'center', marginRight: 10 },
  doctorImage: { width: 100, height: 100, borderRadius: 50, marginBottom: 5 },
  doctorName: { fontSize: 16, fontWeight: 'bold' },
  doctorSpecialty: { fontSize: 14, color: '#555' },
});
