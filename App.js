import 'react-native-gesture-handler';
import * as React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Importér komponenter
import LoginScreen from './components/LoginScreen.jsx';
import RegisterScreen from './components/RegisterScreen.jsx';
import MainTabs from './components/MainTabs.jsx';
import RuteScreen from './components/RuteScreen.jsx'; // 👈 Kortet ligger her nu
import EditProfileScreen from './components/EditProfileScreen.jsx';
import FindFriendsScreen from './components/FindFriendsScreen.jsx'; // 👈 NY

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right', // 👈 Glidende skift mellem skærme
        }}
      >
        {/* Login & registrering */}
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />

        {/* Hovedapp med bundnavigation */}
        <Stack.Screen name="MainTabs" component={MainTabs} />

        {/* Rute (kortet) */}
        <Stack.Screen name="RuteScreen" component={RuteScreen} />

        {/* Rediger profil */}
        <Stack.Screen name="EditProfile" component={EditProfileScreen} />

        {/* Find venner / hundeejere */}
        <Stack.Screen name="FindFriends" component={FindFriendsScreen} />
      </Stack.Navigator>

      <StatusBar style="auto" />
    </NavigationContainer>
  );
}
