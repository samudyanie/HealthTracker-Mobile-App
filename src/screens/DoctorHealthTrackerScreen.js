import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Image, 
  StyleSheet, 
  SafeAreaView, 
  StatusBar,
  ScrollView,
  Dimensions
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// In React Native, you would need to import images differently
// You can use require for local images
const img1 = require('../assets/bloodpressure.png');
const img2 = require('../assets/bloodsugar.png');
const img3 = require('../assets/lipidprofile.png');
const img4 = require('../assets/fbc.png');

const DoctorHealthTrackerScreen = () => {
  const navigation = useNavigation();
  const [user, setUser] = useState(null);
  
  // Format the current date (React Native doesn't have toLocaleDateString)
  const getCurrentDate = () => {
    const date = new Date();
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const currentDate = getCurrentDate();

  // Categories for the dashboard with updated images
  const categories = [
    { name: "Blood Pressure", image: img1, path: "View" },
    { name: "Blood Sugar", image: img2, path: "View" },
    { name: "Lipid Profile", image: img3, path: "View" },
    { name: "FBC", image: img4, path: "View" },
  ];

  // Set user info on component mount
  useEffect(() => {
    // For React Native, we'll use AsyncStorage instead of sessionStorage
    const getUserData = async () => {
      try {
        // You would need to import AsyncStorage from '@react-native-async-storage/async-storage'
        // and replace this with actual AsyncStorage implementation
        const storedUser = await AsyncStorage.getItem('doctor');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.log('Error retrieving user data:', error);
      }
    };

    getUserData();
  }, []);

  const handleCategoryPress = (category) => {
    // Navigate to the report view with the selected category
    navigation.navigate(category.path, { reportType: category.name });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#b2f5ea" barStyle="dark-content" />
      <View style={styles.headerSection}>
        <Text style={styles.headerTitle}>HELLO!</Text>
        <Text style={styles.headerName}>Dr. {user ? user.name : "Guest"}</Text>
        <Text style={styles.headerDate}>Date: {currentDate}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.categoriesContainer}>
        {categories.map((category, index) => (
          <TouchableOpacity
            key={index}
            style={styles.categoryCard}
            onPress={() => handleCategoryPress(category)}
          >
            <Image 
              source={category.image}
              style={styles.categoryImage}
              resizeMode="cover"
            />
            <Text style={styles.categoryName}>{category.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#b2f5ea',
  },
  headerSection: {
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '600',
    color: '#0d6e6a',
    marginBottom: 8,
  },
  headerName: {
    fontSize: 18,
    color: '#333',
    marginBottom: 4,
  },
  headerDate: {
    fontSize: 14,
    color: '#666',
  },
  categoriesContainer: {
    paddingHorizontal: 16,
    paddingBottom: 30,
  },
  categoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  categoryName: {
    fontSize: 18,
    fontWeight: '500',
    color: '#0d9488',
  },
});

export default DoctorHealthTrackerScreen;