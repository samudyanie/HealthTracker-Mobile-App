import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from './src/screens/HomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import SignupScreen from './src/screens/SignupScreen';
import DashboardScreen from './src/screens/Dashboard';
import HealthTrackerScreen from './src/screens/HealthTrackerScreen';
import BloodPressureScreen from './src/screens/BloodPressureScreen';
import BloodSugarScreen from './src/screens/BloodSugarScreen';
import LipidProfileScreen from './src/screens/LipidProfileScreen';
import FBCScreen from './src/screens/FBCScreen';
import MealTrackerScreen from './src/screens/MealTrackerScreen';
import BMICalculatorScreen from './src/screens/BMICalculatorScreen';  
import CalorieCounterScreen from './src/screens/CalorieCounterScreen';
import DoctorLoginScreen from './src/screens/DoctorLoginScreen';
import DoctorSignupScreen from './src/screens/DoctorSignupScreen';
const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen name="HealthTracker" component={HealthTrackerScreen} />
        <Stack.Screen name="BloodPressure" component={BloodPressureScreen} />
        <Stack.Screen name="BloodSugar" component={BloodSugarScreen} />
        <Stack.Screen name="LipidProfile" component={LipidProfileScreen} />
        <Stack.Screen name="FBC" component={FBCScreen} />
        <Stack.Screen name="MealTracker" component={MealTrackerScreen} />
        <Stack.Screen name="BMICalculator" component={BMICalculatorScreen} /> 
        <Stack.Screen name="CalorieCounter" component={CalorieCounterScreen}/>
        <Stack.Screen name="DoctorSignup" component={DoctorSignupScreen}/>
        <Stack.Screen name="DoctorLogin" component={DoctorLoginScreen}/>


      </Stack.Navigator>
    </NavigationContainer>
  );
}
