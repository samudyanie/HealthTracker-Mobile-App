import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, Image, ScrollView } from 'react-native';
import axios from 'axios';

export default function SignupScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = async () => {
    try {
      const response = await axios.post('http://172.20.10.7:5555/api/patient/signup', {
        name,
        email,
        mobilenumber: mobileNumber,
        password,
      });

      if (response.status === 200) {
        Alert.alert('Success', 'Signup Successful');
        navigation.navigate('Login'); // Navigate to Login after signup
      }
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
     
      <Text style={styles.title}>Sign Up</Text>
      <Image source={require('../assets/patient.png')} style={styles.image} />


      {/* Input fields */}
      <TextInput style={styles.input} placeholder="Name" value={name} onChangeText={setName} />
      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
      <TextInput style={styles.input} placeholder="Mobile Number" value={mobileNumber} onChangeText={setMobileNumber} keyboardType="phone-pad" />
      <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />

      {/* Signup Button */}
      <TouchableOpacity style={styles.button} onPress={handleSignup}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

      {/* Navigate to Login screen */}
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.switchText}>Already have an account? Log in</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flexGrow: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: '#B4F5FE', 
    padding: 20
  },
  title: { 
    fontSize: 30, 
    fontWeight: 'bold', 
    marginBottom: 50, 
    textAlign: 'center' 
  },
  input: { 
    width: '80%', 
    padding: 15, 
    borderWidth: 1, 
    borderRadius: 5, 
    marginBottom: 15, 
    backgroundColor: '#fff' 
  },
  button: { 
    backgroundColor: '#000', 
    padding: 15, 
    borderRadius: 5 
  },
  buttonText: { 
    color: '#fff', 
    fontSize: 18 
  },
  switchText: { 
    marginTop: 10, 
    color: 'blue' 
  },
  image: { 
    width: 150, 
    height: 150, 
    marginBottom: 20, 
    borderRadius: 75 
  },
});
