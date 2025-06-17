import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BMIScreen = () => {
  const [userId, setUserId] = useState(null);
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [heightUnit, setHeightUnit] = useState('cm'); // 'cm' or 'ft'
  const [weightUnit, setWeightUnit] = useState('kg'); // 'kg' or 'lbs'
  const [bmiResult, setBmiResult] = useState(null);
  const [bmiCategory, setBmiCategory] = useState('');
  const [categoryMessage, setCategoryMessage] = useState('');

  // Fetch userId from AsyncStorage
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userJsonString = await AsyncStorage.getItem('user');
        if (userJsonString) {
          const userJson = JSON.parse(userJsonString);
          const patient = userJson?.patient || userJson?.user || userJson;
          const patientId = patient?._id || patient?.id;

          if (patientId) {
            setUserId(patientId);
          } else {
            Alert.alert('Error', 'User ID not found in stored data');
          }
        } else {
          Alert.alert('Error', 'User not logged in');
        }
      } catch (error) {
        console.error('Error reading user:', error);
        Alert.alert('Error', 'Something went wrong loading user data');
      }
    };

    fetchUser();
  }, []);

  // Convert feet to cm (1 foot = 30.48 cm)
  const feetToCm = (feet) => {
    return feet * 30.48;
  };

  // Convert lbs to kg (1 lb = 0.453592 kg)
  const lbsToKg = (lbs) => {
    return lbs * 0.453592;
  };

  // BMI calculation: weight (kg) / height (m²)
  const calculateBmi = (heightCm, weightKg) => {
    const heightM = heightCm / 100;
    if (heightM <= 0 || weightKg <= 0) return null;
    return parseFloat((weightKg / (heightM * heightM)).toFixed(2));
  };

  // Get BMI category and message
  const getBmiCategory = (bmi) => {
    if (bmi < 18.5) {
      return {
        category: 'Underweight',
        message: 'You may need to gain weight. Consider consulting with a healthcare provider for a proper nutrition plan.',
        color: '#60A5FA',
        gradient: ['#3B82F6', '#60A5FA']
      };
    } else if (bmi >= 18.5 && bmi < 25) {
      return {
        category: 'Normal Weight',
        message: 'Great! You have a healthy weight. Maintain your current lifestyle with regular exercise and balanced diet.',
        color: '#34D399',
        gradient: ['#10B981', '#34D399']
      };
    } else if (bmi >= 25 && bmi < 30) {
      return {
        category: 'Overweight',
        message: 'You may benefit from losing some weight. Consider increasing physical activity and reviewing your diet.',
        color: '#FBBF24',
        gradient: ['#F59E0B', '#FBBF24']
      };
    } else {
      return {
        category: 'Obese',
        message: 'It\'s recommended to consult with a healthcare provider for a weight management plan to improve your health.',
        color: '#F87171',
        gradient: ['#EF4444', '#F87171']
      };
    }
  };

  // Real-time BMI calculation when inputs change
  useEffect(() => {
    if (height && weight) {
      const parsedHeight = parseFloat(height);
      const parsedWeight = parseFloat(weight);
      
      if (parsedHeight > 0 && parsedWeight > 0) {
        // Convert to standard units (cm and kg)
        const heightInCm = heightUnit === 'ft' ? feetToCm(parsedHeight) : parsedHeight;
        const weightInKg = weightUnit === 'lbs' ? lbsToKg(parsedWeight) : parsedWeight;
        
        const bmi = calculateBmi(heightInCm, weightInKg);
        if (bmi) {
          setBmiResult(bmi);
          const categoryInfo = getBmiCategory(bmi);
          setBmiCategory(categoryInfo.category);
          setCategoryMessage(categoryInfo.message);
        }
      }
    } else {
      setBmiResult(null);
      setBmiCategory('');
      setCategoryMessage('');
    }
  }, [height, weight, heightUnit, weightUnit]);

  const handleSubmit = async () => {
    if (!height || !weight) {
      Alert.alert('Validation Error', 'Please enter both height and weight.');
      return;
    }

    if (!bmiResult) {
      Alert.alert('Validation Error', 'Invalid height or weight values.');
      return;
    }

    if (!userId) {
      Alert.alert('Error', 'User ID not found. Please log in again.');
      return;
    }

    try {
      const parsedHeight = parseFloat(height);
      const parsedWeight = parseFloat(weight);
      
      // Convert to cm and kg for backend storage
      const heightInCm = heightUnit === 'ft' ? feetToCm(parsedHeight) : parsedHeight;
      const weightInKg = weightUnit === 'lbs' ? lbsToKg(parsedWeight) : parsedWeight;

      const response = await fetch('http://172.20.10.7:5555/api/patient/bmi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          height: heightInCm, // Always store in cm
          weight: weightInKg,  // Always store in kg
          bmi: bmiResult,
          category: bmiCategory,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        Alert.alert('Success', 'BMI data saved successfully!');
        setHeight('');
        setWeight('');
        setBmiResult(null);
        setBmiCategory('');
        setCategoryMessage('');
      } else {
        console.error('Server error:', result);
        Alert.alert('Error', result.message || 'Failed to save BMI');
      }
    } catch (error) {
      console.error('Submit error:', error);
      Alert.alert('Error', 'Could not connect to server');
    }
  };

  // BMI Gauge Component
  const BMIGauge = ({ bmi, category }) => {
    // Calculate needle position (0-100% across the gauge)
    const getNeedlePosition = (bmiValue) => {
      if (bmiValue <= 15) return 0;
      if (bmiValue >= 40) return 100;
      
      // Map BMI range 15-40 to 0-100%
      return ((bmiValue - 15) / 25) * 100;
    };

    const needlePosition = getNeedlePosition(bmi);
    const categoryInfo = getBmiCategory(bmi);

    return (
      <View style={styles.gaugeContainer}>
        <Text style={styles.gaugeTitle}>BMI Assessment</Text>
        
        {/* Gauge Background */}
        <View style={styles.gaugeTrack}>
          {/* Color segments */}
          <View style={[styles.gaugeSegment, styles.underweightSegment]} />
          <View style={[styles.gaugeSegment, styles.normalSegment]} />
          <View style={[styles.gaugeSegment, styles.overweightSegment]} />
          <View style={[styles.gaugeSegment, styles.obeseSegment]} />
          
          {/* Needle */}
          <View 
            style={[
              styles.gaugeNeedle, 
              { left: `${Math.min(Math.max(needlePosition, 2), 98)}%` }
            ]} 
          />
        </View>
        
        {/* Scale labels */}
        <View style={styles.scaleLabels}>
          <Text style={styles.scaleLabel}>15</Text>
          <Text style={styles.scaleLabel}>18.5</Text>
          <Text style={styles.scaleLabel}>25</Text>
          <Text style={styles.scaleLabel}>30</Text>
          <Text style={styles.scaleLabel}>40</Text>
        </View>
        
        {/* BMI Value Display */}
        <View style={styles.bmiDisplay}>
          <Text style={styles.bmiValue}>{bmi}</Text>
          <View style={[styles.categoryBadge, { backgroundColor: categoryInfo.color }]}>
            <Text style={styles.categoryText}>{category}</Text>
          </View>
        </View>
        
        {/* Category Message */}
        <View style={styles.messageContainer}>
          <Text style={styles.bmiMessage}>{categoryInfo.message}</Text>
        </View>
      </View>
    );
  };

  const UnitSelector = ({ value, onSelect, options, label }) => (
    <View style={styles.unitSelector}>
      <Text style={styles.unitLabel}>{label}:</Text>
      <View style={styles.unitButtons}>
        {options.map((option) => (
          <TouchableOpacity
            key={option}
            style={[
              styles.unitButton,
              value === option && styles.unitButtonActive
            ]}
            onPress={() => onSelect(option)}
          >
            <Text style={[
              styles.unitButtonText,
              value === option && styles.unitButtonTextActive
            ]}>
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.title}>BMI Calculator</Text>
        <Text style={styles.subtitle}>Track your Body Mass Index with precision</Text>
      </View>

      {/* Input Cards */}
      <View style={styles.inputCard}>
        <View style={styles.inputSection}>
          <UnitSelector
            value={heightUnit}
            onSelect={setHeightUnit}
            options={['cm', 'ft']}
            label="Height Unit"
          />
          <Text style={styles.inputLabel}>
            Height ({heightUnit}):
          </Text>
          <TextInput
            keyboardType="numeric"
            value={height}
            onChangeText={setHeight}
            placeholder={`Enter height in ${heightUnit}`}
            placeholderTextColor="#9CA3AF"
            style={styles.textInput}
          />
        </View>
      </View>

      <View style={styles.inputCard}>
        <View style={styles.inputSection}>
          <UnitSelector
            value={weightUnit}
            onSelect={setWeightUnit}
            options={['kg', 'lbs']}
            label="Weight Unit"
          />
          <Text style={styles.inputLabel}>
            Weight ({weightUnit}):
          </Text>
          <TextInput
            keyboardType="numeric"
            value={weight}
            onChangeText={setWeight}
            placeholder={`Enter weight in ${weightUnit}`}
            placeholderTextColor="#9CA3AF"
            style={styles.textInput}
          />
        </View>
      </View>

      {/* BMI Gauge */}
      {bmiResult && (
        <BMIGauge bmi={bmiResult} category={bmiCategory} />
      )}

      {/* Submit Button */}
      <TouchableOpacity
        onPress={handleSubmit}
        style={[
          styles.submitButton,
          (!height || !weight) && styles.submitButtonDisabled
        ]}
        disabled={!height || !weight}
      >
        <Text style={styles.submitButtonText}>💾 Save BMI Record</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#0F172A', // Dark slate background
    minHeight: '100%',
  },
  header: {
    marginBottom: 32,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#F8FAFC',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: '#94A3B8',
    textAlign: 'center',
    fontWeight: '500',
  },
  inputCard: {
    backgroundColor: '#1E293B',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#334155',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  inputSection: {
    marginBottom: 0,
  },
  unitSelector: {
    marginBottom: 16,
  },
  unitLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F1F5F9',
    marginBottom: 12,
  },
  unitButtons: {
    flexDirection: 'row',
    backgroundColor: '#334155',
    borderRadius: 12,
    padding: 4,
  },
  unitButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  unitButtonActive: {
    backgroundColor: '#0EA5E9',
    shadowColor: '#0EA5E9',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 4,
  },
  unitButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#94A3B8',
  },
  unitButtonTextActive: {
    color: '#FFFFFF',
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F1F5F9',
    marginBottom: 12,
  },
  textInput: {
    borderWidth: 2,
    borderColor: '#475569',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: '#0F172A',
    color: '#F8FAFC',
    fontWeight: '500',
  },
  gaugeContainer: {
    backgroundColor: '#1E293B',
    borderRadius: 24,
    padding: 28,
    marginVertical: 24,
    borderWidth: 1,
    borderColor: '#334155',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  gaugeTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#F8FAFC',
    textAlign: 'center',
    marginBottom: 24,
    letterSpacing: -0.3,
  },
  gaugeTrack: {
    height: 24,
    borderRadius: 12,
    flexDirection: 'row',
    position: 'relative',
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  gaugeSegment: {
    height: '100%',
  },
  underweightSegment: {
    backgroundColor: '#60A5FA',
    flex: 14,
  },
  normalSegment: {
    backgroundColor: '#34D399',
    flex: 26,
  },
  overweightSegment: {
    backgroundColor: '#FBBF24',
    flex: 20,
  },
  obeseSegment: {
    backgroundColor: '#F87171',
    flex: 40,
  },
  gaugeNeedle: {
    position: 'absolute',
    top: -6,
    width: 6,
    height: 36,
    backgroundColor: '#F8FAFC',
    borderRadius: 3,
    transform: [{ translateX: -3 }],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  scaleLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    marginBottom: 24,
  },
  scaleLabel: {
    fontSize: 13,
    color: '#94A3B8',
    fontWeight: '600',
  },
  bmiDisplay: {
    alignItems: 'center',
    marginBottom: 20,
  },
  bmiValue: {
    fontSize: 48,
    fontWeight: '900',
    color: '#F8FAFC',
    marginBottom: 12,
    letterSpacing: -1,
  },
  categoryBadge: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  categoryText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  messageContainer: {
    backgroundColor: '#334155',
    borderRadius: 16,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#0EA5E9',
  },
  bmiMessage: {
    fontSize: 15,
    color: '#CBD5E1',
    textAlign: 'center',
    lineHeight: 22,
    fontWeight: '500',
  },
  submitButton: {
    backgroundColor: '#0EA5E9',
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 16,
    shadowColor: '#0EA5E9',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
    borderWidth: 1,
    borderColor: '#0284C7',
  },
  submitButtonDisabled: {
    backgroundColor: '#475569',
    shadowOpacity: 0,
    elevation: 0,
    borderColor: '#64748B',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});

export default BMIScreen;