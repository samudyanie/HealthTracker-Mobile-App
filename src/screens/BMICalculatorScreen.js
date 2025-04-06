import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';  // Import MaterialIcons

export default function BMICalculatorScreen() {
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [bmi, setBmi] = useState(null);
  const [bmiMessage, setBmiMessage] = useState('');  // State for BMI message
  const [bmiIcon, setBmiIcon] = useState('');  // State for BMI icon
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      const stored = await AsyncStorage.getItem('user');
      if (stored) {
        setUserId(stored); 
      }
    };
    fetchUser();
  }, []);

  const calculateAndSaveBMI = async () => {
    if (!height || !weight) {
      Alert.alert('Validation', 'Please enter height and weight.');
      return;
    }

    const heightInMeters = parseFloat(height) / 100;
    const weightInKg = parseFloat(weight);

    if (isNaN(heightInMeters) || isNaN(weightInKg) || heightInMeters <= 0 || weightInKg <= 0) {
      Alert.alert('Validation', 'Enter valid height and weight.');
      return;
    }

    const calculatedBMI = (weightInKg / (heightInMeters * heightInMeters)).toFixed(2);
    setBmi(calculatedBMI);
    const recommendation = getBmiRecommendation(calculatedBMI);
    setBmiMessage(recommendation.message);
    setBmiIcon(recommendation.icon);  // Set the appropriate icon
    setIsLoading(true);

    try {
      const response = await fetch('http://172.20.10.7:5555/api/patient/bmi', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          height: heightInMeters * 100,
          weight: weightInKg,
          bmi: calculatedBMI,
          userId,
        }),
      });

      const result = await response.json();
      console.log('Server response:', result);

      if (response.ok) {
        Alert.alert('Success', 'BMI data saved successfully');
      } else {
        Alert.alert('Error', result.message || 'Failed to save BMI');
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  // Function to determine the BMI recommendation message and icon
  const getBmiRecommendation = (bmi) => {
    const bmiValue = parseFloat(bmi);
    if (bmiValue < 18.5) {
      return {
        message: "Underweight: You need to eat more nutritious food with adequate exercises.",
        icon: "warning",  // Warning icon for underweight
      };
    } else if (bmiValue >= 18.5 && bmiValue <= 22.9) {
      return {
        message: "Normal weight: Maintain your weight with adequate exercises.",
        icon: "check-circle",  // Success icon for normal weight
      };
    } else if (bmiValue >= 23 && bmiValue <= 24.9) {
      return {
        message: "Risk to overweight: Try to reduce weight with more exercises and correct dietary practices.",
        icon: "info",  // Info icon for risk to overweight
      };
    } else if (bmiValue >= 25 && bmiValue <= 29.9) {
      return {
        message: "Overweight: Bring it down with more exercises and correct dietary practices.",
        icon: "error",  // Error icon for overweight
      };
    } else if (bmiValue >= 30) {
      return {
        message: "Obesity: Seek advice for exercise, diet, and possibly medical consultation.",
        icon: "report-problem",  // Report problem icon for obesity
      };
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>BMI Calculator</Text>
      <Image source={require('../assets/bmi.png')} style={styles.image} />

      <TextInput
        style={styles.input}
        placeholder="Enter your height (in cm)"
        keyboardType="numeric"
        value={height}
        onChangeText={setHeight}
        maxLength={5}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter your weight (in kg)"
        keyboardType="numeric"
        value={weight}
        onChangeText={setWeight}
        maxLength={5}
      />

      <TouchableOpacity style={styles.button} onPress={calculateAndSaveBMI} disabled={isLoading}>
        {isLoading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Calculate & Save BMI</Text>
        )}
      </TouchableOpacity>

      {bmi && (
        <View style={styles.resultContainer}>
          {/* Center the BMI value */}
          <Text style={styles.resultText}>Your BMI: {bmi}</Text>
          <View style={styles.warningContainer}>
            {/* Align icon and message horizontally */}
            <Icon name={bmiIcon} size={40} color="#ff5722" />
            <Text style={styles.recommendationText}>{bmiMessage}</Text>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#B4F5FE',
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '80%',
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#00bfa5',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 8,
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  resultContainer: {
    marginTop: 30,
  },
  resultText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0097A7',
    textAlign: 'center',  // Center the BMI value
  },
  warningContainer: {
    flexDirection: 'row',  // Align icon and message horizontally
    justifyContent: 'center',  // Center the warning message and icon
    alignItems: 'center',  // Align items vertically
    marginTop: 10,
  },
  recommendationText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 10,  // Space between icon and message
    textAlign: 'left',
  },
  image: {
    width: 120,
    height: 150,
    marginBottom: 20,
  },
});
