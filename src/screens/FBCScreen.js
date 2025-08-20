import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView, // Import ScrollView for making the page scrollable
  Image, // Import Image to display the FBC image
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as DocumentPicker from 'expo-document-picker';
import PatientReportList from '../components/PatientReportList';

const FBCScreen = () => {
  const [activeTab, setActiveTab] = useState('manual');
  const [userId, setUserId] = useState('');
  const [form, setForm] = useState({
    rbc: '',
    wbc: '',
    haemoglobin: '',
    platelet: '',
  });
  const [pdfName, setPdfName] = useState('');
  const [fileUri, setFileUri] = useState(null); 
  const [doctorId, setDoctorId] = useState(null);

  const today = new Date().toLocaleDateString('en-GB');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userJsonString = await AsyncStorage.getItem('user');
        const userJson = JSON.parse(userJsonString);
      
        if (userJson) {
          const savedDoctorId = await AsyncStorage.getItem('selectedDoctorId');
          
          const extractedUser = userJson.patient; 
          const userIdValue = extractedUser?.id;
      
          setDoctorId(savedDoctorId);
          setUserId(extractedUser); 
      
          console.log('User ID:', userIdValue);
        } else {
          Alert.alert('Error', 'User not logged in');
        }
      } catch (err) {
        console.error('Failed to load user ID:', err);
      }
    };
    fetchUser();
  }, []);

  const handleManualSubmit = async () => {
    const { rbc, wbc, haemoglobin, platelet } = form;
    if (!rbc || !wbc || !haemoglobin || !platelet) {
      Alert.alert('Validation', 'Please fill all fields');
      return;
    }
    try {
      const response = await fetch('http://192.168.1.20:5555/api/patient/fbc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: userId.id,
          rbc,
          wbc,
          haemoglobin,
          platelet,
          docId:doctorId,
        }),
      });

      const result = await response.json();
      console.log('Saved:', result);
      Alert.alert('Success', 'FBC saved successfully!');
    } catch (error) {
      console.error('Save failed:', error);
      Alert.alert('Error', 'Failed to save FBC');
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
      formData.append('userId', userId.id);
      formData.append('docId',doctorId);

      
      console.log('Uploading file:', fileUri, pdfName); // Add this debug log
      
      const uploadRes = await fetch('http://192.168.1.20:5555/api/patient/upload/fbc', {
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
        <Text style={styles.title}>FBC</Text>
        <Text style={styles.date}>Date: {today}</Text>

        {/* Add the FBC Image */}
        <Image source={require('../assets/fbc.png')} style={styles.fbcImage} />

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
              placeholder="RBC"
              keyboardType="numeric"
              value={form.rbc}
              onChangeText={val => setForm({ ...form, rbc: val })}
            />
            <TextInput
              style={styles.input}
              placeholder="WBC"
              keyboardType="numeric"
              value={form.wbc}
              onChangeText={val => setForm({ ...form, wbc: val })}
            />
            <TextInput
              style={styles.input}
              placeholder="haemoglobin"
              keyboardType="numeric"
              value={form.haemoglobin}
              onChangeText={val => setForm({ ...form, haemoglobin: val })}
            />
            <TextInput
              style={styles.input}
              placeholder="Platelet"
              keyboardType="numeric"
              value={form.platelet}
              onChangeText={val => setForm({ ...form, platelet: val })}
            />
            <TouchableOpacity style={styles.button} onPress={handleManualSubmit}>
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
      <PatientReportList 
          patientId={userId.id} 
          reportType={"fbc"} 
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    paddingBottom: 20, // Add padding at the bottom of the scroll view
  },
  container: {
    flex: 1,
    backgroundColor: '#e0f7fa',
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 180, // Add bottom padding to avoid content overlap
  },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 6 },
  date: { marginBottom: 20, fontSize: 14, color: '#666' },
  fbcImage: {
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
    paddingVertical: 10,
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
  buttonText: { color: '#fff', fontWeight: 'bold' },
  uploadButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    width: '80%',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  uploadText: { color: '#333' },
});

export default FBCScreen;
