import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  ActivityIndicator,
  TouchableOpacity,
  Dimensions
} from 'react-native';
import axios from 'axios';

const apiMap = {
  "bloodpressure": "/getbloodpressurebypatient/",
  "bloodsugar": "/getbloodsugarbypatient/",
  "fbc": "/getfbcbypatient/",
  "lipid": "/getlipidbypatient/",
};

const columnMap = {
  bloodpressure: ["date", "systolic", "diastolic", "pulse", "doctorComment"],
  bloodsugar: ["date", "type", "value", "doctorComment"],
  fbc: ["date", "haemoglobin", "rbc", "wbc", "platelet", "doctorComment"],
  lipid: ["date", "hdl", "ldl", "triglycerides", "cholesterol", "doctorComment"],
};

const screenWidth = Dimensions.get('window').width;

const PatientReportList = ({ patientId, reportType }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedRow, setExpandedRow] = useState(null);

  useEffect(() => {
    if (!patientId || !reportType) {
      setLoading(false);
      return;
    }

    const endpoint = apiMap[reportType.toLowerCase()];
    if (!endpoint) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        // Use IP address instead of localhost for mobile
        const response = await axios.get(
          `http://172.20.10.7:5555/api/patient${endpoint}${patientId}`
        );
        setData(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching history:", err);
        setError("Failed to load report history");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [patientId, reportType]);

  const formatTitle = (text) => {
    return text.charAt(0).toUpperCase() + text.slice(1);
  };

  const toggleExpandRow = (index) => {
    setExpandedRow(expandedRow === index ? null : index);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#009688" />
        <Text style={styles.loadingText}>Loading reports...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (data.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>
          {formatTitle(reportType)} Report History
        </Text>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No report history available</Text>
        </View>
      </View>
    );
  }

  // For mobile, we'll use a card-based approach instead of a table
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {formatTitle(reportType)} Report History
      </Text>
      
      <ScrollView style={styles.scrollView}>
        {data.map((item, index) => (
          <TouchableOpacity 
            key={index} 
            style={styles.card}
            onPress={() => toggleExpandRow(index)}
            activeOpacity={0.7}
          >
            {/* Date always shown at the top */}
            <View style={styles.cardHeader}>
              <Text style={styles.dateText}>{item.date || 'No date'}</Text>
              <Text style={styles.expandIndicator}>
                {expandedRow === index ? '▲' : '▼'}
              </Text>
            </View>

            {/* Show first two data points in summary view */}
            <View style={styles.cardSummary}>
              {columnMap[reportType.toLowerCase()].slice(1, 3).map((field) => (
                <View key={field} style={styles.dataRow}>
                  <Text style={styles.fieldName}>{formatTitle(field)}:</Text>
                  <Text style={styles.fieldValue}>{item[field] || '-'}</Text>
                </View>
              ))}
            </View>

            {/* Show all fields when expanded */}
            {expandedRow === index && (
              <View style={styles.expandedContent}>
                {columnMap[reportType.toLowerCase()].slice(3).map((field) => (
                  <View key={field} style={styles.dataRow}>
                    <Text style={styles.fieldName}>{formatTitle(field)}:</Text>
                    <Text style={styles.fieldValue}>{item[field] || '-'}</Text>
                  </View>
                ))}
              </View>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white', 
    borderRadius: 10,
    padding: 16,
    marginTop: 16,
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#009688',
    marginBottom: 16,
  },
  scrollView: {
    maxHeight: 400,
  },
  card: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#009688',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  dateText: {
    fontWeight: '600',
    fontSize: 16,
    color: '#333',
  },
  expandIndicator: {
    color: '#009688',
    fontSize: 16,
  },
  cardSummary: {
    marginBottom: expandedRow => expandedRow ? 8 : 0,
  },
  expandedContent: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  dataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  fieldName: {
    fontWeight: '500',
    color: '#666',
    flex: 1,
  },
  fieldValue: {
    flex: 1,
    textAlign: 'right',
    color: '#333',
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
  },
  errorContainer: {
    padding: 20,
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  emptyText: {
    color: '#666',
  },
});

export default PatientReportList;