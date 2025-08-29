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
  Button,
} from 'react-native';
// import Toast from 'react-native-simple-toast';
// import * as Animatable from "react-native-animatable";
// import DeveloperAPIClient from '../../state/middlewares/DeveloperAPIClient';
// import CustomInput from '../../components/CustomInput';
// import Icon from 'react-native-vector-icons/FontAwesome5';

// import AnimateLoadingButton from 'react-native-animate-loading-button';
// import OTPInputView from '@twotalltotems/react-native-otp-input';

// import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import {useTheme} from 'react-native-paper';

import {AuthContext} from '../../components/context';
import CustomLoadingButton from '../../components/CustomLoadingButton';

// import Users from '../../model/users';

const ResetScreen = ({navigation, route}) => {
  const [data, setData] = React.useState({
    loginButton: {},
  });

  const {colors} = useTheme();

  const {signIn} = React.useContext(AuthContext);

  const [mobile, setMobile] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isExistingUser, setIsExistingUser] = React.useState(false);
  const [otp, setOTP] = React.useState('');
  const [otpToken, setOtpToken] = React.useState('');
  const [hidePass, setHidePass] = useState(true);
  const login = async () => {
    // data.loginButton.showLoading(true);
    // const api = new DeveloperAPIClient();
    // let loginResponse = await api.Login(mobile, password);
    // data.loginButton.showLoading(false);
    // console.log(loginResponse.data);
    // if (loginResponse.data) {
    //   let loginData = loginResponse.data;
    //   if (
    //     loginData.messageCode &&
    //     loginData.messageCode === api.getSucessMessageCode()
    //   ) {
    //     let token = loginData.Token.AccessToken;
    //     let userId = loginData.Token.UserId;
    //     const customerResp = await api.getCustomer(userId, token);
    //     if (customerResp && customerResp.data) {
    //       let customerData = customerResp.data;
    //       let customer = { userToken: token, UserId: userId, UserName: mobile };
    //       if (customerData.Customer) {
    //         customer = { ...customer, ...customerData.Customer };
    //       }
    //       signIn([customer]);
    //     }
    //     //signIn([{"userToken":tokenData.AccessToken,"userName":mobile,"userId":tokenData.UserId}]);
    //   } else {
    //     Toast.showWithGravity(
    //       "Invalid username / password.",
    //       Toast.LONG,
    //       Toast.TOP
    //     );
    //   }
    // } else {
    //   Toast.showWithGravity(
    //     "Invalid username / password.",
    //     Toast.LONG,
    //     Toast.TOP
    //   );
    // }
    //
  };

  const resetnow = async () => {
    // if (mobile.length < 10) {
    //   showToast("Invalid number, Please try again..","#E23434");

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
    navigation.navigate('ResetPassword', {mobile: mobile});
  };

  useEffect(() => {
    setMobile(route.params.mobile);
    setIsExistingUser(route.params.isExistingUser);

    setOtpToken(route.params.OTPToken);
  }, []);

  const onChangeText = val => {
    setPassword(val);
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#F1F9F3" barStyle="light-content" />
      <View style={{alignItems: 'center'}}>
        <View>
          <ImageBackground
            style={{height: 350, width: 350}}
            source={require('../../assets/BGI.png')}>
            <Image
              style={{height: 258, width: 350}}
              source={require('../../assets/logo.png')}
              resizeMode="center"
            />
            <View style={{marginLeft: '32%', marginBottom: '2%'}}>
              <Text
                style={{
                  fontFamily: 'Poppins-SemiBold',
                  fontSize: 20,
                  color: '#21272E',
                }}>
                Create Password
              </Text>
            </View>
            <View>
              <Text
                style={{
                  fontFamily: 'Poppins-Regular',
                  fontSize: 16,
                  color: '#7E7F81',
                  marginLeft: '31%',
                  marginBottom: '8%',
                }}>
                Create a new password {'\n'} {'      '}of your account!
              </Text>
            </View>
          </ImageBackground>
        </View>
      </View>
      <View style={{marginHorizontal: 15}}>
        <View style={{flexDirection: 'row'}}>
          <View style={{marginTop: 30}}>
            <Image
              style={{height: 20, width: 20}}
              source={require('../../assets/Lock3x.png')}
            />
          </View>
          <Text
            style={{
              marginTop: 33,
              color: '#21272E',
              fontFamily: 'Poppins-SemiBold',
              fontSize: 14,
            }}>
            Password
          </Text>
        </View>
        <TextInput
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholder="Please enter your password"
          placeholderTextColor="#9BA0A7"
          maxLength={10}
          secureTextEntry={hidePass ? true : false}
        />
      </View>

      <View style={{marginHorizontal: 15}}>
        <View style={{flexDirection: 'row'}}>
          <View style={{marginTop: 30}}>
            <Image
              style={{height: 20, width: 20}}
              source={require('../../assets/Lock3x.png')}
            />
          </View>
          <Text
            style={{
              marginTop: 33,
              color: '#21272E',
              fontFamily: 'Poppins-SemiBold',
              fontSize: 14,
            }}>
            Re-Enter Password
          </Text>
        </View>
        <TextInput
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholder="Please re-enter your password"
          placeholderTextColor="#9BA0A7"
          maxLength={10}
          secureTextEntry={hidePass ? true : false}
        />
      </View>

      <View style={styles.button}>
        <CustomLoadingButton
          ref={c => (data.loginButton = c)}
          width={328}
          height={52}
          title={'Confirm Password'}
          titleFontSize={18}
          titleFontFamily={'Poppins-Bold'}
          titleColor="#FFF"
          backgroundColor="#34A549"
          borderRadius={4}
          onPress={() => {
            // verifyOTP();
          }}
        />
        {/* <Button
          title="Confirm Password"
          onPress={() => {
            console.log('object');
          }}
        /> */}
        {/* <AnimateLoadingButton
          ref={c => (data.loginButton = c)}
          width={328}
          height={52}
          title={'Confirm Password'}
          titleFontSize={18}
          titleFontFamily={'Poppins-Bold'}
          titleColor="#FFF"
          backgroundColor="#34A549"
          borderRadius={4}
        /> */}
      </View>
    </View>
  );
};

export default ResetScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  input: {
    height: 40,
    borderRadius: 10,
    marginTop: 5,
    borderWidth: 2,
    borderColor: '#F7F7FC',
    paddingHorizontal: 20,
    color: '#21272E',
    fontSize: 13,
    backgroundColor: '#F7F7FC',
    fontFamily: 'Poppins-Regular',
    // color: '#424242',
  },
  textInput: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 0 : -12,
    paddingLeft: 10,
    color: '#05375a',
  },
  button: {
    alignItems: 'center',
    marginTop: 46,
  },
  signIn: {
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
});
