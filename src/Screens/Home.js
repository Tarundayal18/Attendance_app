import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, Image, ImageBackground } from 'react-native';
import { useNavigation, useFocusEffect, useIsFocused } from '@react-navigation/native';
import axios from 'axios';
import { mainUrl } from '../config';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector, useDispatch } from 'react-redux';
import { setUserData } from '../Redux/actions';
import Geolocation from "@react-native-community/geolocation";

const Home = ({ route }) => {

    const { userData: userData_ } = useSelector(state => state.auth);
    console.log(userData_.user.id);

    const navigation = useNavigation();
    const [checkedIn, setCheckedIn] = useState(false);
    const [userData, setUserData] = useState([]);
    const [date, setDate] = useState(new Date());
    const [showPicker, setShowPicker] = useState(false);
    const [totalTime, setTotalTime] = useState({ hours: 0, minutes: 0, seconds: 0 });
    const isFocus = useIsFocused();
    const [lastActivity, setLastActivity] = useState(null);
    const [location, setLocation] = useState({ latitude: null, longitude: null });
    const [activate, setActivate] = useState(userData_.user.Activate);


    // const userId = route.params?.id;
    const userName = route.params?.user;
    // const companies = route.params?.companies;
    const dispatch = useDispatch();

    // useEffect(() => {
    //     // Calculate total time when component mounts
    //     calculateTotalTime();
    // }, []);
    console.log('Activate',activate);

    useEffect(() => {
        // Fetch user activation status
        setActivate(userData_.user.Activate);
    }, [userData_.user.Activate]);

    useEffect(() => {
        if (!activate) {
            // Display alert if account is deactivated
            Alert.alert(
                "Account Deactivated",
                "Your account is deactivated. Please contact support for assistance."
            );
        }
    }, [activate]);


    useEffect(() => {
        if (isFocus) {
            console.log(isFocus);

            submitData(new Date());
        }
    }, [isFocus]);


    useEffect(() => {
        AsyncStorage.getItem('checkedIn').then(value => {
            if (value !== null) {
                setCheckedIn(JSON.parse(value));
            }
        });
    }, []);

    useEffect(() => {
        if (route.params && route.params.checkIn !== undefined) {
            setCheckedIn(route.params.checkIn);
            AsyncStorage.setItem('checkedIn', JSON.stringify(route.params.checkIn));
        }
    }, [route.params]);

    const formatDate = (inputDate, format = 'full') => {
        const dateObj = new Date(inputDate);
        const addLeadingZero = value => {
            return value < 10 ? `0${value}` : value;
        };

        switch (format) {
            case 'day-month-year':
                return `${addLeadingZero(dateObj.getDate())}-${addLeadingZero(dateObj.getMonth() + 1)}-${dateObj.getFullYear()}`;
            case 'hour-minute-second':
                return `${addLeadingZero(dateObj.getHours())}:${addLeadingZero(dateObj.getMinutes())}:${addLeadingZero(dateObj.getSeconds())}`;
            default:
                const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
                const year = dateObj.getFullYear();
                const month = months[dateObj.getMonth()];
                const day = addLeadingZero(dateObj.getDate());
                const hours = addLeadingZero(dateObj.getHours());
                const minutes = addLeadingZero(dateObj.getMinutes());
                const seconds = addLeadingZero(dateObj.getSeconds());
                return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
        }
    };


    const renderItem = ({ item }) => {
        let activityText = '';
        if (item.activity == 1) {
            activityText = 'Check In';
        } else {
            activityText = 'Check Out';
        }

        return (
            <View>
                <View style={{ flexDirection: 'row', backgroundColor: 'white', borderColor: 'rgb(228 228 229)', height: 60, shadowColor: '#000', borderWidth: 1, justifyContent: "space-between" }}>

                    <Text style={{ alignSelf: 'center', color: 'black', fontWeight: 'bold', fontSize: 16, marginLeft: 10 }}>{activityText}</Text>
                    <View style={{ alignSelf: 'center', position: 'absolute', left: '55%', transform: [{ translateX: -40 }] }}>
                        <Text style={{ alignSelf: 'center', color: 'black', fontSize: 10, width: 80 }}>{formatDate(item.time, 'day-month-year')}</Text>
                        <Text style={{ alignSelf: 'center', color: 'black', left: 3, fontSize: 10, width: 80 }}>{formatDate(item.time, 'hour-minute-second')}</Text>
                    </View>
                    <Image style={{ height: 40, width: 40, alignSelf: 'center', right: 10 }} source={{ uri: `${mainUrl}/${item.image}` }} />
                </View>
            </View>
        );
    };


    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShowPicker(Platform.OS === 'android');
        setDate(currentDate);
        submitData(currentDate);
        setShowPicker(false);
    };

    const showDatePicker = () => {
        setShowPicker(true);
    };


    const submitData = async (selectedDate) => {
        const formattedDate = selectedDate.toISOString().split('T')[0];

        const formData = new FormData();
        formData.append('date', formattedDate);
        // formData.append('userid', '20');
        formData.append('userid', userData_.user.id);

        console.log(formattedDate)
        // console.log(userId?.user.id)

        console.log(formattedDate)
        try {
            const response = await axios.post(`${mainUrl}/Get_entries.php`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            setUserData(response.data.data);
            console.log(response.data.data);
            // console.log(response.data.data[0].activity[1]);
            // console.log(`Activity: ${response.data.activity[0]}` );
            // setLastActivity(Last = response.data.data[response.data.data.length - 1].activity);
            // setLastActivity(response.data.data.length > 0 ? response.data.data[response.data.data.length - 1].activity : null);

            // Assuming response is your JSON object

            const lastActivityFromResponse = response.data.last_activity;
            setLastActivity(lastActivityFromResponse);
            console.log('adjgiasdiuh', lastActivityFromResponse);


        } catch (error) {
            console.log('Error fetching data for selected date:', error);
        }
    };

    console.log(`LastActivity: ${lastActivity}`);

    const handleCheckPressed = async () => {
        navigation.navigate('Camera', { activity: '1' });
        // await AsyncStorage.setItem('checkedIn', JSON.stringify(true));

    };

    const handleCheckOutPressed = async () => {
        await AsyncStorage.setItem('checkedIn', JSON.stringify(false));

        const formData = new FormData();
        formData.append('user_id', userData_.user.id);
        formData.append('latitude', location.latitude);
        formData.append('longitude', location.longitude);
        formData.append('activity', '2'); // Setting activity to '2' for check out

        try {
            const response = await axios.post(`${mainUrl}/CheckOut.php`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            submitData(new Date());
        } catch (error) {
            console.log(error);
        }
    };

  

// Geolocation.getCurrentPosition(
//     position => {
//       setLocation({ latitude: position.coords.latitude, longitude: position.coords.longitude });
//     },
//     error => console.log(error),
//   );

useEffect(() => {
    const fetchLocation = async () => {
        try {
            const position = await new Promise((resolve, reject) => {
                Geolocation.getCurrentPosition(
                    resolve,
                    reject,
                );
            });
            setLocation({ latitude: position.coords.latitude, longitude: position.coords.longitude });
        } catch (error) {
            console.log(error);
        }
    };
    fetchLocation();
}, []);


useEffect(() => {
    // Function to calculate total time
    const calculateTotalTime = () => {
        if (userData && userData.length > 1) {
            let totalTimeSeconds = 0;

            for (let i = 0; i < userData.length - 1; i++) {
                if (userData[i].activity === '1' && userData[i + 1].activity === '2') {
                    const checkInTime = new Date(userData[i].time);
                    const checkOutTime = new Date(userData[i + 1].time);
                    const timeDiff = checkOutTime.getTime() - checkInTime.getTime();
                    totalTimeSeconds += timeDiff / 1000;
                }
            }

            // Check if there's a check-in without a corresponding check-out
            if (userData[userData.length - 1].activity === '1') {
                const lastCheckInTime = new Date(userData[userData.length - 1].time);
                const currentTime = new Date();
                const timeDiff = currentTime.getTime() - lastCheckInTime.getTime();
                totalTimeSeconds += timeDiff / 1000;
            }

            const hours = Math.floor(totalTimeSeconds / 3600);
            const minutes = Math.floor((totalTimeSeconds % 3600) / 60);
            const seconds = Math.floor(totalTimeSeconds % 60);
            setTotalTime({ hours, minutes, seconds });
        }
    };

    calculateTotalTime(); // Call the function to calculate total time

}, [userData]);



return (
    <>
        {/* 
            <ImageBackground
                source={require('../assets/images/final.jpg')}> */}
        <View style={{ backgroundColor: "#3ba8a0", flexDirection: 'row', height: 80, justifyContent: 'space-between', paddingHorizontal: 10 }}>
            <View style={{ height: 10, }}>
                <Image style={{ right: 30, width: 130, height: 140, bottom: 30 }} source={require('../assets/images/check.png')} />
            </View>
            <Text style={{ alignSelf: 'center', top: 10, fontSize: 30, color: 'whitesmoke' }}></Text>
            <View style={{ top: 20 }}>
                <TouchableOpacity onPress={showDatePicker}>
                    <Image style={{ width: 30, height: 30 }} source={require('../assets/images/date.png')} />
                </TouchableOpacity>

                {showPicker && (
                    <DateTimePicker
                        testID="dateTimePicker"
                        value={date}
                        mode="date"
                        is24Hour={true}
                        display="default"
                        maximumDate={new Date()}
                        onChange={onChange}
                    />
                )}
            </View>
        </View>
        {/* </ImageBackground> */}



        <View style={{ height: 425, backgroundColor: '#f2f2f2' }}>
            <FlatList
                data={userData}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
            />

        </View>

        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <View style={{ borderRadius: 30, backgroundColor: 'white', height: 240, borderTopRightRadius: 0, borderTopLeftRadius: 0, shadowColor: '#000', shadowOffset: { width: 2, height: 2 }, shadowOpacity: 1, shadowRadius: 3.84, elevation: 295, width: '100%' }}>
                {userData && userData.length > 1 && (
                    <View style={{ marginTop: 40 }}>
                        <View>
                            <View style={{ height: 60, borderColor: '#rgb(232 231 231)', justifyContent: "space-evenly", width: '97%', alignSelf: 'center', borderRadius: 10, justifyContent: 'center', backgroundColor: 'gray', shadowColor: '#000', shadowOffset: { width: 2, height: 2 }, shadowOpacity: 1, shadowRadius: 3.84, elevation: 5 }}>
                                <Text style={{ alignSelf: 'center', color: 'whitesmoke', fontWeight: 'bold', fontSize: 16, marginLeft: 10 }}>Office Time: 10 Hour</Text>
                                {/* <Text>{userName}</Text> */}
                                <Text style={{ alignSelf: 'center', color: 'whitesmoke', fontSize: 10 }}>Total Time: {`${totalTime.hours}h ${totalTime.minutes}m ${totalTime.seconds}s`}</Text>
                            </View>
                        </View>
                    </View>
                )}

                <View style={{ alignItems: 'center', marginTop: 15 }}>
                    {activate == 1 && lastActivity == 1 && (
                        <TouchableOpacity
                            style={{
                                width: '80%',
                                height: 50,
                                alignSelf: 'center',
                                borderRadius: 50,
                                justifyContent: 'center',
                                backgroundColor: "darkred",
                                shadowColor: '#000',
                                shadowOffset: { width: 2, height: 2 },
                                shadowOpacity: 1,
                                shadowRadius: 3.84,
                                elevation: 5
                            }}
                            onPress={() => {
                                handleCheckOutPressed();
                            }}
                        >
                            <Text style={{ alignSelf: 'center', color: 'white' }}>Check Out</Text>
                        </TouchableOpacity>
                    )}

                    {(activate == 1 && lastActivity == 2 || lastActivity == null) && (
                        <TouchableOpacity
                            style={{
                                width: '80%',
                                height: 50,
                                alignSelf: 'center',
                                borderRadius: 50,
                                justifyContent: 'center',
                                backgroundColor: "#3ba8a0",
                                shadowColor: '#000',
                                shadowOffset: { width: 2, height: 2 },
                                shadowOpacity: 1,
                                shadowRadius: 3.84,
                                elevation: 5,
                                // marginTop: 15
                            }}
                            onPress={() => {
                                handleCheckPressed();
                            }}
                        >
                            <Text style={{ alignSelf: 'center', color: 'whitesmoke' }}>Check In</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </View>

    </>
)
}

export default Home;