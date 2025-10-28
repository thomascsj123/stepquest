import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// Importér dine faner (screens)
import WalkSelectionScreen from './WalkSelectionScreen.jsx';
import RuteScreen from './RuteScreen.jsx';
import ProfileScreen from './ProfileScreen.jsx';

const Tab = createBottomTabNavigator();

export default function MainTabs() {
  return (
    <Tab.Navigator
      initialRouteName="WalkSelection"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#49ff86ff',
        tabBarInactiveTintColor: '#ffffffff',
        tabBarStyle: {
          backgroundColor: '#1E5B31',
          borderTopColor: '#eee',
          height: 75,
          paddingBottom: 5,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          paddingBottom: 5,
        },
      }}
    >
      <Tab.Screen
        name="WalkSelection"
        component={WalkSelectionScreen}
        options={{
          title: 'Ture',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="walk-outline" size={size} color={color} />
          ),
        }}
      />

      {/* 🔹 Rute (kortet) */}
      <Tab.Screen
        name="Rute"
        component={RuteScreen}
        options={{
          title: 'Rute',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="map-outline" size={size} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Profil',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
