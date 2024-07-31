import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Image, TextInput, StyleSheet, Text, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import { setUserData, setEditData } from '../Redux/actions';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import UserImage from '../assets/images/User.jpg';
import { mainUrl } from '../config';

const User = () => {
    const { userData } = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const isFocused = useIsFocused();
    const [name, setName] = useState(userData?.user.name);
    const [mobileNumber, setMobileNumber] = useState(userData?.user.mobile_no);
    const [email, setEmail] = useState(userData?.user.email);
    const [password, setPassword] = useState(userData.user.password);
    const [Activate, setActivate] = useState(userData.user.Activate);

    const [profile, setProfile] = useState(userData.user.profile);
    const [showPassword, setShowPassword] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);

    console.log('Activate',Activate);
    console.log(userData);

    const openImagePicker = () => { 
        const options = {
            mediaType: 'photo',
            includeBase64: false,
        };

        launchImageLibrary(options, response => {
            console.log(response);
            if (!response.didCancel && !response.error) {
                setSelectedImage(response.uri || response.assets?.[0]?.uri);
                setProfile(response.uri || response.assets?.[0]?.uri); // Update profile with selected image
            }
        });
    };

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    useEffect(() => {
        if (isFocused) {
        }
    }, [isFocused, selectedImage]);

    const handleSubmit = () => {
        const formData = new FormData();
        formData.append('user_id', userData.user.id);
        formData.append('name', name);
        formData.append('email', email);
        formData.append('mobile_no', mobileNumber);
        formData.append('password', password);

        if (selectedImage) {
            formData.append('profile', {
                uri: selectedImage,
                type: 'image/jpeg',
                name: 'photo.jpg',
            });
        }

        fetch(`${mainUrl}/Edit.php`, {
            method: 'POST',
            body: formData,
        })
            .then(response => response.json())
            .then(data => {
                if (data.status === 200) {
                    // Update user data in Redux state
                    dispatch(
                        setEditData(
                            {
                                ...userData.user,
                                name,
                                email,
                                mobile_no: mobileNumber,
                                password,
                                profile: data.updated_data.profile, // Update profile with updated data from server
                            })
                    );
                    alert('Profile updated successfully');
                } else {
                    alert(data.message);
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    };

    return (
        <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Ionicons name="arrow-back-outline" size={40} color="black" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Edit Profile</Text>
                    <TouchableOpacity onPress={handleSubmit}>
                        <AntDesign name="check" size={40} color="black" />
                    </TouchableOpacity>
                </View>
                <KeyboardAwareScrollView style={{ flex: 1 }}>

                <View style={styles.profileContainer}>
                    {profile ? (
                        <Image
                            source={{ uri: selectedImage || `${mainUrl}/${profile}` }}
                            style={styles.profileImage}
                            resizeMode="contain"
                        />
                    ) : (
                        <Image
                            source={UserImage}
                            style={styles.profileImage}
                            resizeMode="contain"
                        />
                    )}

                    <TouchableOpacity onPress={openImagePicker}>
                        <Text style={styles.editPictureText}>Edit Picture</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.formContainer}>
                <Text>Name</Text>
                    <TextInput
                        style={styles.input}
                        value={name}
                        onChangeText={setName}
                        placeholder="Name"
                    />
                    <Text>Phone Number</Text>
                    <TextInput
                        style={styles.input}
                        value={mobileNumber}
                        onChangeText={setMobileNumber}
                        placeholder="Mobile Number"
                    />
                    <Text>Email</Text>
                    <TextInput
                        style={styles.input}
                        value={email}
                        onChangeText={setEmail}
                        placeholder="Email"
                    />
                    <Text>Password</Text>
                    <View style={styles.passwordContainer}>
                        <TextInput
                            style={styles.input}
                            value={password}
                            onChangeText={setPassword}
                            placeholder="Password"
                            secureTextEntry={!showPassword}
                        />
                        <Entypo
                            name={showPassword ? 'eye' : 'eye-with-line'}
                            size={24}
                            color="black"
                            onPress={toggleShowPassword}
                        />
                    </View>
                </View>
        </KeyboardAwareScrollView>
            </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 5,
        height: 80,
        backgroundColor: '#3ba8a0',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'black',
    },
    profileContainer: {
        alignItems: 'center',
        marginTop: 20,
    },
    profileImage: {
        width: 150,
        height: 150,
        borderRadius: 75,
    },
    editPictureText: {
        color: 'blue',
        marginTop: 10,
    },
    formContainer: {
        paddingHorizontal: 20,
        marginTop: 20,
    },
    input: {
        borderBottomWidth: 1,
        borderColor: 'lightgray',
        fontSize: 16,
        marginBottom: 20,
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
});

export default User;
