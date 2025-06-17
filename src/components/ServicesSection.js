import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, Dimensions, SafeAreaView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

// Replace these with actual image imports for React Native
// You'll need to add these images to your assets folder
const img1 = require("../assets/img/meal-tracker.jpg");
const img2 = require("../assets/img/HEALTHTRACK.png");

const ServicesSection = () => {
  const navigation = useNavigation();
  const [user, setUser] = useState(null);
  const [services, setServices] = useState([]);
  const windowWidth = Dimensions.get("window").width;

  useEffect(() => {
    const getUserData = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user");
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);

          // Conditionally set services
          if (parsedUser.doctornumber) {
            setServices([
              {
                title: "View Patient Reports",
                description: "Access your patients' health and meal reports easily.",
                button: "View",
                img: img2,
              },
            ]);
          } else {
            setServices([
              {
                title: "Meal Tracker",
                description:
                  "Learn your diet and track meal information using our application to live a healthier life.",
                button: "Next",
                img: img1,
              },
              {
                title: "Health Tracker",
                description:
                  "Get in touch with your family doctor for consultations and medical advice anytime.",
                button: "Next",
                img: img2,
              },
            ]);
          }
        }
      } catch (error) {
        console.error("Error retrieving user data:", error);
      }
    };

    getUserData();
  }, []);

  const handleNavigate = (index) => {
    if (user?.doctornumber) {
      navigation.navigate("Reports"); // your route for doctors
    } else {
      if (index === 0) {
        navigation.navigate("MealTracker");
      } else if (index === 1) {
        navigation.navigate("HealthTracker");
      } else {
        // Use Alert for showing alerts in React Native
        alert("Feature coming soon!");
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>
            Our <Text style={styles.highlightText}>Main Services</Text> Categories
          </Text>
        </View>
        
        <View style={styles.servicesContainer}>
          {services.map((service, index) => (
            <View
              key={index}
              style={[styles.serviceCard, { width: windowWidth > 768 ? windowWidth / 2 - 32 : windowWidth - 32 }]}
            >
              <Image
                source={service.img}
                style={styles.serviceImage}
                resizeMode="contain"
              />
              <Text style={styles.serviceTitle}>{service.title}</Text>
              <Text style={styles.serviceDescription}>{service.description}</Text>
              <TouchableOpacity
                style={styles.serviceButton}
                onPress={() => handleNavigate(index)}
              >
                <Text style={styles.buttonText}>{service.button}</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5", // neutralBackground equivalent
  },
  scrollContent: {
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333", // darkColor equivalent
    textAlign: "center",
  },
  highlightText: {
    color: "#14b8a6", // teal-500 equivalent
  },
  servicesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 16,
  },
  serviceCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 16,
  },
  serviceImage: {
    height: 192,
    width: "100%",
    marginBottom: 16,
  },
  serviceTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
    textAlign: "center",
  },
  serviceDescription: {
    color: "#6b7280", // gray-500 equivalent
    marginBottom: 16,
    textAlign: "center",
  },
  serviceButton: {
    backgroundColor: "#14b8a6", // teal-500 equivalent
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "500",
  },
});

export default ServicesSection;