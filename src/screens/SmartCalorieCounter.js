// SmartCalorieCounter.js
import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image, Modal } from "react-native";
import { Camera } from "lucide-react-native"; // Using lucide-react-native for mobile
import * as ImagePicker from 'expo-image-picker';

export default function SmartCalorieCounter() {
  const [showPhotoUpload, setShowPhotoUpload] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleScanYourFood = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.cancelled) {
      setSelectedImage(result.uri);
      setShowPhotoUpload(true);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.date}>{new Date().toLocaleDateString("en-GB")}</Text>

      <TouchableOpacity style={styles.scanButton} onPress={handleScanYourFood}>
        <Camera color="#fff" size={24} />
        <Text style={styles.buttonText}>Scan Your Food</Text>
      </TouchableOpacity>

      <Modal visible={showPhotoUpload} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          {selectedImage && (
            <Image source={{ uri: selectedImage }} style={styles.previewImage} />
          )}
          <TouchableOpacity
            onPress={() => setShowPhotoUpload(false)}
            style={styles.closeButton}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F4F4",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  date: {
    fontSize: 18,
    color: "#555",
    marginBottom: 20,
  },
  scanButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#34A853",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    elevation: 2,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 10,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#000000aa",
    justifyContent: "center",
    alignItems: "center",
  },
  previewImage: {
    width: 250,
    height: 250,
    borderRadius: 10,
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: "#FF5252",
    padding: 10,
    borderRadius: 20,
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 14,
  },
});
