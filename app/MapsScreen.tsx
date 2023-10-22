import { StyleSheet, View, Text, Button } from 'react-native';
import React, { useState, useEffect } from 'react';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { Accuracy } from 'expo-location';
import { child, get, getDatabase, onValue, ref } from 'firebase/database';
import { Searchbar } from 'react-native-paper';

export default function MapsScreen() {
    const [hasLocationPermission, setlocationPermission] = useState(false)
    const [currentLocation, setCurrentLocation] = useState<Location.LocationObjectCoords | null>(null)
    const [shops, onChangeShops] = React.useState<any[]>([]);
    const [searchQuery, setSearchQuery] = React.useState('');

    useEffect(() => {
        // const shopsRef = ref(getDatabase(), `shops`);

        // // return the unsubscribe function
        // return onValue(shopsRef, (snapshot) => {
        //     setShops(snapshot);
        // });
    });

    useEffect(() => {
        const db = getDatabase();
        const dbRef = ref(db);
        get(child(dbRef, `shops`)).then((snapshot) => {
            if (snapshot.exists()) {
                const shops = snapshot.val();
                onChangeShops(shops);
            } else {
                console.log("No data available");
            }
        }).catch((error) => {
            console.error(error);
        });
    }, [false]);

    const getLocationPermission = async () => {
        await Location.requestForegroundPermissionsAsync().then((item) => {
            setlocationPermission(item.granted)
        });

    };

    useEffect(() => {
        const response = getLocationPermission()
    });

    const updateLocation = async () => {
        await Location.getCurrentPositionAsync({ accuracy: Accuracy.Balanced }).then((item) => {
            setCurrentLocation(item.coords)
        });
    };

    const RenderCurrentLocation = (props: any) => {
        if (props.hasLocationPermission === null) {
            return null;
        }
        if (props.hasLocationPermission === false) {
            return <Text>No location access. Go to settings to change</Text>;
        }
        return (
            <View>
                <Button title="update location" onPress={updateLocation} />
                {currentLocation && (
                    <Text>
                        {`lat: ${currentLocation.latitude},\nLong:${currentLocation.longitude
                            }\nacc: ${currentLocation.accuracy}`}
                    </Text>
                )}
            </View>
        );
    }

    return (
        <View>
            <Searchbar
                placeholder="Search"
                value={searchQuery}
            />
            <RenderCurrentLocation props={{ hasLocationPermission: hasLocationPermission, currentLocation: currentLocation }} />
            <MapView
                provider="google"
                style={styles.map}
                showsUserLocation>
                {Object.keys(shops).map((key: any) => {
                    return (
                        <Marker
                            key={key}
                            coordinate={{ latitude: shops[key].lat, longitude: shops[key].long }}
                            title={shops[key].name}
                            description={shops[key].description}
                        />
                    )
                })}
                {/* <Marker
                    coordinate={{ latitude: 54.90896791276844, longitude: 9.78563966506911 }}
                    title="Iskonditoriet"
                    description="Is butik"
                />
                <Marker
                    coordinate={{ latitude: 54.90922828227544, longitude: 9.791443451703692 }}
                    title="Kaffeti"
                    description="Kaffe og is butik"
                />
                <Marker
                    coordinate={{ latitude: 54.911855351173614, longitude: 9.792285219759787 }}
                    title="Vaffelboden"
                    description="Sandwich og is butik"
                /> */}
            </MapView>
        </View>
    );
}

const styles = StyleSheet.create({
    map: { height: 400, width: 400 },
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
    },
});