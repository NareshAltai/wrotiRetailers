import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  Platform,
  StyleSheet,
  StatusBar,
  ImageBackground,
  Image,
} from 'react-native';

import {Banner, Snackbar} from 'react-native-paper';

import Toast from '../../components/Toast';

import DeveloperAPIClient from '../../state/middlewares/DeveloperAPIClient';

import {SliderBox} from 'react-native-image-slider-box';
import AnimateLoadingButton from 'react-native-animate-loading-button';

import {useTheme} from 'react-native-paper';

import {AuthContext} from '../../components/context';
import CustomLoadingButton from '../../components/CustomLoadingButton';

const DemoScreen = ({navigation, route}) => {
  const [data, setData] = React.useState({
    getStartedButton: {},
  });

  const {colors} = useTheme();
  const [hidePass, setHidePass] = useState(true);

  const [mobile, setMobile] = React.useState('');
  const {signIn} = React.useContext(AuthContext);
  const [message, setmessage] = React.useState('');

  const [check_textInputChange, setCheck_textInputChange] =
    React.useState(false);
  const [isValidUser, setIsValidUser] = React.useState(true);
  const [visible, setVisible] = React.useState(false);

  const onDismissSnackBar = () => {
    // console.log("DISIMS", false);
    // The code(action) you want to perform
    setVisible(false);
  };

  const [toastBGColor, setToastBGColor] = React.useState('#6AA34A');
  const [toasText, setToasText] = React.useState('');

  const showToast = (text, bgcolor) => {
    setToastBGColor(bgcolor);
    setToasText(text);
    setVisible(true);
  };

  const sendOTP = async () => {
    // if (mobile.length < 10) {
    //   // showToast("Invalid number, Please try again..","#E23434");
    //   if (mobile.length < 10) {
    //     setmessage(showToast("Invalid number, Please try again..", "#E23434"));
    //     return false;
    //   }
    //   return false;
    // }
    // data.getStartedButton.showLoading(true);

    // const api = new DeveloperAPIClient();

    // let customerSearchData = await api.searchCustomer(mobile);

    // data.getStartedButton.showLoading(false);
    // let isExistingUser = false;

    // if (customerSearchData.data) {
    //   let respone = customerSearchData.data;
    //   if (
    //     respone.messageCode &&
    //     respone.messageCode === api.getSucessMessageCode()
    //   ) {
    //     isExistingUser = true;
    //   }
    // }

    // if (isExistingUser) {
    //   // data.getStartedButton.showLoading(true);
    //   let otpResponse = await api.sendOTP(mobile, isExistingUser);
    //   data.getStartedButton.showLoading(false);
    //   if (
    //     otpResponse.data &&
    //     otpResponse.data.messageCode === api.getSucessMessageCode()
    //   ) {
    //     navigation.navigate("OTPScreen", {
    //       mobile: mobile,
    //       isExistingUser: isExistingUser,
    //       OTPToken: otpResponse.data.OTPToken,
    //     });
    //   }
    // } else {
    //   navigation.navigate("SignUpScreen", { mobile: mobile });
    // }
    navigation.navigate('ThankyouScreen');
  };

  const Login = async () => {
    // if (mobile.length < 10) {
    //   setmessage('Hello')
    //   return false;
    // }
    // data.getStartedButton.showLoading(true);

    // const api = new DeveloperAPIClient();

    // let customerSearchData = await api.searchCustomer(mobile);

    // data.getStartedButton.showLoading(false);
    // let isExistingUser = false;

    // if (customerSearchData.data) {
    //   let respone = customerSearchData.data;
    //   if (
    //     respone.messageCode &&
    //     respone.messageCode === api.getSucessMessageCode()
    //   ) {
    //     isExistingUser = true;
    //   }
    // }

    // if (isExistingUser) {
    //   // data.getStartedButton.showLoading(true);
    //   let otpResponse = await api.sendOTP(mobile, isExistingUser);
    //   data.getStartedButton.showLoading(false);
    //   if (
    //     otpResponse.data &&
    //     otpResponse.data.messageCode === api.getSucessMessageCode()
    //   ) {
    //     navigation.navigate("OTPScreen", {
    //       mobile: mobile,
    //       isExistingUser: isExistingUser,
    //       OTPToken: otpResponse.data.OTPToken,
    //     });
    //   }
    // } else {
    //   navigation.navigate("SignUpScreen", { mobile: mobile });
    // }
    navigation.navigate('LoginWithPasswordScreen', {mobile: mobile});
  };

  let banners = [
    require('../../assets/ill3x.png'),
    require('../../assets/banner3x.png'),
    require('../../assets/banner3big3.png'),
  ];

  const textInputChange = val => {
    setMobile(val);
    setIsValidUser(val.trim().length === 10);
    setCheck_textInputChange(val.trim().length === 10);
  };

  useEffect(() => {
    if (route.params && route.params.mobile) setMobile(route.params.mobile);
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView>
        <StatusBar backgroundColor="#F1F9F3" barStyle="light-content" />
        <View style={{alignItems: 'center'}}>
          <View>
            <ImageBackground
              style={{height: 220, width: 350}}
              source={require('../../assets/BGI.png')}>
              <Image
                style={{height: 150, width: '100%'}}
                source={require('../../assets/logo.png')}
                resizeMode="center"
              />
              <View>
                <Text
                  style={{
                    fontFamily: 'Poppins-Regular',
                    fontSize: 16,
                    color: '#7E7F81',
                    marginLeft: '15%',
                    marginBottom: '5%',
                  }}>
                  Request a free demonstration to{'\n'}see how Wroti can help
                  your business
                </Text>
              </View>
            </ImageBackground>
          </View>
        </View>

        <View style={{marginHorizontal: 15}}>
          <View style={{flexDirection: 'row'}}>
            <View style={{marginTop: 15, marginRight: 3}}>
              <Image
                style={{height: 20, width: 20}}
                source={require('../../assets/name2x.png')}
              />
            </View>
            <Text
              style={{
                marginTop: 15,
                color: '#21272E',
                fontFamily: 'Poppins-SemiBold',
                fontSize: 14,
              }}>
              Full Name
            </Text>
          </View>
          <View
          // style={{
          //   flexDirection: "row",
          // }}
          >
            <TextInput
              style={styles.input}
              autoCapitalize="none"
              placeholder="Please enter your Name"
              placeholderTextColor="#9BA0A7"
              maxLength={10}
              onChangeText={val => textInputChange(val)}
              // secureTextEntry={hidePass ? true : false}
            />

            {/* <View style={{ marginTop: "8%", marginLeft: "4%" }}>
            {check_textInputChange ? (
              <Image
                style={{ height: 20, width: 20 }}
                source={require("../../assets/vicon2x.png")}
              />
            ) : null}
          </View> */}
          </View>
          {/* <View>
          <Text >helo</Text>
          </View> */}
        </View>

        <View style={{marginHorizontal: 15}}>
          <View style={{flexDirection: 'row'}}>
            <View style={{marginTop: 15, marginRight: 3}}>
              <Image
                style={{height: 20, width: 20}}
                source={require('../../assets/phone2x.png')}
              />
            </View>
            <Text
              style={{
                marginTop: 15,
                color: '#21272E',
                fontFamily: 'Poppins-SemiBold',
                fontSize: 14,
              }}>
              Phone Number
            </Text>
          </View>
          <View
          // style={{
          //   flexDirection: "row",
          // }}
          >
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              autoCapitalize="none"
              placeholder="Please enter your Phone number"
              placeholderTextColor="#9BA0A7"
              maxLength={10}
              onChangeText={val => textInputChange(val)}
              // secureTextEntry={hidePass ? true : false}
            />

            {/* <View style={{ marginTop: "8%", marginLeft: "4%" }}>
            {check_textInputChange ? (
              <Image
                style={{ height: 20, width: 20 }}
                source={require("../../assets/vicon2x.png")}
              />
            ) : null}
          </View> */}
          </View>
          {/* <View>
          <Text >helo</Text>
          </View> */}
        </View>
        <View style={{marginHorizontal: 15}}>
          <View style={{flexDirection: 'row'}}>
            <View style={{marginTop: 10, marginRight: 4}}>
              <Image
                style={{height: 17, width: 17}}
                source={require('../../assets/email2x.png')}
              />
            </View>
            <Text
              style={{
                marginTop: 10,
                color: '#21272E',
                fontFamily: 'Poppins-SemiBold',
                fontSize: 14,
              }}>
              Email Id
            </Text>
          </View>
          <View
          // style={{
          //   flexDirection: "row",
          // }}
          >
            <TextInput
              style={styles.input}
              keyboardType="email"
              autoCapitalize="none"
              placeholder="Please enter your Email"
              placeholderTextColor="#9BA0A7"
              maxLength={10}
              onChangeText={val => textInputChange(val)}
              // secureTextEntry={hidePass ? true : false}
            />

            {/* <View style={{ marginTop: "8%", marginLeft: "4%" }}>
            {check_textInputChange ? (
              <Image
                style={{ height: 20, width: 20 }}
                source={require("../../assets/vicon2x.png")}
              />
            ) : null}
          </View> */}
          </View>
          {/* <View>
          <Text >helo</Text>
          </View> */}
        </View>

        <View style={{marginHorizontal: 15}}>
          <View style={{flexDirection: 'row'}}>
            <View style={{marginTop: 7, marginRight: 3}}>
              <Image
                style={{height: 20, width: 20}}
                source={require('../../assets/location3x.png')}
              />
            </View>
            <Text
              style={{
                marginTop: 7,
                color: '#21272E',
                fontFamily: 'Poppins-SemiBold',
                fontSize: 14,
              }}>
              City
            </Text>
          </View>
          <View
          // style={{
          //   flexDirection: "row",
          // }}
          >
            <TextInput
              style={styles.input}
              autoCapitalize="none"
              placeholder="Please enter your City"
              placeholderTextColor="#9BA0A7"
              maxLength={10}
              onChangeText={val => textInputChange(val)}
              // secureTextEntry={hidePass ? true : false}
            />

            {/* <View style={{ marginTop: "8%", marginLeft: "4%" }}>
            {check_textInputChange ? (
              <Image
                style={{ height: 20, width: 20 }}
                source={require("../../assets/vicon2x.png")}
              />
            ) : null}
          </View> */}
          </View>
          {/* <View>
          <Text >helo</Text>
          </View> */}
        </View>

        <View style={{marginHorizontal: 15}}>
          <View style={{flexDirection: 'row'}}>
            <View style={{marginTop: 7, marginRight: 3}}>
              <Image
                style={{height: 35, width: 20}}
                source={require('../../assets/Store3x.png')}
              />
            </View>
            <Text
              style={{
                marginTop: 15,
                color: '#21272E',
                fontFamily: 'Poppins-SemiBold',
                fontSize: 14,
              }}>
              Business Type
            </Text>
          </View>

          <View
          // style={{
          //   flexDirection: "row",
          // }}
          >
            <TextInput
              style={styles.input}
              autoCapitalize="none"
              placeholder="Please enter your Business"
              placeholderTextColor="#9BA0A7"
              maxLength={10}
              onChangeText={val => textInputChange(val)}
              // secureTextEntry={hidePass ? true : false}
            />

            <View style={{flexDirection: 'row'}}>
              <View style={{marginTop: 7, marginRight: 3}}>
                <Image
                  style={{height: 35, width: 20}}
                  source={require('../../assets/Store3x.png')}
                />
              </View>
              <Text
                style={{
                  marginTop: 15,
                  color: '#21272E',
                  fontFamily: 'Poppins-SemiBold',
                  fontSize: 14,
                }}>
                Business Name
              </Text>
            </View>
            <TextInput
              style={styles.input}
              autoCapitalize="none"
              placeholder="Please enter your Business Name"
              placeholderTextColor="#9BA0A7"
              maxLength={10}
              onChangeText={val => textInputChange(val)}
              // secureTextEntry={hidePass ? true : false}
            />

            {/* <View style={{ marginTop: "8%", marginLeft: "4%" }}>
            {check_textInputChange ? (
              <Image
                style={{ height: 20, width: 20 }}
                source={require("../../assets/vicon2x.png")}
              />
            ) : null}
          </View> */}
          </View>
          {/* <View>
          <Text >helo</Text>
          </View> */}
        </View>

        <View style={styles.button}>
          <CustomLoadingButton
            ref={c => (data.loginButton = c)}
            width={328}
            height={52}
            title={'Book a Demo'}
            titleFontSize={18}
            titleFontFamily={'Poppins-Bold'}
            titleColor="#FFF"
            backgroundColor="#34A549"
            borderRadius={7}
            onPress={() => {
              sendOTP();
            }}
          />

          <View style={{flexDirection: 'row'}}>
            <Text style={{color: '#21272E', marginTop: 20, marginBottom: 10}}>
              Already have an account?{' '}
            </Text>
            <Text
              onPress={() => navigation.navigate('SignInScreen')}
              style={{color: '#3D86B4', marginTop: 20, marginBottom: 10}}>
              Login
            </Text>

            <View style={{marginTop: 24, marginLeft: 3, marginBottom: 10}}>
              <Image
                style={{height: 12, width: 12}}
                source={require('../../assets/LoginArrow.png')}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default DemoScreen;

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
  },
  textSign: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  input: {
    height: 40,
    borderRadius: 10,
    marginTop: 2,
    borderWidth: 2,
    borderColor: '#F7F7FC',
    paddingHorizontal: 20,
    color: '#21272E',
    fontSize: 12,

    backgroundColor: '#F7F7FC',
    // color: '#424242',
  },
});
