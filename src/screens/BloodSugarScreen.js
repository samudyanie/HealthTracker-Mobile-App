import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  ScrollView, // Import ScrollView
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as DocumentPicker from 'expo-document-picker';
import PatientReportList from '../components/PatientReportList';

const BloodSugarScreen = () => {
  const [activeTab, setActiveTab] = useState('manual');
  const [userId, setUserId] = useState('');
  const [value, setValue] = useState('');
  const [pdfName, setPdfName] = useState('');
  const [selectedTestType, setSelectedTestType] = useState('');
  const [fileUri, setFileUri] = useState(null);
  const [doctorId, setDoctorId] = useState(null); 
 
  const today = new Date().toLocaleDateString('en-GB'); // 28/03/2025 format

  useEffect(() => {
    const fetchUser = async () => {
    
      try {
        const userJsonString = await AsyncStorage.getItem('user');
        const userJson = JSON.parse(userJsonString);
      
        if (userJson) {
          const savedDoctorId = await AsyncStorage.getItem('selectedDoctorId');
          
          const extractedUser = userJson.patient; // 👈 this holds the object with `id`
          const userIdValue = extractedUser?.id;
      
          setDoctorId(savedDoctorId);
          setUserId(extractedUser); // 👈 optional if you still need it elsewhere
      
          console.log('User ID:', userIdValue); // ✅ Now this will work
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
    if (!selectedTestType || !value) {
      Alert.alert('Validation', 'Please select a test type and enter a value.');
      return;
    }
    try {
      const res = await fetch('http://192.168.1.20:5555/api/patient/bloodsugar', {
        
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: userId.id,
          docId: doctorId,
          userId: userId.id,
          docId: doctorId,
          type: selectedTestType,
          value,
        }),
      });

      const result = await res.json();
      console.log('Saved:', result);
      Alert.alert('Success', 'Blood sugar data saved!');
    } catch (err) {
      console.error('Manual entry failed:', err);
      Alert.alert('Error', 'Failed to save blood sugar data');
    }
  };

  // const handlePdfUpload = async () => {
  //   try {
  //     const resultPdf = await DocumentPicker.getDocumentAsync({
  //       type: 'application/pdf',
  //     });
  
  //     // Check if user canceled the selection
  //     if (resultPdf.canceled) return;
      
  //     // Make sure we have assets
  //     if (!resultPdf.assets || resultPdf.assets.length === 0) {
  //       Alert.alert('Error', 'No file was selected');
  //       return;
  //     }
      
  //     const selectedFile = resultPdf.assets[0];
  //     setPdfName(selectedFile.name);
  
  //     const formData = new FormData();
  //     formData.append('file', {
  //       uri: selectedFile.uri,
  //       name: selectedFile.name,
  //       type: 'application/pdf',
  //     });
  //     formData.append('userId', userId);
  
  //     const uploadRes = await fetch('http://192.168.1.20:5555/api/patient/upload/bloodsugar', {
  //       method: 'POST',
  //       body: formData,
  //       headers: {
  //         'Accept': 'application/json',
  //         'Content-Type': 'multipart/form-data',
  //       },
  //     });
  
  //     const result = await uploadRes.json();
  //     console.log('Uploaded:', result);
      
  //     if (uploadRes.ok) {
  //       Alert.alert('Success', 'PDF uploaded successfully!');
  //     } else {
  //       Alert.alert('Error', `Upload failed: ${result.message || 'Unknown error'}`);
  //     }
  //   } catch (err) {
  //     console.error('Upload error:', err);
  //     Alert.alert('Error', `Failed to upload PDF: ${err.message}`);
  //   }
  // };

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

        formData.append('userId', userId.id);
        formData.append('docId',doctorId);

        console.log('Uploading file:', fileUri, pdfName); // Add this debug log
        
        const uploadRes = await fetch('http://192.168.1.20:5555/api/patient/upload/bloodsugar', {
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

  const handleTestTypeSelect = (type) => {
    setSelectedTestType(type);
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Blood Sugar</Text>
        <Text style={styles.date}>Date: {today}</Text>

        {/* Add the Blood Sugar Image */}
        <Image source={require('../assets/bloodsugar.png')} style={styles.bloodSugarImage} />

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
            <Text style={styles.label}>Select Your Test Type</Text>
            <View style={styles.testTypeContainer}>
              {['fasting', 'postprandial', 'random', 'hba1c'].map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.testTypeButton,
                    selectedTestType === type && styles.selectedTestType,
                  ]}
                  onPress={() => handleTestTypeSelect(type)}
                >
                  <Text style={styles.testTypeText}>{type.charAt(0).toUpperCase() + type.slice(1)}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TextInput
              style={styles.input}
              placeholder="Enter the Value"
              keyboardType="numeric"
              value={value}
              onChangeText={setValue}
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
          reportType={"bloodsugar"} 
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    paddingBottom: 20, // Add bottom padding to the scroll view
  },
  container: {
    flex: 1,
    backgroundColor: '#e0f7fa',
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 100, // Ensure padding at the bottom
  },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 6 },
  date: { marginBottom: 20, fontSize: 14, color: '#666' },
  bloodSugarImage: {
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
  label: { marginBottom: 6, marginTop: 10, color: '#333' },
  testTypeContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: '80%',
    marginBottom: 12,
  },
  testTypeButton: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#fff',
    width: '100%',
    alignItems: 'center',
    marginBottom: 8,
  },
  selectedTestType: {
    backgroundColor: '#00bfa5',
  },
  testTypeText: {
    color: '#333',
    fontWeight: 'bold',
  },
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

export default BloodSugarScreen;
