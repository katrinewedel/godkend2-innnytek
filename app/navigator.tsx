import { Link, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet, Text, View, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { PaperProvider } from 'react-native-paper';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './ProfileScreen';
import MapsScreen from './MapsScreen';
import ShopsScreen from './ShopsScreen';

const Tab = createBottomTabNavigator();

export default function Page() {
  return (
    <PaperProvider>
      <SafeAreaView style={styles.safeArea}>
        <Tab.Navigator
          screenOptions={{
            headerShown: false,
          }}>
          <Tab.Screen name="Shops" component={ShopsScreen} />
          <Tab.Screen name="Maps" component={MapsScreen} />
          <Tab.Screen name="Profile" component={HomeScreen} />
        </Tab.Navigator>
        <StatusBar style="auto" />
      </SafeAreaView>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  map: { height: 400, width: 400 },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
