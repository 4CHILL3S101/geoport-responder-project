import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import LoginPage from "./pages/login"
import HomePage from "./pages/home"
import RedirectPage from "./pages/redirect"

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Redirect">
        <Stack.Screen name="Redirect" component={RedirectPage} options={{ headerShown: false }} />
        <Stack.Screen name="Loginpage" component={LoginPage} options={{ headerShown: false }} />
        <Stack.Screen name="homepage" component={HomePage} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}