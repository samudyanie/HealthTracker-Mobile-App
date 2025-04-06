import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';

const HealthTrackerScreen = ({ navigation }) => {
  const [date, setDate] = useState('');

  useEffect(() => {
    // Get current date in dd/mm/yyyy
    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-GB');
    setDate(formattedDate);
  }, []);

  const cards = [
    { label: 'Blood Pressure', image: require('../assets/bloodpressure.png'), route: 'BloodPressure' },
    { label: 'Blood Sugar', image: require('../assets/bloodsugar.png'), route: 'BloodSugar' },
    { label: 'Lipid Profile', image: require('../assets/lipidprofile.png'), route: 'LipidProfile' },
    { label: 'FBC', image: require('../assets/fbc.png'), route: 'FBC' },
    // Add more cards as needed
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>HELLO!</Text>
      <Text style={styles.date}>Date: {date}</Text>

      <View style={styles.cardContainer}>
        {cards.map((card, index) => (
          <TouchableOpacity
            key={index}
            style={styles.card}
            onPress={() => navigation.navigate(card.route)}
          >
            <Image source={card.image} style={styles.image} />
            <Text style={styles.cardLabel}>{card.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flexGrow: 1, 
    backgroundColor: '#e0f7fa', 
    alignItems: 'center', 
    paddingTop: 40 
  },
  title: { fontSize: 24, fontWeight: 'bold', color: '#00796b', marginBottom: 20 },
  date: { fontSize: 14, color: '#004d40', marginBottom: 20 },
  cardContainer: {
    flexDirection: 'column',  // Cards will be displayed vertically
    alignItems: 'center',     // Center the cards horizontally
    gap: 10,                  // Adjust the gap between the cards
    width: '100%',            // Ensure cards take up the full width of the screen
  },
  card: {
    width: 250,               // Increased width for the card
    height: 150,              // Decreased height for the card
    backgroundColor: '#ffffff',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
    elevation: 4,
    flexDirection: 'column',  // Stack image and label vertically
    padding: 2,              // Added padding inside the card
  },
  cardLabel: { 
    fontSize: 25, 
    fontWeight: '600', 
    color: '#00796b', 
    marginTop: 1,          // Added margin to space out the label from the image
    alignSelf: 'center',     // Center the label horizontally
  },
  image: { 
    width: 100,              // Adjusted image width
    height: 100,             // Adjusted image height
    borderRadius: 40,       // Make image circular
  },
});

export default HealthTrackerScreen;
