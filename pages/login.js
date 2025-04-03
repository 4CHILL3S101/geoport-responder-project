import React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Dimensions, StyleSheet, Text, TextInput, TouchableOpacity, View, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SvgXml } from 'react-native-svg';
import { onAuthStateChanged } from "firebase/auth";
import UserController from "../functions/userController"
import { useFonts, Poppins_600SemiBold, Poppins_700Bold, Poppins_400Regular, Poppins_500Medium } from '@expo-google-fonts/poppins';

import Mylogo from '../images/Geo.svg';
import Tagline from '../images/Sibya.svg';

export default function LoginPage({ navigation }) {
  const { width, height } = Dimensions.get("window");
  const { register, handleLogin, setValue, watch } = useForm({ mode: "onChange" });

  const email = watch("email", "");
  const password = watch("password", "");
  
  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isDisabled = !isValidEmail(email) || password.length < 6;

  const [fontsLoaded] = useFonts({
    Poppins_600SemiBold,
    Poppins_700Bold,
    Poppins_400Regular,
    Poppins_500Medium,
  });

  if (!fontsLoaded) {
    return <Text>Loading...</Text>; 
  }

    async function handleLogin(email,password) {
     const isloginSuccessful =  await UserController.signinController(email,password)
        if(isloginSuccessful){
          navigation.navigate('homepage')
        }else{
          return
        }
    }


  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent={true} />
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps='handled' showsVerticalScrollIndicator={false}>
    
        <SafeAreaView style={styles.innerContainer}>
          <View style={styles.logoContainer}>
            <SvgXml xml={Mylogo} width={width * 0.7} height={height * 0.2} />
            <SvgXml xml={Tagline} width={width * 0.6} height={height * 0.07} style={styles.tagline} />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email Address</Text>
            <TextInput 
              style={styles.input} 
              keyboardType="email-address" 
              placeholder="example@gmail.com" 
              placeholderTextColor="#A9A9A9"
              autoCapitalize="none"
              autoCorrect={false}
            />
            <Text style={styles.label}>Password</Text>
            <TextInput 
              style={styles.input} 
              secureTextEntry 
              placeholder="********" 
              placeholderTextColor="#A9A9A9"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <TouchableOpacity style={styles.loginButton} onPress={() => handleLogin } >
            <Text style={styles.loginText}>Login</Text>
          </TouchableOpacity>

        </SafeAreaView>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#FEFEFE", 
  },
  scrollContainer: { 
    flexGrow: 1, 
    justifyContent: "center", 
    alignItems: "center" 
  },
  innerContainer: { 
    alignItems: "center", 
    width: "90%" 
  },
  logoContainer: { 
    alignItems: "center", 
    justifyContent: "center", 
    marginBottom: 50 
  },
  tagline: { marginTop: -5 },
  inputContainer: { width: "97%" },
  label: { 
    fontFamily: 'Poppins_500Medium', 
    color: "gray", 
    marginBottom: 5 
  },
  input: {
    backgroundColor: "#FDFDFD",
    height: 50,
    width: "100%",
    paddingHorizontal: 16,
    borderRadius: 30,
    borderColor: "rgba(169, 169, 169, 0.5)",
    borderWidth: 1.5,
    fontFamily: "Poppins_400Regular",
    fontSize: 16,
    marginBottom: 15,
  },
  loginButton: {
    backgroundColor: "#FA812F",
    borderRadius: 30,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    width: "97%",
    marginBottom: 20,
  },
  loginText: { 
    fontSize: 18, 
    fontFamily: "Poppins_500Medium", 
    color: "white" 
  },
  forgotPassword: {
    fontFamily: "Poppins_500Medium", 
    color: "#FA812F", 
    fontSize: 12, 
    textAlign: "center", 
    marginTop: 60, 
    marginBottom: 20,
  },
});
