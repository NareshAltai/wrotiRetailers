import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Platform,
  StyleSheet,
  StatusBar,
  Image,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Linking,
  FlatList,
  ActivityIndicator,
  Modal,
  Alert,
  Button,
  Keyboard,
} from 'react-native';
import {RadioButton} from 'react-native-paper';
import {useTheme} from '@react-navigation/native';
import OrderCard from '../../components/orderDetailCard';
import RBSheet from 'react-native-raw-bottom-sheet';
import DeveloperAPIClient from '../../state/middlewares/DeveloperAPIClient';
import {Searchbar, Divider} from 'react-native-paper';
import Toast from 'react-native-simple-toast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Timeline from 'react-native-timeline-flatlist';
import moment from 'moment';
// import AnimateLoadingButton from 'react-native-animate-loading-button';
//import NetworkChecker from "react-native-network-checker";
import Config from 'react-native-config';
import CustomLoadingButton from '../../components/CustomLoadingButton';

const OrdersScreen = ({navigation, route}) => {
  const [refreshing, setRefreshing] = React.useState(true);
  const {colors} = useTheme();
  const [ordersData, setOrdersData] = useState();
  const [waitersDetails, setWaitersDetails] = useState();

  const [comment, setComments] = React.useState(route?.params?.comment);
  const [declineComment, setDeclineComment] = React.useState();
  const [cancelReasonCode, setCancelReasonCode] = React.useState();
  const [OrderHistory, setOrderHistory] = React.useState();
  const [location, setlocation] = React.useState();
  const [isLoading, setIsLoading] = React.useState(false);
  const [ordercount, setIsordercount] = React.useState();
  const [prescriptionName, setprescriptionName] = React.useState();
  const [showDownload, setShowDownload] = React.useState(false);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [prescriptionImageUrl, setprescriptionImageUrl] = React.useState(false);
  const [loadButton, setLoadButton] = React.useState({
    getStartedButton: {},
  });

  const [selectedProvider, setSelectedProvider] = React.useState('Self');
  const [price, setPrice] = React.useState();

  const theme = useTheme();
  const [data, setData] = React.useState({
    RBSheetLogout: {},
  });

  const [cancel, setcancel] = React.useState({
    RBSheetLogout: {},
  });

  const [description, setdescription] = React.useState({
    RBSheetLogout: {},
  });

  const [customizedModal, setCustomizedModal] = React.useState(true);

  const updatestatusorder = async () => {
    loadButton.getStartedButton.showLoading(true);
    setRefreshing(true);
    //  console.log("=====", order_id, "customer_mobile", customer_mobile);
    const api = new DeveloperAPIClient();
    let order_status_id = 2;
    // let status_id = 15;
    let order_id = route.params.ID;
    let customer_mobile = route.params.customer_mobile;
    let Token = await AsyncStorage.getItem('token');
    let UserMobile = await AsyncStorage.getItem('MobileNumber');
    let comments = '';
    if (comment != null) {
      comments = comment;
    } else {
      comments = '';
    }
    let deliveryType = '';
    if (parseInt(route?.params?.item?.deliveryType) == 3) {
      deliveryType = '3';
    }
    if (parseInt(route?.params?.item?.deliveryType) == 1) {
      deliveryType = '1';
    }
    if (parseInt(route?.params?.item?.deliveryType) == 2) {
      deliveryType = selectedProvider == 'Self' ? '1' : '3';
    }
    let statusdata = await api.getorderupdate(
      UserMobile,
      order_id,
      order_status_id,
      comments,
      customer_mobile,
      '',
      deliveryType,
    );
    loadButton.getStartedButton.showLoading(false);
    if (statusdata.data != undefined) {
      Toast.showWithGravity(
        'Order Accepted Successfully',
        Toast.LONG,
        Toast.BOTTOM,
      );
    }
    setRefreshing(false);
    navigation.goBack();
  };

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

  const onDownloadPrescription = () => {
    description.RBSheetLogout.open();
    Toast.showWithGravity('onDownloadPrescription', Toast.LONG, Toast.BOTTOM);
  };
  const openwhatsapp = () => {
    let productName = '';
    for (let index = 0; index < ordersData.orders.products.length; index++) {
      const element = ordersData.orders.products[index];
      //console.log("element",element)
      productName = productName + '\r\n' + element.name;
    }
    //console.log("productname",productName)
    let whatsappText =
      `OrderId:${ordersData.orders.order_info.order_id}` +
      `\r\nLocation:https://www.google.com/maps/place/${location[0]},${location[1]}` +
      `\r\nCustomer Name : ${ordersData.orders.order_info.firstname}` +
      `\r\nCustomer  Mobile : ${ordersData.orders.order_info.telephone}` +
      `\r\nOrder Total : ${price}` +
      `\r\nDate Added : ${moment
        .utc(ordersData.orders.order_info.date_added)
        .local()
        .format('DD-MMM-YYYY, hh:mm')}` +
      `\r\nProducts :${productName}` +
      `\r\nPayment Mode : ${ordersData.orders.order_info.payment_method}`;
    Linking.openURL(`whatsapp://send?text=${whatsappText}`);
  };

  const declineorder = async () => {
    setRefreshing(true);
    // console.log("=====", order_id, "sddf ", order_status_id);
    const api = new DeveloperAPIClient();
    let order_id = route.params.ID;
    let order_status_id = 17;
    let customer_mobile = route.params.customer_mobile;
    let UserMobile = await AsyncStorage.getItem('MobileNumber');
    // let comments = cancelReasonCode + " " + " " + comment;
    let comments = '';
    if (cancelReasonCode != null && cancelReasonCode != undefined) {
      comments = cancelReasonCode + ' ' + ' ' + declineComment;
      // console.log("comments===", comments);
    } else {
      if (declineComment == undefined) {
        comments = '';
        // console.log("Hey Shravan", comments)
      } else {
        comments = declineComment;
        // console.log("Hey Shravan====", comments)
      }
      // console.log("comments", comments);
    }

    let statusdata = await api.getorderupdate(
      UserMobile,
      order_id,
      order_status_id,
      comments,
      customer_mobile,
      '',
    );
    //console.log("comments", comments);
    //console.log("statusData", statusdata);
    if (statusdata.data != undefined) {
      Toast.showWithGravity('Order Rejected.', Toast.LONG, Toast.BOTTOM);
    }
    setRefreshing(false);
    navigation.goBack();
  };

  const orderdetails = async () => {
    setIsLoading(true);
    const api = new DeveloperAPIClient();
    let orderId = route.params.ID;
    let UserMobile = await AsyncStorage.getItem('MobileNumber');
    let allOrdersData = await api.getOrderDetails(UserMobile, orderId);

    let LOC = JSON.parse(
      allOrdersData.data.orders.order_info.shipping_custom_field,
    );
    if (LOC != false) {
      const gps = LOC.location.split(',');
      setlocation(gps);
    }
    setOrderHistory(allOrdersData.data.orders.historiesdata);
    setOrdersData(allOrdersData.data);
    setWaitersDetails(allOrdersData.data.waiterDetails);
    console.log('allOrdersData.data', JSON.stringify(allOrdersData.data));
    for (let i = 0; i < allOrdersData.data.orders.totals.length; i++) {
      if (allOrdersData.data.orders.totals[i].title == 'Total') {
        setPrice(allOrdersData.data.orders.totals[i].value);
      }
    }
    setIsLoading(false);
  };

  const previousordercount = async () => {
    // orderdetails();
    setRefreshing(true);
    const api = new DeveloperAPIClient();
    let orderId = route.params.ID;
    let UserMobile = await AsyncStorage.getItem('MobileNumber');
    let allOrdersData = await api.getOrderDetails(UserMobile, orderId);
    let customer_id = allOrdersData.data.orders.order_info.customer_id;
    //console.log("customerID------>", customer_id);
    let ordercount = await api.getordercount(UserMobile, customer_id);
    setRefreshing(false);
    // console.log(
    //   "previousordercount-----------------",
    //  JSON.stringify(ordercount.data)
    // );

    setIsordercount(ordercount.data.count);
  };

  const cancelReasons = [
    {id: 'OPM', name: 'Products Out of stock'},
    {id: 'DTM', name: 'No delivery partner available'},
    {id: 'OEQ', name: 'We cannot deliver to your address'},
    {id: 'BFS', name: 'Others'},
  ];

  const onSubmit = val => {
    //  Keyboard.dismiss()
    updatestatusorder();
  };

  const ondismiss = val => {
    Keyboard.dismiss();
    declineorder();
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      orderdetails();
      previousordercount();
    });
    return unsubscribe;
  }, []);

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

              {/* <Image
              style={{ width: 20, height: 20, resizeMode: "center" }}
              source={require("../../assets/menu2x.png")}
            /> */}
            </View>
          )}
        </View>
        {isLoading && <ActivityIndicator size="large" color="#51AF5E" />}
        <ScrollView>
          <View style={{marginVertical: 10}}>
            {ordersData && (
              <View>
                <View style={styles.container}>
                  <View
                    style={{
                      marginHorizontal: 10,
                      backgroundColor: '#1B6890',
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
                          New Order{' '}
                          {/* {ordersData.orders.order_info.comment &&
                            `(${ordersData.orders.order_info.comment.toUpperCase()})`} */}
                        </Text>
                      </View>
                      <View style={{marginBottom: 10}}>
                        <Divider />
                      </View>
                      <View style={{flexDirection: 'row'}}>
                        <Text
                          style={{
                            fontSize: 15,
                            color: '#FFFFFF',
                            marginBottom: 5,
                            fontFamily: 'Poppins-Medium',
                            flex: 1,
                            textAlign: 'left',
                          }}>
                          Order Id : {ordersData.orders.order_info.order_id}
                        </Text>
                        <Text
                          style={{
                            fontSize: 12,
                            color: '#FFFFFF',
                            fontFamily: 'Poppins-Regular',
                            flex: 1,
                            textAlign: 'right',
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
                            fontFamily: 'Poppins-Medium',
                            flex: 1,
                            textAlign: 'left',
                          }}>
                          {ordersData.orders.order_info.payment_method}
                        </Text>
                        <Text
                          style={{
                            fontSize: 15,
                            color: '#FFFFFF',
                            fontFamily: 'Poppins-Medium',
                            flex: 1,
                            textAlign: 'right',
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
                  {ordersData.orders.products &&
                    ordersData.orders.products.map((val, i) => {
                      /// console.log("name#",val.option[0].name)
                      if (
                        val.option.length > 0 &&
                        val.option[0] != undefined &&
                        val.option[0].type == 'file' &&
                        !showDownload
                      ) {
                        setShowDownload(true);
                        setprescriptionImageUrl(val.option[0].value);
                        setprescriptionName(val.option[0].name);
                      }
                      // if(val.option[0].value != )
                      return (
                        <View>
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
                                    val.option.map(
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
                                                    fontFamily:
                                                      'Poppins-Medium',
                                                  }}>
                                                  {optionValue.value}
                                                </Text>
                                                {/* <View style={{justifyContent:'flex-end',alignContent:'flex-end'}}> */}
                                                <Text
                                                  style={{
                                                    color: 'green',
                                                    fontSize: 12,
                                                    fontFamily:
                                                      'Poppins-Medium',
                                                    marginLeft: 10,
                                                  }}>
                                                  ( ₹ {optionValue.price} )
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
                              {val.quantity} x {val.price}
                            </Text>
                          </View>
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
                  {ordersData.orders.totalsdata &&
                    ordersData.orders.totalsdata.map((item, i) => {
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
                            {item.title}
                          </Text>
                          <Text
                            style={{
                              fontSize: 14,
                              color: '#21272E',
                              fontFamily: 'Poppins-Medium',
                              flex: 1,
                              textAlign: 'right',
                            }}>
                            {item.text}
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
                      {ordersData.orders.order_info.firstname}
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
                        dialCall(`+${ordersData.orders.order_info.telephone}`)
                      }>
                      <Text
                        style={{
                          marginLeft: 10,
                          fontSize: 15,
                          color: '#21272E',
                          marginTop: 3,
                          fontFamily: 'Poppins-Medium',
                        }}>
                        +{ordersData.orders.order_info.telephone}
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
                        whatsapp(`+${ordersData.orders.order_info.telephone}`)
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
                      {ordercount}
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
                      {ordersData.orders.order_info.comment}
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
                          {waitersDetails.waiterName}
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
                          {waitersDetails.waiterMobileNumber}
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
                      {route.params.item.shipping_address}
                    </Text>
                  </View>
                </View>

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
                          separator={true}
                          data={DATA}
                          circleSize={16}
                          circleColor="#34A549"
                          numberOfLines={1}
                          lineWidth={2}
                          renderFullLine={true}
                          innerCircle={'dot'}
                          isUsingFlatlist={true}
                          descriptionStyle={{
                            color: 'gray',
                            marginLeft: 5,
                            fontFamily: 'Poppins-Regular',
                          }}
                          timeStyle={{
                            fontFamily: 'Poppins-Medium',
                          }}
                          titleStyle={{
                            marginTop: -10,
                            fontFamily: 'Poppins-Medium',
                            marginLeft: 5,
                          }}
                        />
                      );
                    })}
                </View>

                <View style={{flexDirection: 'column'}}>
                  <TouchableOpacity
                    style={styles.SubmitButtonStyle}
                    onPress={() => data.RBSheetLogout.open()}>
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
                      Accept{' '}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.SubmitButtonStyles}
                    onPress={() => cancel.RBSheetLogout.open()}>
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
                      Reject
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            <RBSheet
              ref={ref => {
                data.RBSheetLogout = ref;
              }}
              height={route.params.item.deliveryType == '2' ? 500 : 400}
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
                  Accepted • Order Processing
                </Text>
                <Text
                  style={{
                    color: '#11151A',
                    fontSize: 14,

                    textAlign: 'center',
                  }}>
                  Happy Customer Good For Business
                </Text>
                {route.params.item.deliveryType == '2' && (
                  <>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        marginRight: '5%',
                      }}>
                      <TouchableOpacity
                        style={{marginTop: '6.5%'}}
                        onPress={() => setSelectedProvider('Self')}>
                        <Image
                          style={{
                            // marginTop: '6.5%',
                            width: 20,
                            height: 20,
                            resizeMode: 'contain',
                            // marginLeft: 35,
                            shadowColor: 'black',
                            marginBottom: 15,
                            marginRight: '5%',
                          }}
                          source={
                            selectedProvider == 'Self'
                              ? require('../../assets/right.png')
                              : require('../../assets/success.png')
                          }
                        />
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => setSelectedProvider('Self')}
                        style={{
                          marginTop: 10,
                          width: 130,
                          height: 35,
                          paddingTop: '4%',
                          paddingBottom: '9%',
                          backgroundColor: '#34A549',
                          borderRadius: 10,
                          flexDirection: 'row',
                          elevation: 10,
                        }}>
                        <Image
                          style={{
                            width: 20,
                            height: 20,
                            resizeMode: 'contain',
                            marginLeft: 15,
                            marginBottom: 15,
                          }}
                          source={require('../../assets/icon.png')}
                        />
                        <View style={{elevation: 10}}>
                          <Text
                            style={{
                              color: '#fff',
                              fontSize: 16,
                              marginBottom: 20,
                              textAlign: 'center',
                              justifyContent: 'center',
                              alignItems: 'center',
                              fontFamily: 'Poppins-SemiBold',

                              // marginLeft: ,
                            }}>
                            {' '}
                            Self Driver{' '}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                    <View
                      style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginTop: 10,
                      }}>
                      <Text
                        style={{fontSize: 20, fontFamily: 'Poppins-Medium'}}>
                        or
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        marginRight: '5%',
                      }}>
                      <TouchableOpacity
                        style={{marginTop: '6.5%'}}
                        onPress={() => setSelectedProvider('Wroti')}>
                        <Image
                          style={{
                            width: 20,
                            height: 20,
                            resizeMode: 'contain',
                            // marginLeft: 35,
                            shadowColor: 'black',
                            marginBottom: 15,
                            marginRight: '5%',
                          }}
                          source={
                            selectedProvider == 'Wroti'
                              ? require('../../assets/right.png')
                              : require('../../assets/success.png')
                          }
                        />
                      </TouchableOpacity>
                      <TouchableOpacity
                        // onPress={() => this.RBSheet.open()}
                        onPress={() => setSelectedProvider('Wroti')}
                        style={{
                          marginTop: 10,
                          width: 130,
                          height: 35,
                          paddingTop: '4%',
                          paddingBottom: '9%',
                          backgroundColor: '#34A549',
                          borderRadius: 10,
                          flexDirection: 'row',
                          elevation: 10,
                        }}>
                        <View
                          style={{
                            marginBottom: 20,
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginLeft: 20,
                          }}>
                          <Image
                            style={{
                              width: 90,
                              height: 25,
                              resizeMode: 'stretch',
                            }}
                            source={require('../../assets/Wroti_Logo_White.png')}
                          />
                        </View>
                      </TouchableOpacity>
                    </View>
                  </>
                )}
                <View style={{marginHorizontal: 4, marginVertical: 10}}>
                  <TextInput
                    multiline={true}
                    placeholder="Leave a comment"
                    value={comment}
                    underlineColorAndroid="#fff"
                    onChangeText={val => setComments(val)}
                    style={{
                      height: 75,
                      borderWidth: 1,
                      borderColor: 'lightgrey',
                      paddingHorizontal: 6,
                    }}
                    onSubmitEditing={() => onSubmit()}
                  />
                </View>
                <CustomLoadingButton
                  ref={c => (data.loginButton = c)}
                  width={328}
                  height={52}
                  title={'Continue'}
                  titleFontSize={18}
                  titleFontFamily={'Poppins-Bold'}
                  titleColor="#FFF"
                  backgroundColor="#34A549"
                  borderRadius={4}
                  onPress={() => {
                    updatestatusorder();
                  }}
                />
              </View>
            </RBSheet>

            <RBSheet
              ref={ref => {
                cancel.RBSheetLogout = ref;
              }}
              height={450}
              openDuration={250}
              customStyles={{
                container: {
                  justifyContent: 'center',
                  borderTopRightRadius: 30,
                  borderTopLeftRadius: 30,
                },
              }}>
              <View style={styles.body}>
                <Text
                  style={{
                    color: '#E26251',
                    fontSize: 20,
                    marginVertical: 10,
                    textAlign: 'center',
                    marginTop: 8,
                    fontFamily: 'Poppins-SemiBold',
                  }}>
                  Reject Order
                </Text>
                <Text
                  style={{
                    color: '#11151A',
                    fontSize: 14,
                    textAlign: 'center',
                  }}>
                  Happy Customer Good For Business
                </Text>
                <Text
                  style={{
                    fontSize: 17,
                    marginHorizontal: 6,
                    marginVertical: 6,
                    textAlign: 'center',
                    fontWeight: 'bold',
                  }}>
                  Reasons:
                </Text>
                <View style={{marginLeft: '3%'}}>
                  <FlatList
                    data={cancelReasons}
                    numColumns={1}
                    scrollEnabled={false}
                    renderItem={({item, index}) => (
                      <TouchableOpacity
                        onPress={() => setCancelReasonCode(item.name)}>
                        <View
                          style={{flexDirection: 'row', alignItems: 'center'}}>
                          <RadioButton.Android
                            onPress={() => setCancelReasonCode(item.name)}
                            uncheckedColor="#2ea048"
                            status={
                              item.name === cancelReasonCode
                                ? 'checked'
                                : 'unchecked'
                            }
                          />
                          <Text style={styles.reasonSection}>{item.name}</Text>
                        </View>
                      </TouchableOpacity>
                    )}
                  />
                </View>
                <View style={{marginHorizontal: 4, marginVertical: 10}}>
                  <TextInput
                    multiline={true}
                    placeholder="Leave a comment"
                    // value={comment}
                    underlineColorAndroid="#fff"
                    onChangeText={val => setDeclineComment(val)}
                    style={{
                      height: 75,
                      borderWidth: 1,
                      borderColor: 'lightgrey',
                      paddingHorizontal: 6,
                    }}
                    onSubmitEditing={() => ondismiss()}
                  />
                </View>
                <CustomLoadingButton
                  ref={c => (loadButton.getStartedButton = c)}
                  width={328}
                  height={52}
                  title={'Continue'}
                  titleFontSize={18}
                  titleFontFamily={'Poppins-Bold'}
                  titleColor="#FFF"
                  backgroundColor="#34A549"
                  borderRadius={4}
                  onPress={() => {
                    declineorder();
                  }}
                />
              </View>
            </RBSheet>
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
    width: '100%',
    height: 45,
    paddingTop: 11,
    paddingBottom: 15,
    backgroundColor: '#F7F7FC',
    borderRadius: 10,
  },

  SubmitButtonStyle: {
    marginTop: 10,
    width: '100%',
    height: 45,
    paddingTop: 11,
    paddingBottom: 15,
    backgroundColor: '#51AF5E',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#fff',
  },

  headerTitle: {
    color: '#2B2520',
    fontFamily: 'Poppins-Medium',
    fontSize: 20,
  },
  header: {
    flexDirection: 'row',
    marginHorizontal: 5,
    marginVertical: 15,
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
    marginTop: 5,
  },
});
