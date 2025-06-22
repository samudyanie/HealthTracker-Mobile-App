import React, { useState } from 'react';

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Image,
  ScrollView,
} from 'react-native';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';

export default function DoctorSignupScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [doctorNumber, setDoctorNumber] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [specialization, setSpecialization] = useState('');

  const handleSignup = async () => {
    try {
      const response = await axios.post('http://172.20.10.7:5555/api/doctor/signup', {
        name,
        email,
        doctornumber: doctorNumber,
        mobilenumber: mobileNumber,
        password,
        specialization,
      });

      if (response.status === 201) {
        Alert.alert('Success', 'Signup Successful');
        navigation.replace('DoctorLogin');
      }
    } catch (error) {
      console.log('Signup error:', error.response?.data || error.message);
      Alert.alert('Error', error.response?.data?.error || 'Signup failed');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Doctor Sign Up</Text>
      <Image source={require('../assets/doctor.png')} style={styles.image} />

      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Doctor Number (e.g., D12345)"
        value={doctorNumber}
        onChangeText={setDoctorNumber}
      />
      <TextInput
        style={styles.input}
        placeholder="Mobile Number"
        value={mobileNumber}
        onChangeText={setMobileNumber}
        keyboardType="phone-pad"
      />

      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={specialization}
          onValueChange={(itemValue) => setSpecialization(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Select specialization" value="" />
          <Picker.Item label="Family Medicine Physician – General care for all ages" value="Family Medicine Physician" />
          <Picker.Item label="General Practitioner (GP) – Basic health evaluation" value="General Practitioner" />
          <Picker.Item label="Pediatrician – Child health (birth to teens)" value="Pediatrician" />
          <Picker.Item label="Geriatrician – Elderly care" value="Geriatrician" />
          <Picker.Item label="Internal Medicine Physician – Adult health" value="Internal Medicine Physician" />
          <Picker.Item label="Cardiologist – Heart health (BP, ECG, etc.)" value="Cardiologist" />
          <Picker.Item label="Endocrinologist – Diabetes, thyroid, hormones" value="Endocrinologist" />
          <Picker.Item label="Gynecologist – Women’s reproductive health" value="Gynecologist" />
          <Picker.Item label="Dermatologist – Skin, acne, moles" value="Dermatologist" />
          <Picker.Item label="Ophthalmologist – Vision and eye care" value="Ophthalmologist" />
          <Picker.Item label="ENT (Otolaryngologist) – Ear, nose, throat" value="ENT" />
          <Picker.Item label="Dentist – Oral checkups and hygiene" value="Dentist" />
          <Picker.Item label="Nutritionist/Dietitian – Diet and healthy eating" value="Nutritionist" />
          <Picker.Item label="Psychiatrist/Psychologist – Mental health and stress" value="Psychiatrist" />
        </Picker>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleSignup}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('DoctorLogin')}>
        <Text style={styles.switchText}>Already have an account? Log in</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    backgroundColor: '#B4F5FE',
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#1E293B',
  },
  image: {
    width: 150,
    height: 200,
    marginBottom: 25,
  },
  input: {
    width: '100%',
    padding: 12,
    marginVertical: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderColor: '#94A3B8',
    borderWidth: 1,
  },
  pickerWrapper: {
    width: '100%',
    marginVertical: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderColor: '#94A3B8',
    borderWidth: 1,
  },
  picker: {
    height: 50,
    width: '100%',
  },
  button: {
    backgroundColor: '#1E3A8A',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    marginTop: 20,
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  switchText: {
    marginTop: 15,
    color: '#1E293B',
    fontWeight: '500',
  },
});
