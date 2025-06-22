import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  StatusBar, 
  Alert,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  FlatList
} from 'react-native';
import axios from 'axios';
import { useRoute } from '@react-navigation/native';
import PatientHistoryModal from '../components/PatientHistoryModal';
import AddCommentModal from '../components/AddCommentModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from '@expo/vector-icons'; // Assuming Expo is used

const ViewReports = () => {
  // States
  const [reports, setReports] = useState([]);
  const [user, setUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [patientHistory, setPatientHistory] = useState([]);
  const [modalTitle, setModalTitle] = useState('');
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [selectedDocId, setSelectedDocId] = useState(null);
  const [selectedReportType, setSelectedReportType] = useState(null);
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(true);

  // Use React Navigation route to get parameters
  const route = useRoute();
  const reportType = route.params?.reportType;

  // Date formatting function for React Native
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  // Column definitions for different report types (we'll use these for modal)
  const bpColumns = [
    { key: "date", label: "Date", format: formatDate },
    { key: "systolic", label: "Systolic" },
    { key: "diastolic", label: "Diastolic" },
    { key: "pulse", label: "Pulse" },
    { key: "patientId", label: "Patient Id" },
    { key: "doctorComment", label: "Comment" },
  ];
  
  const sugarColumns = [
    { key: "date", label: "Date", format: formatDate },
    { key: "type", label: "Type" },
    { key: "value", label: "Value" },
    { key: "patientId", label: "Patient Id" },
    { key: "doctorComment", label: "Comment" },
  ];
  
  const fbcColumns = [
    { key: "date", label: "Date", format: formatDate },
    { key: "haemoglobin", label: "Haemoglobin" },
    { key: "wbc", label: "WBC" },
    { key: "platelet", label: "Platelet" },
    { key: "patientId", label: "Patient Id" },
    { key: "doctorComment", label: "Comment" },
  ];
  
  const lipidColumns = [
    { key: "date", label: "Date", format: formatDate },
    { key: "ldl", label: "LDL" },
    { key: "hdl", label: "HDL" },
    { key: "triglycerides", label: "Triglycerides" },
    { key: "cholesterol", label: "Cholesterol" },
    { key: "patientId", label: "Patient Id" },
    { key: "doctorComment", label: "Comment" },
  ];

  // Helper function to get columns based on report type
  const getColumnsByType = (type) => {
    switch (type) {
      case "Blood Pressure":
        return bpColumns;
      case "Blood Sugar":
        return sugarColumns;
      case "FBC":
        return fbcColumns;
      case "Lipid Profile":
        return lipidColumns;
      default:
        return [];
    }
  };

  // Data fetching on component mount
  useEffect(() => {
    const getUserData = async () => {
      try {
        // Get doctor data from AsyncStorage
        const storedUserString = await AsyncStorage.getItem('doctor');
        const storedUser = JSON.parse(storedUserString);
        
        if (storedUser) {
          setUser(storedUser);
        }
        
        // Set appropriate columns based on report type
        setColumns(getColumnsByType(reportType));
        console.log(storedUser);
        
        // Determine API endpoint based on report type
        let url = "";
        switch (reportType) {
          case "Blood Pressure":
            url = `http://192.168.1.20:5555/api/patient/getbloodpressurebydoc/${storedUser.doctornumber}`;
            break;
          case "Blood Sugar":
            url = `http://192.168.1.20:5555/api/patient/getbloodsugarbydoc/${storedUser.doctornumber}`;
            break;
          case "Lipid Profile":
            url = `http://192.168.1.20:5555/api/patient/getlipidbydoc/${storedUser.doctornumber}`;
            break;
          case "FBC":
            url = `http://192.168.1.20:5555/api/patient/getfbcbydoc/${storedUser.doctornumber}`;
            break;
          default:
            console.warn("Unknown report type");
            setLoading(false);
            return;
        }

        try {
          // Fetch data using the dynamic URL
          const response = await axios.get(url);
          setReports(response.data);
        } catch (error) {
          console.error("Error fetching reports:", error);
          Alert.alert("Error", "Failed to load reports. Please try again later.");
        } finally {
          setLoading(false);
        }
      } catch (error) {
        console.error("Error retrieving user data:", error);
        setLoading(false);
      }
    };
    
    getUserData();
  }, [reportType]);

  // Handle viewing patient history
  const handleViewHistory = async (patientId, type) => {
    setLoading(true);
    let url = "";
    let columns = [];
    let title = "";
  
    // Set URL and columns based on report type
    switch (type) {
      case "Blood Pressure":
        url = `http://192.168.1.20:5555/api/patient/getbloodpressurebypatient/${patientId}`;
        columns = bpColumns;
        title = "Blood Pressure History";
        break;
      case "Blood Sugar":
        url = `http://192.168.1.20:5555/api/patient/getbloodsugarbypatient/${patientId}`;
        columns = sugarColumns;
        title = "Blood Sugar History";
        break;
      case "FBC":
        url = `http://192.168.1.20:5555/api/patient/getfbcbypatient/${patientId}`;
        columns = fbcColumns;
        title = "FBC History";
        break;
      case "Lipid Profile":
        url = `http://192.168.1.20:5555/api/patient/getlipidbypatient/${patientId}`;
        columns = lipidColumns;
        title = "Lipid Profile History";
        break;
      default:
        setLoading(false);
        return;
    }
  
    try {
      const response = await axios.get(url);
      setPatientHistory(response.data);
      setSelectedPatientId(patientId);
      setSelectedColumns(columns);
      setModalTitle(title);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error fetching history:", error);
      Alert.alert("Error", "Failed to load patient history. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Handle comment submission
  const handleCommentSubmit = async (docId, comment, type) => {
    setLoading(true);
    let url = "";
  
    // Match backend routes per type
    switch (type) {
      case "Blood Pressure":
        url = `http://192.168.1.20:5555/api/patient/updatecomment/${docId}`;
        break;
      case "Blood Sugar":
        url = `http://192.168.1.20:5555/api/patient/updatebloodsugarcomment/${docId}`;
        break;
      case "FBC":
        url = `http://192.168.1.20:5555/api/patient/updatefbccomment/${docId}`;
        break;
      case "Lipid Profile":
        url = `http://192.168.1.20:5555/api/patient/updatelipidcomment/${docId}`;
        break;
      default:
        setLoading(false);
        return;
    }
  
    try {
      await axios.put(url, { comment });
      Alert.alert("Success", "Comment added successfully!");
      
      // Refresh data after comment is added
      if (user) {
        const refreshUrl = getRefreshUrl(type, user.doctornumber);
        const response = await axios.get(refreshUrl);
        setReports(response.data);
      }
    } catch (error) {
      console.error("Failed to add comment:", error);
      Alert.alert("Error", "Failed to add comment. Please try again later.");
    } finally {
      setLoading(false);
    }
  };
  
  // Helper function to get the refresh URL
  const getRefreshUrl = (type, doctornumber) => {
    switch (type) {
      case "Blood Pressure":
        return `http://192.168.1.20:5555/api/patient/getbloodpressurebydoc/${doctornumber}`;
      case "Blood Sugar":
        return `http://192.168.1.20:5555/api/patient/getbloodsugarbydoc/${doctornumber}`;
      case "Lipid Profile":
        return `http://192.168.1.20:5555/api/patient/getlipidbydoc/${doctornumber}`;
      case "FBC":
        return `http://192.168.1.20:5555/api/patient/getfbcbydoc/${doctornumber}`;
      default:
        return "";
    }
  };

  // Render different card content based on report type
  const renderCardContent = (item) => {
    switch (reportType) {
      case "Blood Pressure":
        return (
          <>
            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Systolic:</Text>
              <Text style={styles.dataValue}>{item.systolic} mmHg</Text>
            </View>
            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Diastolic:</Text>
              <Text style={styles.dataValue}>{item.diastolic} mmHg</Text>
            </View>
            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Pulse:</Text>
              <Text style={styles.dataValue}>{item.pulse} bpm</Text>
            </View>
          </>
        );
      
      case "Blood Sugar":
        return (
          <>
            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Type:</Text>
              <Text style={styles.dataValue}>{item.type}</Text>
            </View>
            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Value:</Text>
              <Text style={styles.dataValue}>{item.value} mg/dL</Text>
            </View>
          </>
        );
      
      case "FBC":
        return (
          <>
            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>haemoglobin:</Text>
              <Text style={styles.dataValue}>{item.haemoglobin} g/dL</Text>
            </View>
            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>WBC:</Text>
              <Text style={styles.dataValue}>{item.wbc} K/µL</Text>
            </View>
            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>platelet:</Text>
              <Text style={styles.dataValue}>{item.platelet} K/µL</Text>
            </View>
          </>
        );
      
      case "Lipid Profile":
        return (
          <>
            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>LDL:</Text>
              <Text style={styles.dataValue}>{item.ldl} mg/dL</Text>
            </View>
            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>HDL:</Text>
              <Text style={styles.dataValue}>{item.hdl} mg/dL</Text>
            </View>
            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Triglycerides:</Text>
              <Text style={styles.dataValue}>{item.triglycerides} mg/dL</Text>
            </View>
            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Cholesterol:</Text>
              <Text style={styles.dataValue}>{item.cholesterol} mg/dL</Text>
            </View>
          </>
        );
      
      default:
        return null;
    }
  };

  // Render a single report card
  const renderReportCard = ({ item }) => {
    const patientId =  item.patientId;
    
    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Patient ID: {patientId}</Text>
          <Text style={styles.cardDate}>{formatDate(item.date)}</Text>
        </View>
        
        <View style={styles.cardContent}>
          {renderCardContent(item)}
          
          {item.doctorComment && (
            <View style={styles.commentSection}>
              <Text style={styles.commentLabel}>Doctor's Comment:</Text>
              <Text style={styles.commentText}>{item.doctorComment}</Text>
            </View>
          )}
        </View>
        
        <View style={styles.cardActions}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => handleViewHistory(patientId, reportType)}
          >
            <MaterialIcons name="history" size={20} color="#0d9488" />
            <Text style={styles.actionText}>History</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => {
              setSelectedDocId(item.id);
              setSelectedReportType(reportType);
              setIsCommentModalOpen(true);
            }}
          >
            <MaterialIcons name="comment" size={20} color="#0d9488" />
            <Text style={styles.actionText}>Add Comment</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#b2f5ea" barStyle="dark-content" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Patient {reportType} Reports</Text>
      </View>
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0d9488" />
          <Text style={styles.loadingText}>Loading reports...</Text>
        </View>
      ) : (
        <View style={styles.contentContainer}>
          {reports.length > 0 ? (
            <FlatList
              data={reports}
              renderItem={renderReportCard}
              keyExtractor={(item) => item.id.toString()}
              contentContainerStyle={styles.listContainer}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <View style={styles.emptyContainer}>
              <MaterialIcons name="info-outline" size={48} color="#9ca3af" />
              <Text style={styles.emptyText}>No reports available</Text>
            </View>
          )}
        </View>
      )}
      
      {/* Modals for showing patient history and adding comments */}
      <PatientHistoryModal
        isVisible={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        historyData={patientHistory}
        patientId={selectedPatientId}
        columns={selectedColumns}
        title={modalTitle}
      />
      
      <AddCommentModal
        isVisible={isCommentModalOpen}
        onClose={() => setIsCommentModalOpen(false)}
        onSubmit={handleCommentSubmit}
        docId={selectedDocId}
        reportType={selectedReportType}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#b2f5ea',
  },
  header: {
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    margin: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
  },
  contentContainer: {
    flex: 1,
    paddingBottom: 20,
  },
  listContainer: {
    padding: 16,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f0fdfa',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f766e',
  },
  cardDate: {
    fontSize: 14,
    color: '#4b5563',
  },
  cardContent: {
    padding: 16,
  },
  dataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  dataLabel: {
    fontSize: 15,
    color: '#4b5563',
    fontWeight: '500',
  },
  dataValue: {
    fontSize: 15,
    color: '#1f2937',
    fontWeight: '600',
  },
  commentSection: {
    marginTop: 12,
    padding: 10,
    backgroundColor: '#f8fafc',
    borderRadius: 6,
  },
  commentLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748b',
    marginBottom: 4,
  },
  commentText: {
    fontSize: 14,
    color: '#334155',
    fontStyle: 'italic',
  },
  cardActions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
  },
  actionText: {
    marginLeft: 6,
    fontSize: 14,
    color: '#0d9488',
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#0d9488',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 16,
    color: '#9ca3af',
  }
});

export default ViewReports;