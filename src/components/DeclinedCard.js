import React, {useState} from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Image,
  TextInput,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RBSheet from 'react-native-raw-bottom-sheet';
import moment from 'moment';
import DeveloperAPIClient from '../state/middlewares/DeveloperAPIClient';

export default class OrderCard extends React.Component {
  updatestatusorder = () => {
    this.props.statusUpdate(
      this.props.order_id,
      this.props.order_status_id,
      this.state.name,
      this.props.customer_mobile,
    );
  };
  state = {
    name: '',
    deliveryDetails: {},
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
    // setDeliveryDetails(response.data)
  };

  constructor(props) {
    super(props);
    this.loadOrdersByOrderId();
  }

  handleText = text => {
    this.setState({name: text});
  };

  onPress = () => {
    this.updatestatusorder(), this.RBSheet.close();
  };

  render() {
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        style={styles.container}
        onPress={this.props.onPress}>
        <View>
          <View style={{flexDirection: 'row'}}>
            <Text
              style={{
                marginLeft: 1,
                fontSize: 16,
                fontFamily: 'Poppins-SemiBold',
                flex: 1.8,
                textAlign: 'left',
                color: '#000',
              }}>
              {this?.props?.name || '--'}
            </Text>
            <Text
              style={{
                fontSize: 12,
                fontFamily: 'Poppins-Regular',
                textAlign: 'right',
                flex: 1.3,
                color: '#000',
              }}>
              {/* {this.props.time} */}
              {moment(this.props.time).local().format('DD-MMM-YYYY, hh:mm a')}
            </Text>
          </View>
          <View style={{flexDirection: 'row'}}>
            <Text
              style={{
                fontSize: 12,
                fontFamily: 'Poppins-Regular',
                marginRight: 5,
                letterSpacing: 3,
                color: '#000',
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
                color: '#000',
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
                // alignItems: "center",
                // justifyContent: "center",
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
          <View style={{flexDirection: 'row'}}>
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
            <Text
              style={{
                color: 'red',
                marginTop: '1%',
                marginBottom: 3,
                fontStyle: 'Poppins-Medium',
                flex: 1,
                textAlign: 'right',
                fontSize: 12,
              }}>
              Rejected
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
                1. {this.props?.products?.[0]?.name || ''}
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: 'Poppins-Bold',
                  flex: 1,
                  textAlign: 'right',
                  color: '#000',
                }}>
                Total {this.props?.products?.length || 0}
                items
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
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
    marginBottom: 15,
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: 'Poppins-SemiBold',
  },
});
