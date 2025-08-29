import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Image,
  TouchableOpacity,
  TextInput,
  FlatList,
  Switch,
} from 'react-native';
import {useTheme} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DeveloperAPIClient from '../../state/middlewares/DeveloperAPIClient';
import moment from 'moment';
import io from 'socket.io-client';
import Toast from 'react-native-simple-toast';
// import DropDownPicker from 'react-native-dropdown-picker';

const ChattingBox = ({navigation, route}) => {
  const theme = useTheme();

  const socket = useRef(null);

  const [chatsMessage, setChatsMessage] = useState([]);
  const [replyMessage, setReplyMessage] = useState('');
  const [isEnabled, setIsEnabled] = useState(true);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([]);
  const [statusName, setStatusName] = useState();
  const [isFavorite, setIsFavorite] = useState(false);

  const handleChange = async selectedStatus => {
    console.log('CHECK-----');
    setValue(selectedStatus);
    let api = new DeveloperAPIClient();
    let UserMobile = await AsyncStorage.getItem('MobileNumber');
    let Token = await AsyncStorage.getItem('token');
    let CustomerMobile = route?.params?.mobile;
    let updateChatStatus = await api.updateChatStatus(
      UserMobile,
      Token,
      CustomerMobile,
      selectedStatus,
    );
    console.log('status upadated', updateChatStatus.data);
    if (selectedStatus === 3) {
      setIsFavorite(true);
      setStatusName(''); // Remove status name
    }
    if (updateChatStatus.data.message === 'Status updated successfully!') {
      Toast.showWithGravity(
        'Status updated successfully',
        Toast.LONG,
        Toast.BOTTOM,
      );
    }
    getAgentStatus();
  };

  const toggleSwitch = async value => {
    setIsEnabled(value);
    let api = new DeveloperAPIClient();
    let UserMobile = await AsyncStorage.getItem('MobileNumber');
    let Token = await AsyncStorage.getItem('token');
    let CustomerMobile = route?.params?.mobile;
    let updateAgentStatuResponse = await api.updateAgentStatus(
      UserMobile,
      Token,
      CustomerMobile,
      isEnabled,
    );
    console.log('status----', updateAgentStatuResponse.data.data);
    if (updateAgentStatuResponse?.data?.data?.agent_status === true) {
      Toast.showWithGravity('Agent chat initiated', Toast.LONG, Toast.BOTTOM);
    } else {
      updateAgentStatuResponse?.data?.data?.agent_status === false;
      Toast.showWithGravity(
        'Bot conversation initiated',
        Toast.LONG,
        Toast.BOTTOM,
      );
    }
  };

  const getChatStatus = async () => {
    let api = new DeveloperAPIClient();
    let statusResponse = await api.getChatStatus();
    const desiredSids = [4, 5, 6, 7, 8];
    let mappedItems = statusResponse.data.data
      .filter(status => desiredSids.includes(status.sid))
      .map(status => ({
        label: status.status_name,
        value: status.sid,
      }));
    setItems(mappedItems);
  };

  //  get agentstatus
  const getAgentStatus = async () => {
    let api = new DeveloperAPIClient();
    let UserMobile = await AsyncStorage.getItem('MobileNumber');
    let Token = await AsyncStorage.getItem('token');
    let CustomerMobile = route?.params?.mobile;
    let agentStatusResponse = await api.getAgentStatus(
      UserMobile,
      Token,
      CustomerMobile,
    );
    let response = agentStatusResponse.data.data;
    console.log('response---', response);
    let filteredStatuses = response
      .filter(item => item.customer_mobile === CustomerMobile)
      .map(item => item.status_name);
    setStatusName(filteredStatuses);
  };

  // Function to fetch chat messages
  const fetchChatMessages = async () => {
    console.log('HEY');
    try {
      let api = new DeveloperAPIClient();
      let UserMobile = await AsyncStorage.getItem('MobileNumber');
      let Token = await AsyncStorage.getItem('token');
      let CustomerMobile = route?.params?.mobile;
      let chatsResponse = await api.getMongoChatMessages(
        UserMobile,
        Token,
        CustomerMobile,
      );
      setChatsMessage(chatsResponse?.data?.data.reverse());
    } catch (error) {
      console.error('Error fetching messages: ', error);
    }
  };

  const getSocketData = async data => {
    const handleSocketEvent = data => {
      const parsedData = JSON.parse(data);
      handleMessages(parsedData.cust_mob);
    };

    let UserMobile = await AsyncStorage.getItem('MobileNumber');
    console.log(
      'route.params.mobile + UserMobile',
      `${route.params.mobile + UserMobile}_update_refresh_chat`,
    );
    socket.current.on(
      `${route.params.mobile + UserMobile}_update_refresh_chat`,
      socketData => {
        console.log('socketData', socketData);
        fetchChatMessages();
      },
    );
  };

  const ErrorFromSockets = async () => {
    socket.current.on('connect_error', function (err) {
      console.log('client connect_error: ', err);
    });

    socket.current.on('connect_timeout', function (err) {
      console.log('client connect_timeout: ', err);
    });
  };

  useEffect(() => {
    socket.current = io('https://uat.wroti.app');
    console.log('CHECK');
    socket.current.on('connect', function () {
      console.log('client connected');
    });
    ErrorFromSockets();
    fetchChatMessages();
    getSocketData();
  }, []);

  useEffect(() => {
    getChatStatus();
    getAgentStatus();
  }, []);

  // Function to handle sending replies
  const reply = async () => {
    try {
      let api = new DeveloperAPIClient();
      let UserMobile = await AsyncStorage.getItem('MobileNumber');
      let Token = await AsyncStorage.getItem('token');
      let Store = await AsyncStorage.getItem('StoreName');
      let CustomerMobile = route?.params?.mobile;
      let customername = route?.params?.name;
      let replyResponse = await api.sendMongoChatMessages(
        UserMobile,
        Token,
        CustomerMobile,
        Store,
        customername,
        replyMessage,
      );
      console.log('Reply sent: ', replyResponse.data);
      setReplyMessage(''); // Clear reply input after sending
      fetchChatMessages(); // Fetch messages after sending reply
    } catch (error) {
      console.error('Error sending reply: ', error);
    }
  };

  const renderItem = ({item}) => {
    let validButtons =
      item.buttons && item.buttons.filter(button => button && button.text);
    return (
      <View
        style={
          item.message_by === 'merchant'
            ? styles.merchantMessage
            : styles.customerMessage
        }>
        <Text style={styles.customertext}>
          {item.message_by === 'merchant'
            ? item.merchant_name
            : item.customer_name}
        </Text>

        <Text style={styles.text}>{item.message}</Text>

        {validButtons && validButtons.length > 0 && (
          <View style={{marginHorizontal: 10, marginVertical: 10}}>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              {validButtons.slice(0, 2).map((button, index) => (
                <TouchableOpacity key={index} style={styles.buttons}>
                  <Text
                    style={{
                      fontSize: 15,
                      fontFamily: 'Poppins-Bold',
                      color: 'green',
                      alignSelf: 'center',
                    }}>
                    {button.text}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {validButtons.length > 2 && (
              <View style={{marginTop: 10}}>
                <TouchableOpacity style={styles.buttons}>
                  <Text
                    style={{
                      fontSize: 15,
                      fontFamily: 'Poppins-Bold',
                      color: 'green',
                      alignSelf: 'center',
                      marginLeft: 30,
                    }}>
                    {validButtons[2].text}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
        <Text
          style={{
            marginLeft: 'auto',
            fontSize: 10,
            fontFamily: 'Poppins-Regular',
          }}>
          {moment(item.message_time).local().format('hh:mm a')}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar
        backgroundColor="#F4F5F7"
        barStyle={theme.dark ? 'light-content' : 'dark-content'}
      />

      <View style={styles.header}>
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() => navigation.goBack()}>
          <Image
            style={{
              width: 28,
              height: 28,
              resizeMode: 'center',
              tintColor: '#FFFFFF',
            }}
            source={require('../../assets/back3x.png')}
          />
        </TouchableOpacity>
        <View style={{marginLeft: 10, flexDirection: 'row'}}>
          <Text
            style={{
              color: '#2B2520',
              fontFamily: 'Poppins-SemiBold',
              fontSize: 16,
              color: '#FFFFFF',
              alignSelf: 'center',
            }}>
            {route?.params?.name}
          </Text>

          <TouchableOpacity onPress={() => handleChange(3)}>
            <Image
              style={{height: 24, width: 24}}
              source={
                isFavorite
                  ? require('../../assets/starFilled.png')
                  : require('../../assets/star.png')
              }
            />
          </TouchableOpacity>
        </View>

        {!isFavorite && (
          <View
            style={{
              backgroundColor: '#FFFFFF',
              padding: 5,
              borderRadius: 15,
              marginLeft: 'auto',
            }}>
            <Text style={{fontSize: 12, fontFamily: 'Poppins-SemiBold'}}>
              {statusName}
            </Text>
          </View>
        )}

        <View
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 10,
            justifyContent: 'center',
            marginLeft: 'auto',
            marginRight: 8,
          }}>
          <Switch
            trackColor={{false: '#767577', true: '#4CAF50'}} // Track colors
            thumbColor={isEnabled ? '#f4f3f4' : '#f4f3f4'} // Thumb color
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleSwitch}
            value={isEnabled}
            style={styles.switch}
          />
        </View>
      </View>

      {/* <DropDownPicker
        open={open}
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={setValue}
        setItems={setItems}
        onChangeValue={()=>handleChange()}
        placeholder="Select Status"
        style={styles.dropdown}
        dropDownStyle={styles.dropdownContainer}
        containerStyle={styles.dropdownWrapper}
      /> */}

      <FlatList
        data={chatsMessage}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()} // Ensure key is string
        inverted // Display messages from bottom to top
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={replyMessage}
          onChangeText={setReplyMessage}
          placeholder="Type a message"
        />

        <TouchableOpacity
          onPress={reply}
          style={{
            justifyContent: 'center',
            height: 50,
            width: 80,
            borderRadius: 5,
            backgroundColor: '#337D3E',
            marginRight: 10,
          }}>
          <Text
            style={{
              alignSelf: 'center',
              color: '#FFF',
              fontSize: 16,
              fontFamily: 'Poppins-Bold',
            }}>
            Send
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ChattingBox;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    // marginTop: 15,
    // marginHorizontal: 5,
    backgroundColor: '#337D3E',
    paddingVertical: 10,
  },
  customerMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#f7f5f5',
    padding: 10,
    margin: 5,
    borderRadius: 10,
  },
  merchantMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#e1ffc7',
    padding: 10,
    margin: 5,
    borderRadius: 10,
  },
  customertext: {
    color: '#000',
    fontSize: 10,
    fontFamily: 'Poppins-Medium',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginHorizontal: 10,
    flex: 1,
  },
  text: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    maxWidth: '80%',
  },
  buttons: {
    backgroundColor: '#FFF',
    height: 40,
    padding: 10,
    flexDirection: 'row',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'green',
    justifyContent: 'space-between',
  },
  switch: {
    transform: [{scaleX: 1.0}, {scaleY: 0.9}],
  },
  dropdownContainer: {
    width: 150,
  },
  dropdown: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    width: '100%',
  },
  dropdownWrapper: {
    width: 160,
    marginLeft: 'auto',
    marginRight: 5,
  },
});
