import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StatusBar,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Linking,
  RefreshControl,
  StyleSheet,
  FlatList,
  Platform,
  TextInput,
} from 'react-native';
import {useTheme, useIsFocused} from '@react-navigation/native';
import {Divider} from 'react-native-paper';
import styles from './Home/Styles';
//import NetworkChecker from "react-native-network-checker";
// import { Rating, AirbnbRating } from "react-native-ratings";
import moment from 'moment';
import {useDispatch, useSelector} from 'react-redux';
import DeveloperAPIClient from '../state/middlewares/DeveloperAPIClient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Card} from 'react-native-paper';
import DatePicker from 'react-native-date-picker';
// import {
//   VictoryBar,
//   Bar,
//   VictoryChart,
//   VictoryTheme,
//   VictoryAxis,
//   VictoryContainer,
//   VictoryLabel,
// } from 'victory-native';

const ReviewsScreen = ({navigation}) => {
  const theme = useTheme();

  let date = new Date();
  date.setMonth(date.getMonth() - 1);

  const [toDate, setToDate] = React.useState(new Date());
  const [fromDate, setFomDate] = React.useState(date);

  const [toFDate, setToFDate] = React.useState(new Date());
  const [fromFDate, setFomFDate] = React.useState(date);

  const [displayAllRatings, setDisplayAllRatings] = React.useState();
  const [replyComment, setReplyComment] = React.useState();
  const [totalReviews, setTotalReviews] = React.useState();
  const [averageRating, setAverageRating] = React.useState();
  const [searchKey, setSearchKey] = React.useState('');
  const [ratingCount, setRatingCount] = React.useState([]);
  const [ratingPersentage, setRatingPersentage] = React.useState();
  const [ratingFilter, setRatingFilter] = React.useState();
  const [tabValue, setTabValue] = React.useState('Food Reviews');
  const [refreshing, setRefreshing] = React.useState(true);

  const isFocused = useIsFocused();

  const OrderRatings = async val => {
    setRefreshing(true);
    let api = new DeveloperAPIClient();
    let Token = await AsyncStorage.getItem('token');
    let UserMobile = await AsyncStorage.getItem('MobileNumber');
    let OrderRating = await api.getOrderRating(
      UserMobile,
      Token,
      val,
      fromFDate,
      toFDate,
      ratingFilter,
    );
    setDisplayAllRatings(OrderRating.data.customer_details);
    setRefreshing(false);
    setTotalReviews(OrderRating.data.total_ratings);
    setAverageRating(OrderRating.data.average_ratings);

    if (OrderRating.data.success == false) {
      setTotalReviews(0);
      setAverageRating(0);
    }
  };

  useEffect(() => {
    OrderRatings();
    RatingsByNumber();
  }, [isFocused]);

  const RatingsByNumber = async () => {
    let api = new DeveloperAPIClient();
    let Token = await AsyncStorage.getItem('token');
    let UserMobile = await AsyncStorage.getItem('MobileNumber');
    let RatingNumber = await api.getRatingNumber(UserMobile, Token);
    setRatingPersentage(RatingNumber.data[0]);

    let apiData = RatingNumber.data[0];

    let graphData = [
      {rating: 1, percentage: parseInt(apiData['1'])},
      {rating: 2, percentage: parseInt(apiData['2'])},
      {rating: 3, percentage: parseInt(apiData['3'])},
      {rating: 4, percentage: parseInt(apiData['4'])},
      {rating: 5, percentage: parseInt(apiData['5'])},
    ];

    setRatingCount(graphData);
  };

  const searchRating = async val => {
    setSearchKey(val);
    OrderRatings(val);
  };

  const ClearFilter = async val => {
    setSearchKey([]);
    setRatingFilter([]);
    setFomDate(date);
    setToDate(new Date());
    let api = new DeveloperAPIClient();
    let Token = await AsyncStorage.getItem('token');
    let UserMobile = await AsyncStorage.getItem('MobileNumber');
    let ClearAllFilter = await api.getClearAllFilter(UserMobile, Token);
    setDisplayAllRatings(ClearAllFilter.data.customer_details);
    setTotalReviews(ClearAllFilter.data.total_ratings);
    setAverageRating(ClearAllFilter.data.average_ratings);
  };

  const filterDate = async () => {
    OrderRatings();
  };

  const GiveReply = async () => {};

  useEffect(() => {
    OrderRatings();
  }, [ratingFilter]);
  const FilterbyRatings = async (event, rating, val) => {
    setRatingFilter(rating);
  };

  const ratingColors = ['#FF5733', '#03fcd7', '#FFC300', '#c918cc', '#0e9f6e'];

  const star_image = require('../assets/star.png');

  const Tabs = [
    {
      name: 'Food Reviews',
    },
    {
      name: 'Delivery Reviews',
    },
  ];

  const onPress = val => {
    setTabValue(val.name);
    if (val.name == 'Food Reviews') {
    }
    if (val.name == 'Document') {
    }
  };

  const onChangeCommentReply = async (item, index, val) => {
    item.comments = val;
  };

  const underlineColor = Platform.OS === 'android' ? 'transparent' : 'black';

  const renderRatingList = ({item, index}) => (
    <>
      <Card
        style={{
          marginBottom: 2,
          backgroundColor: '#fff',
          width: '95%',
          borderRadius: 5,
          alignSelf: 'center',
          marginTop: '2%',
        }}>
        <View
          style={{
            flexDirection: 'row',
            marginRight: '5%',
            justifyContent: 'space-between',
          }}>
          <View style={{flexDirection: 'column', marginLeft: 8}}>
            <View style={{flexDirection: 'row'}}>
              <Text style={{fontWeight: 'bold', fontSize: 15, marginTop: '5%'}}>
                Food :
              </Text>
              {parseInt(item.rating) === 5 && (
                <Image
                  style={style.foodratingstar}
                  source={require('../assets/5.png')}
                />
              )}

              {parseInt(item.rating) === 4 && (
                <Image
                  style={style.foodratingstar}
                  source={require('../assets/4.png')}
                />
              )}

              {parseInt(item.rating) === 3 && (
                <Image
                  style={style.foodratingstar}
                  source={require('../assets/3.png')}
                />
              )}

              {parseInt(item.rating) === 2 && (
                <Image
                  style={style.foodratingstar}
                  source={require('../assets/2.png')}
                />
              )}

              {parseInt(item.rating) === 1 && (
                <Image
                  style={style.foodratingstar}
                  source={require('../assets/1.png')}
                />
              )}
            </View>

            <View style={{flexDirection: 'row', marginTop: -19}}>
              <Text style={{fontWeight: 'bold', fontSize: 15}}>Delivery :</Text>
              {parseInt(item.delivery_rating) === 5 && (
                <Image
                  style={style.deliveryrating}
                  source={require('../assets/5.png')}
                />
              )}

              {parseInt(item.delivery_rating) === 4 && (
                <Image
                  style={style.deliveryrating}
                  source={require('../assets/4.png')}
                />
              )}

              {parseInt(item.delivery_rating) === 3 && (
                <Image
                  style={style.deliveryrating}
                  source={require('../assets/3.png')}
                />
              )}

              {parseInt(item.delivery_rating) === 2 && (
                <Image
                  style={style.deliveryrating}
                  source={require('../assets/2.png')}
                />
              )}

              {parseInt(item.delivery_rating) === 1 && (
                <Image
                  style={style.deliveryrating}
                  source={require('../assets/1.png')}
                />
              )}
            </View>
          </View>
          <View style={{flexDirection: 'column'}}>
            <Text
              style={{marginTop: '8%', fontWeight: 'bold', color: '#a8aaad'}}>
              {moment(item.created_at).format('DD-MM-YYYY ')}
            </Text>

            <Text
              style={{
                fontWeight: 'bold',
                marginLeft: 'auto',
                color: '#a8aaad',
              }}>
              {moment(item.created_at).format('hh:mm A')}
            </Text>
          </View>
        </View>

        <View
          style={{
            flexDirection: 'row',
            backgroundColor: '#f2f3f5',
            height: 40,
            alignItems: 'center',
            borderRadius: 10,
          }}>
          <Text
            style={{
              fontWeight: 'bold',
              fontSize: 14,
              marginLeft: '3%',
              fontFamily: 'Poppins-Medium',
            }}>
            {`${item.firstname.substring(0, 10)}`}
            {`${item?.firstname?.length > 10 ? '...' : ''}`}
          </Text>
          <Image source={require('../assets/vertical.png')} />

          <Text
            style={{
              fontSize: 13,
              marginTop: 3,
              fontWeight: 'bold',
              fontFamily: 'Poppins-Medium',
            }}>
            {item.telephone}
          </Text>

          <Image source={require('../assets/vertical.png')} />

          <Text
            style={{
              fontFamily: 'Poppins-Medium',
              fontSize: 12,
            }}>
            Order id :
          </Text>

          <Text
            style={{
              marginLeft: '2%',
              fontSize: 13,
              fontWeight: 'bold',
              fontFamily: 'Poppins-Medium',
              marginTop: -2,
            }}>
            {item.order_id}
          </Text>
        </View>

        <View style={{}}>
          <Text
            style={{
              marginTop: '7%',
              marginLeft: '3%',
              marginRight: '3%',
              fontFamily: 'Poppins-Medium',
            }}>
            {item.comments}
          </Text>

          <View style={{flexDirection: 'row'}}>
            <TextInput
              style={{
                backgroundColor: '#ededed',
                marginTop: '5%',
                marginBottom: '5%',
                height: 30,
                width: '77%',
                marginLeft: '3%',
                fontFamily: 'Poppins-Medium',
                paddingTop: 5,
                paddingBottom: 5,
                borderRadius: 5,
              }}
              onChangeText={val => onChangeCommentReply(item, index, val)}
              value={replyComment}
              placeholder="Reply...."
              clearButtonMode="always"
            />

            <TouchableOpacity
              onPress={() => GiveReply()}
              style={{
                backgroundColor: '#34a549',
                marginTop: '5%',
                height: 35,
                width: '15%',
                borderRadius: 5,
                alignItems: 'center',
                justifyContent: 'center',
                marginLeft: '2%',
              }}>
              <Text
                style={{
                  color: '#FFF',
                  fontWeight: 'bold',
                  fontSize: 15,
                  marginBottom: '24%',
                  fontFamily: 'Poppins-Medium',
                }}>
                SEND
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Card>
    </>
  );

  return (
    <View style={styles.container}>
      <>
        <StatusBar
          backgroundColor="#FFF"
          barStyle={theme.dark ? 'light-content' : 'dark-content'}
        />
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
              source={require('../assets/back3x.png')}
            />
          </TouchableOpacity>

          <View style={{marginLeft: 5}}>
            <Text
              style={{
                color: '#0F0F0F',
                fontFamily: 'Poppins-Bold',
                fontSize: 16,
                marginTop: 1.5,
              }}>
              Reviews
            </Text>
          </View>
        </View>
        <View />
        <Divider />

        <View
          style={{
            flexDirection: 'row',
            marginBottom: 10,
          }}>
          {Tabs &&
            Tabs.map((val, i) => {
              return (
                <TouchableOpacity
                  onPress={() => onPress(val)}
                  activeOpacity={0.7}
                  key={i}
                  style={{
                    width: '44.5%',
                    height: 50,
                    borderRadius: tabValue === val.name ? 5 : 5,
                    backgroundColor:
                      tabValue === val.name ? '#439c4a' : '#f2f3f5',
                    marginLeft: '3%',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Text
                    style={{
                      color: tabValue === val.name ? '#FFFF' : '#21272E',
                      fontFamily:
                        tabValue === val.name
                          ? 'Poppins-Bold'
                          : 'Poppins-SemiBold',
                      fontSize: tabValue === val.name ? 14 : 14,
                      marginLeft: 8,
                    }}>
                    {val.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
        </View>

        <View
          style={{
            justifyContent: 'center',
            alignSelf: 'center',
            marginTop: '2%',
            borderRadius: 8,
            backgroundColor: '#f5f3f2',
            shadowColor: '#000',
            shadowOffset: {width: 0, height: 2},
            shadowOpacity: 0.2,
            shadowRadius: 2,
            elevation: 1,
            padding: 10,
            margin: 10,
            width: '95%',
          }}>
          <View style={{flexDirection: 'row'}}>
            <DatePicker
              style={{marginLeft: -55}}
              date={fromDate}
              mode="date"
              confirmBtnText="Confirm"
              cancelBtnText="Cancel"
              onDateChange={val => {
                setFomFDate(val + 'T00:00:00.000z');
                setFomDate(val);
              }}
              customStyles={{
                dateInput: {
                  display: 'none',
                },
              }}
            />
            <View style={{flexDirection: 'column', marginLeft: -50}}>
              <Text style={{fontSize: 13}}>From date</Text>
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: 'bold',
                  fontFamily: 'Poppins-Medium',
                }}>
                {moment(fromDate.toString()).format('DD MMM YYYY')}
              </Text>
            </View>

            <DatePicker
              style={{marginLeft: -35}}
              date={toDate}
              mode="date"
              confirmBtnText="Confirm"
              cancelBtnText="Cancel"
              onDateChange={val => {
                setToFDate(val + 'T23:59:59.000z');
                setToDate(val);
              }}
              customStyles={{
                dateInput: {
                  display: 'none',
                },
              }}
            />
            <View style={{flexDirection: 'column', marginLeft: -50}}>
              <Text style={{fontSize: 13}}>To date</Text>
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: 'bold',
                  fontFamily: 'Poppins-Medium',
                }}>
                {moment(toDate.toString()).format('DD MMM YYYY')}
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => filterDate()}
              style={{
                backgroundColor: '#34a549',
                marginTop: '2%',
                height: 35,
                width: '15%',
                borderRadius: 5,
                alignItems: 'center',
                justifyContent: 'center',
                marginLeft: '5%',
              }}>
              <Text
                style={{
                  color: '#fff',
                  fontWeight: 'bold',
                  alignSelf: 'center',
                  fontSize: 16,
                  marginBottom: 6,
                }}>
                Go
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView keyboardShouldPersistTaps="true">
          <View style={{flexDirection: 'column'}}>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: 'Poppins-Medium',
                  marginLeft: 10,
                }}>
                Total Reviews
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: 'Poppins-Medium',
                  marginRight: 40,
                }}>
                Average Rating
              </Text>
            </View>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <View style={{flexDirection: 'row', marginLeft: 10}}>
                <Text
                  style={{
                    fontSize: 20,
                    fontFamily: 'Poppins-Medium',
                    marginTop: 1,
                  }}>
                  {totalReviews}
                </Text>
              </View>
              <View style={{flexDirection: 'row', marginRight: 10}}>
                <Text
                  style={{
                    fontSize: 20,
                    fontFamily: 'Poppins-Medium',
                    marginTop: 1,
                  }}>
                  {tabValue === 'Food Reviews'
                    ? averageRating && parseFloat(averageRating).toFixed(2)
                    : averageRating && parseFloat(averageRating).toFixed(2)}
                </Text>

                {/* <Rating
                  readonly={true}
                  startingValue={averageRating}
                  ratingCount={5}
                  imageSize={15}
                  style={{ marginTop: 10, marginRight: 6, marginLeft: 10 }}
                /> */}
              </View>
            </View>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text
                style={{
                  fontSize: 10,
                  fontFamily: 'Poppins-Regular',
                  marginLeft: 10,
                }}>
                Growth in reviews
              </Text>
              <Text
                style={{
                  fontSize: 10,
                  fontFamily: 'Poppins-Regular',
                  marginRight: 10,
                }}>
                Average rating
              </Text>
            </View>
          </View>

          <View style={{marginTop: -50, marginBottom: -70}}>
            {/* <VictoryChart theme={VictoryTheme.light} domainPadding={{x: 35}}>
              {ratingCount && ratingCount.length > 0 && (
                <VictoryBar
                  horizontal
                  cornerRadius={{top: 5, bottom: 5}}
                  style={{
                    data: {
                      fill: ({datum}) => ratingColors[datum.rating - 1],
                      width: 12,
                    },
                    labels: {fontSize: 18, fontWeight: 'bold', padding: 25},
                  }}
                  data={ratingCount}
                  x="rating"
                  y="percentage"
                  labels={[
                    ratingPersentage['1'],
                    ratingPersentage['2'],
                    ratingPersentage['3'],
                    ratingPersentage['4'],
                    ratingPersentage['5'],
                  ]}
                  labelComponent={<VictoryLabel textAnchor="end" />}
                  events={[
                    {
                      target: 'data',
                      eventHandlers: {
                        onPressIn: (event, {datum}) => {
                          FilterbyRatings(event, datum.rating);
                        },
                      },
                    },
                  ]}
                />
              )}

              <VictoryAxis
                style={{
                  axis: {stroke: 'none'},
                  tickLabels: {fontSize: 18, padding: 5, fontWeight: 'bold'},
                }}
                tickFormat={tick => `★ ${tick}`}
              />
            </VictoryChart> */}
          </View>

          <View style={{marginLeft: 'auto', marginRight: '5%'}}>
            <TouchableOpacity
              onPress={() => {
                ClearFilter();
              }}>
              <Text
                style={{
                  color: '#cc182a',
                  fontSize: 15,
                  textDecorationLine: 'underline',
                  fontWeight: 'bold',
                }}>
                Clear Filter
              </Text>
            </TouchableOpacity>
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: '#fff',
              borderWidth: 0.3,
              borderColor: '#333333',
              height: 40,
              borderRadius: 30,
              marginVertical: 10,
              width: '93%',
              marginLeft: 10,
            }}>
            <TouchableOpacity>
              <Image
                style={{
                  width: 25,
                  height: 25,
                  resizeMode: 'center',
                  marginLeft: 6,
                }}
                source={require('../assets/search.png')}
              />
            </TouchableOpacity>
            <View>
              <TextInput
                style={{
                  flex: 1,
                  backgroundColor: '#fff',
                  height: 18,
                  marginTop: '1%',
                }}
                autoCorrect={false}
                underlineColorAndroid={'#fff'}
                placeholder="Search by name or Mobile number"
                onChangeText={val => searchRating(val)}
                value={searchKey}
              />
            </View>

            <View style={{flexDirection: 'row'}}>
              <View style={{alignItems: 'flex-end'}}>
                <TouchableOpacity
                  onPress={() => {
                    setSearchKey(), searchRating('');
                  }}>
                  <Image
                    style={{
                      width: 25,
                      height: 25,
                      resizeMode: 'center',
                      marginRight: 10,
                    }}
                    source={require('../assets/close2x.png')}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {refreshing && <ActivityIndicator size="large" color="#51AF5E" />}
          {displayAllRatings?.length > 0 ? (
            <FlatList data={displayAllRatings} renderItem={renderRatingList} />
          ) : (
            <Text
              style={{
                textAlign: 'center',
                justifyContent: 'center',
                marginTop: '10%',
              }}>
              No Search Result there to display
            </Text>
          )}
        </ScrollView>
      </>
    </View>
  );
};

export default ReviewsScreen;

const style = StyleSheet.create({
  chip: {
    borderRadius: 15,
    width: '60%',
    marginLeft: '3%',
    backgroundColor: 'black',
    height: 8,
    marginTop: 10,
  },
  ratingCount: {
    fontSize: 15,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  star: {
    tintColor: '#bab7b6',
    height: 11,
    width: 11,
    marginTop: 5,
  },
  foodratingstar: {
    height: 70,
    width: 85,
    resizeMode: 'center',
    marginRight: 10,
    marginTop: -14,
    marginLeft: '5%',
  },
  deliveryrating: {
    height: 70,
    width: 85,
    resizeMode: 'center',
    marginRight: 10,
    marginTop: -22,
    marginLeft: '5%',
  },
});
