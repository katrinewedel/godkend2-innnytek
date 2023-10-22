import { A } from '@expo/html-elements';
import { Link, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet, Text, View, TextInput, Button, Alert } from 'react-native';
import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { child, get, getDatabase, ref, set } from "firebase/database";

export default function Page() {
  const [fullName, onChangeFullName] = React.useState('');
  const [username, onChangeUsername] = React.useState('');
  const [password, onChangePassword] = React.useState('');

  // Register function
  const register = async () => {
    if (!fullName || !username || !password) {
      Alert.alert("Please fill out all fields!");
      return;
    }

    const db = getDatabase();
    const dbRef = ref(db);
    get(child(dbRef, `users/${username}`)).then((snapshot) => {
      if (snapshot.exists()) {
        alert("User already exists");
      } else {
        //No user with username - create user
        set(ref(db, 'users/' + username), {
          name: fullName,
          username: username,
          password: password
        });

        //Redirect to login page
        Alert.alert("You are now registered!");
        router.replace("/");
      }
    }).catch((error) => {
      console.error(error);
    });
  }

  return (
    <SafeAreaView className='m-4'>
      <Text className="mt-8 text-2xl font-bold leading-9 tracking-tight text-gray-900">Register your account</Text>
      <Text className="mt-2 text-sm leading-6 text-gray-500">Already a member? <Link href="/" className='font-semibold text-indigo-600 hover:text-indigo-500'>Click here to login</Link></Text>

      <Text className='mt-10 block text-sm font-medium text-xl leading-6 text-gray-900'>Username</Text>
      <TextInput onChangeText={onChangeUsername} value={username} inputMode='text' autoComplete='username' className='border-[#E9EDF4] w-full rounded-md border bg-[#FCFDFE] py-3 px-5 text-base text-body-color placeholder-[#ACB6BE] outline-none focus:border-primary focus-visible:shadow-none'></TextInput>
      
      <Text className='mt-10 block text-sm font-medium text-xl leading-6 text-gray-900'>Full name</Text>
      <TextInput onChangeText={onChangeFullName} value={fullName} inputMode='text' autoComplete='name' className='border-[#E9EDF4] w-full rounded-md border bg-[#FCFDFE] py-3 px-5 text-base text-body-color placeholder-[#ACB6BE] outline-none focus:border-primary focus-visible:shadow-none'></TextInput>

      <Text className='mt-10 block text-sm font-medium text-xl leading-6 text-gray-900'>Password</Text>
      <TextInput onChangeText={onChangePassword} value={password} secureTextEntry={true} autoComplete='off' className='border-[#E9EDF4] w-full rounded-md border bg-[#FCFDFE] py-3 px-5 text-base text-body-color placeholder-[#ACB6BE] outline-none focus:border-primary focus-visible:shadow-none'></TextInput>

      <View className='mt-4 border-blue-500 w-full cursor-pointer rounded-md border bg-blue-500 text-base text-white transition hover:bg-opacity-90'>
        <Button onPress={register} title="Register" color="#fff"></Button>
      </View>

      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
