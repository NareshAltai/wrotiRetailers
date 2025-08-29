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
  Button,
} from 'react-native';
import {useTheme} from '@react-navigation/native';
// import AnimateLoadingButton from "react-native-animate-loading-button";
import DeveloperAPIClient from '../state/middlewares/DeveloperAPIClient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-simple-toast';
import * as customerActions from '../redux/actions/customerActions';
import {useDispatch, useSelector} from 'react-redux';
import CustomLoadingButton from '../components/CustomLoadingButton';

const AddGroupScreen = ({navigation}) => {
  const theme = useTheme();
  const {colors} = useTheme();
  const [groupName, setGroupName] = React.useState();
  const [data, setData] = React.useState({
    getStartedButton: {},
  });
  const [refreshing, setRefreshing] = React.useState(true);
  const [checked, setChecked] = React.useState(false);
  const [isSelected, setSelection] = useState(false);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [isLoadMore, setIsLoadMore] = React.useState(true);
  const [displayCustomers, setDisplayCustomers] = React.useState();
  const dispatch = useDispatch();

  const createCustomerGroup = async () => {
    if (
      groupName != undefined &&
      groupName != '' &&
      groupName != null &&
      groupName[0] != ' '
    ) {
      data.getStartedButton.showLoading(true);
      const api = new DeveloperAPIClient();
      let Token = await AsyncStorage.getItem('token');
      let createCustomerGroup = await api.getAddNewCustomerGroup(
        Token,
        groupName,
      );
      if (
        createCustomerGroup != null &&
        createCustomerGroup != undefined &&
        createCustomerGroup.data != undefined
      ) {
        let addCustomerToGroup = await api.addCustomerToCustomerGroup(
          Token,
          createCustomerGroup.data.customergroup,
          selectedItems,
        );
        if (
          addCustomerToGroup != null &&
          addCustomerToGroup != undefined &&
          addCustomerToGroup.data != undefined
        ) {
          if (addCustomerToGroup.data.success == true) {
            Toast.showWithGravity(
              'Customer Group Created Successfully',
              Toast.LONG,
              Toast.BOTTOM,
            );
            setIsLoadMore(true);
            data.getStartedButton.showLoading(false);
            navigation.navigate('CustumersScreen');
          } else {
            Toast.showWithGravity(
              'Something went wrong',
              Toast.LONG,
              Toast.BOTTOM,
            );
            data.getStartedButton.showLoading(false);
          }
        }
      } else {
        Toast.showWithGravity(
          'Failed to Create Customer Group',
          Toast.LONG,
          Toast.BOTTOM,
        );
        data.getStartedButton.showLoading(false);
      }
    } else {
      Toast.showWithGravity(
        'Please enter valid group name',
        Toast.LONG,
        Toast.BOTTOM,
      );
      data.getStartedButton.showLoading(false);
    }
  };

  const CustumersData = useSelector(state => state.customer.customerslist);

  const customerTotal = useSelector(state => state.customer.customerTotal);

  const loadCustumersList = async (pageNo, searchKey) => {
    setDisplayCustomers();
    dispatch(customerActions.refreshCustomers());
    setRefreshing(true);
    dispatch(customerActions.loadcustumers(pageNo, searchKey));
    setIsLoadMore(true);
    setCurrentPage(1);
    setRefreshing(false);
  };

  const _handleLoadMore = async () => {
    if (isLoadMore) {
      dispatch(customerActions.loadcustumers(currentPage + 1));
      setCurrentPage(currentPage + 1);
    }
  };

  useEffect(() => {
    if (CustumersData) {
      if (customerTotal == 10 || CustumersData.length < 10) {
        setIsLoadMore(false);
      } else {
        setIsLoadMore(true);
      }
      if (CustumersData.length < 10) {
        setIsLoadMore(false);
      } else {
        setIsLoadMore(true);
      }
      if (displayCustomers) {
        setDisplayCustomers([...displayCustomers, ...CustumersData]);
      } else {
        setDisplayCustomers(CustumersData);
      }
    }
  }, [CustumersData]);

  const updateGroupName = async val => {
    setGroupName(val);
  };

  const [selectedItems, setSelectedItems] = useState([]);

  const onSelectedItemsChange = (val, item) => {
    let items = [...selectedItems];
    if (items.includes(item.customer_id)) {
      //remove element from array
      const index = items.indexOf(item.customer_id);
      if (index > -1) {
        // only splice array when item is found
        items.splice(index, 1); // 2nd parameter means remove one item only
      }
    } else {
      items.push(item.customer_id);
    }
    setSelectedItems(items);
  };

  const renderItem = ({item, index}) => (
    <View>
      <View style={{flexDirection: 'row'}}>
        <TouchableOpacity style={{flexDirection: 'column', margin: 5}}>
          <Text
            style={{
              fontSize: 16,
              fontFamily: 'Poppins-Medium',
              marginLeft: '5%',
              marginTop: '6%',
              justifyContent: 'space-between',
            }}>
            {item.name ? item.name : 'No Name'}
          </Text>
          <Text style={{color: 'black', marginLeft: '5%', fontSize: 13}}>
            {item.telephone ? item.telephone : 'No Number'}
          </Text>
        </TouchableOpacity>
        <View style={{marginLeft: 'auto', marginTop: '6%'}}>
          <CheckBox
            value={selectedItems.includes(item.customer_id) ? true : false}
            onValueChange={val => onSelectedItemsChange(val, item)}
            style={styles.checkbox}
          />
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
      <View style={styles.header}>
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() => navigation.goBack()}>
          <Image
            style={{width: 28, height: 28, resizeMode: 'center'}}
            source={require('../assets/back3x.png')}
          />
        </TouchableOpacity>
        <View style={{marginLeft: 1, flexDirection: 'row'}}>
          <Text style={styles.headerTitle}> Create customer group </Text>
        </View>
      </View>
      <View style={{marginVertical: 10}}>
        <View
          style={{
            marginHorizontal: 20,
            backgroundColor: 'white',
            elevation: 2,
            padding: 10,
            borderRadius: 5,
            marginVertical: 5,
            height: '95%',
            width: '90%',
          }}>
          <Text
            style={{
              color: '#21272E',
              fontFamily: 'Poppins-SemiBold',
              fontSize: 14,
            }}>
            Group Name
          </Text>
          <TextInput
            style={{
              height: 40,
              margin: 12,
              padding: 10,
              backgroundColor: '#F7F7FC',
              borderRadius: 5,
            }}
            placeholder="Enter group name"
            underlineColorAndroid="transparent"
            onChangeText={val => updateGroupName(val)}
            value={groupName}
          />

          <TouchableOpacity
            style={{
              height: 40,
              margin: 12,
              padding: 10,
              backgroundColor: '#F7F7FC',
              borderRadius: 5,
              marginTop: '2%',
            }}
            onPress={() => {
              loadCustumersList(1, '');
              setChecked(!checked), setSelectedItems([]);
            }}>
            <Text
              style={{
                fontFamily: 'Poppins-Medium',
                fontSize: 16,
                textAlign: 'center',
              }}>
              + Add customer{' '}
            </Text>
          </TouchableOpacity>

          <View style={{height: '55%', marginBottom: 25}}>
            {checked ? (
              <FlatList
                onEndReached={() => _handleLoadMore()}
                data={displayCustomers}
                renderItem={renderItem}
              />
            ) : (
              <></>
            )}
          </View>
          <Button
            title="Create Group"
            onPress={() => {
              createCustomerGroup();
            }}
          />
          <CustomLoadingButton
            ref={c => (this.state.data.getStartedButton = c)}
            width={300}
            height={50}
            title="Continue"
            titleFontSize={12}
            titleFontFamily="Poppins-Bold"
            titleColor="#FFF"
            backgroundColor="#34A549"
            borderRadius={4}
            onPress={() => {
              createCustomerGroup();
            }}
          />
        </View>
      </View>
    </View>
  );
};

export default AddGroupScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F5F7',
  },
  headerTitle: {
    color: '#2B2520',
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
    textAlign: 'center',
  },
  header: {
    flexDirection: 'row',
    marginHorizontal: 5,
    marginVertical: 15,
  },
});
