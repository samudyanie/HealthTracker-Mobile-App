import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Health & Meals Tracker</Text>
      <Text style={styles.subtitle}>----------------------------------------</Text>
      <Text style={styles.loginText}>Log in as a</Text>

      <View style={styles.optionsContainer}>
        {/* Doctor Login */}
        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('DoctorLogin', { role: 'doctor' })}>
          <Image source={require('../assets/doctorpatient.png')} style={styles.image} />
          <Text style={styles.roleText}>👨‍⚕️ DOCTOR</Text>
        </TouchableOpacity>

        {/* Patient Login */}
        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Login', { role: 'patient' })}>
          <Image source={require('../assets/patient.png')} style={styles.image} />
          <Text style={styles.roleText}>🤵‍ PATIENT</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center', 
    backgroundColor: '#B4F5FE', 
    padding: 20 
  },
  title: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    textAlign: 'center', 
    marginBottom: 10 
  },
  subtitle: { 
    fontSize: 16, 
    textAlign: 'center', 
    marginBottom: 20 
  },
  loginText: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    marginBottom: 15 
  },
  optionsContainer: { 
    flexDirection: 'column',  // Stack the login options vertically
    gap: 20, 
    alignItems: 'center' 
  },
  card: { 
    backgroundColor: '#000', 
    padding: 25, 
    borderRadius: 15, 
    alignItems: 'center', 
    width: 250, 
    height: 250, 
    justifyContent: 'center', 
    overflow: 'hidden'  // Ensures content does not spill outside the circular boundary
  },
  image: { 
    width: 150,    // Size of the circular image
    height: 150,   // Size of the circular image
    borderRadius: 75,  // Makes it circular
    marginBottom: 10,
    resizeMode: 'cover',  // Ensures the image covers the entire circular space without stretching
  },
  roleText: { 
    color: '#fff', 
    fontSize: 20, 
    fontWeight: 'bold' 
  },
});
