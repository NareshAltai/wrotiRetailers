import React, {useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Image,
  TouchableOpacity,
  TextInput,
  Modal,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import {useTheme} from '@react-navigation/native';
//import NetworkChecker from "react-native-network-checker";
import {useDispatch, useSelector} from 'react-redux';
import {useIsFocused} from '@react-navigation/native';
import {Divider} from 'react-native-paper';
import Api from '../../state/middlewares/DeveloperAPIClient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import ApiClient from '../../state/middlewares/DeveloperAPIClient';
import Toast from 'react-native-simple-toast';

const PaymentStatusScreen = ({navigation}) => {
  const [searchBy, setSearchBy] = React.useState('Mobile');
  const [searchKey, setSearchKey] = React.useState('');
  const [searchData, setSearchData] = React.useState();
  const [currentStatus, setCurrentStatus] = React.useState();
  const [paymentStatusMsg, setPaymentStatusMsg] = React.useState();
  const [isModal, setIsModal] = React.useState(false);
  const [isPOSUser, setIsPOSUser] = React.useState();
  const [orderId, setOrderId] = React.useState();
  const [isLoader, setIsLoader] = React.useState(false);
  const [selectedOrderObj, setSelectedOrderObj] = React.useState();
  const [isDataLoading, setIsDataLoading] = React.useState();
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const theme = useTheme();
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {});
    return unsubscribe;
  }, [isFocused]);

  const getOrderDetailsByOrderId = async order_id => {
    setIsDataLoading(true);
    setSearchData();
    setIsLoader(true);
    const api = new Api();
    let UserMobile = await AsyncStorage.getItem('MobileNumber');
    let allOrdersData = await api.getOrderDetails(UserMobile, order_id);
    if (allOrdersData?.data?.success) {
      setSearchData(allOrdersData.data.orders);
      if (allOrdersData?.data?.orders?.historiesdata?.length > 0) {
        if (allOrdersData?.data?.orders?.historiesdata?.length === 1) {
          setCurrentStatus(
            allOrdersData?.data?.orders?.historiesdata[0].status,
          );
        }
        if (allOrdersData?.data?.orders?.historiesdata?.length > 1) {
          setCurrentStatus(
            allOrdersData?.data?.orders?.historiesdata[
              allOrdersData?.data?.orders?.historiesdata?.length - 1
            ].status,
          );
        }
      }
      setIsLoader(false);
    } else {
      setSearchData();
      setIsLoader(false);
      Toast.showWithGravity('No Orders Found', Toast.LONG, Toast.BOTTOM);
    }
    setIsDataLoading(false);
    console.log('allOrdersData?.data', JSON.stringify(allOrdersData?.data));
  };

  const getOrdersByCustomerMobile = async mobile => {
    setIsDataLoading(true);
    setSearchData();
    setIsLoader(true);
    const api = new Api();
    let merchantMobile = await AsyncStorage.getItem('MobileNumber');
    let Token = await AsyncStorage.getItem('token');

    let allOrdersData = await api.getOrdersByMobile(
      merchantMobile,
      Token,
      mobile,
      10,
      1,
    );
    console.log('allOrdersData--------', allOrdersData.data);
    if (allOrdersData?.data?.success) {
      // Set only the first five orders from the response
      setSearchData(allOrdersData.data.orders.slice(0, 5));
      setIsLoader(false);
      setIsDataLoading(false);
    } else {
      setIsLoader(false);
      setSearchData([]);
      Toast.showWithGravity('No Orders Found', Toast.LONG, Toast.BOTTOM);
    }
    setIsDataLoading(false);
  };

  const searchOrder = searchBy => {
    console.log('searchBy', searchBy);
    if (searchBy === 'Mobile') {
      console.log('HEY');
      if (searchKey?.length === 10) {
        getOrdersByCustomerMobile(searchKey);
      } else {
        setIsLoader(false);
        Toast.showWithGravity(
          'Enter Valid Mobile Number',
          Toast.LONG,
          Toast.BOTTOM,
        );
      }
    } else {
      console.log('HEY CAME');
      if (searchKey?.length >= 3) {
        getOrderDetailsByOrderId(searchKey);
      } else {
        setIsLoader(false);
        Toast.showWithGravity('Enter Valid Order Id', Toast.LONG, Toast.BOTTOM);
      }
    }
  };

  const checkPaymentStatus = async (order_id, status) => {
    setOrderId(order_id);
    let checkPosUser = await AsyncStorage.getItem('isPOSUser');
    let finalPosEnable = JSON.parse(checkPosUser);
    setIsPOSUser(JSON.parse(checkPosUser));
    let Api = new ApiClient();
    let Token = await AsyncStorage.getItem('token');
    let UserMobile = await AsyncStorage.getItem('MobileNumber');
    let paymentStatusResponse = await Api.checkPaymentStatus(
      UserMobile,
      Token,
      order_id,
    );
    console.log('paymentStatusResponse', paymentStatusResponse);
    if (paymentStatusResponse?.data) {
      if (paymentStatusResponse?.data?.msg?.status === 'initiated') {
        setPaymentStatusMsg('Pending');
      } else if (paymentStatusResponse?.data?.msg?.status === 'success') {
        setPaymentStatusMsg('PAYMENT RECEIVED');
        if (!finalPosEnable) {
          updateOrderStatus(order_id, 20);
        }
      } else if (paymentStatusResponse?.data?.msg?.status === 'usercancelled') {
        setPaymentStatusMsg('PAYMENT CANCELLED');
      } else if (paymentStatusResponse?.data?.msg?.status === 'failure') {
        setPaymentStatusMsg('PAYMENT FAILED');
      } else {
        setPaymentStatusMsg(paymentStatusResponse?.data?.msg?.status);
      }
      setIsModal(true);
    }
  };

  const checkStatus = async (status, order_id, item) => {
    setSelectedOrderObj(item);
    console.log('status', 'ID', status, order_id);
    setOrderId(order_id);
    let accept_message = await AsyncStorage.getItem('accept_message');
    if (status === 'Pending') {
      checkPaymentStatus(order_id, status);
    } else {
      if (searchBy === 'Mobile') {
        if (status === 'Dispatched') {
          navigation.navigate('OutfordeliveryOrderDetails', {
            ID: item.order_id,
            customer_mobile: item.telephone,
            orderhistory: item.order_history,
            deliveryType: item.deliveryType,
            deliveryMethod: item.deliveryMethod,
            item: item,
          });
        } else if (status === 'Accepted') {
          navigation.navigate('ProcessingOrderDetails', {
            ID: item.order_id,
            customer_mobile: item.telephone,
            orderhistory: item.order_history,
            deliveryType: item.deliveryType,
            deliveryMethod: item.deliveryMethod,
            item: item,
          });
        } else if (status === 'Delivered') {
          navigation.navigate('OrderDelivered', {
            ID: item.order_id,
          });
        } else if (status === 'Rejected') {
          navigation.navigate('OrderDeclinedDetails', {
            ID: item.order_id,
          });
        } else if (status === 'Cancelled') {
          navigation.navigate('OrderCancelledDetails', {
            ID: item.order_id,
          });
        } else if (status === 'Payment Received') {
          navigation.navigate('NewOrderDetails', {
            ID: item.order_id,
            customer_mobile: item.telephone,
            orderhistory: item.order_history,
            deliveryType: item.deliveryType,
            deliveryMethod: item.deliveryMethod,
            item: item,
          });
        } else if (status === 'Authorized') {
          navigation.navigate('NewOrderDetails', {
            ID: item.order_id,
            customer_mobile: item.telephone,
            orderhistory: item.order_history,
            deliveryType: item.deliveryType,
            deliveryMethod: item.deliveryMethod,
            item: item,
          });
        }
      } else {
        if (status === 'Dispatched') {
          navigation.navigate('OutfordeliveryOrderDetails', {
            ID: searchData?.order_info.order_id,
            customer_mobile: searchData?.order_info.telephone,
            orderhistory: searchData?.order_info.historiesdata,
            deliveryType: searchData?.order_info.deliveryType,
            deliveryMethod: searchData?.order_info.deliveryMethod,
            item: searchData?.order_info,
          });
        } else if (status === 'Accepted') {
          navigation.navigate('ProcessingOrderDetails', {
            ID: searchData?.order_info.order_id,
            customer_mobile: searchData?.order_info.telephone,
            orderhistory: searchData?.order_info.historiesdata,
            deliveryType: searchData?.order_info.deliveryType,
            deliveryMethod: searchData?.order_info.deliveryMethod,
            item: searchData?.order_info,
          });
        } else if (status === 'Delivered') {
          navigation.navigate('OrderDelivered', {
            ID: searchData?.order_info.order_id,
          });
        } else if (status === 'Rejected') {
          navigation.navigate('OrderDeclinedDetails', {
            ID: searchData?.order_info.order_id,
          });
        } else if (status === 'Cancelled') {
          navigation.navigate('OrderCancelledDetails', {
            ID: searchData?.order_info.order_id,
          });
        } else if (status === 'Payment Received') {
          navigation.navigate('NewOrderDetails', {
            ID: searchData?.order_info.order_id,
            customer_mobile: searchData?.order_info.telephone,
            orderhistory: searchData?.order_info.historiesdata,
            deliveryType: searchData?.order_info.deliveryType,
            deliveryMethod: searchData?.order_info.deliveryMethod,
            item: searchData?.order_info,
            comment: accept_message,
          });
        } else if (status === 'Authorized') {
          navigation.navigate('NewOrderDetails', {
            ID: searchData?.order_info.order_id,
            customer_mobile: searchData?.order_info.telephone,
            orderhistory: searchData?.order_info.historiesdata,
            deliveryType: searchData?.order_info.deliveryType,
            deliveryMethod: searchData?.order_info.deliveryMethod,
            item: searchData?.order_info,
            comment: accept_message,
          });
        }
      }
    }
  };

  const updateOrderStatus = async (order_id, status_id) => {
    let Api = new ApiClient();
    let Token = await AsyncStorage.getItem('token');
    let UserMobile = await AsyncStorage.getItem('MobileNumber');
    let updateOrderStatus = await Api.getorderupdate(
      UserMobile,
      order_id,
      status_id,
      '',
      searchData?.order_info?.telephone,
      '',
      '',
    );
    if (updateOrderStatus?.data?.success) {
      if (status_id === 2) {
        setIsModal(false);
        searchOrder(searchBy, order_id);
      }
    }
  };

  const [isPushingToPOS, setIsPushingToPOS] = React.useState(false);

  const pushOrderToPOS = async order_id => {
    setIsPushingToPOS(true);
    let Api = new ApiClient();
    let Token = await AsyncStorage.getItem('token');
    let UserMobile = await AsyncStorage.getItem('MobileNumber');

    let posOrderResponse = await Api.pushOrderToPOS(
      UserMobile,
      Token,
      order_id,
    );
    if (posOrderResponse?.data) {
      Toast.showWithGravity(
        posOrderResponse.data.message,
        Toast.LONG,
        Toast.BOTTOM,
      );
      setIsModal(false);
      searchOrder(searchBy, order_id);
      // checkPaymentStatus(order_id);
    }
    setIsPushingToPOS(false);
  };

  const renderItem = ({item}) => {
    return (
      <View
        style={{
          borderWidth: 1,
          borderRadius: 10,
          backgroundColor: '#fff',
          shadowColor: '#000',
          shadowOffset: {width: 0, height: 2},
          shadowOpacity: 0.2,
          shadowRadius: 2,
          elevation: 1,
          padding: 10,
          margin: 10,
        }}>
        <View style={{flexDirection: 'row'}}>
          <View style={{flexDirection: 'column'}}>
            <Text
              style={{
                fontSize: 16,
                fontFamily: 'Poppins-Medium',
                marginVertical: 2,
                marginHorizontal: 10,
              }}>
              Order ID{' '}
            </Text>
            <Text
              style={{
                fontSize: 16,
                fontFamily: 'Poppins-Medium',
                marginVertical: 2,
                marginHorizontal: 10,
              }}>
              Current Status{' '}
            </Text>
            <Text
              style={{
                fontSize: 16,
                fontFamily: 'Poppins-Medium',
                marginVertical: 2,
                marginHorizontal: 10,
              }}>
              Mobile{' '}
            </Text>
            <Text
              style={{
                fontSize: 16,
                fontFamily: 'Poppins-Medium',
                marginVertical: 2,
                marginHorizontal: 10,
              }}>
              Amount{' '}
            </Text>
            <Text
              style={{
                fontSize: 16,
                fontFamily: 'Poppins-Medium',
                marginVertical: 2,
                marginHorizontal: 10,
              }}>
              D O T{' '}
            </Text>
            <Text
              style={{
                fontSize: 16,
                fontFamily: 'Poppins-Medium',
                marginVertical: 2,
                marginHorizontal: 10,
              }}>
              Action{' '}
            </Text>
          </View>
          <View style={{flexDirection: 'column'}}>
            <Text
              style={{
                fontSize: 16,
                fontFamily: 'Poppins-Medium',
                marginVertical: 2,
              }}>
              :
            </Text>
            <Text
              style={{
                fontSize: 16,
                fontFamily: 'Poppins-Medium',
                marginVertical: 2,
              }}>
              :
            </Text>
            <Text
              style={{
                fontSize: 16,
                fontFamily: 'Poppins-Medium',
                marginVertical: 2,
              }}>
              :
            </Text>
            <Text
              style={{
                fontSize: 16,
                fontFamily: 'Poppins-Medium',
                marginVertical: 2,
              }}>
              :
            </Text>
            <Text
              style={{
                fontSize: 16,
                fontFamily: 'Poppins-Medium',
                marginVertical: 2,
              }}>
              :
            </Text>
          </View>
          <View style={{flexDirection: 'column'}}>
            <Text
              style={{
                fontSize: 16,
                fontFamily: 'Poppins-Medium',
                marginVertical: 2,
                marginHorizontal: 10,
                color: 'green',
              }}>
              {item.order_id}
            </Text>
            <Text
              style={{
                fontSize: 16,
                fontFamily: 'Poppins-Medium',
                marginVertical: 2,
                marginHorizontal: 10,
                color: 'green',
              }}>
              {item.status}
            </Text>
            <Text
              style={{
                fontSize: 16,
                fontFamily: 'Poppins-Medium',
                marginVertical: 2,
                marginHorizontal: 10,
                color: 'green',
              }}>
              {item.telephone}
            </Text>
            <Text
              style={{
                fontSize: 16,
                fontFamily: 'Poppins-Medium',
                marginVertical: 2,
                marginHorizontal: 10,
                color: 'green',
              }}>
              {item.total}
            </Text>
            <Text
              style={{
                fontSize: 16,
                fontFamily: 'Poppins-Medium',
                marginVertical: 2,
                marginHorizontal: 10,
                color: 'green',
              }}>
              {moment(`${item.date_added}`).local().format('DD/MMM/YY hh:mm a')}
            </Text>
            <TouchableOpacity
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'green',
                width: '80%',
                height: 40,
                borderRadius: 10,
              }}
              onPress={() => checkStatus(item.status, item.order_id, item)}>
              <Text
                numberOfLines={1}
                style={{fontFamily: 'Poppins-Regular', color: '#fff'}}>
                {item.status === 'Pending' ? 'Check Status' : 'Order Details'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const selectType = type => {
    if (!isDataLoading) {
      setIsLoader(false);
      setSearchBy(type);
      setSearchData();
      setSearchKey();
    } else {
      Toast.showWithGravity(
        'Please wait while fetching the data',
        Toast.LONG,
        Toast.BOTTOM,
      );
    }
  };

  return (
    <View style={styles.container}>
      <>
        <StatusBar
          backgroundColor="#F4F5F7"
          barStyle={theme.dark ? 'light-content' : 'dark-content'}
        />

        <Modal
          // animationType="slide"
          onDismiss={() => setIsModal(false)}
          // transparent={true}
          visible={isModal}
          onRequestClose={() => setIsModal(false)}>
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <View
              style={{
                paddingHorizontal: 10,
                paddingVertical: 10,
                backgroundColor: 'white',
                elevation: 5,
                shadowColor: 'black',
                borderBottomWidth: 0.4,
                borderBottomColor: '#21272E14',
                // marginTop: 10,
                width: '94.5%',
                marginHorizontal: 10,
                maxHeight: '90%',
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  borderBottomWidth: 1,
                  borderBottomColor: '#337D3E',
                }}>
                <Text
                  style={{
                    fontSize: 20,
                    fontFamily: 'Poppins-SemiBold',
                    alignItems: 'center',
                    color: '#21272E',
                    marginHorizontal: 5,
                  }}>
                  Payment Status
                </Text>
                <TouchableOpacity
                  style={{marginLeft: 'auto'}}
                  onPress={() => {
                    setIsModal(false);
                    searchOrder(searchBy);
                  }}>
                  <Image
                    style={{height: 18, width: 18, resizeMode: 'center'}}
                    source={require('../../assets/remove.png')}
                  />
                </TouchableOpacity>
              </View>
              <View style={{flexDirection: 'row'}}>
                <View style={{flexDirection: 'column'}}>
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: 'Poppins-Medium',
                      marginVertical: 10,
                      marginHorizontal: 10,
                    }}>
                    ORDER ID :
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: 'Poppins-Medium',
                      marginVertical: 10,
                      marginHorizontal: 10,
                    }}>
                    CURRENT STATUS :
                  </Text>
                </View>
                <View style={{flexDirection: 'column', marginLeft: 15}}>
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: 'Poppins-Medium',
                      marginVertical: 10,
                      marginHorizontal: 10,
                    }}>
                    {orderId}
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: 'Poppins-SemiBold',
                      marginVertical: 10,
                      marginHorizontal: 10,
                    }}>
                    {paymentStatusMsg && paymentStatusMsg}
                  </Text>
                </View>
              </View>
              {isPOSUser && paymentStatusMsg === 'PAYMENT RECEIVED' && (
                <>
                  <Text
                    style={{
                      fontSize: 12,
                      fontFamily: 'Poppins-Regular',
                      marginVertical: 10,
                      marginHorizontal: 10,
                    }}>
                    Payment received from the Bank, please push this order to
                    POS.
                  </Text>

                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <TouchableOpacity
                      onPress={() => pushOrderToPOS(orderId)}
                      style={{
                        marginTop: 10,
                        width: 150,
                        height: 35,
                        paddingTop: '4%',
                        paddingBottom: '9%',
                        backgroundColor: '#337D3E',
                        borderRadius: 10,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                      disabled={isPushingToPOS} // Disable the button while loading
                    >
                      {isPushingToPOS ? (
                        <ActivityIndicator size="small" color="#fff" />
                      ) : (
                        <Text
                          style={{
                            color: '#fff',
                            fontSize: 15,
                            alignSelf: 'center',
                            fontFamily: 'Poppins-SemiBold',
                            marginBottom: 10,
                          }}>
                          Push to POS
                        </Text>
                      )}
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => {
                        setIsModal(false);
                        searchOrder(searchBy);
                      }}
                      style={{
                        marginTop: 10,
                        width: 150,
                        height: 35,
                        paddingTop: '4%',
                        paddingBottom: '9%',
                        backgroundColor: '#DC4C4C',
                        borderRadius: 10,
                      }}>
                      <View>
                        <Text
                          style={{
                            color: '#fff',
                            fontSize: 15,
                            alignSelf: 'center',
                            fontFamily: 'Poppins-SemiBold',
                          }}>
                          Ignore
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </>
              )}
              {!isPOSUser && paymentStatusMsg === 'PAYMENT RECEIVED' && (
                <>
                  <Text
                    style={{
                      fontSize: 12,
                      fontFamily: 'Poppins-Regular',
                      marginVertical: 10,
                      marginHorizontal: 10,
                    }}>
                    Payment received from the Bank, please accept the order.
                  </Text>

                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <TouchableOpacity
                      onPress={() => updateOrderStatus(orderId, 2)}
                      style={{
                        marginTop: 10,
                        width: 150,
                        height: 35,
                        paddingTop: '4%',
                        paddingBottom: '9%',
                        backgroundColor: '#337D3E',
                        borderRadius: 10,
                      }}>
                      <View>
                        <Text
                          style={{
                            color: '#fff',
                            fontSize: 15,
                            marginBottom: 15,
                            textAlign: 'center',
                            justifyContent: 'center',
                            alignItems: 'center',
                            fontFamily: 'Poppins-SemiBold',
                            marginLeft: 5,
                          }}>
                          Accept Order
                        </Text>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        navigation.navigate('Orders');
                        searchOrder(searchBy);
                        setIsModal(false);
                      }}
                      style={{
                        marginTop: 10,
                        width: 150,
                        height: 35,
                        paddingTop: '4%',
                        paddingBottom: '9%',
                        backgroundColor: '#DC4C4C',
                        borderRadius: 10,
                      }}>
                      <View>
                        <Text
                          style={{
                            color: '#fff',
                            fontSize: 15,
                            marginBottom: 15,
                            textAlign: 'center',
                            justifyContent: 'center',
                            alignItems: 'center',
                            fontFamily: 'Poppins-SemiBold',
                            marginLeft: 5,
                          }}>
                          Go to orders
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </View>
          </View>
        </Modal>

        <View style={styles.container}>
          <View
            style={{
              flexDirection: 'row',
              marginHorizontal: 5,
              marginVertical: 15,
            }}>
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => navigation.goBack()}>
              <Image
                style={{width: 28, height: 28, resizeMode: 'center'}}
                source={require('../../assets/back3x.png')}
              />
            </TouchableOpacity>
            <View style={{marginLeft: 5}}>
              <Text
                style={{
                  color: '#0F0F0F',
                  fontFamily: 'Poppins-Bold',
                  fontSize: 16,
                  marginTop: 2,
                }}>
                Payment Status
              </Text>
            </View>
          </View>
          <Divider />
          <View style={{flexDirection: 'row'}}>
            <Text
              style={{
                fontSize: 16,
                fontFamily: 'Poppins-Medium',
                marginVertical: 8,
                marginHorizontal: 10,
              }}>
              Search By :
            </Text>
            <TouchableOpacity
              onPress={() => selectType('Mobile')}
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Image
                style={{width: 18, height: 18, marginBottom: 3}}
                source={
                  searchBy === 'Mobile'
                    ? require('../../assets/check.png')
                    : require('../../assets/uncheckblack.png')
                }
              />
              <Text
                style={{
                  fontSize: 15,
                  fontFamily: 'Poppins-Medium',
                  marginVertical: 8,
                  marginHorizontal: 5,
                  color: searchBy === 'Mobile' ? 'green' : 'black',
                }}>
                Mobile Number
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => selectType('Order Id')}
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                marginLeft: 10,
              }}>
              <Image
                style={{width: 18, height: 18, marginBottom: 3}}
                source={
                  searchBy === 'Order Id'
                    ? require('../../assets/check.png')
                    : require('../../assets/uncheckblack.png')
                }
              />
              <Text
                style={{
                  fontSize: 15,
                  fontFamily: 'Poppins-Medium',
                  marginVertical: 8,
                  marginHorizontal: 5,
                  color: searchBy === 'Order Id' ? 'green' : 'black',
                }}>
                Order Id
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              borderWidth: 1,
              backgroundColor: '#fff',
              borderColor: '#337D3E',
              width: '95%',
              borderRadius: 5,
              flexDirection: 'row',
              height: 50,
              marginVertical: 10,
              marginHorizontal: 10,
            }}>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                // marginBottom: 5,
              }}>
              <TextInput
                autoFocus={true}
                style={{
                  flex: 1.8,
                  fontFamily: 'Poppins-Regular',
                  fontSize: 12,
                  width: 200,
                  paddingLeft: 20,
                  color: '#000',
                }}
                placeholder={
                  searchBy === 'Mobile'
                    ? 'Search by mobile number'
                    : 'Search by order id'
                }
                underlineColorAndroid="transparent"
                onChangeText={val => setSearchKey(val, searchBy)}
                value={searchKey}
                maxLength={10}
                placeholderTextColor={'#337D3E'}
                keyboardType="numeric"
              />
            </View>
            <View
              style={{
                marginLeft: 'auto',
                flexDirection: 'row',
                // marginRight: 15,
              }}>
              <TouchableOpacity
                style={{justifyContent: 'center', alignItems: 'center'}}
                onPress={() => {
                  setSearchKey();
                  setSearchData();
                }}>
                <Image
                  style={{
                    width: 20,
                    height: 20,
                    marginRight: 10,
                    // resizeMode: "center",
                    // marginBottom: 5,
                  }}
                  source={require('../../assets/close.png')}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: 'green',
                  width: 80,
                }}
                onPress={() => searchOrder(searchBy)}>
                <Text style={{fontFamily: 'Poppins-Regular', color: '#fff'}}>
                  Search
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          {isLoader && <ActivityIndicator size={'large'} color={'green'} />}
          {searchData && searchBy === 'Order Id' && (
            <View>
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: 'Poppins-Medium',
                  marginVertical: 8,
                  marginHorizontal: 10,
                }}>
                Showing Results
              </Text>
              <View
                style={{
                  borderWidth: 1,
                  borderRadius: 10,
                  backgroundColor: '#fff',
                  shadowColor: '#000',
                  shadowOffset: {width: 0, height: 2},
                  shadowOpacity: 0.2,
                  shadowRadius: 2,
                  elevation: 1,
                  padding: 10,
                  margin: 10,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <View style={{flexDirection: 'column'}}>
                    <Text
                      style={{
                        fontSize: 16,
                        fontFamily: 'Poppins-Medium',
                        marginVertical: 2,
                        marginHorizontal: 10,
                      }}>
                      Order ID{' '}
                    </Text>
                    <Text
                      style={{
                        fontSize: 16,
                        fontFamily: 'Poppins-Medium',
                        marginVertical: 2,
                        marginHorizontal: 10,
                      }}>
                      Current Status{' '}
                    </Text>
                    <Text
                      style={{
                        fontSize: 16,
                        fontFamily: 'Poppins-Medium',
                        marginVertical: 2,
                        marginHorizontal: 10,
                      }}>
                      Mobile{' '}
                    </Text>
                    <Text
                      style={{
                        fontSize: 16,
                        fontFamily: 'Poppins-Medium',
                        marginVertical: 2,
                        marginHorizontal: 10,
                      }}>
                      Amount{' '}
                    </Text>
                    <Text
                      style={{
                        fontSize: 16,
                        fontFamily: 'Poppins-Medium',
                        marginVertical: 2,
                        marginHorizontal: 10,
                      }}>
                      D O T{' '}
                    </Text>
                    <Text
                      style={{
                        fontSize: 16,
                        fontFamily: 'Poppins-Medium',
                        marginVertical: 2,
                        marginHorizontal: 10,
                      }}>
                      Action{' '}
                    </Text>
                  </View>
                  <View style={{flexDirection: 'column'}}>
                    <Text
                      style={{
                        fontSize: 16,
                        fontFamily: 'Poppins-Medium',
                        marginVertical: 2,
                      }}>
                      :
                    </Text>
                    <Text
                      style={{
                        fontSize: 16,
                        fontFamily: 'Poppins-Medium',
                        marginVertical: 2,
                      }}>
                      :
                    </Text>
                    <Text
                      style={{
                        fontSize: 16,
                        fontFamily: 'Poppins-Medium',
                        marginVertical: 2,
                      }}>
                      :
                    </Text>
                    <Text
                      style={{
                        fontSize: 16,
                        fontFamily: 'Poppins-Medium',
                        marginVertical: 2,
                      }}>
                      :
                    </Text>
                    <Text
                      style={{
                        fontSize: 16,
                        fontFamily: 'Poppins-Medium',
                        marginVertical: 2,
                      }}>
                      :
                    </Text>
                  </View>
                  <View style={{flexDirection: 'column'}}>
                    <Text
                      style={{
                        fontSize: 16,
                        fontFamily: 'Poppins-Medium',
                        marginVertical: 2,
                        marginHorizontal: 10,
                        color: 'green',
                      }}>
                      {searchData?.order_info?.order_id}
                    </Text>
                    <Text
                      style={{
                        fontSize: 16,
                        fontFamily: 'Poppins-Medium',
                        marginVertical: 2,
                        marginHorizontal: 10,
                        color: 'green',
                      }}>
                      {currentStatus}
                    </Text>
                    <Text
                      style={{
                        fontSize: 16,
                        fontFamily: 'Poppins-Medium',
                        marginVertical: 2,
                        marginHorizontal: 10,
                        color: 'green',
                      }}>
                      {searchData?.order_info?.telephone}
                    </Text>
                    <Text
                      style={{
                        fontSize: 16,
                        fontFamily: 'Poppins-Medium',
                        marginVertical: 2,
                        marginHorizontal: 10,
                        color: 'green',
                      }}>
                      {searchData?.order_info?.total}
                    </Text>
                    <Text
                      style={{
                        fontSize: 16,
                        fontFamily: 'Poppins-Medium',
                        marginVertical: 2,
                        marginHorizontal: 10,
                        color: 'green',
                      }}>
                      {moment(`${searchData?.order_info?.date_added}`)
                        .local()
                        .format('DD/MMM/YY hh:mm a')}
                    </Text>
                    <TouchableOpacity
                      style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: 'green',
                        width: '80%',
                        height: 40,
                        borderRadius: 10,
                      }}
                      onPress={() =>
                        checkStatus(
                          currentStatus,
                          searchData?.order_info.order_id,
                        )
                      }>
                      <Text
                        numberOfLines={1}
                        style={{fontFamily: 'Poppins-Regular', color: '#fff'}}>
                        {currentStatus === 'Pending'
                          ? 'Check Status'
                          : 'Order Details'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          )}

          {searchData && searchBy === 'Mobile' && (
            <View>
              {searchData?.length > 0 && (
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: 'Poppins-Medium',
                    marginVertical: 8,
                    marginHorizontal: 10,
                  }}>
                  Showing Results
                </Text>
              )}
              <FlatList
                data={searchData}
                renderItem={renderItem}
                marginBottom={213}
              />
            </View>
          )}
        </View>
      </>
    </View>
  );
};

export default PaymentStatusScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
    marginHorizontal: 5,
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 50,
    resizeMode: 'stretch',
  },
  heading: {
    color: '#2B2520',
    fontFamily: 'Lato-Bold',
    fontSize: 16,
    alignItems: 'center',
    textAlign: 'center',
  },

  number: {
    color: '#84694D',
    fontFamily: 'Lato-Regular',
    fontSize: 15,
    marginTop: 5,
  },
  btnText: {
    color: 'white',
    fontSize: 15,
    fontFamily: 'Lato-Bold',
    marginTop: 5,
  },
  body: {
    marginHorizontal: 10,
    marginVertical: 20,
  },
  card: {
    backgroundColor: '#fff',
    elevation: 1,
    padding: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  order: {
    color: '#2B2520',
    fontSize: 15,
    fontFamily: 'Lato-Bold',
    marginVertical: 10,
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
  },
  button: {
    marginHorizontal: 50,
    marginTop: 30,
    padding: 10,
    borderWidth: 1,
    borderColor: '#DDD6D1',
    borderRadius: 2,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#34A549',
  },
  logout: {
    color: '#A49A91',
    fontFamily: 'Lato-Bold',
    marginLeft: 10,
  },
  btn: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#34A549',
    marginRight: 30,
    marginLeft: 30,
    marginTop: 10,
    borderRadius: 5,
  },
  text: {
    fontSize: 18,
    textAlign: 'center',
  },
  instructions: {
    fontSize: 12,
    color: '#34A549',
    marginBottom: 5,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    textAlign: 'center',
  },
});
