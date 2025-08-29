import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Image,
  TouchableOpacity,
  TextInput,
  FlatList,
} from 'react-native';
import {useTheme} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DeveloperAPIClient from '../../state/middlewares/DeveloperAPIClient';
import {Divider} from 'react-native-paper';
// import DropDownPicker from 'react-native-dropdown-picker';

const ChatsScreen = ({navigation}) => {
  const theme = useTheme();
  const Tabs = [
    {
      name: 'Active',
    },
    {
      name: 'Inactive',
    },
  ];

  const [tabValue, setTabValue] = useState('Active');
  const [searchKey, setSearchKey] = useState('');
  const [activeUser, setActiveUser] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [remainingTime, setRemainingTime] = useState(0);
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [filteredActiveUser, setFilteredActiveUser] = useState([]);

  useEffect(() => {
    const initialize = async () => {
      ActiveUser();
      getChatStatus();
      GetChats();
      const storedEndTime = await AsyncStorage.getItem('countdownEndTime');
      const endTime = storedEndTime ? new Date(storedEndTime) : null;
      if (endTime) {
        updateCountdown(endTime);
      } else {
        const newEndTime = new Date(Date.now() + 24 * 60 * 60 * 1000);
        await AsyncStorage.setItem(
          'countdownEndTime',
          newEndTime.toISOString(),
        );
        updateCountdown(newEndTime);
      }
    };

    initialize();
  }, []);

  const getChatStatus = async () => {
    let api = new DeveloperAPIClient();
    let statusResponse = await api.getChatStatus();
    const desiredSids = [3, 4, 5, 6, 7, 8];
    let mappedItems = statusResponse.data.data
      .filter(status => desiredSids.includes(status.sid))
      .map(status => ({
        label: status.status_name,
        value: status.sid,
      }));
    setItems(mappedItems);
    console.log('---', items);
  };

  const handleChange = async selectedStatus => {
    setValue(selectedStatus);
    if (selectedStatus) {
      const filtered = activeUser.filter(
        item => parseInt(item.status) === selectedStatus,
      );
      setFilteredActiveUser(filtered.length > 0 ? filtered : []);
    } else {
      setFilteredActiveUser(activeUser);
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      updateCountdown();
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const updateCountdown = async endTimeFromStorage => {
    const storedEndTime = await AsyncStorage.getItem('countdownEndTime');
    const endTime =
      endTimeFromStorage || (storedEndTime && new Date(storedEndTime));

    if (endTime) {
      const currentTime = new Date();
      const diffInMs = endTime - currentTime;
      if (diffInMs > 0) {
        setRemainingTime(diffInMs);
      } else {
        setRemainingTime(0);
        await AsyncStorage.removeItem('countdownEndTime');
      }
    }
  };

  const formatTime = ms => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(
      2,
      '0',
    )}:${String(seconds).padStart(2, '0')}`;
  };

  const onPress = val => {
    setTabValue(val.name);
    if (val.name === 'Active') {
      ActiveUser();
      handleSearch();
    } else {
      GetChats();
    }
  };

  const GetChats = async (searchKey = '') => {
    let api = new DeveloperAPIClient();
    let UserMobile = await AsyncStorage.getItem('MobileNumber');
    let Token = await AsyncStorage.getItem('token');
    let customersResponse = await api.getCustomersList(
      UserMobile,
      Token,
      searchKey,
    );
    let data = customersResponse?.data?.data?.customers;
    let activeUserMobileNumbers = activeUser.map(user => user.customer_mobile);
    let filteredCustomerList = data.filter(
      customer => !activeUserMobileNumbers.includes(customer.telephone),
    );
    setFilterData(filteredCustomerList);
  };

  const ActiveUser = async () => {
    let api = new DeveloperAPIClient();
    let UserMobile = await AsyncStorage.getItem('MobileNumber');
    let Token = await AsyncStorage.getItem('token');
    let activeUserResponse = await api.activeUser(UserMobile, Token);
    setActiveUser(activeUserResponse.data.data);
    setFilteredActiveUser(activeUserResponse.data.data);
  };

  const handleSearch = text => {
    setSearchKey(text);
    GetChats(text);
  };

  const renderActiveList = ({item}) => {
    const statusObject = items.find(
      statusItem => statusItem.value === parseInt(item.status),
    );
    const statusName = statusObject ? statusObject.label : 'Unknown Status';

    return (
      <>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('ChattingBox', {
              mobile: item.customer_mobile,
              name: item.customer_name,
            });
          }}>
          <View
            style={{
              marginHorizontal: 10,
              paddingHorizontal: 10,
              flexDirection: 'row',
              marginTop: 10,
              backgroundColor: '#ceedbb',
              paddingVertical: 10,
            }}>
            <Image
              style={{height: 45, width: 45}}
              source={require('../../assets/profile3x.png')}
            />
            <View style={{flexDirection: 'column', marginLeft: 10}}>
              <Text
                style={{
                  color: 'black',
                  fontFamily: 'Poppins-SemiBold',
                  fontSize: 14,
                }}>
                {item.customer_name}
              </Text>
              <Text
                style={{
                  fontFamily: 'Poppins-Medium',
                  fontSize: 14,
                  color: 'gray',
                }}>
                {item.customer_mobile}
              </Text>
            </View>
            <View
              style={{
                backgroundColor: '#f5e38c',
                height: 30,
                paddingHorizontal: 10,
                borderRadius: 10,
              }}>
              <Text
                style={{
                  fontFamily: 'Poppins-SemiBold',
                  fontSize: 12,
                  color: '#0a0a0a',
                  marginTop: 5,
                }}>
                {statusName}
              </Text>
            </View>
            <View
              style={{
                backgroundColor: '#337D3E',
                padding: 8,
                borderRadius: 10,
                alignSelf: 'center',
                marginLeft: 'auto',
              }}>
              <Text
                style={{
                  fontFamily: 'Poppins-Bold',
                  fontSize: 14,
                  color: '#FFFFFF',
                }}>
                {remainingTime > 0
                  ? `${formatTime(remainingTime)}`
                  : "Time's up"}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
        <Divider style={{marginVertical: 5}} />
      </>
    );
  };

  const renderCustomers = ({item}) => {
    return (
      <>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('ChattingBox', {
              mobile: item.customer_mobile,
              name: item.customer_name,
            })
          }>
          <View
            style={{
              marginHorizontal: 10,
              paddingHorizontal: 10,
              flexDirection: 'row',
              marginTop: 10,
            }}>
            <Image
              style={{height: 45, width: 45}}
              source={require('../../assets/profile3x.png')}
            />
            <View style={{flexDirection: 'column', marginLeft: 10}}>
              <Text
                style={{
                  color: 'black',
                  fontFamily: 'Poppins-SemiBold',
                  fontSize: 14,
                }}>
                {item.firstname} {item.lastname}
              </Text>
              <Text
                style={{
                  fontFamily: 'Poppins-Medium',
                  fontSize: 14,
                  color: 'gray',
                }}>
                {item.telephone}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
        <Divider style={{marginVertical: 5}} />
      </>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar
        backgroundColor="#F4F5F7"
        barStyle={theme.dark ? 'light-content' : 'dark-content'}
      />
      <View
        style={{
          flexDirection: 'row',
          paddingHorizontal: 14,
          paddingVertical: 16,
          backgroundColor: 'white',
          elevation: 10,
          shadowColor: '#040D1C14',
          borderBottomWidth: 0.4,
          borderBottomColor: '#21272E14',
        }}>
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() => navigation.goBack()}>
          <Image
            style={{width: 28, height: 28, resizeMode: 'center'}}
            source={require('../../assets/back3x.png')}
          />
        </TouchableOpacity>
        <View style={{marginLeft: 1, flexDirection: 'row'}}>
          <Text
            style={{
              color: '#2B2520',
              fontFamily: 'Poppins-Medium',
              fontSize: 18,
            }}>
            Contacts
          </Text>
        </View>
      </View>

      <View style={{flexDirection: 'row', marginVertical: 10}}>
        {Tabs &&
          Tabs.map((val, i) => {
            return (
              <TouchableOpacity
                onPress={() => onPress(val)}
                activeOpacity={0.7}
                key={i}
                style={{
                  width: '45.5%',
                  height: 50,
                  borderRadius: tabValue === val.name ? 5 : 5,
                  backgroundColor:
                    tabValue === val.name ? '#337D3E' : '#F2F7F9',
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
                    fontSize: tabValue === val.name ? 18 : 13,
                    marginLeft: 8,
                  }}>
                  {val.name}
                </Text>
              </TouchableOpacity>
            );
          })}
      </View>

      <View style={styles.searchContainer}>
        <Image
          style={{
            width: 25,
            height: 25,
            resizeMode: 'center',
            alignSelf: 'center',
            marginLeft: 10,
          }}
          source={require('../../assets/path2x.png')}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by customer name"
          value={searchKey}
          onChangeText={handleSearch}
        />
      </View>

      <>
        {/* <DropDownPicker
        open={open}
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={setValue}
        setItems={setItems}
        onChangeValue={handleChange}
        placeholder="Select Status"
        style={styles.dropdown}
        dropDownContainerStyle={styles.dropdownContainer}
        containerStyle={styles.dropdownWrapper}
      /> */}

        {tabValue === 'Active' &&
          (filteredActiveUser.length > 0 ? (
            <FlatList
              data={filteredActiveUser}
              renderItem={renderActiveList}
              keyExtractor={item => item.customer_mobile}
            />
          ) : (
            <View
              style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <Text>No Data Available</Text>
            </View>
          ))}
      </>

      {tabValue === 'Inactive' && (
        <FlatList
          data={filterData}
          renderItem={renderCustomers}
          keyExtractor={item => item.telephone}
        />
      )}
    </View>
  );
};

export default ChatsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
    marginHorizontal: 5,
  },
  searchContainer: {
    marginBottom: 3,
    flexDirection: 'row',
    backgroundColor: '#e6e6e6',
    borderRadius: 10,
    width: '95%',
    alignSelf: 'center',
  },
  searchInput: {
    fontSize: 16,
    flex: 1,
    paddingLeft: 10,
  },
  dropdown: {
    width: '95%',
    alignSelf: 'center',
    backgroundColor: '#e6e6e6',
    borderColor: '#e6e6e6',
  },
  dropdownContainer: {
    width: '95%',
    alignSelf: 'center',
    marginRight: 10,
  },
  dropdownWrapper: {
    width: '100%',
    alignItems: 'center',
  },
});
