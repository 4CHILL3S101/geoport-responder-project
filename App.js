import { StyleSheet, Text, View } from "react-native";
import LoginPage from "./pages/login";
import HomePage from "./pages/home";
import RedirectPage from "./pages/redirect";
import NetInfo from "@react-native-community/netinfo";
import React, { useEffect, useState } from "react";
import NoInternetModal from "./utils/noInternetModal";

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator();
export default function App() {
  const [isConnected, setIsConnected] = useState(true);

 useEffect(() => {
  const unsubscribe = NetInfo.addEventListener((state) => {
    console.log("NetInfo state:", state);

    const reachable =
      state.isInternetReachable ??
      (state.isConnected && state.type !== 'none');

    const isProbablyOnline =
      reachable || state.type === 'vpn' || state.type === 'cellular';

    setIsConnected(isProbablyOnline);
  });

  return () => unsubscribe();
}, []);


  return (
    <>
      <NoInternetModal visible={!isConnected} />
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Redirect">
          <Stack.Screen
            name="Redirect"
            component={RedirectPage}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Loginpage"
            component={LoginPage}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="homepage"
            component={HomePage}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}
