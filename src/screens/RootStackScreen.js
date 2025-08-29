import React from 'react';

// import { createStackNavigator } from "@react-navigation/native-stack";
import {createStackNavigator} from '@react-navigation/stack';

import SignInScreen from '../screens/OnBoarding/SignInScreen';
// import DemoScreen from "./OnBoarding/DemoScreen";
import OTPScreen from './OnBoarding/OTPScreen';
import LoginWithPasswordScreen from './OnBoarding/LoginWithPasswordScreen';
// import ResetPassword from './OnBoarding/ResetPassword';
import HomeScreen from './Home/HomeScreen';
// import OrdersScreen from './Orders/OrdersScreen';
// import ThankyouScreen from "./OnBoarding/ThankyouScreen";

const RootStack = createStackNavigator();

const RootStackScreen = () => (
  <RootStack.Navigator
    screenOptions={{headerShown: false}}
    initialRouteName="HomeScreen">
    {/* <RootStack.Screen
      name="IntroductionScreen"
      component={IntroductionScreen}
    /> */}

    <RootStack.Screen name="SignInScreen" component={SignInScreen} />
    <RootStack.Screen
      name="LoginWithPasswordScreen"
      component={LoginWithPasswordScreen}
    />

    <RootStack.Screen name="OTPScreen" component={OTPScreen} />
    {/* <RootStack.Screen name='DemoScreen' component={DemoScreen} />
    <RootStack.Screen name='ResetPassword' component={ResetPassword} /> */}
    <RootStack.Screen name="Home" component={HomeScreen} />
  </RootStack.Navigator>
);

export default RootStackScreen;
