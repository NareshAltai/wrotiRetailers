import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  Picker,
  Switch,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  StatusBar,
  Image,
} from 'react-native';
import {useTheme} from '@react-navigation/native';
import {
  Divider,
  Menu,
  Checkbox,
  RadioButton,
  Title,
  List,
} from 'react-native-paper';
import DeveloperAPIClient from '../../state/middlewares/DeveloperAPIClient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ImagePicker from 'react-native-image-picker';
import Toast from 'react-native-simple-toast';
import ImageUpload from '../../components/ImageUpload';
import {ScrollView} from 'react-native-gesture-handler';
import {useIsFocused} from '@react-navigation/native';

const AddBanners = ({navigation, route}) => {
  const theme = useTheme();

  const [status, setStatus] = useState(false);
  const [bannerName, setBannerName] = useState('');
  const [sequence, setSequence] = useState('');
  const [selectedImage, setSelectedImage] = useState();
  const [path, setpath] = React.useState();
  const [isEdited, setIsEdited] = React.useState(false);

  const [bannerType, setBannerType] = useState('offer');
  const [bannerTypeVisible, setBannerTypeVisible] = React.useState(false);
  const openMenu = () => setBannerTypeVisible(true);
  const closeMenu = () => setBannerTypeVisible(false);

  const handleBannerType = item => {
    setBannerType(item);
    closeMenu();
  };

  const toggleStatus = () => {
    setStatus(!status);
  };

  const textInputChange = (val, fn) => {
    if (fn === 'sequence') {
      if (!/[^0-9a-zA-Zء-ي\u0660-\u0669]/.test(val)) {
        setSequence(val);
      }
    }
  };

  //   Api for add banners
  const addBanners = async () => {
    const trimmedBannerName = bannerName.trim(); // Trim the banner name

    if (trimmedBannerName !== bannerName) {
      Toast.showWithGravity(
        'Please give a valid banner name',
        Toast.LONG,
        Toast.BOTTOM,
      );
      return false;
    }

    if (!bannerName.trim()) {
      Toast.showWithGravity(
        'Please give banner name',
        Toast.LONG,
        Toast.BOTTOM,
      );
      return false;
    }

    if (path === null || path === undefined) {
      Toast.showWithGravity(
        'Please select banner image',
        Toast.LONG,
        Toast.BOTTOM,
      );
      return false;
    }
    let api = new DeveloperAPIClient();
    let UserMobile = await AsyncStorage.getItem('MobileNumber');
    let storeId = '345';
    let type = bannerType;
    let bannersResponse = await api.addBanners(
      UserMobile,
      type,
      storeId,
      bannerName,
      path,
      sequence,
      status,
    );
    console.log('bannres----', JSON.stringify(bannersResponse.data));
    if (
      bannersResponse.data.data.status === true ||
      bannersResponse.data.data.status === false
    ) {
      Toast.showWithGravity('Banner added', Toast.LONG, Toast.BOTTOM);
      navigation.navigate('BannersList');
    }
  };

  useEffect(() => {
    if (isEdited && selectedImage) {
      setpath(selectedImage);
    }
  }, [isEdited, selectedImage]);

  // Api for update banners
  const updateBanners = async () => {
    const trimmedBannerName = bannerName.trim(); // Trim the banner name

    if (trimmedBannerName !== bannerName) {
      Toast.showWithGravity(
        'Please give a valid banner name',
        Toast.LONG,
        Toast.BOTTOM,
      );
      return false;
    }

    if (!bannerName.trim()) {
      Toast.showWithGravity(
        'Please give banner name',
        Toast.LONG,
        Toast.BOTTOM,
      );
      return false;
    }
    if (path === null || path === undefined) {
      Toast.showWithGravity(
        'Please select banner image',
        Toast.LONG,
        Toast.BOTTOM,
      );
      return false;
    }

    let api = new DeveloperAPIClient();
    let id = route.params.item.id;
    let UserMobile = await AsyncStorage.getItem('MobileNumber');
    let storeId = '345';
    let type = bannerType;
    let updatedImage = path || route.params.imagesData[0].url;
    let bannersResponse = await api.updateBanners(
      id,
      UserMobile,
      type,
      storeId,
      bannerName,
      updatedImage,
      sequence,
      status,
    );
    console.log(
      'update banners***********',
      JSON.stringify(bannersResponse.data),
    );
    if (
      bannersResponse.data.data.status === true ||
      bannersResponse.data.data.status === false
    ) {
      Toast.showWithGravity('Banners updated', Toast.LONG, Toast.BOTTOM);
      navigation.navigate('BannersList');
    }
  };

  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      if (route?.params?.item?.isEdited === true) {
        let item = route?.params?.item;
        let imagesData = route?.params?.imagesData;
        console.log('imagesData-======', item);
        setBannerName(imagesData[0]?.banner_name);
        setBannerType(item?.banner_type);
        setSequence(imagesData[0]?.sequence?.toString());
        setSelectedImage(imagesData[0]?.url);
        setStatus(item?.status);
        setIsEdited(true);
      } else {
        setIsEdited(false);
      }
    }
  }, [isFocused]);

  return (
    <View style={styles.container}>
      <StatusBar
        backgroundColor="#F4F5F7"
        barStyle={theme.dark ? 'light-content' : 'dark-content'}
      />
      <View
        style={{
          flexDirection: 'row',
          paddingHorizontal: 8,
          paddingVertical: 16,
          backgroundColor: 'white',
          elevation: 10,
          shadowColor: '#040D1C14',
          borderBottomWidth: 0.4,
          borderBottomColor: '#21272E14',
          marginTop: 10,
        }}>
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() => navigation.goBack()}>
          <Image
            style={{width: 28, height: 28, resizeMode: 'center'}}
            source={require('../../assets/back3x.png')}
          />
        </TouchableOpacity>
        <View style={{marginLeft: 1}}>
          <Text
            style={{
              color: '#2B2520',
              fontFamily: 'Poppins-Medium',
              fontSize: 18,
            }}>
            {isEdited == true ? 'Update Banner' : 'Add Banner'}
          </Text>
        </View>
      </View>

      <ScrollView>
        <View>
          <Text style={styles.lable}>Banner Name </Text>
          <TextInput
            placeholder="Enter banner name"
            style={styles.placeholder}
            onChangeText={val => setBannerName(val)}
            value={bannerName}
            placeholderTextColor={'grey'}
          />

          <Text style={styles.lable}>Sequence Number </Text>
          <TextInput
            placeholder="Enter sequence number"
            keyboardType="numeric"
            style={styles.placeholder}
            onChangeText={val => textInputChange(val, 'sequence')}
            value={sequence}
            placeholderTextColor={'grey'}
          />

          <View style={{flexDirection: 'row', marginVertical: 15}}>
            <Text style={styles.lable}>Banner Type</Text>
            <View
              style={{
                height: 40,
                width: 120,
                borderWidth: 1,
                borderColor: 'gray',
                justifyContent: 'center',
                marginHorizontal: 5,
                borderRadius: 2,
                marginTop: 5,
              }}>
              <Menu
                visible={bannerTypeVisible}
                onDismiss={closeMenu}
                anchor={
                  <TouchableOpacity
                    style={{flexDirection: 'row'}}
                    onPress={openMenu}>
                    <Text
                      style={{
                        alignSelf: 'center',
                        marginLeft: 10,
                        color: 'black',
                      }}>
                      {bannerType}
                    </Text>
                    <Image
                      style={{height: 20, width: 20, marginLeft: 10}}
                      source={require('../../assets/images/dropdownIcon.png')}
                    />
                  </TouchableOpacity>
                }>
                {/* <Menu.Item onPress={() => handleBannerType('Promo')} title="Promo"/> */}
                <Menu.Item
                  onPress={() => handleBannerType('offer')}
                  title="offer"
                />
                <Menu.Item
                  onPress={() => handleBannerType('store')}
                  title="store"
                />
                <Menu.Item
                  onPress={() => handleBannerType('storeoffer')}
                  title="storeoffer"
                />
              </Menu>
            </View>
          </View>

          <View style={{flexDirection: 'row'}}>
            <Text style={styles.lable}>Status </Text>
            <Switch
              style={{marginLeft: -10, marginTop: 5}}
              value={status}
              onValueChange={val => {
                toggleStatus(val);
              }}
              color="#2b8f45"
            />
          </View>

          <Text style={[styles.lable, {marginTop: 20}]}>Upload Banners </Text>
          {isEdited === true ? (
            <ImageUpload
              from={'editItem'}
              productImage={selectedImage}
              pathUpdate={setpath}
            />
          ) : (
            <ImageUpload from={'addItem'} pathUpdate={setpath} />
          )}

          {/* {isEdited && selectedImage && (
<View style={{ margin: 5 , flexDirection: "row", marginTop: 10}}>
    <Image source={{ uri: selectedImage}} style={{  width: 130,
            height: 100,
            alignSelf: "center",
            marginLeft: "30%"}} />
    <TouchableOpacity onPress={() => removeImage()}>
      <Image style={{height: 25, width: 25}} 
      source={require('../../assets/redclose.png')} />
    </TouchableOpacity>
  </View>
)} */}
        </View>

        {isEdited == true ? (
          <TouchableOpacity onPress={() => updateBanners()}>
            <View
              style={{
                height: 50,
                backgroundColor: '#399651',
                borderRadius: 10,
                justifyContent: 'center',
                marginHorizontal: 20,
                marginVertical: 20,
              }}>
              <Text
                style={{
                  fontFamily: 'Poppins-Bold',
                  fontSize: 14,
                  alignSelf: 'center',
                  color: '#FFF',
                }}>
                Update
              </Text>
            </View>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={() => addBanners()}>
            <View
              style={{
                height: 50,
                backgroundColor: '#399651',
                borderRadius: 10,
                justifyContent: 'center',
                marginHorizontal: 20,
                marginVertical: 20,
              }}>
              <Text
                style={{
                  fontFamily: 'Poppins-Bold',
                  fontSize: 14,
                  alignSelf: 'center',
                  color: '#FFF',
                }}>
                Save
              </Text>
            </View>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
};

export default AddBanners;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
    marginHorizontal: 5,
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 50,
    resizeMode: 'stretch',
  },
  title: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    marginTop: 10,
  },
  lable: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    marginTop: 10,
    marginHorizontal: 20,
    color: '#000',
  },
  placeholder: {
    borderWidth: 1,
    backgroundColor: '#F2F4F7',
    borderRadius: 10,
    borderColor: '#E7E8EA',
    paddingLeft: 10,
    fontSize: 14,
    fontFamily: 'Poppins-Light',
    marginBottom: 10,
    marginHorizontal: 15,
    color: '#000',
  },
});
