import React,{useState} from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image ,Button} from 'react-native';
import { useNavigation, useFocusEffect, useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Fontisto from 'react-native-vector-icons/Fontisto';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useSelector, useDispatch } from 'react-redux';
import {launchImageLibrary} from 'react-native-image-picker';
import { setUserData } from '../Redux/actions';
const User = () => {
  const { userData } = useSelector(state => state.auth);
  const [selectedImage, setSelectedImage] = useState(null);

  const navigation = useNavigation();
  
  const openImagePicker = () => {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
    //   maxHeight: 2000,
    //   maxWidth: 2000,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('Image picker error: ', response.error);
      } else {
        let imageUri = response.uri || response.assets?.[0]?.uri;
        setSelectedImage(imageUri);
      }
    });
  };
  
  const ProfilePage = () => {
    navigation.navigate('Profile');
}; 

  const dispatch = useDispatch();

  console.log(userData);

  const Logout = () => {
    AsyncStorage.clear();
    dispatch(setUserData(false));
  };

  return (
    <View>

{/* <View style={{ flex: 1, justifyContent: 'center' }}>
     {selectedImage && (
          <Image
            source={{ uri: selectedImage }}
            style={{ flex: 1 }}
            resizeMode="contain"
          />
    )}
    <View style={{ marginTop: 20 }}>
      <Button title="Choose from Device" onPress={openImagePicker} />
    </View>
  </View>
   */}

      {/* Render user data */}
      {userData && (
        <>
          <View style={{backgroundColor:'#3ba8a0'}}>
            {userData?.user.company.logo && (
              <Image
                style={styles.logo}
                source={{ uri: userData.user.company.logo }}
              />
            )}
          </View>


          <View style={{
            marginTop: 65, paddingHorizontal: 20, gap: 18, backgroundColor: 'white', borderRadius: 20, margin: 15, paddingTop: 35, shadowColor: '#171717',
            shadowOffset: { width: -2, height: 4 },
            shadowOpacity: 0.2,
            shadowRadius: 3,
            elevation: 20,
    shadowColor: 'black',
          }}>
            {/* <Text style={styles.Text}>User Data:</Text> */}

            <View style={{ flexDirection: 'row', left: 12, gap: 20, fontSize: 18 }}>
              {/* <Text style={styles.Text}>Emp Id: {userData?.user.id}</Text> */}
              <Text style={{fontSize:16, color:'black',fontWeight:'bold'}}>Setting</Text>

            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ flex: 1, height: 1, backgroundColor: 'gray' }} />
            </View>
            <TouchableOpacity onPress={ProfilePage}>
            <View style={{ flexDirection: 'row', left: 12, gap: 20, fontSize: 18 }}>
              <AntDesign style={{ fontSize: 20, color: 'black', marginTop: 1 }} name="setting" size={20} color="black" />
              <Text style={styles.Text}>Profile</Text>
            </View>
            </TouchableOpacity>

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ flex: 1, height: 1, backgroundColor: 'gray' }} />
            </View>
            <TouchableOpacity >
            <View style={{ flexDirection: 'row', left: 12, gap: 20, fontSize: 18 }}>
              <AntDesign style={{ fontSize: 20, color: 'black', marginTop: 1 }} name="setting" size={20} color="black" />
              <Text style={{fontSize:16}}>FeedBack</Text>
            </View>
            </TouchableOpacity>

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ flex: 1, height: 1, backgroundColor: 'gray' }} />
            </View>
            <TouchableOpacity onPress={Logout}>
              <View style={{ flexDirection: 'row', left: 12, gap: 20, fontSize: 18,marginBottom:150}}>
                <AntDesign style={{ fontSize: 20, color: 'black', marginTop: 1 }} name="logout" size={20} color="black" />
                <Text style={{ fontSize: 15, color: 'red' }}>Log Out</Text>
              </View>
            </TouchableOpacity>

          </View>
        </>
      )}

      {/* <TouchableOpacity onPress={Logout}>
        <View style={{ flexDirection: 'row', left: 12, gap: 20, top: 300 }}>
          <AntDesign style={{ fontSize: 20, color: 'black', marginTop: 1 }} name="logout" size={20} color="black" />
          <Text style={{ fontSize: 15, color: 'red' }}>Log Out</Text>
        </View>
      </TouchableOpacity> */}
    </View>
  );
};

const styles = StyleSheet.create({
  Text: {
    fontSize: 16,
    // left: 50
  },
  logo: {
    alignSelf: 'center',
    width: 170, // Set the width as per your requirement
    height: 170, // Set the height as per your requirement
    resizeMode: 'contain', // This ensures the logo is scaled properly
    // bottom:200
  }
})

export default User;