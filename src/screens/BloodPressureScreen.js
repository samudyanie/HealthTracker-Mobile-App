import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image ,ScrollView} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as DocumentPicker from 'expo-document-picker';

const BloodPressureScreen = () => {
  const [activeTab, setActiveTab] = useState('manual');
  const [form, setForm] = useState({ systolic: '', diastolic: '', pulse: '' });
  const [pdfName, setPdfName] = useState('');
  const [userId, setUserId] = useState('');
  const [fileUri, setFileUri] = useState(null);   // For storing the selected file URI

  const today = new Date().toLocaleDateString('en-GB'); // dd/mm/yyyy

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userJson = await AsyncStorage.getItem('user');
        if (userJson) {
          setUserId(userJson);
        } else {
          Alert.alert('Error', 'User not logged in');
        }
      } catch (err) {
        console.error('Failed to load user ID:', err);
      }
    };

    fetchUser();
  }, []);

  const handleSave = async () => {
    if (!form.systolic || !form.diastolic || !form.pulse) {
      Alert.alert('Validation', 'Please fill all fields');
      return;
    }

    try {
      const response = await fetch('http://172.20.10.7:5555/api/patient/bloodpressure', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systolic: form.systolic,
          diastolic: form.diastolic,
          pulse: form.pulse,
          userId: userId,
        }),
      });

      const result = await response.json();
      console.log('Saved:', result);
      Alert.alert('Success', 'Blood pressure saved successfully!');
    } catch (error) {
      console.error('Save failed:', error);
      Alert.alert('Error', 'Failed to save data');
    }
  };

  const handleFileSelection = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
      });
  
      console.log("Document picker result:", JSON.stringify(result));
      
      if (result.canceled) return;
      
      if (result.assets && result.assets.length > 0) {
        const selectedFile = result.assets[0];
        console.log("Selected file:", selectedFile);
        setPdfName(selectedFile.name);
        setFileUri(selectedFile.uri);
        console.log("After state update - Name:", selectedFile.name, "URI:", selectedFile.uri);
      }
    } catch (err) {
      console.error('File selection error:', err);
    }
  };
  const handleUpload = async () => {
    console.log("Upload pressed. Current state - fileUri:", fileUri, "pdfName:", pdfName);
    if (!fileUri) {
      Alert.alert('Error', 'Please select a PDF file first.');
      return;
    }
    try {
      const formData = new FormData();
      formData.append('file', {
        uri: fileUri,
        type: 'application/pdf',
        name: pdfName,
      });
      formData.append('userId', userId);
      
      console.log('Uploading file:', fileUri, pdfName); // Add this debug log
      
      const uploadRes = await fetch('http://172.20.10.7:5555/api/patient/upload/bloodpressure', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'multipart/form-data', // Add this header
        },
      });
      
      console.log('Response status:', uploadRes.status); // Add this debug log
      
      const result = await uploadRes.json();
      console.log('Upload response:', result);
      
      if (uploadRes.ok) {
        Alert.alert('Success', 'PDF uploaded successfully!');
      } else {
        Alert.alert('Error', `Failed to upload PDF: ${result.message || 'Unknown error'}`);
      }
    } catch (err) {
      console.error('Upload error:', err);
      Alert.alert('Error', `Upload failed: ${err.message}`);
    }
  };
  

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
    <View style={styles.container}>
      <Text style={styles.title}>Blood Pressure</Text>
      <Text style={styles.date}>Date: {today}</Text>

      {/* Blood Pressure Image */}
      <Image source={require('../assets/bloodpressure.png')} style={styles.bloodPressureImage} />

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'manual' && styles.activeTab]}
          onPress={() => setActiveTab('manual')}
        >
          <Text style={activeTab === 'manual' ? styles.activeTabText : styles.tabText}>Manual Entry</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'upload' && styles.activeTab]}
          onPress={() => setActiveTab('upload')}
        >
          <Text style={activeTab === 'upload' ? styles.activeTabText : styles.tabText}>Upload PDF</Text>
        </TouchableOpacity>
      </View>
      
      {activeTab === 'manual' ? (
        <>
          <TextInput
            style={styles.input}
            placeholder="Systolic"
            keyboardType="numeric"
            value={form.systolic}
            onChangeText={val => setForm({ ...form, systolic: val })}
          />
          <TextInput
            style={styles.input}
            placeholder="Diastolic"
            keyboardType="numeric"
            value={form.diastolic}
            onChangeText={val => setForm({ ...form, diastolic: val })}
          />
          <TextInput
            style={styles.input}
            placeholder="Pulse"
            keyboardType="numeric"
            value={form.pulse}
            onChangeText={val => setForm({ ...form, pulse: val })}
          />
          <TouchableOpacity style={styles.button} onPress={handleSave}>
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <TouchableOpacity style={styles.uploadButton} onPress={handleFileSelection}>
      <Text style={styles.uploadText}>
        {pdfName ? pdfName : 'Choose PDF File'}
      </Text>
    </TouchableOpacity>

    {/* Button to upload the chosen PDF */}
    <TouchableOpacity style={styles.button} onPress={handleUpload}>
      <Text style={styles.buttonText}>Upload</Text>
    </TouchableOpacity>
        </>
      )}
    </View>
  </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e0f7fa',
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 180
  },
  title: { fontSize: 25, fontWeight: 'bold', marginBottom: 6 },
  date: { marginBottom: 20, fontSize: 18, color: '#666' },
  bloodPressureImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: '#ccc',
    borderRadius: 6,
    overflow: 'hidden',
  },
  tab: { paddingVertical: 8, paddingHorizontal: 20 },
  activeTab: { backgroundColor: '#00bfa5' },
  tabText: { color: '#333' },
  activeTabText: { color: '#fff', fontWeight: 'bold' },
  input: {
    width: '80%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 15,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#00bfa5',
    paddingVertical: 12,
    paddingHorizontal: 50,
    borderRadius: 8,
    marginTop: 10,
  },

  uploadText: { color: '#333' },
});

export default BloodPressureScreen;
