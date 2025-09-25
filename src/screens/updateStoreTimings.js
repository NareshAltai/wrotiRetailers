import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StatusBar,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  FlatList,
  TextInput,
  ActivityIndicator,
  AccessibilityActionEvent,
  Alert,
} from 'react-native';
import {useTheme} from '@react-navigation/native';
import {Divider, Menu} from 'react-native-paper';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';
import DeveloperAPIClient from '../state/middlewares/DeveloperAPIClient';
import {useIsFocused} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {clone} from 'lodash';
import Toast from 'react-native-simple-toast';
import Header from '../components/Header';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {wp} from '../utils/scale';

const TemplateListScreen = ({navigation}) => {
  const theme = useTheme();
  const {colors} = useTheme();
  const [isEditClicked, setIsEditClicked] = React.useState(false);
  const [startTime, setStartTime] = React.useState(new Date());
  const [endTime, setEndTime] = React.useState(new Date());
  const [selectedItemId, setSelectedItemId] = useState();
  const [displayStoreTimings, setDisplayStoreTimings] = React.useState();
  const [cloneObject, setCloneObject] = React.useState();
  const [index, setIndex] = React.useState();
  const [openStartTime, setOpenStartTime] = useState(false);
  const [openEndTime, setOpenEndTime] = useState(false);
  const isFocused = useIsFocused();

  useEffect(() => {
    getStoreTimings();
  }, [isFocused]);
  function formatTimeRange(startDate) {
    const pad = n => n.toString().padStart(2, '0');
    const start = new Date(startDate);
    // const end = new Date(endDate);
    return `${pad(start.getHours())}:${pad(start.getMinutes())}}`;
  }

  const getStoreTimings = async () => {
    setDisplayStoreTimings();
    let api = new DeveloperAPIClient();
    let Token = await AsyncStorage.getItem('token');
    let UserMobile = await AsyncStorage.getItem('MobileNumber');
    let StoreTimings = await api.getStoreTimings(UserMobile, Token);
    let responseData = JSON.parse(StoreTimings.data.store_timings);
    setDisplayStoreTimings(responseData);
    setCloneObject(formatTimeRange(responseData));
  };

  const onEditClick = (item, index) => {
    console.log('called------------>');
    // setOpenStartTime(true);
    // setStartTime(new Date());
    // setEndTime(new Date());
    // setIndex(index);
    setSelectedItemId(selectedItemId == item.day ? '' : item.day);
  };

  const copySlotTimings = () => {
    let copyTime = cloneObject[index].time;
    let localObject = [...cloneObject];
    for (let i = 0; i < localObject.length; i++) {
      localObject[i].time = copyTime;
    }
    updateNewStoreTimings();
  };

  const updateStoreStartTimings = (item, val, index) => {
    setIndex(index);
    let localObject = [...cloneObject];
    for (let i = 0; i < localObject.length; i++) {
      localObject[index].time = val + '-' + item.time.split('-')[1];
      setStartTime(val);
    }
  };

  const updateStoreEndTimings = (item, val, index) => {
    setIndex(index);
    let localObject = [...cloneObject];
    for (let i = 0; i < localObject.length; i++) {
      localObject[index].time = item.time.split('-')[0] + '-' + val;
      setEndTime(val);
    }
  };
  const formatTo12HourTimeString = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const updateNewStoreTimings = async () => {
    let api = new DeveloperAPIClient();
    let Token = await AsyncStorage.getItem('token');
    let UserMobile = await AsyncStorage.getItem('MobileNumber');
    let StoreTimings = await api.getUpdateStoreTimings(
      UserMobile,
      Token,
      cloneObject,
    );
    if (StoreTimings.data.success == true) {
      Toast.showWithGravity(
        StoreTimings.data.message,
        Toast.LONG,
        Toast.BOTTOM,
      );
      setSelectedItemId('');
      getStoreTimings();
    }
  };

  const renderTimeSlots = ({item, index}) => (
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
      <View>
        <View style={{flexDirection: 'column'}}>
          <View style={{flexDirection: 'row'}}>
            <Text
              style={{
                fontSize: 15,
                fontFamily: 'Poppins-Medium',
                color: '#000',
              }}>
              {item.day}
            </Text>
            <TouchableOpacity
              onPress={() => onEditClick(item, index)}
              style={{marginLeft: 'auto'}}>
              <Image
                style={{
                  height: selectedItemId === item.day ? 20 : 25,
                  width: selectedItemId === item.day ? 20 : 25,
                  resizeMode: 'center',
                }}
                source={
                  selectedItemId === item.day
                    ? require('../assets/close3x.png')
                    : require('../assets/e3x.png')
                }
              />
            </TouchableOpacity>
          </View>
          {selectedItemId === item.day ? (
            <View style={{flexDirection: 'column'}}>
              <View
                style={{
                  flexDirection: 'row',
                  marginTop: 5,
                  alignItems: 'center',
                  width: '100%',
                  justifyContent: 'space-between',
                }}>
                <View
                  style={{
                    marginTop: 10,
                    alignItems: 'center',
                  }}>
                  <TouchableOpacity
                    onPress={() => {
                      setOpenStartTime(true);
                      console.log('nice raa -------------->');
                    }}
                    style={{
                      borderWidth: 1,
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: wp(25),
                    }}>
                    <Text
                      style={{
                        // marginLeft: 12,
                        fontFamily: 'Poppins-Medium',
                        marginTop: '3%',
                        color: '#000',
                      }}>
                      Start Time
                    </Text>

                    <Ionicons
                      name="calendar-outline"
                      size={20}
                      color={'#000'}
                    />
                    {/* <Image source={require('../assets/calendar.png')} /> */}

                    {/* Show selected start date */}
                  </TouchableOpacity>
                  <Text
                    style={{
                      // marginLeft: 8,
                      fontFamily: 'Poppins-Regular',
                      color: '#333',
                    }}>
                    {' '}
                    {formatTo12HourTimeString(new Date(startTime))}
                    {/* {startTime || '--'} */}
                  </Text>
                </View>
                {/* <Text style={{margin: 10, color: '#000'}}>:</Text> */}
                <View
                  style={{
                    marginTop: 10,
                    // flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <TouchableOpacity
                    onPress={() => setOpenEndTime(true)}
                    style={{
                      borderWidth: 1,
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: wp(25),
                    }}>
                    <Text
                      style={{
                        // marginLeft: 12,
                        fontFamily: 'Poppins-Medium',
                        marginTop: '3%',
                        color: '#000',
                      }}>
                      End Time
                    </Text>
                    <TouchableOpacity
                      onPress={() => setOpenEndTime(true)}
                      style={{marginLeft: 8}}>
                      <Ionicons
                        name="calendar-outline"
                        size={20}
                        color={'#000'}
                      />
                      {/* <Image source={require('../assets/calendar.png')} /> */}
                    </TouchableOpacity>
                    {/* Show selected start date */}
                  </TouchableOpacity>
                  <Text
                    style={{
                      // marginLeft: 8,
                      fontFamily: 'Poppins-Regular',
                      color: '#333',
                    }}>
                    {' '}
                    {formatTo12HourTimeString(new Date(endTime))}
                    {/* {startTime || '--'} */}
                  </Text>
                </View>
              </View>
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
                onPress={() =>
                  Alert.alert(
                    '',
                    'Do you want to apply store timings to all days?',
                    [
                      {text: 'Yes', onPress: () => copySlotTimings()},
                      {text: 'No', onPress: () => updateNewStoreTimings()},
                    ],
                  )
                }>
                <Text
                  style={{
                    color: '#fff',
                    textAlign: 'center',
                    justifyContent: 'center',
                    alignItems: 'center',
                    fontSize: 16,
                  }}>
                  {' '}
                  SAVE TIMINGS{' '}
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <Text style={{fontFamily: 'Poppins-Medium', color: '#000'}}>
              {item.time}
            </Text>
          )}
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar
        backgroundColor="#F4F5F7"
        barStyle={theme.dark ? 'light-content' : 'dark-content'}
      />

      <Header title={'Outlet Open / Close Timings'} />
      <DatePicker
        modal
        open={openStartTime}
        date={startTime}
        mode="time"
        // minimumDate={moment().tot}
        onConfirm={val => {
          setOpenStartTime(false);
          setStartTime(val);
        }}
        onCancel={() => {
          setOpenStartTime(false);
        }}
      />
      <DatePicker
        modal
        open={openEndTime}
        date={endTime}
        mode="time"
        // minimumDate={moment().tot}
        onConfirm={val => {
          setOpenEndTime(false);
          setEndTime(val);
        }}
        onCancel={() => {
          setOpenEndTime(false);
        }}
      />
      <View style={{marginBottom: 40}}>
        <FlatList
          data={displayStoreTimings}
          numColumns={1}
          nestedScrollEnabled={true}
          renderItem={renderTimeSlots}
          onEndReachedThreshold={0.5}
          marginBottom={20}
        />
      </View>
    </View>
  );
};

export default TemplateListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFF',
  },
  cardHeader: {
    backgroundColor: '#1B6890',
    flexDirection: 'row',
  },
});
