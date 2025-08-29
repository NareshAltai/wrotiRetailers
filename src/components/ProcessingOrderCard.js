import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Image,
  TextInput,
  KeyboardAvoidingView,
  FlatList,
  Alert,
  Button,
} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import moment from 'moment';
import {ScrollView} from 'react-native-gesture-handler';
import Toast from 'react-native-simple-toast';
// import AnimateLoadingButton from "react-native-animate-loading-button";
import DeveloperAPIClient from '../state/middlewares/DeveloperAPIClient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Config from 'react-native-config';
import CustomLoadingButton from './CustomLoadingButton';

export default class OrderCard extends React.Component {
  markasdelivered = () => {
    if (this.props.storeType === 'nexus') {
      if (this.props.deliveryType !== '') {
        if (this.props.item.deliveryMethod != 'S') {
          if (this?.props?.item?.selectedDriver?.id == undefined) {
            Toast.showWithGravity(
              'Please assign a driver',
              Toast.LONG,
              Toast.BOTTOM,
            );
            return false;
          }
        }
      }
    }
    if (
      this.state.name.includes('XXXX') ||
      this.state.name.includes('XXX') ||
      this.state.name.includes('XX')
    ) {
      Toast.showWithGravity(
        'Please enter valid token number',
        Toast.LONG,
        Toast.BOTTOM,
      );
      return false;
    }
    // this.state.data.getStartedButton.showLoading(true);
    this.props.statusUpdate(
      this.props.order_id,
      this.props.order_status_id,
      this.state.name,
      this.props.customer_mobile,
      this?.props?.selectedDriver?.id ? this?.props?.selectedDriver?.id : '',

      '1',
      {
        custom_feild: {
          amount: this.state.price,
          payment_link: this.props.checked,
          image_path: this.props.image,
        },
      },
    );

    this.RBSheet.close();
    // this.state.data.getStartedButton.showLoading(false);
  };

  markAsDeliveredByWroti = () => {
    this.state.data.getStartedButton.showLoading(true);
    this.props.statusUpdate(
      this.props.order_id,
      2,
      this.state.name,
      this.props.customer_mobile,
      '',
      '3',
    );

    this.RBSheet.close();
    this.state.data.getStartedButton.showLoading(false);
  };

  dispatchOrder = order_id => {
    this.loadMerchantInfo();
    this.props.setSelectedDriver();
    this.props.loadOrdersByOrderId(order_id);
    this.openBottomSheet();
  };

  state = {
    name: '',
    price: this.props.price.replace(/[^0-9\.-]+/g, ''),
    checked: false,
    selectedDeliveryBoy: {},
    deliveryDetails: {},
    data: {getStartedButton: {}},
    merchantDeliveryType: '',
    isDeliveryType: false,
  };

  loadOrdersByOrderId = async () => {
    const api = new DeveloperAPIClient();
    let Token = await AsyncStorage.getItem('token');
    let UserMobile = await AsyncStorage.getItem('MobileNumber');
    let response = await api.getOrderDetailsByOrderId(
      this.props.ID,
      Token,
      UserMobile,
    );
    if (
      response.data != null ||
      response.data != undefined ||
      response.data != ''
    ) {
      this.setState({deliveryDetails: response.data});
    }
  };

  loadMerchantInfo = async () => {
    let api = new DeveloperAPIClient();
    let Token = await AsyncStorage.getItem('token');
    let UserMobile = await AsyncStorage.getItem('MobileNumber');
    let merchanrInfo = await api.getMerchantInfo(UserMobile, Token);
    if (merchanrInfo?.data != undefined) {
      if (merchanrInfo?.data?.deliveryType == '1') {
        this.setState({
          merchantDeliveryType: merchanrInfo?.data?.deliveryType,
        });
        if (merchanrInfo?.data?.deliveryType === '2') {
          this.setState({isDeliveryType: true});
        }
      }
    }
  };

  constructor(props) {
    super(props);
    this.loadOrdersByOrderId();
    this.loadMerchantInfo();
  }

  handleText = text => {
    this.setState({name: text});
  };

  handlePrice = text => {
    this.setState({price: text});
  };

  onPress = () => {
    this.markasdelivered();
  };

  openBottomSheet = () => {
    this.props.setchecked(false);
    this.RBSheet.open();
  };

  openBottomSheet = () => {
    this.RBSheet.open();
  };

  switchDeliveryProvider = () => {
    this.RBSheet.close();
    this.props.setSelectedProvider(
      this?.props?.selectedProvider == 'Self' ? 'Wroti' : 'Self',
    );
  };

  render() {
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        style={styles.container}
        onPress={this.props.onPress}>
        <View>
          {this.props.type === 'deliver' ? (
            <View
              style={{
                backgroundColor: '#a9deb9',
                height: 30,
                width: 200,
                justifyContent: 'center',
                borderRadius: 12,
              }}>
              <Text
                style={{
                  color: '#218a42',
                  fontFamily: 'Poppins-Medium',
                  alignSelf: 'center',
                }}>
                Delivery at {this.props.serviceChargeType}:{' '}
                {this.props.tableNumber}
              </Text>
            </View>
          ) : this.props.type === 'pickup' ? (
            <View
              style={{
                backgroundColor: '#a9deb9',
                height: 30,
                width: 200,
                justifyContent: 'center',
                borderRadius: 12,
              }}>
              <Text
                style={{
                  color: '#218a42',
                  fontFamily: 'Poppins-Medium',
                  alignSelf: 'center',
                }}>
                Pickup From Store
              </Text>
            </View>
          ) : this.props.type === 'seat' ? (
            <View
              style={{
                backgroundColor: '#a9deb9',
                height: 30,
                width: 200,
                justifyContent: 'center',
                borderRadius: 12,
              }}>
              <Text
                style={{
                  color: '#218a42',
                  fontFamily: 'Poppins-Medium',
                  alignSelf: 'center',
                }}>
                Delivery at Seat: {this.props.tableNumber}
              </Text>
            </View>
          ) : null}

          <View style={{flexDirection: 'row'}}>
            <Text
              style={{
                marginLeft: 1,
                fontSize: 16,
                fontFamily: 'Poppins-SemiBold',
                flex: 1.8,
                textAlign: 'left',
              }}>
              {this.props.name}
            </Text>
            {Config.ENV == 'uat' ? (
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: 'Poppins-Regular',
                  textAlign: 'right',
                  flex: 1.3,
                }}>
                {/* {this.props.time} */}
                {moment(`${this.props.time}`)
                  .local()
                  .format('DD-MMM-YYYY, hh:mm a')}
              </Text>
            ) : (
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: 'Poppins-Regular',
                  textAlign: 'right',
                  flex: 1.3,
                }}>
                {/* {this.props.time} */}
                {moment
                  .utc(`${this.props.time}`)
                  .local()
                  .format('DD-MMM-YYYY, hh:mm a')}
              </Text>
            )}
          </View>
          <View style={{flexDirection: 'row'}}>
            <Text
              style={{
                fontSize: 12,
                fontFamily: 'Poppins-Regular',
                marginRight: 5,
                letterSpacing: 3,
              }}>
              #{this.props.ID}
            </Text>
            <View style={{flexDirection: 'row'}}>
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: 'Poppins-Regular',
                  textDecorationLine: 'underline',
                  color: '#34A549',
                }}
                onPress={this.props.onPress}>
                View Details
              </Text>
              <Image
                style={{
                  resizeMode: 'contain',
                  height: 8,
                  width: 10,
                  marginTop: 4.5,
                }}
                source={require('../assets/left3X.png')}
              />
            </View>
            <Text
              style={{
                fontSize: 16,
                fontFamily: 'Poppins-Bold',
                textAlign: 'right',
                flex: 1,
              }}>
              {this.props.price}
            </Text>
          </View>
          {this.props.storeType === 'default' && (
            <View
              style={{
                borderRadius: 6,
                fontFamily: 'Poppins-Medium',
                backgroundColor: '#fff',
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  margin: 10,
                  justifyContent: 'center',
                }}>
                {/* <Image
                style={{
                  width: 20,
                  height: 20,
                  resizeMode: "center",
                  marginTop: 2,
                }}
                source={require("../assets/loc3x.png")}
              />
              <Text
                style={{
                  fontSize: 12,
                  marginTop: "1.5%",
                  color: "#21272E",
                  fontFamily: "Poppins-SemiBold",
                  // textAlign: "center",
                  // width: '50%',
                }}
              >
                {this.props.location.length > 25
                  ? `${this.props.location.substring(0, 25)} ...`
                  : this.props.location}
              </Text> */}
                {this.props.item.comment ? (
                  <View
                    style={{
                      // marginLeft: "auto",
                      backgroundColor: '#F2F7F9',
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRadius: 5,
                    }}>
                    <Text
                      style={{
                        color: '#51AF5E',
                        fontSize: 14,
                        fontFamily: 'Poppins-Medium',
                        margin: 5,
                      }}>
                      {this.props.item.comment != 'having here'
                        ? 'Take Away'
                        : 'Having Here'}
                    </Text>
                  </View>
                ) : (
                  <>
                    {this.state?.deliveryDetails?.provider == 'porter' && (
                      <Image
                        style={{
                          height: 30,
                          width: '25%',
                          resizeMode: 'stretch',
                          marginLeft: 'auto',
                        }}
                        source={require('../assets/porterLogo.png')}
                      />
                    )}
                    {this.state?.deliveryDetails?.provider == 'whizzy' && (
                      <Image
                        style={{
                          height: 30,
                          width: '25%',
                          resizeMode: 'stretch',
                          marginLeft: 'auto',
                        }}
                        source={require('../assets/whizzy.png')}
                      />
                    )}
                    {this.state?.deliveryDetails?.provider == 'dunzo' && (
                      <Image
                        style={{
                          height: 30,
                          width: '25%',
                          resizeMode: 'stretch',
                          marginLeft: 'auto',
                        }}
                        source={require('../assets/dunzo.png')}
                      />
                    )}
                  </>
                )}
              </View>
            </View>
          )}
          <View style={{}}>
            <Text
              style={{
                color: '#3D86B4',
                marginTop: '1%',
                marginBottom: 3,
                fontStyle: 'Poppins-Medium',
                flex: 1,
                textAlign: 'left',
                fontSize: 12,
              }}>
              {this.props.orderType}
            </Text>
          </View>
          <View>
            <View style={{flexDirection: 'row'}}>
              <Text
                style={{
                  fontSize: 12,
                  color: '#21272E',
                  fontFamily: 'Poppins-Regular',
                  marginBottom: 5,
                  flex: 1.8,
                  textAlign: 'left',
                }}>
                {/* 1. {this.props.products[0].name} */}
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: 'Poppins-Bold',
                  flex: 1,
                  textAlign: 'right',
                }}>
                {/* Total {this.props.products.length} items */}
              </Text>
            </View>
          </View>
        </View>
        {parseInt(this.props.deliveryType) == 1 ||
        parseInt(this.props.deliveryType) == 2 ||
        this.props.deliveryType == '' ? (
          <TouchableOpacity
            style={{
              marginTop: 10,
              width: '100%',
              height: 45,
              paddingTop: 11,
              paddingBottom: 15,
              backgroundColor: '#51AF5E',
              borderRadius: 10,
              borderWidth: 1,
              borderColor: '#fff',
            }}
            //onPress={() => this.RBSheet.open(this.props.checked == false)}
            onPress={() => this.dispatchOrder(this.props.ID)}>
            <Text
              style={{
                color: '#fff',
                textAlign: 'center',
                justifyContent: 'center',
                alignItems: 'center',
                fontSize: 16,
                fontFamily: 'Poppins-SemiBold',
              }}>
              {' '}
              Mark As Dispatch{' '}
            </Text>
          </TouchableOpacity>
        ) : (
          <View style={{flexDirection: 'row'}}>
            <Text style={{}}>Note : </Text>
            <Text style={{color: 'red'}}>
              This order will be delivered by WROTI
            </Text>
          </View>
        )}

        <RBSheet
          ref={ref => {
            this.RBSheet = ref;
          }}
          height={
            this.props.selectedProvider == 'Wroti'
              ? 320
              : 520 || this.props.showModal
              ? 400
              : 520
          }
          openDuration={250}
          customStyles={{
            container: {
              justifyContent: 'center',
              borderTopRightRadius: 30,
              borderTopLeftRadius: 30,
            },
          }}>
          <ScrollView>
            <KeyboardAvoidingView
              style={{
                flex: 1,
              }}>
              <Text
                style={{
                  color: 'black',
                  fontSize: 20,
                  fontFamily: 'poppins',
                  fontWeight: 'bold',
                  color: '#11151A',
                  marginVertical: 10,
                  textAlign: 'center',
                  marginTop: '8%',
                }}>
                Order Dispatch
              </Text>

              <Text
                style={{
                  color: '#11151A',
                  fontSize: 14,
                  fontFamily: 'poppins',
                  fontWeight: '500',
                  // marginTop: 2,
                  textAlign: 'center',
                }}>
                Happy Customer Good For Business
              </Text>

              {this.props.storeType === 'nexus' && (
                <>
                  {this?.props?.selectedProvider == 'Self' &&
                    this.props.item.deliveryMethod != 'S' && (
                      <TouchableOpacity
                        style={{
                          height: 40,
                          width: '90%',
                          borderRadius: 6,
                          borderWidth: 1,
                          borderColor: '#3AA44D',
                          marginLeft: 19,
                          marginTop: 15,
                          borderBottomColor: this.props.showModal
                            ? '#efeee'
                            : '#3AA44D',
                          flexDirection: 'row',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                        onPress={() =>
                          this.props.setShowModal(!this.props.showModal)
                        }>
                        <Text
                          style={{
                            color: '#4fb04a',
                            textAlign: 'center',
                            marginTop: 8,
                            fontSize: 15,
                            marginLeft: 5,
                            fontFamily: 'Poppins-SemiBold',
                          }}>
                          {this?.props?.selectedDriver
                            ? this.props.selectedDriver?.name
                            : 'Select Driver'}
                        </Text>
                        <Image
                          style={{
                            width: 20,
                            height: 20,
                            resizeMode: 'contain',
                            marginLeft: 'auto',
                            transform: [
                              {
                                rotate: this.props.showModal
                                  ? '180deg'
                                  : '0deg',
                              },
                            ],
                          }}
                          source={require('../assets/downA.png')}
                        />
                      </TouchableOpacity>
                    )}

                  {this.props.item.deliveryType == '1' &&
                    this.props.item.deliveryMethod != 'S' && (
                      <>
                        {this.props.showModal && (
                          <FlatList
                            data={this?.props?.showDeliveryPartnerList}
                            numColumns={1}
                            scrollEnabled={false}
                            renderItem={this.props.renderItem}
                            nestedScrollEnabled={true}
                          />
                        )}
                      </>
                    )}
                  {!this.props.showModal &&
                    this?.props?.selectedDriver != undefined && (
                      <View
                        style={{
                          marginHorizontal: 15,
                          backgroundColor: '#FFF',
                          elevation: 10,
                          padding: 10,
                          borderRadius: 5,
                          marginVertical: 5,
                          // height: '28%',
                          width: '90%',
                          marginLeft: 19,
                        }}>
                        <View
                          style={{
                            marginBottom: 5,
                            flexDirection: 'row',
                            justifyContent: 'center',
                          }}>
                          <Image
                            style={{
                              width: 20,
                              height: 20,
                              resizeMode: 'contain',
                              marginLeft: 15,
                              marginBottom: 15,
                            }}
                            source={require('../assets/icon-b.png')}
                          />
                          <Text
                            style={{
                              fontSize: 18,
                              color: 'black',
                              marginBottom: 5,
                              textAlign: 'center',
                              fontFamily: 'Poppins-Medium',
                            }}>
                            DRIVER DETAILS :
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
                              {this?.props?.selectedDriver?.name
                                ? this.props?.selectedDriver?.name
                                : `N/A`}
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
                              .
                              {this.props?.selectedDriver
                                ? this.props?.selectedDriver?.mobileNumber
                                : 'N/A'}
                            </Text>
                            <TouchableOpacity>
                              <Text
                                style={{
                                  marginLeft: 10,
                                  fontSize: 12,
                                  color: 'black',
                                  marginBottom: 5,
                                  fontFamily: 'Poppins-Medium',
                                  marginTop: 5,
                                }}>
                                {this?.props?.selectedDriver?.vehicle_number
                                  ? this?.props?.selectedDriver?.vehicle_number
                                  : 'N/A'}
                              </Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>
                    )}
                  {this.props.item.deliveryType === '1' &&
                    this.props.merchantDeliveryProvider == '2' &&
                    this.props.item.deliveryMethod != 'S' && (
                      <View
                        style={{
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        <TouchableOpacity
                          onPress={() =>
                            Alert.alert(
                              '',
                              'Do you want to deliver this order through WROTI ?',
                              [
                                {
                                  text: 'Yes',
                                  onPress: () => this.markAsDeliveredByWroti(),
                                },
                                {text: 'No', cancellable: true},
                              ],
                            )
                          }
                          style={{
                            marginTop: 10,
                            width: 155,
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
                            source={require('../assets/switchicon.png')}
                          />

                          <View style={{elevation: 10}}>
                            <Text
                              style={{
                                color: '#fff',
                                fontSize: 14,
                                marginBottom: 20,
                                textAlign: 'center',
                                justifyContent: 'center',
                                alignItems: 'center',
                                fontFamily: 'Poppins-SemiBold',
                                marginRight: 10,
                              }}>
                              {' '}
                              Switch to WROTI
                            </Text>
                          </View>
                        </TouchableOpacity>
                      </View>
                    )}
                </>
              )}
              <View style={{marginHorizontal: 6, marginVertical: 20}}>
                <TextInput
                  placeholder="Write a message"
                  value={this.state.name}
                  onChangeText={text => this.handleText(text)}
                  style={{
                    height: 90,
                    margin: 10,
                    padding: 10,
                    backgroundColor: '#F7F7FC',
                  }}
                  onSubmitEditing={() => this.markasdelivered()}
                />
                <CustomLoadingButton
                  ref={c => (this.state.data.getStartedButton = c)}
                  width={328}
                  height={52}
                  title="Continue"
                  titleFontSize={18}
                  titleFontFamily="Poppins-Bold"
                  titleColor="#FFF"
                  backgroundColor="#34A549"
                  borderRadius={4}
                  onPress={() => {
                    this.markasdelivered();
                  }}
                />
              </View>
            </KeyboardAvoidingView>
          </ScrollView>
        </RBSheet>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F2F7F9',
    // elevation: 10,
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: '#3AA44D',
  },
  card: {
    flexDirection: 'row',
  },
  details: {
    flexDirection: 'row',
    marginTop: 3,
    backgroundColor: '#fff',
    height: 50,
    width: 50,
  },
  text: {
    marginLeft: 10,
    // fontStyle:'Poppins-SemiBold'
  },

  SubmitButtonStyles: {
    // marginTop: 10,
    width: 150,
    height: 35,
    paddingTop: 8,
    paddingBottom: 15,
    backgroundColor: '#E26251',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#fff',
    marginLeft: 20,
  },

  SubmitButtonStyle: {
    // marginTop: 10,
    width: 150,
    height: 35,
    paddingTop: 8,
    paddingBottom: 15,
    backgroundColor: '#51AF5E',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#fff',
  },

  TextStyle: {
    color: '#fff',
    fontSize: 15,
    marginBottom: 15,
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: 'Poppins-SemiBold',
  },

  LabelStyle: {
    fontFamily: 'SF Pro Text',
  },
  //checkboxContainer: {
  //flexDirection: "row",
  //marginBottom: 20,
  //},

  //checkbox: {
  //alignSelf: "center",
  //},
  //label: {
  //margin: 8,
  //},
});
