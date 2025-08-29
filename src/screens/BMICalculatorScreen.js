import React, { useMemo, useState } from "react";
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

/** Scale bounds to match the web UI */
const MIN_BMI = 15;
const MAX_BMI = 35;

function clamp01(x) {
  "worklet";
  return Math.max(0, Math.min(1, x));
}

function pctForValue(v) {
  if (v == null || Number.isNaN(v)) return 0;
  return clamp01((v - MIN_BMI) / (MAX_BMI - MIN_BMI));
}

function round1(n) {
  return Math.round(n * 10) / 10;
}

const segments = [
  { label: "Underweight", start: 15, end: 18.5, color: "#2563eb" }, // blue-600
  { label: "Normal",      start: 18.5, end: 25,  color: "#16a34a" }, // green-600
  { label: "Overweight",  start: 25,   end: 30,  color: "#f59e0b" }, // amber-500
  { label: "Obese",       start: 30,   end: 35,  color: "#dc2626" }, // red-600
];

const ticks = [
  { value: 15,   label: "15",   align: "left"  },
  { value: 18.5, label: "18.5"               },
  { value: 25,   label: "25"                 },
  { value: 30,   label: "30"                 },
  { value: 35,   label: "35+",  align: "right" },
];

const BMICalculator = () => {
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [heightUnit, setHeightUnit] = useState("cm");
  const [weightUnit, setWeightUnit] = useState("kg");
  const [loading, setLoading] = useState(false);

  // conversions
  const convertHeight = (value, unit) => {
    const v = parseFloat(value);
    if (Number.isNaN(v)) return NaN;
    if (unit === "ft") return v * 30.48; // feet.decimal → cm
    return v; // cm
  };

  const convertWeight = (value, unit) => {
    const v = parseFloat(value);
    if (Number.isNaN(v)) return NaN;
    if (unit === "lbs") return v * 0.453592; // lbs → kg
    return v; // kg
  };

  // Live BMI (null until both inputs valid)
  const bmi = useMemo(() => {
    const hCm = convertHeight(height, heightUnit);
    const wKg = convertWeight(weight, weightUnit);
    if (!hCm || !wKg || hCm <= 0 || wKg <= 0) return null;
    const meters = hCm / 100;
    if (meters <= 0) return null;
    return round1(wKg / (meters * meters));
  }, [height, weight, heightUnit, weightUnit]);

  const getBMICategory = (bmiValue) => {
    if (bmiValue < 18.5) return "Underweight";
    if (bmiValue < 25) return "Normal";
    if (bmiValue < 30) return "Overweight";
    return "Obese";
  };

  const getBMIColorStyle = (bmiValue) => {
    if (bmiValue < 18.5) return styles.underweight;
    if (bmiValue < 25) return styles.normal;
    if (bmiValue < 30) return styles.overweight;
    return styles.obese;
  };

  const submitBMI = async () => {
    if (bmi == null) {
      Alert.alert("Enter Details", "Please enter height and weight to calculate BMI first.");
      return;
    }
    setLoading(true);
    try {
      const userJson = await AsyncStorage.getItem("user");
      if (!userJson) {
        Alert.alert("User Not Found", "Please log in before submitting BMI data.");
        setLoading(false);
        return;
      }
      const userObject = JSON.parse(userJson);
      const userId = userObject;
      if (!userId) {
        Alert.alert("Invalid User", "User ID not found.");
        setLoading(false);
        return;
      }

      await axios.post("http://192.168.1.20:5555/api/patient/bmi", {
        height: convertHeight(height, heightUnit),
        weight: convertWeight(weight, weightUnit),
        bmi: parseFloat(bmi),
        userId,
      });

      Alert.alert("Success", "BMI data saved successfully!");
      setHeight("");
      setWeight("");
    } catch (error) {
      console.error("Error submitting BMI data:", error);
      Alert.alert("Error", "Failed to submit BMI data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>BMI Calculator</Text>
      <Text style={styles.subtitle}></Text>
      <Text style={styles.date}>
        {new Date().toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </Text>

      {/* Height */}
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

      {/* Weight */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>⚖️ Weight</Text>
        <View style={styles.row}>
          <TextInput
            keyboardType="numeric"
            placeholder={weightUnit === "kg" ? "Enter weight (kg)" : "Enter weight (lbs)"}
            value={weight}
            onChangeText={setWeight}
            style={styles.input}
            placeholderTextColor="#6b7280"
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

      {/* WEB-LIKE SCALE (always visible; arrow appears only when BMI is valid) */}
      <BMIScale bmi={bmi} />

      {/* Submit */}
      

      {/* Result / helper */}
      {bmi != null ? (
        <View style={styles.resultContainer}>
          <Text style={styles.resultLabel}>Your BMI:</Text>
          <Text style={[styles.bmiValue, getBMIColorStyle(bmi)]}>{bmi}</Text>
          <Text style={[styles.bmiCategory, getBMIColorStyle(bmi)]}>
            {getBMICategory(bmi)}
          </Text>

          <View style={styles.adviceBox}>
            <Text style={styles.adviceIcon}>💡</Text>
            <Text style={styles.adviceText}>
              {bmi < 18.5 &&
  "You're underweight. Eat more healthy foods and stay active."}
{bmi >= 18.5 && bmi < 25 &&
  "Great! Your weight is healthy. Keep up your routine."}
{bmi >= 25 && bmi < 30 &&
  "You're overweight. Try eating balanced meals and exercise regularly."}
{bmi >= 30 &&
  "You're in the obese range. Talk to a doctor about a safe weight-loss plan."}

            </Text>
          </View>
        </View>
      ) : (
        <View style={styles.readyContainer}>
          <Text style={styles.readyEmoji}>📈</Text>
          <Text style={styles.readyText}>Ready for Analysis</Text>
          <Text style={styles.readyDescription}>
            Enter your height and weight. The scale and arrow will update automatically as you type.
          </Text>
        </View>
      )}
    </ScrollView>
  );
};

/** WEB-LIKE SCALE for React Native */
const BMIScale = ({ bmi }) => {
  const [width, setWidth] = useState(0);
  const hasBMI = bmi != null;

  const onLayout = (e) => setWidth(e.nativeEvent.layout.width);

  const markerLeft = width * pctForValue(bmi ?? MIN_BMI);

  return (
    <View style={styles.scaleWrap}>
      <Text style={styles.scaleTitle}></Text>

      {/* scale bar */}
      <View style={styles.scaleBox} onLayout={onLayout}>
        <View style={styles.scaleBar}>
          {segments.map((s) => {
            const flexVal = s.end - s.start; // proportional to true range
            return <View key={s.label} style={[styles.segment, { flex: flexVal, backgroundColor: s.color }]} />;
          })}
        </View>

        {/* ticks */}
        <View style={StyleSheet.absoluteFill}>
          {ticks.map((t) => {
            const leftPx = width * pctForValue(t.value);
            const containerBase = { position: "absolute", left: leftPx, width: 60 };
            let marginLeft = -30; // center
            if (t.align === "left") marginLeft = 0;
            if (t.align === "right") marginLeft = -60;

            return (
              <View key={t.label} style={[containerBase, { marginLeft, top: 52, alignItems: "center" }]}>
                <View style={styles.tick} />
                <Text style={styles.tickLabel}>{t.label}</Text>
              </View>
            );
          })}
        </View>

        {/* moving marker (hidden until valid) */}
        {hasBMI && (
          <View style={[styles.markerContainer, { left: markerLeft - 40 }] /* 80px wide, center via -40 */}>
            <View style={styles.markerBubble}>
              <Text style={styles.markerText}>{bmi}</Text>
            </View>
            <View style={styles.markerTriangle} />
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 40,
    paddingHorizontal: 24,
    backgroundColor: "#d5f0f0",
    flexGrow: 1,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#0a0101ff",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    color: "#666666ff",
    textAlign: "center",
    marginBottom: 8,
  },
  date: {
    fontSize: 14,
    color: "#aaa",
    textAlign: "center",
    marginBottom: 32,
  },

  inputGroup: { marginBottom: 24 },
  label: { fontSize: 22, color: "#373636ff", marginBottom: 8 },
  row: { flexDirection: "row", alignItems: "center" },
  input: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.1)",
    color: "#100303ff",
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
  unitButtonText: { color: "#5c5959ff", fontSize: 18, fontWeight: "bold" },
  exampleText: { marginTop: 6, color: "#585454ff", fontSize: 12, marginLeft: 4 },

  submitButton: {
    backgroundColor: "#7c3aed",
    paddingVertical: 16,
    borderRadius: 14,
    marginBottom: 24,
    alignItems: "center",
  },
  disabledButton: { opacity: 0.6 },
  buttonText: { color: "#fff", fontSize: 22, fontWeight: "bold" },

  /* Result card */
  resultContainer: {
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 20,
    padding: 24,
  },
  resultLabel: { fontSize: 20, color: "#eee", marginBottom: 6, textAlign: "center" },
  bmiValue: { fontSize: 64, fontWeight: "bold", textAlign: "center", marginBottom: 6 },
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
  adviceIcon: { fontSize: 32, marginRight: 12 },
  adviceText: { flex: 1, color: "#ddd", fontSize: 16, lineHeight: 24 },

  readyContainer: {
    alignItems: "center",
    paddingVertical: 60,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 20,
  },
  readyEmoji: { fontSize: 72, marginBottom: 16 },
  readyText: { fontSize: 28, fontWeight: "bold", color: "#494848ff", marginBottom: 12 },
  readyDescription: { fontSize: 16, color: "#ccc", textAlign: "center", paddingHorizontal: 12 },

  underweight: { color: "#3b82f6" },
  normal: { color: "#22c55e" },
  overweight: { color: "#eab308" },
  obese: { color: "#ef4444" },

  /* SCALE */
  scaleWrap: { marginBottom: 20 },
  scaleTitle: { color: "#363434ff", fontSize: 18, fontWeight: "600", marginBottom: 10 },
  scaleBox: { position: "relative" },
  scaleBar: {
    height: 48,
    borderRadius: 999,
    overflow: "hidden",
    flexDirection: "row",
    elevation: 3,
  },
  segment: { },
  tick: { width: 1, height: 10, backgroundColor: "rgba(255,255,255,0.6)", marginBottom: 4 },
  tickLabel: { color: "#2b2b2bff", fontSize: 12 },

  markerContainer: { position: "absolute", top: -44, width: 80, alignItems: "center" },
  markerBubble: {
    backgroundColor: "#0d9488",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    elevation: 2,
  },
  markerText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  markerTriangle: {
    width: 0, height: 0, marginTop: 4,
    borderLeftWidth: 8, borderRightWidth: 8, borderTopWidth: 10,
    borderLeftColor: "transparent", borderRightColor: "transparent", borderTopColor: "#0d9488",
  },
});

export default BMICalculator;
