import React from "react";
import { Modal, View, Text, StyleSheet } from "react-native";
import LottieView from "lottie-react-native";

export default function NoInternetModal({ visible }) {
  return (
    <Modal transparent animationType="fade" visible={visible}>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>No Internet Connection</Text>

          <LottieView
            source={require("../assets/no_internet.json")}
            autoPlay
            loop
            style={{ width: 140, height: 140, marginVertical: 20 }}
          />

          <Text style={styles.message}>
            It looks like you're offline. Please check your Wi-Fi or mobile data
            to reconnect and continue using the app.
          </Text>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FF8D3F",
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
    marginVertical: 10,
  },
  closeButton: {
    marginTop: 15,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#FF8D3F",
    borderRadius: 8,
  },
  closeButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
