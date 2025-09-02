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
  const isFocused = useIsFocused();

  useEffect(() => {
    getStoreTimings();
  }, [isFocused]);

  const getStoreTimings = async () => {
    setDisplayStoreTimings();
    let api = new DeveloperAPIClient();
    let Token = await AsyncStorage.getItem('token');
    let UserMobile = await AsyncStorage.getItem('MobileNumber');
    let StoreTimings = await api.getStoreTimings(UserMobile, Token);
    let responseData = JSON.parse(StoreTimings.data.store_timings);
    setDisplayStoreTimings(responseData);
    setCloneObject(responseData);
  };

  const onEditClick = (item, index) => {
    setStartTime(new Date());
    setEndTime(new Date());
    setIndex(index);
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
              <View style={{flexDirection: 'row', marginTop: 5}}>
                <DatePicker
                  style={{width: '42%'}}
                  date={startTime == '' ? item.time.split('-')[0] : startTime}
                  mode="time"
                  placeholder="Select Time"
                  confirmBtnText="Confirm"
                  cancelBtnText="Cancel"
                  onDateChange={val => {
                    updateStoreStartTimings(item, val, index);
                  }}
                  showIcon={false}
                />
                <Text style={{margin: 10, color: '#000'}}>:</Text>
                <DatePicker
                  style={{width: '42%'}}
                  date={endTime == '' ? item.time.split('-')[1] : endTime}
                  mode="time"
                  placeholder="Select Time"
                  confirmBtnText="Confirm"
                  cancelBtnText="Cancel"
                  onDateChange={val => {
                    updateStoreEndTimings(item, val, index);
                  }}
                  showIcon={false}
                />
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
