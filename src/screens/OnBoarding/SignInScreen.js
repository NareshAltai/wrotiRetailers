import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Platform,
  StyleSheet,
  StatusBar,
  ImageBackground,
  Image,
  Keyboard,
  ScrollView,
  Linking,
  KeyboardAvoidingView,
  Button,
  Dimensions,
} from 'react-native';
import DeveloperAPIClient from '../../state/middlewares/DeveloperAPIClient';
// import { SliderBox } from "react-native-image-slider-box";
// var oauthSignature = require("oauth-signature");
import {useTheme} from 'react-native-paper';
import {AuthContext} from '../../components/context';
// import { showMessage } from "react-native-flash-message";
import Toast from 'react-native-simple-toast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import firebase from '@react-native-firebase/app';
import DeviceInfo from 'react-native-device-info';
import Icon from 'react-native-vector-icons/FontAwesome5';
// import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
// import AnimateLoadingButton from 'react-native-animate-loading-button';
//import NetworkChecker from "react-native-network-checker";
import * as orderActions from '../../redux/actions/orderActions';
import {useDispatch, useSelector} from 'react-redux';
import {BGI} from '../../assets';
import Swiper from 'react-native-swiper';
import Banner from '../../components/Banner';
import {responsiveHeight} from 'react-native-responsive-dimensions';
import Config from 'react-native-config';
import CustomLoadingButton from '../../components/CustomLoadingButton';
// import {InAppUpdate} from "../../inappupdate/InAppUpdate";

const SignInScreen = ({navigation, route}) => {
  const [data, setData] = React.useState({
    getStartedButton: {},
  });
  const dispatch = useDispatch();
  const {colors} = useTheme();
  const [mobile, setMobile] = React.useState('');
  const [autofillMobile, setautofillMobile] = React.useState('');
  const [autofillPassword, setautofillPassword] = React.useState('');
  const [token, settoken] = React.useState('');
  const {signIn} = React.useContext(AuthContext);
  const [check_textInputChange, setCheck_textInputChange] =
    React.useState(false);
  const [isValidUser, setIsValidUser] = React.useState(true);
  const [password, setPassword] = React.useState('');
  const [hidePass, setHidePass] = useState(true);
  const [dataa, setDataa] = React.useState({
    username: '',
    check_textInputChange: false,
    secureTextEntry: true,
    isValidUser: true,
    isValidPassword: true,
    password_input: {},
  });

  const login = async () => {
    // data.getStartedButton.showLoading(true);
    if (mobile == null) {
      Toast.showWithGravity(
        'Please Enter Mobile Number',
        Toast.LONG,
        Toast.BOTTOM,
      );
      // data.getStartedButton.showLoading(false);
      return false;
    }
    if (password == null) {
      Toast.showWithGravity('Please Enter Password', Toast.LONG, Toast.BOTTOM);
      // data.getStartedButton.showLoading(false);
      return false;
    }
    const api = new DeveloperAPIClient();
    let loginResponse = await api.LoginwithPassword(mobile, password);
    console.log('login=====', loginResponse.data);
    // data.getStartedButton.showLoading(false);
    await AsyncStorage.setItem('MobileNumber', mobile);
    await AsyncStorage.setItem('Password', password);
    let loginData = loginResponse.data;
    if (loginData != null) {
      await AsyncStorage.setItem('token', loginData?.token);
      await AsyncStorage.setItem('StoreName', loginData?.name);
      await AsyncStorage.setItem('StoreType', loginResponse.data.store_type);
      await AsyncStorage.setItem('Currency_Code', loginData?.currency_code);
      await AsyncStorage.setItem(
        'StoreStatus',
        JSON.stringify(loginData?.storeStatus),
      );
      await AsyncStorage.setItem(
        'isPOSUser',
        JSON.stringify(loginData?.pos_enabled),
      );
      if (loginData?.store_front_url) {
        await AsyncStorage.setItem(
          'imageBaseURL',
          loginData?.store_front_url
            ? JSON.stringify(loginData?.store_front_url)
            : null,
        );
      }
      if (loginData.country_code != null && loginData.country_code != undefined)
        await AsyncStorage.setItem('countryCode', loginData?.country_code);
      let UserMobile = await AsyncStorage.getItem('MobileNumber');
      let Password = await AsyncStorage.getItem('Password');
      setMobile(UserMobile);
      setPassword(Password);
      console.log(UserMobile);
      const fcmToken = await messaging().getToken();
      console.log('O====================> ~ login ~ fcmToken:', fcmToken);
      if (fcmToken) {
        await AsyncStorage.setItem('fcmToken', fcmToken);
      } else {
      }
      let uniqueId = await DeviceInfo.getUniqueId();
      let fctockendata = await api.FCTOKEN(UserMobile, fcmToken, uniqueId);
      console.log(
        'O====================> ~ login ~ fctockendata:',
        fctockendata,
      );
      let token = loginData.token;
      await AsyncStorage.setItem('token', token);
      // dispatch(orderActions.refreshOrders());
      // const customerResp = await api.getCustomer(userId, token);
      signIn(token, UserMobile, navigation);
    } else {
      // data.getStartedButton.showLoading(false);
      Toast.showWithGravity('Invalid Credentials.', Toast.LONG, Toast.BOTTOM);
    }
  };

  const banners = [
    require('../../assets/ill3x.png'),
    require('../../assets/banner3x.png'),
    require('../../assets/banner3big3.png'),
  ];

  const onSubmit = val => {
    Keyboard.dismiss();
    login();
  };

  const loaddefualtValues = async () => {
    let UserMobile = await AsyncStorage.getItem('MobileNumber');
    let Password = await AsyncStorage.getItem('Password');
    setMobile(UserMobile);
    setPassword(Password);
  };

  useEffect(() => {
    loaddefualtValues();
    //  InAppUpdate.checkUpdate();
    if (route.params && route.params.mobile) setMobile(route.params.mobile);
    if (route.params && route.params.token) settoken(route.params.token);
  }, []);

  const whatsapp = number => {
    let phoneNumber = '';
    if (Platform.OS === 'android') {
      phoneNumber = `tel:${number}`;
    } else {
      phoneNumber = `telprompt:${number}`;
    }
    Linking.openURL(`whatsapp://send?text=&phone=${number}`);
  };
  const {width} = Dimensions.get('window');

  return (
    <View style={styles.container}>
      <>
        <StatusBar backgroundColor="#F1F9F3" barStyle="light-content" />
        <ScrollView keyboardShouldPersistTaps="handled" style={{flex: 1}}>
          <KeyboardAvoidingView>
            <View style={{alignItems: 'center'}}>
              <View>
                <ImageBackground
                  // resizeMode="contain"
                  style={{height: 350, width: '100%', paddingTop: '8%'}}
                  source={BGI}>
                  <View style={{marginTop: 5, height: 200, borderWidth: 0}}>
                    {/* <SliderBox
                      dotColor="#34A549"
                      inactiveDotColor="#ffff"
                      resizeMode="center"
                      images={banners}
                      paginationBoxStyle={{ padding: 10 }}
                    /> */}
                    <Banner
                      data={banners}
                      height={responsiveHeight(400)}
                      autoPlay={true}
                      // onPressBanner={() => {}}
                    />
                  </View>
                  <Text
                    style={{
                      fontFamily: 'Poppins-Medium',
                      fontSize: 16,
                      color: '#21272E',
                      marginBottom: '20%',
                      marginTop: 10,
                      // alignItems: "center",
                      // justifyContent: "center",
                      marginLeft: '10%',
                    }}>
                    BUSINESS IDEA CRAFTED FOR YOUR STORE
                  </Text>
                </ImageBackground>
              </View>

              <View style={{marginTop: '3%'}}>
                <Text
                  style={{
                    fontFamily: 'Poppins-Medium',
                    fontSize: 16,
                    color: '#21272E',
                  }}>
                  Please enter your mobile number {'\n'}
                  {'                 '} to get started!
                </Text>
              </View>
            </View>

            <View style={{marginHorizontal: 15}}>
              <View style={{flexDirection: 'row'}}>
                <View style={{marginTop: 31, marginRight: 3}}>
                  <Image
                    style={{height: 20, width: 20}}
                    source={require('../../assets/phone2x.png')}
                  />
                </View>
                <Text
                  style={{
                    marginTop: 33,
                    color: '#21272E',
                    fontFamily: 'Poppins-SemiBold',
                    fontSize: 14,
                  }}>
                  Phone Number
                </Text>
              </View>
              <View>
                <TextInput
                  style={styles.input}
                  value={mobile}
                  autoCapitalize="none"
                  placeholder="Please enter your WhatsApp number"
                  placeholderTextColor="#9BA0A7"
                  returnKeyType="next"
                  keyboardType="numeric"
                  onChangeText={val => setMobile(val)}
                  onSubmitEditing={() => {
                    data.password_input.focus();
                  }}
                  maxLength={10}
                />
                <View style={{flexDirection: 'row'}}>
                  <View style={{marginTop: 18}}>
                    <Image
                      style={{height: 20, width: 20}}
                      source={require('../../assets/Lock3x.png')}
                    />
                  </View>
                  <Text
                    style={{
                      marginTop: 20,
                      color: '#21272E',
                      fontFamily: 'Poppins-SemiBold',
                      fontSize: 14,
                    }}>
                    Password
                  </Text>
                </View>
              </View>
              <View
                style={{
                  // backgroundColor: '#326b4a',

                  flex: 1,
                  marginBottom: 10,
                  flexDirection: 'row',
                  alignItems: 'center',
                  height: 40,
                  borderRadius: 10,
                  marginTop: 5,
                  backgroundColor: '#F7F7FC',
                }}>
                <TextInput
                  style={{
                    height: 55,
                    flex: 1,
                    fontSize: 12,
                    paddingHorizontal: 20,
                    color: 'black',
                  }}
                  ref={input => {
                    data.password_input = input;
                  }}
                  autoCapitalize="none"
                  onChangeText={text => setPassword(text)}
                  placeholder="Please enter your Password"
                  placeholderTextColor="#9BA0A7"
                  secureTextEntry={hidePass ? true : false}
                  onSubmitEditing={() => onSubmit()}
                  value={password}
                />
                <Icon
                  style={{marginRight: 10}}
                  name={hidePass ? 'eye' : 'eye-slash'}
                  size={18}
                  onPress={() => setHidePass(!hidePass)}
                  color="grey"
                />
              </View>
            </View>

            <View style={styles.button}>
              <CustomLoadingButton
                ref={c => (data.loginButton = c)}
                width={328}
                height={52}
                title="Continue"
                titleFontSize={18}
                titleFontFamily="Poppins-Bold"
                titleColor="#FFF"
                backgroundColor="#34A549"
                borderRadius={4}
                onPress={login}
              />
              {/* <AnimateLoadingButton
            ref={(c) => (data.loginButton = c)}
            width={328}
            height={52}
            title={"Login with OTP"}
            titleFontSize={18}
            titleFontFamily={"Poppins-Bold"}
            titleColor="#FFF"
            backgroundColor="#34A549"
            borderRadius={7}
            onPress={() => {
              sendOTP();
            }}
          /> */}

              <View style={{flexDirection: 'row', marginTop: 20}}>
                <Text style={{color: '#21272E'}}>New to Wroti ? </Text>
                <Text
                  onPress={() => whatsapp('+91 91541 88021')}
                  style={{color: '#3D86B4'}}>
                  {' '}
                  Book a Demo
                </Text>

                <View style={{marginTop: 4, marginLeft: 2}}>
                  <Image
                    style={{height: 12, width: 12}}
                    source={require('../../assets/LoginArrow.png')}
                  />
                </View>
              </View>

              <View style={{marginTop: '3%', marginBottom: '10%'}}>
                <Image
                  source={require('../../assets/logo3x.png')}
                  resizeMode="center"
                />
              </View>
            </View>
          </KeyboardAvoidingView>
        </ScrollView>
      </>
    </View>
  );
};

export default SignInScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 50,
  },
  footer: {
    flex: 3,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  text_header: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 30,
  },
  text_footer: {
    color: '#05375a',
    fontSize: 18,
  },
  action: {
    flexDirection: 'row',
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
    paddingBottom: 5,
  },
  actionError: {
    flexDirection: 'row',
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#FF0000',
    paddingBottom: 5,
  },
  textInput: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 0 : -12,
    paddingLeft: 10,
    color: '#05375a',
  },
  errorMsg: {
    color: '#FF0000',
    fontSize: 14,
  },
  button: {
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 10,
    // borderColor:'black'
  },
  textSign: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  input: {
    height: 40,
    borderRadius: 10,
    marginTop: 5,
    borderWidth: 2,
    borderColor: '#F7F7FC',
    paddingHorizontal: 20,
    color: '#21272E',
    fontSize: 12,
    backgroundColor: '#F7F7FC',
    // width:'98%'
  },
});
