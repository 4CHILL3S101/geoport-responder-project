import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';

export default class DisplayModal extends Component {
  showReportData(report) {
    return (
      <View>
        <Text style={styles.modalTitle}>Report Details</Text>
        <Text style={styles.modalText}>Type: {report.type}</Text>
        <Text style={styles.modalText}>Reporter: {report.reporter}</Text>
        <TouchableOpacity style={styles.closeButton} onPress={() => this.props.setModalVisible(false)}>
          <Text>Close</Text>
        </TouchableOpacity>
      </View>
    );
  }

  render() {
    const { visible, onResponse, mode, report } = this.props;
  
    return (
      <Modal transparent animationType="fade" visible={visible}>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {mode === 'report' ? (
            this.showReportData(report)
          ) : (
            <>
              <Text style={styles.title}>Is the road passable?</Text>
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[styles.button, styles.yesButton]}
                  onPress={() => onResponse("true")}
                >
                  <Text style={styles.buttonText}>Yes</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.noButton]}
                  onPress={() => onResponse("false")}
                >
                  <Text style={styles.buttonText}>No</Text>
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
    backgroundColor: '#000000aa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#FFF',
    padding: 24,
    borderRadius: 20,
    width: '80%',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  button: {
    backgroundColor: '#FF8D3F',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
  },
  noButton: {
    backgroundColor: '#d4631b',
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 20,
    marginBottom: 15,
    textAlign: 'center',
    color: '#333',
  },
  modalText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: '#555',
    marginBottom: 10,
  },
  closeButton: {
    marginTop: 20,
    paddingVertical: 10,
    backgroundColor: '#FF8D3F',
    borderRadius: 8,
    alignItems: 'center',
  },
});
