import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';

export default function HomePage() {
  // Sample reports data
  const [reports] = useState([
    { id: '1', title: 'Report 1', description: 'Description of Report 1', date: '2025-04-01' },
    { id: '2', title: 'Report 2', description: 'Description of Report 2', date: '2025-03-25' },
    { id: '3', title: 'Report 3', description: 'Description of Report 3', date: '2025-03-15' },
    { id: '4', title: 'Report 4', description: 'Description of Report 4', date: '2025-03-10' },
    // Add more reports as needed
  ]);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Reports</Text>

      <FlatList
        data={reports}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.reportCard}>
            <Text style={styles.reportTitle}>{item.title}</Text>
            <Text style={styles.reportDescription}>{item.description}</Text>
            <Text style={styles.reportDate}>{item.date}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 10,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  reportCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3, // For Android shadow effect
  },
  reportTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  reportDescription: {
    fontSize: 14,
    color: '#777',
    marginVertical: 5,
  },
  reportDate: {
    fontSize: 12,
    color: '#999',
  },
});
