import React, { useRef, useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { RNCamera } from 'react-native-camera';
import axios from 'axios';
import { mainUrl } from '../config';
import Geolocation from "@react-native-community/geolocation";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';

const Camera = ({ route }) => {
  const { userData } = useSelector(state => state.auth);
  const cameraRef = useRef(null);
  const navigation = useNavigation();
  const { activity } = route.params;

  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [cameraType, setCameraType] = useState(RNCamera.Constants.Type.front);

  const takePicture = async () => {
    if (cameraRef && !loading) {
      setLoading(true);
      try {
        const options = { quality: 0.5, base64: true };
        const data = await cameraRef.current.takePictureAsync(options);
        submitData(data.uri);
      } catch (error) {
        console.log("Error capturing image: ", error);
        setLoading(false);
      }
    }
  };

  const submitData = async (uri) => {
    try {
      const formData = new FormData();
      formData.append('user_id', userData.user.id);
      formData.append('image', {
        uri,
        type: 'image/jpeg',
        name: 'photo.jpg',
      });
      formData.append('latitude', location.latitude);
      formData.append('longitude', location.longitude);
      formData.append('activity', activity);

      const response = await axios.post(`${mainUrl}/Activity.php`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(response.data);
      navigation.navigate('BottomTabs', { checkIn: activity === 'Check In'});
    } catch (error) {
      console.log("Error submitting data: ", error);
    } finally {
      setLoading(false);
    }
  };

  const getLocation = async () => {
    try {
      const position = await new Promise((resolve, reject) => {
        Geolocation.getCurrentPosition(
          resolve,
          reject,
        );
      });
      setLocation({ latitude: position.coords.latitude, longitude: position.coords.longitude });
    } catch (error) {
      console.log("Error getting location: ", error);
    }
  };

  useEffect(() => {
    getLocation();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.container}>
        <RNCamera
          ref={cameraRef}
          style={styles.preview}
          type={cameraType}
          captureAudio={false}
        />
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back-circle-outline" size={40} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.cameraToggleButton} onPress={() => setCameraType(
            cameraType === RNCamera.Constants.Type.back ? RNCamera.Constants.Type.front : RNCamera.Constants.Type.back
          )}>
          <Text>
            <Ionicons name="camera-reverse-outline" size={30} color="white" />
          </Text>
        </TouchableOpacity>
        <View style={styles.bottomContainer}>
          <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
            <Text>Capture</Text>
          </TouchableOpacity>
        </View>
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="white" />
          </View>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  preview: {
    flex: 1,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 20,
    width: '100%',
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
  },
  cameraToggleButton: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 50,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -25 }, { translateY: -25 }],
    zIndex: 999,
  },
});

export default Camera;
