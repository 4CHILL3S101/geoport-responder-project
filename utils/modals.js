import { View, Text, TouchableOpacity,StyleSheet  } from 'react-native';


export default class DisplayModal{

     showReportData(report){
        return(
            <View >
                <Text style={styles.modalTitle}>Report Details</Text>
                <Text style={styles.modalText}>Type: {report.type}</Text>
                <Text style={styles.modalText}>Reporter: {report.reporter}</Text>
                <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => setModalVisible(false)}
                >
                    <Text>Close</Text>
                </TouchableOpacity>
            </View>
        )
    }



}



const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', 
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        width: '80%',
        maxWidth: 400,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 5,
    },
    modalTitle: {
        fontFamily: 'Poppins-SemiBold', 
        fontSize: 20,
        marginBottom: 15,
        textAlign: 'center',
        color: '#333',
    },
    modalText: {
        fontFamily: 'Poppins-Regular', // Add your preferred font
        fontSize: 16,
        color: '#555',
        marginBottom: 10,
    },
    closeButton: {
        marginTop: 20,
        paddingVertical: 10,
        backgroundColor: '#FF8D3F', // Button color
        borderRadius: 8,
        alignItems: 'center',
    },
    closeButtonText: {
        fontFamily: 'Poppins-Medium', // Add your preferred font
        fontSize: 16,
        color: 'white',
    }
});