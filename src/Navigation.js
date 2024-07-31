import * as React from 'react';
const { useState, useEffect } = React;
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from './Screens/Home';
import Map from './Screens/Map';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Camera from './Screens/Camera';
import Profile from './Screens/Profile';
import { Image } from 'react-native';
import Login from './Screens/Login';
import Signup from './Screens/Signup';
import User from './Screens/User';
import Otp from './Screens/Otp';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Provider, useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import Foundation from 'react-native-vector-icons/Foundation';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { setUserData } from './Redux/actions';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const BottomTabs = () => {

    return (
        <Tab.Navigator screenOptions={{
            headerShown: false
        }}>
            <Tab.Screen name="Home"
                component={Home}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Foundation name='home' size={size} color={color} />
                    ),
                    tabBarLabelStyle: {
                        marginBottom: 2, // Change this value as per your requirement
                    }
                }}
            />
            <Tab.Screen
                name="Me"
                component={User}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <FontAwesome name='user-circle-o' size={size} color={color} />
                    ),
                    tabBarLabelStyle: {
                        marginBottom: 2, // Change this value as per your requirement
                    }
                }}
            />

        </Tab.Navigator>
    );
}

function Navigation() {

    const [initialRoute, setInitialRoute] = useState(null);
    // const [isLoggedIn, setIsLoggedIn] = useState(false);
    const {userData}=useSelector(state=>state.auth);
    // console.log("123456789",userData.isLogin);

    const dispatch = useDispatch();

    useEffect(() => {
        const getStorageValue = async () => {
            try {
                const value = await AsyncStorage.getItem('user_data');
                if(value){
                    console.log("fdsfdxsx",JSON.parse(value));
                    setInitialRoute('BottomTabs');
                    dispatch(setUserData(JSON.parse(value)));
                }else{
                    dispatch(setUserData({isLogin:false}));
                    setInitialRoute('Login');
                }
            } catch (error) {
                console.error("Error retrieving login status:", error);
            }
        };
        getStorageValue();
    }, []);

    if (initialRoute === null) {
        return null;
    }

    return (
        // <NavigationContainer>
        //     <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
        //                 <Stack.Screen name='Home' component={Home} />
        //                 <Stack.Screen name='Map' component={Map} />
        //                 <Stack.Screen name='Camera' component={Camera} />
        //     </Stack.Navigator>
        // </NavigationContainer>

        <NavigationContainer>
            <Stack.Navigator initialRouteName={initialRoute} screenOptions={{ headerShown: false }}>
                {!userData.isLogin && (
                    <>
                        <Stack.Screen name='Login' component={Login} />
                        <Stack.Screen name='Signup' component={Signup} />
                        <Stack.Screen name='Otp' component={Otp} />
                    </>
                )}
                {userData.isLogin && (
                    <>
                        <Stack.Screen name="BottomTabs" component={BottomTabs} />
                        <Stack.Screen name='Home' component={Home} />
                        <Stack.Screen name='Map' component={Map} />
                        <Stack.Screen name='Camera' component={Camera} />
                        <Stack.Screen name='Profile' component={Profile} />
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default Navigation;

