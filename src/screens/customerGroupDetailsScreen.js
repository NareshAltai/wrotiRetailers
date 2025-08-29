import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Platform,
  StyleSheet,
  StatusBar,
  Image,
  TouchableOpacity,
  TextInput,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  CheckBox,
  Button,
} from 'react-native';
// import filter from 'lodash.filter';
import {useTheme} from '@react-navigation/native';
import DeveloperAPIClient from '../state/middlewares/DeveloperAPIClient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Divider} from 'react-native-paper';
import Toast from 'react-native-simple-toast';
import RBSheet from 'react-native-raw-bottom-sheet';
// import AnimateLoadingButton from "react-native-animate-loading-button";
import {useDispatch, useSelector} from 'react-redux';
import * as customerActions from '../redux/actions/customerActions';
// import OptionsMenu from 'wroti-react-native-option-menu';
//import NetworkChecker from "react-native-network-checker";
import Icon from 'react-native-vector-icons/EvilIcons';
import {useIsFocused} from '@react-navigation/native';
import CustomLoadingButton from '../components/CustomLoadingButton';

const customerGroupDetailsScreen = ({navigation, route}) => {
  const {colors} = useTheme();
  const theme = useTheme();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = React.useState(false);
  const [groupName, setGroupName] = React.useState('');
  const [checked, setChecked] = React.useState(false);
  const [groupObject, setGroupObject] = React.useState();
  const [selectedItems, setSelectedItems] = useState([]);
  const [refreshing, setRefreshing] = React.useState(true);
  const [totalCustomers, setTotalCustomers] = React.useState(0);
  const [name, setName] = React.useState();
  const [searchResults, setSearchresults] = React.useState();
  // const [searchResultsLength, setSearchresultsLength] = React.useState();
  const [searchKey, setSearchKey] = React.useState(null);
  const [customerSearchedInGroupDetails, setCustomerSearchedInGroupDetails] =
    React.useState(false);
  const [searchKeyCustomerInGroup, setSearchKeyCustomerInGroup] =
    React.useState(null);
  // conso
  const [displayCustomers, setDisplayCustomers] = React.useState();
  const [displayCustomersInGroup, setDisplayCustomersInGroup] =
    React.useState();
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageNo, setPageNo] = React.useState(1);
  const [isSearchedCustomer, setIsSearchedCustomer] = React.useState(false);
  const [searchCustomerListResults, setSearchCustomerListResults] =
    React.useState();
  const [issearched, setIsSearched] = React.useState(false);
  const [customerIdToDelete, setCustomerIdToDelete] = React.useState(false);
  const [customerNameToDelete, setCustomerNameToDelete] = React.useState(false);
  const isFocused = useIsFocused();
  const [isLoadMore, setIsLoadMore] = React.useState(true);
  const [emptySearch, setEmptySearch] = React.useState(false);
  const [customerEditFromSearch, setCustomerEditFromSearch] =
    React.useState(false);

  const customersList = useSelector(
    state => state.customer.customersGroupInList,
  );

  const CustumersData = useSelector(
    state => state.customer.customersGroupInList,
  );

  const groupLength = useSelector(
    state => state.customer.customerInGroupsTotal,
  );

  const customersLength = useSelector(
    state => state.customer.customersListInGroup,
  );

  const customersInGroupTotal = async () => {
    if (groupLength && groupLength != undefined) {
      if (!checked) {
        setTotalCustomers(groupLength);
      }
    } else {
      setTotalCustomers(0);
    }
  };

  const [data, setData] = React.useState({
    RBSheetDeleteGroup: {},
    RBSheetEditGroup: {},
    RBSheetDeleteCustomer: {},
    getStartedButton: {},
  });

  const [getStartedButton, setgetStartedButton] = React.useState({
    getStartedButton: {},
  });

  const onPress = () => {
    data.RBSheetDeleteGroup.close();
    data.RBSheet.open();
  };

  const loadCustomersByGroupId = async () => {
    setTotalCustomers();
    setDisplayCustomersInGroup();
    dispatch(customerActions.refreshCustomers());
    setRefreshing(true);
    let customer_group_id = route.params.customer_group_id;
    dispatch(customerActions.loadCustomerInGroups(1, '', customer_group_id, 0));
    setIsLoadMore(true);
    setRefreshing(false);
    setPageNo(1);
  };

  const updateGroupName = async val => {
    // let pattern =
    setName(val);
  };

  const addExistingCustomerToGroup = async () => {
    if (checked != true) {
      setDisplayCustomers();
      loadcustumers(1, ''),
        setSearchKey(),
        setSelectedItems([]),
        setChecked(!checked),
        setIsSearched(false);
    } else {
      setChecked(!checked), loadCustomersByGroupId(1), setIsLoadMore(true);
    }
  };

  const _handleLoadMore = async () => {
    if (isLoadMore) {
      setIsLoading(true);
      let customer_group_id = route.params.customer_group_id;
      let exclude = 1;
      dispatch(
        customerActions.loadCustomerInGroups(
          currentPage + 1,
          '',
          customer_group_id,
          exclude,
        ),
      );
      setCurrentPage(currentPage + 1);
      setIsLoading(false);
    }
  };

  const handleLoadMore = async () => {
    if (isLoadMore) {
      setIsLoading(true);
      let customer_group_id = route.params.customer_group_id;
      dispatch(
        customerActions.loadCustomerInGroups(
          pageNo + 1,
          '',
          customer_group_id,
          0,
        ),
      );
      setPageNo(pageNo + 1);
      setIsLoading(false);
    }
  };

  const sendUpdateValuesToApi = async () => {
    if (name == null || name.length == 0 || name.trim() == '') {
      Toast.showWithGravity(
        'Please enter valid groupname',
        Toast.LONG,
        Toast.BOTTOM,
      );
      return false;
    }
    const api = new DeveloperAPIClient();
    let Token = await AsyncStorage.getItem('token');
    let customer_group_id = route.params.customer_group_id;
    let updateCustomerGroup = await api.updateCustomerGroup(
      Token,
      name,
      customer_group_id,
    );
    if (
      updateCustomerGroup != null &&
      updateCustomerGroup != undefined &&
      updateCustomerGroup.data.success == true
    ) {
      setGroupName(name);
      Toast.showWithGravity(
        'Customer Group name updated',
        Toast.LONG,
        Toast.BOTTOM,
      );
    } else {
      Toast.showWithGravity(
        'Customer Group update failed.',
        Toast.LONG,
        Toast.BOTTOM,
      );
    }
    data.RBSheetEditGroup.close();
    // }
  };

  const deleteCustomerGroup = async () => {
    const api = new DeveloperAPIClient();
    let Token = await AsyncStorage.getItem('token');
    let customer_group_id = route.params.customer_group_id;
    let responseData = await api.deleteCustomerGroup(Token, customer_group_id);
    if (
      responseData != null &&
      responseData != undefined &&
      responseData.data.success == true
    ) {
      Toast.showWithGravity('Customer Group deleted', Toast.LONG, Toast.BOTTOM);
      navigation.goBack();
    } else {
      Toast.showWithGravity(
        'Customer Group removal failed.',
        Toast.LONG,
        Toast.BOTTOM,
      );
    }
    data.RBSheet.close();
  };

  const editCustomerFromGroup = async item => {
    item.isEdited = true;
    item.searchKey = searchKeyCustomerInGroup;
    setCustomerEditFromSearch(true);
    navigation.navigate('editCustomerFromGroup', {
      customerObject: item,
      customerGroupObject: groupObject,
      customer_id: item.customer_id,
    });
  };

  const deleteCustomerFromGroup = async customer_id => {
    setRefreshing(true);
    const api = new DeveloperAPIClient();
    let customer_group_id = route.params.customer_group_id;
    let Token = await AsyncStorage.getItem('token');
    let deletedData = await api.getDeleteCustomerFromGroup(
      Token,
      customer_group_id,
      customer_id,
    );
    loadCustomersByGroupId();
    searchCustomersInGroup(searchKeyCustomerInGroup);
    setRefreshing(false);
    if (
      deletedData != null &&
      deletedData != undefined &&
      deletedData.data.success == true
    ) {
      Toast.showWithGravity(
        'Customer removed from Group.',
        Toast.LONG,
        Toast.BOTTOM,
      );
    } else {
      Toast.showWithGravity(
        'Customer removal  failed.',
        Toast.LONG,
        Toast.BOTTOM,
      );
    }
  };

  const addCustomersToGroup = async () => {
    if (selectedItems.length <= 0) {
      Toast.showWithGravity(
        'Please select atleast one customer.',
        Toast.SHORT,
        Toast.BOTTOM,
      );
      return false;
    }
    // setDisplayCustomers()
    getStartedButton.getStartedButton.showLoading(true);
    setRefreshing(true);
    const api = new DeveloperAPIClient();
    let customer_group_id = route.params.customer_group_id;
    let Token = await AsyncStorage.getItem('token');
    let addCustomersToGroup = await api.addCustomerToCustomerGroup(
      Token,
      customer_group_id,
      selectedItems,
    );
    if (
      addCustomersToGroup.data != undefined &&
      addCustomersToGroup.data.success == true
    ) {
      Toast.showWithGravity(
        'Customer added successfully.',
        Toast.SHORT,
        Toast.BOTTOM,
      );
      setCurrentPage(1);
      loadCustomersByGroupId();
      setChecked(false);
      // navigation.goBack();
    }
    getStartedButton.getStartedButton.showLoading(false);
  };

  const loadcustumers = async pageno => {
    dispatch(customerActions.refreshCustomers());
    setRefreshing(true);
    let customer_group_id = route.params.customer_group_id;
    let exclude = 1;
    dispatch(
      customerActions.loadCustomerInGroups(
        pageno,
        '',
        customer_group_id,
        exclude,
      ),
    );
    setIsLoadMore(true);
    setRefreshing(false);
    setCurrentPage(1);
  };

  const searchCustomersInGroup = async val => {
    setSearchKeyCustomerInGroup(val);
    if (val != null || val.length != 0) {
      setPageNo(1);
      let api = new DeveloperAPIClient();
      let customer_group_id = route.params.customer_group_id;
      let Token = await AsyncStorage.getItem('token');
      let CustumerData = await api.getCustomersInCustomerGroup(
        Token,
        1,
        val,
        customer_group_id,
        0,
      );
      if (CustumerData.data.success == false) {
        setCustomerSearchedInGroupDetails(true);
        setEmptySearch(false);
        setSearchresults();
      } else {
        setCustomerSearchedInGroupDetails(true);
        setSearchresults(CustumerData.data.customers);
      }
    } else {
      setSearchresults();
    }
  };

  const searchCustomersInList = async val => {
    setSearchKey(val);
    if (val != null || val.length != 0) {
      setIsSearched(true);
      // setSearchKey(val);
      setPageNo(1);
      let api = new DeveloperAPIClient();
      let customer_group_id = route.params.customer_group_id;
      let Token = await AsyncStorage.getItem('token');
      let CustumerData = await api.getCustomersInCustomerGroup(
        Token,
        1,
        val,
        customer_group_id,
        1,
      );
      if (CustumerData.data.success == false) {
        setSearchCustomerListResults();
      } else {
        setSearchCustomerListResults(CustumerData.data.customers);
      }
    } else {
      setIsSearched(false);
    }
  };

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

  const onPressEditGroupName = () => {
    setName(groupName);
    data.RBSheetEditGroup.open();
  };

  const onOpenDeleteCustomerRbSheet = (customerId, name) => {
    setCustomerIdToDelete(customerId);
    setCustomerNameToDelete(name);

    // deleteCustomerFromGroup(customerId);
    // data.RBSheetDeleteCustomer.close();
  };

  const onDeleteCutomer = () => {
    deleteCustomerFromGroup(customerIdToDelete);
    data.RBSheetDeleteCustomer.close();
  };

  const onAddExistingCustomerToGroup = () => {
    if (searchKeyCustomerInGroup == null) {
      setIsSearchedCustomer(!isSearchedCustomer);
      setCustomerSearchedInGroupDetails(false);
    } else {
      setEmptySearch(true);
      setSearchresults();
      setSearchKeyCustomerInGroup();
    }
  };

  useEffect(() => {
    setGroupName(route.params.groupObject.name);
    setName(route.params.groupObject.name);
    setGroupObject(route.params.groupObject);
    const unsubscribe = navigation.addListener('focus', () => {
      setSearchresults([]);
      setCustomerSearchedInGroupDetails(false);
      setIsSearchedCustomer(false);
      loadCustomersByGroupId();
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (customersList) {
      if (customersLength == 10 || customersList.length < 10) {
        setIsLoadMore(false);
      } else {
        setIsLoadMore(true);
      }
      if (displayCustomers) {
        setDisplayCustomers([...displayCustomers, ...customersList]);
      } else {
        setDisplayCustomers(customersList);
      }
    }
  }, [customersList]);

  useEffect(() => {
    if (CustumersData) {
      customersInGroupTotal();
      if (groupLength == 10 || CustumersData.length < 10) {
        setIsLoadMore(false);
      } else {
        setIsLoadMore(true);
      }
      if (displayCustomersInGroup) {
        setDisplayCustomersInGroup([
          ...displayCustomersInGroup,
          ...CustumersData,
        ]);
      } else {
        setDisplayCustomersInGroup(CustumersData);
      }
    }
  }, [CustumersData]);

  const render = ({item, index}) => (
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
      <View style={{marginLeft: 'auto', marginTop: 2}}>
        <CheckBox
          value={selectedItems.includes(item.customer_id) ? true : false}
          onValueChange={val => onSelectedItemsChange(val, item)}
          style={styles.checkbox}
        />
      </View>
    </View>
  );

  const renderItem = ({item, index}) => (
    <View>
      <TouchableOpacity>
        <View>
          <View style={{flexDirection: 'row', marginTop: 15}}>
            <Text
              style={{
                fontSize: 14,
                fontStyle: 'Poppins-Medium',
                color: '#21272E',
                flex: 1.5,
              }}
              numberOfLines={1}>
              {item.name}
            </Text>
            <View style={{marginLeft: 'auto', flexDirection: 'row'}}>
              <TouchableOpacity onPress={() => editCustomerFromGroup(item)}>
                <Image
                  style={{
                    width: 26,
                    height: 26,
                    resizeMode: 'center',
                    marginRight: 8,
                    marginBottom: 3,
                  }}
                  source={require('../assets/e3x.png')}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  data.RBSheetDeleteCustomer.open(),
                    onOpenDeleteCustomerRbSheet(item.customer_id, item.name);
                }}>
                <Image
                  style={{
                    width: 20,
                    height: 20,
                    resizeMode: 'center',
                    marginRight: 12,
                  }}
                  source={require('../assets/remove3x.png')}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View>
            <View
              style={{
                marginTop: 1,
              }}>
              <Text
                style={{
                  color: '#9BA0A7',
                  fontFamily: 'poppins-Regular',
                  fontSize: 12,
                  margin: 1,
                  marginBottom: 10,
                }}>
                {item.telephone}
              </Text>
            </View>
          </View>
          <Divider />
        </View>
      </TouchableOpacity>
      <RBSheet
        ref={ref => {
          data.RBSheetDeleteCustomer = ref;
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
            Remove Customer From Group
          </Text>
          <Text
            style={{
              color: '#11151A',
              fontSize: 14,
              fontFamily: 'Poppins-Regular',
              textAlign: 'center',
            }}>
            Are you sure you want to remove {`\n`}
            {customerNameToDelete} ?
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
            onPress={() => onDeleteCutomer(item.customer_id)}>
            <Text
              style={{
                textAlign: 'center',
                fontFamily: 'Poppins-Bold',
                fontSize: 16,
                color: '#FFFFFF',
              }}>
              Remove{' '}
            </Text>
          </TouchableOpacity>
        </View>
      </RBSheet>
    </View>
  );

  const editCustomerRenderItem = ({item, index}) => (
    <View>
      <TouchableOpacity>
        <View>
          <View style={{flexDirection: 'row', marginTop: 15}}>
            <Text
              style={{
                fontSize: 14,
                fontStyle: 'Poppins-Medium',
                color: '#21272E',
                flex: 1.5,
              }}
              numberOfLines={1}>
              {item.name}
            </Text>
            <View style={{marginLeft: 'auto', flexDirection: 'row'}}>
              <TouchableOpacity onPress={() => editCustomerFromGroup(item)}>
                <Image
                  style={{
                    width: 26,
                    height: 26,
                    resizeMode: 'center',
                    marginRight: 8,
                    marginBottom: 3,
                  }}
                  source={require('../assets/e3x.png')}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  data.RBSheetDeleteCustomer.open(),
                    onOpenDeleteCustomerRbSheet(item.customer_id, item.name);
                }}>
                <Image
                  style={{
                    width: 20,
                    height: 20,
                    resizeMode: 'center',
                    marginRight: 12,
                  }}
                  source={require('../assets/remove3x.png')}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View>
            <View
              style={{
                marginTop: 1,
              }}>
              <Text
                style={{
                  color: '#9BA0A7',
                  fontFamily: 'poppins-Regular',
                  fontSize: 12,
                  margin: 1,
                  marginBottom: 10,
                }}>
                {item.telephone}
              </Text>
            </View>
          </View>
          <Divider />
        </View>
      </TouchableOpacity>
      <RBSheet
        ref={ref => {
          data.RBSheetDeleteCustomer = ref;
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
            Remove Customer From Group
          </Text>
          <Text
            style={{
              color: '#11151A',
              fontSize: 14,
              fontFamily: 'Poppins-Regular',
              textAlign: 'center',
            }}>
            Are you sure you want to remove {`\n`}
            {customerNameToDelete} ?
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
            onPress={() => onDeleteCutomer(item.customer_id)}>
            <Text
              style={{
                textAlign: 'center',
                fontFamily: 'Poppins-Bold',
                fontSize: 16,
                color: '#FFFFFF',
              }}>
              Remove{' '}
            </Text>
          </TouchableOpacity>
        </View>
      </RBSheet>
    </View>
  );
  // const searchHeader = () => (

  // );

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

          <View style={{marginLeft: 1, flexDirection: 'row'}}>
            <Text style={styles.headerTitle}>Customer Group </Text>
          </View>
        </View>
        {isLoading && <ActivityIndicator size="large" color="#51AF5E" />}
        <View style={{marginVertical: 10}}>
          <View>
            {/* <View style={styles.container}> */}
            <View
              style={{
                marginHorizontal: 10,
                backgroundColor: '#1B6890',
                elevation: 2,
                padding: 10,
                borderRadius: 5,
                marginVertical: 5,
              }}>
              <View>
                <View style={{flexDirection: 'row'}}>
                  <Text
                    style={{
                      fontSize: 16,
                      color: '#FFFFFF',
                      marginBottom: 5,
                      fontFamily: 'Poppins-Bold',
                      flex: 1.8,
                    }}
                    numberOfLines={1}>
                    {groupName}
                  </Text>
                  <View style={{flex: 1, alignItems: 'flex-end'}}>
                    <TouchableOpacity
                      onPress={() => onPressEditGroupName()}
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
                      <RBSheet
                        ref={ref => {
                          data.RBSheetEditGroup = ref;
                        }}
                        height={250}
                        openDuration={250}
                        customStyles={{
                          container: {
                            justifyContent: 'center',
                            borderTopRightRadius: 30,
                            borderTopLeftRadius: 30,
                          },
                        }}>
                        <Text
                          style={{
                            fontSize: 20,
                            fontFamily: 'Poppins-Bold',
                            //fontWeight: "bold",
                            fontSize: 20,
                            color: '#11151A',
                            marginVertical: 10,
                            textAlign: 'center',
                            marginTop: 25,
                          }}>
                          Edit Group
                        </Text>
                        <Divider />
                        <Text
                          style={{
                            color: '#21272E',
                            fontFamily: 'Poppins-SemiBold',
                            fontSize: 14,
                            marginVertical: 10,
                            marginHorizontal: 10,
                          }}>
                          Group Name
                        </Text>
                        <TextInput
                          style={{
                            height: 40,
                            borderRadius: 3,
                            marginTop: 5,
                            borderColor: '#F7F7FC',
                            paddingHorizontal: 20,
                            color: '#21272E',
                            fontSize: 17,
                            backgroundColor: '#F7F7FC',
                            width: '90%',
                            marginHorizontal: 10,
                            marginBottom: 25,
                          }}
                          // defaultValue={name}
                          autoCapitalize="none"
                          placeholder=""
                          placeholderTextColor="#9BA0A7"
                          returnKeyType="next"
                          onChangeText={val => updateGroupName(val)}
                          value={name}
                        />
                        <TouchableOpacity
                          style={{
                            width: '90%',
                            height: 45,
                            paddingTop: 12,
                            paddingBottom: 15,
                            backgroundColor: '#34A549',
                            borderRadius: 10,
                            borderWidth: 1,
                            borderColor: '#fff',
                            marginTop: 15,
                            marginLeft: 18,
                          }}
                          activeOpacity={0.6}
                          onPress={() => sendUpdateValuesToApi()}>
                          <Text
                            style={{
                              textAlign: 'center',
                              fontFamily: 'Poppins-Bold',
                              fontSize: 16,
                              color: '#FFFFFF',
                            }}>
                            Continue{' '}
                          </Text>
                        </TouchableOpacity>
                      </RBSheet>
                    </TouchableOpacity>
                  </View>

                  <TouchableOpacity
                    onPress={() => data.RBSheetDeleteGroup.open()}>
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
                      data.RBSheetDeleteGroup = ref;
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
                        Remove group
                      </Text>
                      <Text
                        style={{
                          color: '#11151A',
                          fontSize: 14,
                          fontFamily: 'Poppins-Regular',
                          textAlign: 'center',
                        }}>
                        Are you sure you want to remove {`\n`}
                        {groupName != null ? groupName : ''} ?
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
                        onPress={() => onPress()}>
                        <Text
                          style={{
                            textAlign: 'center',
                            fontFamily: 'Poppins-Bold',
                            fontSize: 16,
                            color: '#FFFFFF',
                          }}>
                          Remove{' '}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </RBSheet>

                  <RBSheet
                    ref={ref => {
                      data.RBSheet = ref;
                    }}
                    height={350}
                    openDuration={250}
                    customStyles={{
                      container: {
                        justifyContent: 'center',
                        borderTopRightRadius: 30,
                        borderTopLeftRadius: 30,
                      },
                    }}>
                    <Image
                      style={{resizeMode: 'contain', alignSelf: 'center'}}
                      source={require('../assets/category.png')}
                    />
                    <View>
                      <Text
                        style={{
                          fontSize: 20,
                          fontFamily: 'Poppins-SemiBold',
                          fontSize: 20,
                          color: '#E26251',
                          marginVertical: 10,
                          textAlign: 'center',
                          // marginTop: "8%",
                        }}>
                        Group Removed from list
                      </Text>
                      <Text
                        style={{
                          color: '#11151A',
                          fontSize: 14,
                          fontFamily: 'Poppins-Regular',
                          textAlign: 'center',
                          marginBottom: 5,
                        }}>
                        Customer Group was removed {`\n`}from the group list
                      </Text>
                      <TouchableOpacity
                        style={{
                          width: '90%',
                          height: 45,
                          paddingTop: 12,
                          paddingBottom: 15,
                          backgroundColor: '#34A549',
                          borderRadius: 10,
                          borderWidth: 1,
                          borderColor: '#fff',
                          marginTop: 30,
                          marginLeft: 18,
                        }}
                        activeOpacity={0.6}
                        onPress={() => deleteCustomerGroup()}>
                        <Text
                          style={{
                            textAlign: 'center',
                            fontFamily: 'Poppins-Bold',
                            fontSize: 16,
                            color: '#FFFFFF',
                          }}>
                          Continue{' '}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </RBSheet>
                </View>
                {checked != true && displayCustomersInGroup != undefined && (
                  <Text
                    style={{
                      fontSize: 16,
                      color: '#FFFFFF',
                      marginBottom: 5,
                      fontFamily: 'Poppins-Bold',
                    }}>
                    {totalCustomers != undefined ? totalCustomers : 0} MEMBERS
                  </Text>
                )}
              </View>
            </View>
          </View>

          <View
            style={{
              marginHorizontal: 10,
              backgroundColor: '#fff',
              elevation: 2,
              padding: 10,
              borderRadius: 5,
              marginVertical: 3,
              height: '81.5%',
            }}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('addCustomerFromGroup', {
                  customerGroupObject: groupObject,
                })
              }
              style={{
                height: 40,
                margin: 12,
                padding: 10,
                backgroundColor: '#F7F7FC',
                borderRadius: 5,
                marginTop: '2%',
                elevation: 2,
                // marginBottom: 25,
              }}>
              <Text
                style={{
                  fontFamily: 'Poppins-Medium',
                  fontSize: 16,
                  textAlign: 'center',
                }}>
                + Add New Customer{' '}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => addExistingCustomerToGroup()}
              style={{
                height: 40,
                margin: 12,
                padding: 10,
                backgroundColor: '#F7F7FC',
                borderRadius: 5,
                marginTop: '2%',
                elevation: 2,
                marginBottom: 25,
              }}>
              <Text
                style={{
                  fontFamily: 'Poppins-Medium',
                  fontSize: 16,
                  textAlign: 'center',
                }}>
                + Add Existing Customer{' '}
              </Text>
            </TouchableOpacity>

            {checked != true && (
              <View>
                {totalCustomers != undefined || totalCustomers != null ? (
                  <View style={{flexDirection: 'row', marginTop: 20}}>
                    {isSearchedCustomer != true ? (
                      <Text
                        style={{
                          fontSize: 12,
                          marginBottom: 5,
                          fontFamily: 'Poppins-Bold',
                          flex: 1,
                          textAlign: 'left',
                        }}>
                        {totalCustomers} MEMBERS
                      </Text>
                    ) : (
                      <View
                        style={{
                          marginBottom: 10,
                          flexDirection: 'row',
                          backgroundColor: '#e6e6e6',
                          borderRadius: 10,
                          width: '100%',
                          alignSelf: 'center',
                        }}>
                        <TextInput
                          style={{width: '80%', paddingLeft: 10}}
                          autoCapitalize="none"
                          placeholder="Search Customer In Group"
                          underlineColorAndroid="transparent"
                          onChangeText={val => searchCustomersInGroup(val)}
                          value={searchKeyCustomerInGroup}
                          maxLength={15}
                        />
                        <TouchableOpacity
                          onPress={() => onAddExistingCustomerToGroup()}>
                          <Image
                            style={{
                              width: 10,
                              height: 10,
                              tintColor: 'black',
                              marginTop: 20,
                              marginLeft: 30,
                            }}
                            source={require('../assets/close2x.png')}
                          />
                        </TouchableOpacity>
                      </View>
                    )}
                    {isSearchedCustomer != true && (
                      <View
                        style={{alignItems: 'flex-end', marginHorizontal: 10}}>
                        <TouchableOpacity
                          onPress={() => {
                            setIsSearchedCustomer(!isSearchedCustomer),
                              setCustomerSearchedInGroupDetails(true),
                              setSearchKeyCustomerInGroup();
                            setSearchresults(), setEmptySearch(true);
                          }}>
                          <Image
                            style={{
                              width: 25,
                              height: 25,
                              resizeMode: 'center',
                            }}
                            source={require('../assets/path2x.png')}
                          />
                        </TouchableOpacity>
                      </View>
                    )}

                    <Divider />
                  </View>
                ) : (
                  <View style={{flex: 1, alignItems: 'flex-end'}}>
                    {displayCustomersInGroup !== undefined && (
                      <TouchableOpacity>
                        <Image
                          style={{
                            width: 25,
                            height: 25,
                            resizeMode: 'center',
                          }}
                          source={require('../assets/path2x.png')}
                        />
                      </TouchableOpacity>
                    )}
                    <Divider />
                  </View>
                )}
              </View>
            )}

            {checked && (
              <View>
                <View style={{height: 300, marginBottom: 60}}>
                  <View>
                    <View
                      style={{
                        marginBottom: 10,
                        flexDirection: 'row',
                        backgroundColor: '#e6e6e6',
                        borderRadius: 10,
                        width: '95%',
                        alignSelf: 'center',
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
                        style={{width: '80%', paddingLeft: 10}}
                        autoCapitalize="none"
                        placeholder="Search"
                        underlineColorAndroid="transparent"
                        onChangeText={val => searchCustomersInList(val)}
                        value={searchKey}
                        maxLength={15}
                      />

                      <TouchableOpacity
                        onPress={() => {
                          setSearchKey(), setIsLoadMore(true);
                          setIsSearched(false);
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
                  </View>

                  {issearched == true ? (
                    <View>
                      {searchCustomerListResults &&
                      searchCustomerListResults != null &&
                      searchCustomerListResults != undefined ? (
                        <FlatList
                          data={searchCustomerListResults}
                          renderItem={render}
                          onEndReached={() => _handleLoadMore()}
                          onEndReachedThreshold={0.5}
                        />
                      ) : (
                        <Text
                          style={{
                            // flex: 1,
                            textAlign: 'center',
                            justifyContent: 'center',
                            marginTop: '35%',
                          }}>
                          No Search Customer Found
                        </Text>
                      )}
                    </View>
                  ) : (
                    <FlatList
                      data={displayCustomers}
                      renderItem={render}
                      onEndReached={() => _handleLoadMore()}
                      onEndReachedThreshold={0.5}
                    />
                  )}
                </View>

                <View
                  style={{
                    position: 'absolute',
                    bottom: 1,
                    left: 0,
                    right: 0,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  {/* <Button
                    title="Add To Group"
                    onPress={() => addCustomersToGroup()}
                  /> */}
                  <CustomLoadingButton
                    ref={c => (this.state.data.getStartedButton = c)}
                    width={320}
                    height={52}
                    title="Add To Group"
                    titleFontSize={18}
                    titleFontFamily="Poppins-Bold"
                    titleColor="#FFF"
                    backgroundColor="#34A549"
                    borderRadius={4}
                    onPress={() => {
                      addCustomersToGroup();
                    }}
                  />
                </View>
              </View>
            )}

            {checked != true && customerSearchedInGroupDetails != true && (
              <View>
                {displayCustomersInGroup == undefined ? (
                  <Text
                    style={{
                      // flex: 1,
                      textAlign: 'center',
                      justifyContent: 'center',
                      marginTop: '60%',
                    }}>
                    No Customers Found
                  </Text>
                ) : (
                  <View style={{marginBottom: 180}}>
                    <FlatList
                      // ListHeaderComponent={searchHeader()}
                      data={displayCustomersInGroup}
                      renderItem={editCustomerRenderItem}
                      onEndReached={() => handleLoadMore()}
                      onEndReachedThreshold={0.5}
                    />
                  </View>
                )}
              </View>
            )}

            {checked != true && customerSearchedInGroupDetails == true && (
              <View>
                <View>
                  {searchResults == undefined ? (
                    <View style={{marginBottom: 180}}>
                      {!emptySearch && (
                        <Text
                          style={{
                            // flex: 1,
                            textAlign: 'center',
                            justifyContent: 'center',
                            marginTop: '40%',
                          }}>
                          No Search Results Found
                        </Text>
                      )}
                    </View>
                  ) : (
                    <View style={{marginBottom: 180}}>
                      <FlatList
                        // ListHeaderComponent={searchHeader()}
                        data={searchResults}
                        renderItem={renderItem}
                        onEndReached={() => handleLoadMore()}
                        onEndReachedThreshold={0.5}
                      />
                    </View>
                  )}
                </View>
              </View>
            )}
          </View>
        </View>
      </>
    </View>
  );
};

export default customerGroupDetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F5F7',
  },

  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.8)',
  },

  modalView: {
    margin: 20,
    backgroundColor: '#fff',
    shadowColor: '#1B365E',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: '90%',
  },

  SubmitButtonStyles: {
    marginTop: 10,
    width: '100%',
    height: 45,
    paddingTop: 11,
    paddingBottom: 15,
    backgroundColor: '#F7F7FC',
    borderRadius: 10,
  },

  SubmitButtonStyle: {
    marginTop: 10,
    width: '100%',
    height: 45,
    paddingTop: 11,
    paddingBottom: 15,
    backgroundColor: '#51AF5E',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#fff',
  },

  headerTitle: {
    color: '#2B2520',
    fontFamily: 'Poppins-Medium',
    fontSize: 20,
  },
  header: {
    flexDirection: 'row',
    marginHorizontal: 5,
    marginVertical: 15,
  },
  mainHeader: {
    backgroundColor: '#ffffff',
    height: 45,
  },
  signIn: {
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  textSign: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  SectionStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 0.5,
    borderColor: '#fff',
    height: 40,
    borderRadius: 50,
    marginHorizontal: 15,
    marginVertical: 5,
    paddingRight: 5,
    paddingLeft: 5,
  },

  IconStyle: {
    alignItems: 'center',
    margin: 5,
  },

  productCard: {
    width: 160,
    elevation: 2,
    borderRadius: 15,
    padding: 10,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 4,
  },
  menuText: {
    color: '#21272E',
    // opacity: 0.5,
    fontSize: 15,
    marginRight: 20,
    margin: 10,
    backgroundColor: '#FFFFFF',
    // fontStyle:'Poppins-SemiBold'
  },
  list: {
    flex: 1,
    marginTop: 5,
  },
});
