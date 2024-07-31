import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, ImageBackground } from 'react-native'
import React, { useState, useRef } from 'react'
import { Button } from 'react-native-elements'
import { useNavigation } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { setLoggedIn } from '../Redux/actions';

const Otp = () => {

    const navigation = useNavigation();
    const inputRef = useRef(null);
    const inputRefTwo = useRef(null);
    const inputRefThree = useRef(null);
    const inputRefFour = useRef(null);

    const [incorrectOTP, setIncorrectOTP] = useState(false);

    const [otpInput, setOtpInput] = useState({
        digit1: '',
        digit2: '',
        digit3: '',
        digit4: ''
    });

    const route = useRoute();
    const otp = route.params?.otp;

    const dispatch = useDispatch();

    const handleOtpInputChange = (text, field) => {
        setOtpInput(prevState => ({
            ...prevState,
            [field]: text
        }));

        if (text.length === 0) {
            switch (field) {
                case 'digit4':
                    inputRefThree.current.focus();
                    break;
                case 'digit3':
                    inputRefTwo.current.focus();
                    break;
                case 'digit2':
                    inputRef.current.focus();
                    break;
                default:
                    break;
            }
        } else {
            switch (field) {
                case 'digit1':
                    inputRefTwo.current.focus();
                    break;
                case 'digit2':
                    inputRefThree.current.focus();
                    break;
                case 'digit3':
                    inputRefFour.current.focus();
                    break;
                default:
                    break;
            }
        }
    };

    const Navigation = () => {
        navigation.navigate('Login')
    };

    const Verify = async() => {
        if (otpInput.digit1 + otpInput.digit2 + otpInput.digit3 + otpInput.digit4 == otp) {
            await AsyncStorage.setItem('isLoggedIn', 'true');
            dispatch(setLoggedIn(true));
        } else {
            console.log("Incorrect OTP");
            setIncorrectOTP(true);
        }
    };

    return (

        <>
            <KeyboardAwareScrollView keyboardShouldPersistTaps={'always'}
                showsVerticalScrollIndicator={false}>
                <View >
                    <ImageBackground source={require('../assets/images/4737.jpg')} >
                        <TouchableOpacity onPress={Navigation}>
                            <Ionicons name="chevron-back-outline" size={35} color="black" />
                        </TouchableOpacity>
                        <View style={styles.logo}>
                            <Image source={require('../assets/images/images-removebg-preview.png')}
                                style={{
                                    width: 250,
                                    height: 150,
                                }} />
                        </View>
                            <KeyboardAwareScrollView keyboardShouldPersistTaps={'always'}
                                showsVerticalScrollIndicator={false}>
                        <View style={styles.main}>

                                <Text style={{ textAlign: 'center', fontSize: 20, color: 'black', marginTop: 20 }}>OTP Verification</Text>

                                <Text style={{ fontSize: 16, color: 'black', textAlign: 'center', marginTop: 10 }}>OTP: {otp}</Text>

                                <View style={{ marginTop: 20, flexDirection: 'row' , justifyContent:'center'}}>
                                    <TextInput
                                        style={styles.input}
                                        maxLength={1}
                                        keyboardType="numeric"
                                        ref={inputRef}
                                        onChangeText={(text) => handleOtpInputChange(text, 'digit1')}
                                        value={otpInput.digit1}
                                    />
                                    <TextInput
                                        style={styles.input}
                                        maxLength={1}
                                        keyboardType="numeric"
                                        ref={inputRefTwo}
                                        onChangeText={(text) => handleOtpInputChange(text, 'digit2')}
                                        value={otpInput.digit2}
                                    />
                                    <TextInput
                                        style={styles.input}
                                        maxLength={1}
                                        keyboardType="numeric"
                                        ref={inputRefThree}
                                        onChangeText={(text) => handleOtpInputChange(text, 'digit3')}
                                        value={otpInput.digit3}
                                    />
                                    <TextInput
                                        style={styles.input}
                                        maxLength={1}
                                        keyboardType="numeric"
                                        ref={inputRefFour}
                                        onChangeText={(text) => handleOtpInputChange(text, 'digit4')}
                                        value={otpInput.digit4}
                                    />

                                </View>
                                    {incorrectOTP && <Text style={{ color: 'red', textAlign: 'center', marginTop: 10 }}>Incorrect OTP</Text>}

                                <View style={styles.buttonContainer}>
                                    <Button
                                        onPress={Verify}
                                        title="Verify Otp"
                                        buttonStyle={{ backgroundColor: 'red', borderRadius: 50 }}
                                    />
                                </View>
                        </View>
                            </KeyboardAwareScrollView>
                    </ImageBackground>
                </View>
            </KeyboardAwareScrollView>
        </>
    )
}

const styles = StyleSheet.create({
    main: {
        marginTop: 290,
        backgroundColor: 'white',
        borderRadius: 50,
        // height: 800
        // margin:10
    },
    input: {
        // borderRadius: 50,
        height: 50,
        margin: 12,
        borderWidth: 2,
        padding: 15,
        width: 40,
        marginHorizontal: 18,
        // left:30
        // marginLeft: 39
    },
    buttonContainer: {
        marginHorizontal: 36,
        marginTop: 20,
        // width: '80%',
        marginBottom: 208,
    },
    text: {
        fontSize: 17,
        color: 'black'
    },
    text2: {
        fontSize: 17,
        color: 'red',
        fontWeight: 'bold'
    },
    logo: {
        alignSelf: 'center',
        position: 'absolute', // Positioned the logo absolutely
        top: 90, // Aligned the logo to the top of the parent container
        marginTop: 96,
    }
})

export default Otp