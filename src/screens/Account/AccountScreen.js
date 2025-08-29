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
} from 'react-native';
import {useTheme} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AuthContext} from '../../components/context';
import CustomInput from '../../components/CustomInput';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// import VersionCheck from 'react-native-version-check';
import RBSheet from 'react-native-raw-bottom-sheet';
import Toast from 'react-native-simple-toast';
const updateModes = 'flexible';
import DeviceInfo from 'react-native-device-info';
import Config from 'react-native-config';
//import NetworkChecker from "react-native-network-checker";
import {useDispatch, useSelector} from 'react-redux';
import * as orderActions from '../../redux/actions/orderActions';
// import {Switch} from 'react-native-switch';
import DeveloperAPIClient from '../../state/middlewares/DeveloperAPIClient';
import {useIsFocused} from '@react-navigation/native';
import {Divider} from 'react-native-paper';

const AccountScreen = ({navigation}) => {
  const [userData, setuserData] = useState({});
  const [FirstName, setFirstName] = useState();
  const [LastName, setLastName] = useState();
  const [UserName, setUserName] = useState();
  const [MobileNumber, setMobileNumber] = useState();
  const [downloadApkProgress, setDownloadProgress] = useState();
  const [storeStatus, setStoreStatus] = useState();
  const [store_type, setStore_type] = React.useState();
  const dispatch = useDispatch();

  const isFocused = useIsFocused();

  const {colors} = useTheme();

  const [data, setData] = React.useState({
    RBSheetLogout: {},
  });

  const theme = useTheme();

  const loadUser = async () => {
    let Store = await AsyncStorage.getItem('StoreName');
    let store_type = await AsyncStorage.getItem('store_type');
    setStore_type(store_type);
    setUserName(Store);
    let MobileNumber = await AsyncStorage.getItem('MobileNumber');
    setMobileNumber(MobileNumber);
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getStoreStatus();
      loadUser();
    });
    return unsubscribe;
  }, [isFocused]);

  const {signOut, toggleTheme} = React.useContext(AuthContext);

  const LogOut = async () => {
    dispatch(orderActions.refreshOrders());
    signOut();
  };

  const getStoreStatus = async () => {
    let api = new DeveloperAPIClient();
    let Token = await AsyncStorage.getItem('token');
    let UserMobile = await AsyncStorage.getItem('MobileNumber');
    let getStoreStatus = await api.getStoreStatus(UserMobile, Token);
    if (getStoreStatus.success == true) {
      setStoreStatus(getStoreStatus.storeStatus);
    }
  };

  const [storeType, setStoreType] = React.useState();
  const manageStore = async status => {
    let api = new DeveloperAPIClient();
    let Token = await AsyncStorage.getItem('token');
    let UserMobile = await AsyncStorage.getItem('MobileNumber');
    let store_type = await AsyncStorage.getItem('store_type');
    console.log('STORE TYPE==========>', store_type);
    setStoreType(store_type);
    let updateStoreTimings = await api.updateStoreStatus(
      UserMobile,
      Token,
      status,
    );
    if (updateStoreTimings.success == true) {
      setStoreStatus(status);
      Toast.showWithGravity(
        updateStoreTimings.message,
        Toast.LONG,
        Toast.BOTTOM,
      );
    }
  };
  const updateStoreTiming = async status => {
    Alert.alert(
      status ? 'Welcome Back' : 'Note',
      status
        ? 'Please check new orders.'
        : 'Users can still place the order, deliver the order once store is open!',
      [
        {text: 'Cancel', cancelable: true},
        {text: 'OK', onPress: () => manageStore(status)},
      ],
    );
  };

  // const updater = async () => {
  //   let updateNeeded = await VersionCheck.needUpdate();
  // };

  return (
    <View style={styles.container}>
      <>
        <StatusBar
          backgroundColor="#F4F5F7"
          barStyle={theme.dark ? 'light-content' : 'dark-content'}
        />

        <View style={styles.container}>
          <View
            style={{
              flexDirection: 'row',
              marginHorizontal: 5,
              marginVertical: 15,
            }}>
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => navigation.goBack()}>
              <Image
                style={{width: 28, height: 28, resizeMode: 'center'}}
                source={require('../../assets/back3x.png')}
              />
            </TouchableOpacity>
            <View style={{marginLeft: 5}}>
              <Text
                style={{
                  color: '#0F0F0F',
                  fontFamily: 'Poppins-Bold',
                  fontSize: 16,
                  marginTop: 2,
                }}>
                My Account
              </Text>
            </View>
          </View>
          <Divider />
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.body}>
              <View style={styles.card}>
                <TouchableOpacity
                  onPress={() => navigation.navigate('ProfileScreen')}
                  style={styles.row}
                  activeOpacity={0.7}>
                  <View style={styles.icon}>
                    {
                      <Image
                        style={{width: 25, height: 25}}
                        source={require('../../assets/userC.png')}
                      />
                    }
                  </View>
                  <Text
                    style={[styles.heading, {marginLeft: 20, fontSize: 14}]}>
                    My Profile
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => navigation.navigate('StoreSettings')}
                  style={styles.row}
                  activeOpacity={0.7}>
                  <View style={styles.icon}>
                    {
                      <Image
                        style={{width: 25, height: 25}}
                        source={require('../../assets/storeSettings.png')}
                      />
                    }
                  </View>
                  <Text
                    style={[styles.heading, {marginLeft: 20, fontSize: 14}]}>
                    Store Settings
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => navigation.navigate('PaymentStatus')}
                  style={styles.row}
                  activeOpacity={0.7}>
                  <View style={styles.icon}>
                    {
                      <Image
                        style={{width: 25, height: 25}}
                        source={require('../../assets/paymentStatus.png')}
                      />
                    }
                  </View>
                  <Text
                    style={[styles.heading, {marginLeft: 20, fontSize: 14}]}>
                    Payment Status
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => navigation.navigate('VideoTutorial')}
                  style={styles.row}
                  activeOpacity={0.7}>
                  <View style={styles.icon}>
                    {
                      <Image
                        style={{width: 25, height: 25}}
                        source={require('../../assets/videoIcon.png')}
                      />
                    }
                  </View>
                  <Text
                    style={[styles.heading, {marginLeft: 20, fontSize: 14}]}>
                    Tutorials
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => navigation.navigate('ReportsScreen')}
                  style={styles.row}
                  activeOpacity={0.7}>
                  <View style={styles.icon}>
                    {
                      <Image
                        style={{width: 25, height: 25}}
                        source={require('../../assets/report.png')}
                      />
                    }
                  </View>
                  <Text
                    style={[styles.heading, {marginLeft: 20, fontSize: 14}]}>
                    Reports
                  </Text>
                </TouchableOpacity>

                {store_type != 'default' && (
                  <TouchableOpacity
                    onPress={() => navigation.navigate('BannersList')}
                    style={styles.row}
                    activeOpacity={0.7}>
                    <View style={styles.icon}>
                      {
                        <Image
                          style={{width: 25, height: 25}}
                          source={require('../../assets/banner.png')}
                        />
                      }
                    </View>
                    <Text
                      style={[styles.heading, {marginLeft: 20, fontSize: 14}]}>
                      Banners
                    </Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  onPress={() => navigation.navigate('CouponsScreen')}
                  style={styles.row}
                  activeOpacity={0.7}>
                  <View style={styles.icon}>
                    <Image
                      style={{width: 25, height: 25}}
                      source={require('../../assets/coupons.png')}
                    />
                  </View>
                  <Text
                    style={[styles.heading, {marginLeft: 20, fontSize: 14}]}>
                    Your Coupons
                  </Text>
                </TouchableOpacity>
                {store_type === 'default' && (
                  <>
                    <TouchableOpacity
                      onPress={() => navigation.navigate('CustumersScreen')}
                      style={styles.row}
                      activeOpacity={0.7}>
                      <View style={styles.icon}>
                        <Image
                          style={{
                            resizeMode: 'center',
                            height: 25,
                            width: 25,
                          }}
                          source={require('../../assets/templates.png')}
                        />
                      </View>
                      <Text
                        style={[
                          styles.heading,
                          {marginLeft: 20, fontSize: 14},
                        ]}>
                        Your Customers
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => navigation.navigate('ChatsScreen')}
                      style={styles.row}
                      activeOpacity={0.7}>
                      <View style={styles.icon}>
                        <Image
                          style={{
                            resizeMode: 'center',
                            height: 25,
                            width: 25,
                          }}
                          source={require('../../assets/chats.png')}
                        />
                      </View>
                      <Text
                        style={[
                          styles.heading,
                          {marginLeft: 20, fontSize: 14},
                        ]}>
                        Chats
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => navigation.navigate('TemplateListScreen')}
                      style={styles.row}
                      activeOpacity={0.7}>
                      <View style={styles.icon}>
                        <Image
                          style={{
                            resizeMode: 'center',
                            height: 25,
                            width: 25,
                          }}
                          source={require('../../assets/templates.png')}
                        />
                      </View>
                      <Text
                        style={[
                          styles.heading,
                          {marginLeft: 20, fontSize: 14},
                        ]}>
                        Your Templates
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => navigation.navigate('BroadCastsScreen')}
                      // onPress={()=>navigation.navigate('NewBroadCastsScreen')}
                      style={styles.row}
                      activeOpacity={0.7}>
                      <View style={styles.icon}>
                        <Image
                          style={{
                            resizeMode: 'center',
                            height: 25,
                            width: 25,
                          }}
                          source={require('../../assets/broadcast.png')}
                        />
                      </View>
                      <Text
                        style={[
                          styles.heading,
                          {marginLeft: 20, fontSize: 14},
                        ]}>
                        Your Campaigns
                      </Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginVertical: 10,
                }}
                activeOpacity={0.7}>
                <Text style={[styles.heading, {fontSize: 14}]}>
                  APP VERSION :{/* {`${VersionCheck.getCurrentVersion()}`} */}
                </Text>
                {/* {Config.ENV != "uat" && (
                  <TouchableOpacity
                    onPress={() => updater()}
                    style={{ marginLeft: 20 }}
                  >
                    <Text style={{ textDecorationLine: "underline" }}>
                      Update
                    </Text>
                  </TouchableOpacity>
                )} */}
              </View>
            </View>
          </ScrollView>

          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => data.RBSheetLogout.open()}
            style={styles.button}>
            <Icon name="logout" size={20} color={'white'} />
            <Text style={[styles.logout, {color: 'white'}]}>LOGOUT</Text>
          </TouchableOpacity>
        </View>

        <RBSheet
          ref={ref => {
            data.RBSheetLogout = ref;
          }}
          height={200}
          openDuration={250}
          customStyles={{
            container: {
              justifyContent: 'center',
              borderTopRightRadius: 30,
              borderTopLeftRadius: 30,
            },
          }}>
          <View>
            <Text
              style={[styles.text, {fontFamily: 'Lato-Bold', fontSize: 20}]}>
              Log Out
            </Text>
            <Text
              style={[
                styles.text,
                {
                  fontFamily: 'Lato-Regular',
                  color: '#847D76',
                  fontSize: 13,
                  marginVertical: 5,
                },
              ]}>
              Are you sure you want to log out?
            </Text>

            <TouchableOpacity
              activeOpacity={0.6}
              style={styles.btn}
              onPress={() => {
                LogOut();
              }}>
              <Text style={[styles.text, {color: 'white'}]}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </RBSheet>
      </>
    </View>
  );
};

export default AccountScreen;

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
