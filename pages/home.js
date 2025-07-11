import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import ReportController from "../functions/reportController";
import { auth } from "../firebaseConfig";
import DisplayModal from "../utils/modals";
import DisplayResponseModal from "../utils/responseModal";
import MapboxGL from '@rnmapbox/maps';
import {MAPBOX_API} from '@env';
import LoadingModal from "../utils/loadingModal"

MapboxGL.setAccessToken(MAPBOX_API);
export default function HomePage() {
  const fetchFunction = new ReportController();
  const navigation = useNavigation();
  const [data, setData] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [passableModal, setPassableModal] = useState(false);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const [responseModalStatus, setResponseModalStatus] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [responseModalVisibility, setResponseModalVisibility] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(
    "Select pin to update status"
  );
  const [isUpdating, setIsUpdating] = useState(false);
  const [isButtonClicked, setIsButtonClicked] = useState(true);
  const [reportData, setReportData] = useState([]);
  const [selectedStatus, setUpdatedStatus] = useState("");
  const [currentVersion, setCurrentVersion] = useState("");
  const [report_id, setReportId] = useState("");
  const [selectedReportType, setSelectedReportType] = useState("");
  const hideResponseModal = () => {
    setResponseModalVisibility(false);
  };
  const [region, setRegion] = useState({
    latitude: 8.151914,
    longitude: 125.128926,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const RoadDefectstatusOptions = [
    "Resolved",
    "Under Construction",
    "False Report",
  ];

  const RoadCollisionstatusOptions = ["Resolved", "On going", "False Report"];

  const handleStatusChange = () => {
    setIsButtonClicked(false);
    setCurrentStatus(selectedStatus);
  };

  const getStatusOptions = (type) => {
    if (type === "road defects") {
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
      Alert.alert("Logout successful!","You have been logged out successfully.");
      navigation.navigate("Loginpage");
    } catch (error) {
      console.error("Error logging out:", error);
    }
    setLogoutModalVisible(false);
  };

  function handleConfirmation(status) {
    Alert.alert(
      "Update Report",
      `Are you sure you want to change the status to ${status}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "OK",
          onPress: () => {
            setUpdatedStatus(status);
            setPassableModal(true);
          },
        },
      ]
    );
  }

  async function handleUpdateReport(
    report_id,
    currentStatus,
    value,
    currentVersion
  ) {
    try {
      setIsUpdating(true);
      await fetchFunction.updateReport({
        report_id,
        currentStatus,
        value,
        currentVersion,
        setResponseModalStatus,
        setResponseMessage,
      });
      setReportData((prevData) =>
        prevData.map((report) =>
          report.report_id === report_id
            ? { ...report, status: currentStatus }
            : report
        )
      );
    } catch (error) {
      setResponseModalStatus(true);
      setResponseMessage(error);
    } finally {
      setResponseModalVisibility(!responseModalVisibility);
      setIsButtonClicked(!isButtonClicked);
      setIsUpdating(false);
      setPassableModal(false);
      setRefresh(!refresh);
    }
  }

  useEffect(() => {
    setData(true)
    const user = auth.currentUser;
    if (!user) {
      return;
    }
    const fetchData = async () => {
      await fetchFunction.fetchReport(setReportData);
     setData(true);
    };

    fetchData();
  }, [refresh]);

  return (
    <View style={styles.container}>
      <StatusBar style="light" hidden={true} />
      {reportData.length > 1 ? (
         <MapboxGL.MapView
      style={styles.map}
      styleURL={MapboxGL.StyleURL.Street}
    onCameraChanged={(e) => {
      const coords = e.centerCoordinate;
      if (coords) {
        setRegion({
          ...region,
          latitude: coords[1],
          longitude: coords[0],
        });
      }
    }}

    >
      <MapboxGL.Camera
        centerCoordinate={[region.longitude, region.latitude]}
        zoomLevel={11}
      />

      {reportData.map((report) => (
        <MapboxGL.PointAnnotation
          key={report.report_id}
          id={report.report_id.toString()}
          coordinate={[parseFloat(report.longitude), parseFloat(report.latitude)]}
        onSelected={() => {
        setIsButtonClicked(false);
        setCurrentStatus(report.status);
        setReportId(report.report_id);
        setSelectedReportType(report.type);
        setCurrentVersion(report.version);
      }}

        >
          <View
            style={{
              width: 20,
              height: 20,
              borderRadius: 10,
              backgroundColor:
                report.type === 'vehicle collision' ? 'red' : 'yellow',
              borderWidth: 2,
              borderColor: '#fff',
            }}
          />
        </MapboxGL.PointAnnotation>
      ))}
        </MapboxGL.MapView>
      ) : (
         <LoadingModal open={data}/>
         )}
    
      
       
    
      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <View style={styles.legendItem}>
            <View style={[styles.legendColorBox, { backgroundColor: "red" }]} />
            <Text style={styles.legendLabel}>Vehicle Collision</Text>
          </View>
          <View style={styles.legendItem}>
            <View
              style={[styles.legendColorBox, { backgroundColor: "yellow" }]}
            />
            <Text style={styles.legendLabel}>Road Defect</Text>
          </View>
        </View>
      </View>

      <View style={styles.bottomButtonsContainer}>
        <TouchableOpacity
          style={[
            styles.progressButton,
            { backgroundColor: isButtonClicked ? "#9AA6B2" : "#FF8D3F" },
          ]}
          disabled={isButtonClicked}
          onPress={() => {
            setModalVisible(true);
          }}
        >
          <Text style={styles.buttonText}>{currentStatus}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Feather name="log-out" size={24} color="white" />
        </TouchableOpacity>
      </View>

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
        clicked={isUpdating}
        onResponse={(value) => {
          handleUpdateReport(report_id, selectedStatus, value, currentVersion);
        }}
      />

      <DisplayResponseModal
        visible={responseModalVisibility}
        onClose={hideResponseModal}
        status={responseModalStatus}
        message={responseMessage}
      />

      <Modal
        animationType="fade"
        transparent={true}
        visible={logoutModalVisible}
        onRequestClose={() => setLogoutModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.logoutModal}>
            <Feather
              name="alert-circle"
              size={48}
              color="#FF8D3F"
              style={{ marginBottom: 15 }}
            />
            <Text style={styles.logoutTitle}>Log Out</Text>
            <Text style={styles.logoutMessage}>
              Are you sure you want to log out?
            </Text>

            <View style={styles.logoutActions}>
              <TouchableOpacity
                style={[
                  styles.logoutButtonStyled,
                  { backgroundColor: "#FF8D3F" },
                ]}
                onPress={confirmLogout}
              >
                <Text style={styles.logoutButtonText}>Yes, Log Out</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.logoutButtonStyled,
                  { backgroundColor: "#E5E5E5" },
                ]}
                onPress={() => setLogoutModalVisible(false)}
              >
                <Text style={[styles.logoutButtonText, { color: "#333" }]}>
                  Cancel
                </Text>
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
    backgroundColor: "#f5f5f5",
  },
  map: {
  flex: 1,
},
  searchContainer: {
    position: "absolute",
    alignItems: "center",
    top: 40,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    borderRadius: 8,
    width: "90%",
    padding: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  bottomButtonsContainer: {
    position: "absolute",
    bottom: 30,
    left: 20,
    right: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  progressButton: {
    padding: 15,
    borderRadius: 8,
    flex: 1,
    marginRight: 10,
    alignItems: "center",
  },
  logoutButton: {
    backgroundColor: "#FF8D3F",
    padding: 15,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    width: 56,
    height: 56,
  },
  buttonText: {
    color: "white",
    fontFamily: "Poppins-Medium",
    fontSize: 16,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    width: "80%",
    maxWidth: 400,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 18,
    marginBottom: 15,
    textAlign: "center",
  },
  logoutModal: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 25,
    alignItems: "center",
    width: "85%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },

  logoutTitle: {
    fontSize: 20,
    fontFamily: "Poppins-SemiBold",
    color: "#333",
    marginBottom: 8,
  },

  logoutMessage: {
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    textAlign: "center",
    color: "#555",
    marginBottom: 25,
  },

  logoutActions: {
    width: "100%",
    flexDirection: "column",
    gap: 10,
  },

  logoutButtonStyled: {
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },

  logoutButtonText: {
    fontSize: 16,
    fontFamily: "Poppins-Medium",
    color: "#fff",
  },

  optionButton: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },
  optionText: {
    fontFamily: "Poppins-Regular",
    fontSize: 16,
  },
  cancelButton: {
    marginTop: 15,
    padding: 15,
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    alignItems: "center",
  },
  cancelText: {
    fontFamily: "Poppins-Medium",
    color: "#FF8D3F",
  },
  logoutModalView: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    margin: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  logoutModalText: {
    fontFamily: "Poppins-Medium",
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  logoutButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  logoutModalButton: {
    flex: 1,
    backgroundColor: "#FF8D3F",
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
    margin: 5,
  },
  logoutModalButtonText: {
    fontFamily: "Poppins-Medium",
    color: "white",
    fontSize: 16,
  },
  legendContainer: {
    position: "absolute",
    bottom: 100,
    left: 20,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    padding: 10,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  legendTitle: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 14,
    marginBottom: 6,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    margin: 8,
  },
  legendColorBox: {
    width: 16,
    height: 16,
    borderRadius: 3,
    marginRight: 8,
  },
  legendLabel: {
    fontFamily: "Poppins-Regular",
    fontSize: 13,
    color: "#333",
  },
});
