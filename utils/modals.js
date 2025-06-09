import React, { Component } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import LottieView from "lottie-react-native";

export default class DisplayModal extends Component {
  showReportData(report) {
    return (
      <View>
        <Text style={styles.modalTitle}>Report Details</Text>
        <Text style={styles.modalText}>Type: {report.type}</Text>
        <Text style={styles.modalText}>Reporter: {report.reporter}</Text>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => this.props.setModalVisible(false)}
        >
          <Text>Close</Text>
        </TouchableOpacity>
      </View>
    );
  }

  showSuccessModal() {
    return (
      <View>
        <Text style={styles.modalTitle}>Success!</Text>
        <Text style={styles.modalText}>
          Your response has been recorded successfully.
        </Text>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => this.props.setModalVisible(false)}
        >
          <Text>Close</Text>
        </TouchableOpacity>
      </View>
    );
  }
  render() {
    const { visible, onResponse, mode, clicked, report } = this.props;

    return (
      <Modal transparent animationType="fade" visible={visible}>
        <View style={styles.overlay}>
          <View style={styles.modalContainer}>
            {clicked && (
              <LottieView
                source={require("../assets/hand_loading.json")}
                autoPlay
                loop
                style={{ width: 140, height: 140 }}
              />
            )}
            {mode === "report" ? (
              this.showReportData(report)
            ) : (
              <>
                <Text style={styles.title}>
                  Based on your inspection, is the road passable?
                </Text>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    disabled={clicked}
                    style={[styles.button, styles.noButton]}
                    onPress={() => onResponse("false")}
                  >
                    <Text style={styles.noButtonText}> No </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    disabled={clicked}
                    style={[styles.button, styles.yesButton]}
                    onPress={() => onResponse("true")}
                  >
                    <Text style={styles.buttonText}>Yes</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "#000000aa",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "#FFF",
    padding: 24,
    borderRadius: 5,
    width: "80%",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "normal",
    marginBottom: 20,
    color: "#333",
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    gap: 16,
  },
  noButtonText: {
    color: "#FF8D3F",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
  },
  button: {
    paddingVertical: 12,
    width: "45%",
    paddingHorizontal: 24,
    borderRadius: 5,
  },
  yesButton: {
    backgroundColor: "#FF8D3F",
    borderColor: "#FF8D3F",
    borderWidth: 2,
    color: "white",
  },
  noButton: {
    backgroundColor: "#FFF",
    borderColor: "#FF8D3F",
    borderWidth: 2,
    color: "black",
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
  },
  modalTitle: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 20,
    marginBottom: 15,
    textAlign: "center",
    color: "#333",
  },
  modalText: {
    fontFamily: "Poppins-Regular",
    fontSize: 16,
    color: "#555",
    marginBottom: 10,
  },
  closeButton: {
    marginTop: 20,
    paddingVertical: 10,
    backgroundColor: "#FF8D3F",
    borderRadius: 8,
    alignItems: "center",
  },
});
