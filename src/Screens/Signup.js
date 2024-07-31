import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, ImageBackground, Alert, KeyboardAvoidingView, ActivityIndicator } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Button } from 'react-native-elements'
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { mainUrl } from '../config';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Entypo from 'react-native-vector-icons/Entypo';
import SelectDropdown from 'react-native-select-dropdown'
import { useDispatch } from 'react-redux';
import { setUserData } from '../Redux/actions';
import AsyncStorage from '@react-native-async-storage/async-storage';


const Signup = () => {


    const navigation = useNavigation();
    const isFocused = useIsFocused();
    const [error, setError] = useState({ field: '', message: '' });
    const [Name, setName] = useState('');
    const [Mobile_no, setMobile_no] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [Company_id, setCompany_id] = useState('');
    Company_id
    const [formData, setFormData] = useState({
        Name: '',
        Mobile_no: '',
        Email: '',
        Password: '',
        SetCompany_id: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [companies, setCompanies] = useState([]);

    const fetchCompanies = async () => {
        try {
            const response = await fetch(`${mainUrl}/companies.php`);
            const data = await response.json();
            if (data && data.length > 0) {
                setCompanies(data);
            }
        } catch (error) {
            console.error('Error fetching companies:', error);
        }
    };

    useEffect(() => {
        fetchCompanies();
    }, []);

    const dispatch = useDispatch();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = () => {
        let loginError = { field: '', message: '' };
        if (Name === '') {
            loginError.field = 'Name';
            loginError.message = '*Employe Name is required';
            setError(loginError);
        } else if (Mobile_no === '') {
            loginError.field = 'Mobile_no';
            loginError.message = '*Mobile number is required';
            setError(loginError);
        } else if (email === '') {
            loginError.field = 'email';
            loginError.message = '*Email is required';
            setError(loginError);
        } else if (password === '') {
            loginError.field = 'password';
            loginError.message = '*Password is required';
            setError(loginError);
        } else if (Company_id === '') {
            loginError.field = 'company_id';
            loginError.message = '*Company is required';
            setError(loginError);
        } else {

            setIsLoading(true);

            const formData = new FormData();
            formData.append('name', Name);
            formData.append('mobile_no', Mobile_no);
            formData.append('email', email);
            formData.append('password', password);
            formData.append('company_id', Company_id);

            fetch(`${mainUrl}/registration.php`, {
                method: 'POST',
                body: formData,
            })
                .then(response => response.json())
                .then(data => {
                    if (data.status === 200) {
                      // Login successful
                      const userData = data.user;
                      const dat = {
                        isLogin: true,
                        user: userData
                      };
              
                      // Store user data in AsyncStorage
                    //   AsyncStorage.setItem('user_data', JSON.stringify(dat));
                    navigation.navigate('Login')
                      // Dispatch action to update Redux state
                    //   dispatch(setUserData(dat));
              
                      // Navigate to next screen or perform necessary actions
                      console.log('Login successful. User data:', userData);
                    } else {
                      // Login failed, display error message
                      alert(data.message);
                    }
                    setIsLoading(false); // Stop loading indicator
                  })
                .catch(error => {
                    console.error('Error:', error)
                    setIsLoading(false);
                }
                );
        }
    };


    const Loginpage = () => {
        navigation.navigate('Login');
    };

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    useEffect(() => {
        setIsLoading(false);
    }, [isFocused]);


    return (
        <>
            <KeyboardAwareScrollView keyboardShouldPersistTaps={'always'}
                showsVerticalScrollIndicator={false}>
                <View>
                    <ImageBackground source={require('../assets/images/5570834.jpg')}
                        style={{
                            width: '100%',
                            height: '100%',
                        }} >
                        <View style={styles.logo}>
                        <Image
                source={require('../assets/images/check.png')}
                style={{
                  width: 450,
                  height: 100,
                  aspectRatio: 4 / 2,
                }}
              />
                        </View>
                        <View style={styles.main}>
                            <KeyboardAwareScrollView keyboardShouldPersistTaps={'always'}
                                showsVerticalScrollIndicator={false}>
                                <Text style={{ fontSize: 28, marginTop: 20, color: 'black', marginLeft: 50, fontWeight: 'bold' }}>Sign up</Text>

                                <View style={{ marginTop: 20 }}>
                                    {error.field === 'Name' && (
                                        <Text style={{ color: 'red', fontSize: 12, marginHorizontal: 50 }}>
                                            {error.message}
                                        </Text>
                                    )}
                                    <TextInput
                                        style={styles.input1}
                                        // onChangeText={text => setName(text)}
                                        onChangeText={text => {
                                            // Remove any non-alphabetic characters
                                            const formattedText = text.replace(/[^a-zA-Z ]/g, '');
                                            setName(formattedText);
                                        }}
                                        value={Name}
                                        onChange={handleChange}
                                        maxLength={30}
                                        placeholder="Employe Name"
                                    />
                                    {error.field === 'Mobile_no' && (
                                        <Text style={{ color: 'red', fontSize: 12, marginHorizontal: 50 }}>
                                            {error.message}
                                        </Text>
                                    )}
                                    <TextInput
                                        style={styles.input1}
                                        onChangeText={text => setMobile_no(text)}
                                        maxLength={10}
                                        value={Mobile_no}
                                        onChange={handleChange}
                                        keyboardType="numeric"
                                        placeholder="Contact number"
                                    />
                                        {error.field === 'email' && (
                                            <Text style={{ color: 'red', fontSize: 12, marginHorizontal: 50 }}>
                                                {error.message}
                                            </Text>
                                        )}
                                    <TextInput
                                        style={styles.input1}
                                        onChangeText={text => setEmail(text)}
                                        onChange={handleChange}
                                        value={email}
                                        maxLength={30}
                                        placeholder="Email"
                                        // keyboardType='email-address'
                                    />
                                        {error.field === 'password' && (
                                            <Text style={{ color: 'red', fontSize: 12, marginHorizontal: 50 }}>
                                                {error.message}
                                            </Text>
                                        )}
                                    <View style={styles.inputContainer}>
                                        <TextInput
                                            style={styles.input}
                                            onChangeText={text => setPassword(text)}
                                            value={password}
                                            placeholder="Password"
                                            secureTextEntry={!showPassword}
                                            maxLength={30}
                                        />
                                        <Entypo
                                            name={showPassword ? 'eye' : 'eye-with-line'}
                                            size={24}
                                            color="black"
                                            style={styles.icon}
                                            onPress={toggleShowPassword}
                                        />
                                    </View>
                                    {error.field === 'company_id' && (
                                            <Text style={{ color: 'red', fontSize: 12, marginHorizontal: 50 }}>
                                                {error.message}
                                            </Text>
                                        )}
                            <View style={styles.dropdownview}>
                                    <SelectDropdown
                                        style={styles.dropdown}
                                        data={companies.map(company => company.name)}
                                        onSelect={(selectedItem, index) => {
                                            const selectedCompanyId = companies[index].id;
                                            setCompany_id(selectedCompanyId);
                                        }}
                                        buttonTextAfterSelection={(selectedItem, index) => {
                                            return selectedItem;
                                        }}
                                        rowTextForSelection={(item, index) => {
                                            return item;
                                        }}
                                    />
                                    </View>
                                </View>

                                <View style={styles.buttonContainer}>
                                    <Button
                                        title="Signup"
                                        onPress={handleSubmit}
                                        buttonStyle={{ backgroundColor: '#0e2a4c', borderRadius: 50 }}
                                    />
                                </View>

                                <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 5, marginTop: 20, marginBottom: 25 }}>

                                    <Text style={styles.text}>
                                        Already have a account?
                                    </Text>
                                    <TouchableOpacity onPress={Loginpage}>
                                        <Text style={styles.text2}>Login</Text>
                                    </TouchableOpacity>
                                </View>
                            </KeyboardAwareScrollView>
                        </View>
                    </ImageBackground>
                </View>
            </KeyboardAwareScrollView>
            {isLoading && (
                <View style={[styles.container, styles.horizontal]}>
                    <ActivityIndicator size="large" color="#0e2a4c" />
                </View>
            )}
        </>
    )
}

const styles = StyleSheet.create({
    main: {
        marginTop: 268,
        backgroundColor: 'white',
        borderRadius: 50,
        // height: 800
    },
    input1: {
        borderRadius: 50,
        height: 40,
        margin: 10,
        borderWidth: 2,
        height: 50,
        marginHorizontal: 33,
        paddingHorizontal: 19,

    },
    buttonContainer: {
        marginHorizontal: 36,
        marginTop: 20,
        width: '80%'
    },
    text: {
        fontSize: 17,
        color: 'black'
    },
    text2: {
        fontSize: 17,
        fontWeight: 'bold',
        color: '#0e2a4c',
    },
    logo: {
        alignSelf: 'center',
        position: 'absolute', // Positioned the logo absolutely
        top: 120, // Aligned the logo to the top of the parent container
        marginTop: 20,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        position: 'absolute',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
        width: '100%',
        height: '100%',
    },
    horizontal: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 50,
        borderWidth: 2,
        marginHorizontal: 33,
        marginTop: 12,
        paddingHorizontal: 15,
    },
    input: {
        flex: 1,
    },
    dropdownview:{
        alignItems:'center',
        top:10,
        
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    dropdown: {
        width: 200,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
    },
})

export default Signup
