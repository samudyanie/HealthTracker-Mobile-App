import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, Image, ScrollView } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://192.168.1.20:5555/api/patient/login';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await axios.post(API_URL, { email, password });
      console.log(response.data)
      Alert.alert('Success', 'Logged in successfully!');
      await AsyncStorage.setItem('user', JSON.stringify(response.data));
      navigation.replace('Dashboard');
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'Invalid credentials');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Login</Text>
      <Image source={require('../assets/patient.png')} style={styles.image} />

      {/* Input fields for email and password */}
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {/* Login Button */}
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      {/* Signup Navigation */}
      <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
        <Text style={styles.signupText}>Don't have an account? Sign up</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flexGrow: 1, 
    justifyContent: 'center',  // Centers content vertically
    alignItems: 'center',      // Centers content horizontally
    backgroundColor: '#B4F5FE', 
    padding: 20 
  },
  title: { 
    fontSize: 30,    // Increased font size
    fontWeight: 'bold', 
    marginBottom: 50
  },
  input: { 
    width: '80%', 
    padding: 15,   // Increased padding for better spacing
    borderWidth: 1, 
    borderRadius: 5, 
    marginBottom: 25, 
    backgroundColor: '#fff' 
  },
  button: { 
    backgroundColor: '#000', 
    padding: 15, 
    borderRadius: 5 
  },
  buttonText: { 
    color: '#fff', 
    fontSize: 18   // Increased font size for the button text
  },
  signupText: { 
    marginTop: 10, 
    color: 'blue' 
  },
  image: { 
    width: 150,    // Increased image width
    height: 150,   // Increased image height
    marginBottom: 20, // Added margin to space out image from the title
    borderRadius: 75, // Circular image
  },
});
