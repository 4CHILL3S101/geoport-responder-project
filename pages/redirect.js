import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { auth } from '../firebaseConfig';
import { useNavigation } from "@react-navigation/native";
import LottieView from 'lottie-react-native';

export default function RedirectPage() {
    const navigation = useNavigation();

    useEffect(() => {
        let unsubscribe;
    
        const timeout = setTimeout(() => {
            unsubscribe = auth.onAuthStateChanged((user) => {
                if (user) {
                    navigation.navigate('homepage');
                } else {
                    navigation.navigate('Loginpage');
                }
            });
        }, 5000);
    
        return () => {
            clearTimeout(timeout);
            if (unsubscribe) unsubscribe(); 
        };
    }, [navigation]);



    return (
        <View style={styles.container}>
            <LottieView
                source={require('../assets/loading-screen.json')} 
                autoPlay
                loop
                style={styles.animation}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff', 
    },
    animation: {
        width: 200,
        height: 200,
    },
});
