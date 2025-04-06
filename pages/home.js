import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Dimensions, TextInput, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Feather } from '@expo/vector-icons'; 
import { StatusBar } from 'expo-status-bar';
import ReportController from '../functions/reportController';
import { auth } from '../firebaseConfig';   

export default function HomePage() {
  const fetchFunction = new ReportController();
  const [modalVisible, setModalVisible] = useState(false);
  const [currentStatus, setCurrentStatus] = useState('Select pin to update status');
  const [searchText, setSearchText] = useState('');
  const [isButtonClicked, setIsButtonClicked] = useState(true); // set default as false
  const [reportData, setReportData] = useState([]);
  const [selectedStatus, setUpdatedStatus] = useState('');
  const [reportId, setReportId] = useState('');
  const [selectedReportType, setSelectedReportType] = useState('')
  const [region, setRegion] = useState({
    latitude: 8.151914, 
    longitude: 125.128926,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const RoadDefectstatusOptions = [
    'Resolved', 
    'Under Construction', 
    'False Report'
  ];


  const RoadCollisionstatusOptions = [
    'Resolved', 
    'On going', 
    'False Report'
  ]

  const handleStatusChange = (report_id) => {
    setReportId(report_id); 
    setIsButtonClicked(false); 
    setCurrentStatus(selectedStatus); 
  };

  const getStatusOptions = (type) => {
    if (type === 'road defects') {
      return RoadDefectstatusOptions;
    } else {
      return RoadCollisionstatusOptions;
    }
  };
  

  function handleConfirmation(status) {
    Alert.alert(
      'Update Report',
      `Are you sure you want to change the status to ${status}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'OK', onPress: () => handleUpdateReport(reportId, status) },
      ]
    );
  }

  async function handleUpdateReport(reportId, status) {
    try {
      await fetchFunction.updateReport(reportId, status);
      console.log('Report updated successfully!');
      setIsButtonClicked(true); 
    } catch (error) {
      console.error('Error updating report:', error);
      setIsButtonClicked(true); 
    }
  }

  useEffect(() => {
    const user = auth.currentUser;
        if (!user) {
            console.error('User not logged in');
            return;
        }
        const fetchData = async () => {
          await fetchFunction.fetchReport(setReportData);
        };
        fetchData();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="light" hidden={true} />

      <MapView style={styles.map} region={region} onRegionChangeComplete={setRegion}>
        {reportData.map((report, index) => (
          <Marker key={index}
            coordinate={{
              latitude: parseFloat(report.latitude),
              longitude: parseFloat(report.longitude)
            }}
            pinColor={report.type === 'vehicle collision' ? 'blue' : 'red'}
            title={report.type}
            description={report.status}
            onPress={() => {handleStatusChange(report.report_id) , setCurrentStatus(report.status) ,   setSelectedReportType(report.type);}}
          />
        ))}
      </MapView>

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

      <TouchableOpacity 
        style={[styles.progressButton, { backgroundColor: isButtonClicked ? '#9AA6B2' : '#FF8D3F' }]}  
        disabled={isButtonClicked}
        onPress={() => {
          setModalVisible(true); 
        }}
      >
        <Text style={styles.buttonText}>{currentStatus}</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Select Status</Text>
            
            {getStatusOptions(selectedReportType).map((option, index) => (
              <TouchableOpacity
                key={index}
                style={styles.optionButton}
                onPress={() => {
                  setUpdatedStatus(option); 
                  setModalVisible(false); 
                  handleConfirmation(option); 
                }}
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
  progressButton: {
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
      height: 2,
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
