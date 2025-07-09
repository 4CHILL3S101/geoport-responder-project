import React from 'react';
import { Text, Modal, View, ActivityIndicator, StyleSheet } from 'react-native';

const LoadingModal = ({ open }) => {
  return (
    <Modal
      visible={open}
      transparent={true}
      animationType="fade"
    >
      <View style={styles.modalBackground}>
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#FF8D3F" />
          <Text style={styles.loadingText}>Please wait while we fetch the data...</Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderContainer: {
    backgroundColor: '#fff',
    padding: 25,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 200,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  loadingText: {
    marginTop: 15,
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
});

export default LoadingModal;
