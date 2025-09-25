import React, {useEffect} from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Image,
  StatusBar,
  FlatList,
  Linking,
} from 'react-native';
import {useTheme} from '@react-navigation/native';
import {ScrollView} from 'react-native-gesture-handler';
import {Divider} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DeveloperAPIClient from '../state/middlewares/DeveloperAPIClient';
//import NetworkChecker from "react-native-network-checker";

const CustomersDetailsScreen = ({navigation, route}) => {
  const {colors} = useTheme();
  const [userName, setuserName] = React.useState();
  const [userPhone, setuserTelephone] = React.useState();
  const [customerAddress, setCustomerAddress] = React.useState();
  const [customerInGroups, setCustomerInGroups] = React.useState();
  const [revenue, setRevenue] = React.useState();
  const [main_tab_key, setMainTabKey] = React.useState('Past Orders');
  const [customerDetails, setCustomerDetails] = React.useState();
  const [previouscount, setpreviouscount] = React.useState();
  const [Currency_Code, setCurrency_Code] = React.useState('INR');

  const MainTab = {
    'Past Orders': {
      'Past Orders': {
        image: require('../assets/newbox3x.png'),
        count: previouscount,
      },
      'Revenue\r\nGenerated': {
        image: require('../assets/rupee.png'),
        count: revenue,
      },
    },
  };

  const loadUser = async () => {
    let Currency_Code = await AsyncStorage.getItem('Currency_Code');
    if (Currency_Code != null && Currency_Code != 'undefined') {
      setCurrency_Code(Currency_Code);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  const customerDetailsById = async () => {
    const api = new DeveloperAPIClient();
    let Token = await AsyncStorage.getItem('token');
    let customer_id = route.params.customer_id;
    let Currency_Code = await AsyncStorage.getItem('Currency_Code');
    let getCustomerDetailsById = await api.getCustomerDetailsById(
      Token,
      customer_id,
    );
    if (getCustomerDetailsById.data.customerdetails.totalrevenue == null) {
      setRevenue(0 + ' ' + Currency_Code);
    } else {
      setRevenue(
        getCustomerDetailsById.data.customerdetails.totalrevenue +
          ' ' +
          Currency_Code,
      );
    }

    if (
      getCustomerDetailsById.data.customerdetails.customeraddress !=
        undefined ||
      getCustomerDetailsById.data.customerdetails.customeraddress != []
    ) {
      setCustomerAddress(
        getCustomerDetailsById.data.customerdetails.customeraddress.fulladdress,
      );
    }

    setCustomerDetails(getCustomerDetailsById.data.customerdetails);

    setCustomerInGroups(
      getCustomerDetailsById.data.customerdetails.customeringroups,
    );
  };

  const previousordercount = async () => {
    let UserMobile = await AsyncStorage.getItem('MobileNumber');
    const api = new DeveloperAPIClient();

    let customer_id = route.params.customer_id;
    let ordercount = await api.getordercount(UserMobile, customer_id);
    if (ordercount.data.count == 'Please provide valid customer_id.') {
      setpreviouscount(0);
    } else {
      setpreviouscount(ordercount.data.count);
    }
  };

  const dialCall = number => {
    let phoneNumber = '';
    if (Platform.OS === 'android') {
      phoneNumber = `tel:${userPhone}`;
    } else {
      phoneNumber = `telprompt:${userPhone}`;
    }
    Linking.openURL(phoneNumber);
  };

  const openWhatsapp = number => {
    let phoneNumber = '';
    if (Platform.OS === 'android') {
      phoneNumber = `tel:${userPhone}`;
    } else {
      phoneNumber = `telprompt:${userPhone}`;
    }
    Linking.openURL(`whatsapp://send?text=&phone=${userPhone}`);
  };

  const renderItem = ({item}) => (
    <View style={{marginLeft: '8%', marginBottom: 10}}>
      <ScrollView>
        <Text
          style={{
            fontFamily: 'Poppins-Medium',
            fontSize: 14,
            marginTop: '5%',
          }}>
          {item.name}
        </Text>
        <Text
          style={{
            fontFamily: 'Poppins-Regular',
            fontSize: 12,
            color: '#9BA0A7',
          }}>
          Customer Group Id : {item.customer_group_id}
        </Text>
      </ScrollView>
    </View>
  );

  useEffect(() => {
    setuserName(route.params.name);
    setuserTelephone(route.params.phone);
    // previousordercount();
    customerDetailsById();
  }, []);

  const theme = useTheme();
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
              source={require('../assets/back3x.png')}
            />
          </TouchableOpacity>
          <View style={{flexDirection: 'row'}}>
            <Text style={styles.headerTitle}>Customer </Text>
          </View>
        </View>

        <ScrollView>
          <View style={{marginVertical: 10}}>
            <View
              style={{
                marginHorizontal: 20,
                backgroundColor: 'white',
                elevation: 2,
                padding: 10,
                borderRadius: 5,
                marginVertical: 5,
                height: 270,
              }}>
              <View
                style={{alignItems: 'center', marginBottom: 5, marginTop: 5}}>
                <Image source={require('../assets/profile.png')} />
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: 'Poppins-Medium',
                    color: '#21272E',
                    marginTop: '5%',
                  }}>
                  {route.params.name}
                </Text>
                <Text
                  style={{
                    fontSize: 13,
                    fontFamily: 'Poppins-Regular',
                    color: '#9BA0A7',
                  }}>
                  {userPhone}
                </Text>
              </View>
              <Divider />
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginHorizontal: '10%',
                  marginTop: '8%',
                }}>
                <TouchableOpacity onPress={dialCall} style={{marginTop: '4%'}}>
                  <Image source={require('../assets/call.png')} />
                  <Text
                    style={{
                      marginTop: 5,
                      fontFamily: 'Poppins-Medium',
                      fontSize: 14,
                      color: '#64686E',
                    }}>
                    Call
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={openWhatsapp}
                  style={{alignItems: 'center'}}>
                  <Image
                    style={{width: 28, height: 28}}
                    source={require('../assets/wp3.png')}
                  />
                  <Text
                    style={{
                      marginTop: 5,
                      fontFamily: 'Poppins-Medium',
                      fontSize: 14,
                      color: '#64686E',
                    }}>
                    Message
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity style={{alignItems: 'center'}}>
                  <Image
                    style={{width: 28, height: 28}}
                    source={require('../assets/language.png')}
                  />
                  <Text
                    style={{
                      marginTop: 5,
                      fontFamily: 'Poppins-Medium',
                      fontSize: 14,
                      color: '#64686E',
                    }}>
                    English
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <View
              style={{
                marginHorizontal: 20,
                backgroundColor: 'white',
                elevation: 2,
                padding: 10,
                borderRadius: 5,
                marginVertical: 8,
                height: 200,
              }}>
              <Text
                style={{
                  fontFamily: 'Poppins-Medium',
                  fontSize: 12,
                  color: '#9BA0A7',
                  marginLeft: 5,
                  marginTop: 4,
                }}>
                Order history
              </Text>

              <View
                style={{
                  flexDirection: 'row',
                }}>
                {Object.keys(MainTab[main_tab_key]) &&
                  Object.keys(MainTab[main_tab_key]).map((val, i) => {
                    return (
                      <View
                        style={{
                          backgroundColor: '#F2F7F9',
                          margin: 5,
                          padding: 3,
                          height: 150,
                          width: 140,
                          borderRadius: 3,
                          borderColor: '#337D3E',
                          marginTop: '5%',
                        }}>
                        <View style={{alignItems: 'flex-end', margin: 5}}>
                          <Image
                            source={MainTab[main_tab_key][val]['image']}
                            style={{
                              width: 45,
                              height: 35,
                              resizeMode: 'contain',
                            }}
                          />
                        </View>
                        <Text
                          style={{
                            color: '#373D43',
                            fontFamily: 'Poppins-SemiBold',
                            fontSize: 18,
                            textAlign: 'left',
                          }}>
                          {MainTab[main_tab_key][val]['count']}
                        </Text>
                        <Text
                          style={{
                            color: '#373D43',
                            fontFamily: 'Poppins-SemiBold',
                            fontSize: 14,
                            textAlign: 'left',
                          }}
                          numberOfLines={3}>
                          {val}
                        </Text>
                      </View>
                    );
                  })}
              </View>
            </View>
            {customerAddress != undefined ? (
              <View
                style={{
                  marginHorizontal: 20,
                  backgroundColor: 'white',
                  elevation: 2,
                  padding: 10,
                  borderRadius: 5,
                  marginVertical: 8,
                }}>
                <Text
                  style={{
                    fontFamily: 'Poppins-Medium',
                    fontSize: 12,
                    color: '#9BA0A7',
                    marginLeft: 5,
                    marginTop: 4,
                  }}>
                  Address
                </Text>

                <View style={{flexDirection: 'row', marginTop: 10}}>
                  <TouchableOpacity
                    style={{
                      alignItems: 'flex-start',
                      marginLeft: 9,
                      color: '#64686E',
                    }}>
                    <Image source={require('../assets/location.png')} />
                  </TouchableOpacity>

                  <TouchableOpacity>
                    <Text
                      style={{
                        fontFamily: 'Poppins-Regular',
                        fontSize: 12,
                        color: '#64686E',
                        marginTop: 2.5,
                        flexWrap: 'wrap',
                        width: 270,
                      }}
                      numberOfLines={2}>
                      {customerAddress}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View
                style={{
                  marginHorizontal: 20,
                  backgroundColor: 'white',
                  elevation: 2,
                  padding: 10,
                  borderRadius: 5,
                  marginVertical: 8,
                }}>
                <Text
                  style={{
                    fontFamily: 'Poppins-Medium',
                    fontSize: 12,
                    color: '#9BA0A7',
                    marginLeft: 5,
                    marginTop: 4,
                  }}>
                  Address
                </Text>

                <View style={{flexDirection: 'row', marginTop: 10}}>
                  <TouchableOpacity
                    style={{
                      alignItems: 'flex-start',
                      marginLeft: 9,
                      color: '#64686E',
                    }}>
                    <Image source={require('../assets/location.png')} />
                  </TouchableOpacity>

                  <TouchableOpacity>
                    <Text
                      style={{
                        fontFamily: 'Poppins-Regular',
                        fontSize: 12,
                        color: '#64686E',
                        marginTop: 2.5,
                      }}
                      numberOfLines={2}>
                      No Address Found
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            <View
              style={{
                marginHorizontal: 20,
                backgroundColor: 'white',
                elevation: 2,
                padding: 10,
                borderRadius: 5,
                marginVertical: 8,
              }}>
              <Text
                style={{
                  fontFamily: 'Poppins-Medium',
                  fontSize: 12,
                  color: '#9BA0A7',
                  marginLeft: 5,
                  marginTop: 4,
                }}>
                Groups
              </Text>
              <FlatList data={customerInGroups} renderItem={renderItem} />
            </View>
          </View>
        </ScrollView>
      </>
    </View>
  );
};

export default CustomersDetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F5F7',
  },
  headerTitle: {
    color: '#2B2520',
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
    marginLeft: '45%',
  },
  header: {
    flexDirection: 'row',
    marginHorizontal: 5,
    marginVertical: 15,
  },
  item: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    marginTop: 15,
    marginLeft: '10%',
  },
});
