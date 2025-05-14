// navigation/index.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator style={{ backgroundColor: '#fff' }}>
      <Stack.Screen name="" component={LoginScreen} />
      <Stack.Screen name="" component={HomeScreen} />
    </Stack.Navigator>
  );
}
