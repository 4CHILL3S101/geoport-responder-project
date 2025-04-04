import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Dimensions, TextInput } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Feather } from '@expo/vector-icons'; // If using Expo, or use another icon library

export default function HomePage() {
  // Add state for progress status modal and search
  const [modalVisible, setModalVisible] = useState(false);
  const [currentStatus, setCurrentStatus] = useState('Change Progress');
  const [searchText, setSearchText] = useState('');
  
  // Initial map region (you can set this to your desired location)
  const [region, setRegion] = useState({
    latitude: 14.5995, // This appears to be near Malaybalay based on your image
    longitude: 121.0164,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  
  const statusOptions = [
    'Resolved', 
    'Under Construction', 
    'On-going', 
    'Pending'
  ];

  const handleStatusChange = (status) => {
    setCurrentStatus(status);
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      {/* Interactive MapView */}
      <MapView
        style={styles.map}
        region={region}
        onRegionChangeComplete={setRegion}
      >
        {/* You can add markers here */}
        <Marker
          coordinate={{ latitude: 14.5995, longitude: 121.0164 }}
          title="Microhotel"
          description="Location marker"
        />
      </MapView>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <Feather name="search" size={20} color="#999" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for a place around Malaybalay"
            placeholderTextColor="#999"
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>
      </View>

      {/* Change Progress Button */}
      <TouchableOpacity 
        style={styles.progressButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.buttonText}>{currentStatus}</Text>
      </TouchableOpacity>
      
      {/* Modal for status options */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Select Status</Text>
            
            {statusOptions.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={styles.optionButton}
                onPress={() => handleStatusChange(option)}
              >
                <Text style={styles.optionText}>{option}</Text>
              </TouchableOpacity>
            ))}
            
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  // Search bar styles
  searchContainer: {
    position: 'absolute',
    top: 40,
    left: 20,
    right: 20,
    zIndex: 1,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#333',
  },
  // Styles for the progress button and modal
  progressButton: {
    backgroundColor: '#FF8D3F',
    padding: 15,
    borderRadius: 8,
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    marginBottom: 15,
    textAlign: 'center',
  },
  optionButton: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  optionText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
  },
  cancelButton: {
    marginTop: 15,
    padding: 15,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelText: {
    fontFamily: 'Poppins-Medium',
    color: '#FF8D3F',
  }
});