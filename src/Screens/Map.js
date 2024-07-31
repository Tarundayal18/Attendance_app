import { View, Text, ActivityIndicator, StyleSheet, TouchableOpacity, Image } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { Camera, useCameraDevice } from 'react-native-vision-camera'
import Geolocation from "@react-native-community/geolocation";
import Ionicons from 'react-native-vector-icons/Ionicons';
// import { isLocationEnabled } from 'react-native-android-location-enabler';
// import { Platform } from 'react-native';
// import { promptForEnableLocationIfNeeded } from 'react-native-android-location-enabler';
import axios, { Axios } from 'axios';
import ImageToBase64 from 'react-native-image-base64';



const Home = () => {
    const device = useCameraDevice('front')
    const camera = useRef(null);
    const [imageData, setImageData] = useState('');
    const [checkIn, setCheckIn] = useState(false);
    const [location, setLocation] = useState({ latitude: null, longitude: null });
    const [formData, setFormData] = useState({
        image: '',
        latitude: '',
        longitude: '',
    });

    async function handleCheckPressed() {
        setCheckIn(true);
        // if (Platform.OS === 'android') {
        //     const checkEnabled: boolean = await isLocationEnabled();
        //     console.log('checkEnabled', checkEnabled);

        //     if (checkEnabled) {
        //         // Location is enabled, perform your desired action
        //         // For example, navigate to another screen or execute a function
        //         console.log('Location is enabled');
        //     } else {
        //         // Location is not enabled, prompt the user to enable it
        //         try {
        //             const enableResult = await promptForEnableLocationIfNeeded();
        //             console.log('enableResult', enableResult);
        //             // You may want to handle the result accordingly
        //         } catch (error) {
        //             console.error(error.message);    
        //             // Handle error if needed
        //         }
        //     }
        // }
    }


    useEffect(() => {
        checkpermission()
    }, [])

    const Back = () => {
        setCheckIn(false)
    }
    const checkpermission = async () => {
        const newCameraPermission = await Camera.requestCameraPermission()
        const newMicrophonePermission = await Camera.requestMicrophonePermission()
        console.log(newCameraPermission);
    };

    if (device == null) return <ActivityIndicator />


    const takePicture = async () => {
        if (camera != null) {
            const photo = await camera.current.takePhoto();
            setCheckIn(false);
            setImageData(photo.path);
            console.log(photo);
            console.log('latitude', location.latitude, 'longitude', location.longitude);

            // Convert image to base64
            // ImageToBase64.getBase64String('file://' + photo.path)
                    // Base64 string is ready, now send it to the server
                    const formData = new FormData();
                    formData.append('image', 'file://' +photo.path);
                    formData.append('latitude', location.latitude);
                    formData.append('longitude', location.longitude);

                    axios.post('http://192.168.1.9/attendance/Users.php', formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        }
                    }).then(({ data }) => {
                        console.log(data);
                    }).catch((error) => {
                        console.log(error);
                    });
        }
    };


    Geolocation.getCurrentPosition(

        position => {
            setLocation({ latitude: position.coords.latitude, longitude: position.coords.longitude });
        },
        error => console.log(error),
    );

    return (
        <View style={{ flex: 1 }}>
             {/* <Text style={styles.coordinatesText}>
                           Check In:                                                     
             </Text> */}
            {checkIn ? (
                <>
                    <View style={{ flex: 1 }}>
                        <Camera
                            ref={camera}
                            style={StyleSheet.absoluteFill}
                            device={device}
                            isActive={true}
                            photo={true}
                        />
                       
                        <TouchableOpacity onPress={Back}>
                            <Text>
                                <Ionicons name="arrow-back-circle-outline" size={40} color="white" />
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={{ width: 60, height: 60, borderRadius: 30, backgroundColor: 'red', position: 'absolute', bottom: 50, alignSelf: 'center' }}
                            onPress={() => {
                                takePicture();
                            }}
                        >
                        </TouchableOpacity>
                    </View>
                </>
            ) : (
                <View style={{ flex: 1, gap: 30, justifyContent: 'center', alignItems: 'center', backgroundColor: '#033343' }}>
                    {imageData !== '' && (
                        <Image
                            source={{ uri: 'file://' + imageData }}
                            style={{ width: '52%', height: 200, transform: [{ rotate: '90deg' }] }}
                        />
                    )}

                    <TouchableOpacity
                        style={{
                            width: '40%',
                            height: 50,
                            borderWidth: 1,
                            alignSelf: 'center',
                            borderRadius: 10,
                            justifyContent: 'center',
                            alignContent: 'center',
                            backgroundColor: 'lightgreen'
                        }}
                        onPress={() => {
                            handleCheckPressed();
                        }}
                    >
                        <Text style={{ alignSelf: 'center', color: 'black' }}>Check In</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={{
                            width: '40%',
                            height: 50,
                            borderWidth: 1,
                            alignSelf: 'center',
                            borderRadius: 10,
                            justifyContent: 'center',
                            alignContent: 'center',
                            backgroundColor: 'lightgreen'
                        }}
                        onPress={() => {
                            // handleCheckPressed();
                        }}
                    >
                        <Text style={{ alignSelf: 'center', color: 'black' }}>Check Out</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    )
}


const styles = StyleSheet.create({
    coordinatesText: {
        position: "absolute",
        top: 10,
        left: 10,
        backgroundColor: "rgba(255, 255, 255, 0.7)",
        padding: 5,
        borderRadius: 5,
        zIndex: 1000,
        color:'black'
      },
});

export default Home