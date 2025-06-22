import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native';

export default function MealTrackerScreen({ navigation }) {
  const today = new Date().toLocaleDateString('en-GB'); // Format date as 28/03/2025

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.greeting}>👋 Welcome Back!</Text>
      <Text style={styles.date}>Today: {today}</Text>

      <Text style={styles.sectionTitle}>Track Your Health</Text>

      <View style={styles.mealButtonsContainer}>

        {/* Smart Calorie Counter */}
        <TouchableOpacity 
          style={styles.mealButton}
          onPress={() => navigation.navigate('SmartCalorieCounter')} 
        >
          <Image 
            source={require('../assets/smart_calorie_counter.jpg')}
            style={styles.buttonImage}
          />
          <Text style={styles.buttonText}>Smart Calorie Counter</Text>
        </TouchableOpacity>

        {/* Calorie Counter */}
        <TouchableOpacity 
          style={styles.mealButton}
          onPress={() => navigation.navigate('CalorieCounter')} 
        >
          <Image 
            source={require('../assets/calorie.png')}
            style={styles.buttonImage}
          />
          <Text style={styles.buttonText}>Calorie Counter</Text>
        </TouchableOpacity>

        {/* BMI Calculator */}
        <TouchableOpacity 
          style={styles.mealButton}
          onPress={() => navigation.navigate('BMICalculator')}
        >
          <Image 
            source={require('../assets/bmi.png')}
            style={styles.buttonImage}
          />
          <Text style={styles.buttonText}>BMI Calculator</Text>
        </TouchableOpacity>

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F0FDF4',
    paddingTop: 40,
    paddingHorizontal: 20,
    paddingBottom: 60,
    alignItems: 'center',
  },
  greeting: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 6,
  },
  date: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#10B981',
    marginBottom: 20,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  mealButtonsContainer: {
    width: '100%',
    alignItems: 'center',
  },
  mealButton: {
    backgroundColor: '#10B981',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 12,
    marginBottom: 20,
    width: '90%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonImage: {
    width: 90,
    height: 90,
    marginBottom: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

