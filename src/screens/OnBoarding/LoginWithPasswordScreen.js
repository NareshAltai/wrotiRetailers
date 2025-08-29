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
import Toast from 'react-native-simple-toast';
// import * as Animatable from "react-native-animatable";
import DeveloperAPIClient from '../../state/middlewares/DeveloperAPIClient';
import CustomInput from '../../components/CustomInput';
import Icon from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-async-storage/async-storage';

// import AnimateLoadingButton from 'react-native-animate-loading-button';
import {useTheme} from 'react-native-paper';

import {AuthContext} from '../../components/context';

// import Users from '../../model/users';
import {ScrollView} from 'react-native';
import {BGI, Lock3x, logo} from '../../assets';
import CustomLoadingButton from '../../components/CustomLoadingButton';
// import Toast from "react-native-simple-toast";

const OTPScreen = ({navigation, route}) => {
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
    const api = new DeveloperAPIClient();
    let UserMobile = await AsyncStorage.getItem('MobileNumber');
    let loginResponse = await api.LoginwithPassword(UserMobile, password);
    // console.log("loginResponse.data=====", loginResponse.data);
    if (loginResponse.data == undefined) {
      Toast.showWithGravity('Invalid password', Toast.LONG, Toast.BOTTOM);
      return false;
    }
    await AsyncStorage.setItem('token', loginResponse.data.token);
    await AsyncStorage.setItem('countryCode', loginResponse.data.country_code);
    let loginData = loginResponse.data;
    if (loginData != null) {
      let token = loginData.token;
      let userId = mobile;
      await AsyncStorage.setItem('token', token);
      // const customerResp = await api.getCustomer(userId, token);
      signIn(token, userId);
    } else {
      Toast.showWithGravity('Invalid password.', Toast.LONG, Toast.TOP);
    }
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

  // const onChangeText = (val) => {
  //   setPassword(val);
  // };

  return (
    <View style={styles.container}>
      <ScrollView>
        <StatusBar backgroundColor="#F1F9F3" barStyle="light-content" />
        <View style={{alignItems: 'center'}}>
          <View>
            <ImageBackground style={{height: 350, width: 350}} source={BGI}>
              <Image
                style={{height: 255, width: 350}}
                source={logo}
                resizeMode="center"
              />
              <View style={{marginLeft: '33%', marginBottom: '2%'}}>
                <Text
                  style={{
                    fontFamily: 'Poppins-SemiBold',
                    fontSize: 20,
                    color: '#21272E',
                  }}>
                  Enter Password
                </Text>
              </View>
              <View>
                <Text
                  style={{
                    fontFamily: 'Poppins-Regular',
                    fontSize: 16,
                    color: '#7E7F81',
                    marginLeft: '20%',
                    marginBottom: '8%',
                  }}>
                  Enter the password associated {'\n'} {'         '}with your
                  account!
                </Text>
              </View>
            </ImageBackground>
          </View>
        </View>
        <View style={{marginHorizontal: 15}}>
          <View style={{flexDirection: 'row'}}>
            <View style={{marginTop: 30}}>
              <Image style={{height: 20, width: 20}} source={Lock3x} />
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
            // keyboardType="email-address"
            autoCapitalize="none"
            placeholder="Please enter your password"
            placeholderTextColor="#9BA0A7"
            maxLength={10}
            value={password}
            onChangeText={val => setPassword(val)}
            secureTextEntry={true}
          />
        </View>

        {/* <View
        style={{
          flexDirection: "row",
          alignSelf: "center",
          marginVertical: 5,
          alignItems: "center",
          paddingTop: 10,
        }}
      >
        <Text style={{ fontSize: 15, fontFamily: "Poppins-Regular" }}>
          Forgot Password?{" "}
        </Text>
        <TouchableOpacity activeOpacity={0.6} onPress={() => resetnow()}>
          <Text
            style={{
              color: "#3D86B4",
              fontFamily: "Poppins-SemiBold",
              fontSize: 15,
            }}
          >
            Reset now
          </Text>
        </TouchableOpacity>
      </View> */}

        <View style={styles.button}>
          <CustomLoadingButton
            ref={c => (data.loginButton = c)}
            width={328}
            height={52}
            title={'Login'}
            titleFontSize={18}
            titleFontFamily={'Poppins-Bold'}
            titleColor="#FFF"
            backgroundColor="#34A549"
            borderRadius={4}
            onPress={() => {
              login();
            }}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default OTPScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',

    //alignItems:"center"
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
