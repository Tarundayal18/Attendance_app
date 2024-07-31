import React, { useState, useEffect,useFocusEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ImageBackground,
  ActivityIndicator,
} from 'react-native';
import { Button } from 'react-native-elements';
import { useNavigation, useIsFocused } from '@react-navigation/native'; 
import { mainUrl } from '../config';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Entypo from 'react-native-vector-icons/Entypo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setLoggedIn, setUserdata } from '../Redux/actions';
import { useDispatch } from 'react-redux';
import { setUserData } from '../Redux/actions';

const Login = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused(); 

  const [error, setError] = useState({ field: '', message: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formData, setFormData] = useState({
    Email: '',
    Password: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const dispatch = useDispatch();

  const handleSubmit = async () => {
    let loginError = { field: '', message: '' };
    if (email === '') {
      loginError.field = 'email';
      loginError.message = '*Email is required';
      setError(loginError);
    } else if (password === '') {
      loginError.field = 'password';
      loginError.message = '*Password is required';
      setError(loginError);
    } else {
      setIsLoading(true);
      const formData = new FormData();
      formData.append('email', email);
      formData.append('password', password);
      

      fetch(`${mainUrl}/login.php`, {
        method: 'POST',
        body: formData,
      })
      .then(response => response.json())
      .then(data => {
        if (data.status === 200) {
          
          const userData = data.user;
          const dat = {
            isLogin: true,
            user: userData
          };
          AsyncStorage.setItem('user_data', JSON.stringify(dat));
          
          dispatch(setUserData(dat));
  
          console.log('Login successful. User data:', userData);
        } else {
          alert(data.message);
        }
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setIsLoading(false); // Stop loading indicator
      });
    }
  };
  
  // const checkLoggedIn = async () => {
  //   const userData = await AsyncStorage.getItem('user_data');
  //   if (userData) {
  //     // User is already logged in, navigate to main screen
  //     navigation.navigate('MainScreen'); // Replace 'MainScreen' with your main screen name
  //   }
  // };

  const SignupPge = () => {
    navigation.navigate('Signup');
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    setIsLoading(false);
  }, [isFocused]);

  return (
    <>
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps={'always'}
        showsVerticalScrollIndicator={false}>
        <View>
          <ImageBackground
            source={require('../assets/images/5570834.jpg')}>
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
              <KeyboardAwareScrollView
                keyboardShouldPersistTaps={'always'}
                showsVerticalScrollIndicator={false}>
                <Text
                  style={{
                    fontSize: 28,
                    marginTop: 20,
                    color: 'black',
                    marginLeft: 50,
                    fontWeight: 'bold',
                  }}>
                  Login
                </Text>

                <View style={{ marginTop: 20 }}>
                  <View>
                    <TextInput
                      keyboardType='email-address'
                      style={[styles.input1, { marginBottom: 3 }]}
                      onChangeText={text => setEmail(text)}
                      value={email}
                      placeholder="Email"
                      maxLength={30}
                    />
                    {error.field === 'email' && (
                      <Text style={{ color: 'red', fontSize: 12, marginHorizontal: 50 }}>
                        {error.message}
                      </Text>
                    )}
                  </View>

                  <View style={styles.inputContainer}>
                    <TextInput
                      style={styles.input}
                      onChangeText={text => setPassword(text)}
                      value={password}
                      placeholder="Password"
                      secureTextEntry={!showPassword}
                      maxLength={50}
                    />
                    <Entypo
                      name={showPassword ? 'eye' : 'eye-with-line'}
                      size={24}
                      color="black"
                      style={styles.icon}
                      onPress={toggleShowPassword}
                    />
                  </View>
                  {error.field === 'password' && (
                    <Text style={{ color: 'red', fontSize: 12, marginHorizontal: 50 }}>
                      {error.message}
                    </Text>
                  )}
                </View>

                <View style={styles.buttonContainer}>
                  <Button
                    onPress={handleSubmit}
                    title="Log In"
                    buttonStyle={{ backgroundColor: '#0e2a4c', borderRadius: 50 }}
                  />
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    gap: 5,
                    marginTop: 20,
                    marginBottom: 180,
                  }}>
                  <TouchableOpacity>
                    <Text style={styles.text}>Create an account?</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={SignupPge}>
                    <Text style={styles.text2}>Signup</Text>
                  </TouchableOpacity>
                </View>
              </KeyboardAwareScrollView>
            </View>
          </ImageBackground>
        </View>
      </KeyboardAwareScrollView>
      {isLoading && (
        <View style={[styles.container, styles.horizontal]}>
          <ActivityIndicator size="large" color="red" />
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  main: {
    marginTop: 318,
    backgroundColor: 'white',
    borderRadius: 50,
  },
  input1: {
    borderRadius: 50,
    // margin: 12,
    flex: 1,
    borderWidth: 2,
    marginHorizontal: 33,
    paddingHorizontal: 19,
  },
  buttonContainer: {
    marginHorizontal: 40,
    marginTop: 20,
  },
  text: {
    fontSize: 17,
    color: 'black',
  },
  text2: {
    fontSize: 17,
    color: '#0e2a4c',
    fontWeight: 'bold',
  },
  icon: {
    direction: 'ltr',
  },
  logo: {
    alignSelf: 'center',
    position: 'absolute',
    top: 120,
    marginTop: 20,
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
  icon: {
    // marginLeft: 10,
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
});

export default Login;