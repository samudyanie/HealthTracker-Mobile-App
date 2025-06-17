// MealTrackerScreen.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

export default function MealTrackerScreen({ navigation }) {
  const today = new Date().toLocaleDateString('en-GB'); // Format date as 28/03/2025

  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>Hello!</Text>
      <Text style={styles.date}>Date: {today}</Text>

      <View style={styles.mealButtonsContainer}>
        
        {/* Button for Calorie Counter */}
        <TouchableOpacity 
          style={styles.mealButton}
          onPress={() => navigation.navigate('CalorieCounter')} 
        >
          <Image 
            source={require('../assets/calorie.png')} // Calorie image
            style={styles.buttonImage}
          />
          <Text style={styles.buttonText}>Calorie Counter</Text>
        </TouchableOpacity>

        {/* Button for BMI Calculator */}
        <TouchableOpacity 
          style={styles.mealButton}
          onPress={() => navigation.navigate('BMICalculator')} // Navigate to BMI Calculator screen
        >
          <Image 
            source={require('../assets/bmi.png')} // BMI image
            style={styles.buttonImage}
          />
          <Text style={styles.buttonText}>BMI Calculator</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#B4F5FE',
    padding: 20,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  date: {
    fontSize: 18,
    color: '#666',
    marginBottom: 30,
  },
  mealButtonsContainer: {
    width: '100%',
    alignItems: 'center',
  },
  mealButton: {
    backgroundColor: '#00bfa5',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 8,
    marginBottom: 15,
    width: '80%',
    alignItems: 'center',
  },
  buttonImage: {
    width: 100,  
    height: 100, 
    marginBottom: 10, 
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
