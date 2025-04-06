import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from "react-native";
import { useNavigation } from '@react-navigation/native'; // Using useNavigation for navigation in React Native

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [activeSlide, setActiveSlide] = useState(0);
  const navigation = useNavigation();

  const slides = [
    {
      id: 1,
      name: "Selina Destin",
      role: "Web Development Agency",
      quote:
        "Untitled has become essential in starting every new project, we can't imagine working without it.",
    },
    {
      id: 2,
      name: "Kristin Watson",
      role: "Medical Assistant",
      quote:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna.",
    },
    {
      id: 3,
      name: "Darrell Steward",
      role: "Marketing Coordinator",
      quote:
        "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    },
  ];

  const handleSlideChange = (index) => {
    setActiveSlide(index);
  };

  const handleLogin = async () => {
    try {
      const response = await fetch("http://localhost:5555/api/doctor/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (response.ok) {
        console.log("Login successful:", result);
        // Store token and user info in AsyncStorage or state
        navigation.navigate("DocDashboard"); // Navigate to the dashboard on successful login
      } else {
        console.error("Error:", result.error);
        Alert.alert("Login Failed", result.error);
      }
    } catch (error) {
      console.error("Error:", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      {/* Slider Section */}
      <View style={styles.sliderContainer}>
        <Image
          source={{ uri: "your-image-url-here" }} 
          style={styles.sliderImage}
        />
        <View style={styles.overlay}>
          <Text style={styles.sliderText}>{slides[activeSlide]?.quote}</Text>
          <View style={styles.slideControls}>
            {slides.map((_, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleSlideChange(index)}
                style={[styles.dot, activeSlide === index && styles.activeDot]}
              />
            ))}
          </View>
        </View>
      </View>

      {/* Login Form Section */}
      <View style={styles.formContainer}>
        <Text style={styles.title}>Sign in to your account</Text>
        <Text style={styles.subtitle}>Greetings on your return! We kindly request you to enter your details.</Text>

        <TextInput
          style={styles.input}
          placeholder="example@gmail.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Enter your password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        <Text style={styles.signupText}>
          Don't have an account? 
          <TouchableOpacity onPress={() => navigation.navigate("Register")}>
            <Text style={styles.signupLink}> Sign up</Text>
          </TouchableOpacity>
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f1f1f1",
  },
  sliderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
  },
  sliderImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
  },
  overlay: {
    position: "absolute",
    bottom: 10,
    left: 10,
    right: 10,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 10,
    borderRadius: 10,
  },
  sliderText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  slideControls: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    margin: 3,
    backgroundColor: "#fff",
  },
  activeDot: {
    backgroundColor: "#007bff",
  },
  formContainer: {
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    margin: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#777",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingLeft: 10,
    fontSize: 16,
  },
  loginButton: {
    backgroundColor: "#007bff",
    paddingVertical: 15,
    borderRadius: 25,
    marginBottom: 15,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  signupText: {
    fontSize: 14,
    color: "#333",
    textAlign: "center",
  },
  signupLink: {
    color: "#007bff",
    fontWeight: "bold",
  },
});

export default Login;
