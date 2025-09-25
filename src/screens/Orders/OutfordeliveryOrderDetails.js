import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  Platform,
  StyleSheet,
  StatusBar,
  Alert,
  Image,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Modal,
  Button,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Linking,
} from 'react-native';
import {useTheme} from '@react-navigation/native';
import OrderCard from '../../components/orderDetailCard';
import RBSheet from 'react-native-raw-bottom-sheet';
import DeveloperAPIClient from '../../state/middlewares/DeveloperAPIClient';
import {Searchbar, Divider} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Timeline from 'react-native-timeline-flatlist';
import moment from 'moment';
//import NetworkChecker from "react-native-network-checker";
import Toast from 'react-native-simple-toast';
import Config from 'react-native-config';
import CustomLoadingButton from '../../components/CustomLoadingButton';
import {hp, wp} from '../../utils/scale';

const OrdersScreen = ({navigation, route}) => {
  const {colors} = useTheme();
  const [ordersData, setOrdersData] = useState();
  const [waitersDetails, setWaitersDetails] = useState();
  const [refreshing, setRefreshing] = React.useState(true);
  const [ordercount, setIsordercount] = React.useState();
  const [OrderHistory, setOrderHistory] = React.useState();
  const [location, setlocation] = React.useState();
  const [prescriptionName, setprescriptionName] = React.useState();
  const [showDownload, setShowDownload] = React.useState(false);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [prescriptionImageUrl, setprescriptionImageUrl] = React.useState(false);
  const [deliveryDetails, setDeliveryDetails] = React.useState();
  const [price, setprice] = React.useState();
  const [customizedModal, setCustomizedModal] = React.useState(true);
  const [comments, setComments] = useState('');

  const theme = useTheme();
  const [data, setData] = React.useState({
    RBSheetLogout: {},
  });

  const [datas, setDataa] = React.useState({
    EDIT: {},
  });
  const rbSheetRef = useRef();
  const animatedButtonRef = useRef();

  const dialCall = number => {
    let phoneNumber = '';
    if (Platform.OS === 'android') {
      phoneNumber = `tel:${number}`;
    } else {
      phoneNumber = `telprompt:${number}`;
    }
    Linking.openURL(phoneNumber);
  };

  const whatsapp = number => {
    let phoneNumber = '';
    if (Platform.OS === 'android') {
      phoneNumber = `tel:${number}`;
    } else {
      phoneNumber = `telprompt:${number}`;
    }
    Linking.openURL(`whatsapp://send?text=&phone=${number}`);
  };

  const orderdetails = async () => {
    setRefreshing(true);
    const api = new DeveloperAPIClient();
    let orderId = route.params.ID;
    let orders = route.params.orders;
    let UserMobile = await AsyncStorage.getItem('MobileNumber');
    let allOrdersData = await api.getOrderDetails(UserMobile, orderId);
    let LOC = allOrdersData.data.orders.order_info.shipping_custom_field;
    //  JSON.parse(
    // );
    // console.log("LOC+", LOC);
    await previousordercount(
      allOrdersData.data.orders.order_info.customer_id || 0,
    );
    if (LOC != false) {
      const gps = LOC?.location?.split(',');
      setlocation(gps);
    }
    setOrderHistory(allOrdersData.data.orders.historiesdata);
    // console.log("allordersdetails######", JSON.stringify(allOrdersData.data));
    setOrdersData(allOrdersData.data);
    setWaitersDetails(allOrdersData.data.waiterDetails);
    for (let i = 0; i < allOrdersData.data.orders.totals.length; i++) {
      if (allOrdersData.data.orders.totals[i].title == 'Total') {
        setprice(allOrdersData.data.orders.totals[i].value);
      }
    }
    setRefreshing(false);
  };

  // ordersData.orders.order_info.telephone
  const [isReminderActive, setReminderActive] = useState(true);
  const [lastReminderSentAt, setLastReminderSentAt] = useState(null);

  const reminderButton = async () => {
    setRefreshing(true);
    const api = new DeveloperAPIClient();
    let UserMobile = await AsyncStorage.getItem('MobileNumber');
    let orderId = route.params.ID;
    let order_status_id = '15';
    let customerMobile = ordersData.orders.order_info.telephone;
    let reminderResponse = await api.sendReminderMessage(
      UserMobile,
      orderId,
      order_status_id,
      customerMobile,
    );
    console.log('reminder button', reminderResponse.data);
    if (reminderResponse.data.success === true) {
      Toast.showWithGravity('Reminder Message Sent.', Toast.LONG, Toast.BOTTOM);
    }
    setReminderActive(false);
    setLastReminderSentAt(Date.now());
    setRefreshing(false);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      if (
        lastReminderSentAt &&
        Date.now() - lastReminderSentAt >= 30 * 60 * 1000
      ) {
        setReminderActive(true);
      }
    }, 30 * 60 * 1000);
    return () => clearInterval(timer);
  }, [lastReminderSentAt]);

  const previousordercount = async customer_id => {
    // orderdetails();
    // setIsLoading(true)
    setRefreshing(true);
    // console.log("hiii")
    const api = new DeveloperAPIClient();
    let orderId = route.params.ID;
    let UserMobile = await AsyncStorage.getItem('MobileNumber');
    // let allOrdersData = await api.getOrderDetails(UserMobile, orderId);

    // let customer_id = allOrdersData.data.orders.order_info.customer_id;
    //console.log("customerID------>", customer_id);
    let ordercount = await api.getordercount(UserMobile, customer_id);
    // setIsLoading(false)
    setRefreshing(false);
    // console.log(
    //   "previousordercount-----------------",
    //   JSON.stringify(ordercount.data)
    // );
    setIsordercount(ordercount.data.count);
  };

  const loadOrdersByOrderId = async () => {
    const api = new DeveloperAPIClient();
    let Token = await AsyncStorage.getItem('token');
    let UserMobile = await AsyncStorage.getItem('MobileNumber');
    let response = await api.getOrderDetailsByOrderId(
      route.params.ID,
      Token,
      UserMobile,
    );
    console.log('data=========', JSON.stringify(response.data));
    if (
      response.data != null ||
      response.data != undefined ||
      response.data != ''
    ) {
      setDeliveryDetails(response.data);
    }
  };

  useEffect(() => {
    loadOrdersByOrderId();
    orderdetails();
  }, []);

  const openwhatsapp = () => {
    if (
      !ordersData?.orders ||
      !ordersData.orders.products ||
      !ordersData.orders.order_info ||
      !location ||
      location.length < 2
    ) {
      Alert.alert(
        'Missing data',
        'Order or location details are not available yet.',
      );
      return;
    }

    // collect product names
    const productName = ordersData.orders.products
      .map((p: any) => p?.name)
      .filter(Boolean)
      .join('\r\n');

    // construct message
    const whatsappText =
      `OrderId: ${ordersData.orders.order_info.order_id}` +
      `\r\nLocation: https://www.google.com/maps/place/${location[0]},${location[1]}` +
      `\r\nCustomer Name: ${ordersData.orders.order_info.firstname}` +
      `\r\nCustomer Mobile: ${ordersData.orders.order_info.telephone}` +
      `\r\nOrder Total: ${price ?? 'N/A'}` +
      `\r\nDate Added: ${moment
        .utc(ordersData.orders.order_info.date_added)
        .local()
        .format('DD-MMM-YYYY, hh:mm')}` +
      `\r\nProducts:\r\n${productName}` +
      `\r\nPayment Mode: ${ordersData.orders.order_info.payment_method}`;

    const url = `whatsapp://send?text=${encodeURIComponent(whatsappText)}`;

    Linking.openURL(url).catch(() => {
      Alert.alert('Error', 'WhatsApp is not installed or cannot be opened.');
    });
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
    // console.log('statusdata---mine--->', statusdata);
    let merchantInfo = await api.getMerchantInfo(UserMobile, Token);
    if (statusdata?.code == 500) {
      Toast.showWithGravity(statusdata.message, Toast.LONG, Toast.BOTTOM);
    }
    setRefreshing(true);
    if (merchantInfo.data.default_order_status_id) {
      await AsyncStorage.setItem(
        'order_status_id',
        merchantInfo.data.default_order_status_id.toString(),
      );
    } else {
      await AsyncStorage.setItem('order_status_id', '15');
    }

    if (statusdata.data != undefined) {
      Toast.showWithGravity(
        'Order delivered successfully',
        Toast.LONG,
        Toast.BOTTOM,
      );
    }
    setRefreshing(false);
    rbSheetRef.current.close();
  };
  return (
    <View style={styles.container}>
      <>
        <StatusBar
          backgroundColor="#F4F5F7"
          barStyle={theme.dark ? 'light-content' : 'dark-content'}
        />

        <View style={styles.header}>
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => navigation.goBack()}>
            <Image
              style={{width: 28, height: 28, resizeMode: 'center'}}
              source={require('../../assets/back3x.png')}
            />
          </TouchableOpacity>

          {ordersData && (
            <View style={{marginLeft: 1, flexDirection: 'row'}}>
              <Text style={styles.headerTitle}>Order Details </Text>

              <Text
                style={{
                  color: '#2B2520',
                  fontFamily: 'Poppins-Medium',
                  fontSize: 20,
                }}>
                {' '}
                #{ordersData.orders.order_info.order_id}
              </Text>
              <TouchableOpacity
                style={{marginLeft: '26%'}}
                onPress={() => openwhatsapp()}>
                <Image
                  style={{
                    width: 20,
                    height: 20,
                    resizeMode: 'center',
                    // marginLeft: "28%",
                  }}
                  source={require('../../assets/share2x.png')}
                />
              </TouchableOpacity>
            </View>
          )}
        </View>
        {refreshing && <ActivityIndicator size="large" color="#51AF5E" />}
        <ScrollView>
          <View style={{marginVertical: 10}}>
            {ordersData && (
              <View>
                <View style={styles.container}>
                  <View
                    style={{
                      marginHorizontal: 10,
                      backgroundColor: '#2F6E8F',
                      elevation: 2,
                      padding: 10,
                      borderRadius: 5,
                      marginVertical: 5,
                    }}>
                    <View>
                      <View
                        style={{
                          justifyContent: 'center',
                          alignItems: 'center',
                          marginBottom: 5,
                        }}>
                        <Text
                          style={{
                            fontSize: 16,
                            color: '#FFFFFF',
                            marginBottom: 5,
                            fontFamily: 'Poppins-Bold',
                          }}>
                          Order Dispatched{' '}
                          {/* {ordersData.orders.order_info.comment &&
                            `(${ordersData.orders.order_info.comment.toUpperCase()})`} */}
                        </Text>
                      </View>
                      <View style={{flexDirection: 'row'}}>
                        <Text
                          style={{
                            fontSize: 15,
                            color: '#FFFFFF',
                            marginBottom: 5,
                            flex: 1,
                            textAlign: 'left',
                            fontFamily: 'Poppins-Regular',
                          }}>
                          Order Id : {ordersData.orders.order_info.order_id}
                        </Text>
                        <Text
                          style={{
                            fontSize: 12,
                            color: '#FFFFFF',
                            flex: 1,
                            textAlign: 'right',
                            fontFamily: 'Poppins-Regular',
                          }}>
                          {Config.ENV === 'production'
                            ? moment
                                .utc(ordersData.orders.order_info.date_added)
                                .local()
                                .format('DD-MMM-YYYY, hh:mm A')
                            : moment(
                                ordersData.orders.order_info.date_added,
                              ).format('DD-MMM-YYYY, hh:mm A')}
                        </Text>
                      </View>

                      <View style={{flexDirection: 'row', marginTop: 3}}>
                        <Text
                          style={{
                            fontSize: 15,
                            color: '#FFFFFF',
                            marginBottom: 5,
                            flex: 1,
                            textAlign: 'left',
                            fontFamily: 'Poppins-Regular',
                          }}>
                          {ordersData.orders.order_info.payment_method}
                        </Text>
                        <Text
                          style={{
                            fontSize: 15,
                            color: '#FFFFFF',
                            flex: 1,
                            textAlign: 'right',
                            fontFamily: 'Poppins-Regular',
                          }}>
                          Total Items • {ordersData.orders.products.length}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>

                <View
                  style={{
                    marginHorizontal: 10,
                    backgroundColor: '#fff',
                    elevation: 2,
                    padding: 10,
                    borderRadius: 5,
                    marginVertical: 5,
                  }}>
                  <View style={{margin: 5}} />
                  {ordersData?.orders?.products &&
                    ordersData?.orders?.products?.map((val, i) => {
                      if (
                        val?.option?.length > 0 &&
                        val?.option[0] != undefined &&
                        val?.option[0]?.type == 'file' &&
                        !showDownload
                      ) {
                        setShowDownload(true);
                        setprescriptionImageUrl(val.option[0].value);
                        setprescriptionName(val.option[0].name);
                      }
                      // console.log("name###",ordersData)
                      return (
                        <View style={{flexDirection: 'row'}}>
                          <View style={{flexDirection: 'column'}}>
                            <Text
                              style={{
                                fontSize: 13,
                                color: '#21272E',
                                marginBottom: 5,
                                fontFamily: 'Poppins-Medium',
                                width: 220,
                              }}>
                              {val?.option?.length > 0 ? (
                                <Text
                                  onPress={() =>
                                    setCustomizedModal(!customizedModal)
                                  }
                                  style={{
                                    fontSize: 16,
                                    color: 'green',
                                    marginBottom: 5,
                                    flex: 1,
                                    textAlign: 'left',
                                    fontFamily: 'Poppins-Bold',
                                    textDecorationColor: 'green',
                                    textDecorationLine: 'underline',
                                  }}>
                                  {val.name} ...
                                </Text>
                              ) : (
                                `${val.name}`
                              )}
                            </Text>
                            {customizedModal && (
                              <>
                                {val &&
                                  val?.option?.map(
                                    (optionValue, optionIndex) => {
                                      return (
                                        <>
                                          {val?.option?.length > 0 && (
                                            <View
                                              style={{flexDirection: 'row'}}>
                                              <Text
                                                style={{
                                                  color: 'green',
                                                  fontSize: 12,
                                                  fontFamily: 'Poppins-Medium',
                                                }}>
                                                {optionValue.value}
                                              </Text>
                                              {/* <View style={{justifyContent:'flex-end',alignContent:'flex-end'}}> */}
                                              <Text
                                                style={{
                                                  color: 'green',
                                                  fontSize: 12,
                                                  fontFamily: 'Poppins-Medium',
                                                  marginLeft: 10,
                                                }}>
                                                ( ₹ {optionValue.price || ''} )
                                              </Text>
                                              {/* </View> */}
                                            </View>
                                          )}
                                        </>
                                      );
                                    },
                                  )}
                              </>
                            )}
                          </View>
                          <Text
                            style={{
                              fontSize: 14,
                              color: '#21272E',
                              fontFamily: 'Poppins-Medium',
                              marginLeft: 'auto',
                            }}>
                            {val.quantity || 0} x {val.price || 0}
                          </Text>
                        </View>
                      );
                    })}

                  <View style={{marginBottom: 5}} />
                  <Divider />
                  <TouchableOpacity onPress={() => setModalVisible(true)}>
                    {showDownload && (
                      <Text
                        style={{
                          fontSize: 15,
                          color: '#4933FF',
                          marginBottom: 5,
                          fontFamily: 'Poppins-Regular',
                          flex: 1,
                          textAlign: 'left',
                        }}>
                        {`View ${prescriptionName}`}
                      </Text>
                    )}
                  </TouchableOpacity>

                  {ordersData?.orders?.totalsdata &&
                    ordersData?.orders?.totalsdata?.map((item, i) => {
                      return (
                        <View style={{flexDirection: 'row', marginTop: 5}}>
                          <Text
                            style={{
                              fontSize: 15,
                              color: '#21272E',
                              marginBottom: 5,
                              fontFamily: 'Poppins-Medium',
                              flex: 1,
                              textAlign: 'left',
                            }}>
                            {item.title || ''}
                          </Text>
                          <Text
                            style={{
                              fontSize: 14,
                              color: '#21272E',
                              fontFamily: 'Poppins-Medium',
                              flex: 1,
                              textAlign: 'right',
                            }}>
                            {item.text || ''}
                          </Text>
                        </View>
                      );
                    })}
                </View>

                <View
                  style={{
                    marginHorizontal: 10,
                    backgroundColor: '#fff',
                    elevation: 2,
                    padding: 10,
                    borderRadius: 5,
                    marginVertical: 5,
                  }}>
                  <View style={{flexDirection: 'row'}}>
                    <Text
                      style={{
                        marginLeft: 10,
                        fontSize: 15,
                        color: '#9BA0A7',
                        marginBottom: 5,
                        fontFamily: 'Poppins-Medium',
                      }}>
                      Customer Name :
                    </Text>
                    <Text
                      style={{
                        marginLeft: 10,
                        fontSize: 15,
                        color: '#21272E',
                        marginTop: 3,
                        fontFamily: 'Poppins-Medium',
                        flexGrow: 0,
                        flexShrink: 1,
                        flexBasis: 'auto',
                      }}>
                      {ordersData.orders.order_info.firstname || ''}
                    </Text>
                  </View>
                  <View style={{flexDirection: 'row'}}>
                    <Text
                      style={{
                        marginLeft: 10,
                        fontSize: 15,
                        color: '#9BA0A7',
                        marginBottom: 5,
                        fontFamily: 'Poppins-Medium',
                      }}>
                      Mobile Number :
                    </Text>
                    <TouchableOpacity
                      onPress={() =>
                        dialCall(
                          `+${ordersData.orders.order_info.telephone || ''}`,
                        )
                      }>
                      <Text
                        style={{
                          marginLeft: 10,
                          fontSize: 15,
                          color: '#21272E',
                          marginTop: 3,
                          fontFamily: 'Poppins-Medium',
                        }}>
                        +{ordersData.orders.order_info.telephone || ''}
                      </Text>
                    </TouchableOpacity>
                    <View style={{marginTop: 4.5, marginLeft: 5}}>
                      <Image
                        style={{height: 15, width: 15}}
                        source={require('../../assets/phone.png')}
                      />
                    </View>
                    <TouchableOpacity
                      onPress={() =>
                        whatsapp(
                          `+${ordersData.orders.order_info.telephone || ''}`,
                        )
                      }
                      style={{
                        flex: 1,
                        alignItems: 'flex-end',
                        marginTop: 4.5,
                      }}>
                      <Image
                        style={{height: 20, width: 20}}
                        source={require('../../assets/whatsapp.png')}
                      />
                    </TouchableOpacity>
                  </View>
                  <View style={{flexDirection: 'row'}}>
                    <Text
                      style={{
                        marginLeft: 10,
                        fontSize: 15,
                        color: '#9BA0A7',
                        marginBottom: 5,
                        fontFamily: 'Poppins-Medium',
                      }}>
                      Previous Orders :
                    </Text>
                    <Text
                      style={{
                        marginLeft: 10,
                        fontSize: 15,
                        color: '#21272E',
                        marginTop: 3,
                        fontFamily: 'Poppins-Medium',
                      }}>
                      {ordercount || 0}
                    </Text>
                  </View>
                  {/* <View style={{ flexDirection: "row" }}>
                    <Text
                      style={{
                        marginLeft: 10,
                        fontSize: 15,
                        color: "#9BA0A7",
                        marginBottom: 5,
                        fontFamily: "Poppins-Medium",
                      }}
                    >
                      Address :
                    </Text>
                    <View style={{ marginTop: 3, marginLeft: 3 }}>
                      <Image
                        style={{ height: 15, width: 15, resizeMode: "center" }}
                        source={require("../../assets/loc3x.png")}
                      />
                    </View>
                    <TouchableOpacity
                      onPress={() =>
                        Linking.openURL(
                          `google.navigation:q=${location[0]}+${location[1]}`
                        )
                      }
                    >
                      <Text
                        style={{
                          marginLeft: 3,
                          fontSize: 15,
                          color: "#21272E",
                          fontFamily: "Poppins-Medium",
                          width: 180,
                        }}
                      >
                        {ordersData.orders.order_info.shipping_address_1},
                        {ordersData.orders.order_info.shipping_city},
                        {ordersData.orders.order_info.shipping_zone}
                      </Text>
                    </TouchableOpacity>
                  </View> */}
                  <View style={{flexDirection: 'row'}}>
                    <Text
                      style={{
                        marginLeft: 10,
                        fontSize: 15,
                        color: '#9BA0A7',
                        marginBottom: 5,
                        fontFamily: 'Poppins-Medium',
                        marginTop: 2,
                      }}>
                      Comments :
                    </Text>
                    <Text
                      style={{
                        marginLeft: 10,
                        fontSize: 15,
                        color: '#21272E',
                        marginTop: 3,
                        fontFamily: 'Poppins-Medium',
                        width: 190,
                      }}>
                      {ordersData.orders.order_info.comment || ''}
                    </Text>
                  </View>

                  {waitersDetails && (
                    <>
                      <View style={{flexDirection: 'row'}}>
                        <Text
                          style={{
                            marginLeft: 10,
                            fontSize: 15,
                            color: '#9BA0A7',
                            marginBottom: 5,
                            fontFamily: 'Poppins-Medium',
                          }}>
                          Waiter Name :
                        </Text>
                        <Text
                          style={{
                            marginLeft: 10,
                            fontSize: 15,
                            color: '#21272E',
                            marginTop: 3,
                            fontFamily: 'Poppins-Medium',
                            flexGrow: 0,
                            flexShrink: 1,
                            flexBasis: 'auto',
                          }}>
                          {waitersDetails.waiterName || ''}
                        </Text>
                      </View>
                      <View style={{flexDirection: 'row'}}>
                        <Text
                          style={{
                            marginLeft: 10,
                            fontSize: 15,
                            color: '#9BA0A7',
                            marginBottom: 5,
                            fontFamily: 'Poppins-Medium',
                          }}>
                          Waiter Nnumber :
                        </Text>
                        <Text
                          style={{
                            marginLeft: 10,
                            fontSize: 15,
                            color: '#21272E',
                            marginTop: 3,
                            fontFamily: 'Poppins-Medium',
                            flexGrow: 0,
                            flexShrink: 1,
                            flexBasis: 'auto',
                          }}>
                          {waitersDetails.waiterMobileNumber || ''}
                        </Text>
                      </View>
                    </>
                  )}
                </View>

                <View
                  style={{
                    marginHorizontal: 10,
                    backgroundColor: '#fff',
                    elevation: 2,
                    padding: 10,
                    borderRadius: 5,
                    marginVertical: 5,
                  }}>
                  <View style={{flexDirection: 'row'}}>
                    <Text
                      style={{
                        marginLeft: 10,
                        fontSize: 15,
                        color: '#9BA0A7',
                        marginBottom: 5,
                        fontFamily: 'Poppins-Medium',
                      }}>
                      Customer Address :
                    </Text>
                    <Text
                      style={{
                        marginLeft: 10,
                        fontSize: 15,
                        color: '#21272E',
                        marginTop: 3,
                        fontFamily: 'Poppins-Medium',
                        flexGrow: 0,
                        flexShrink: 1,
                        flexBasis: 'auto',
                      }}>
                      {route.params.item.shipping_address || ''}
                    </Text>
                  </View>
                </View>
                {deliveryDetails && (
                  <View
                    style={{
                      marginHorizontal: 10,
                      backgroundColor: '#FFF',
                      elevation: 2,
                      padding: 10,
                      borderRadius: 5,
                      marginVertical: 5,
                    }}>
                    <View style={{marginBottom: 5}}>
                      <Text
                        style={{
                          fontSize: 18,
                          color: 'black',
                          marginBottom: 5,
                          textAlign: 'center',
                          fontFamily: 'Poppins-Medium',
                        }}>
                        DELIVERY DETAILS :
                      </Text>
                    </View>
                    <View style={{flexDirection: 'row'}}>
                      <View style={{flexDirection: 'column'}}>
                        <Text
                          style={{
                            marginLeft: 10,
                            fontSize: 15,
                            color: '#9BA0A7',
                            marginBottom: 5,
                            fontFamily: 'Poppins-Medium',
                          }}>
                          Delivery Provider
                        </Text>
                        <Text
                          style={{
                            marginLeft: 10,
                            fontSize: 15,
                            color: '#9BA0A7',
                            marginBottom: 5,
                            fontFamily: 'Poppins-Medium',
                          }}>
                          Driver Name
                        </Text>
                        <Text
                          style={{
                            marginLeft: 10,
                            fontSize: 15,
                            color: '#9BA0A7',
                            marginBottom: 5,
                            fontFamily: 'Poppins-Medium',
                          }}>
                          Mobile Number
                        </Text>
                        <Text
                          style={{
                            marginLeft: 10,
                            fontSize: 15,
                            color: '#9BA0A7',
                            marginBottom: 5,
                            fontFamily: 'Poppins-Medium',
                          }}>
                          Vehicle Number
                        </Text>
                        <Text
                          style={{
                            marginLeft: 10,
                            fontSize: 15,
                            color: '#9BA0A7',
                            marginBottom: 5,
                            fontFamily: 'Poppins-Medium',
                          }}>
                          Ref No (CRN)
                        </Text>
                      </View>
                      <View style={{flexDirection: 'column'}}>
                        <Text
                          style={{
                            marginLeft: 10,
                            fontSize: 15,
                            color: '#9BA0A7',
                            marginBottom: 5,
                            fontFamily: 'Poppins-Medium',
                          }}>
                          :
                        </Text>
                        <Text
                          style={{
                            marginLeft: 10,
                            fontSize: 15,
                            color: '#9BA0A7',
                            marginBottom: 5,
                            fontFamily: 'Poppins-Medium',
                          }}>
                          :
                        </Text>
                        <Text
                          style={{
                            marginLeft: 10,
                            fontSize: 15,
                            color: '#9BA0A7',
                            marginBottom: 5,
                            fontFamily: 'Poppins-Medium',
                          }}>
                          :
                        </Text>
                        <Text
                          style={{
                            marginLeft: 10,
                            fontSize: 15,
                            color: '#9BA0A7',
                            marginBottom: 5,
                            fontFamily: 'Poppins-Medium',
                          }}>
                          :
                        </Text>
                        <Text
                          style={{
                            marginLeft: 10,
                            fontSize: 15,
                            color: '#9BA0A7',
                            marginBottom: 5,
                            fontFamily: 'Poppins-Medium',
                          }}>
                          :
                        </Text>
                      </View>
                      <View style={{flexDirection: 'column'}}>
                        <Text
                          style={{
                            marginLeft: 10,
                            fontSize: 12,
                            color: 'black',
                            marginBottom: 5,
                            fontFamily: 'Poppins-Bold',
                            marginTop: 3,
                          }}>
                          {deliveryDetails
                            ? deliveryDetails.provider.toUpperCase()
                            : ''}
                        </Text>
                        <Text
                          style={{
                            marginLeft: 10,
                            fontSize: 12,
                            color: 'black',
                            marginBottom: 5,
                            fontFamily: 'Poppins-Medium',
                            marginTop: 4,
                          }}>
                          {deliveryDetails?.rider_details?.driver_name
                            ? deliveryDetails.rider_details.driver_name
                            : 'Yet to assign'}
                        </Text>
                        <TouchableOpacity
                          onPress={() =>
                            dialCall(`+${deliveryDetails.rider_details.mobile}`)
                          }>
                          <Text
                            style={{
                              marginLeft: 10,
                              fontSize: 12,
                              color: 'black',
                              marginBottom: 5,
                              fontFamily: 'Poppins-Medium',
                              marginTop: 5,
                            }}>
                            {deliveryDetails?.rider_details.mobile
                              ? deliveryDetails.rider_details.mobile
                              : 'Yet to assign'}{' '}
                          </Text>
                        </TouchableOpacity>
                        <Text
                          style={{
                            marginLeft: 10,
                            fontSize: 12,
                            color: 'black',
                            marginBottom: 5,
                            fontFamily: 'Poppins-Medium',
                            marginTop: 5,
                          }}>
                          {deliveryDetails?.rider_details?.vehicle_number
                            ? deliveryDetails.rider_details.vehicle_number
                            : 'Yet to assign'}
                        </Text>
                        <Text
                          numberOfLines={2}
                          style={{
                            marginLeft: 10,
                            fontSize: 12,
                            color: 'black',
                            marginBottom: 5,
                            fontFamily: 'Poppins-Medium',
                            marginTop: 4,
                            width: '70%',
                          }}>
                          {deliveryDetails
                            ? deliveryDetails.merchant_order_id
                            : ''}
                        </Text>
                      </View>
                    </View>
                  </View>
                )}

                <View
                  style={{
                    marginHorizontal: 10,
                    backgroundColor: '#FFF',
                    elevation: 2,
                    padding: 10,
                    borderRadius: 5,
                    marginVertical: 5,
                  }}>
                  <View style={{marginBottom: 5}}>
                    <Text
                      style={{
                        fontSize: 18,
                        color: 'black',
                        marginBottom: 5,
                        textAlign: 'center',
                        fontFamily: 'Poppins-Medium',
                      }}>
                      Order Status :
                    </Text>
                  </View>
                  {OrderHistory &&
                    OrderHistory.map((val, i) => {
                      if (i == OrderHistory.length - 1) {
                        val.lineColor = '#FFFFFF';
                      } else {
                        val.lineColor = '#34A549';
                      }
                      let DATA = [
                        {
                          time: val.date_added,
                          title: val.status,
                          description: val.comment,
                          lineColor: val.lineColor,
                        },
                      ];
                      // console.log("name###",ordersData)
                      return (
                        <Timeline
                          style={styles.list}
                          data={DATA}
                          circleSize={18}
                          circleColor="#34A549"
                          lineColor="rgb(45,156,219)"
                          numberOfLines={1}
                          lineWidth={2}
                          separator={true}
                          renderFullLine={true}
                          isUsingFlatlist={true}
                          timeContainerStyle={{minWidth: 52, marginTop: -5}}
                          timeStyle={{
                            textAlign: 'center',
                            backgroundColor: 'white',
                            color: 'black',
                            padding: 5,
                            borderRadius: 13,
                          }}
                          descriptionStyle={{color: 'gray'}}
                          titleStyle={{
                            minWidth: 52,
                            marginTop: -10,
                            color: 'black',
                          }}
                          innerCircle={'dot'}
                        />
                      );
                    })}
                </View>
                <View>
                  <TouchableOpacity
                    style={[
                      styles.SubmitButtonStyles,
                      {backgroundColor: isReminderActive ? '#51AF5E' : 'gray'},
                    ]}
                    onPress={() => reminderButton()}
                    disabled={!isReminderActive}>
                    <Text
                      style={{
                        color: '#fff',
                        textAlign: 'center',
                        justifyContent: 'center',
                        alignItems: 'center',
                        fontSize: 16,
                        fontFamily: 'Poppins-Bold',
                      }}>
                      {' '}
                      Send Reminder{' '}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.SubmitButtonStyles}
                    onPress={() => rbSheetRef?.current?.open()}>
                    <Text
                      style={{
                        color: '#0F0F0F',
                        textAlign: 'center',
                        justifyContent: 'center',
                        alignItems: 'center',
                        fontSize: 16,
                        fontFamily: 'Poppins-Bold',
                        elevation: 2,
                      }}>
                      Mark As Delivered{' '}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              // <OrderCard
              //   onPress={() => navigation.navigate("OrderDetails")}
              //   ID={ordersData.orders.order_info.order_id}
              //   price="₹ 225.00"
              //   time="Today, 11:31 AM"
              //   orderType={ordersData.orders.order_info.payment_method}
              //   total={ordersData.orders.products.length}
              //   products={ordersData.orders.products}
              //   itemtotal="Item Total"
              //   cost4={ordersData.orders.totals[0].value}
              //   cost5={ordersData.orders.totals[1].value}
              //   cost6={ordersData.orders.totals[2].value}
              //   dc="Delivery Charges"
              //   ot="Order Total"
              //   custitle="Customer Name"
              //   cusname={ordersData.orders.order_info.firstname}
              //   mobtitle="Mobile Number"
              //   mobile={ordersData.orders.order_info.telephone}
              //   mailtitle="Email Address"
              //   mailid={ordersData.orders.order_info.email}
              //   addtitle="Address"
              //   add={ordersData.orders.order_info.shipping_address_1}
              // />
            )}

            {/* <View style={{ flexDirection: "column" }}>
            <TouchableOpacity
              style={styles.SubmitButtonStyle}
              onPress={() => updatestatusorder()}
            >
              <Text
                style={{
                  color: "#fff",
                  textAlign: "center",
                  justifyContent: "center",
                  alignItems: "center",
                  fontSize: 16,
                }}
              >
                {" "}
                Confirm{" "}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.SubmitButtonStyles}>
              <Text
                style={{
                  color: "#0F0F0F",
                  textAlign: "center",
                  justifyContent: "center",
                  alignItems: "center",
                  fontSize: 16,
                }}
              >
                Cancel Order
              </Text>
            </TouchableOpacity>
          </View> */}

            <RBSheet
              ref={ref => {
                data.RBSheetLogout = ref;
              }}
              height={335}
              openDuration={250}
              customStyles={{
                container: {
                  justifyContent: 'center',
                  borderTopRightRadius: 30,
                  borderTopLeftRadius: 30,
                },
              }}>
              <Image
                style={{
                  width: 156,
                  height: 137,
                  alignSelf: 'center',
                  resizeMode: 'stretch',
                }}
                source={require('../../assets/sucess3x.png')}
              />
              <View>
                <Text
                  style={{
                    color: '#34A549',
                    fontSize: 20,
                    marginVertical: 10,
                    textAlign: 'center',
                    marginTop: 8,
                  }}>
                  Accepted • Order Processing
                </Text>
                <Text
                  style={{
                    color: '#11151A',
                    fontSize: 14,

                    textAlign: 'center',
                  }}>
                  Lorem ipsum dolor sit amet,consetetur{'\n'} sadipscing elitr,
                  sed diam nonumy
                </Text>

                <TouchableOpacity
                  style={{
                    width: '90%',
                    height: 45,
                    paddingTop: 12,
                    paddingBottom: 15,
                    backgroundColor: '#51AF5E',
                    borderRadius: 10,
                    borderWidth: 1,
                    borderColor: '#fff',
                    marginTop: 30,
                    marginLeft: 18,
                  }}
                  onPress={() => navigation.navigate('OrderSummury')}>
                  <Text
                    style={{
                      color: '#FFFFFF',
                      textAlign: 'center',
                      justifyContent: 'center',
                      alignItems: 'center',
                      fontSize: 16,
                    }}>
                    Continue
                  </Text>
                </TouchableOpacity>
              </View>
            </RBSheet>

            <RBSheet
              ref={ref => {
                datas.EDIT = ref;
              }}
              height={400}
              openDuration={250}
              customStyles={{
                container: {
                  justifyContent: 'center',
                  borderTopRightRadius: 30,
                  borderTopLeftRadius: 30,
                },
              }}>
              <TouchableOpacity
                // onPress={() => {
                //   setModalVisible(!modalVisible);
                // }}
                style={{margin: 5, alignSelf: 'flex-end'}}>
                <Image style={{width: 20, height: 20}} />
                <View>
                  <Image
                    style={{
                      width: 14,
                      height: 13.63,
                      marginLeft: 500,
                      marginHorizontal: 40,
                    }}
                    source={require('../../assets/close2x.png')}
                  />
                </View>
              </TouchableOpacity>
              <View>
                <Text
                  style={{
                    color: '#11151A',
                    fontSize: 20,
                    textAlign: 'center',
                  }}>
                  Edit Order
                </Text>
                <Text
                  style={{
                    color: '#11151A',
                    fontSize: 12,
                    textAlign: 'center',
                  }}>
                  Lorem ipsum dolor sit amet
                </Text>

                <View style={{flexDirection: 'row'}}>
                  <Text
                    style={[
                      styles.text,
                      {
                        fontFamily: 'Lato-Regular',
                        color: '#11151A',
                        fontSize: 13,
                        marginVertical: 5,
                        marginLeft: 24,
                      },
                    ]}>
                    1. Chocochip Cupcake
                  </Text>
                  <Image
                    style={{
                      width: 30,
                      height: 30,
                      marginLeft: 50,
                    }}
                    source={require('../../assets/exchange2x.png')}
                  />
                  <Image
                    style={{
                      width: 30,
                      height: 30,
                      marginLeft: 10,
                    }}
                    source={require('../../assets/trash2x.png')}
                  />
                  <Image
                    style={{
                      width: 70,
                      height: 30,
                      marginLeft: 8,
                    }}
                    source={require('../../assets/add2x.png')}
                  />
                </View>

                <Text
                  style={{
                    color: '#E26251',
                    fontSize: 10,
                    marginLeft: 24,
                  }}>
                  Out of Stock
                </Text>

                <View style={{flexDirection: 'row'}}>
                  <Text
                    style={{
                      color: '#11151A',
                      fontSize: 14,
                      marginHorizontal: 24,
                    }}>
                    2. Red Velvet Cupcake
                  </Text>
                  <Image
                    style={{
                      width: 30,
                      height: 30,
                      marginLeft: 16,
                    }}
                    source={require('../../assets/exchange2x.png')}
                  />
                  <Image
                    style={{
                      width: 30,
                      height: 30,
                      marginLeft: 10,
                    }}
                    source={require('../../assets/trash2x.png')}
                  />
                  <Image
                    style={{
                      width: 70,
                      height: 30,
                      marginLeft: 10,
                    }}
                    source={require('../../assets/add2x.png')}
                  />
                </View>

                <View style={{flexDirection: 'row'}}>
                  <Text
                    style={{
                      color: '#0F0F0F',
                      fontSize: 14,
                      marginVertical: 20,
                      marginLeft: 24,
                    }}>
                    3. Creamy Cupcake
                  </Text>
                  <Image
                    style={{
                      width: 30,
                      height: 30,
                      marginTop: 15,
                      marginLeft: 59,
                    }}
                    source={require('../../assets/exchange2x.png')}
                  />
                  <Image
                    style={{
                      width: 30,
                      height: 30,
                      marginTop: 15,
                      marginLeft: 9,
                    }}
                    source={require('../../assets/trash2x.png')}
                  />
                  <Image
                    style={{
                      width: 70,
                      height: 30,
                      marginTop: 15,
                      marginLeft: 8,
                    }}
                    source={require('../../assets/add2x.png')}
                  />
                </View>

                <View style={{flexDirection: 'row'}}>
                  <Text
                    style={{
                      color: '#0F0F0F',
                      fontSize: 14,
                      marginVertical: 10,
                      marginLeft: 24,
                    }}>
                    4. Chocochip Cupcake
                  </Text>
                  <Image
                    style={{
                      width: 30,
                      height: 30,
                      marginTop: 7,
                      marginLeft: 40,
                    }}
                    source={require('../../assets/exchange2x.png')}
                  />
                  <Image
                    style={{
                      width: 30,
                      height: 30,
                      marginTop: 7,
                      marginLeft: 10,
                    }}
                    source={require('../../assets/trash2x.png')}
                  />
                  <Image
                    style={{
                      width: 70,
                      height: 30,
                      marginTop: 5,
                      marginLeft: 10,
                    }}
                    source={require('../../assets/add2x.png')}
                  />
                </View>

                <TouchableOpacity
                  activeOpacity={0.6}
                  style={styles.btn}
                  // onPress={() => {
                  //   signOut();
                  // }}
                >
                  <Text style={[styles.text, {color: 'white'}]}>Done</Text>
                </TouchableOpacity>
              </View>
            </RBSheet>
            <RBSheet
              ref={rbSheetRef}
              height={400}
              openDuration={250}
              customStyles={{
                container: {
                  justifyContent: 'center',
                  borderTopRightRadius: 30,
                  borderTopLeftRadius: 30,
                },
              }}>
              <Image
                style={{
                  width: 100,
                  height: 100,
                  alignSelf: 'center',
                  resizeMode: 'stretch',
                }}
                source={require('../../assets/sucess3x.png')}
              />
              <View>
                <Text
                  style={{
                    color: '#34A549',
                    fontSize: 20,
                    marginVertical: 10,
                    textAlign: 'center',
                    marginTop: 8,
                  }}>
                  Complete Delivery
                </Text>
                <Text
                  style={{
                    color: '#11151A',
                    fontSize: 14,

                    textAlign: 'center',
                  }}>
                  Happy Customer Good For Business
                </Text>

                <View style={{marginHorizontal: 4, marginVertical: 10}}>
                  <TextInput
                    multiline={true}
                    placeholder="Write a message to the customer"
                    placeholderTextColor={'grey'}
                    value={comments}
                    underlineColorAndroid="#fff"
                    onChangeText={setComments}
                    style={{
                      height: 75,
                      borderWidth: 1,
                      borderColor: 'lightgrey',
                      paddingHorizontal: 6,
                      color: '#000',
                    }}
                  />
                </View>
                {/* <Button title="Continue" onPress={() => this.onPress()} /> */}
                <CustomLoadingButton
                  ref={animatedButtonRef}
                  width={328}
                  height={52}
                  title="Continue"
                  titleFontSize={18}
                  titleFontFamily="Poppins-Bold"
                  titleColor="#FFF"
                  backgroundColor="#34A549"
                  borderRadius={4}
                  onPress={() => {
                    updatestatusorder(
                      ordersData.orders.order_info.order_id,
                      '5',
                      comments,
                      ordersData.orders.order_info.telephone,
                      '1',
                      ordersData.orders.order_info.deliveryType,
                    );
                  }}
                />
              </View>
            </RBSheet>
            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => {
                setModalVisible(!modalVisible);
              }}>
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <View>
                    <Image
                      style={{
                        alignSelf: 'center',
                      }}
                      source={{
                        width: '100%',
                        height: '93.5%',
                        uri: prescriptionImageUrl,
                      }}
                    />
                  </View>
                  <TouchableOpacity
                    style={{
                      width: '100%',
                      paddingTop: 11,
                      paddingBottom: 15,
                      backgroundColor: '#51AF5E',
                      borderRadius: 10,
                      borderWidth: 1,
                      borderColor: '#fff',
                    }}
                    onPress={() => {
                      setModalVisible(!modalVisible);
                    }}>
                    <Text
                      style={{
                        color: '#fff',
                        textAlign: 'center',
                        justifyContent: 'center',
                        alignItems: 'center',
                        fontSize: 16,
                      }}>
                      {' '}
                      Close{' '}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          </View>
        </ScrollView>
      </>
    </View>
  );
};

export default OrdersScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F5F7',
  },

  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.8)',
  },

  modalView: {
    margin: 20,
    backgroundColor: '#fff',
    shadowColor: '#1B365E',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: '90%',
  },

  SubmitButtonStyles: {
    marginTop: 10,
    backgroundColor: '#F7F7FC',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: wp(5),
    alignSelf: 'center',
    width: wp(96),
    height: hp(5),
  },

  headerTitle: {
    color: '#2B2520',
    fontFamily: 'Poppins-Medium',
    fontSize: 20,
  },
  list: {
    flex: 1,
    marginTop: 20,
  },
  time: {
    textAlign: 'center',
    backgroundColor: 'gray',
    fontSize: 12,
    color: 'white',
    padding: 5,
    borderRadius: 13,
    overflow: 'hidden',
  },
  description: {
    color: 'gray',
    marginLeft: 10,
  },
  header: {
    flexDirection: 'row',
    marginHorizontal: 5,
    marginVertical: 15,
    paddingTop: 25,
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
  list: {
    flex: 1,
  },
});
