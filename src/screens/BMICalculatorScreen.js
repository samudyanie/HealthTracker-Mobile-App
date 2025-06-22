import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BMICalculator = () => {
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [heightUnit, setHeightUnit] = useState("cm");
  const [weightUnit, setWeightUnit] = useState("kg");
  const [bmi, setBmi] = useState(null);
  const [loading, setLoading] = useState(false);

  // Unit conversion functions
  const convertHeight = (value, unit) => {
    if (unit === "ft") {
      return parseFloat(value) * 30.48;
    }
    return parseFloat(value);
  };

  const convertWeight = (value, unit) => {
    if (unit === "lbs") {
      return parseFloat(value) * 0.453592;
    }
    return parseFloat(value);
  };

  const calculateBMI = () => {
    const heightInCm = convertHeight(height, heightUnit);
    const weightInKg = convertWeight(weight, weightUnit);

    const h = heightInCm / 100;
    const w = weightInKg;

    if (!h || !w || h <= 0 || w <= 0) {
      Alert.alert("Invalid Input", "Please enter valid height and weight.");
      return;
    }

    const bmiValue = (w / (h * h)).toFixed(2);
    setBmi(bmiValue);
  };

  const submitBMI = async () => {
    if (!bmi) {
      Alert.alert("Calculate First", "Please calculate BMI before submitting.");
      return;
    }

    setLoading(true);

    try {
      // Fetch user data from AsyncStorage
      const userJson = await AsyncStorage.getItem("user");
      if (!userJson) {
        Alert.alert("User Not Found", "Please log in before submitting BMI data.");
        setLoading(false);
        return;
      }

      const userObject = JSON.parse(userJson);
      const userId = userObject;
      console.log(userObject)
      if (!userId) {
        Alert.alert("Invalid User", "User ID not found.");
        setLoading(false);
        return;
      }

      // Submit BMI data to backend
      await axios.post("http://192.168.1.20:5555/api/patient/bmi", {
        height: convertHeight(height, heightUnit),
        weight: convertWeight(weight, weightUnit),
        bmi: parseFloat(bmi),
        userId: userId,
      });

      Alert.alert("Success", "BMI data saved successfully!");
      setHeight("");
      setWeight("");
      setBmi(null);
    } catch (error) {
      console.error("Error submitting BMI data:", error);
      Alert.alert("Error", "Failed to submit BMI data.");
    } finally {
      setLoading(false);
    }
  };

  const getBMICategory = (bmiValue) => {
    if (bmiValue < 18.5) return "Underweight";
    if (bmiValue < 25) return "Normal";
    if (bmiValue < 30) return "Overweight";
    return "Obese";
  };

  const getBMIColor = (bmiValue) => {
    if (bmiValue < 18.5) return styles.underweight;
    if (bmiValue < 25) return styles.normal;
    if (bmiValue < 30) return styles.overweight;
    return styles.obese;
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>BMI Calculator</Text>
      <Text style={styles.subtitle}>Professional Health Assessment Tool</Text>
      <Text style={styles.date}>
        {new Date().toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </Text>

      {/* Height Input */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>📏 Height</Text>
        <View style={styles.row}>
          <TextInput
            keyboardType="numeric"
            placeholder={heightUnit === "cm" ? "Enter height (cm)" : "Enter height (ft)"}
            value={height}
            onChangeText={setHeight}
            style={styles.input}
            placeholderTextColor="#bbb"
          />
          <TouchableOpacity
            style={styles.unitButton}
            onPress={() => setHeightUnit(heightUnit === "cm" ? "ft" : "cm")}
          >
            <Text style={styles.unitButtonText}>{heightUnit}</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.exampleText}>
          {heightUnit === "cm" ? "Example: 175" : 'Example: 5.8 (for 5\'8")'}
        </Text>
      </View>

      {/* Weight Input */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>⚖️ Weight</Text>
        <View style={styles.row}>
          <TextInput
            keyboardType="numeric"
            placeholder={weightUnit === "kg" ? "Enter weight (kg)" : "Enter weight (lbs)"}
            value={weight}
            onChangeText={setWeight}
            style={styles.input}
            placeholderTextColor="#bbb"
          />
          <TouchableOpacity
            style={styles.unitButton}
            onPress={() => setWeightUnit(weightUnit === "kg" ? "lbs" : "kg")}
          >
            <Text style={styles.unitButtonText}>{weightUnit}</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.exampleText}>
          {weightUnit === "kg" ? "Example: 70" : "Example: 154"}
        </Text>
      </View>

      {/* Calculate Button */}
      <TouchableOpacity style={styles.calculateButton} onPress={calculateBMI}>
        <Text style={styles.buttonText}>🧮 Calculate BMI</Text>
      </TouchableOpacity>

      {/* Submit Button */}
      {bmi && (
        <TouchableOpacity
          style={[styles.submitButton, loading && styles.disabledButton]}
          onPress={submitBMI}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.buttonText}>💾 Submit BMI</Text>
          )}
        </TouchableOpacity>
      )}

      {/* BMI Result and Analysis */}
      {bmi ? (
        <View style={styles.resultContainer}>
          <Text style={styles.resultLabel}>Your BMI:</Text>
          <Text style={[styles.bmiValue, getBMIColor(parseFloat(bmi))]}>{bmi}</Text>
          <Text style={[styles.bmiCategory, getBMIColor(parseFloat(bmi))]}>
            {getBMICategory(parseFloat(bmi))}
          </Text>

          <View style={styles.adviceBox}>
            <Text style={styles.adviceIcon}>💡</Text>
            <Text style={styles.adviceText}>
              {bmi < 18.5 &&
                "Consider consulting a healthcare provider about healthy weight gain strategies. Focus on nutrient-dense foods and strength training."}
              {bmi >= 18.5 && bmi < 25 &&
                "Excellent! You're in the healthy weight range. Maintain your current lifestyle with regular exercise and balanced nutrition."}
              {bmi >= 25 && bmi < 30 &&
                "Consider adopting a balanced diet with portion control and incorporating 150+ minutes of moderate exercise weekly."}
              {bmi >= 30 &&
                "It's recommended to consult with a healthcare provider for a personalized health plan focusing on gradual, sustainable weight loss."}
            </Text>
          </View>
        </View>
      ) : (
        <View style={styles.readyContainer}>
          <Text style={styles.readyEmoji}>📈</Text>
          <Text style={styles.readyText}>Ready for Analysis</Text>
          <Text style={styles.readyDescription}>
            Enter your height and weight, then tap "Calculate BMI" to see your detailed health assessment with personalized recommendations.
          </Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 40,
    paddingHorizontal: 24,
    backgroundColor: "#2c1055",
    flexGrow: 1,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    color: "#ccc",
    textAlign: "center",
    marginBottom: 8,
  },
  date: {
    fontSize: 14,
    color: "#aaa",
    textAlign: "center",
    marginBottom: 32,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 22,
    color: "#fff",
    marginBottom: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.1)",
    color: "#fff",
    fontSize: 18,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
  },
  unitButton: {
    marginLeft: 12,
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.4)",
    justifyContent: "center",
  },
  unitButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  exampleText: {
    marginTop: 6,
    color: "#bbb",
    fontSize: 12,
    marginLeft: 4,
  },
  calculateButton: {
    backgroundColor: "#10b981",
    paddingVertical: 16,
    borderRadius: 14,
    marginBottom: 16,
    alignItems: "center",
  },
  submitButton: {
    backgroundColor: "#7c3aed",
    paddingVertical: 16,
    borderRadius: 14,
    marginBottom: 32,
    alignItems: "center",
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
  },
  resultContainer: {
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 20,
    padding: 24,
  },
  resultLabel: {
    fontSize: 20,
    color: "#eee",
    marginBottom: 6,
    textAlign: "center",
  },
  bmiValue: {
    fontSize: 64,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 6,
  },
  bmiCategory: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    paddingHorizontal: 12,
    alignSelf: "center",
    borderRadius: 12,
  },
  adviceBox: {
    flexDirection: "row",
    backgroundColor: "rgba(0,0,0,0.3)",
    borderRadius: 16,
    padding: 16,
  },
  adviceIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  adviceText: {
    flex: 1,
    color: "#ddd",
    fontSize: 16,
    lineHeight: 24,
  },
  readyContainer: {
    alignItems: "center",
    paddingVertical: 60,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 20,
  },
  readyEmoji: {
    fontSize: 72,
    marginBottom: 16,
  },
  readyText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#eee",
    marginBottom: 12,
  },
  readyDescription: {
    fontSize: 16,
    color: "#ccc",
    textAlign: "center",
    paddingHorizontal: 12,
  },
  underweight: {
    color: "#3b82f6", // blue
  },
  normal: {
    color: "#22c55e", // green
  },
  overweight: {
    color: "#eab308", // yellow
  },
  obese: {
    color: "#ef4444", // red
  },
});

export default BMICalculator;
