import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Image, 
  Modal, 
  ActivityIndicator, 
  StyleSheet,
  ScrollView 
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Camera, X, CheckCircle, AlertCircle } from "lucide-react-native";

export default function SmartCalorieCounter() {
  const currentDate = new Date().toLocaleDateString("en-GB");
  const [user, setUser] = useState(null);
  const [showPhotoUpload, setShowPhotoUpload] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const mockUser = { name: "User" };
    setUser(mockUser);
  }, []);

  const pickImage = async () => {
    setError(null);
    try {
      let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (permissionResult.granted === false) {
        setError("Permission to access camera roll is required!");
        return;
      }
      let pickerResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      });

      if (!pickerResult.canceled) {
        setSelectedImage(pickerResult.assets[0]);
        setAnalysisResult(null);
      }
    } catch (e) {
      setError("Failed to pick image: " + e.message);
    }
  };

  const analyzePhoto = async () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);
    setError(null);
    setAnalysisResult(null);

    try {
      const formData = new FormData();
      // In React Native, you need to create a proper file object for FormData
      formData.append("image", {
        uri: selectedImage.uri,
        name: "photo.jpg",
        type: "image/jpeg",
      });

      const response = await fetch("http://192.168.1.20:5000/", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setAnalysisResult(result);
    } catch (err) {
      setError(`Failed to analyze image: ${err.message}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetPhotoUpload = () => {
    setSelectedImage(null);
    setAnalysisResult(null);
    setError(null);
    setIsAnalyzing(false);
  };

  const closePhotoModal = () => {
    setShowPhotoUpload(false);
    resetPhotoUpload();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🍎 Smart Calorie Counter</Text>
        <Text style={styles.greeting}>Hey👋</Text>
        <Text style={styles.date}>{currentDate}</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.subtitle}>What do you want to do today?</Text>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => setShowPhotoUpload(true)}
          activeOpacity={0.8}
        >
          <View style={styles.actionContent}>
            <View style={styles.iconCircle}>
              <Camera size={40} color="#ea580c" />
            </View>
            <View style={styles.actionTextContainer}>
              <Text style={styles.actionTitle}>Scan Food Photo</Text>
              <Text style={styles.actionDescription}>Take a photo to get instant calorie info 📸</Text>
            </View>
            <View>
              <Text style={{ fontSize: 24, color: "#f97316" }}>›</Text>
            </View>
          </View>
        </TouchableOpacity>

        <View style={styles.footerMessage}>
          <Text style={{ color: "#4b5563" }}>Keep tracking, you're doing great! 🌟</Text>
        </View>
      </View>

      <Modal visible={showPhotoUpload} animationType="slide" transparent>
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Scan Food Photo</Text>
              <TouchableOpacity onPress={closePhotoModal}>
                <X size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>

            {!selectedImage && (
              <View style={styles.uploadPrompt}>
                <Camera size={48} color="#9ca3af" />
                <Text style={styles.uploadPromptText}>Select a photo of your food</Text>
                <TouchableOpacity style={styles.choosePhotoButton} onPress={pickImage}>
                  <Text style={styles.choosePhotoButtonText}>Choose Photo</Text>
                </TouchableOpacity>
                {error && (
                  <View style={styles.errorBox}>
                    <AlertCircle size={20} color="#b91c1c" />
                    <Text style={styles.errorText}>{error}</Text>
                  </View>
                )}
              </View>
            )}

            {selectedImage && (
              <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
                <Image
                  source={{ uri: selectedImage.uri }}
                  style={styles.previewImage}
                  resizeMode="cover"
                />

                {!analysisResult && !isAnalyzing && (
                  <View style={styles.buttonRow}>
                    <TouchableOpacity style={styles.analyzeButton} onPress={analyzePhoto}>
                      <Text style={styles.analyzeButtonText}>Analyze Photo</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.changeButton} onPress={resetPhotoUpload}>
                      <Text style={styles.changeButtonText}>Change Photo</Text>
                    </TouchableOpacity>
                  </View>
                )}

                {isAnalyzing && (
                  <View style={styles.analyzingContainer}>
                    <ActivityIndicator size="large" color="#ea580c" />
                    <Text style={{ marginTop: 10, color: "#4b5563" }}>
                      Analyzing your food photo...
                    </Text>
                  </View>
                )}

                {analysisResult && (
                  <View style={styles.resultBox}>
                    <View style={styles.resultHeader}>
                      <CheckCircle size={20} color="#15803d" />
                      <Text style={styles.resultTitle}>Analysis Complete!</Text>
                    </View>
                    <View style={styles.resultDetails}>
                      <Text>
                        <Text style={styles.resultLabel}>Food: </Text>
                        {analysisResult.prediction}
                      </Text>
                      <Text>
                        <Text style={styles.resultLabel}>Calories: </Text>
                        {analysisResult.calories}
                      </Text>
                    </View>

                    <View style={styles.buttonRow}>
                      <TouchableOpacity style={styles.analyzeButton} onPress={resetPhotoUpload}>
                        <Text style={styles.analyzeButtonText}>Scan Another</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.changeButton} onPress={closePhotoModal}>
                        <Text style={styles.changeButtonText}>Done</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}

                {error && (
                  <View style={styles.errorBox}>
                    <AlertCircle size={20} color="#b91c1c" />
                    <Text style={styles.errorText}>{error}</Text>
                    <TouchableOpacity onPress={() => setError(null)}>
                      <Text style={styles.tryAgainText}>Try Again</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#d5f0f0",
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#ea580c",
    marginBottom: 8,
  },
  greeting: {
    fontSize: 20,
    color: "#374151",
  },
  date: {
    color: "#6b7280",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  subtitle: {
    fontSize: 18,
    color: "#374151",
    marginBottom: 20,
    textAlign: "center",
  },
  actionButton: {
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 16,
    marginBottom: 40,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5,
  },
  actionContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  iconCircle: {
    backgroundColor: "#fed7aa",
    borderRadius: 50,
    width: 64,
    height: 64,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  actionTextContainer: {
    flex: 1,
    marginRight: 12,
  },
  actionTitle: {
    fontSize: 22,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 4,
  },
  actionDescription: {
    color: "#4b5563",
  },
  footerMessage: {
    alignItems: "center",
    marginBottom: 30,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    padding: 16,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 16,
    maxHeight: "90%",
    padding: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#374151",
  },
  uploadPrompt: {
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "#d1d5db",
    borderRadius: 16,
    padding: 32,
    alignItems: "center",
  },
  uploadPromptText: {
    color: "#6b7280",
    marginVertical: 16,
    fontSize: 16,
  },
  choosePhotoButton: {
    backgroundColor: "#ea580c",
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  choosePhotoButtonText: {
    color: "white",
    fontWeight: "600",
  },
  previewImage: {
    width: "100%",
    height: 300,
    borderRadius: 16,
    marginBottom: 16,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  analyzeButton: {
    backgroundColor: "#ea580c",
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    marginRight: 8,
    alignItems: "center",
  },
  analyzeButtonText: {
    color: "white",
    fontWeight: "600",
  },
  changeButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#d1d5db",
    paddingVertical: 12,
    borderRadius: 12,
    marginLeft: 8,
    alignItems: "center",
  },
  changeButtonText: {
    color: "#374151",
  },
  analyzingContainer: {
    alignItems: "center",
    paddingVertical: 40,
  },
  resultBox: {
    backgroundColor: "#dcfce7",
    borderColor: "#bbf7d0",
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
  },
  resultHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  resultTitle: {
    color: "#15803d",
    fontWeight: "600",
    marginLeft: 8,
    fontSize: 16,
  },
  resultDetails: {
    marginBottom: 12,
  },
  resultLabel: {
    fontWeight: "600",
  },
  errorBox: {
    backgroundColor: "#fee2e2",
    borderColor: "#fecaca",
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  errorText: {
    color: "#b91c1c",
    marginLeft: 8,
    flex: 1,
  },
  tryAgainText: {
    color: "#991b1b",
    marginTop: 8,
    textDecorationLine: "underline",
  },
});
