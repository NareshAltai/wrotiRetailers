import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
  Linking,
  Modal,
  Button,
  ActivityIndicator,
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
import {FlatList} from 'react-native-gesture-handler';
import Toast from 'react-native-simple-toast';
import {useFocusEffect} from '@react-navigation/native';
import Header from '../../components/Header';

const BannersList = ({navigation}) => {
  const theme = useTheme();
  const [bannersList, setBannersList] = useState([]);
  const [refresh, setRefresh] = React.useState(false);
  const [isLoader, setIsLoader] = React.useState(false);

  const getBanners = async () => {
    setIsLoader(true);
    let api = new DeveloperAPIClient();
    let UserMobile = await AsyncStorage.getItem('MobileNumber');
    let tag = '';
    let bannersResponse = await api.getBanners(UserMobile, tag);
    let bannersData = bannersResponse?.data?.data?.banners;
    bannersData?.sort(
      (a, b) => bannersData.indexOf(b) - bannersData.indexOf(a),
    );
    console.log(
      'bannres list =============',
      JSON.stringify(bannersResponse.data.data),
    );
    setBannersList(bannersData);
    setIsLoader(false);
  };

  const [isPopUpVisible, setIsPopUpVisible] = useState(false);

  const deleteBanner = async item => {
    setRefresh(true);
    let api = new DeveloperAPIClient();
    let id = item.id;
    let deleteBannerResponse = await api.deleteBanner(id);
    console.log('response==', deleteBannerResponse.data);
    if (deleteBannerResponse.data.data.success === true) {
      Toast.showWithGravity(
        deleteBannerResponse.data.data.message,
        Toast.LONG,
        Toast.BOTTOM,
      );
    }
    setRefresh(false);
    setIsPopUpVisible(false);
  };

  useFocusEffect(
    React.useCallback(() => {
      getBanners();
      setRefresh(false);
      return () => {};
    }, [refresh]),
  );

  const openImage = item => {
    Linking.openURL(item.url);
  };

  const handleDelete = item => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this banner?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => deleteBanner(item),
          style: 'destructive',
        },
      ],
      {cancelable: false},
    );
  };

  const InnerFlatList = ({images, item, status}) => {
    return (
      <FlatList
        data={images}
        renderItem={({item}) => (
          <>
            <View style={{flexDirection: 'row'}}>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: 'Poppins-Bold',
                  color: '#000',
                }}>
                Banner Name
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: 'Poppins-Bold',
                  marginLeft: '2%',
                  color: '#000',
                }}>
                :
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: 'Poppins-Medium',
                  marginLeft: 10,
                  color: '#000',
                }}>
                {item.banner_name}
              </Text>
            </View>
            <View style={{flexDirection: 'row'}}>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: 'Poppins-Bold',
                  color: '#000',
                }}>
                Status
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: 'Poppins-Bold',
                  marginLeft: '19%',
                  color: '#000',
                }}>
                :
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: 'Poppins-Medium',
                  marginLeft: 10,
                  color: '#000',
                }}>
                {status === true ? 'Active' : 'Inactive'}
              </Text>
            </View>
            <View style={{flexDirection: 'row', marginTop: 5}}>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: 'Poppins-Bold',
                  color: '#000',
                }}>
                Sequence
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: 'Poppins-Bold',
                  marginLeft: '11%',
                  color: '#000',
                }}>
                :
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: 'Poppins-Medium',
                  marginLeft: 10,
                  color: '#000',
                }}>
                {item.sequence}
              </Text>
            </View>

            <View style={{flexDirection: 'row', marginTop: 5}}>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: 'Poppins-Bold',
                  color: '#000',
                }}>
                Banners URL
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: 'Poppins-Bold',
                  marginLeft: '5%',
                  color: '#000',
                }}>
                :
              </Text>
              <TouchableOpacity onPress={() => openImage(item)}>
                <Text
                  style={{
                    marginHorizontal: 10,
                    fontFamily: 'Poppins-Medium',
                    fontSize: 12,
                    color: '#3c966b',
                    width: 200,
                  }}>
                  {item.url}
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}
        keyExtractor={item => item._id}
      />
    );
  };

  const renderItem = ({item}) => (
    <View
      style={{
        backgroundColor: '#ededed',
        marginHorizontal: 15,
        marginTop: 10,
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 10,
      }}>
      <View style={{flexDirection: 'row'}}>
        <Text style={{fontSize: 14, fontFamily: 'Poppins-Bold'}}>
          Banner Type
        </Text>
        <Text
          style={{fontSize: 14, fontFamily: 'Poppins-Bold', marginLeft: '5%'}}>
          :
        </Text>
        <Text
          style={{fontSize: 14, fontFamily: 'Poppins-Medium', marginLeft: 10}}>
          {item.banner_type}
        </Text>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('AddBanners', {
              item: item,
              imagesData: item.images,
              isEdited: (item.isEdited = true),
            })
          }
          style={{marginLeft: 'auto', marginRight: 10}}>
          <Image
            style={{height: 25, width: 25}}
            source={require('../../assets/images/edit.png')}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => handleDelete(item)}>
          <Image
            style={{height: 25, width: 25}}
            source={require('../../assets/images/trash.png')}
          />
        </TouchableOpacity>
      </View>
      <InnerFlatList status={item?.status} images={item.images} />
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar
        backgroundColor="#F4F5F7"
        barStyle={theme.dark ? 'light-content' : 'dark-content'}
      />
      <Header
        title={'Banners'}
        rightContent={
          <TouchableOpacity
            style={{
              height: 35,
              width: 120,
              justifyContent: 'center',
              borderRadius: 10,
              backgroundColor: '#549666',
            }}
            onPress={() => navigation.navigate('AddBanners')}>
            <Text
              style={{
                color: '#FFF',
                alignSelf: 'center',
                fontSize: 14,
                fontFamily: 'Poppins-SemiBold',
              }}>
              Add Banner
            </Text>
          </TouchableOpacity>
        }
      />

      {/* banners list */}
      {isLoader ? (
        <View style={{marginTop: 10}}>
          <ActivityIndicator size={'small'} color="green" />
        </View>
      ) : (
        <>
          {bannersList?.length > 0 ? (
            <FlatList
              data={bannersList}
              renderItem={renderItem}
              keyExtractor={item => item.id}
            />
          ) : (
            <Text
              style={{
                fontFamily: 'Poppins-Medium',
                fontSize: 14,
                alignSelf: 'center',
                marginTop: '40%',
                color: '#000',
              }}>
              No banners to display
            </Text>
          )}
        </>
      )}
    </View>
  );
};

export default BannersList;

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
  heading: {
    color: '#2B2520',
    fontFamily: 'Lato-Bold',
    fontSize: 16,
    alignItems: 'center',
    textAlign: 'center',
  },

  number: {
    color: '#84694D',
    fontFamily: 'Lato-Regular',
    fontSize: 15,
    marginTop: 5,
  },
  btnText: {
    color: 'white',
    fontSize: 15,
    fontFamily: 'Lato-Bold',
    marginTop: 5,
  },
  body: {
    marginHorizontal: 10,
    marginVertical: 20,
  },
  card: {
    backgroundColor: '#fff',
    elevation: 1,
    padding: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  order: {
    color: '#2B2520',
    fontSize: 15,
    fontFamily: 'Lato-Bold',
    marginVertical: 10,
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
  },
  button: {
    marginHorizontal: 50,
    marginTop: 30,
    padding: 10,
    borderWidth: 1,
    borderColor: '#DDD6D1',
    borderRadius: 2,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#34A549',
  },
  logout: {
    color: '#A49A91',
    fontFamily: 'Lato-Bold',
    marginLeft: 10,
  },
  btn: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#34A549',
    marginRight: 30,
    marginLeft: 30,
    marginTop: 10,
    borderRadius: 5,
  },
  text: {
    fontSize: 18,
    textAlign: 'center',
  },
  instructions: {
    fontSize: 12,
    color: '#34A549',
    marginBottom: 5,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    textAlign: 'center',
  },
});
