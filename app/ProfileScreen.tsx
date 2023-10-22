import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link, router } from 'expo-router';
import { StatusBar } from "expo-status-bar";
import { child, get, getDatabase, ref } from "firebase/database";
import { SafeAreaView, StyleSheet, Text, View, TextInput, Button, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';

export default function ProfileScreen() {
    //Define variables
    const [user, onChangeUser] = React.useState<any>({});

    const fetchLoggedInUser = async () => {
        let loggedInUser = await AsyncStorage.getItem('loggedInUser');
        //If not logged in, redirect to login page
        if (!loggedInUser) {
            router.replace("/");
            Alert.alert("You are not logged in!");
        } else {
            //Check if user login is valid
            const db = getDatabase();
            const dbRef = ref(db);
            get(child(dbRef, `users/${JSON.parse(loggedInUser as string).username}`)).then((snapshot) => {
                if (snapshot.exists()) {
                    //User exists
                    const user = snapshot.val();
                    if (user.password == JSON.parse(loggedInUser as string).password) {
                        //Password match
                        onChangeUser(JSON.parse(loggedInUser as string));
                    } else {
                        //Password does not match
                        Alert.alert("User changed. Please re-login!");
                        router.replace("/");
                    }
                } else {
                    //User does not exist
                    Alert.alert("User changed. Please re-login!");
                    router.replace("/");
                }
            }).catch((error) => {
                console.error(error);
            });
        }
    }

    useEffect(() => {
        fetchLoggedInUser();
    })

    return (
        <SafeAreaView className='m-4'>
            <Text className="mt-8 text-2xl font-bold leading-9 tracking-tight text-gray-900">Profile</Text>
            <Text className="mt-2 text-sm leading-6 text-gray-500">Want to sign out? <Link href="/" className='font-semibold text-indigo-600 hover:text-indigo-500'>Click here</Link></Text>

            <Text className="mt-10 text-xl leading-6 text-gray-500">Hello {user.username}</Text>
            <Text className="mt-10 text-xl leading-6 text-gray-500">Your name is: {user.name}</Text>
            <Text className="mt-10 text-xl leading-6 text-gray-500">Your password is: {user.password}</Text>
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