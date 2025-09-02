import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StatusBar,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import {useTheme} from '@react-navigation/native';
import {Divider, Menu} from 'react-native-paper';
import {Card} from 'react-native-paper';
import {useDispatch, useSelector} from 'react-redux';
import * as couponActions from '../redux/actions/couponActions';
import moment from 'moment';
import RBSheet from 'react-native-raw-bottom-sheet';
import DeveloperAPIClient from '../state/middlewares/DeveloperAPIClient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-simple-toast';

const CouponsScreen = ({navigation}) => {
  const theme = useTheme();
  const {colors} = useTheme();

  const dispatch = useDispatch();
  const [displayCoupons, setDisplayCoupons] = React.useState();
  const [isLoadMore, setIsLoadMore] = React.useState(true);
  const couponsData = useSelector(state => state.coupons.loadCoupons);
  const couponsCount = useSelector(state => state.coupons.total);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [currencyCode, setCurrencyCode] = React.useState();
  const [deleteCouponId, setDeleteCouponId] = React.useState();
  const [deleteCouponName, setDeleteCouponName] = React.useState();
  const [searchKey, setSearchKey] = React.useState();
  const [searchResults, setSearchResults] = React.useState();
  const [isCouponSearched, setIsCouponSearched] = React.useState(false);
  const [refreshing, setRefreshing] = React.useState(true);
  const [couponEditFromSearch, setCouponEditFromSearch] = React.useState(false);

  const [data, setData] = React.useState({
    RBSheetDeleteCoupon: {},
    RBSheetEditGroup: {},
    getStartedButton: {},
  });

  const loadCoupons = async (currentPage = 1, search_key = '') => {
    // let search_key = ''
    let Currency_Code = await AsyncStorage.getItem('Currency_Code');
    setCurrencyCode(Currency_Code);
    setDisplayCoupons();
    setRefreshing(true);
    dispatch(couponActions.refreshCouponData());
    dispatch(couponActions.loadCoupons(currentPage, search_key));
    setRefreshing(false);
  };

  console.log('----------***********', displayCoupons);

  useEffect(() => {
    if (couponsData) {
      if (couponsCount == 10 || couponsData.length < 10) {
        setIsLoadMore(false);
      } else {
        setIsLoadMore(true);
      }
      if (displayCoupons && currentPage > 1) {
        setDisplayCoupons([...displayCoupons, ...couponsData]);
      } else {
        setDisplayCoupons(couponsData);
      }
    }
  }, [couponsData]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadCoupons(1, searchKey);
      searchCoupon(searchKey);
    });
    return unsubscribe;
  }, []);

  const _handleLoadMore = async () => {
    if (isLoadMore) {
      dispatch(couponActions.loadCoupons(currentPage + 1));
      setCurrentPage(currentPage + 1);
    }
  };

  const onPressDeleteCouponRbSheet = (couponId, couponName) => {
    setDeleteCouponId(couponId);
    setDeleteCouponName(couponName);
  };

  const deleteCoupon = async coupon_id => {
    const api = new DeveloperAPIClient();
    let Token = await AsyncStorage.getItem('token');
    let UserMobile = await AsyncStorage.getItem('MobileNumber');
    let deletedData = await api.getDeleteCoupons(UserMobile, Token, coupon_id);
    if (
      deletedData != null &&
      deletedData != undefined &&
      deletedData.data.success == true
    ) {
      setDisplayCoupons();
      // loadCoupons();
      searchCoupon(searchKey);
      Toast.showWithGravity('Coupon Deleted !', Toast.LONG, Toast.BOTTOM);
    } else {
      Toast.showWithGravity(
        'Opps Something Went Wrong...',
        Toast.LONG,
        Toast.BOTTOM,
      );
    }
  };

  const onDeleteCoupon = val => {
    deleteCoupon(val);
    data.RBSheetDeleteCoupon.close();
  };

  const editCoupon = async item => {
    item.isEdited = true;
    setCouponEditFromSearch(true);
    navigation.navigate('AddCouponsScreen', {
      couponObject: item,
    });
  };

  const searchCoupon = async val => {
    setSearchKey(val);
    if (val != null && val != '' && val.length > 0) {
      let offset = 1;
      let api = new DeveloperAPIClient();
      let UserMobile = await AsyncStorage.getItem('MobileNumber');
      let Token = await AsyncStorage.getItem('token');
      let CouponData = await api.getCoupons(UserMobile, Token, offset, val);
      if (CouponData.data.success == true) {
        setIsCouponSearched(true);
        setSearchResults(CouponData.data.coupons);
        setCurrentPage(1);
      } else setSearchResults(), setIsCouponSearched(true);
    } else {
      setSearchResults();
      // setCurrentPage(1);
      loadCoupons();
      setIsCouponSearched(false);
    }
  };

  const deleteCouponRenderItem = ({item, index}) => (
    <View>
      <TouchableOpacity>
        <Card style={{marginTop: 5}}>
          <Card.Content header bordered style={styles.cardHeader}>
            <Text style={styles.subheading}>Coupon Id : {item.coupon_id}</Text>
            <View style={{flex: 1, alignItems: 'flex-end'}}>
              <TouchableOpacity
                onPress={() => editCoupon(item)}
                style={{marginRight: 8}}>
                <Image
                  style={{
                    width: 25,
                    height: 25,
                    //resizeMode: "center",
                    // marginLeft: "80%",
                    flexDirection: 'row',
                  }}
                  source={require('../assets/edit.png')}
                />
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              onPress={() => {
                data.RBSheetDeleteCoupon.open(),
                  onPressDeleteCouponRbSheet(item.coupon_id, item.name);
              }}>
              <Image
                style={{
                  width: 25,
                  height: 25,
                  flexDirection: 'row',
                }}
                source={require('../assets/delete.png')}
              />
            </TouchableOpacity>
            <RBSheet
              ref={ref => {
                data.RBSheetDeleteCoupon = ref;
              }}
              height={200}
              openDuration={250}
              customStyles={{
                container: {
                  justifyContent: 'center',
                  borderTopRightRadius: 30,
                  borderTopLeftRadius: 30,
                },
              }}>
              <View>
                <Text
                  style={{
                    fontSize: 20,
                    fontFamily: 'Poppins-Bold',
                    color: '#11151A',
                    marginVertical: 10,
                    textAlign: 'center',
                  }}>
                  Delete Coupon
                </Text>
                <Text
                  style={{
                    color: '#11151A',
                    fontSize: 14,
                    fontFamily: 'Poppins-Regular',
                    textAlign: 'center',
                  }}>
                  Are you sure you want to delete {`\n`}
                  {deleteCouponName}(Coupon Id : {deleteCouponId}) ?
                </Text>
                <TouchableOpacity
                  style={{
                    width: '90%',
                    height: 45,
                    paddingTop: 12,
                    paddingBottom: 15,
                    backgroundColor: '#E26251',
                    borderRadius: 10,
                    borderWidth: 1,
                    borderColor: '#fff',
                    marginTop: 30,
                    marginLeft: 18,
                  }}
                  activeOpacity={0.6}
                  onPress={() => {
                    onDeleteCoupon(deleteCouponId);
                  }}>
                  <Text
                    style={{
                      textAlign: 'center',
                      fontFamily: 'Poppins-Bold',
                      fontSize: 16,
                      color: '#FFFFFF',
                    }}>
                    Delete{' '}
                  </Text>
                </TouchableOpacity>
              </View>
            </RBSheet>
          </Card.Content>
          <Card.Content>
            <View>
              <Text
                style={{
                  fontSize: 18,
                  fontFamily: 'Poppins-Bold',
                  marginBottom: 10,
                  flex: 1.8,
                }}>
                {item.name}
              </Text>
              <View style={{flexDirection: 'row'}}>
                <Text style={{fontSize: 15, fontFamily: 'Poppins-Regular'}}>
                  Coupon Code
                </Text>
                <Text
                  style={{
                    fontSize: 15,
                    fontFamily: 'Poppins-Regular',
                    marginLeft: '1.5%',
                  }}>
                  :
                </Text>
                <Text
                  style={{
                    fontSize: 15,
                    fontFamily: 'Poppins-Medium',
                    marginLeft: 'auto',
                  }}>
                  {item.code}{' '}
                </Text>
              </View>

              <View style={{flexDirection: 'row'}}>
                <Text style={{fontSize: 15, fontFamily: 'Poppins-Regular'}}>
                  Discount
                </Text>
                <Text
                  style={{
                    fontSize: 15,
                    fontFamily: 'Poppins-Regular',
                    marginLeft: '18.5%',
                  }}>
                  :
                </Text>
                <Text
                  style={{
                    fontSize: 15,
                    fontFamily: 'Poppins-Medium',
                    marginLeft: 'auto',
                  }}>
                  {item.type === 'P'
                    ? `${item.discount} %`
                    : item.type === 'F' && `${currencyCode} ${item.discount}`}
                </Text>
              </View>

              <View style={{flexDirection: 'row'}}>
                <Text style={{fontSize: 15, fontFamily: 'Poppins-Regular'}}>
                  Type
                </Text>
                <Text
                  style={{
                    fontSize: 15,
                    fontFamily: 'Poppins-Regular',
                    marginLeft: '30.5%',
                  }}>
                  :
                </Text>
                <Text
                  style={{
                    fontSize: 15,
                    fontFamily: 'Poppins-Medium',
                    marginLeft: 'auto',
                  }}>
                  {item.type === 'P'
                    ? 'Percentage'
                    : item.type === 'F' && 'Fixed'}{' '}
                </Text>
              </View>

              <View style={{flexDirection: 'row'}}>
                <Text style={{fontSize: 15, fontFamily: 'Poppins-Regular'}}>
                  Start Date
                </Text>
                <Text
                  style={{
                    fontSize: 15,
                    fontFamily: 'Poppins-Regular',
                    marginLeft: '14%',
                  }}>
                  :
                </Text>
                <Text
                  style={{
                    fontSize: 15,
                    fontFamily: 'Poppins-Medium',
                    marginLeft: 'auto',
                  }}>
                  {moment
                    .utc(`${item.date_start}`)
                    .local()
                    .format('DD/MMM/YYYY')}
                </Text>
              </View>

              <View style={{flexDirection: 'row'}}>
                <Text style={{fontSize: 15, fontFamily: 'Poppins-Regular'}}>
                  End Date
                </Text>
                <Text
                  style={{
                    fontSize: 15,
                    fontFamily: 'Poppins-Regular',
                    marginLeft: '17.5%',
                  }}>
                  :
                </Text>
                <Text
                  style={{
                    fontSize: 15,
                    fontFamily: 'Poppins-Medium',
                    marginLeft: 'auto',
                  }}>
                  {moment.utc(`${item.date_end}`).local().format('DD/MMM/YYYY')}
                </Text>
              </View>

              <View style={{flexDirection: 'row'}}>
                <Text style={{fontSize: 15, fontFamily: 'Poppins-Regular'}}>
                  Status
                </Text>
                <Text
                  style={{
                    fontSize: 15,
                    fontFamily: 'Poppins-Regular',
                    marginLeft: '25.5%',
                  }}>
                  :
                </Text>
                <Text
                  style={{
                    fontSize: 15,
                    fontFamily:
                      item.status == 1 ? 'Poppins-Bold' : 'Poppins-Medium',
                    marginLeft: 'auto',
                    color: item.status == 1 ? '#34A549' : '#E23939',
                  }}>
                  {item.status == 1 ? 'Enabled' : 'Disabled'}{' '}
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>
      </TouchableOpacity>
    </View>
  );

  // const renderItem1 = ({ item, index }) => (
  //   // <TemplateCard />
  //   <Image style={{width:'100%',height:200,resizeMode:'stretch'}} source={require('../assets/couponBg.png')}/>
  // );

  const renderItem = ({item, index}) => (
    <View style={{marginHorizontal: 10}}>
      <TouchableOpacity activeOpacity={1}>
        <Card style={{marginBottom: 15}}>
          <Card.Content header bordered style={styles.cardHeader}>
            <Text style={styles.subheading}>Coupon Id : {item.coupon_id}</Text>
            <View style={{flex: 1, alignItems: 'flex-end'}}>
              <TouchableOpacity
                onPress={() => editCoupon(item)}
                style={{marginRight: 8}}>
                <Image
                  style={{
                    width: 25,
                    height: 25,
                    flexDirection: 'row',
                  }}
                  source={require('../assets/edit.png')}
                />
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              onPress={() => {
                data.RBSheetDeleteCoupon.open(),
                  onPressDeleteCouponRbSheet(item.coupon_id, item.name);
              }}>
              <Image
                style={{
                  width: 25,
                  height: 25,
                  flexDirection: 'row',
                }}
                source={require('../assets/delete.png')}
              />
            </TouchableOpacity>
            <RBSheet
              ref={ref => {
                data.RBSheetDeleteCoupon = ref;
              }}
              height={200}
              openDuration={250}
              customStyles={{
                container: {
                  justifyContent: 'center',
                  borderTopRightRadius: 30,
                  borderTopLeftRadius: 30,
                },
              }}>
              <View>
                <Text
                  style={{
                    fontSize: 20,
                    fontFamily: 'Poppins-Bold',
                    color: '#11151A',
                    marginVertical: 10,
                    textAlign: 'center',
                  }}>
                  Delete Coupon
                </Text>
                <Text
                  style={{
                    color: '#11151A',
                    fontSize: 14,
                    fontFamily: 'Poppins-Regular',
                    textAlign: 'center',
                  }}>
                  Are you sure you want to delete {`\n`}
                  {deleteCouponName}(Coupon Id : {deleteCouponId}) ?
                </Text>
                <TouchableOpacity
                  style={{
                    width: '90%',
                    height: 45,
                    paddingTop: 12,
                    paddingBottom: 15,
                    backgroundColor: '#E26251',
                    borderRadius: 10,
                    borderWidth: 1,
                    borderColor: '#fff',
                    marginTop: 30,
                    marginLeft: 18,
                  }}
                  activeOpacity={0.6}
                  onPress={() => {
                    onDeleteCoupon(deleteCouponId);
                  }}>
                  <Text
                    style={{
                      textAlign: 'center',
                      fontFamily: 'Poppins-Bold',
                      fontSize: 16,
                      color: '#FFFFFF',
                    }}>
                    Delete{' '}
                  </Text>
                </TouchableOpacity>
              </View>
            </RBSheet>
          </Card.Content>
          <Card.Content>
            <View>
              <Text
                style={{
                  fontSize: 18,
                  fontFamily: 'Poppins-Bold',
                  marginBottom: 10,
                  flex: 1.8,
                  color: '#000',
                }}>
                {item.name}
              </Text>
              <View style={{flexDirection: 'row'}}>
                <Text
                  style={{
                    fontSize: 15,
                    fontFamily: 'Poppins-Regular',
                    color: '#000',
                  }}>
                  Coupon Code
                </Text>
                <Text
                  style={{
                    fontSize: 15,
                    fontFamily: 'Poppins-Regular',
                    marginLeft: '1.5%',
                    color: '#000',
                  }}>
                  :
                </Text>
                <Text
                  style={{
                    fontSize: 15,
                    fontFamily: 'Poppins-Medium',
                    marginLeft: 'auto',
                    color: '#000',
                  }}>
                  {item.code}{' '}
                </Text>
              </View>

              <View style={{flexDirection: 'row'}}>
                <Text
                  style={{
                    fontSize: 15,
                    fontFamily: 'Poppins-Regular',
                    color: '#000',
                  }}>
                  Discount
                </Text>
                <Text
                  style={{
                    fontSize: 15,
                    fontFamily: 'Poppins-Regular',
                    marginLeft: '18.5%',
                    color: '#000',
                  }}>
                  :
                </Text>
                <Text
                  style={{
                    fontSize: 15,
                    fontFamily: 'Poppins-Medium',
                    marginLeft: 'auto',
                    color: '#000',
                  }}>
                  {item.type === 'P'
                    ? `${parseFloat(item.discount).toFixed(2)} %`
                    : `${currencyCode} ${parseFloat(item.discount).toFixed(2)}`}
                </Text>
              </View>

              <View style={{flexDirection: 'row'}}>
                <Text
                  style={{
                    fontSize: 15,
                    fontFamily: 'Poppins-Regular',
                    color: '#000',
                  }}>
                  Type
                </Text>
                <Text
                  style={{
                    fontSize: 15,
                    fontFamily: 'Poppins-Regular',
                    marginLeft: '30.5%',
                    color: '#000',
                  }}>
                  :
                </Text>
                <Text
                  style={{
                    fontSize: 15,
                    fontFamily: 'Poppins-Medium',
                    marginLeft: 'auto',
                    color: '#000',
                  }}>
                  {item.type === 'P' ? 'Percentage' : 'Fixed'}{' '}
                </Text>
              </View>

              <View style={{flexDirection: 'row'}}>
                <Text
                  style={{
                    fontSize: 15,
                    fontFamily: 'Poppins-Regular',
                    color: '#000',
                  }}>
                  Start Date
                </Text>
                <Text
                  style={{
                    fontSize: 15,
                    fontFamily: 'Poppins-Regular',
                    marginLeft: '14%',
                    color: '#000',
                  }}>
                  :
                </Text>
                <Text
                  style={{
                    fontSize: 15,
                    fontFamily: 'Poppins-Medium',
                    marginLeft: 'auto',
                    color: '#000',
                  }}>
                  {moment
                    .utc(`${item.date_start}`)
                    .local()
                    .format('DD/MMM/YYYY')}
                </Text>
              </View>

              <View style={{flexDirection: 'row'}}>
                <Text
                  style={{
                    fontSize: 15,
                    fontFamily: 'Poppins-Regular',
                    color: '#000',
                  }}>
                  End Date
                </Text>
                <Text
                  style={{
                    fontSize: 15,
                    fontFamily: 'Poppins-Regular',
                    marginLeft: '17.5%',
                    color: '#000',
                  }}>
                  :
                </Text>
                <Text
                  style={{
                    fontSize: 15,
                    fontFamily: 'Poppins-Medium',
                    marginLeft: 'auto',
                    color: '#000',
                  }}>
                  {moment.utc(`${item.date_end}`).local().format('DD/MMM/YYYY')}
                </Text>
              </View>

              <View style={{flexDirection: 'row'}}>
                <Text
                  style={{
                    fontSize: 15,
                    fontFamily: 'Poppins-Regular',
                    color: '#000',
                  }}>
                  Status
                </Text>
                <Text
                  style={{
                    fontSize: 15,
                    fontFamily: 'Poppins-Regular',
                    marginLeft: '25.5%',
                    color: '#000',
                  }}>
                  :
                </Text>
                <Text
                  style={{
                    fontSize: 15,
                    fontFamily:
                      item.status == 1 ? 'Poppins-Bold' : 'Poppins-Medium',
                    marginLeft: 'auto',
                    color: item.status == 1 ? '#34A549' : '#E23939',
                  }}>
                  {item.status == 1 ? 'Enabled' : 'Disabled'}{' '}
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar
        backgroundColor="#F4F5F7"
        barStyle={theme.dark ? 'light-content' : 'dark-content'}
      />
      <View
        style={{
          flexDirection: 'row',
          marginHorizontal: 5,
          marginVertical: 15,
          paddingTop: 15,
        }}>
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() => navigation.goBack()}>
          <Image
            style={{width: 28, height: 28, resizeMode: 'center'}}
            source={require('../assets/back3x.png')}
          />
        </TouchableOpacity>
        <View style={{marginLeft: 1}}>
          <Text
            style={{
              color: '#2B2520',
              fontFamily: 'Poppins-Medium',
              fontSize: 20,
            }}>
            Coupons{' '}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate('AddCouponsScreen')}
          style={{marginLeft: 'auto', marginRight: '2%', marginTop: '2%'}}>
          <Text
            style={{
              color: '#2F6E8F',
              fontFamily: 'Poppins-Medium',
              fontSize: 15,
              textAlign: 'right',
            }}>
            Add Coupon
          </Text>
        </TouchableOpacity>
      </View>
      <Divider />

      <View
        style={{
          marginBottom: 10,
          flexDirection: 'row',
          backgroundColor: '#e6e6e6',
          borderRadius: 10,
          width: '95%',
          alignSelf: 'center',
          marginTop: 10,
        }}>
        <Image
          style={{
            width: 25,
            height: 25,
            resizeMode: 'center',
            alignSelf: 'center',
            marginLeft: 10,
          }}
          source={require('../assets/path2x.png')}
        />

        <TextInput
          style={{width: '80%', paddingLeft: 10, color: '#000'}}
          autoCapitalize="none"
          placeholder="Search Coupon Code"
          placeholderTextColor={'grey'}
          underlineColorAndroid="transparent"
          onChangeText={val => searchCoupon(val)}
          value={searchKey}
          maxLength={15}
        />

        <TouchableOpacity
          onPress={() => {
            setSearchKey(''), setIsLoadMore(true);
            setSearchResults(), setIsCouponSearched(false);
          }}>
          <Image
            style={{
              width: 10,
              height: 10,
              tintColor: 'black',
              marginTop: 20,
            }}
            source={require('../assets/close2x.png')}
          />
        </TouchableOpacity>
      </View>

      {refreshing && <ActivityIndicator size="large" color="#51AF5E" />}
      <View style={{marginBottom: 113}}>
        {isCouponSearched ? (
          <View>
            {isCouponSearched &&
            searchResults != null &&
            searchResults != undefined ? (
              <FlatList
                data={searchResults}
                numColumns={1}
                nestedScrollEnabled={true}
                renderItem={deleteCouponRenderItem}
                onEndReached={() => _handleLoadMore()}
                onEndReachedThreshold={0.5}
                marginBottom={20}
              />
            ) : (
              <Text
                style={{
                  textAlign: 'center',
                  justifyContent: 'center',
                  marginTop: '60%',
                }}>
                No Coupons Found
              </Text>
            )}
          </View>
        ) : displayCoupons && displayCoupons.length === 0 ? (
          <Text
            style={{
              textAlign: 'center',
              justifyContent: 'center',
              marginTop: '60%',
            }}>
            There are no coupons to display
          </Text>
        ) : (
          <FlatList
            data={displayCoupons}
            numColumns={1}
            nestedScrollEnabled={true}
            renderItem={renderItem}
            onEndReached={() => _handleLoadMore()}
            onEndReachedThreshold={0.5}
            style={{paddingBottom: 20}}
            // marginBottom={20}
          />
        )}
      </View>
    </View>
  );
};

export default CouponsScreen;
const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    padding: 10,
    backgroundColor: '#F7F7FC',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFF',
  },
  cardHeader: {
    backgroundColor: '#1B6890',
    flexDirection: 'row',
  },
  subheading: {
    fontSize: 14,
    // fontWeight: "900",
    color: '#fff',
    fontFamily: 'Poppins-Medium',
  },
});
