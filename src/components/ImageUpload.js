import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ImageBackground,
  ActivityIndicator,
  Platform,
} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import DeveloperAPIClient from '../state/middlewares/DeveloperAPIClient';
import Toast from 'react-native-simple-toast';
import AsyncStorage from '@react-native-async-storage/async-storage';

const createFormData = (asset, timeInMs, body = {}) => {
  const data = new FormData();

  // Asset fields in v4: uri, fileName, type, fileSize, width, height
  const fileName = asset.fileName || `photo_${timeInMs}.jpg`;
  const [nameBase = 'photo', ext = 'jpg'] = fileName.split('.');
  const stampedName = `${nameBase}_${timeInMs}.${ext}`;

  data.append('sendimage', {
    name: stampedName,
    type: asset.type || 'image/jpeg',
    uri: Platform.OS === 'ios' ? asset.uri.replace('file://', '') : asset.uri,
  });

  Object.entries(body).forEach(([k, v]) => data.append(k, v));
  return data;
};

const App = ({pathUpdate, productImage}) => {
  const [photoUri, setPhotoUri] = useState(productImage ?? null);
  const [isLoading, setIsLoading] = useState(false);

  const removePhoto = async () => {
    setPhotoUri(null);
    pathUpdate?.(null);
    Toast.showWithGravity('Product image removed', Toast.SHORT, Toast.BOTTOM);
  };

  useEffect(() => {
    setPhotoUri(productImage ?? null);
  }, [productImage]);

  const handleChoosePhoto = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        maxWidth: 600,
        maxHeight: 600,
        quality: 1,
        selectionLimit: 1,
        presentationStyle: 'pageSheet',
      });

      if (result.didCancel) {
        return;
      }
      if (result.errorCode) {
        console.warn('ImagePicker error:', result.errorMessage);
        Toast.showWithGravity('Failed to pick image', Toast.LONG, Toast.BOTTOM);
        return;
      }

      const asset = result.assets?.[0];
      if (!asset?.uri) {
        Toast.showWithGravity('No image selected', Toast.SHORT, Toast.BOTTOM);
        return;
      }

      await uploadImage(asset);
    } catch (e) {
      console.error('Image pick failed:', e);
      Toast.showWithGravity('Something went wrong', Toast.LONG, Toast.BOTTOM);
    }
  };

  const uploadImage = async asset => {
    setIsLoading(true);
    try {
      const time = Date.now();
      const Token = await AsyncStorage.getItem('token');
      const UserMobile = await AsyncStorage.getItem('MobileNumber');

      const formData = createFormData(asset, time, {
        mobileNumber: UserMobile ?? '',
        merchantToken: Token ?? '',
      });

      const api = new DeveloperAPIClient();
      const imagedata = await api.getuploadimage(formData);

      // server returns a path in imagedata.data.path
      const serverPath = imagedata?.data?.path;
      if (serverPath) {
        pathUpdate?.(serverPath);
      }

      setPhotoUri(asset.uri);
      Toast.showWithGravity(
        imagedata?.data?.message || 'Image uploaded',
        Toast.LONG,
        Toast.BOTTOM,
      );
    } catch (e) {
      console.error('Upload failed:', e);
      Toast.showWithGravity('Upload failed', Toast.LONG, Toast.BOTTOM);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View>
      <TouchableOpacity>
        <Image
          style={{width: 33, height: 33, alignSelf: 'center', marginTop: 30}}
          source={require('../assets/image2x.png')}
        />
      </TouchableOpacity>

      <Text style={{alignSelf: 'center', color: '#9BA0A7'}}>
        Upload Image or Click Picture
      </Text>

      <TouchableOpacity
        style={{
          marginTop: 18,
          width: '40%',
          height: 38,
          paddingTop: 8,
          paddingBottom: 15,
          backgroundColor: '#51AF5E',
          borderRadius: 10,
          borderWidth: 1,
          borderColor: '#fff',
          marginLeft: '30%',
        }}
        onPress={handleChoosePhoto}>
        <Text
          style={{
            color: '#fff',
            textAlign: 'center',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: 16,
          }}>
          Upload Image
        </Text>
      </TouchableOpacity>

      {isLoading && <ActivityIndicator size="small" color="black" />}

      {photoUri && (
        <ImageBackground
          source={{uri: photoUri}}
          style={{
            width: 150,
            height: 100,
            resizeMode: 'cover',
            alignSelf: 'center',
            marginTop: 10,
          }}>
          <TouchableOpacity
            style={{alignItems: 'flex-end'}}
            onPress={removePhoto}
            activeOpacity={0.6}>
            <Image
              source={require('../assets/remove.png')}
              style={{height: 20, width: 20, resizeMode: 'contain'}}
            />
          </TouchableOpacity>
        </ImageBackground>
      )}
    </View>
  );
};

export default App;
