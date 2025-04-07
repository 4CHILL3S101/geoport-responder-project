import React from "react";
import { useForm } from "react-hook-form";
import { Dimensions, StyleSheet, Text, TextInput, TouchableOpacity, View, ScrollView ,Alert} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect,useState } from "react";
import UserController from "../functions/userController";
import { useFonts, Poppins_600SemiBold, Poppins_700Bold, Poppins_400Regular, Poppins_500Medium } from '@expo-google-fonts/poppins';

// Correct import paths for SVG files
import NeoGeo from '../images/NewGeo.svg';
import Safekit from '../images/SafeKit.svg';



export default function LoginPage({ navigation }) {
  const { width, height } = Dimensions.get("window");
  const loginFunction = new UserController()

  const { register, handleSubmit, setValue, watch } = useForm({ mode: "onChange" });
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

  useEffect(() => {
    register("email");
    register("password");
  }, [register]);

  const onSubmit = async (data) => {
    try {
      Alert.alert('running onSubmit');
      const { email, password } = data;
      const isloginSuccessful = loginFunction.signinController(email, password);
      if (isloginSuccessful) {
        navigation.navigate('homepage');
      } else {
        Alert.alert("Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      Alert.alert("An error occurred during login");
    }
  };
  

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent={true} />
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps='handled' showsVerticalScrollIndicator={false}>
        <SafeAreaView style={styles.innerContainer}>
          <View style={styles.logoContainer}>
            {/* Render SVGs */}
            <Safekit xml={Safekit} width={width * 0.9} height={height * 0.13} style={styles.tagline} />
            <NeoGeo width={width * 0.7} height={height * 0.2} />
            
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
              onChangeText={text => setValue("email", text)} 
            />
            <Text style={styles.label}>Password</Text>
            <TextInput 
              style={styles.input} 
              secureTextEntry 
              placeholder="********" 
              placeholderTextColor="#A9A9A9"
              autoCapitalize="none"
              autoCorrect={false}
              onChangeText={text => setValue("password", text)} 
            />
          </View>

          <TouchableOpacity 
            style={isDisabled ? styles.loginButtonDisabled : styles.loginButton}
            onPress={handleSubmit(onSubmit)}  
            disabled={isDisabled}
          >
            <Text style={styles.loginText}>login</Text>
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
  tagline: 
  { marginTop: -20, 
    marginLeft: 170,

  },
  inputContainer: { width: "97%" },
  label: { 
    fontFamily: 'Poppins_500Medium', 
    color: "gray", 
    marginBottom: 10
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
  },loginButtonDisabled: {
    backgroundColor: "#ccc", 
    borderRadius: 30,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    width: "97%",
    marginBottom: 20,
  },
});
