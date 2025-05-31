import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Dimensions, TextInput, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useNavigation } from "@react-navigation/native";
import { Feather } from '@expo/vector-icons'; 
import { StatusBar } from 'expo-status-bar';
import ReportController from '../functions/reportController';
import { auth } from '../firebaseConfig';   
import DisplayModal from  "../utils/modals"

export default function HomePage() {
  const fetchFunction = new ReportController();
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [passableModal,setPassableModal] = useState(false)
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const [currentStatus, setCurrentStatus] = useState('Select pin to update status');
  const [searchText, setSearchText] = useState('');
  const [isButtonClicked, setIsButtonClicked] = useState(true); 
  const [reportData, setReportData] = useState([]);
  const [selectedStatus, setUpdatedStatus] = useState('');
  const [currentVersion,seCurrentVersion] = useState('')
  const [reportId, setReportId] = useState('');
  const [selectedReportType, setSelectedReportType] = useState('')
  const [showPassable,setShowPassableModal] = useState(false)

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
  
  const handleLogout = () => {
    setLogoutModalVisible(true);
  };

  const confirmLogout = async () => {
    try {
      await auth.signOut();
      Alert.alert('Logout successful!');
      navigation.navigate('Loginpage');
    } catch (error) {
      console.error('Error logging out:', error);
    }
    setLogoutModalVisible(false);
  };

  function handleConfirmation(status) {
    Alert.alert(
      'Update Report',
      `Are you sure you want to change the status to ${status}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'OK', onPress: () =>setPassableModal(true) },
      ]
    );
  }

  async function handleUpdateReport(reportId, status,value,currentVersion) {
    try {
      await fetchFunction.updateReport(reportId, status,value,currentVersion);
      setIsButtonClicked(true);
      Alert('Success',"Report successfully updated") 
    } catch (error) {
     Alert('Error updating report:', error);
      setIsButtonClicked(true); 
    }finally{
      setPassableModal(false)
    }
  }

  useEffect(() => { 
    const user = auth.currentUser;
        if (!user) {
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
            onPress={() => {handleStatusChange(report.report_id) , setCurrentStatus(report.status) ,   setSelectedReportType(report.type);seCurrentVersion(report.version)}}
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

      <View style={styles.bottomButtonsContainer}>
        <TouchableOpacity 
          style={[styles.progressButton, { backgroundColor: isButtonClicked ? '#9AA6B2' : '#FF8D3F' }]}  
          disabled={isButtonClicked}
          onPress={() => {
            setModalVisible(true); 
          }}
        >
          <Text style={styles.buttonText}>{currentStatus}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Feather name="log-out" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Status Update Modal */}
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


      <DisplayModal
        visible={passableModal}
        mode="passable"
        onResponse={(value) => handleUpdateReport(reportId, selectedStatus,value) }
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={logoutModalVisible}
        onRequestClose={() => setLogoutModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.logoutModalView}>
            <Text style={styles.logoutModalText}>Are you sure you want to log out?</Text>
            
            <View style={styles.logoutButtonsContainer}>
              <TouchableOpacity
                style={styles.logoutModalButton}
                onPress={confirmLogout}
              >
                <Text style={styles.logoutModalButtonText}>Yes</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.logoutModalButton}
                onPress={() => setLogoutModalVisible(false)}
              >
                <Text style={styles.logoutModalButtonText}>No</Text>
              </TouchableOpacity>
            </View>
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
  bottomButtonsContainer: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressButton: {
    padding: 15,
    borderRadius: 8,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  logoutButton: {
    backgroundColor: '#FF8D3F',
    padding: 15,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    width: 56,
    height: 56,
  },
  buttonText: {
    color: 'white',
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center', // Change from 'flex-end' to 'center'
    alignItems: 'center', // Add this to center horizontally
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 20, // Change from borderTopLeftRadius/borderTopRightRadius to borderRadius
    padding: 20,
    width: '80%', // Add this to control the width
    maxWidth: 400, // Optional: prevent it from being too wide on larger screens
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
  },
  // Logout modal styles
  logoutModalView: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    margin: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  logoutModalText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  logoutButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  logoutModalButton: {
    flex: 1,
    backgroundColor: '#FF8D3F',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    margin: 5,
  },
  logoutModalButtonText: {
    fontFamily: 'Poppins-Medium',
    color: 'white',
    fontSize: 16,
  }
});