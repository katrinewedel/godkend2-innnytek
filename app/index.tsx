import { Link, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet, Text, View, TextInput, Button, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from 'firebase/app';
import { child, get, getDatabase, ref } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDprC97p7etpc9SvjSTGsTmQelEwbi199A",
  authDomain: "godkend1-kbw.firebaseapp.com",
  databaseURL: "https://godkend1-kbw-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "godkend1-kbw",
  storageBucket: "godkend1-kbw.appspot.com",
  messagingSenderId: "601242233159",
  appId: "1:601242233159:web:a45b9ebfeb6524b9bbc462"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export default function Page() {
  //Define variables
  const [username, onChangeUsername] = React.useState('');
  const [password, onChangePassword] = React.useState('');

  //Login function
  const login = async () => {
    //Check if user exists

    const db = getDatabase();
    const dbRef = ref(db);
    get(child(dbRef, `users/${username}`)).then((snapshot) => {
      if (snapshot.exists()) {
        //User exists
        const user = snapshot.val();
        if (user.password == password) {
          //Password match
          //Save user to local storage
          AsyncStorage.setItem('loggedInUser', JSON.stringify(user));
          //Redirect to navigator page
          router.replace("/navigator");
        } else {
          //Password does not match
          Alert.alert("Invalid credentials!");
        }
      } else {
        //User does not exist
        Alert.alert("Invalid credentials!");
      }
    }).catch((error) => {
      console.error(error);
    });
  };

  return (
    <SafeAreaView className='m-4'>
      <Text className="mt-8 text-2xl font-bold leading-9 tracking-tight text-gray-900">Sign in to your account </Text>
      <Text className="mt-2 text-sm leading-6 text-gray-500">Not a member? <Link href="/register" className='font-semibold text-indigo-600 hover:text-indigo-500'>Click here to register</Link></Text>

      <Text className='mt-10 block text-sm font-medium text-xl leading-6 text-gray-900'>Username</Text>
      <TextInput onChangeText={onChangeUsername} value={username} className='border-[#E9EDF4] w-full rounded-md border bg-[#FCFDFE] py-3 px-5 text-base text-body-color placeholder-[#ACB6BE] outline-none focus:border-primary focus-visible:shadow-none'></TextInput>

      <Text className='mt-10 block text-sm font-medium text-xl leading-6 text-gray-900'>Password</Text>
      <TextInput onChangeText={onChangePassword} value={password} secureTextEntry={true} className='border-[#E9EDF4] w-full rounded-md border bg-[#FCFDFE] py-3 px-5 text-base text-body-color placeholder-[#ACB6BE] outline-none focus:border-primary focus-visible:shadow-none'></TextInput>

      <View className='mt-4 border-blue-500 w-full cursor-pointer rounded-md border bg-blue-500 text-base text-white transition hover:bg-opacity-90'>
        <Button title="Sign in" color="#fff" onPress={login}></Button>
      </View>

      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});