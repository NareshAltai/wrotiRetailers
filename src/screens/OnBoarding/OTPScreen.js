import React, {useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Image,
  ImageBackground,
  Button,
} from 'react-native';
import DeveloperAPIClient from '../../state/middlewares/DeveloperAPIClient';
// import AnimateLoadingButton from "react-native-animate-loading-button";
// import OTPInputView from "@twotalltotems/react-native-otp-input";
import {useTheme} from 'react-native-paper';
import {AuthContext} from '../../components/context';
import {BGI, e, Lock3x, logoImage, resend3x} from '../../assets';
import CustomLoadingButton from '../../components/CustomLoadingButton';

const OTPScreen = ({navigation, route}) => {
  const [data, setData] = React.useState({
    verifyOTPButton: {},
  });

  const {colors} = useTheme();

  const [mobile, setMobile] = React.useState('');
  const [isExistingUser, setIsExistingUser] = React.useState(false);
  const [OTP, setOTP] = React.useState('');
  const [otpToken, setOtpToken] = React.useState('');
  const [timerNumber, setTimerNumber] = React.useState(2);
  const [isResendOTPBtnEnabled, setIsResendOTPBtnEnabled] =
    React.useState(false);

  const moveASecond = () => {
    if (timerNumber !== 0) {
      setTimeout(() => {
        setTimerNumber(timerNumber - 1);
      }, 1000);
    } else {
      setIsResendOTPBtnEnabled(true);
    }
  };

  const {signIn} = React.useContext(AuthContext);

  useEffect(() => {
    moveASecond();
  }, [timerNumber]);

  const resendOtp = () => {
    // call the required api, on that success, execute below statements
    setIsResendOTPBtnEnabled(false);
    setTimerNumber(59);
  };

  const verifyOTP = async () => {
    const api = new DeveloperAPIClient();
    let otp = await api.ValidateOTP(OTP, otpToken);
    // console.log("Access Token",otp )
    signIn();
  };

  useEffect(() => {
    setMobile(route?.params?.mobile || '');
    setIsExistingUser(route?.params?.isExistingUser || false);
    setOTP(route?.params?.OTP || '342523');
    setOtpToken(route?.params?.token || 'token');
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#F1F9F3" barStyle="light-content" />
      <View>
        <ImageBackground style={{height: 350, width: 400}} source={BGI}>
          <Image
            style={{height: 230, width: 350}}
            source={logoImage}
            resizeMode="center"
          />
          <View style={{marginLeft: '41%', marginBottom: '2%'}}>
            <Image
              style={{height: 50, width: 50}}
              source={Lock3x}
              resizeMode="stretch"
            />
          </View>
          <View style={{marginLeft: '33%', marginBottom: '2%'}}>
            <Text
              style={{
                fontFamily: 'Poppins-SemiBold',
                fontSize: 20,
                color: '#21272E',
              }}>
              Enter the OTP
            </Text>
          </View>
          <View>
            <Text
              style={{
                fontFamily: 'Poppins-Regular',
                fontSize: 16,
                color: '#7E7F81',
                marginLeft: '17%',
                marginBottom: '2%',
              }}>
              We sent a one time password to your {'\n'}
              {'          '}mobile number to confirm
            </Text>
          </View>
          <View
            style={{
              marginBottom: '5%',
              flexDirection: 'row',
            }}>
            <Text
              style={{
                fontFamily: 'Poppins-Medium',
                fontSize: 16,
                color: '#342C32',
                marginLeft: '35%',
              }}>
              {'+91'} {mobile}
            </Text>
            <View style={{marginLeft: '1%'}}>
              <Image
                style={{height: 20, width: 20}}
                source={e}
                resizeMode="stretch"
              />
            </View>
          </View>
        </ImageBackground>
      </View>

      {/* <OTPInputView
        codeInputFieldStyle={styles.underlineStyleBase}
        codeInputHighlightStyle={styles.underlineStyleHighLighted}
        onCodeFilled={(code) => {
          setOTP(code);
          verifyOTP(code);
        }}
        style={{ width: "80%", height: 40, marginTop: 76 }}
        pinCount={4}
      /> */}

      {isResendOTPBtnEnabled ? (
        <View style={{flexDirection: 'row', marginTop: 25}}>
          <Text onPress={() => resendOtp()} style={styles.resendOTPText}>
            RESEND OTP
          </Text>
          <View style={{marginLeft: '1%', marginTop: 2}}>
            <Image
              style={{height: 10, width: 10}}
              source={resend3x}
              resizeMode="stretch"
            />
          </View>
        </View>
      ) : (
        <View
          style={{
            marginTop: 36,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text
            style={{
              fontFamily: 'Poppins-Bold',
              fontSize: 14,
              color: '#21272E',
            }}>
            00:{timerNumber > 9 ? timerNumber : '0' + timerNumber}
          </Text>
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <Text
              style={{
                fontFamily: 'Poppins-Regular',
                fontSize: 12,
                color: '#9BA0A7',
              }}>
              OTP will expire in 3 minutes
            </Text>
          </View>
        </View>
      )}

      <View style={styles.button}>
        <CustomLoadingButton
          ref={c => (data.verifyOTPButton = c)}
          width={328}
          height={52}
          title={'Verify OTP'}
          titleFontSize={18}
          titleFontFamily={'Poppins-Bold'}
          titleColor="#FFF"
          backgroundColor="#34A549"
          borderRadius={4}
          onPress={() => {
            verifyOTP();
          }}
        />
      </View>
    </View>
  );
};

export default OTPScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',

    alignItems: 'center',
  },

  button: {
    alignItems: 'center',
    marginTop: 46,
    fontFamily: 'Poppins-Bold',
  },

  underlineStyleBase: {
    width: 43,
    height: 50,
    color: '#21272E',
    fontSize: 25,
    fontFamily: 'Poppins-Medium',
    backgroundColor: '#F7F7FC',
  },

  underlineStyleHighLighted: {
    color: '#21272E',
    fontSize: 25,
    fontFamily: 'Poppins-SemiBold',
  },
  resendOTPText: {
    fontSize: 12,
    color: '#3D86B4',
    fontFamily: 'Poppins-SemiBold',
    justifyContent: 'center',
  },
});
