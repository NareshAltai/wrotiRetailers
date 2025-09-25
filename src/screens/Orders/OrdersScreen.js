import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Platform,
  StyleSheet,
  StatusBar,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  AppState,
} from 'react-native';
import {useTheme} from '@react-navigation/native';
import OrderCard from '../../components/OrderCard';
import OrderCard2 from '../../components/ProcessingOrderCard';
import OrderCard3 from '../../components/OutforDeliveryCard';
import DeveloperAPIClient from '../../state/middlewares/DeveloperAPIClient';
import DeclinedCard from '../../components/DeclinedCard';
import DeliveredCard from '../../components/DeliveredCard';
import CancelledCard from '../../components/CancelledCard';
import Toast from 'react-native-simple-toast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import OptionsMenu from 'wroti-react-native-option-menu';
import {AuthContext} from '../../components/context';
import * as orderActions from '../../redux/actions/orderActions';
import {useDispatch, useSelector} from 'react-redux';
//import NetworkChecker from "react-native-network-checker";
import {useIsFocused} from '@react-navigation/native';
import {newbox3x, processing3x, scooter3x} from '../../assets';
import DeviceInfo from 'react-native-device-info';
import messaging from '@react-native-firebase/messaging';
import {hp} from '../../utils/scale';
// import Toast from '../../components/Toast';

const OrdersScreen = ({navigation, route}) => {
  const dispatch = useDispatch();
  const {signIn} = React.useContext(AuthContext);
  const [refreshing, setRefreshing] = React.useState(true);
  const [order_status_id, setorderstatusid] = useState(1);
  const [sub_tab_Key, setSubTabKey] = React.useState('New\r\nOrders');
  const [main_tab_key, setMainTabKey] = React.useState('Active Orders');
  const [isLoading, setIsLoading] = React.useState(false);
  const {signUpWithPassword} = React.useContext(AuthContext);
  const [header, setheader] = React.useState('Active Orders');
  const [cancelReasonCode, setCancelReasonCode] = React.useState();
  const [appState, setAppState] = useState(AppState.currentState);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [displayOrders, setDisplayOrders] = React.useState();
  const MoreIcon = require('../../assets/menu3x.png');
  const [isLoadMore, setIsLoadMore] = React.useState(true);
  const [isLoadOrdersExecuted, setLoadOrdersExecuted] = React.useState(false);
  const [newOrdersCount, setNewOrdersCount] = React.useState();
  const [authorizedCount, setAuthorizedCount] = React.useState();
  const [paymentReceivedCount, setPaymentReceivedCount] = React.useState();
  const [processingOrdersCount, setProcessingOrdersCount] = React.useState();
  const [outForDeliveryOrdersCount, setOutForDeliveryOrdersCount] =
    React.useState();
  const [rejectedOrdersCount, setRejectedOrdersCount] = React.useState();
  const [cancelledOrdersCount, setCancelledOrdersCount] = React.useState();
  const [deliveredOrdersCount, setDeliveredOrdersCount] = React.useState();
  const [showDeliveryPartnerList, setShowDeliveryPartnerList] =
    React.useState();
  const [selectedProvider, setSelectedProvider] = React.useState('Self');
  const [selectedDriver, setSelectedDriver] = React.useState();
  const [showModal, setShowModal] = React.useState(true);
  const [merchantDeliveryProvider, setMerchantDeliveryProvider] =
    React.useState();
  const [driverDetails, setDriverDetails] = React.useState();
  const [newOrderStatus, setNewOrderStatus] = React.useState();
  const [acceptComment, setAcceptComment] = React.useState();
  const [isMerchantTokenExpired, setIsMerchantTokenExpired] =
    React.useState(false);
  const [storeType, setStoreType] = React.useState();
  const theme = useTheme();
  const isFocused = useIsFocused();

  const sessionExpirylogin = async () => {
    let mobile = await AsyncStorage.getItem('MobileNumber');
    let password = await AsyncStorage.getItem('Password');
    const api = new DeveloperAPIClient();
    let loginResponse = await api.LoginwithPassword(mobile, password);
    let loginData = loginResponse.data;
    if (loginData != null) {
      await AsyncStorage.setItem('token', loginData.token);
      await AsyncStorage.setItem('StoreName', loginData.name);
      await AsyncStorage.setItem('Currency_Code', loginData.currency_code);
      await AsyncStorage.setItem(
        'StoreStatus',
        JSON.stringify(loginData.storeStatus),
      );
      if (loginData.country_code != null && loginData.country_code != undefined)
        await AsyncStorage.setItem('countryCode', loginData.country_code);
      await AsyncStorage.setItem('MobileNumber', mobile);
      await AsyncStorage.setItem('Password', password);
      const fcmToken = await messaging().getToken();
      if (fcmToken) {
        await AsyncStorage.setItem('fcmToken', fcmToken);
      } else {
      }
      let uniqueId = DeviceInfo.getUniqueId();
      let fctockendata = await api.FCTOKEN(mobile, fcmToken, 'uniqueId');
      let token = loginData.token;
      await AsyncStorage.setItem('token', token);
      dispatch(orderActions.refreshOrders());
      signIn(token, mobile);
      deliveryPartnersList();
      loadOrdersById(main_tab_key, sub_tab_Key);
      loadMerchantInfo();
    }
  };

  let newDefaultOrderCount =
    parseInt(authorizedCount) +
    parseInt(newOrdersCount) +
    parseInt(paymentReceivedCount);
  console.log('storetype----------->', storeType, paymentReceivedCount);
  const MainTab = {
    'Active Orders': {
      'New\r\nOrders':
        storeType === 'nexus' || storeType === 'forum'
          ? {
              order_status_id: 20,
              image: newbox3x,
              count: paymentReceivedCount ? paymentReceivedCount : '0',
            }
          : {
              order_status_id: [1, 19, 20],
              image: newbox3x,
              count: newDefaultOrderCount ? newDefaultOrderCount : '0',
            },
      'Processing\r\nOrders': {
        order_status_id: 2,
        image: processing3x,
        count: processingOrdersCount || '0',
      },
      'Out for\r\nDelivery': {
        order_status_id: 15,
        image: scooter3x,
        count: outForDeliveryOrdersCount || '0',
      },
    },
    'Previous Orders': {
      Delivered: {order_status_id: 5, count: deliveredOrdersCount || '0'},
      Rejected: {order_status_id: 17, count: rejectedOrdersCount || '0'},
      Cancelled: {order_status_id: 7, count: cancelledOrdersCount || '0'},
    },
  };
  // console.log("newcount00000000",newcount)
  const MenuList = Object.keys(MainTab);
  const ordersData = useSelector(state => state.orders.loadOrdersById);
  const tokenExpMsg = useSelector(state => state.orders.message);
  const newcount = useSelector(state => state.orders.newOrderCount);
  const newOrderFlag = useSelector(
    state => state.orders.isNewOrderFromNotificationFlag,
  );
  const previouscount = useSelector(state => state.orders.processingOrderCount);
  const outfordeliverycount = useSelector(
    state => state.orders.outForDelivereyOrderCount,
  );
  const deliveredcount = useSelector(state => state.orders.deliveredOrderCount);
  const declinedcount = useSelector(state => state.orders.rejectedOrderCount);
  const cancelledcount = useSelector(state => state.orders.cancelledOrderCount);
  const AuthorizedCount = useSelector(state => state.orders.authorizedCount);
  const PaymentReceivedCount = useSelector(
    state => state.orders.paymentReceived,
  );
  const responseCode = useSelector(state => state.orders.responseStatusCode);
  const merchantMessage = useSelector(state => state.orders.merchantMessage);
  const isLoadingOrders = useSelector(state => state.orders.isLoading);

  const threeCount = newcount + AuthorizedCount + PaymentReceivedCount;

  const loadMerchantInfo = async () => {
    let api = new DeveloperAPIClient();
    let Token = await AsyncStorage.getItem('token');
    let UserMobile = await AsyncStorage.getItem('MobileNumber');
    let merchanrInfo = await api.getMerchantInfo(UserMobile, Token);
    // console.log('merchant info -------------', merchanrInfo.data);
    if (merchanrInfo?.message === 'UnAuthorized Access') {
      // console.log("came in======>")
      setIsMerchantTokenExpired(true);
      // Alert.alert("Session Expired ", "Please login again", [
      //   { text: "Ok", onPress: () => sessionExpiry() },
      // ]);
      sessionExpirylogin();
      return false;
    }
    if (merchanrInfo?.data != undefined) {
      setStoreType(merchanrInfo?.data?.store_type);
      await AsyncStorage.setItem('store_type', merchanrInfo?.data?.store_type);
      await AsyncStorage.setItem(
        'accept_message',
        merchanrInfo?.data?.defaultTemplateMessages?.Accepted
          ? merchanrInfo?.data?.defaultTemplateMessages?.Accepted
          : '',
      );
      await AsyncStorage.setItem(
        'dispatch_message',
        merchanrInfo?.data?.defaultTemplateMessages?.Dispatched
          ? merchanrInfo?.data?.defaultTemplateMessages?.Dispatched
          : '',
      );
      setAcceptComment(merchanrInfo?.data?.defaultTemplateMessages?.Accepted);
      if (merchanrInfo?.data?.default_order_status_id) {
        setNewOrderStatus(merchanrInfo?.data?.default_order_status_id);
      }
      setMerchantDeliveryProvider(merchanrInfo?.data?.deliveryType);
    }
  };

  const loadorders = async (
    order_status_id,
    currentPage = 1,
    isFromNotification = false,
    loadsData = true,
  ) => {
    //console.log('order_status_id=============>', order_status_id);
    setIsLoading(true);
    setDisplayOrders();
    setRefreshing(true);
    dispatch(orderActions.refreshOrders());
    OrderStats();
    dispatch(
      orderActions.loadorders(
        order_status_id,
        currentPage,
        isFromNotification,
        loadsData,
      ),
    );
    setRefreshing(false);
    setLoadOrdersExecuted(true);
    setIsLoading(false);
    let store_type = await AsyncStorage.getItem('store_type');
    setStoreType(store_type);
    //  console.log("ordersData****************",ordersData.order_id)
  };

  const OrderStats = async () => {
    setIsLoading(true);
    setRefreshing(true);
    dispatch(orderActions.refreshOrders());
    dispatch(orderActions.OrderStats());
    setIsLoading(false);
    setRefreshing(false);
  };

  const loadOrdersById = async (main_tab_key, sub_tab_Key) => {
    const storeType = await AsyncStorage.getItem('StoreType');
    const order_status_id =
      (storeType === 'nexus' || storeType === 'forum') &&
      MainTab[main_tab_key][sub_tab_Key].order_status_id == 1
        ? 20
        : MainTab[main_tab_key][sub_tab_Key].order_status_id;
    loadMerchantInfo();
    setDisplayOrders();
    setIsLoading(true);
    setMainTabKey(main_tab_key);
    setSubTabKey(sub_tab_Key);
    setorderstatusid(MainTab[main_tab_key][sub_tab_Key].order_status_id);
    await AsyncStorage.setItem(
      'order_status_id',
      MainTab[main_tab_key][sub_tab_Key].order_status_id.toString(),
    );

    let api = new DeveloperAPIClient();
    let Token = await AsyncStorage.getItem('token');
    let UserMobile = await AsyncStorage.getItem('MobileNumber');
    let merchanrInfo = await api.getMerchantInfo(UserMobile, Token);

    let orderStatusId;

    if (sub_tab_Key === 'New\r\nOrders') {
      console.log('merchanrInfo.data.store_type', merchanrInfo.data.store_type);
      if (merchanrInfo.data.default_order_status_id) {
        orderStatusId = merchanrInfo.data.default_order_status_id.toString();
        await AsyncStorage.setItem('order_status_id', orderStatusId);
        setNewOrderStatus(
          merchanrInfo.data.store_type === 'default' ? [1, 19, 20] : 20,
        );
        loadorders(
          merchanrInfo.data.store_type === 'default' ? [1, 19, 20] : 20,
          1,
          false,
        );
      } else {
        orderStatusId =
          MainTab[main_tab_key][sub_tab_Key].order_status_id.toString();
        await AsyncStorage.setItem('order_status_id', orderStatusId);
        loadorders(
          MainTab[main_tab_key][sub_tab_Key].order_status_id,
          1,
          false,
        );
      }
    } else {
      orderStatusId =
        MainTab[main_tab_key][sub_tab_Key].order_status_id.toString();
      await AsyncStorage.setItem('order_status_id', orderStatusId);
      loadorders(MainTab[main_tab_key][sub_tab_Key].order_status_id, 1, false);
    }
    setIsLoading(false);
    setCurrentPage(1);
  };

  const editPost = async () => {
    loadOrdersById(Object.keys(MainTab)[0], 'New\r\nOrders');
    setheader('Active Orders');
  };

  const deletePost = async () => {
    ``;
    loadOrdersById(Object.keys(MainTab)[1], 'Delivered');
    setheader('Previous Orders');
  };

  const updatestatusorder = async (
    order_id,
    status_id,
    text,
    customer_mobile,
    deliveryBoyId,
    deliveryType,
  ) => {
    Toast.showWithGravity(
      'Please wait while order status been updating',
      Toast.LONG,
      Toast.BOTTOM,
    );
    const api = new DeveloperAPIClient();
    let Token = await AsyncStorage.getItem('token');
    let UserMobile = await AsyncStorage.getItem('MobileNumber');
    let statusdata = await api.getorderupdate(
      UserMobile,
      order_id,
      status_id,
      text,
      customer_mobile,
      deliveryBoyId,
      deliveryType,
    );
    console.log('statusdata------>', statusdata);
    let merchantInfo = await api.getMerchantInfo(UserMobile, Token);
    if (statusdata?.code == 500) {
      Toast.showWithGravity(statusdata.message, Toast.LONG, Toast.BOTTOM);
    }
    setDisplayOrders();
    setRefreshing(true);
    setIsLoadMore(true);
    if (sub_tab_Key === 'New\r\nOrders') {
      if (merchantInfo.data.default_order_status_id) {
        await AsyncStorage.setItem(
          'order_status_id',
          merchantInfo.data.default_order_status_id.toString(),
        );
        setNewOrderStatus(merchantInfo.data.default_order_status_id);
        loadorders(
          merchantInfo.data.store_type === 'default' ? [1, 19, 20] : 20,
          1,
          false,
        );
      } else {
        await AsyncStorage.setItem(
          'order_status_id',
          MainTab[main_tab_key][sub_tab_Key].order_status_id.toString(),
        );
        loadorders(
          MainTab[main_tab_key][sub_tab_Key].order_status_id,
          1,
          false,
        );
      }
    } else {
      loadorders(MainTab[main_tab_key][sub_tab_Key].order_status_id, 1, false);
    }

    if (statusdata.data != undefined) {
      setCurrentPage(1);
      if (status_id == 2) {
        Toast.showWithGravity(
          'Order accepted successfully',
          Toast.LONG,
          Toast.BOTTOM,
        );
      }
      if (status_id == 17) {
        Toast.showWithGravity('Order Rejected.', Toast.LONG, Toast.BOTTOM);
        setCurrentPage(1);
      }
      if (status_id == 15) {
        Toast.showWithGravity(
          'Order dispatched successfully',
          Toast.LONG,
          Toast.BOTTOM,
        );
      }
      if (status_id == 5) {
        Toast.showWithGravity(
          'Order delivered successfully',
          Toast.LONG,
          Toast.BOTTOM,
        );
      }
    }
    setRefreshing(false);
  };

  const loadOrdersByOrderId = async order_id => {
    const api = new DeveloperAPIClient();
    let Token = await AsyncStorage.getItem('token');
    let UserMobile = await AsyncStorage.getItem('MobileNumber');
    let response = await api.getOrderDetailsByOrderId(
      order_id,
      Token,
      UserMobile,
    );
    if (response.data != null) {
      setDriverDetails(response.data);
    }
  };

  const deliveryPartnersList = async () => {
    const api = new DeveloperAPIClient();
    let Token = await AsyncStorage.getItem('token');
    let UserMobile = await AsyncStorage.getItem('MobileNumber');
    let response = await api.getDeliveryBoysbyMobile(UserMobile, Token);
    if (response.data != undefined) {
      setShowDeliveryPartnerList(response.data);
      // console.log("response.data===========",response.data)
    }
  };

  const cancelReasons = [
    {id: 'OPM', name: 'Products Out of stock'},
    {id: 'DTM', name: 'No delivery partner available'},
    {id: 'OEQ', name: 'We cannot deliver to your address'},
    {id: 'BFS', name: 'Others'},
  ];

  const handleAppStateChange = state => {
    setAppState(state);
  };
  useEffect(() => {
    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );
    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    if (isFocused) {
      loadMerchantInfo();
    }
  }, [isFocused]);

  const _handleLoadMore = async () => {
    if (isLoadMore) {
      setRefreshing(true);
      dispatch(
        orderActions.loadorders(order_status_id, currentPage + 1, false, false),
      );
      setCurrentPage(currentPage + 1);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // OrderStats();

      if (!newOrderFlag) {
        deliveryPartnersList();
        loadOrdersById(main_tab_key, sub_tab_Key);
        loadMerchantInfo();
      }
    });
    return unsubscribe;
  }, [main_tab_key, sub_tab_Key]);

  const sessionExpiry = async () => {
    setRefreshing(true);
    setDisplayOrders();
    responseCode == null;
    dispatch(orderActions.refreshOrders());
    signUpWithPassword();
    dispatch(orderActions.loadorders(order_status_id, currentPage, false));
    setRefreshing(false);
  };

  useEffect(() => {
    if (newOrderFlag) {
      if (!isMerchantTokenExpired) {
        if (isLoadOrdersExecuted && responseCode == '401') {
          // console.log("came in======>")
          // Alert.alert("Session Expired ", "Please login again", [
          //   { text: "Ok", onPress: () => sessionExpiry() },
          // ]);
          sessionExpirylogin();
        }
      }
      setIsLoadMore(true);
      setCurrentPage(1);
      setDisplayOrders(ordersData);
    } else {
      if (ordersData) {
        if (ordersData.length < 10) {
          setIsLoadMore(false);
        } else {
          setIsLoadMore(true);
        }
        if (displayOrders && currentPage > 1) {
          setDisplayOrders([...displayOrders, ...ordersData]);
        } else {
          setDisplayOrders(ordersData);
        }
      } else {
        if (!isMerchantTokenExpired) {
          if (isLoadOrdersExecuted && responseCode == '401') {
            // Alert.alert("Session Expired ", "Please login again", [
            //   { text: "Ok", onPress: () => sessionExpiry() },
            // ]);
            // console.log("came in======>")
            sessionExpirylogin();
          }
        }
      }
    }
  }, [ordersData]);

  useEffect(() => {
    setNewOrdersCount(newcount);
    setProcessingOrdersCount(previouscount);
    setOutForDeliveryOrdersCount(outfordeliverycount);
    setDeliveredOrdersCount(deliveredcount);
    setCancelledOrdersCount(cancelledcount);
    setRejectedOrdersCount(declinedcount);
    setAuthorizedCount(AuthorizedCount);
    setPaymentReceivedCount(PaymentReceivedCount);
  }, [
    newcount,
    previouscount,
    outfordeliverycount,
    deliveredcount,
    cancelledcount,
    declinedcount,
    authorizedCount,
    paymentReceivedCount,
  ]);

  const renderItem = ({item, index}) => (
    <View
      style={{
        justifyContent: 'center',
        backgroundColor:
          selectedDriver?.name == item.name ? '#34A549' : '#F7F7FC',
        width: '90%',
        marginLeft: 19,
        borderRadius: 5,
        borderBottomWidth: 1,
        borderBottomColor: '#F7F7FC',
      }}>
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          margin: 10,
        }}
        onPress={() => {
          setSelectedDriver(item);
          setShowModal(false);
        }}>
        <Text
          style={{
            color: selectedDriver?.name == item.name ? '#fff' : 'black',
            fontSize: 20,
            textAlign: 'center',
            fontFamily:
              selectedDriver?.name == item.name
                ? 'Poppins-Bold'
                : 'Poppins-Regular',
          }}>
          {item.name}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <>
        <StatusBar
          backgroundColor="#FFFF"
          barStyle={theme.dark ? 'light-content' : 'dark-content'}
        />

        <View style={styles.header}>
          <View style={{marginLeft: 0}}>
            <Text
              style={{
                color: '#2B2520',
                fontFamily: 'Poppins-Medium',
                fontSize: 20,
              }}>
              {header}
            </Text>
          </View>
          <View style={{flex: 1, alignItems: 'flex-end'}}>
            <OptionsMenu
              button={MoreIcon}
              buttonStyle={{
                width: 23,
                height: 15.5,
                resizeMode: 'center',
              }}
              options={MenuList}
              actions={[editPost, deletePost]}
            />
          </View>
        </View>

        {main_tab_key === 'Active Orders' && (
          <View
            style={{
              flexDirection: 'row',
              // borderWidth: 1,
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 10,
              width: '100%',
            }}>
            {Object.keys(MainTab[main_tab_key]) &&
              Object.keys(MainTab[main_tab_key]).map((val, i) => {
                return (
                  <TouchableOpacity
                    onPress={() => loadOrdersById(main_tab_key, val)}
                    activeOpacity={0.7}
                    key={i}
                    style={{
                      backgroundColor:
                        sub_tab_Key === val ? '#51AF5E' : '#F2F7F9',
                      padding: 5,
                      width: '32%',
                      height: 'auto',
                      // aspectRatio: 1,
                      borderRadius: 5,
                      borderColor: sub_tab_Key === val ? '#337D3E' : '#F2F7F9',
                    }}>
                    <View style={{alignItems: 'flex-end', margin: 5}}>
                      <Image
                        source={MainTab[main_tab_key][val]['image']}
                        style={{width: 45, height: 35, resizeMode: 'contain'}}
                      />
                    </View>
                    <Text
                      style={{
                        color: sub_tab_Key === val ? '#FFFF' : '#373D43',
                        fontFamily: 'Poppins-SemiBold',
                        fontSize: 24,
                        textAlign: 'left',
                      }}>
                      {MainTab[main_tab_key][val]['count']}
                    </Text>
                    <Text
                      style={{
                        color: sub_tab_Key === val ? '#FFFF' : '#373D43',
                        fontFamily: 'Poppins-SemiBold',
                        fontSize: 14,
                        textAlign: 'left',
                      }}
                      numberOfLines={2}>
                      {val}
                    </Text>
                  </TouchableOpacity>
                );
              })}
          </View>
        )}

        {main_tab_key === 'Previous Orders' && (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 10,
              width: '100%',
            }}>
            {Object.keys(MainTab[main_tab_key]) &&
              Object.keys(MainTab[main_tab_key]).map((val, i) => {
                return (
                  <TouchableOpacity
                    onPress={() => loadOrdersById(main_tab_key, val)}
                    activeOpacity={0.7}
                    key={i}
                    style={{
                      backgroundColor:
                        sub_tab_Key === val ? '#51AF5E' : '#F2F7F9',
                      padding: 5,
                      width: '32%',
                      aspectRatio: 1,
                      borderRadius: 5,
                      borderColor: sub_tab_Key === val ? '#337D3E' : '#F2F7F9',
                    }}>
                    <View style={{alignItems: 'flex-end', margin: 5}}>
                      <Image
                        source={MainTab[main_tab_key][val]['image']}
                        style={{width: 45, height: 35, resizeMode: 'contain'}}
                      />
                    </View>
                    <Text
                      style={{
                        color: sub_tab_Key === val ? '#FFFF' : '#373D43',
                        fontFamily: 'Poppins-SemiBold',
                        fontSize: 24,
                        textAlign: 'left',
                      }}>
                      {MainTab[main_tab_key][val]['count']}
                    </Text>
                    <Text
                      style={{
                        color: sub_tab_Key === val ? '#FFFF' : '#373D43',
                        fontFamily: 'Poppins-SemiBold',
                        fontSize: 14,
                        textAlign: 'left',
                      }}
                      numberOfLines={2}>
                      {val}
                    </Text>
                  </TouchableOpacity>
                );
              })}
          </View>
        )}

        {sub_tab_Key === 'New\r\nOrders' ? (
          <>
            {isLoadingOrders ? (
              <ActivityIndicator size="large" color="#51AF5E" />
            ) : (
              <View style={{marginBottom: 200}}>
                {displayOrders?.length !== 0 ? (
                  <FlatList
                    // data={[{id:1},{id:1}]}
                    data={displayOrders}
                    onEndReached={() => _handleLoadMore()}
                    numColumns={1}
                    nestedScrollEnabled={true}
                    renderItem={({item, index}) => {
                      // console.log('---------------------------->itens', item);
                      return (
                        <OrderCard
                          onPress={() =>
                            navigation.navigate('NewOrderDetails', {
                              ID: item.order_id,
                              customer_mobile: item.telephone,
                              orderhistory: item.order_history,
                              deliveryType: item.deliveryType,
                              deliveryMethod: item.deliveryMethod,
                              item: item,
                              comment: acceptComment,
                            })
                          }
                          orderDate={item.OrderDateLocal}
                          price={item.total}
                          name={item.firstname}
                          ID={item.order_id}
                          products={item?.products || []}
                          orderhistory={item.order_history}
                          orderType={item.payment_method}
                          time={item.date_added}
                          location={item.shipping_address}
                          order_id={item.order_id}
                          order_status_id={2}
                          statusUpdate={updatestatusorder}
                          // decline={declineorder}
                          customer_mobile={item.telephone}
                          reasons={cancelReasons}
                          code={setCancelReasonCode}
                          setcode={cancelReasonCode}
                          mainTabKey={main_tab_key}
                          subTabKey={sub_tab_Key}
                          loadOrdersById={loadOrdersById}
                          selectedProvider={selectedProvider}
                          setSelectedProvider={setSelectedProvider}
                          merchantDeliveryProvider={merchantDeliveryProvider}
                          loadOrdersByOrderId={loadOrdersByOrderId}
                          item={item}
                          deliveryType={item.deliveryType}
                          comment={acceptComment}
                          storeType={storeType}
                          serviceChargeType={item.serviceChargeType}
                          type={item.type}
                          tableNumber={item.tableNumber}
                        />
                      );
                    }}
                  />
                ) : (
                  <Text style={styles.noOrderText}>
                    No Orders there to display...
                  </Text>
                )}
              </View>
            )}
          </>
        ) : sub_tab_Key === 'Processing\r\nOrders' ? (
          <View style={{marginBottom: 200}}>
            {isLoadingOrders ? (
              <ActivityIndicator size="large" color="#51AF5E" />
            ) : (
              <View>
                {previouscount != 0 ? (
                  <FlatList
                    data={displayOrders}
                    onEndReached={() => _handleLoadMore()}
                    numColumns={1}
                    nestedScrollEnabled={true}
                    renderItem={({item, index}) => (
                      <OrderCard2
                        onPress={() =>
                          navigation.navigate('ProcessingOrderDetails', {
                            ID: item.order_id,
                            customer_mobile: item.telephone,
                            orderhistory: item.order_history,
                            deliveryType: item.deliveryType,
                            deliveryMethod: item.deliveryMethod,
                            item: item,
                          })
                        }
                        orderDate={item.OrderDateLocal}
                        price={item.total}
                        name={item.name}
                        products={item.products}
                        ID={item.order_id}
                        orderType={item.payment_method}
                        time={item.date_added}
                        location={item.shipping_address}
                        order_id={item.order_id}
                        order_status_id={15}
                        statusUpdate={updatestatusorder}
                        customer_mobile={item.telephone}
                        showDeliveryPartnerList={showDeliveryPartnerList}
                        selectedProvider={selectedProvider}
                        renderItem={renderItem}
                        setSelectedDriver={setSelectedDriver}
                        setSelectedProvider={setSelectedProvider}
                        setShowModal={setShowModal}
                        showModal={showModal}
                        selectedDriver={selectedDriver}
                        merchantDeliveryProvider={merchantDeliveryProvider}
                        loadOrdersByOrderId={loadOrdersByOrderId}
                        item={item}
                        driverDetails={driverDetails}
                        deliveryType={item.deliveryType}
                        storeType={storeType}
                        serviceChargeType={item.serviceChargeType}
                        type={item.type}
                        tableNumber={item.tableNumber}
                        // dispatchComment={dispatchComment}
                        // photoChecked={setPhotoSelected}
                      />
                    )}
                  />
                ) : (
                  <Text style={styles.noOrderText}>
                    No Orders there to display...
                  </Text>
                )}
              </View>
            )}
          </View>
        ) : (
          sub_tab_Key === 'Out for\r\nDelivery' && (
            <View style={{marginBottom: 200}}>
              {outfordeliverycount != 0 ? (
                <View>
                  {isLoadingOrders ? (
                    <ActivityIndicator size="large" color="#51AF5E" />
                  ) : (
                    <FlatList
                      data={displayOrders}
                      onEndReached={() => _handleLoadMore()}
                      numColumns={1}
                      nestedScrollEnabled={true}
                      renderItem={({item, index}) => (
                        <OrderCard3
                          onPress={() =>
                            navigation.navigate('OutfordeliveryOrderDetails', {
                              ID: item.order_id,
                              customer_mobile: item.telephone,
                              orderhistory: item.order_history,
                              selectedProvider: selectedProvider,
                              showModal: showModal,
                              setSelectedDriver: setSelectedDriver,
                              item: item,
                            })
                          }
                          orderDate={item.OrderDateLocal}
                          price={item.total}
                          name={item.name}
                          products={item.products}
                          ID={item.order_id}
                          orderType={item.payment_method}
                          time={item.date_added}
                          location={item.shipping_address}
                          order_id={item.order_id}
                          order_status_id={5}
                          statusUpdate={updatestatusorder}
                          customer_mobile={item.telephone}
                          showDeliveryPartnerList={showDeliveryPartnerList}
                          selectedProvider={selectedProvider}
                          renderItem={renderItem}
                          setSelectedDriver={setSelectedDriver}
                          setSelectedProvider={setSelectedProvider}
                          setShowModal={setShowModal}
                          showModal={showModal}
                          selectedDriver={selectedDriver}
                          merchantDeliveryProvider={merchantDeliveryProvider}
                          loadOrdersByOrderId={loadOrdersByOrderId}
                          item={item}
                          driverDetails={driverDetails}
                          deliveryType={item.deliveryType}
                          storeType={storeType}
                          serviceChargeType={item.serviceChargeType}
                          type={item.type}
                          tableNumber={item.tableNumber}
                        />
                      )}
                    />
                  )}
                </View>
              ) : (
                <Text style={styles.noOrderText}>
                  No Orders there to display...
                </Text>
              )}
            </View>
          )
        )}

        {sub_tab_Key === 'Cancelled' ? (
          <>
            <View style={{marginBottom: 200}}>
              {isLoadingOrders ? (
                <ActivityIndicator size="large" color="#51AF5E" />
              ) : (
                <FlatList
                  data={displayOrders}
                  onEndReached={() => _handleLoadMore()}
                  numColumns={1}
                  nestedScrollEnabled={true}
                  renderItem={({item, index}) => (
                    <View>
                      <CancelledCard
                        onPress={() =>
                          navigation.navigate('OrderCancelledDetails', {
                            ID: item.order_id,
                            orderhistory: item.order_history,
                          })
                        }
                        orderDate={item.OrderDateLocal}
                        price={item.total}
                        name={item.name}
                        ID={item.order_id}
                        products={item.products}
                        orderType={item.payment_method}
                        time={item.date_added}
                        location={item.shipping_address}
                        order_id={item.order_id}
                        order_status_id={order_status_id}
                        statusUpdate={updatestatusorder}
                        item={item}
                        storeType={storeType}
                      />
                    </View>
                  )}
                />
              )}
            </View>
          </>
        ) : sub_tab_Key === 'Delivered' ? (
          <View style={{marginBottom: 200}}>
            {isLoadingOrders ? (
              <ActivityIndicator size="large" color="#51AF5E" />
            ) : (
              <FlatList
                data={displayOrders}
                onEndReached={() => _handleLoadMore()}
                numColumns={1}
                nestedScrollEnabled={true}
                renderItem={({item, index}) => (
                  <View>
                    <DeliveredCard
                      onPress={() =>
                        navigation.navigate('OrderDelivered', {
                          ID: item.order_id,
                          orderhistory: item.order_history,
                        })
                      }
                      orderDate={item.OrderDateLocal}
                      price={item.total}
                      name={item.name}
                      products={item.products}
                      ID={item.order_id}
                      orderType={item.payment_method}
                      time={item.date_added}
                      location={item.shipping_address}
                      order_id={item.order_id}
                      order_status_id={order_status_id}
                      statusUpdate={updatestatusorder}
                      item={item}
                      storeType={storeType}
                    />
                  </View>
                )}
              />
            )}
          </View>
        ) : (
          sub_tab_Key === 'Rejected' && (
            <View style={{marginBottom: 200}}>
              {isLoadingOrders ? (
                <ActivityIndicator size="large" color="#51AF5E" />
              ) : (
                <FlatList
                  data={displayOrders}
                  onEndReached={() => _handleLoadMore()}
                  numColumns={1}
                  nestedScrollEnabled={true}
                  renderItem={({item, index}) => (
                    <View>
                      <DeclinedCard
                        onPress={() =>
                          navigation.navigate('OrderDeclinedDetails', {
                            ID: item.order_id,
                            orderhistory: item.order_history,
                          })
                        }
                        orderDate={item.OrderDateLocal}
                        price={item.total}
                        name={item.name}
                        products={item.products}
                        ID={item.order_id}
                        orderType={item.payment_method}
                        time={item.date_added}
                        location={item.shipping_address}
                        order_id={item.order_id}
                        order_status_id={order_status_id}
                        statusUpdate={updatestatusorder}
                        item={item}
                        storeType={storeType}
                      />
                    </View>
                  )}
                />
              )}
            </View>
          )
        )}
      </>
    </View>
  );
};

export default OrdersScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFF',
    padding: 10,
  },
  scrollView: {
    flex: 1,
    backgroundColor: 'pink',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chip: {
    margin: 5,
    borderRadius: 15,
    borderTopEndRadius: 350,
    padding: 5,
    width: '31%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chipText: {
    color: '#21272E',
    fontFamily: 'Poppins-SemiBold',
    fontSize: 13,

    // adjustsFontSizeToFit:'true'
  },
  headerTitle: {
    color: '#2B2520',
    fontFamily: 'Poppins-Medium',
    fontSize: 20,
    marginLeft: 10,
  },
  header: {
    flexDirection: 'row',
    marginHorizontal: 5,
    marginVertical: 15,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 15,
  },
  mainHeader: {
    backgroundColor: '#ffffff',
    height: 45,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  icon: {
    width: 40,
    height: 40,
  },
  logo: {
    width: 80,
    height: 80,
    marginLeft: 10,
  },
  categoryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
    marginHorizontal: 30,
  },
  card: {
    width: 140,
    height: 140,
    borderRadius: 15,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
  mainCategoryContainer: {
    marginVertical: 30,
  },
  iconContainer: {
    backgroundColor: '#fe5e00',
    borderRadius: 50,
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTitle: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginVertical: 10,
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
    marginTop: 18,
  },
  signIn: {
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  textSign: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  SectionStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 0.5,
    borderColor: '#fff',
    height: 40,
    borderRadius: 50,
    marginHorizontal: 15,
    marginVertical: 5,
    paddingRight: 5,
    paddingLeft: 5,
  },

  IconStyle: {
    alignItems: 'center',
    margin: 5,
  },

  productCard: {
    width: 160,
    elevation: 2,
    borderRadius: 15,
    padding: 10,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 4,
  },
  menuText: {
    color: '#21272E',
    // opacity: 0.5,
    fontSize: 15,
    marginRight: 20,
    margin: 10,
    backgroundColor: '#FFFFFF',
    // fontStyle:'Poppins-SemiBold'
  },
  noOrderText: {
    textAlign: 'center',
    justifyContent: 'center',
    marginTop: '60%',
    color: '#000000',
  },
});
