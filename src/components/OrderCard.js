import React, {useState} from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Image,
  TextInput,
  FlatList,
  ActivityIndicator,
  Button,
  KeyboardAvoidingView,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RBSheet from 'react-native-raw-bottom-sheet';
import moment from 'moment';
import {RadioButton} from 'react-native-paper';
import {responsiveWidth} from 'react-native-responsive-dimensions';
import CustomLoadingButton from './CustomLoadingButton';
// import {KeyboardAvoidingView} from 'react-native-keyboard-aware-scroll-view';
// import AnimateLoadingButton from 'react-native-animate-loading-button';
import Config from 'react-native-config';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import {hp, wp} from '../utils/scale';

export default class OrderCard extends React.Component {
  updatestatusorder = () => {
    // this.state.dataa.getStartedButton.showLoading(true);
    let deliveryType = '';
    if (parseInt(this?.props?.item?.deliveryType) == 3) {
      deliveryType = '3';
    }
    if (parseInt(this?.props?.item?.deliveryType) == 1) {
      deliveryType = '1';
    }
    if (parseInt(this?.props?.item?.deliveryType) == 2) {
      deliveryType = this?.props?.selectedProvider == 'Self' ? '1' : '3';
    }
    console.log('this.props----------->', this?.props);
    this.props.statusUpdate(
      this.props.order_id,
      this.props.order_status_id,
      this.state.name,
      this.props.customer_mobile,
      '',
      deliveryType,
      this.props.item.deliveryMethod,
    );
    // this.state.dataa.getStartedButton.showLoading(false);
  };

  openBottomSheetForDecline = () => {
    this.props.setcode == 'undefined';
    this.state.data.RBSheetLogout.open();
  };

  declineorder = () => {
    let comments = '';
    if (this.props.setcode != null) {
      comments = this.props.setcode + ' ' + ' ' + this.state.declineName;
    } else {
      comments = this.state.declineName;
    }
    this.props.statusUpdate(
      this.props.order_id,
      17,
      comments,
      this.props.customer_mobile,
      '',
    );
    // this.state.dataa.getStartedButton.showLoading(false);
  };

  onPress = () => {
    this.updatestatusorder(), this.RBSheet.close();
  };

  onpress = () => {
    this.declineorder(), this.state.data.RBSheetLogout.close();
  };

  acceptOrder = order_id => {
    if (this.props.item.deliveryType == '1') {
      this.props.setSelectedProvider('Self');
    } else if (this.props.item.deliveryType == '2') {
      this.props.setSelectedProvider('Self');
    } else if (this.props.item.deliveryType == '3') {
      this.props.setSelectedProvider('Wroti');
    }
    this.props.loadOrdersByOrderId(order_id);
    this.RBSheet.open();
  };

  state = {
    name: this.props.comment,
    declineName: '',
    data: {RBSheetLogout: this.props.code('')},
    dataa: {getStartedButton: {}},
    cancelReasonCode: 'OPM',
  };
  handleText = text => {
    this.setState({name: text});
  };
  handleDeclineText = text => {
    this.setState({declineName: text});
  };

  cancelReasons = [
    {id: 'OPM', name: 'Products Out of stock'},
    {id: 'DTM', name: 'No delivery partner available'},
    {id: 'OEQ', name: 'We cannot deliver to your address'},
    {id: 'BFS', name: 'Others'},
  ];

  render() {
    return (
      <View>
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.container}
          onPress={this.props.onPress}>
          <View>
            {/* {this.props.type === 'deliver' ? (
              <View
                style={{
                  backgroundColor: '#f7da99',
                  height: 30,
                  width: 200,
                  justifyContent: 'center',
                  borderRadius: 12,
                }}>
                <Text
                  style={{
                    color: '#c99420',
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
                  backgroundColor: '#f7da99',
                  height: 30,
                  width: 200,
                  justifyContent: 'center',
                  borderRadius: 12,
                }}>
                <Text
                  style={{
                    color: '#c99420',
                    fontFamily: 'Poppins-Medium',
                    alignSelf: 'center',
                  }}>
                  Pickup From Store
                </Text>
              </View>
            ) : this.props.type === 'seat' ? (
              <View
                style={{
                  backgroundColor: '#f7da99',
                  height: 30,
                  width: 200,
                  justifyContent: 'center',
                  borderRadius: 12,
                }}>
                <Text
                  style={{
                    color: '#c99420',
                    fontFamily: 'Poppins-Medium',
                    alignSelf: 'center',
                  }}>
                  Delivery at Seat: {this.props.tableNumber}
                </Text>
              </View>
            ) : null} */}

            <View style={{flexDirection: 'row'}}>
              <Text
                style={{
                  marginLeft: 1,
                  fontSize: 16,
                  fontFamily: 'Poppins-SemiBold',
                  flex: 1.8,
                  textAlign: 'left',
                  color: '#101010',
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
                    color: '#101010',
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
                    color: '#101010',
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
                  letterSpacing: 3,
                  marginRight: 5,
                  color: '#101010',
                }}>
                #{this.props.ID}
              </Text>
              {/* <View style={{flexDirection: 'row'}}>
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
              </View> */}
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: 'Poppins-Bold',
                  textAlign: 'right',
                  flex: 1,
                  color: '#101010',
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
                          color: '#101010',
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
            <View>
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
                  1. {this?.props?.products[0]?.name || '_'}
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    fontFamily: 'Poppins-Bold',
                    flex: 1,
                    textAlign: 'right',
                    color: '#000',
                  }}>
                  Total {this.props.products?.length || '_'}{' '}
                  {this.props.products?.length == 1 ? 'item' : 'items'}
                </Text>
              </View>
              {
                <View style={styles.productViewAllContainer}>
                  <Text
                    style={{
                      fontSize: 12,
                      color: '#21272E',
                      fontFamily: 'Poppins-Regular',
                      marginBottom: 5,
                      flex: 1.8,
                      textAlign: 'left',
                      opacity: this?.props?.products[1]?.name ? 1 : 0,
                    }}>
                    2. {this?.props?.products[1]?.name || '_'}
                  </Text>
                  <TouchableOpacity
                    style={styles.viewAllBtn}
                    onPress={() => this.props.onPress()}>
                    <Text
                      style={{
                        fontSize: 12,
                        color: '#337D3E',
                      }}>
                      View All
                      {/* {this?.props?.products?.length >= 2
                        ? 'View All'
                        : 'View Details'} */}
                    </Text>
                    <Entypo
                      name="chevron-small-right"
                      size={wp(4)}
                      color="#337D3E"
                    />
                  </TouchableOpacity>
                </View>
              }
            </View>
          </View>
          <KeyboardAvoidingView>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              {this.props.storeType != 'default' && (
                <>
                  {this.props.order_status_id != 1 ? (
                    <TouchableOpacity
                      onPress={() => this.acceptOrder(this.props.ID)}
                      style={styles.commonActionButton}>
                      <Ionicons
                        name="checkmark-circle"
                        size={20}
                        color="white"
                      />

                      <View>
                        <Text style={styles.TextStyle}> Accept </Text>
                      </View>
                    </TouchableOpacity>
                  ) : (
                    <></>
                  )}
                </>
              )}

              {this.props.storeType === 'default' && (
                <TouchableOpacity
                  onPress={() => this.acceptOrder(this.props.ID)}
                  style={styles.commonActionButton}>
                  <Ionicons name="checkmark-circle" size={20} color="white" />
                  <View>
                    <Text style={styles.TextStyle}> Accept </Text>
                  </View>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={[
                  styles.commonActionButton,
                  {backgroundColor: '#D65949'},
                ]}
                onPress={() => this.openBottomSheetForDecline()}>
                <Ionicons name="close-circle" size={20} color="white" />
                <View>
                  <Text style={styles.TextStyle}>Reject</Text>
                </View>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
          <KeyboardAvoidingView>
            <RBSheet
              ref={ref => {
                this.RBSheet = ref;
              }}
              height={500}
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
                source={require('../assets/sucess3x.png')}
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
                  Accept order
                </Text>
                <Text
                  style={{
                    color: '#11151A',
                    fontSize: 14,

                    textAlign: 'center',
                  }}>
                  Happy Customer Good For Business
                </Text>
                {this.props.item.deliveryType == '2' &&
                  this.props.item.deliveryMethod != 'S' && (
                    <>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'center',
                          marginRight: '5%',
                        }}>
                        <TouchableOpacity
                          style={{marginTop: '6.5%'}}
                          onPress={() =>
                            this.props.setSelectedProvider('Self')
                          }>
                          <Image
                            style={{
                              width: 20,
                              height: 20,
                              resizeMode: 'contain',
                              shadowColor: 'black',
                              marginBottom: 15,
                              marginRight: '5%',
                            }}
                            source={
                              this.props.selectedProvider == 'Self'
                                ? require('../assets/right.png')
                                : require('../assets/success.png')
                            }
                          />
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => this.props.setSelectedProvider('Self')}
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
                            source={require('../assets/icon.png')}
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
                          onPress={() =>
                            this.props.setSelectedProvider('Wroti')
                          }>
                          <Image
                            style={{
                              width: 20,
                              height: 20,
                              resizeMode: 'contain',
                              shadowColor: 'black',
                              marginBottom: 15,
                              marginRight: '5%',
                            }}
                            source={
                              this.props.selectedProvider == 'Wroti'
                                ? require('../assets/right.png')
                                : require('../assets/success.png')
                            }
                          />
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() =>
                            this.props.setSelectedProvider('Wroti')
                          }
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
                              source={require('../assets/Wroti_Logo_White.png')}
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
                    placeholderTextColor={'grey'}
                    value={this.state.name}
                    underlineColorAndroid="#fff"
                    onChangeText={text => this.handleText(text)}
                    style={{
                      height: 75,
                      // borderWidth: 1,
                      borderColor: 'lightgrey',
                      paddingHorizontal: 6,
                      width: responsiveWidth(80),
                      borderWidth: 1,
                      alignSelf: 'center',
                      color: '#000',
                    }}
                    onSubmitEditing={this.onPress}
                  />
                </View>

                <CustomLoadingButton
                  ref={c => (this.state.dataa.getStartedButton = c)}
                  width={328}
                  height={52}
                  title="Continue"
                  titleFontSize={18}
                  titleFontFamily="Poppins-Bold"
                  titleColor="#FFF"
                  backgroundColor="#34A549"
                  borderRadius={4}
                  onPress={() => {
                    this.onPress();
                  }}
                />
              </View>
            </RBSheet>
            <RBSheet
              ref={ref => {
                this.state.data.RBSheetLogout = ref;
              }}
              height={550}
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
                  height: 80,
                  alignSelf: 'center',
                  resizeMode: 'stretch',
                }}
                source={require('../assets/sucess3x.png')}
              />
              <View>
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

                <View style={{marginHorizontal: 4, marginVertical: 10}}>
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
                      data={this.props.reasons}
                      numColumns={1}
                      scrollEnabled={false}
                      renderItem={({item, index}) => (
                        <TouchableOpacity
                          onPress={() => this.props.code(item.name)}>
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                            }}>
                            <RadioButton.Android
                              onPress={() => this.props.code(item.name)}
                              uncheckedColor="#2ea048"
                              status={
                                item.name === this.props.setcode
                                  ? 'checked'
                                  : 'unchecked'
                              }
                            />
                            <Text style={{color: 'black'}}>{item.name}</Text>
                          </View>
                        </TouchableOpacity>
                      )}
                    />
                  </View>
                  <TextInput
                    multiline={true}
                    placeholder="Leave a comments"
                    placeholderTextColor={'grey'}
                    underlineColorAndroid="#fff"
                    onChangeText={text => this.handleDeclineText(text)}
                    style={{
                      height: 75,
                      borderWidth: 1,
                      borderColor: 'lightgrey',
                      paddingHorizontal: 6,
                      color: '#000',
                    }}
                    onSubmitEditing={this.onPress}
                  />
                </View>
                <CustomLoadingButton
                  ref={c => (this.state.dataa.getStartedButton = c)}
                  width={328}
                  height={52}
                  title={'Continue'}
                  titleFontSize={18}
                  titleFontFamily={'Poppins-Bold'}
                  titleColor="#FFF"
                  backgroundColor="#34A549"
                  borderRadius={4}
                  onPress={() => {
                    this.onpress();
                  }}
                />
              </View>
            </RBSheet>
          </KeyboardAvoidingView>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F2F7F9',
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
  },

  SubmitButtonStyles: {
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
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: 'Poppins-SemiBold',
    marginLeft: 5,
  },
  commonActionButton: {
    marginTop: 10,
    width: wp(44),
    height: hp(4.5),
    backgroundColor: '#337D3E',
    borderRadius: wp(1.5),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: hp(0.3),
  },
  productViewAllContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  viewAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: wp(0.5),
    borderWidth: 1,
    borderColor: '#D8E8EF',
    padding: wp(1),
    borderRadius: wp(1),
  },
});
