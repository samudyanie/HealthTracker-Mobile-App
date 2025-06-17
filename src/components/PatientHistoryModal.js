import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  ScrollView,
  Dimensions 
} from 'react-native';

const PatientHistoryModal = ({ 
  isVisible, 
  onClose, 
  historyData, 
  patientId, 
  columns, 
  title 
}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{title}</Text>
            <Text style={styles.patientId}>Patient ID: {patientId}</Text>
          </View>
          
          <ScrollView style={styles.tableContainer}>
            {/* Header Row */}
            <View style={styles.tableHeader}>
              {columns.map((column) => (
                <Text key={column.key} style={styles.headerCell}>
                  {column.label}
                </Text>
              ))}
            </View>
            
            {/* Data Rows */}
            {historyData.length > 0 ? (
              historyData.map((item, index) => (
                <View key={index} style={[
                  styles.dataRow,
                  index % 2 === 0 ? styles.evenRow : styles.oddRow
                ]}>
                  {columns.map((column) => (
                    <Text key={`${index}-${column.key}`} style={styles.dataCell}>
                      {column.format && item[column.key] 
                        ? column.format(item[column.key]) 
                        : (item[column.key] || '-')}
                    </Text>
                  ))}
                </View>
              ))
            ) : (
              <View style={styles.noDataContainer}>
                <Text style={styles.noDataText}>No history data available</Text>
              </View>
            )}
          </ScrollView>
          
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: windowWidth * 0.9,
    maxHeight: '80%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    paddingBottom: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  patientId: {
    fontSize: 14,
    color: '#4b5563',
    marginTop: 4,
  },
  tableContainer: {
    maxHeight: '70%',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    padding: 8,
    borderRadius: 6,
  },
  headerCell: {
    flex: 1,
    fontWeight: '600',
    fontSize: 14,
    color: '#4b5563',
    padding: 4,
  },
  dataRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    padding: 8,
  },
  evenRow: {
    backgroundColor: '#ffffff',
  },
  oddRow: {
    backgroundColor: '#f9fafb',
  },
  dataCell: {
    flex: 1,
    fontSize: 14,
    color: '#1f2937',
    padding: 4,
  },
  noDataContainer: {
    padding: 20,
    alignItems: 'center',
  },
  noDataText: {
    fontSize: 16,
    color: '#6b7280',
  },
  closeButton: {
    backgroundColor: '#0d9488',
    borderRadius: 8,
    padding: 12,
    marginTop: 16,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default PatientHistoryModal;