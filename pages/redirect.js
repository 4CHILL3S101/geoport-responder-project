import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { auth } from '../firebaseConfig';
import { useNavigation } from "@react-navigation/native";
import LottieView from 'lottie-react-native';
import noauthapi from "../utils/noauth/noauthapi";
import { CHECK_USER_VALIDITY } from "@env";

export default function RedirectPage() {
    const navigation = useNavigation();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (user) {
                try {
                    const id = user.uid;
                    const url = `${CHECK_USER_VALIDITY}/${id}`;
                    const token = await user.getIdToken();

                    const response = await noauthapi.post(url, {}, {
                        headers: { Authorization: `Bearer ${token}` }
                    });

                    if (response?.data?.status === "success") {
                        navigation.reset({
                            index: 0,
                            routes: [{ name: 'homepage' }],
                        });
                    } else {
                        await auth.signOut();
                        navigation.reset({
                            index: 0,
                            routes: [{ name: 'Loginpage' }],
                        });
                    }
                } catch (error) {
                    console.error("Backend validation error:", error);
                    await auth.signOut();
                    navigation.reset({
                        index: 0,
                        routes: [{ name: 'Loginpage' }],
                    });
                }
            } else {
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'Loginpage' }],
                });
            }
            setLoading(false);
        });

        return () => unsubscribe();
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
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
    animation: { width: 200, height: 200 }
});
