import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Platform,
  StyleSheet,
  StatusBar,
  Alert,
  ImageBackground,
  Image,
  Dimensions,
} from 'react-native';

// import {Banner, Snackbar} from 'react-native-paper';

// import Toast from '../../components/Toast';

// import DeveloperAPIClient from '../../state/middlewares/DeveloperAPIClient';

// import {SliderBox} from 'react-native-image-slider-box';

// var oauthSignature = require('oauth-signature');

// import * as Animatable from "react-native-animatable";
// import AnimateLoadingButton from 'react-native-animate-loading-button';

// import Feather from 'react-native-vector-icons/Feather';

import {useTheme} from 'react-native-paper';

import {AuthContext} from '../../components/context';

const SignInScreen = ({navigation, route}) => {
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
    if (mobile.length < 10) {
      // showToast("Invalid number, Please try again..","#E23434");
      if (mobile.length < 10) {
        setmessage(showToast('Invalid number, Please try again..', '#E23434'));
        return false;
      }
      return false;
    }
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
    navigation.navigate('OTPScreen', {mobile: mobile});
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
      <StatusBar backgroundColor="#F1F9F3" barStyle="light-content" />
      <View style={{alignItems: 'center'}}>
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: '60%',
          }}>
          <View style={{marginBottom: '20%'}}>
            <Image
              style={{height: 150, width: 150}}
              source={require('../../assets/illustration3x.png')}
            />
          </View>
          <Text
            style={{
              fontFamily: 'Poppins-Regular',
              fontSize: 16,
              color: '#21272E',
            }}>
            Your demo request has been {'\n'}
            {'               '} confirmed
          </Text>
          <Text
            style={{
              fontFamily: 'Poppins-SemiBold',
              fontSize: 18,
              color: '#21272E',
            }}>
            We will get back to you shortly!
          </Text>
        </View>
      </View>
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
  },
  textSign: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  input: {
    height: 40,
    borderRadius: 10,
    marginTop: 15,
    borderWidth: 2,
    borderColor: '#F7F7FC',
    paddingHorizontal: 20,
    color: '#21272E',
    fontSize: 12,

    backgroundColor: '#F7F7FC',
    // color: '#424242',
  },
});
