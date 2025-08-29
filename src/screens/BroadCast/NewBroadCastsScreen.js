import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StatusBar,
  Image,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  FlatList,
  CheckBox,
} from 'react-native';
import {useTheme} from '@react-navigation/native';
import {Divider, Menu} from 'react-native-paper';
import DeveloperAPIClient from '../../state/middlewares/DeveloperAPIClient';
import {decode} from 'html-entities';
import {useDispatch, useSelector} from 'react-redux';
import * as customerActions from '../../redux/actions/customerActions';
import {useIsFocused} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RBSheet from 'react-native-raw-bottom-sheet';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';
import Toast from 'react-native-simple-toast';

const NewBroadCastsScreen = ({navigation, route}) => {
  const theme = useTheme();
  const {colors} = useTheme();
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const [customerGroupsList, setCustomerGroupsList] = React.useState();
  const [visibleGroups, setVisibleGroups] = React.useState(false);
  const [visibleTemplates, setVisibleTemplates] = React.useState(false);
  const [selectedCustomerGroups, setSelectedCustomerGroups] = React.useState(
    [],
  );
  const [selectedCustomerGroupNames, setSelectedCustomerGroupNames] = useState(
    [],
  );
  const [selectedTemplate, setSelectedTemplate] = React.useState();
  const [templateListing, setTemplateListing] = React.useState([]);
  // let todayDate = new Date();
  const currentDate = new Date();
  const currentDateTime = moment
    .utc(currentDate)
    .local()
    .format('YYYY-MM-DD hh:mm:ss');
  const [selectedDate, setSelectedDate] = React.useState();
  const [title, setTitle] = React.useState();
  const [scheduleSelected, setScheduleSelected] = React.useState({
    scheduleSelected: {},
  });
  const [customerGroups, setCustomerGroups] = React.useState();
  // const customerGroups = useSelector(
  //   (state) => state.customer.customersGroupList
  // );

  const loadCustumerGroups = async () => {
    // dispatch(customerActions.refreshCustomers());
    // dispatch(customerActions.loadCustomerGroups("", 1));
    let api = new DeveloperAPIClient();
    let Token = await AsyncStorage.getItem('token');
    let CustumerData = await api.getCustomerGroups(Token, '', 1);
    if (CustumerData.data.success == true) {
      setCustomerGroups(CustumerData.data.customergroups);
    }
  };

  const loadTemplates = async () => {
    let api = new DeveloperAPIClient();
    let UserMobile = await AsyncStorage.getItem('MobileNumber');
    let Token = await AsyncStorage.getItem('token');
    let loadTemplates = await api.getMessageTemplates(UserMobile, Token);
    if (loadTemplates.success == true) {
      let localArray = loadTemplates.templates;
      let fliterArray = localArray.filter(obj => obj.status != 'PENDING');
      console.log('Filtered Array', JSON.stringify(fliterArray));
      // localOptions.filter(option => option.option_id == val.option_id)
      setTemplateListing(fliterArray);
    } else {
      setTemplateListing([]);
    }
  };

  const sendCampaign = async type => {
    if (title == '' || title == undefined || title?.length <= 0) {
      Toast.showWithGravity(
        'Please enter campaign name',
        Toast.LONG,
        Toast.BOTTOM,
      );
      return false;
    }
    if (selectedCustomerGroups && selectedCustomerGroups?.length <= 0) {
      Toast.showWithGravity(
        'Please select atleast one customer group',
        Toast.LONG,
        Toast.BOTTOM,
      );
      return false;
    }
    if (
      selectedTemplate?.id == undefined ||
      selectedTemplate == '' ||
      selectedTemplate?.id == null
    ) {
      Toast.showWithGravity(
        'Please select atleast one template',
        Toast.LONG,
        Toast.BOTTOM,
      );
      return false;
    }
    let api = new DeveloperAPIClient();
    let UserMobile = await AsyncStorage.getItem('MobileNumber');
    let Token = await AsyncStorage.getItem('token');
    let dateTime = moment.utc(currentDate).format('YYYY-MM-DD hh:mm:ss');
    let sendCampaignResponse = await api.sendCampaign(
      UserMobile,
      title,
      selectedTemplate?.id,
      type,
      dateTime,
      selectedCustomerGroups,
      Token,
    );
    if (sendCampaignResponse?.success == true) {
      Toast.showWithGravity(
        sendCampaignResponse?.message,
        Toast.LONG,
        Toast.BOTTOM,
      );
      scheduleSelected.scheduleSelected.close();
      navigation.navigate('BroadCastsScreen');
    } else {
      Toast.showWithGravity(
        sendCampaignResponse?.message,
        Toast.LONG,
        Toast.BOTTOM,
      );
    }
  };

  const updateCampaign = async type => {
    if (title == '' || title == undefined || title?.length <= 0) {
      Toast.showWithGravity(
        'Please enter campaign name',
        Toast.LONG,
        Toast.BOTTOM,
      );
      return false;
    }
    if (selectedCustomerGroups && selectedCustomerGroups?.length <= 0) {
      Toast.showWithGravity(
        'Please select atleast one customer group',
        Toast.LONG,
        Toast.BOTTOM,
      );
      return false;
    }
    if (
      selectedTemplate?.id == undefined ||
      selectedTemplate == '' ||
      selectedTemplate?.id == null
    ) {
      Toast.showWithGravity(
        'Please select atleast one template',
        Toast.LONG,
        Toast.BOTTOM,
      );
      return false;
    }
    let api = new DeveloperAPIClient();
    let UserMobile = await AsyncStorage.getItem('MobileNumber');
    let Token = await AsyncStorage.getItem('token');
    let dateTime = moment.utc(currentDate).format('YYYY-MM-DD hh:mm:ss');
    console.log('params====', route.params.optionObject);
    let campaignId = route.params.optionObject.id;
    console.log('PayLoad', {
      UserMobile,
      title,
      selectedTemplate,
      type,
      selectedDate,
      selectedCustomerGroups,
      Token,
      campaignId,
    });
    let sendCampaignResponse = await api.updateCampaign(
      UserMobile,
      title,
      selectedTemplate?.id,
      type,
      selectedDate,
      selectedCustomerGroups,
      Token,
      campaignId,
    );
    console.log('send===>', sendCampaignResponse);
    if (sendCampaignResponse.success == true) {
      Toast.showWithGravity(
        sendCampaignResponse?.message,
        Toast.LONG,
        Toast.BOTTOM,
      );
      scheduleSelected.scheduleSelected.close();
      navigation.navigate('BroadCastsScreen');
    } else {
      Toast.showWithGravity(
        sendCampaignResponse?.message,
        Toast.LONG,
        Toast.BOTTOM,
      );
    }
  };

  const onRemoveCustomerGroup = async val => {
    for (let i = 0; i <= selectedCustomerGroups.length; i++) {
      if (selectedCustomerGroups[i] == val.customer_group_id) {
        const index = selectedCustomerGroups.indexOf(val.customer_group_id);
        if (index > -1) {
          // only splice array when item is found
          selectedCustomerGroups.splice(index, 1); // 2nd parameter means remove one item only
        }
        setSelectedCustomerGroups(selectedCustomerGroups);
      }
    }

    let localSelectedCategories = selectedCustomerGroupNames.filter(function (
      item,
    ) {
      return item.name != val.name;
    });
    setSelectedCustomerGroupNames([]);
    setSelectedCustomerGroupNames(localSelectedCategories);
  };

  const renderItemCategories = ({item, index}) => (
    <View style={{marginHorizontal: 5, marginVertical: 10}}>
      <View
        style={{
          borderRadius: 10,
          borderWidth: 1,
          borderColor: '#34A549',
          width: '100%',
          flexDirection: 'row',
          backgroundColor: '#34A549',
          // margin:2
        }}>
        <Text
          style={{
            padding: 2,
            flex: 2.5,
            color: '#FFF',
            fontFamily: 'Poppins-Regular',
          }}
          numberOfLines={1}>
          {item.name}
        </Text>
        <TouchableOpacity onPress={() => onRemoveCustomerGroup(item)}>
          <Image
            style={{
              marginTop: 3,
              width: 18,
              height: 18,
              resizeMode: 'center',
            }}
            source={require('../../assets/cross.png')}
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  const onSelectedRemoveCustomerGroups = item => {
    let items = [...selectedCustomerGroups];
    let itemsNames = [...selectedCustomerGroupNames];
    if (items.includes(item.customer_group_id)) {
      const index = items.indexOf(item.customer_group_id);
      if (index > -1) {
        items.splice(index, 1);
      }
    } else {
      items.push(item.customer_group_id);
    }

    if (itemsNames.length > 0) {
      let count = itemsNames.length;
      for (let i = 0; i < count; i++) {
        if (
          itemsNames[i] != undefined &&
          itemsNames[i].customer_group_id == item.customer_group_id
        ) {
          itemsNames.splice(i, 1);
        }
      }
    }
    setSelectedCustomerGroups(items);
    setSelectedCustomerGroupNames(itemsNames);
  };

  const onSelectedCustomergroups = item => {
    let items = [...selectedCustomerGroups];
    let itemsNames = [...selectedCustomerGroupNames];

    if (items.includes(item.customer_group_id)) {
      const index = items.indexOf(item.customer_group_id);
      if (index > -1) {
        items.splice(index, 1);
      }
    } else {
      items.push(item.customer_group_id);
    }
    itemsNames.push(item);
    setSelectedCustomerGroups(items);
    setSelectedCustomerGroupNames(itemsNames);
  };

  const updateTemplate = async item => {
    setSelectedTemplate(item);
    setVisibleTemplates(false);
  };

  useEffect(() => {
    loadCustumerGroups();
    loadTemplates();
    setTimeout(async () => {
      let api = new DeveloperAPIClient();
      let Token = await AsyncStorage.getItem('token');
      let UserMobile = await AsyncStorage.getItem('MobileNumber');
      let CustumerData = await api.getCustomerGroups(Token, '', 1);
      let loadTemplates = await api.getMessageTemplates(UserMobile, Token);
      console.log(
        'route?.params?.optionObject?.id',
        route?.params?.optionObject,
      );
      if (route && route?.params?.optionObject != undefined) {
        let localArray = [];
        setTitle(route?.params?.optionObject?.name);
        const currentDateTime = moment
          .utc(route?.params?.optionObject?.scheduledAt)
          .format('YYYY-MM-DD hh:mm:ss');
        console.log('testDate', currentDateTime);
        console.log('responseDate', route?.params?.optionObject?.scheduledAt);
        setSelectedDate(currentDateTime);
        setSelectedCustomerGroups(route?.params?.optionObject?.customerGroups);
        for (let i = 0; i < CustumerData?.data?.customergroups?.length; i++) {
          for (
            let j = 0;
            j < route?.params?.optionObject?.customerGroups?.length;
            j++
          ) {
            if (
              CustumerData?.data?.customergroups[i]?.customer_group_id ==
              route?.params?.optionObject?.customerGroups[j]
            ) {
              localArray.push(CustumerData?.data?.customergroups[i]);
            }
          }
          setSelectedCustomerGroupNames(localArray);
        }
        for (let i = 0; i < loadTemplates.templates.length; i++) {
          if (
            loadTemplates.templates[i].id ==
            route?.params?.optionObject?.templateId
          ) {
            setSelectedTemplate(loadTemplates.templates[i]);
          }
        }
        console.log('SelectedTemplate', selectedTemplate);
      }
    });
  }, [isFocused]);

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
        }}>
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() => navigation.goBack()}>
          <Image
            style={{width: 28, height: 28, resizeMode: 'center'}}
            source={require('../../assets/back3x.png')}
          />
        </TouchableOpacity>
        <View style={{marginLeft: 1}}>
          <Text
            style={{
              color: '#2B2520',
              fontFamily: 'Poppins-Medium',
              fontSize: 20,
            }}>
            {route?.params?.optionObject
              ? 'Update Campaign'
              : 'Create Campaign'}
          </Text>
        </View>
      </View>
      <Divider />
      {/* <ScrollView> */}
      <View style={{marginTop: 10, flexDirection: 'row'}}>
        <Text style={{marginLeft: 12, fontFamily: 'Poppins-Medium'}}>
          Campaign Title
        </Text>
      </View>
      <TextInput
        style={{
          height: 40,
          margin: 12,
          padding: 10,
          backgroundColor: '#F7F7FC',
          fontFamily: 'Poppins-Regular',
        }}
        maxLength={20}
        placeholder="Campaign Name"
        value={title}
        onChangeText={val => setTitle(val)}
      />

      <View style={{marginTop: 10, flexDirection: 'row'}}>
        <Text style={{marginLeft: 12, fontFamily: 'Poppins-Medium'}}>
          Customer Groups
        </Text>
      </View>

      <View
        style={{
          height: 40,
          margin: 12,
          padding: 5,
          backgroundColor: '#F7F7FC',
        }}>
        <Menu
          visible={visibleGroups}
          onDismiss={() => setVisibleGroups(!visibleGroups)}
          anchor={
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                marginHorizontal: 10,
              }}
              activeOpacity={0.7}
              onPress={() => setVisibleGroups(!visibleGroups)}>
              <Text style={{fontFamily: 'Poppins-Regular'}} numberOfLines={2}>
                {decode('Select Customer Groups')}
              </Text>
              <View style={{marginLeft: 'auto'}}>
                <Image
                  style={{
                    width: 25,
                    height: 25,
                    resizeMode: 'center',
                    transform: [{rotate: !visibleGroups ? '0deg' : '180deg'}],
                  }}
                  source={require('../../assets/down.png')}
                />
              </View>
              {/* <Text style={{ color: "#2F6E8F" }}>+ ADD</Text> */}
            </TouchableOpacity>
          }>
          {customerGroups &&
            customerGroups.map((val, i) => {
              return (
                <View style={{flexDirection: 'row'}}>
                  <View style={{marginTop: '5%'}}>
                    <CheckBox
                      value={
                        selectedCustomerGroups.includes(val.customer_group_id)
                          ? true
                          : false
                      }
                      onValueChange={() =>
                        selectedCustomerGroups.includes(val.customer_group_id)
                          ? onSelectedRemoveCustomerGroups(val)
                          : onSelectedCustomergroups(val)
                      }
                    />
                  </View>
                  <Menu.Item
                    style={{backgroundColor: '#fff'}}
                    key={i}
                    title={decode(val.name)}
                    onPress={() =>
                      selectedCustomerGroups.includes(val.customer_group_id)
                        ? onSelectedRemoveCustomerGroups(val)
                        : onSelectedCustomergroups(val)
                    }
                  />
                </View>
              );
            })}
        </Menu>
      </View>

      {selectedCustomerGroupNames.length != 0 && (
        <View>
          <Text
            style={{
              marginLeft: 12,
              marginTop: 5,
              fontFamily: 'Poppins-Medium',
            }}>
            Selected Customer Groups :
          </Text>
          <View style={{}}>
            <FlatList
              data={selectedCustomerGroupNames}
              // numColumns={1}

              horizontal={true}
              scrollEnabled={true}
              renderItem={renderItemCategories}
            />
          </View>
        </View>
      )}

      <View style={{marginTop: 10, flexDirection: 'row'}}>
        <Text style={{marginLeft: 12, fontFamily: 'Poppins-Medium'}}>
          Templates
        </Text>
      </View>
      <View
        style={{
          height: 40,
          margin: 12,
          padding: 5,
          backgroundColor: '#F7F7FC',
        }}>
        <Menu
          visible={visibleTemplates}
          onDismiss={() => setVisibleTemplates(!visibleTemplates)}
          anchor={
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                marginHorizontal: 10,
              }}
              activeOpacity={0.7}
              onPress={() => setVisibleTemplates(!visibleTemplates)}>
              {templateListing.length <= 0 || templateListing == undefined ? (
                <Text style={{fontFamily: 'Poppins-Regular', marginTop: 3}}>
                  No Active / Approved Templated Available
                </Text>
              ) : (
                <Text
                  style={{fontFamily: 'Poppins-Regular', marginTop: 3}}
                  numberOfLines={2}>
                  {decode(
                    selectedTemplate != null
                      ? selectedTemplate?.name
                      : 'Please Select Template',
                  )}
                </Text>
              )}
              <View style={{marginLeft: 'auto'}}>
                <Image
                  style={{
                    width: 25,
                    height: 25,
                    resizeMode: 'center',
                    transform: [
                      {rotate: !visibleTemplates ? '0deg' : '180deg'},
                    ],
                  }}
                  source={require('../../assets/down.png')}
                />
              </View>
              {/* <Text style={{ color: "#2F6E8F" }}>+ ADD</Text> */}
            </TouchableOpacity>
          }>
          <>
            {templateListing &&
              templateListing.map((val, i) => {
                return (
                  <View style={{flexDirection: 'row'}}>
                    <Menu.Item
                      style={{backgroundColor: '#fff'}}
                      key={i}
                      title={decode(val.name)}
                      onPress={() => updateTemplate(val)}
                    />
                  </View>
                );
              })}
          </>
        </Menu>
      </View>

      <RBSheet
        ref={ref => {
          scheduleSelected.scheduleSelected = ref;
        }}
        height={200}
        openDuration={250}
        customStyles={{
          container: {
            // justifyContent: "center",

            borderTopRightRadius: 30,
            borderTopLeftRadius: 30,
          },
        }}>
        <View style={{marginBottom: 10}}>
          <View
            style={{
              alignItems: 'center',
              marginHorizontal: 10,
              marginVertical: 10,
            }}>
            <Text style={{fontSize: 16, fontFamily: 'Poppins-Medium'}}>
              Schedule Campaign
            </Text>
          </View>
          <View style={{marginHorizontal: 10, marginVertical: 10}}>
            <Text style={{fontSize: 12, fontFamily: 'Poppins-Regular'}}>
              Select Date & Time
            </Text>
            <DatePicker
              style={{
                width: '100%',
                borderColor: '#3AA44D',
                fontFamily: 'Poppins-Medium',
                fontSize: 14,
              }}
              mode="datetime"
              placeholder="Select Date & Time"
              // 2023-05-17 00:14:00
              date={selectedDate ? selectedDate : ''}
              format="YYYY-MM-DD hh:mm:ss"
              confirmBtnText="Confirm"
              cancelBtnText="Cancel"
              onDateChange={val => {
                setSelectedDate(val);
              }}
              minDate={moment().toDate()}
              is24Hour={true}
            />
          </View>

          <TouchableOpacity
            style={{
              height: 40,
              width: '95%',
              borderRadius: 6,
              borderWidth: 1,
              borderColor: '#3AA44D',
              marginLeft: 10,
            }}
            onPress={() =>
              route?.params?.optionObject != undefined ||
              route?.params?.optionObject?.length > 0
                ? updateCampaign('schedule')
                : sendCampaign('schedule')
            }>
            <Text
              style={{
                color: '#4fb04a',
                textAlign: 'center',
                marginTop: 8,
                fontSize: 15,
                fontFamily: 'Poppins-SemiBold',
              }}>
              Schedule
            </Text>
          </TouchableOpacity>
        </View>
      </RBSheet>
      {/* </ScrollView> */}

      <TouchableOpacity
        style={{
          height: 40,
          width: '90%',
          borderRadius: 6,
          borderWidth: 1,
          borderColor: '#3AA44D',
          marginLeft: 19,
          position: 'absolute',
          bottom: 15,
          left: 0,
        }}
        onPress={() =>
          route?.params?.optionObject != undefined ||
          route?.params?.optionObject?.length > 0
            ? updateCampaign('now')
            : sendCampaign('now')
        }>
        <Text
          style={{
            color: '#4fb04a',
            textAlign: 'center',
            marginTop: 8,
            fontSize: 15,
            fontFamily: 'Poppins-SemiBold',
          }}>
          {route?.params?.optionObject != undefined ||
          route?.params?.optionObject?.length > 0
            ? 'Update'
            : 'SEND'}
        </Text>
      </TouchableOpacity>
      {/* <TouchableOpacity onPress={() => scheduleSelected.scheduleSelected.open()} style={{
        height: 40,
        width: "90%",
        borderRadius: 6,
        borderWidth: 1,
        borderColor: "#3AA44D",
        marginLeft: 19,
        marginTop: 15,
        marginBottom: 15

      }}>
        <Text style={{
          color: "#4fb04a",
          textAlign: "center",
          marginTop: 8,
          fontSize: 15,
          fontFamily: "Poppins-SemiBold"
        }}>Schedule</Text>
      </TouchableOpacity> */}
    </View>
  );
};

export default NewBroadCastsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFF',
  },
});
