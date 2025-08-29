import React from 'react';

import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import Config from 'react-native-config';
// console.log("Config",Config.ENV)

import Icon from 'react-native-vector-icons/Ionicons';

import HomeScreen from './Home/HomeScreen';
import {Image} from 'react-native';

const HomeStack = createStackNavigator();
const OrdersStack = createStackNavigator();
const AccountStack = createStackNavigator();
// const CustomersStack = createStackNavigator();
const CatelogStack = createStackNavigator();
// const CouponsStack = createStackNavigator();
// const TemplatesStack = createStackNavigator();
const PromotionsStack = createStackNavigator();
// const TutorialStack = createStackNavigator();

import OrdersScreen from './Orders/OrdersScreen';
import ProductScreen from './Catelog/ProductsScreen';
import AccountScreen from './Account/AccountScreen';
import NewOrderDetails from './Orders/NewOrderDetails';
import FilterScreen from '../screens/FilterScreen';
import OrderSummury from '../screens/Orders/OrderSummury';
import AddItemScreen from './Catelog/AddItemScreen';
import AddCustumersScreen from './AddCustumerScreen';
import NewTemplateScreen from '../screens/Templates/NewTemplateScreen';
import EditTemplateScreen from './Templates/EditTemplateScreen';
import BroadCastsScreen from '../screens/BroadCast/BroadCastsScreen';
import NewBroadCastsScreen from '../screens/BroadCast/NewBroadCastsScreen';
import AddGroupScreen from './AddGroupScreen';
import CouponsScreen from './CouponsScreen';
import TemplateListScreen from '../screens/Templates/TemplateListScreen';
import AddCouponsScreen from './AddCouponsScreen';
import CustumersScreen from './CustumersScreen';
import ProcessingOrderDetails from './Orders/ProcessingOrderDetails';
import OutfordeliveryOrderDetails from './Orders/OutfordeliveryOrderDetails';
import OrderDelivered from './Orders/OrderDelivered';
import OrderDeclinedDetails from './Orders/OrderDeclinedDetails';
import OrderCancelledDetails from './Orders/OrderCancelledDetails';
import editProduct from './Catelog/editProduct';
import SearchScreen from './Catelog/SearchScreen';
import catelogScreen from './Catelog/catelogScreen';
import optionsScreen from './Catelog/optionsScreen';
import categoriesScreen from './Catelog/categoriesScreen';
import addOptionScreen from './Catelog/addOptionScreen';
import CustomersDetailsScreen from './CustomersDetailsScreen';
import customerGroupDetailsScreen from './customerGroupDetailsScreen';
import addExistingCustomerToGroup from './addExistingCustomerToGroup';
import addCustomerFromGroup from './addCustomerFromGroup';
import editCustomerFromGroup from './editCustomerFromGroup';
//import Modal from './modal';
import editOptionScreen from './Catelog/editOptionScreen';
import updateStoreTimings from './updateStoreTimings';
import ReviewsScreen from './ReviewsScreen';
import CreatePromotion from './Promotions/CreatePromotions';
import PromotionListing from './Promotions/PromotionListing';
import VideoTutorial from './Tutorials/VideoTutorial';
import ProfileScreen from './Account/ProfileScreen';
import StoreSettings from './Account/StoreSettings';
import PaymentStatus from './Account/PaymentStatus';
import BannersList from '../screens/Banners/BannersList';
import AddBanners from '../screens/Banners/AddBanners';
import ReportsScreen from './Account/ReportsScreen';
import SalesReport from './Account/SalesReport';
import ProductsReport from './Account/ProductsReport';
import CustomerOrderReport from './Account/CustomerOrderReport';
import ChatsScreen from './Chats/ChatsScreen';
import ChattingBox from './Chats/ChattingBox';

const BottomTab = createMaterialBottomTabNavigator();

const MainTabScreen = () => (
  <BottomTab.Navigator
    initialRouteName="Orders"
    activeColor="#34A549"
    shifting={false}
    barStyle={{backgroundColor: '#fff'}}>
    {/* <BottomTab.Screen
      name="Home"
      component={HomeStackScreen}
      options={{
        tabBarLabel: "Home",
        tabBarColor: "#34A549",
        tabBarIcon: ({ color, focused }) => (
          <Image
            source={
              focused
                ? require("../assets/group3x.png")
                : require("../assets/group3x.png")
            }
            style={{ width: 24, height: 24, resizeMode: "center" }}
          />
        ),
      }}
    /> */}
    <BottomTab.Screen
      name="Orders"
      component={OrdersStackScreen}
      options={{
        tabBarLabel: 'Orders',
        tabBarColor: '#34A549',
        // tabBarBadge: 3,
        tabBarIcon: ({color, focused}) => (
          <Image
            source={
              focused
                ? require('../assets/orderC.png')
                : require('../assets/order.png')
            }
            style={{width: 24, height: 24, resizeMode: 'center'}}
          />
        ),
      }}
    />
    <BottomTab.Screen
      name="Catelog"
      component={CatelogStackScreen}
      options={{
        tabBarLabel: 'Catalogue',
        tabBarColor: '#34A549',
        tabBarIcon: ({color, focused}) => (
          <Image
            source={
              focused
                ? require('../assets/productsC.png')
                : require('../assets/products.png')
            }
            style={{width: 25, height: 25, resizeMode: 'center'}}
          />
        ),
      }}
    />
    {Config.ENV === 'uat' && (
      <BottomTab.Screen
        name="Promotions"
        component={PromotionsStackScreen}
        options={{
          tabBarLabel: 'Promotions',
          tabBarColor: '#d02860',
          tabBarIcon: ({color, focused}) => (
            <Image
              source={
                focused
                  ? require('../assets/promotionC.png')
                  : require('../assets/promotion.png')
              }
              style={{width: 26, height: 26, resizeMode: 'center'}}
            />
          ),
        }}
      />
    )}
    {/* <BottomTab.Screen
      name="Tutorials"
      component={TutorialsStackScreen}
      options={{
        tabBarLabel: "Tutorials",
        tabBarColor: "#d02860",
        tabBarIcon: ({ color, focused }) => (
          <Image
            source={
              focused
                ? require("../assets/videoIconColored.png")
                : require("../assets/videoIcon.png")
            }
            style={{ width: 26, height: 26, resizeMode: "center" }}
          />
        ),
      }}
    /> */}
    <BottomTab.Screen
      name="Account"
      component={AccountStackScreen}
      options={{
        tabBarLabel: 'Account',
        tabBarColor: '#d02860',
        tabBarIcon: ({color, focused}) => (
          <Image
            source={
              focused
                ? require('../assets/userC.png')
                : require('../assets/a3x.png')
            }
            style={{width: 26, height: 26, resizeMode: 'center'}}
          />
        ),
      }}
    />
  </BottomTab.Navigator>
);

export default MainTabScreen;

const HomeStackScreen = ({navigation}) => (
  <HomeStack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: '#34A549',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    }}>
    <HomeStack.Screen
      name="Home"
      component={HomeScreen}
      options={{
        title: 'Overview',
        headerShown: false,
        headerLeft: () => (
          <Icon.Button
            name="ios-menu"
            size={25}
            backgroundColor="#34A549"
            // // onPress={() => navigation.openDrawer()}
          />
        ),
      }}
    />
  </HomeStack.Navigator>
);

const OrdersStackScreen = ({navigation}) => (
  <OrdersStack.Navigator>
    <OrdersStack.Screen
      name="Orders"
      component={OrdersScreen}
      options={{
        title: 'Overview',
        headerShown: false,
      }}
    />
    <OrdersStack.Screen
      name="NewOrderDetails"
      component={NewOrderDetails}
      options={{
        title: 'Overview',
        headerShown: false,
        headerLeft: () => (
          <Icon.Button
            name="ios-menu"
            size={25}
            backgroundColor="#34A549"
            // // // onPress={() => navigation.openDrawer()}
          />
        ),
      }}
    />

    <OrdersStack.Screen
      name="ProcessingOrderDetails"
      component={ProcessingOrderDetails}
      options={{
        title: 'Overview',
        headerShown: false,
        headerLeft: () => (
          <Icon.Button
            name="ios-menu"
            size={25}
            backgroundColor="#34A549"
            // // // onPress={() => navigation.openDrawer()}
          />
        ),
      }}
    />

    <OrdersStack.Screen
      name="OutfordeliveryOrderDetails"
      component={OutfordeliveryOrderDetails}
      options={{
        title: 'Overview',
        headerShown: false,
        headerLeft: () => (
          <Icon.Button
            name="ios-menu"
            size={25}
            backgroundColor="#34A549"
            // // // onPress={() => navigation.openDrawer()}
          />
        ),
      }}
    />

    <OrdersStack.Screen
      name="OrderCancelledDetails"
      component={OrderCancelledDetails}
      options={{
        title: 'Overview',
        headerShown: false,
        headerLeft: () => (
          <Icon.Button
            name="ios-menu"
            size={25}
            backgroundColor="#34A549"
            // // // onPress={() => navigation.openDrawer()}
          />
        ),
      }}
    />

    <OrdersStack.Screen
      name="OrderDeclinedDetails"
      component={OrderDeclinedDetails}
      options={{
        title: 'Overview',
        headerShown: false,
        headerLeft: () => (
          <Icon.Button
            name="ios-menu"
            size={25}
            backgroundColor="#34A549"
            // // // onPress={() => navigation.openDrawer()}
          />
        ),
      }}
    />

    <OrdersStack.Screen
      name="OrderDelivered"
      component={OrderDelivered}
      options={{
        title: 'Overview',
        headerShown: false,
        headerLeft: () => (
          <Icon.Button
            name="ios-menu"
            size={25}
            backgroundColor="#E85A00"
            // // // onPress={() => navigation.openDrawer()}
          />
        ),
      }}
    />

    <OrdersStack.Screen
      name="OrderSummury"
      component={OrderSummury}
      options={{
        title: 'Overview',
        headerShown: false,
        headerLeft: () => (
          <Icon.Button
            name="ios-menu"
            size={25}
            backgroundColor="#E85A00"
            // // // onPress={() => navigation.openDrawer()}
          />
        ),
      }}
    />

    <OrdersStack.Screen
      name="FilterScreen"
      component={FilterScreen}
      options={{
        title: 'Overview',
        headerShown: false,
        headerLeft: () => (
          <Icon.Button
            name="ios-menu"
            size={25}
            backgroundColor="#E85A00"
            // // onPress={() => navigation.openDrawer()}
          />
        ),
      }}
    />
  </OrdersStack.Navigator>
);

const AccountStackScreen = ({navigation}) => (
  <AccountStack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: '#E85A00',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    }}>
    <AccountStack.Screen
      name="Account"
      component={AccountScreen}
      options={{
        title: 'Overview',
        headerShown: false,
        headerLeft: () => (
          <Icon.Button
            name="ios-menu"
            size={25}
            backgroundColor="#E85A00"
            // // onPress={() => navigation.openDrawer()}
          />
        ),
      }}
    />
    {/* <AccountStack.Screen
      name="Address"
      component={AddressScreen}
      options={{
        title: "Adress",
        headerShown: false,
        headerLeft: () => (
          <Icon.Button
            name="ios-menu"
            size={25}
            backgroundColor="#E85A00"
            // // onPress={() => navigation.openDrawer()}
          />
        ),
      }}
    /> */}

    <AccountStack.Screen
      name="CouponsScreen"
      component={CouponsScreen}
      options={{
        title: 'Whishlist',
        headerShown: false,
        headerLeft: () => (
          <Icon.Button
            name="ios-menu"
            size={25}
            backgroundColor="#E85A00"
            // // onPress={() => navigation.openDrawer()}
          />
        ),
      }}
    />

    <AccountStack.Screen
      name="ReportsScreen"
      component={ReportsScreen}
      options={{
        title: 'Whishlist',
        headerShown: false,
        headerLeft: () => (
          <Icon.Button
            name="ios-menu"
            size={25}
            backgroundColor="#E85A00"
            // // onPress={() => navigation.openDrawer()}
          />
        ),
      }}
    />

    <AccountStack.Screen
      name="SalesReport"
      component={SalesReport}
      options={{
        title: 'Whishlist',
        headerShown: false,
        headerLeft: () => (
          <Icon.Button
            name="ios-menu"
            size={25}
            backgroundColor="#E85A00"
            // // onPress={() => navigation.openDrawer()}
          />
        ),
      }}
    />

    <AccountStack.Screen
      name="ProductsReport"
      component={ProductsReport}
      options={{
        title: 'Whishlist',
        headerShown: false,
        headerLeft: () => (
          <Icon.Button
            name="ios-menu"
            size={25}
            backgroundColor="#E85A00"
            // // onPress={() => navigation.openDrawer()}
          />
        ),
      }}
    />

    <AccountStack.Screen
      name="CustomerOrderReport"
      component={CustomerOrderReport}
      options={{
        title: 'Whishlist',
        headerShown: false,
        headerLeft: () => (
          <Icon.Button
            name="ios-menu"
            size={25}
            backgroundColor="#E85A00"
            // // onPress={() => navigation.openDrawer()}
          />
        ),
      }}
    />

    <AccountStack.Screen
      name="ChatsScreen"
      component={ChatsScreen}
      options={{
        title: 'Whishlist',
        headerShown: false,
        headerLeft: () => (
          <Icon.Button
            name="ios-menu"
            size={25}
            backgroundColor="#E85A00"
            // // onPress={() => navigation.openDrawer()}
          />
        ),
      }}
    />

    <AccountStack.Screen
      name="ChattingBox"
      component={ChattingBox}
      options={{
        title: 'Whishlist',
        headerShown: false,
        headerLeft: () => (
          <Icon.Button
            name="ios-menu"
            size={25}
            backgroundColor="#E85A00"
            // // onPress={() => navigation.openDrawer()}
          />
        ),
      }}
    />

    <AccountStack.Screen
      name="TemplateListScreen"
      component={TemplateListScreen}
      options={{
        title: 'Whishlist',
        headerShown: false,
        headerLeft: () => (
          <Icon.Button
            name="ios-menu"
            size={25}
            backgroundColor="#E85A00"
            // // onPress={() => navigation.openDrawer()}
          />
        ),
      }}
    />

    <AccountStack.Screen
      name="ReviewsScreen"
      component={ReviewsScreen}
      options={{
        title: 'Whishlist',
        headerShown: false,
        headerLeft: () => (
          <Icon.Button
            name="ios-menu"
            size={25}
            backgroundColor="#E85A00"
            // // onPress={() => navigation.openDrawer()}
          />
        ),
      }}
    />

    <AccountStack.Screen
      name="updateStoreTimings"
      component={updateStoreTimings}
      options={{
        title: 'Whishlist',
        headerShown: false,
        headerLeft: () => (
          <Icon.Button
            name="ios-menu"
            size={25}
            backgroundColor="#E85A00"
            // // onPress={() => navigation.openDrawer()}
          />
        ),
      }}
    />

    <AccountStack.Screen
      name="NewTemplateScreen"
      component={NewTemplateScreen}
      options={{
        title: 'Whishlist',
        headerShown: false,
        headerLeft: () => (
          <Icon.Button
            name="ios-menu"
            size={25}
            backgroundColor="#E85A00"
            // // onPress={() => navigation.openDrawer()}
          />
        ),
      }}
    />
    <AccountStack.Screen
      name="EditTemplateScreen"
      component={EditTemplateScreen}
      options={{
        title: 'Whishlist',
        headerShown: false,
        headerLeft: () => (
          <Icon.Button
            name="ios-menu"
            size={25}
            backgroundColor="#E85A00"
            // // onPress={() => navigation.openDrawer()}
          />
        ),
      }}
    />
    <AccountStack.Screen
      name="BroadCastsScreen"
      component={BroadCastsScreen}
      options={{
        title: 'Whishlist',
        headerShown: false,
        headerLeft: () => (
          <Icon.Button
            name="ios-menu"
            size={25}
            backgroundColor="#E85A00"
            // // onPress={() => navigation.openDrawer()}
          />
        ),
      }}
    />

    <AccountStack.Screen
      name="StoreSettings"
      component={StoreSettings}
      options={{
        title: 'Whishlist',
        headerShown: false,
        headerLeft: () => (
          <Icon.Button
            name="ios-menu"
            size={25}
            backgroundColor="#E85A00"
            // // onPress={() => navigation.openDrawer()}
          />
        ),
      }}
    />
    <AccountStack.Screen
      name="PaymentStatus"
      component={PaymentStatus}
      options={{
        title: 'Whishlist',
        headerShown: false,
        headerLeft: () => (
          <Icon.Button
            name="ios-menu"
            size={25}
            backgroundColor="#E85A00"
            // // onPress={() => navigation.openDrawer()}
          />
        ),
      }}
    />
    <AccountStack.Screen
      name="VideoTutorial"
      component={VideoTutorial}
      options={{
        title: 'Whishlist',
        headerShown: false,
        headerLeft: () => (
          <Icon.Button
            name="ios-menu"
            size={25}
            backgroundColor="#E85A00"
            // // onPress={() => navigation.openDrawer()}
          />
        ),
      }}
    />
    <AccountStack.Screen
      name="BannersList"
      component={BannersList}
      options={{
        title: 'Whishlist',
        headerShown: false,
        headerLeft: () => (
          <Icon.Button
            name="ios-menu"
            size={25}
            backgroundColor="#E85A00"
            // // onPress={() => navigation.openDrawer()}
          />
        ),
      }}
    />
    <AccountStack.Screen
      name="ProfileScreen"
      component={ProfileScreen}
      options={{
        title: 'Whishlist',
        headerShown: false,
        headerLeft: () => (
          <Icon.Button
            name="ios-menu"
            size={25}
            backgroundColor="#E85A00"
            // // onPress={() => navigation.openDrawer()}
          />
        ),
      }}
    />
    <AccountStack.Screen
      name="NewBroadCastsScreen"
      component={NewBroadCastsScreen}
      options={{
        title: 'Whishlist',
        headerShown: false,
        headerLeft: () => (
          <Icon.Button
            name="ios-menu"
            size={25}
            backgroundColor="#E85A00"
            // // onPress={() => navigation.openDrawer()}
          />
        ),
      }}
    />

    <AccountStack.Screen
      name="AddCouponsScreen"
      component={AddCouponsScreen}
      options={{
        title: 'Whishlist',
        headerShown: false,
        headerLeft: () => (
          <Icon.Button
            name="ios-menu"
            size={25}
            backgroundColor="#E85A00"
            // // onPress={() => navigation.openDrawer()}
          />
        ),
      }}
    />

    <AccountStack.Screen
      name="AddBanners"
      component={AddBanners}
      options={{
        title: 'Whishlist',
        headerShown: false,
        headerLeft: () => (
          <Icon.Button
            name="ios-menu"
            size={25}
            backgroundColor="#E85A00"
            // // onPress={() => navigation.openDrawer()}
          />
        ),
      }}
    />
    <AccountStack.Screen
      name="CustumersScreen"
      component={CustumersScreen}
      options={{
        title: 'Overview',
        headerShown: false,
        headerLeft: () => (
          <Icon.Button
            name="ios-menu"
            size={25}
            backgroundColor="#E85A00"
            // // onPress={() => navigation.openDrawer()}
          />
        ),
      }}
    />
    <AccountStack.Screen
      name="AddCustumersScreen"
      component={AddCustumersScreen}
      options={{
        title: 'Overview',
        headerShown: false,
        headerLeft: () => (
          <Icon.Button
            name="ios-menu"
            size={25}
            backgroundColor="#E85A00"
            // // onPress={() => navigation.openDrawer()}
          />
        ),
      }}
    />

    <AccountStack.Screen
      name="AddGroupScreen"
      component={AddGroupScreen}
      options={{
        title: 'Overview',
        headerShown: false,
        headerLeft: () => (
          <Icon.Button
            name="ios-menu"
            size={25}
            backgroundColor="#E85A00"
            // // onPress={() => navigation.openDrawer()}
          />
        ),
      }}
    />

    <AccountStack.Screen
      name="CustomersDetailsScreen"
      component={CustomersDetailsScreen}
      options={{
        title: 'Overview',
        headerShown: false,
        headerLeft: () => (
          <Icon.Button name="ios-menu" size={25} backgroundColor="#E85A00" />
        ),
      }}
    />

    <AccountStack.Screen
      name="customerGroupDetailsScreen"
      component={customerGroupDetailsScreen}
      options={{
        title: 'Overview',
        headerShown: false,
        headerLeft: () => (
          <Icon.Button name="ios-menu" size={25} backgroundColor="#E85A00" />
        ),
      }}
    />

    <AccountStack.Screen
      name="addExistingCustomerToGroup"
      component={addExistingCustomerToGroup}
      options={{
        title: 'Overview',
        headerShown: false,
        headerLeft: () => (
          <Icon.Button name="ios-menu" size={25} backgroundColor="#E85A00" />
        ),
      }}
    />
    <AccountStack.Screen
      name="addCustomerFromGroup"
      component={addCustomerFromGroup}
      options={{
        title: 'Overview',
        headerShown: false,
        headerLeft: () => (
          <Icon.Button name="ios-menu" size={25} backgroundColor="#E85A00" />
        ),
      }}
    />
    <AccountStack.Screen
      name="editCustomerFromGroup"
      component={editCustomerFromGroup}
      options={{
        title: 'Overview',
        headerShown: false,
        headerLeft: () => (
          <Icon.Button name="ios-menu" size={25} backgroundColor="#E85A00" />
        ),
      }}
    />
  </AccountStack.Navigator>
);

const PromotionsStackScreen = ({navigation}) => (
  <PromotionsStack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: '#E85A00',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    }}>
    <PromotionsStack.Screen
      name="PromotionListing"
      component={PromotionListing}
      options={{
        title: 'Whishlist',
        headerShown: false,
        headerLeft: () => (
          <Icon.Button name="ios-menu" size={25} backgroundColor="#E85A00" />
        ),
      }}
    />
    <PromotionsStack.Screen
      name="CreatePromotion"
      component={CreatePromotion}
      options={{
        title: 'Overview',
        headerShown: false,
        headerLeft: () => (
          <Icon.Button name="ios-menu" size={25} backgroundColor="#E85A00" />
        ),
      }}
    />
  </PromotionsStack.Navigator>
);

// const TutorialsStackScreen = ({ navigation }) => (
//   <PromotionsStack.Navigator
//     screenOptions={{
//       headerStyle: {
//         backgroundColor: "#E85A00",
//       },
//       headerTintColor: "#fff",
//       headerTitleStyle: {
//         fontWeight: "bold",
//       },
//     }}
//   >
//     <TutorialStack.Screen
//       name="VideoTutorial"
//       component={VideoTutorial}
//       options={{
//         title: "Whishlist",
//         headerShown: false,
//         headerLeft: () => (
//           <Icon.Button
//             name="ios-menu"
//             size={25}
//             backgroundColor="#E85A00"
//           />
//         ),
//       }}
//     />
//   </PromotionsStack.Navigator>
// );

const CustomersStackScreen = ({navigation}) => (
  <CustomersStack.Navigator>
    <CustomersStack.Screen
      name="CustumersScreen"
      component={CustumersScreen}
      options={{
        title: 'Overview',
        headerShown: false,
        headerLeft: () => (
          <Icon.Button
            name="ios-menu"
            size={25}
            backgroundColor="#E85A00"
            // // onPress={() => navigation.openDrawer()}
          />
        ),
      }}
    />
    <CustomersStack.Screen
      name="AddCustumersScreen"
      component={AddCustumersScreen}
      options={{
        title: 'Overview',
        headerShown: false,
        headerLeft: () => (
          <Icon.Button
            name="ios-menu"
            size={25}
            backgroundColor="#E85A00"
            // // onPress={() => navigation.openDrawer()}
          />
        ),
      }}
    />

    <CustomersStack.Screen
      name="AddGroupScreen"
      component={AddGroupScreen}
      options={{
        title: 'Overview',
        headerShown: false,
        headerLeft: () => (
          <Icon.Button
            name="ios-menu"
            size={25}
            backgroundColor="#E85A00"
            // // onPress={() => navigation.openDrawer()}
          />
        ),
      }}
    />

    <CustomersStack.Screen
      name="CustomersDetailsScreen"
      component={CustomersDetailsScreen}
      options={{
        title: 'Overview',
        headerShown: false,
        headerLeft: () => (
          <Icon.Button name="ios-menu" size={25} backgroundColor="#E85A00" />
        ),
      }}
    />

    <CustomersStack.Screen
      name="customerGroupDetailsScreen"
      component={customerGroupDetailsScreen}
      options={{
        title: 'Overview',
        headerShown: false,
        headerLeft: () => (
          <Icon.Button name="ios-menu" size={25} backgroundColor="#E85A00" />
        ),
      }}
    />

    <CustomersStack.Screen
      name="addExistingCustomerToGroup"
      component={addExistingCustomerToGroup}
      options={{
        title: 'Overview',
        headerShown: false,
        headerLeft: () => (
          <Icon.Button name="ios-menu" size={25} backgroundColor="#E85A00" />
        ),
      }}
    />
    <CustomersStack.Screen
      name="addCustomerFromGroup"
      component={addCustomerFromGroup}
      options={{
        title: 'Overview',
        headerShown: false,
        headerLeft: () => (
          <Icon.Button name="ios-menu" size={25} backgroundColor="#E85A00" />
        ),
      }}
    />
    <CustomersStack.Screen
      name="editCustomerFromGroup"
      component={editCustomerFromGroup}
      options={{
        title: 'Overview',
        headerShown: false,
        headerLeft: () => (
          <Icon.Button name="ios-menu" size={25} backgroundColor="#E85A00" />
        ),
      }}
    />
  </CustomersStack.Navigator>
);

const CatelogStackScreen = ({navigation}) => (
  <CatelogStack.Navigator>
    <CatelogStack.Screen
      name="catelogScreen"
      component={catelogScreen}
      options={{
        title: 'Overview',
        headerShown: false,
        headerLeft: () => (
          <Icon.Button
            name="ios-menu"
            size={25}
            backgroundColor="#E85A00"
            // // onPress={() => navigation.openDrawer()}
          />
        ),
      }}
    />

    <CatelogStack.Screen
      name="categoriesScreen"
      component={categoriesScreen}
      options={{
        title: 'Overview',
        headerShown: false,
        headerLeft: () => (
          <Icon.Button
            name="ios-menu"
            size={25}
            backgroundColor="#E85A00"
            // // onPress={() => navigation.openDrawer()}
          />
        ),
      }}
    />

    <CatelogStack.Screen
      name="ProductScreen"
      component={ProductScreen}
      options={{
        title: 'Overview',
        headerShown: false,
        headerLeft: () => (
          <Icon.Button
            name="ios-menu"
            size={25}
            backgroundColor="#E85A00"
            // // onPress={() => navigation.openDrawer()}
          />
        ),
      }}
    />

    <CatelogStack.Screen
      name="optionsScreen"
      component={optionsScreen}
      options={{
        title: 'Overview',
        headerShown: false,
        headerLeft: () => (
          <Icon.Button name="ios-menu" size={25} backgroundColor="#E85A00" />
        ),
      }}
    />

    <CatelogStack.Screen
      name="addOptionScreen"
      component={addOptionScreen}
      options={{
        title: 'Overview',
        headerShown: false,
        headerLeft: () => (
          <Icon.Button name="ios-menu" size={25} backgroundColor="#E85A00" />
        ),
      }}
    />

    <CatelogStack.Screen
      name="editOptionScreen"
      component={editOptionScreen}
      options={{
        title: 'Overview',
        headerShown: false,
        headerLeft: () => (
          <Icon.Button name="ios-menu" size={25} backgroundColor="#E85A00" />
        ),
      }}
    />

    <CatelogStack.Screen
      name="AddItemScreen"
      component={AddItemScreen}
      options={{
        title: 'Overview',
        headerShown: false,
        headerLeft: () => (
          <Icon.Button
            name="ios-menu"
            size={25}
            backgroundColor="#E85A00"
            // // onPress={() => navigation.openDrawer()}
          />
        ),
      }}
    />
    <CatelogStack.Screen
      name="editProduct"
      component={editProduct}
      options={{
        title: 'Overview',
        headerShown: false,
        headerLeft: () => (
          <Icon.Button
            name="ios-menu"
            size={25}
            backgroundColor="#E85A00"
            // // onPress={() => navigation.openDrawer()}
          />
        ),
      }}
    />
    <CatelogStack.Screen
      name="SearchScreen"
      component={SearchScreen}
      options={{
        title: 'Overview',
        headerShown: false,
        headerLeft: () => (
          <Icon.Button
            name="ios-menu"
            size={25}
            backgroundColor="#E85A00"
            // // onPress={() => navigation.openDrawer()}
          />
        ),
      }}
    />
  </CatelogStack.Navigator>
);
