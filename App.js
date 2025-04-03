import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import LoginPage from "../geoport-responder/pages/login"
import HomePage from "../geoport-responder/pages/home"
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Loginpage">
        <Stack.Screen name="Loginpage" component={LoginPage} options={{ headerShown: false }} />
        <Stack.Screen name="homepage" component={HomePage} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}