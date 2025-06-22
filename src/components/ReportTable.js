import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  FlatList
} from 'react-native';

const ReportTable = ({ columns, data, onViewHistory, onAddComment }) => {
  
  // Render a single row item
  const renderItem = ({ item, index }) => (
    <View style={[
      styles.row, 
      index % 2 === 0 ? styles.evenRow : styles.oddRow
    ]}>
      {/* Render each cell based on columns definition */}
      {columns.map((column) => (
        <View key={`cell-${column.key}`} style={styles.cell}>
          <Text style={styles.cellText} numberOfLines={1}>
            {column.format && item[column.key] 
              ? column.format(item[column.key]) 
              : (item[column.key] || '-')}
          </Text>
        </View>
      ))}
      
      {/* Action buttons */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={[styles.actionButton, styles.viewButton]}
          onPress={() => onViewHistory(item)}
        >
          <Text style={styles.viewButtonText}>History</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.actionButton, styles.commentButton]}
          onPress={() => onAddComment(item)}
        >
          <Text style={styles.commentButtonText}>Comment</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
  
  // Render the table header
  const renderHeader = () => (
    <View style={styles.headerRow}>
      {columns.map((column) => (
        <View key={`header-${column.key}`} style={styles.headerCell}>
          <Text style={styles.headerText}>{column.label}</Text>
        </View>
      ))}
      <View style={styles.headerActionCell}>
        <Text style={styles.headerText}>Actions</Text>
      </View>
    </View>
  );
  
  return (
    <View style={styles.container}>
      {data && data.length > 0 ? (
        <>
          {renderHeader()}
          <FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={(item, index) => `row-${index}`}
            scrollEnabled={true}
            style={styles.flatList}
            contentContainerStyle={styles.flatListContent}
          />
        </>
      ) : (
        <View style={styles.noDataContainer}>
          <Text style={styles.noDataText}>No reports available</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerCell: {
    flex: 1,
    padding: 4,
  },
  headerActionCell: {
    width: 160,
    padding: 4,
  },
  headerText: {
    fontWeight: '600',
    fontSize: 14,
    color: '#4b5563',
  },
  flatList: {
    maxHeight: 400, // Limit height on larger screens
  },
  flatListContent: {
    flexGrow: 1,
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    alignItems: 'center',
  },
  evenRow: {
    backgroundColor: '#ffffff',
  },
  oddRow: {
    backgroundColor: '#f9fafb',
  },
  cell: {
    flex: 1,
    padding: 4,
  },
  cellText: {
    fontSize: 14,
    color: '#1f2937',
  },
  actionsContainer: {
    width: 160,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 8,
  },
  actionButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewButton: {
    backgroundColor: '#3b82f6',
    marginRight: 4,
  },
  commentButton: {
    backgroundColor: '#10b981',
    marginLeft: 4,
  },
  viewButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  commentButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  noDataContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    backgroundColor: '#f9fafb',
  },
  noDataText: {
    fontSize: 16,
    color: '#6b7280',
  },
});

export default ReportTable;