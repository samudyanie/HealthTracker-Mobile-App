import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  StyleSheet,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';

export default function SmartCalorieCounterScreen() {
  const [image, setImage] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert('Permission is required to access photos.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      base64: false,
    });

    if (!result.cancelled) {
      setImage(result);
      setAnalysisResult(null); // Reset previous result
    }
  };

  const analyzeImage = async () => {
    if (!image) return;

    const formData = new FormData();
    formData.append('image', {
      uri: image.uri,
      name: 'food.jpg',
      type: 'image/jpeg',
    });

    setIsAnalyzing(true);

    try {
      const response = await axios.post('http:172.20.10.7:5000/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setAnalysisResult(response.data);
    } catch (error) {
      Alert.alert('Error', 'Failed to analyze image: ' + error.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const reset = () => {
    setImage(null);
    setAnalysisResult(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📷 Smart Calorie Counter</Text>

      {!image && (
        <TouchableOpacity style={styles.button} onPress={pickImage}>
          <Text style={styles.buttonText}>Choose Food Photo</Text>
        </TouchableOpacity>
      )}

      {image && (
        <>
          <Image source={{ uri: image.uri }} style={styles.preview} />

          {!isAnalyzing && !analysisResult && (
            <TouchableOpacity style={styles.button} onPress={analyzeImage}>
              <Text style={styles.buttonText}>Analyze Photo</Text>
            </TouchableOpacity>
          )}

          {isAnalyzing && (
            <View style={styles.loader}>
              <ActivityIndicator size="large" color="#FF7F50" />
              <Text style={styles.analyzingText}>Analyzing...</Text>
            </View>
          )}

          {analysisResult && (
            <View style={styles.resultBox}>
              <Text style={styles.resultText}>🍽 Food: {analysisResult.prediction}</Text>
              <Text style={styles.resultText}>🔥 Calories: {analysisResult.calories}</Text>

              <View style={styles.buttonGroup}>
                <TouchableOpacity style={styles.buttonSmall} onPress={reset}>
                  <Text style={styles.buttonText}>Scan Another</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#F4FCFF',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FF5722',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#FF9800',
    padding: 14,
    borderRadius: 10,
    marginTop: 10,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 16,
  },
  preview: {
    width: 250,
    height: 250,
    borderRadius: 12,
    marginTop: 20,
  },
  loader: {
    alignItems: 'center',
    marginTop: 20,
  },
  analyzingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#777',
  },
  resultBox: {
    marginTop: 20,
    backgroundColor: '#E0F2F1',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  resultText: {
    fontSize: 16,
    marginBottom: 8,
    color: '#00796B',
  },
  buttonGroup: {
    flexDirection: 'row',
    marginTop: 12,
  },
  buttonSmall: {
    backgroundColor: '#FF9800',
    padding: 10,
    borderRadius: 8,
    marginHorizontal: 8,
  },
});
