import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from "react-native";
import axios from "axios";

const apiMap = {
  "bloodpressure": "/getbloodpressurebypatient/",
  "bloodsugar": "/getbloodsugarbypatient/",
  "fbc": "/getfbcbypatient/",
  "lipid": "/getlipidbypatient/",
};

const labelMap = {
  bloodpressure: {
    date: "Date",
    systolic: "Systolic",
    diastolic: "Diastolic",
    pulse: "Pulse",
    doctorComment: "Doctor's Comment"
  },
  bloodsugar: {
    date: "Date",
    value: "Blood Sugar",
    type:"Type",
    doctorComment: "Doctor's Comment"
  
  },
  fbc: {
    date: "Date",
    haemoglobin: "Haemoglobin",
    rbc: "RBC",
    wbc: "WBC",
    platelet: "Platelet",
    doctorComment: "Doctor's Comment"
  },
  lipid: {
    date: "Date",
    hdl: "HDL",
    ldl: "LDL",
    triglycerides: "Triglycerides",
    cholesterol: "Cholesterol",
    doctorComment: "Doctor's Comment"
  }
};

const columnMap = {
  bloodpressure: ["date", "systolic", "diastolic", "pulse", "doctorComment"],
  bloodsugar: ["date", "value", "type","doctorComment"],
  fbc: ["date", "haemoglobin", "rbc", "wbc", "platelet", "doctorComment"],
  lipid: ["date", "hdl", "ldl", "triglycerides", "cholesterol", "doctorComment"],
};

const PatientReportList = ({ patientId, reportType }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expandedCardId, setExpandedCardId] = useState(null);

  useEffect(() => {
    if (!patientId || !reportType) return;
    const endpoint = apiMap[reportType.toLowerCase()];
    if (!endpoint) return;

    setLoading(true);
    setError(null);

    axios
      .get(`http://192.168.1.20:5555/api/patient${endpoint}${patientId}`)
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching history:", err);
        setError("No records found");
        setLoading(false);
      });
  }, [patientId, reportType]);

  const toggleCardExpansion = (index) => {
    if (expandedCardId === index) {
      setExpandedCardId(null);
    } else {
      setExpandedCardId(index);
    }
  };
  
  // Format date to be more readable
const formatDate = (dateString) => {
  if (!dateString) return "No date";
  
  try {
    let date;
    
    // Check if date is in YYYY.MM.DD format
    if (/^\d{4}\.\d{2}\.\d{2}$/.test(dateString)) {
      // Replace dots with hyphens for reliable parsing
      const reformattedDate = dateString.replace(/\./g, '-');
      date = new Date(reformattedDate);
    } else {
      // Handle other formats (YYYY-MM-DD or MM/DD/YYYY)
      date = new Date(dateString);
    }
    
    // Check if date is valid
    if (isNaN(date.getTime())) return dateString;
    
    // Format as "Month DD, YYYY" (e.g., "May 17, 2025")
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (error) {
    return dateString; // Return original if parsing fails
  }
};

  // Render a single card item
  const renderCard = ({ item, index }) => {
    if (!reportType) return null;
    
    const columns = columnMap[reportType.toLowerCase()] || [];
    const labels = labelMap[reportType.toLowerCase()] || {};
    const isExpanded = expandedCardId === index;
    
    // Get the date to display in the card header with better formatting
    const dateValue = formatDate(item.date);
    
    // Get main values to display in collapsed card (excluding date and doctor comment)
    const mainColumns = columns.filter(col => col !== 'date' && col !== 'doctorComment');
    
    return (
      <TouchableOpacity 
        style={styles.card} 
        onPress={() => toggleCardExpansion(index)}
        activeOpacity={0.8}
      >
        {/* Card Header with Date */}
        <View style={styles.cardHeader}>
          <Text style={styles.cardDate}>{dateValue}</Text>
          <Text style={styles.expandIcon}>{isExpanded ? '▼' : '▶'}</Text>
        </View>

        {/* Card Content */}
        <View style={styles.cardContent}>
          {!isExpanded ? (
            // Collapsed view - show only key values
            <View style={styles.collapsedContent}>
              {mainColumns.slice(0, 2).map((column) => (
                <View key={column} style={styles.valueRow}>
                  <Text style={styles.valueLabel}>{labels[column]}:</Text>
                  <Text style={styles.valueText}>{item[column] || "-"}</Text>
                </View>
              ))}
              {mainColumns.length > 2 && (
                <Text style={styles.moreIndicator}>Tap to see more details...</Text>
              )}
            </View>
          ) : (
            // Expanded view - show all values
            <View style={styles.expandedContent}>
              {columns.filter(col => col !== 'date').map((column) => (
                <View key={column} style={styles.valueRow}>
                  <Text style={styles.valueLabel}>{labels[column]}:</Text>
                  <Text style={[
                    styles.valueText, 
                    column === 'doctorComment' && styles.doctorComment
                  ]}>
                    {item[column] || "-"}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  // No longer need the ItemSeparator component since we're not using FlatList

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#26a69a" />
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {reportType ? reportType.replace(/^(\w)/, (c) => c.toUpperCase()) : ""} Report History
      </Text>
      
      {data.length === 0 ? (
        <Text style={styles.noDataText}>No records found</Text>
      ) : (
        <View style={styles.cardList}>
          {data.map((item, index) => (
            <View key={`card-container-${index}`}>
              {index > 0 && <View style={styles.separator} />}
              {renderCard({ item, index })}
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    marginTop: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: 350,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
    color: "#26a69a",
  },
  cardList: {
    paddingBottom: 8,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    overflow: "hidden",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#e0f2f1",
  },
  cardDate: {
    fontSize: 16,
    fontWeight: "600",
    color: "#00796b",
  },
  expandIcon: {
    fontSize: 16,
    color: "#00796b",
  },
  cardContent: {
    padding: 12,
  },
  collapsedContent: {
    paddingVertical: 4,
  },
  expandedContent: {
    paddingVertical: 4,
  },
  valueRow: {
    flexDirection: "row",
    paddingVertical: 4,
    flexWrap: "wrap",
  },
  valueLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#555",
    marginRight: 8,
    flex: 1,
  },
  valueText: {
    fontSize: 14,
    color: "#333",
    flex: 2,
  },
  doctorComment: {
    fontStyle: "italic",
    color: "#666",
  },
  moreIndicator: {
    fontSize: 12,
    color: "#26a69a",
    fontStyle: "italic",
    marginTop: 6,
    textAlign: "center",
  },
  separator: {
    height: 10,
  },
  loadingContainer: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  errorContainer: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  errorText: {
    color: "red",
    fontSize: 16,
  },
  noDataText: {
    textAlign: "center",
    color: "#666",
    padding: 20,
    fontSize: 16,
  },
});

export default PatientReportList;