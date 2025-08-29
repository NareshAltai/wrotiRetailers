import React, {useEffect} from 'react';
import {
  View,
  // Activity,
  // Text,
  StatusBar,
  StyleSheet,
  Image,
  NativeModules,
} from 'react-native';
import {
  NavigationContainer,
  DefaultTheme as NavigationDefaultTheme,
  DarkTheme as NavigationDarkTheme,
} from '@react-navigation/native';
import {createDrawerNavigator} from '@react-navigation/drawer';
import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';
import {createStore, combineReducers, applyMiddleware} from 'redux';
import {Provider, useDispatch} from 'react-redux';
// import thunk from 'redux-thunk';
// import thunk from 'redux-thunk';
import {
  Provider as PaperProvider,
  DefaultTheme as PaperDefaultTheme,
  MD2DarkTheme as PaperDarkTheme,
} from 'react-native-paper';
import {DrawerContent} from './src/screens/DrawerContent';
import MainTabScreen from './src/screens/MainTabScreen';
import {AuthContext} from './src/components/context';
import RootStackScreen from './src/screens/RootStackScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import homeReducer from './src/redux/reducers/HomeReducer';
import couponReducer from './src/redux/reducers/couponReducer';
import customerReducer from './src/redux/reducers/customerReducer';
import ProductReducer from './src/redux/reducers/productReducer';
import orderReducer from './src/redux/reducers/orderReducer';
import optionReducer from './src/redux/reducers/optionReducer';
import {isReadyRef} from './src/utils/RootNavigation';
import {check, PERMISSIONS, request, RESULTS} from 'react-native-permissions';
import {logoImage} from './src/assets';
import {configureStore} from '@reduxjs/toolkit';

const rootReducer = combineReducers({
  home: homeReducer,
  customer: customerReducer,
  product: ProductReducer,
  orders: orderReducer,
  coupons: couponReducer,
  options: optionReducer,
});
// const store = createStore(rootReducer, applyMiddleware());
const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(), // thunk is already included by default
});

const Drawer = createDrawerNavigator();

const App = () => {
  console.log('RAGHUGOLLA');
  // const [FToken, setFTtoken] = React.useState();
  const [isDarkTheme, setIsDarkTheme] = React.useState(false);
  // const [deviceId, setDeviceId] = React.useState();
  const initialLoginState = {
    isLoading: true,
    userName: null,
    userToken: null,
    refreshOrders: false,
  };

  const CustomDefaultTheme = {
    ...NavigationDefaultTheme,
    ...PaperDefaultTheme,
    colors: {
      ...NavigationDefaultTheme.colors,
      ...PaperDefaultTheme.colors,
      background: '#ffffff',
      text: '#333333',
    },
  };

  const CustomDarkTheme = {
    ...NavigationDarkTheme,
    ...PaperDarkTheme,
    colors: {
      ...NavigationDarkTheme.colors,
      ...PaperDarkTheme.colors,
      background: '#333333',
      text: '#ffffff',
    },
  };

  const theme = isDarkTheme ? CustomDarkTheme : CustomDefaultTheme;

  const loginReducer = (prevState, action) => {
    switch (action.type) {
      case 'RETRIEVE_TOKEN':
        return {
          ...prevState,
          userToken: action.token,
          userName: action.userName,
          isLoading: false,
        };
      case 'LOGIN':
        return {
          ...prevState,
          userName: action.userName,
          userToken: action.token,
          isLoading: false,
        };
      case 'LOGOUT':
        return {
          ...prevState,
          userName: null,
          userToken: null,
          isLoading: false,
        };
      case 'REGISTER':
        return {
          ...prevState,
          userName: action.userName,
          userToken: action.token,
          usserId: action.id,
          isLoading: false,
        };

      case 'SESSIONLOGOUT':
        return {
          ...prevState,
          userName: action.userName,
          userToken: action.token,
          usserId: action.id,
          isLoading: false,
        };

      case 'NEWORDERALERT':
        return {
          ...prevState,
          refreshOrders: true,
          isLoading: false,
        };

      case 'CLEARORDERS':
        return {
          ...prevState,
          refreshOrdersFromLogin: true,
          isLoading: false,
        };
    }
  };

  const [loginState, dispatch] = React.useReducer(
    loginReducer,
    initialLoginState,
  );

  const authContext = React.useMemo(
    () => ({
      signIn: async (token, UserMobile) => {
        const userToken = token;
        const userName = UserMobile;

        try {
          await AsyncStorage.setItem('userToken', userToken);
          await AsyncStorage.setItem('userName', userName);
        } catch (e) {
          console.log(e);
        }
        dispatch({type: 'CLEARORDERS', refreshOrdersFromLogin: true});
        dispatch({type: 'LOGIN', token: userToken, userName: userName});
      },
      signOut: async () => {
        try {
          await AsyncStorage.removeItem('userToken');
          await AsyncStorage.removeItem('MobileNumber');
          await AsyncStorage.removeItem('Password');
          await AsyncStorage.removeItem('order_status_id');
          await AsyncStorage.removeItem('StoreStatus');
        } catch (e) {
          console.log(e);
        }
        dispatch({type: 'LOGOUT'});
      },
      signUpWithPassword: async () => {
        try {
          await AsyncStorage.getItem('MobileNumber');
          await AsyncStorage.getItem('Password');
        } catch (e) {
          console.log(e);
        }
        dispatch({type: 'LOGOUT'});
      },
      toggleTheme: () => {
        setIsDarkTheme(isDarkTheme => !isDarkTheme);
      },
    }),
    [],
  );

  const getFcmToken = async () => {
    const fcmToken = await messaging().getToken();
  };

  const requestNotificationPermission = async () => {
    const result = await request(PERMISSIONS.ANDROID.POST_NOTIFICATIONS);
    return result;
  };

  const checkNotificationPermission = async () => {
    const result = await check(PERMISSIONS.ANDROID.POST_NOTIFICATIONS);
    return result;
  };

  const requestPermission = async () => {
    const checkPermission = await checkNotificationPermission();
    if (checkPermission !== RESULTS.GRANTED) {
      const request = await requestNotificationPermission();
      if (request !== RESULTS.GRANTED) {
        // permission not granted
      }
    }
  };

  const requestUserPermission = async () => {
    requestPermission();
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('need to installed firebase messaging for get Token');
      getFcmToken();
    }
  };

  React.useEffect(() => {
    NativeModules.InAppUpdate.checkUpdate();
    return () => {
      isReadyRef.current = false;
    };
  }, []);

  useEffect(() => {
    setTimeout(async () => {
      requestUserPermission();
      let userToken;
      userToken = null;
      try {
        userToken = await AsyncStorage.getItem('userToken');
      } catch (e) {
        console.log(e);
      }
      dispatch({type: 'LOGIN', token: userToken});
    }, 1000);

    const unsubscribe = messaging().onMessage(async remoteMessage => {
      dispatch({type: 'NEWORDERALERT', refreshOrders: true});
      PushNotification.createChannel(
        {
          channelId: 'wroti-id', // (required)
          channelName: 'My Wroti', // (required)
          channelDescription: '', // (optional) default: undefined.
          playSound: true, // (optional) default: true
          soundName: 'notifications.mp3', // (optional) See `soundName` parameter of `localNotification` function
          importance: 4, // (optional) default: 4. Int value of the Android notification importance
          vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
        },
        created => console.log(`createChannel returned '${created}'`), // (optional) callback returns whether the channel was created, false means it already existed.
      );
      PushNotification.localNotification({
        message: remoteMessage.notification.body,
        title: remoteMessage.notification.title,
        channelId: 'wroti-id', // (required)
        channelName: 'My Wroti',
        soundName: 'notifications.mp3',
        vibrate: true,
      });
    });
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      dispatch({type: 'NEWORDERALERT', refreshOrders: true});
    });
    return unsubscribe;
  }, []);

  if (loginState.isLoading) {
    console.log('App is loading...');
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#FFFF',
        }}>
        <StatusBar backgroundColor="#FFFF" barStyle="light-content" />

        <View>
          <Image style={styles.logo} source={logoImage} />
        </View>
      </View>
    );
  }

  return (
    <Provider store={store}>
      <PaperProvider theme={theme}>
        <AuthContext.Provider value={authContext}>
          <NavigationContainer theme={theme}>
            {loginState.userToken !== null ? (
              <Drawer.Navigator
                screenOptions={{headerShown: false}}
                drawerContent={props => (
                  <DrawerContent
                    refreshOrders={loginState.refreshOrders}
                    {...props}
                  />
                )}>
                <Drawer.Screen name="HomeDrawer" component={MainTabScreen} />
              </Drawer.Navigator>
            ) : (
              <RootStackScreen />
            )}
          </NavigationContainer>
        </AuthContext.Provider>
      </PaperProvider>
    </Provider>
  );
};

export default App;

const styles = StyleSheet.create({
  logo: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
