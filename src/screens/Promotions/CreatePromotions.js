import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StatusBar,
  Image,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ScrollView,
  FlatList,
  Alert,
  Button,
  Modal,
} from 'react-native';
import {useTheme} from '@react-navigation/native';
import {
  Divider,
  Menu,
  Checkbox,
  RadioButton,
  Title,
  List,
} from 'react-native-paper';
import DatePicker from 'react-native-date-picker';
import {launchImageLibrary} from 'react-native-image-picker';
import DeveloperAPIClient from '../../state/middlewares/DeveloperAPIClient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-simple-toast';
import moment from 'moment';

const CreatePromotion = ({navigation}) => {
  const theme = useTheme();
  const [title, setTitle] = React.useState();
  const [orderUnit, setOrderUnit] = React.useState();
  const [spendINR, setSpendINR] = React.useState();
  const [customerBuys, setCustomerBuys] = React.useState();
  const [theyGet, setTheyGet] = React.useState();
  const [offPerUnit, setOffPerUnit] = React.useState();
  const [getOff, setGetOff] = React.useState();
  const [unitPerUsed, setUnitPerUsed] = React.useState();
  const [priorityOrder, setPriorityOrder] = React.useState();

  const [selectedOption, setSelectedOption] = useState('Shipping Discount');
  const [PromoRuleDataSelected, setPromoRuleDataSelected] =
    React.useState('Shipping Discount');
  const PromoruleData = [
    {name: 'Shipping Discount'},
    {name: 'Product Discount'},
    {name: 'Category Discount'},
    {name: 'Order Discount'},
    {name: 'Customer Discount'},
  ];
  const [visiblePromoRule, setVisiblePromoRule] = React.useState(false);
  const [selectedRadio, setSelectedRadio] = useState(null);
  const [categoryRadio, setCategoryRadio] = useState(null);
  const [orderRadio, setOrderRadio] = useState(null);
  const [customerRadio, setCustomerRadio] = useState(null);
  const [customerGroupRadio, setCustomerGroupRadio] = useState(null);
  const [customerProfileRadio, setCustomerProfileRadio] = useState(null);

  const [selectShipping, setSelectShipping] = useState([]);
  const [selectCustomerGroup, setSelectCustomerGroup] = useState([]);
  const [selectPromoOptions, setSelectPromoOptions] = useState([]);

  const [specialPrice, setSpecialPrice] = useState(true);
  const [moreProducts, setMoreProducts] = useState(false);

  const [selectedImage, setSelectedImage] = useState(null);
  const [headerBanner, setHeaderBanner] = useState(null);

  // API integration for add promotion API
  const addPromotion = async () => {
    if (title === null || title === undefined) {
      Toast.showWithGravity('please give a title', Toast.LONG, Toast.BOTTOM);
      return false;
    }

    if (selectedOption === null || selectedOption === undefined) {
      Toast.showWithGravity(
        'please select a promo rule',
        Toast.LONG,
        Toast.BOTTOM,
      );
      return false;
    }

    if (selectedRadio === null || selectedRadio === undefined) {
      Toast.showWithGravity(
        'Please select promotion rule',
        Toast.LONG,
        Toast.BOTTOM,
      );
      return false;
    }

    // if (selectedImage === null || selectedImage === undefined) {
    //   Toast.showWithGravity(
    //     "please select any image",
    //     Toast.LONG, Toast.BOTTOM);
    //   return false;
    // }

    let api = new DeveloperAPIClient();
    let Token = await AsyncStorage.getItem('token');
    let UserMobile = await AsyncStorage.getItem('MobileNumber');
    let addPromotionResponse = await api.addPromotion(
      UserMobile,
      Token,
      title,
      selectedOption,
      selectedRadio,
      orderUnit,
      spendINR,
      getOff,
      specialPrice,
      unitPerUsed,
      customerGroupRadio,
      startDate,
      endDate,
      priorityOrder,
      selectedStatus,
      selectedDesignStatus,
      selectedImage,
      headerBanner,
    );
    console.log('add promotions------------', addPromotionResponse.data);
    // if (addPromotionResponse.data. == 17) {
    //   Toast.showWithGravity("Order Rejected.", Toast.LONG, Toast.BOTTOM);
    //   setCurrentPage(1);
    // }
    navigation.navigate('PromotionListing');
  };

  const textInputChange = (val, fn) => {
    if (fn === 'priorityOrder') {
      if (!/[^0-9a-zA-Zء-ي\u0660-\u0669]/.test(val)) {
        setPriorityOrder(val);
      }
    }
  };

  const updatePromoRule = val => {
    setSelectedRadio(null);
    setPromoRuleDataSelected(val.name);
    setSelectedOption(val.name);
    setSelectedRadio(null);
    setVisiblePromoRule(false);
  };

  const freeShipping = [
    {id: 1, value: 'All Geo Zones'},
    {id: 2, value: 'INDIA TAX'},
    {id: 3, value: 'UK Shipping'},
    {id: 4, value: 'UK VAT Zone'},
  ];

  const customerGroups = [
    {id: 1, value: 'Guest'},
    {id: 2, value: 'Altai group'},
    {id: 3, value: 'Chicken offer'},
    {id: 4, value: 'Company group'},
  ];

  const handleGroups = value => {
    if (selectCustomerGroup.includes(value)) {
      setSelectCustomerGroup(
        selectCustomerGroup.filter(item => item !== value),
      );
    } else {
      setSelectCustomerGroup([...selectCustomerGroup, value]);
    }
  };

  const handleCheckboxToggle = value => {
    if (selectShipping.includes(value)) {
      setSelectShipping(selectShipping.filter(item => item !== value));
    } else {
      setSelectShipping([...selectShipping, value]);
    }
  };

  const [discounts, setDiscounts] = useState([{minQty: '', discount: ''}]);
  const handleInputChange = (index, key, value) => {
    const newDiscounts = [...discounts];
    newDiscounts[index][key] = value;
    setDiscounts(newDiscounts);
  };

  const handleAddRow = () => {
    setDiscounts([...discounts, {minQty: '', discount: ''}]);
  };

  const handleRemoveRow = index => {
    const newDiscounts = [...discounts];
    newDiscounts.splice(index, 1);
    setDiscounts(newDiscounts);
  };

  // discount type logic
  const [discountTypeVisible, setDiscountTypeVisible] = useState(false);
  const [selectedDiscountType, setSelectedDiscountType] = useState('%');

  const openDiscountMenu = () => setDiscountTypeVisible(true);
  const closeDiscountMenu = () => setDiscountTypeVisible(false);

  const handleDiscountType = item => {
    setSelectedDiscountType(item);
    closeDiscountMenu();
  };

  // discount order value logic
  const [orderValue, setOrderValue] = useState([
    {minOrderValue: '', discountValue: ''},
  ]);
  const handleOrderValueInput = (index, key, value) => {
    const newOrderValue = [...orderValue];
    newOrderValue[index][key] = value;
    setDiscounts(newOrderValue);
  };

  const handleAddOrderValue = () => {
    setOrderValue([...orderValue, {minOrderValue: '', discountValue: ''}]);
  };

  const handleRemoveOrderValue = index => {
    const newOrderValue = [...orderValue];
    newOrderValue.splice(index, 1);
    setOrderValue(newOrderValue);
  };

  // expensive items
  const [visible, setVisible] = useState(false);
  const [selectedChoice, setSelectedChoice] = useState('');

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  const handleChoice = item => {
    setSelectedChoice(item);
    closeMenu();
  };

  // logics for setting contents
  const handlePromoChecked = value => {
    if (selectPromoOptions.includes(value)) {
      setSelectPromoOptions(selectPromoOptions.filter(item => item !== value));
    } else {
      setSelectPromoOptions([...selectPromoOptions, value]);
    }
  };

  const PromoOptionsList = [
    {id: 1, value: 'This promotion can only be used'},
    {id: 2, value: 'Per customer can only use promotion '},
    {id: 3, value: 'Apply promotions with coupon code '},
    {id: 4, value: 'Stop promotion after this rule.'},
  ];

  // date picker for start and end date
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const handleStartDateChange = newDate => {
    setStartDate(newDate);
  };

  const minSelectableDate = moment().format('YYYY-MM-DD');

  const handleEndDateChange = newDate => {
    if (newDate < startDate) {
      return;
    }
    setEndDate(newDate);
  };

  // status logic
  const [statusvisible, setStatusVisible] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('Disable');

  const openStatusMenu = () => setStatusVisible(true);
  const closeStatusMenu = () => setStatusVisible(false);

  const handleStatus = item => {
    setSelectedStatus(item);
    closeStatusMenu();
  };

  // Design status logic
  const [designStatusvisible, setDesignStatusVisible] = useState(false);
  const [selectedDesignStatus, setDesignSelectedStatus] = useState('Disable');

  const openDesignStatusMenu = () => setDesignStatusVisible(true);
  const closeDesignStatusMenu = () => setDesignStatusVisible(false);

  const handleDesignStatus = item => {
    setDesignSelectedStatus(item);
    closeDesignStatusMenu();
  };

  //  image picker logic
  const openImagePicker = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
    });

    if (result && result.assets && result.assets.length > 0) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
  };

  // header banner logic
  const openHeaderBannerPicker = () => {
    launchImageLibrary({mediaType: 'photo'}, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
        return;
      }

      if (response.errorCode) {
        console.error('ImagePicker Error: ', response.errorMessage);
        return;
      }

      if (response.assets && response.assets.length > 0) {
        setHeaderBanner(response.assets[0].uri);
      }
    });
  };

  const removeHeaderBanner = () => {
    setHeaderBanner(null);
  };

  const [searchkey, setsearchkey] = React.useState();
  const [searchresults, setsearchresults] = React.useState();
  const [emptySearchResults, setEmptySearchResults] = React.useState(false);
  const [selectedProduct, setSelectedProduct] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState([]);
  const [isProductSearched, setProductSearched] = React.useState(true);
  const [refreshing, setRefreshing] = React.useState(false);

  const [applyCoupon, setApplyCoupon] = React.useState();

  // serach product api and logic
  const searchproduct = async searchkey => {
    setsearchresults();
    const api = new DeveloperAPIClient();
    let UserMobile = await AsyncStorage.getItem('MobileNumber');
    let Token = await AsyncStorage.getItem('token');
    let limit = 1000;
    let offset = 1;
    let allsearchdata = await api.searchProduct(
      UserMobile,
      searchkey,
      Token,
      limit,
      offset,
    );
    console.log(JSON.stringify(allsearchdata.data.products), '===>');
    setsearchresults(allsearchdata.data.products);
    if (allsearchdata.data.success === false) {
      setEmptySearchResults(true);
    }
    if (allsearchdata.data.success == true) {
      setEmptySearchResults(false);
    }
  };

  const updateSearchName = async val => {
    setsearchresults();
    setsearchkey(val);
    if (val?.length <= 3) {
      setsearchresults();
    }
    if (val?.length >= 3) {
      searchproduct(val);
    }
  };

  const [searchCustomer, setSearchCustomer] = React.useState(null);
  const [searchCustomerResults, setSearchCustomerResults] = React.useState();
  const [customerSearchKey, setCustomerSearchKey] = React.useState();

  const searchCustomerName = async val => {
    setSearchCustomerResults();
    let api = new DeveloperAPIClient();
    let UserMobile = await AsyncStorage.getItem('MobileNumber');
    let CustumerData = await api.getCustomer(UserMobile, 1, val);
    console.log(
      JSON.stringify(CustumerData.data.customers),
      '===>-------------',
    );
    setSearchCustomerResults(CustumerData.data.customers);
  };

  const searchResultsList = ({item}) => {
    return (
      <View style={{marginLeft: 20}}>
        <TouchableOpacity onPress={() => addProductToList(item.name)}>
          <Text
            style={{
              color: 'black',
              fontSize: 14,
              fontFamily: 'Poppins-Medium',
              marginLeft: 20,
            }}>
            {item.name}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const searchCustomerList = ({item}) => {
    return (
      <View style={{marginLeft: 20}}>
        <TouchableOpacity onPress={() => addCustomerToList(item.name)}>
          <Text
            style={{
              color: 'black',
              fontSize: 14,
              fontFamily: 'Poppins-Medium',
              marginLeft: 20,
            }}>
            {item.name}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const addProductToList = productName => {
    if (!selectedProduct.includes(productName)) {
      setSelectedProduct(prevSelectedProducts => [
        ...prevSelectedProducts,
        productName,
      ]);
    }
    setsearchkey('');
    setsearchresults([]);
  };

  const removeProductFromList = productNameToRemove => {
    const updatedProducts = selectedProduct.filter(
      product => product !== productNameToRemove,
    );
    setSelectedProduct(updatedProducts);
  };

  const addCustomerToList = customerName => {
    if (!selectedCustomer.includes(customerName)) {
      setSelectedCustomer(prevselectedCustomer => [
        ...prevselectedCustomer,
        customerName,
      ]);
    }
    setCustomerSearchKey('');
    setSearchCustomerResults([]);
  };

  const removeCustomerFromList = customerNameToRemove => {
    const updatedCustomers = selectedCustomer.filter(
      customer => customer !== customerNameToRemove,
    );
    setSelectedCustomer(updatedCustomers);
  };

  const [menuVisible, setMenuVisible] = useState(false);
  const [categoryNames, setCategoryNames] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState([]);
  // category API and logic
  const loadcats = async () => {
    const api = new DeveloperAPIClient();
    let Token = await AsyncStorage.getItem('token');
    let UserMobile = await AsyncStorage.getItem('MobileNumber');
    let allcatsdata = await api.getcats(UserMobile, Token);
    console.log(
      'alldata======',
      JSON.stringify(allcatsdata.data.category_info),
    );
    setCategoryNames(allcatsdata.data.category_info);
  };

  useEffect(() => {
    loadcats();
  }, []);

  const addCategoryItem = itemName => {
    if (!selectedCategory.includes(itemName)) {
      setSelectedCategory(prevSelectedCategory => [
        ...prevSelectedCategory,
        itemName,
      ]);
    }
    setMenuVisible(false);
  };

  const removeCategoryItem = itemNameToRemove => {
    const updatedCategory = selectedCategory.filter(
      item => item !== itemNameToRemove,
    );
    setSelectedCategory(updatedCategory);
  };

  const removeDates = () => {
    setStartDate(null);
    setEndDate(null);
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
            Create Promotion{' '}
          </Text>
        </View>
        <View style={{marginLeft: '45%'}} />
      </View>
      <Divider />
      <ScrollView style={{marginBottom: 10}}>
        <View style={{marginTop: 10}}>
          <Text
            style={{
              marginLeft: 12,
              fontFamily: 'Poppins-Bold',
              color: '#555555',
            }}>
            <Text style={{color: 'red'}}>*</Text> Title
          </Text>
        </View>
        <TextInput
          style={{
            height: 40,
            // margin: 12,
            marginHorizontal: 10,
            padding: 10,
            // backgroundColor: "#F7F7FC",
            fontFamily: 'Poppins-Regular',
            borderWidth: 1,
            borderColor: '#555555',
            borderRadius: 5,
            color: '#000',
          }}
          onChangeText={val => setTitle(val)}
          value={title}
          placeholder="Enter Promotion title"
          placeholderTextColor={'#555555'}
        />
        <View style={{marginTop: 10}}>
          <Text
            style={{
              marginLeft: 12,
              fontFamily: 'Poppins-Bold',
              color: '#555555',
            }}>
            <Text style={{color: 'red'}}>*</Text> Promo Rule
          </Text>
        </View>
        <View
          style={{
            height: 40,
            marginHorizontal: 10,
            padding: 10,
            fontFamily: 'Poppins-Regular',
            borderWidth: 1,
            borderColor: '#555555',
            borderRadius: 5,
          }}>
          <Menu
            visible={visiblePromoRule}
            onDismiss={() => setVisiblePromoRule(!visiblePromoRule)}
            anchor={
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
                activeOpacity={0.7}
                onPress={() => setVisiblePromoRule(!visiblePromoRule)}>
                {/* {customerGroupName} */}
                <Text style={{fontFamily: 'Poppins-Medium', color: '#555555'}}>
                  {PromoRuleDataSelected
                    ? PromoRuleDataSelected
                    : 'Please Select Promo Rule'}
                </Text>
                <View style={{marginLeft: 'auto'}}>
                  <Image
                    style={{
                      height: 18,
                      width: 18,
                      transform: [
                        {rotate: visiblePromoRule ? '180deg' : '0deg'},
                      ],
                    }}
                    source={require('../../assets/downBlack.png')}
                  />
                </View>
              </TouchableOpacity>
            }>
            {PromoruleData &&
              PromoruleData.map((val, i) => {
                return (
                  <View style={{flexDirection: 'row'}}>
                    <Menu.Item
                      key={i}
                      title={val.name}
                      onPress={() => updatePromoRule(val)}
                      // style={{width:500,marginLeft:'%'}}
                    />
                  </View>
                );
              })}
          </Menu>
        </View>
        {/* content for shipping discount*/}
        {selectedOption === 'Shipping Discount' && (
          <View style={styles.radioContainer}>
            <RadioButton.Group
              onValueChange={value => setSelectedRadio(value)}
              value={selectedRadio}>
              <View style={styles.radioItem}>
                <RadioButton.Item
                  label="Order at least X units of product Y, get free shipping to specific shipping zones."
                  value="radio1"
                  color="#549666"
                  labelStyle={styles.labelStyle}
                  style={styles.radioButton}
                />

                {/* content occording to radio click */}
                {selectedRadio === 'radio1' && (
                  <>
                    <View style={{flexDirection: 'row'}}>
                      <Text
                        style={{
                          marginLeft: 20,
                          fontFamily: 'Poppins-Regular',
                          color: '#555555',
                          fontSize: 13,
                          marginTop: 10,
                        }}>
                        - Order at least
                      </Text>
                      <TextInput
                        style={{
                          height: 38,
                          width: 40,
                          marginHorizontal: 5,
                          marginTop: 5,
                          fontFamily: 'Poppins-Regular',
                          borderWidth: 1,
                          borderColor: '#555555',
                          borderRadius: 5,
                          fontSize: 12,
                          textAlign: 'center',
                          color: '#000',
                        }}
                        onChangeText={val => setOrderUnit(val)}
                        value={orderUnit}
                        placeholderTextColor={'#555555'}
                        keyboardType="numeric"
                      />
                      <Text
                        style={{
                          // marginLeft: 12,
                          fontFamily: 'Poppins-Regular',
                          color: '#555555',
                          marginTop: 10,
                          fontSize: 13,
                        }}>
                        unit of the following products.
                      </Text>
                    </View>

                    <View
                      style={{
                        height: 45,
                        width: 300,
                        marginLeft: 30,
                        marginTop: 5,
                        fontFamily: 'Poppins-Regular',
                        borderWidth: 1,
                        borderColor: '#B7B9C1',
                        fontSize: 12,
                        backgroundColor: '#E6EAF0',
                        paddingLeft: 10,
                        flexDirection: 'row',
                      }}>
                      <TextInput
                        onChangeText={val => updateSearchName(val)}
                        value={searchkey}
                        placeholderTextColor={'#555555'}
                        placeholder="Type product name"
                        style={{width: 250}}
                      />

                      <View
                        style={{
                          marginLeft: 'auto',
                          flexDirection: 'row',
                          marginRight: 15,
                        }}>
                        <TouchableOpacity
                          style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}
                          onPress={() => {
                            setsearchkey();
                            setsearchresults();
                            //   setIsSearched(false);
                          }}>
                          <Image
                            style={{
                              width: 20,
                              height: 20,
                              marginRight: 10,
                              // resizeMode: "center",
                              // marginBottom: 5,
                            }}
                            source={require('../../assets/close.png')}
                          />
                        </TouchableOpacity>
                      </View>
                    </View>

                    {isProductSearched == true && (
                      <View>
                        {refreshing && (
                          <ActivityIndicator size="large" color="#51AF5E" />
                        )}
                        {emptySearchResults != true ? (
                          <View>
                            <FlatList
                              data={searchresults}
                              renderItem={searchResultsList}
                            />
                          </View>
                        ) : (
                          <Text
                            style={{
                              textAlign: 'center',
                              justifyContent: 'center',
                            }}>
                            No Products Found
                          </Text>
                        )}
                      </View>
                    )}

                    <View
                      style={{
                        backgroundColor: '#e8e6e6',
                        marginHorizontal: 30,
                        padding: 10,
                        marginVertical: 20,
                      }}>
                      {selectedProduct.map((product, index) => (
                        <TouchableOpacity
                          key={index}
                          style={{flexDirection: 'row'}}
                          onPress={() => removeProductFromList(product)}>
                          <Image source={require('../../assets/minus.png')} />
                          <Text style={{marginLeft: 8}}>{product}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>

                    <Text
                      style={{
                        marginLeft: 20,
                        fontFamily: 'Poppins-Regular',
                        color: '#555555',
                        fontSize: 13,
                        marginTop: 20,
                        marginBottom: 10,
                      }}>
                      - get free shipping to
                    </Text>

                    {/* check box list for shipping */}
                    <FlatList
                      data={freeShipping}
                      keyExtractor={item => item.id}
                      renderItem={({item}) => (
                        <TouchableOpacity
                          activeOpacity={0.9}
                          onPress={() => handleCheckboxToggle(item.value)}>
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              marginLeft: 30,
                              backgroundColor: '#E6EAF0',
                              width: 300,
                            }}>
                            <Checkbox
                              status={
                                selectShipping.includes(item.value)
                                  ? 'checked'
                                  : 'unchecked'
                              }
                              color={'green'}
                            />
                            <Title
                              style={{
                                color: '#21272E',
                                fontSize: 13,
                                fontFamily: 'Poppins-Light',
                              }}>
                              {item.value}
                            </Title>
                          </View>
                        </TouchableOpacity>
                      )}
                    />

                    {/* additonal options */}
                    <Text
                      style={{
                        marginLeft: 20,
                        fontFamily: 'Poppins-Regular',
                        color: '#555555',
                        fontSize: 13,
                        marginTop: 20,
                      }}>
                      - Additional options
                    </Text>

                    <TouchableOpacity
                      onPress={() => setSpecialPrice(!specialPrice)}>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          marginLeft: 30,
                        }}>
                        <Checkbox.Android
                          status={specialPrice ? 'checked' : 'unchecked'}
                          color={'green'} // Customize the checkbox color
                        />
                        <Text
                          style={{
                            color: '#21272E',
                            fontSize: 13,
                            fontFamily: 'Poppins-Light',
                          }}>
                          Apply to product with special price
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </>
                )}
              </View>
              {/* second radio option */}
              <View style={styles.radioItem}>
                <RadioButton.Item
                  label="Order at least fixed amount, get free shipping to specific shipping zones."
                  value="radio2"
                  color="#549666"
                  labelStyle={styles.labelStyle}
                  style={styles.radioButton}
                />
                {selectedRadio === 'radio2' && (
                  <>
                    <View style={{flexDirection: 'row'}}>
                      <Text
                        style={{
                          marginLeft: 20,
                          fontFamily: 'Poppins-Regular',
                          color: '#555555',
                          fontSize: 13,
                          marginTop: 10,
                        }}>
                        - Spend at leastINR
                      </Text>
                      <TextInput
                        style={{
                          height: 38,
                          width: 40,
                          marginHorizontal: 5,
                          marginTop: 5,
                          fontFamily: 'Poppins-Regular',
                          borderWidth: 1,
                          borderColor: '#555555',
                          borderRadius: 5,
                          fontSize: 12,
                          textAlign: 'center',
                          color: '#000',
                        }}
                        onChangeText={val => setSpendINR(val)}
                        value={spendINR}
                        placeholderTextColor={'#555555'}
                        keyboardType="numeric"
                      />
                    </View>
                    <Text
                      style={{
                        marginLeft: 20,
                        fontFamily: 'Poppins-Regular',
                        color: '#555555',
                        fontSize: 13,
                        marginTop: 20,
                        marginBottom: 10,
                      }}>
                      - get free shipping to
                    </Text>

                    <FlatList
                      data={freeShipping}
                      keyExtractor={item => item.id}
                      renderItem={({item}) => (
                        <TouchableOpacity
                          activeOpacity={0.9}
                          onPress={() => handleCheckboxToggle(item.value)}>
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              marginLeft: 30,
                              backgroundColor: '#E6EAF0',
                              width: 300,
                            }}>
                            <Checkbox
                              status={
                                selectShipping.includes(item.value)
                                  ? 'checked'
                                  : 'unchecked'
                              }
                              color={'green'}
                            />
                            <Title
                              style={{
                                color: '#21272E',
                                fontSize: 13,
                                fontFamily: 'Poppins-Light',
                              }}>
                              {item.value}
                            </Title>
                          </View>
                        </TouchableOpacity>
                      )}
                    />
                  </>
                )}
              </View>
            </RadioButton.Group>
          </View>
        )}

        {/* product discount */}
        {selectedOption === 'Product Discount' && (
          <View style={styles.radioContainer}>
            <RadioButton.Group
              onValueChange={value => setSelectedRadio(value)}
              value={selectedRadio}>
              <View>
                <RadioButton.Item
                  label="Buy one get one free."
                  value="productOption1"
                  color="#549666"
                  labelStyle={[styles.labelStyle, {marginRight: '47.5%'}]}
                  style={styles.radioButton}
                />

                {/* content occording to radio click */}
                {selectedOption === 'Product Discount' && (
                  <>
                    {selectedRadio === 'productOption1' && (
                      <>
                        <View style={{flexDirection: 'row'}}>
                          <Text
                            style={{
                              marginLeft: 20,
                              fontFamily: 'Poppins-Regular',
                              color: '#555555',
                              fontSize: 13,
                              marginTop: 10,
                            }}>
                            - If the customer buys
                          </Text>
                          <TextInput
                            style={{
                              height: 38,
                              width: 40,
                              marginHorizontal: 5,
                              marginTop: 5,
                              fontFamily: 'Poppins-Regular',
                              borderWidth: 1,
                              borderColor: '#555555',
                              borderRadius: 5,
                              fontSize: 12,
                              textAlign: 'center',
                              color: '#000',
                            }}
                            onChangeText={val => setCustomerBuys(val)}
                            value={customerBuys}
                            placeholderTextColor={'#555555'}
                            keyboardType="numeric"
                          />
                          <Checkbox.Android
                            status={moreProducts ? 'checked' : 'unchecked'}
                            color={'green'}
                            onPress={() => setMoreProducts(!moreProducts)}
                          />
                          <Text
                            style={{
                              // marginLeft: 12,
                              fontFamily: 'Poppins-Regular',
                              color: '#555555',
                              marginTop: 10,
                              fontSize: 13,
                              width: 100,
                            }}>
                            (or more) of the following products.
                          </Text>
                        </View>

                        <View
                          style={{
                            height: 45,
                            width: 300,
                            marginLeft: 30,
                            marginTop: 5,
                            fontFamily: 'Poppins-Regular',
                            borderWidth: 1,
                            borderColor: '#B7B9C1',
                            fontSize: 12,
                            backgroundColor: '#E6EAF0',
                            paddingLeft: 10,
                            flexDirection: 'row',
                          }}>
                          <TextInput
                            onChangeText={val => updateSearchName(val)}
                            value={searchkey}
                            placeholderTextColor={'#555555'}
                            placeholder="Type product name"
                            style={{width: 250}}
                          />

                          <View
                            style={{
                              marginLeft: 'auto',
                              flexDirection: 'row',
                              marginRight: 15,
                            }}>
                            <TouchableOpacity
                              style={{
                                justifyContent: 'center',
                                alignItems: 'center',
                              }}
                              onPress={() => {
                                setsearchkey();
                                setsearchresults();
                                //   setIsSearched(false);
                              }}>
                              <Image
                                style={{
                                  width: 20,
                                  height: 20,
                                  marginRight: 10,
                                  // resizeMode: "center",
                                  // marginBottom: 5,
                                }}
                                source={require('../../assets/close.png')}
                              />
                            </TouchableOpacity>
                          </View>
                        </View>

                        {isProductSearched == true && (
                          <View>
                            {refreshing && (
                              <ActivityIndicator size="large" color="#51AF5E" />
                            )}
                            {emptySearchResults != true ? (
                              <View>
                                <FlatList
                                  data={searchresults}
                                  renderItem={searchResultsList}
                                />
                              </View>
                            ) : (
                              <Text
                                style={{
                                  textAlign: 'center',
                                  justifyContent: 'center',
                                }}>
                                No Products Found
                              </Text>
                            )}
                          </View>
                        )}

                        <View
                          style={{
                            backgroundColor: '#e8e6e6',
                            marginHorizontal: 30,
                            padding: 10,
                            marginVertical: 20,
                          }}>
                          {selectedProduct.map((product, index) => (
                            <TouchableOpacity
                              key={index}
                              style={{flexDirection: 'row'}}
                              onPress={() => removeProductFromList(product)}>
                              <Image
                                source={require('../../assets/minus.png')}
                              />
                              <Text style={{marginLeft: 8}}>{product}</Text>
                            </TouchableOpacity>
                          ))}
                        </View>

                        <View style={{flexDirection: 'row', marginTop: 10}}>
                          <Text
                            style={{
                              marginLeft: 20,
                              fontFamily: 'Poppins-Regular',
                              color: '#555555',
                              fontSize: 13,
                              marginTop: 10,
                            }}>
                            - then they get
                          </Text>
                          <TextInput
                            style={{
                              height: 38,
                              width: 40,
                              marginHorizontal: 5,
                              marginTop: 5,
                              fontFamily: 'Poppins-Regular',
                              borderWidth: 1,
                              borderColor: '#555555',
                              borderRadius: 5,
                              fontSize: 12,
                              textAlign: 'center',
                            }}
                            onChangeText={val => setTheyGet(val)}
                            value={theyGet}
                            placeholderTextColor={'#555555'}
                            keyboardType="numeric"
                          />
                          <Text
                            style={{
                              // marginLeft: 12,
                              fontFamily: 'Poppins-Regular',
                              color: '#555555',
                              marginTop: 10,
                              fontSize: 13,
                              width: 150,
                            }}>
                            more of the same item free.
                          </Text>
                        </View>

                        {/* additonal options */}
                        <Text
                          style={{
                            marginLeft: 20,
                            fontFamily: 'Poppins-Regular',
                            color: '#555555',
                            fontSize: 13,
                            marginTop: 20,
                          }}>
                          - Additional options
                        </Text>

                        <TouchableOpacity
                          onPress={() => setSpecialPrice(!specialPrice)}>
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              marginLeft: 30,
                            }}>
                            <Checkbox.Android
                              status={specialPrice ? 'checked' : 'unchecked'}
                              color={'green'} // Customize the checkbox color
                            />
                            <Text
                              style={{
                                color: '#21272E',
                                fontSize: 13,
                                fontFamily: 'Poppins-Light',
                              }}>
                              Apply to product with special price.
                            </Text>
                          </View>
                        </TouchableOpacity>
                      </>
                    )}
                  </>
                )}
              </View>

              {/* second radio option */}
              <View>
                <RadioButton.Item
                  label="Buy one get something else free."
                  value="productOption2"
                  color="#549666"
                  labelStyle={[styles.labelStyle, {marginRight: '21%'}]}
                  style={styles.radioButton}
                />
                {selectedRadio === 'productOption2' && (
                  <>
                    <View style={{flexDirection: 'row'}}>
                      <Text
                        style={{
                          marginLeft: 20,
                          fontFamily: 'Poppins-Regular',
                          color: '#555555',
                          fontSize: 13,
                          marginTop: 10,
                        }}>
                        - If the customer buys
                      </Text>
                      <TextInput
                        style={{
                          height: 38,
                          width: 40,
                          marginHorizontal: 2,
                          marginTop: 5,
                          fontFamily: 'Poppins-Regular',
                          borderWidth: 1,
                          borderColor: '#555555',
                          borderRadius: 5,
                          fontSize: 12,
                          color: '#000',
                        }}
                        onChangeText={val => setCustomerBuys(val)}
                        value={customerBuys}
                        placeholderTextColor={'#555555'}
                        keyboardType="numeric"
                      />

                      <Checkbox.Android
                        status={moreProducts ? 'checked' : 'unchecked'}
                        color={'green'}
                        onPress={() => setMoreProducts(!moreProducts)}
                      />

                      <Text
                        style={{
                          fontFamily: 'Poppins-Regular',
                          color: '#555555',
                          fontSize: 13,
                          alignSelf: 'center',
                          width: 120,
                        }}>
                        (or more) of the following products
                      </Text>
                    </View>

                    <View
                      style={{
                        height: 45,
                        width: 300,
                        marginLeft: 30,
                        marginTop: 5,
                        fontFamily: 'Poppins-Regular',
                        borderWidth: 1,
                        borderColor: '#B7B9C1',
                        fontSize: 12,
                        backgroundColor: '#E6EAF0',
                        paddingLeft: 10,
                        flexDirection: 'row',
                      }}>
                      <TextInput
                        onChangeText={val => updateSearchName(val)}
                        value={searchkey}
                        placeholderTextColor={'#555555'}
                        placeholder="Type product name"
                        style={{width: 250}}
                      />

                      <View
                        style={{
                          marginLeft: 'auto',
                          flexDirection: 'row',
                          marginRight: 15,
                        }}>
                        <TouchableOpacity
                          style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}
                          onPress={() => {
                            setsearchkey();
                            setsearchresults();
                            //   setIsSearched(false);
                          }}>
                          <Image
                            style={{
                              width: 20,
                              height: 20,
                              marginRight: 10,
                              // resizeMode: "center",
                              // marginBottom: 5,
                            }}
                            source={require('../../assets/close.png')}
                          />
                        </TouchableOpacity>
                      </View>
                    </View>

                    {isProductSearched == true && (
                      <View>
                        {refreshing && (
                          <ActivityIndicator size="large" color="#51AF5E" />
                        )}
                        {emptySearchResults != true ? (
                          <View>
                            <FlatList
                              data={searchresults}
                              renderItem={searchResultsList}
                            />
                          </View>
                        ) : (
                          <Text
                            style={{
                              textAlign: 'center',
                              justifyContent: 'center',
                            }}>
                            No Products Found
                          </Text>
                        )}
                      </View>
                    )}

                    <View
                      style={{
                        backgroundColor: '#e8e6e6',
                        marginHorizontal: 30,
                        padding: 10,
                        marginVertical: 20,
                      }}>
                      {selectedProduct.map((product, index) => (
                        <TouchableOpacity
                          key={index}
                          style={{flexDirection: 'row'}}
                          onPress={() => removeProductFromList(product)}>
                          <Image source={require('../../assets/minus.png')} />
                          <Text style={{marginLeft: 8}}>{product}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>

                    <View
                      style={{
                        flexDirection: 'row',
                        marginTop: 20,
                        marginBottom: 8,
                      }}>
                      <Text
                        style={{
                          marginLeft: 20,
                          fontFamily: 'Poppins-Regular',
                          color: '#555555',
                          fontSize: 13,
                          marginTop: 10,
                        }}>
                        - then they will get
                      </Text>
                      <TextInput
                        style={{
                          height: 38,
                          width: 40,
                          marginHorizontal: 5,
                          marginTop: 5,
                          fontFamily: 'Poppins-Regular',
                          borderWidth: 1,
                          borderColor: '#555555',
                          borderRadius: 5,
                          fontSize: 12,
                        }}
                        onChangeText={val => setTheyGet(val)}
                        value={theyGet}
                        placeholderTextColor={'#555555'}
                        keyboardType="numeric"
                      />

                      <Text
                        style={{
                          fontFamily: 'Poppins-Regular',
                          color: '#555555',
                          fontSize: 13,
                          alignSelf: 'center',
                          width: 140,
                        }}>
                        of the following products for free
                      </Text>
                    </View>

                    <View
                      style={{
                        height: 45,
                        width: 300,
                        marginLeft: 30,
                        marginTop: 5,
                        fontFamily: 'Poppins-Regular',
                        borderWidth: 1,
                        borderColor: '#B7B9C1',
                        fontSize: 12,
                        backgroundColor: '#E6EAF0',
                        paddingLeft: 10,
                        flexDirection: 'row',
                      }}>
                      <TextInput
                        onChangeText={val => updateSearchName(val)}
                        value={searchkey}
                        placeholderTextColor={'#555555'}
                        placeholder="Type product name"
                        style={{width: 250}}
                      />

                      <View
                        style={{
                          marginLeft: 'auto',
                          flexDirection: 'row',
                          marginRight: 15,
                        }}>
                        <TouchableOpacity
                          style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}
                          onPress={() => {
                            setsearchkey();
                            setsearchresults();
                            //   setIsSearched(false);
                          }}>
                          <Image
                            style={{
                              width: 20,
                              height: 20,
                              marginRight: 10,
                              // resizeMode: "center",
                              // marginBottom: 5,
                            }}
                            source={require('../../assets/close.png')}
                          />
                        </TouchableOpacity>
                      </View>
                    </View>

                    {isProductSearched == true && (
                      <View>
                        {refreshing && (
                          <ActivityIndicator size="large" color="#51AF5E" />
                        )}
                        {emptySearchResults != true ? (
                          <View>
                            <FlatList
                              data={searchresults}
                              renderItem={searchResultsList}
                            />
                          </View>
                        ) : (
                          <Text
                            style={{
                              textAlign: 'center',
                              justifyContent: 'center',
                            }}>
                            No Products Found
                          </Text>
                        )}
                      </View>
                    )}

                    <View
                      style={{
                        backgroundColor: '#e8e6e6',
                        marginHorizontal: 30,
                        padding: 10,
                        marginVertical: 20,
                      }}>
                      {selectedProduct.map((product, index) => (
                        <TouchableOpacity
                          key={index}
                          style={{flexDirection: 'row'}}
                          onPress={() => removeProductFromList(product)}>
                          <Image source={require('../../assets/minus.png')} />
                          <Text style={{marginLeft: 8}}>{product}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>

                    {/* additonal options */}
                    <Text
                      style={{
                        marginLeft: 20,
                        fontFamily: 'Poppins-Regular',
                        color: '#555555',
                        fontSize: 13,
                        marginTop: 20,
                      }}>
                      - Additional options
                    </Text>

                    <TouchableOpacity
                      onPress={() => setSpecialPrice(!specialPrice)}>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          marginLeft: 30,
                        }}>
                        <Checkbox.Android
                          status={specialPrice ? 'checked' : 'unchecked'}
                          color={'green'} // Customize the checkbox color
                        />
                        <Text
                          style={{
                            color: '#21272E',
                            fontSize: 13,
                            fontFamily: 'Poppins-Light',
                          }}>
                          Apply to product with special price.
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </>
                )}
              </View>

              {/* third radio option */}
              <View>
                <RadioButton.Item
                  label="Buy (X units) of Product A, get (Y units) of Product B for amount or percentage off per unit."
                  value="productOption3"
                  color="#549666"
                  labelStyle={styles.labelStyle}
                  style={styles.radioButton}
                />
                {selectedRadio === 'productOption3' && (
                  <>
                    <View style={{flexDirection: 'row'}}>
                      <Text
                        style={{
                          marginLeft: 20,
                          fontFamily: 'Poppins-Regular',
                          color: '#555555',
                          fontSize: 13,
                          marginTop: 10,
                        }}>
                        - If the customer buys
                      </Text>
                      <TextInput
                        style={{
                          height: 38,
                          width: 40,
                          marginHorizontal: 2,
                          marginTop: 5,
                          fontFamily: 'Poppins-Regular',
                          borderWidth: 1,
                          borderColor: '#555555',
                          borderRadius: 5,
                          fontSize: 12,
                          color: '#000',
                        }}
                        onChangeText={val => setCustomerBuys(val)}
                        value={customerBuys}
                        placeholderTextColor={'#555555'}
                        keyboardType="numeric"
                      />

                      <Checkbox.Android
                        status={moreProducts ? 'checked' : 'unchecked'}
                        color={'green'}
                        onPress={() => setMoreProducts(!moreProducts)}
                      />

                      <Text
                        style={{
                          fontFamily: 'Poppins-Regular',
                          color: '#555555',
                          fontSize: 13,
                          alignSelf: 'center',
                          width: 120,
                        }}>
                        (or more) of the following products
                      </Text>
                    </View>

                    <View
                      style={{
                        height: 45,
                        width: 300,
                        marginLeft: 30,
                        marginTop: 5,
                        fontFamily: 'Poppins-Regular',
                        borderWidth: 1,
                        borderColor: '#B7B9C1',
                        fontSize: 12,
                        backgroundColor: '#E6EAF0',
                        paddingLeft: 10,
                        flexDirection: 'row',
                      }}>
                      <TextInput
                        onChangeText={val => updateSearchName(val)}
                        value={searchkey}
                        placeholderTextColor={'#555555'}
                        placeholder="Type product name"
                        style={{width: 250}}
                      />

                      <View
                        style={{
                          marginLeft: 'auto',
                          flexDirection: 'row',
                          marginRight: 15,
                        }}>
                        <TouchableOpacity
                          style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}
                          onPress={() => {
                            setsearchkey();
                            setsearchresults();
                            //   setIsSearched(false);
                          }}>
                          <Image
                            style={{
                              width: 20,
                              height: 20,
                              marginRight: 10,
                              // resizeMode: "center",
                              // marginBottom: 5,
                            }}
                            source={require('../../assets/close.png')}
                          />
                        </TouchableOpacity>
                      </View>
                    </View>

                    {isProductSearched == true && (
                      <View>
                        {refreshing && (
                          <ActivityIndicator size="large" color="#51AF5E" />
                        )}
                        {emptySearchResults != true ? (
                          <View>
                            <FlatList
                              data={searchresults}
                              renderItem={searchResultsList}
                            />
                          </View>
                        ) : (
                          <Text
                            style={{
                              textAlign: 'center',
                              justifyContent: 'center',
                            }}>
                            No Products Found
                          </Text>
                        )}
                      </View>
                    )}

                    <View
                      style={{
                        backgroundColor: '#e8e6e6',
                        marginHorizontal: 30,
                        padding: 10,
                        marginVertical: 20,
                      }}>
                      {selectedProduct.map((product, index) => (
                        <TouchableOpacity
                          key={index}
                          style={{flexDirection: 'row'}}
                          onPress={() => removeProductFromList(product)}>
                          <Image source={require('../../assets/minus.png')} />
                          <Text style={{marginLeft: 8}}>{product}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>

                    <View
                      style={{
                        flexDirection: 'row',
                        marginTop: 20,
                        marginBottom: 8,
                      }}>
                      <Text
                        style={{
                          marginLeft: 20,
                          fontFamily: 'Poppins-Regular',
                          color: '#555555',
                          fontSize: 13,
                          marginTop: 10,
                        }}>
                        - then they will get
                      </Text>
                      <TextInput
                        style={{
                          height: 38,
                          width: 40,
                          marginHorizontal: 5,
                          marginTop: 5,
                          fontFamily: 'Poppins-Regular',
                          borderWidth: 1,
                          borderColor: '#555555',
                          borderRadius: 5,
                          fontSize: 12,
                        }}
                        onChangeText={val => setTheyGet(val)}
                        value={theyGet}
                        placeholderTextColor={'#555555'}
                        keyboardType="numeric"
                      />

                      <Text
                        style={{
                          fontFamily: 'Poppins-Regular',
                          color: '#555555',
                          fontSize: 13,
                          alignSelf: 'center',
                          width: 140,
                        }}>
                        of the following products
                      </Text>
                    </View>

                    <View
                      style={{
                        height: 45,
                        width: 300,
                        marginLeft: 30,
                        marginTop: 5,
                        fontFamily: 'Poppins-Regular',
                        borderWidth: 1,
                        borderColor: '#B7B9C1',
                        fontSize: 12,
                        backgroundColor: '#E6EAF0',
                        paddingLeft: 10,
                        flexDirection: 'row',
                      }}>
                      <TextInput
                        onChangeText={val => updateSearchName(val)}
                        value={searchkey}
                        placeholderTextColor={'#555555'}
                        placeholder="Type product name"
                        style={{width: 250}}
                      />

                      <View
                        style={{
                          marginLeft: 'auto',
                          flexDirection: 'row',
                          marginRight: 15,
                        }}>
                        <TouchableOpacity
                          style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}
                          onPress={() => {
                            setsearchkey();
                            setsearchresults();
                            //   setIsSearched(false);
                          }}>
                          <Image
                            style={{
                              width: 20,
                              height: 20,
                              marginRight: 10,
                              // resizeMode: "center",
                              // marginBottom: 5,
                            }}
                            source={require('../../assets/close.png')}
                          />
                        </TouchableOpacity>
                      </View>
                    </View>

                    {isProductSearched == true && (
                      <View>
                        {refreshing && (
                          <ActivityIndicator size="large" color="#51AF5E" />
                        )}
                        {emptySearchResults != true ? (
                          <View>
                            <FlatList
                              data={searchresults}
                              renderItem={searchResultsList}
                            />
                          </View>
                        ) : (
                          <Text
                            style={{
                              textAlign: 'center',
                              justifyContent: 'center',
                            }}>
                            No Products Found
                          </Text>
                        )}
                      </View>
                    )}

                    <View
                      style={{
                        backgroundColor: '#e8e6e6',
                        marginHorizontal: 30,
                        padding: 10,
                        marginVertical: 20,
                      }}>
                      {selectedProduct.map((product, index) => (
                        <TouchableOpacity
                          key={index}
                          style={{flexDirection: 'row'}}
                          onPress={() => removeProductFromList(product)}>
                          <Image source={require('../../assets/minus.png')} />
                          <Text style={{marginLeft: 8}}>{product}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>

                    <View style={{flexDirection: 'row', marginTop: 20}}>
                      <Text
                        style={{
                          marginLeft: 20,
                          fontFamily: 'Poppins-Regular',
                          color: '#555555',
                          fontSize: 13,
                          marginTop: 10,
                        }}>
                        - for
                      </Text>
                      <TextInput
                        style={{
                          height: 38,
                          width: 40,
                          marginHorizontal: 5,
                          marginTop: 5,
                          fontFamily: 'Poppins-Regular',
                          borderWidth: 1,
                          borderColor: '#555555',
                          borderRadius: 5,
                          fontSize: 12,
                        }}
                        onChangeText={val => setOffPerUnit(val)}
                        value={offPerUnit}
                        placeholderTextColor={'#555555'}
                        keyboardType="numeric"
                      />
                      {/* discount dropdown */}
                      <View
                        style={{
                          height: 38,
                          width: 60,
                          borderWidth: 1,
                          borderColor: 'gray',
                          justifyContent: 'center',
                          marginHorizontal: 5,
                          borderRadius: 5,
                          marginTop: 5,
                        }}>
                        <Menu
                          visible={discountTypeVisible}
                          onDismiss={closeDiscountMenu}
                          anchor={
                            <TouchableOpacity
                              style={{flexDirection: 'row'}}
                              onPress={openDiscountMenu}>
                              <Text
                                style={{alignSelf: 'center', marginLeft: 10}}>
                                {selectedDiscountType}
                              </Text>
                              <Image
                                style={{
                                  height: 15,
                                  width: 15,
                                  marginLeft: 'auto',
                                  marginRight: 4,
                                  alignSelf: 'center',
                                }}
                                source={require('../../assets/images/downIcon.png')}
                              />
                            </TouchableOpacity>
                          }>
                          <Menu.Item
                            onPress={() => handleDiscountType('%')}
                            title="%"
                          />
                          <Menu.Item
                            onPress={() => handleDiscountType('INR')}
                            title="INR"
                          />
                        </Menu>
                      </View>

                      <Text
                        style={{
                          fontFamily: 'Poppins-Regular',
                          color: '#555555',
                          fontSize: 13,
                          alignSelf: 'center',
                          width: 120,
                        }}>
                        off per unit
                      </Text>
                    </View>
                    {/* additonal options */}
                    <Text
                      style={{
                        marginLeft: 20,
                        fontFamily: 'Poppins-Regular',
                        color: '#555555',
                        fontSize: 13,
                        marginTop: 20,
                      }}>
                      - Additional options
                    </Text>

                    <TouchableOpacity
                      onPress={() => setSpecialPrice(!specialPrice)}>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          marginLeft: 30,
                        }}>
                        <Checkbox.Android
                          status={specialPrice ? 'checked' : 'unchecked'}
                          color={'green'} // Customize the checkbox color
                        />
                        <Text
                          style={{
                            color: '#21272E',
                            fontSize: 13,
                            fontFamily: 'Poppins-Light',
                          }}>
                          Apply to product with special price.
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </>
                )}
              </View>

              {/* fourth radio option */}
              <View>
                <RadioButton.Item
                  label="Apply an amount or percentage off to Product X."
                  value="productOption4"
                  color="#549666"
                  labelStyle={styles.labelStyle}
                  style={styles.radioButton}
                />
                {selectedRadio === 'productOption4' && (
                  <>
                    <View style={{flexDirection: 'row'}}>
                      <Text
                        style={{
                          marginLeft: 20,
                          fontFamily: 'Poppins-Regular',
                          color: '#555555',
                          fontSize: 13,
                          marginTop: 10,
                        }}>
                        - The customer will get
                      </Text>
                      <TextInput
                        style={{
                          height: 38,
                          width: 40,
                          marginHorizontal: 2,
                          marginTop: 5,
                          fontFamily: 'Poppins-Regular',
                          borderWidth: 1,
                          borderColor: '#555555',
                          borderRadius: 5,
                          fontSize: 12,
                          color: '#000',
                        }}
                        placeholderTextColor={'#555555'}
                        keyboardType="numeric"
                      />

                      <Checkbox.Android
                        status={moreProducts ? 'checked' : 'unchecked'}
                        color={'green'}
                        onPress={() => setMoreProducts(!moreProducts)}
                      />

                      <Text
                        style={{
                          fontFamily: 'Poppins-Regular',
                          color: '#555555',
                          fontSize: 13,
                          alignSelf: 'center',
                          width: 120,
                        }}>
                        (or more) of the following products
                      </Text>
                    </View>

                    <View
                      style={{
                        height: 45,
                        width: 300,
                        marginLeft: 30,
                        marginTop: 5,
                        fontFamily: 'Poppins-Regular',
                        borderWidth: 1,
                        borderColor: '#B7B9C1',
                        fontSize: 12,
                        backgroundColor: '#E6EAF0',
                        paddingLeft: 10,
                        flexDirection: 'row',
                      }}>
                      <TextInput
                        onChangeText={val => updateSearchName(val)}
                        value={searchkey}
                        placeholderTextColor={'#555555'}
                        placeholder="Type product name"
                        style={{width: 250}}
                      />

                      <View
                        style={{
                          marginLeft: 'auto',
                          flexDirection: 'row',
                          marginRight: 15,
                        }}>
                        <TouchableOpacity
                          style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}
                          onPress={() => {
                            setsearchkey();
                            setsearchresults();
                            //   setIsSearched(false);
                          }}>
                          <Image
                            style={{
                              width: 20,
                              height: 20,
                              marginRight: 10,
                              // resizeMode: "center",
                              // marginBottom: 5,
                            }}
                            source={require('../../assets/close.png')}
                          />
                        </TouchableOpacity>
                      </View>
                    </View>

                    {isProductSearched == true && (
                      <View>
                        {refreshing && (
                          <ActivityIndicator size="large" color="#51AF5E" />
                        )}
                        {emptySearchResults != true ? (
                          <View>
                            <FlatList
                              data={searchresults}
                              renderItem={searchResultsList}
                            />
                          </View>
                        ) : (
                          <Text
                            style={{
                              textAlign: 'center',
                              justifyContent: 'center',
                            }}>
                            No Products Found
                          </Text>
                        )}
                      </View>
                    )}

                    <View
                      style={{
                        backgroundColor: '#e8e6e6',
                        marginHorizontal: 30,
                        padding: 10,
                        marginVertical: 20,
                      }}>
                      {selectedProduct.map((product, index) => (
                        <TouchableOpacity
                          key={index}
                          style={{flexDirection: 'row'}}
                          onPress={() => removeProductFromList(product)}>
                          <Image source={require('../../assets/minus.png')} />
                          <Text style={{marginLeft: 8}}>{product}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>

                    <View style={{flexDirection: 'row', marginTop: 20}}>
                      <Text
                        style={{
                          marginLeft: 20,
                          fontFamily: 'Poppins-Regular',
                          color: '#555555',
                          fontSize: 13,
                          marginTop: 10,
                        }}>
                        - for
                      </Text>
                      <TextInput
                        style={{
                          height: 38,
                          width: 40,
                          marginHorizontal: 5,
                          marginTop: 5,
                          fontFamily: 'Poppins-Regular',
                          borderWidth: 1,
                          borderColor: '#555555',
                          borderRadius: 5,
                          fontSize: 12,
                        }}
                        placeholderTextColor={'#555555'}
                        keyboardType="numeric"
                      />

                      {/* discount dropdown */}
                      <View
                        style={{
                          height: 38,
                          width: 60,
                          borderWidth: 1,
                          borderColor: 'gray',
                          justifyContent: 'center',
                          marginHorizontal: 5,
                          borderRadius: 5,
                          marginTop: 5,
                        }}>
                        <Menu
                          visible={discountTypeVisible}
                          onDismiss={closeDiscountMenu}
                          anchor={
                            <TouchableOpacity
                              style={{flexDirection: 'row'}}
                              onPress={openDiscountMenu}>
                              <Text
                                style={{alignSelf: 'center', marginLeft: 10}}>
                                {selectedDiscountType}
                              </Text>
                              <Image
                                style={{
                                  height: 15,
                                  width: 15,
                                  marginLeft: 'auto',
                                  marginRight: 4,
                                  alignSelf: 'center',
                                }}
                                source={require('../../assets/images/downIcon.png')}
                              />
                            </TouchableOpacity>
                          }>
                          <Menu.Item
                            onPress={() => handleDiscountType('%')}
                            title="%"
                          />
                          <Menu.Item
                            onPress={() => handleDiscountType('INR')}
                            title="INR"
                          />
                        </Menu>
                      </View>

                      <Text
                        style={{
                          fontFamily: 'Poppins-Regular',
                          color: '#555555',
                          fontSize: 13,
                          alignSelf: 'center',
                          width: 120,
                        }}>
                        off per unit
                      </Text>
                    </View>
                    {/* additonal options */}
                    <Text
                      style={{
                        marginLeft: 20,
                        fontFamily: 'Poppins-Regular',
                        color: '#555555',
                        fontSize: 13,
                        marginTop: 20,
                      }}>
                      - Additional options
                    </Text>

                    <TouchableOpacity
                      onPress={() => setSpecialPrice(!specialPrice)}>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          marginLeft: 30,
                        }}>
                        <Checkbox.Android
                          status={specialPrice ? 'checked' : 'unchecked'}
                          color={'green'} // Customize the checkbox color
                        />
                        <Text
                          style={{
                            color: '#21272E',
                            fontSize: 13,
                            fontFamily: 'Poppins-Light',
                          }}>
                          Apply to product with special price.
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            </RadioButton.Group>
          </View>
        )}

        {/* category discount */}
        {selectedOption === 'Category Discount' && (
          <View style={styles.radioContainer}>
            <RadioButton.Group
              onValueChange={value => setCategoryRadio(value)}
              value={categoryRadio}>
              <View>
                <RadioButton.Item
                  label="Apply an amount or percentage discount for each item in one or more categories."
                  value="categoryOption1"
                  color="#549666"
                  labelStyle={styles.labelStyle}
                  style={styles.radioButton}
                />

                {/* content occording to radio click */}
                {categoryRadio === 'categoryOption1' && (
                  <>
                    <View style={{flexDirection: 'row', marginBottom: 10}}>
                      <Text
                        style={{
                          marginLeft: 20,
                          fontFamily: 'Poppins-Regular',
                          color: '#555555',
                          fontSize: 13,
                          marginTop: 10,
                        }}>
                        - Get
                      </Text>
                      <TextInput
                        style={{
                          height: 38,
                          width: 40,
                          marginHorizontal: 5,
                          marginTop: 5,
                          fontFamily: 'Poppins-Regular',
                          borderWidth: 1,
                          borderColor: '#555555',
                          borderRadius: 5,
                          fontSize: 12,
                          textAlign: 'center',
                        }}
                        onChangeText={val => setGetOff(val)}
                        value={getOff}
                        placeholderTextColor={'#555555'}
                        keyboardType="numeric"
                      />

                      {/* discount dropdown */}
                      <View
                        style={{
                          height: 38,
                          width: 60,
                          borderWidth: 1,
                          borderColor: 'gray',
                          justifyContent: 'center',
                          marginHorizontal: 5,
                          borderRadius: 5,
                          marginTop: 5,
                        }}>
                        <Menu
                          visible={discountTypeVisible}
                          onDismiss={closeDiscountMenu}
                          anchor={
                            <TouchableOpacity
                              style={{flexDirection: 'row'}}
                              onPress={openDiscountMenu}>
                              <Text
                                style={{alignSelf: 'center', marginLeft: 10}}>
                                {selectedDiscountType}
                              </Text>
                              <Image
                                style={{
                                  height: 15,
                                  width: 15,
                                  marginLeft: 'auto',
                                  marginRight: 4,
                                  alignSelf: 'center',
                                }}
                                source={require('../../assets/images/downIcon.png')}
                              />
                            </TouchableOpacity>
                          }>
                          <Menu.Item
                            onPress={() => handleDiscountType('%')}
                            title="%"
                          />
                          <Menu.Item
                            onPress={() => handleDiscountType('INR')}
                            title="INR"
                          />
                        </Menu>
                      </View>

                      <Text
                        style={{
                          fontFamily: 'Poppins-Regular',
                          color: '#555555',
                          marginTop: 10,
                          fontSize: 13,
                          width: 200,
                        }}>
                        off each item in the following categories.
                      </Text>
                    </View>

                    <Menu
                      visible={menuVisible}
                      onDismiss={() => setMenuVisible(false)}
                      anchor={
                        <TouchableOpacity
                          style={{
                            height: 45,
                            width: 300,
                            marginLeft: 30,
                            marginTop: 5,
                            fontFamily: 'Poppins-Regular',
                            borderWidth: 1,
                            borderColor: '#B7B9C1',
                            fontSize: 12,
                            backgroundColor: '#E6EAF0',
                            paddingLeft: 10,
                            flexDirection: 'row',
                          }}
                          onPress={() => setMenuVisible(true)}>
                          <Text style={{alignSelf: 'center'}}>
                            Select category name
                          </Text>
                        </TouchableOpacity>
                      }>
                      {/* Render item names in the menu */}
                      {categoryNames.map((item, index) => (
                        <Menu.Item
                          key={index}
                          onPress={() => addCategoryItem(item.name)}
                          title={item.name}
                        />
                      ))}
                    </Menu>

                    <View
                      style={{
                        backgroundColor: '#e8e6e6',
                        marginHorizontal: 30,
                        padding: 10,
                        marginVertical: 20,
                      }}>
                      {selectedCategory.map((item, index) => (
                        <TouchableOpacity
                          key={index}
                          style={{flexDirection: 'row'}}
                          onPress={() => removeCategoryItem(item)}>
                          <Image source={require('../../assets/minus.png')} />
                          <Text style={{marginLeft: 8}}>{item}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>

                    {/* additonal options */}
                    <Text
                      style={{
                        marginLeft: 20,
                        fontFamily: 'Poppins-Regular',
                        color: '#555555',
                        fontSize: 13,
                        marginTop: 20,
                      }}>
                      - Additional options
                    </Text>

                    <TouchableOpacity
                      onPress={() => setSpecialPrice(!specialPrice)}>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          marginLeft: 30,
                        }}>
                        <Checkbox.Android
                          status={specialPrice ? 'checked' : 'unchecked'}
                          color={'green'} // Customize the checkbox color
                        />
                        <Text
                          style={{
                            color: '#21272E',
                            fontSize: 13,
                            fontFamily: 'Poppins-Light',
                          }}>
                          Apply to product with special price.
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </>
                )}
              </View>

              {/* second radio option */}
              <View>
                <RadioButton.Item
                  label="Buy X units of Category A, get Y additional units in the same category for free."
                  value="categoryOption2"
                  color="#549666"
                  labelStyle={styles.labelStyle}
                  style={styles.radioButton}
                />
                {categoryRadio === 'categoryOption2' && (
                  <>
                    <View style={{flexDirection: 'row'}}>
                      <Text
                        style={{
                          marginLeft: 20,
                          fontFamily: 'Poppins-Regular',
                          color: '#555555',
                          fontSize: 13,
                          marginTop: 10,
                        }}>
                        - If the customer buys
                      </Text>
                      <TextInput
                        style={{
                          height: 38,
                          width: 40,
                          marginHorizontal: 2,
                          marginTop: 5,
                          fontFamily: 'Poppins-Regular',
                          borderWidth: 1,
                          borderColor: '#555555',
                          borderRadius: 5,
                          fontSize: 12,
                          color: '#000',
                        }}
                        onChangeText={val => setCustomerBuys(val)}
                        value={customerBuys}
                        placeholderTextColor={'#555555'}
                        keyboardType="numeric"
                      />

                      <Checkbox.Android
                        status={moreProducts ? 'checked' : 'unchecked'}
                        color={'green'}
                        onPress={() => setMoreProducts(!moreProducts)}
                      />

                      <Text
                        style={{
                          fontFamily: 'Poppins-Regular',
                          color: '#555555',
                          fontSize: 13,
                          alignSelf: 'center',
                          width: 120,
                        }}>
                        (or more) units from the following categories,
                      </Text>
                    </View>

                    <Menu
                      visible={menuVisible}
                      onDismiss={() => setMenuVisible(false)}
                      anchor={
                        <TouchableOpacity
                          style={{
                            height: 45,
                            width: 300,
                            marginLeft: 30,
                            marginTop: 5,
                            fontFamily: 'Poppins-Regular',
                            borderWidth: 1,
                            borderColor: '#B7B9C1',
                            fontSize: 12,
                            backgroundColor: '#E6EAF0',
                            paddingLeft: 10,
                            flexDirection: 'row',
                          }}
                          onPress={() => setMenuVisible(true)}>
                          <Text style={{alignSelf: 'center'}}>
                            Select category name
                          </Text>
                        </TouchableOpacity>
                      }>
                      {/* Render item names in the menu */}
                      {categoryNames.map((item, index) => (
                        <Menu.Item
                          key={index}
                          onPress={() => addCategoryItem(item.name)}
                          title={item.name}
                        />
                      ))}
                    </Menu>

                    <View
                      style={{
                        backgroundColor: '#e8e6e6',
                        marginHorizontal: 30,
                        padding: 10,
                        marginVertical: 20,
                      }}>
                      {selectedCategory.map((item, index) => (
                        <TouchableOpacity
                          key={index}
                          style={{flexDirection: 'row'}}
                          onPress={() => removeCategoryItem(item)}>
                          <Image source={require('../../assets/minus.png')} />
                          <Text style={{marginLeft: 8}}>{item}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>

                    <View style={{flexDirection: 'row', marginTop: 20}}>
                      <Text
                        style={{
                          marginLeft: 20,
                          fontFamily: 'Poppins-Regular',
                          color: '#555555',
                          fontSize: 13,
                          marginTop: 10,
                        }}>
                        - then they get
                      </Text>
                      <TextInput
                        style={{
                          height: 38,
                          width: 40,
                          marginHorizontal: 5,
                          marginTop: 5,
                          fontFamily: 'Poppins-Regular',
                          borderWidth: 1,
                          borderColor: '#555555',
                          borderRadius: 5,
                          fontSize: 12,
                        }}
                        onChangeText={val => setTheyGet(val)}
                        value={theyGet}
                        placeholderTextColor={'#555555'}
                        keyboardType="numeric"
                      />

                      <Text
                        style={{
                          fontFamily: 'Poppins-Regular',
                          color: '#555555',
                          fontSize: 13,
                          alignSelf: 'center',
                          width: 160,
                        }}>
                        units from the same category for free.
                      </Text>
                    </View>

                    {/* additonal options */}
                    <Text
                      style={{
                        marginLeft: 20,
                        fontFamily: 'Poppins-Regular',
                        color: '#555555',
                        fontSize: 13,
                        marginTop: 20,
                      }}>
                      - Additional options
                    </Text>

                    <TouchableOpacity
                      onPress={() => setSpecialPrice(!specialPrice)}>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          marginLeft: 30,
                        }}>
                        <Checkbox.Android
                          status={specialPrice ? 'checked' : 'unchecked'}
                          color={'green'} // Customize the checkbox color
                        />
                        <Text
                          style={{
                            color: '#21272E',
                            fontSize: 13,
                            fontFamily: 'Poppins-Light',
                          }}>
                          Apply to product with special price.
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </>
                )}
              </View>

              {/* third radio option */}
              <View>
                <RadioButton.Item
                  label="Buy X units of category A, get amount or percentage off per unit of category B."
                  value="categoryOption3"
                  color="#549666"
                  labelStyle={styles.labelStyle}
                  style={styles.radioButton}
                />
                {categoryRadio === 'categoryOption3' && (
                  <>
                    <View style={{flexDirection: 'row'}}>
                      <Text
                        style={{
                          marginLeft: 20,
                          fontFamily: 'Poppins-Regular',
                          color: '#555555',
                          fontSize: 13,
                          marginTop: 10,
                        }}>
                        - If the customer buys at least
                      </Text>
                      <TextInput
                        style={{
                          height: 38,
                          width: 40,
                          marginHorizontal: 5,
                          marginTop: 5,
                          fontFamily: 'Poppins-Regular',
                          borderWidth: 1,
                          borderColor: '#555555',
                          borderRadius: 5,
                          fontSize: 12,
                          color: '#000',
                        }}
                        onChangeText={val => setCustomerBuys(val)}
                        value={customerBuys}
                        placeholderTextColor={'#555555'}
                        keyboardType="numeric"
                      />

                      <Text
                        style={{
                          fontFamily: 'Poppins-Regular',
                          color: '#555555',
                          fontSize: 13,
                          alignSelf: 'center',
                          width: 120,
                        }}>
                        units
                      </Text>
                    </View>

                    <Text
                      style={{
                        fontFamily: 'Poppins-Regular',
                        color: '#555555',
                        fontSize: 13,
                        marginLeft: 30,
                      }}>
                      - from the following categories:
                    </Text>
                    <Menu
                      visible={menuVisible}
                      onDismiss={() => setMenuVisible(false)}
                      anchor={
                        <TouchableOpacity
                          style={{
                            height: 45,
                            width: 300,
                            marginLeft: 30,
                            marginTop: 5,
                            fontFamily: 'Poppins-Regular',
                            borderWidth: 1,
                            borderColor: '#B7B9C1',
                            fontSize: 12,
                            backgroundColor: '#E6EAF0',
                            paddingLeft: 10,
                            flexDirection: 'row',
                          }}
                          onPress={() => setMenuVisible(true)}>
                          <Text style={{alignSelf: 'center'}}>
                            Select category name
                          </Text>
                        </TouchableOpacity>
                      }>
                      {/* Render item names in the menu */}
                      {categoryNames.map((item, index) => (
                        <Menu.Item
                          key={index}
                          onPress={() => addCategoryItem(item.name)}
                          title={item.name}
                        />
                      ))}
                    </Menu>

                    <View
                      style={{
                        backgroundColor: '#e8e6e6',
                        marginHorizontal: 30,
                        padding: 10,
                        marginVertical: 20,
                      }}>
                      {selectedCategory.map((item, index) => (
                        <TouchableOpacity
                          key={index}
                          style={{flexDirection: 'row'}}
                          onPress={() => removeCategoryItem(item)}>
                          <Image source={require('../../assets/minus.png')} />
                          <Text style={{marginLeft: 8}}>{item}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>

                    <View
                      style={{
                        flexDirection: 'row',
                        marginTop: 20,
                        marginBottom: 8,
                      }}>
                      <Text
                        style={{
                          marginLeft: 20,
                          fontFamily: 'Poppins-Regular',
                          color: '#555555',
                          fontSize: 13,
                          marginTop: 10,
                        }}>
                        - customer will get
                      </Text>
                      <TextInput
                        style={{
                          height: 38,
                          width: 40,
                          marginHorizontal: 5,
                          marginTop: 5,
                          fontFamily: 'Poppins-Regular',
                          borderWidth: 1,
                          borderColor: '#555555',
                          borderRadius: 5,
                          fontSize: 12,
                        }}
                        onChangeText={val => setTheyGet(val)}
                        value={theyGet}
                        placeholderTextColor={'#555555'}
                        keyboardType="numeric"
                      />

                      {/* discount dropdown */}
                      <View
                        style={{
                          height: 38,
                          width: 60,
                          borderWidth: 1,
                          borderColor: 'gray',
                          justifyContent: 'center',
                          marginHorizontal: 5,
                          borderRadius: 5,
                          marginTop: 5,
                        }}>
                        <Menu
                          visible={discountTypeVisible}
                          onDismiss={closeDiscountMenu}
                          anchor={
                            <TouchableOpacity
                              style={{flexDirection: 'row'}}
                              onPress={openDiscountMenu}>
                              <Text
                                style={{alignSelf: 'center', marginLeft: 10}}>
                                {selectedDiscountType}
                              </Text>
                              <Image
                                style={{
                                  height: 15,
                                  width: 15,
                                  marginLeft: 'auto',
                                  marginRight: 4,
                                  alignSelf: 'center',
                                }}
                                source={require('../../assets/images/downIcon.png')}
                              />
                            </TouchableOpacity>
                          }>
                          <Menu.Item
                            onPress={() => handleDiscountType('%')}
                            title="%"
                          />
                          <Menu.Item
                            onPress={() => handleDiscountType('INR')}
                            title="INR"
                          />
                        </Menu>
                      </View>

                      <Text
                        style={{
                          fontFamily: 'Poppins-Regular',
                          color: '#555555',
                          fontSize: 13,
                          alignSelf: 'center',
                          width: 160,
                        }}>
                        off
                      </Text>
                    </View>

                    <Text
                      style={{
                        fontFamily: 'Poppins-Regular',
                        color: '#555555',
                        fontSize: 13,
                        marginLeft: 30,
                      }}>
                      - for each item in the following categories:
                    </Text>

                    <Menu
                      visible={menuVisible}
                      onDismiss={() => setMenuVisible(false)}
                      anchor={
                        <TouchableOpacity
                          style={{
                            height: 45,
                            width: 300,
                            marginLeft: 30,
                            marginTop: 5,
                            fontFamily: 'Poppins-Regular',
                            borderWidth: 1,
                            borderColor: '#B7B9C1',
                            fontSize: 12,
                            backgroundColor: '#E6EAF0',
                            paddingLeft: 10,
                            flexDirection: 'row',
                          }}
                          onPress={() => setMenuVisible(true)}>
                          <Text style={{alignSelf: 'center'}}>
                            Select category name
                          </Text>
                        </TouchableOpacity>
                      }>
                      {/* Render item names in the menu */}
                      {categoryNames.map((item, index) => (
                        <Menu.Item
                          key={index}
                          onPress={() => addCategoryItem(item.name)}
                          title={item.name}
                        />
                      ))}
                    </Menu>

                    <View
                      style={{
                        backgroundColor: '#e8e6e6',
                        marginHorizontal: 30,
                        padding: 10,
                        marginVertical: 20,
                      }}>
                      {selectedCategory.map((item, index) => (
                        <TouchableOpacity
                          key={index}
                          style={{flexDirection: 'row'}}
                          onPress={() => removeCategoryItem(item)}>
                          <Image source={require('../../assets/minus.png')} />
                          <Text style={{marginLeft: 8}}>{item}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>

                    {/* additonal options */}
                    <Text
                      style={{
                        marginLeft: 20,
                        fontFamily: 'Poppins-Regular',
                        color: '#555555',
                        fontSize: 13,
                        marginTop: 20,
                      }}>
                      - Additional options
                    </Text>

                    <TouchableOpacity
                      onPress={() => setSpecialPrice(!specialPrice)}>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          marginLeft: 30,
                        }}>
                        <Checkbox.Android
                          status={specialPrice ? 'checked' : 'unchecked'}
                          color={'green'} // Customize the checkbox color
                        />
                        <Text
                          style={{
                            color: '#21272E',
                            fontSize: 13,
                            fontFamily: 'Poppins-Light',
                          }}>
                          Apply to product with special price.
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </>
                )}
              </View>

              {/* fourth radio option */}
              <View>
                <RadioButton.Item
                  label="Apply a tiered discount to applicable products based on the quantity of items ordered within one or more categories."
                  value="categoryOption4"
                  color="#549666"
                  labelStyle={styles.labelStyle}
                  style={styles.radioButton}
                />
                {categoryRadio === 'categoryOption4' && (
                  <>
                    <Text
                      style={{
                        fontFamily: 'Poppins-Regular',
                        color: '#555555',
                        fontSize: 13,
                        marginLeft: 30,
                      }}>
                      - Select a category to apply this discount to:
                    </Text>
                    <Menu
                      visible={menuVisible}
                      onDismiss={() => setMenuVisible(false)}
                      anchor={
                        <TouchableOpacity
                          style={{
                            height: 45,
                            width: 300,
                            marginLeft: 30,
                            marginTop: 5,
                            fontFamily: 'Poppins-Regular',
                            borderWidth: 1,
                            borderColor: '#B7B9C1',
                            fontSize: 12,
                            backgroundColor: '#E6EAF0',
                            paddingLeft: 10,
                            flexDirection: 'row',
                          }}
                          onPress={() => setMenuVisible(true)}>
                          <Text style={{alignSelf: 'center'}}>
                            Select category name
                          </Text>
                        </TouchableOpacity>
                      }>
                      {/* Render item names in the menu */}
                      {categoryNames.map((item, index) => (
                        <Menu.Item
                          key={index}
                          onPress={() => addCategoryItem(item.name)}
                          title={item.name}
                        />
                      ))}
                    </Menu>

                    <View
                      style={{
                        backgroundColor: '#e8e6e6',
                        marginHorizontal: 30,
                        padding: 10,
                        marginVertical: 20,
                      }}>
                      {selectedCategory.map((item, index) => (
                        <TouchableOpacity
                          key={index}
                          style={{flexDirection: 'row'}}
                          onPress={() => removeCategoryItem(item)}>
                          <Image source={require('../../assets/minus.png')} />
                          <Text style={{marginLeft: 8}}>{item}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>

                    <View
                      style={{
                        flexDirection: 'row',
                        marginTop: 20,
                        marginBottom: 8,
                      }}>
                      <Text
                        style={{
                          marginLeft: 20,
                          fontFamily: 'Poppins-Regular',
                          color: '#555555',
                          fontSize: 13,
                          marginTop: 10,
                        }}>
                        - Create tiered
                      </Text>
                      <View
                        style={{
                          height: 30,
                          width: 60,
                          borderWidth: 1,
                          borderColor: 'gray',
                          justifyContent: 'center',
                          marginHorizontal: 5,
                          borderRadius: 5,
                          marginTop: 5,
                        }}>
                        <Menu
                          visible={discountTypeVisible}
                          onDismiss={closeDiscountMenu}
                          anchor={
                            <TouchableOpacity
                              style={{flexDirection: 'row'}}
                              onPress={openDiscountMenu}>
                              <Text
                                style={{alignSelf: 'center', marginLeft: 10}}>
                                {selectedDiscountType}
                              </Text>
                              <Image
                                style={{
                                  height: 15,
                                  width: 15,
                                  marginLeft: 'auto',
                                  marginRight: 4,
                                  alignSelf: 'center',
                                }}
                                source={require('../../assets/images/downIcon.png')}
                              />
                            </TouchableOpacity>
                          }>
                          <Menu.Item
                            onPress={() => handleDiscountType('%')}
                            title="%"
                          />
                          <Menu.Item
                            onPress={() => handleDiscountType('INR')}
                            title="INR"
                          />
                        </Menu>
                      </View>
                      <Text
                        style={{
                          fontFamily: 'Poppins-Regular',
                          color: '#555555',
                          fontSize: 13,
                          alignSelf: 'center',
                          width: 160,
                        }}>
                        off discount:
                      </Text>
                    </View>

                    {/* quantity add minus logic */}
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginHorizontal: 30,
                      }}>
                      <Text
                        style={{
                          fontFamily: 'Poppins-SemiBold',
                          alignSelf: 'center',
                        }}>
                        Minimum Qty
                      </Text>
                      <Text
                        style={{
                          fontFamily: 'Poppins-SemiBold',
                          alignSelf: 'center',
                        }}>
                        Discount value
                      </Text>
                      <TouchableOpacity
                        style={{
                          height: 20,
                          width: 20,
                          backgroundColor: 'green',
                          borderRadius: 5,
                          alignSelf: 'center',
                          justifyContent: 'center',
                        }}
                        onPress={handleAddRow}>
                        <Text
                          style={{
                            color: '#FFF',
                            fontSize: 20,
                            fontFamily: 'Poppins-Bold',
                            textAlign: 'center',
                            marginTop: 2.5,
                          }}>
                          {' '}
                          +{' '}
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <Divider
                      style={{
                        backgroundColor: 'black',
                        marginVertical: 10,
                        marginHorizontal: 30,
                        height: 1,
                      }}
                    />
                    {discounts.map((discount, index) => (
                      <View
                        key={index}
                        style={{flexDirection: 'row', marginBottom: 10}}>
                        <View
                          style={{
                            width: 80,
                            marginHorizontal: 30,
                            justifyContent: 'space-between',
                          }}>
                          <TextInput
                            style={{
                              flex: 1,
                              marginRight: 10,
                              borderWidth: 1,
                              padding: 5,
                            }}
                            placeholder=""
                            value={discount.minQty}
                            onChangeText={value =>
                              handleInputChange(index, 'minQty', value)
                            }
                            keyboardType="numeric"
                          />
                        </View>

                        <View
                          style={{
                            width: 150,
                            marginRight: 10,
                            marginHorizontal: 30,
                            justifyContent: 'space-between',
                          }}>
                          <TextInput
                            style={{
                              flex: 1,
                              marginRight: 10,
                              borderWidth: 1,
                              padding: 5,
                            }}
                            value={discount.discount}
                            onChangeText={value =>
                              handleInputChange(index, 'discount', value)
                            }
                            keyboardType="numeric"
                          />
                        </View>

                        {index > 0 && (
                          <TouchableOpacity
                            style={{
                              height: 20,
                              width: 20,
                              backgroundColor: 'red',
                              borderRadius: 5,
                              alignSelf: 'center',
                              justifyContent: 'center',
                            }}
                            onPress={() => handleRemoveRow(index)}>
                            <Text
                              style={{
                                color: '#FFF',
                                fontSize: 20,
                                fontFamily: 'Poppins-Bold',
                                textAlign: 'center',
                                marginTop: 2.5,
                              }}>
                              {' '}
                              -{' '}
                            </Text>
                          </TouchableOpacity>
                        )}
                      </View>
                    ))}

                    {/* additonal options */}
                    <Text
                      style={{
                        marginLeft: 20,
                        fontFamily: 'Poppins-Regular',
                        color: '#555555',
                        fontSize: 13,
                        marginTop: 20,
                      }}>
                      - Additional options
                    </Text>

                    <TouchableOpacity
                      onPress={() => setSpecialPrice(!specialPrice)}>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          marginLeft: 30,
                        }}>
                        <Checkbox.Android
                          status={specialPrice ? 'checked' : 'unchecked'}
                          color={'green'} // Customize the checkbox color
                        />
                        <Text
                          style={{
                            color: '#21272E',
                            fontSize: 13,
                            fontFamily: 'Poppins-Light',
                          }}>
                          Apply to product with special price.
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            </RadioButton.Group>
          </View>
        )}

        {/* order discount */}
        {selectedOption === 'Order Discount' && (
          <View style={styles.radioContainer}>
            <RadioButton.Group
              onValueChange={value => setOrderRadio(value)}
              value={orderRadio}>
              <View>
                <RadioButton.Item
                  label="Apply an amount or percentage discount to the order total, on orders of fixed amount or more."
                  value="orderOption1"
                  color="#549666"
                  labelStyle={styles.labelStyle}
                  style={styles.radioButton}
                />

                {/* content occording to radio click */}
                {orderRadio === 'orderOption1' && (
                  <>
                    <View style={{flexDirection: 'row', marginBottom: 10}}>
                      <Text
                        style={{
                          marginLeft: 20,
                          fontFamily: 'Poppins-Regular',
                          color: '#555555',
                          fontSize: 13,
                          marginTop: 10,
                        }}>
                        - Discount type
                      </Text>

                      {/* discount dropdown */}
                      <View
                        style={{
                          height: 38,
                          width: 60,
                          borderWidth: 1,
                          borderColor: 'gray',
                          justifyContent: 'center',
                          marginHorizontal: 5,
                          borderRadius: 5,
                          marginTop: 5,
                        }}>
                        <Menu
                          visible={discountTypeVisible}
                          onDismiss={closeDiscountMenu}
                          anchor={
                            <TouchableOpacity
                              style={{flexDirection: 'row'}}
                              onPress={openDiscountMenu}>
                              <Text
                                style={{alignSelf: 'center', marginLeft: 10}}>
                                {selectedDiscountType}
                              </Text>
                              <Image
                                style={{
                                  height: 15,
                                  width: 15,
                                  marginLeft: 'auto',
                                  marginRight: 4,
                                  alignSelf: 'center',
                                }}
                                source={require('../../assets/images/downIcon.png')}
                              />
                            </TouchableOpacity>
                          }>
                          <Menu.Item
                            onPress={() => handleDiscountType('%')}
                            title="%"
                          />
                          <Menu.Item
                            onPress={() => handleDiscountType('INR')}
                            title="INR"
                          />
                        </Menu>
                      </View>

                      <Text
                        style={{
                          fontFamily: 'Poppins-Regular',
                          color: '#555555',
                          marginTop: 10,
                          fontSize: 13,
                          width: 200,
                        }}>
                        off.
                      </Text>
                    </View>

                    {/* order value add minus logic */}
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginHorizontal: 30,
                      }}>
                      <Text
                        style={{
                          fontFamily: 'Poppins-SemiBold',
                          alignSelf: 'center',
                        }}>
                        Min. order value
                      </Text>
                      <Text
                        style={{
                          fontFamily: 'Poppins-SemiBold',
                          alignSelf: 'center',
                        }}>
                        Discount value
                      </Text>
                      <TouchableOpacity
                        style={{
                          height: 20,
                          width: 20,
                          backgroundColor: 'green',
                          borderRadius: 5,
                          alignSelf: 'center',
                          justifyContent: 'center',
                        }}
                        onPress={handleAddOrderValue}>
                        <Text
                          style={{
                            color: '#FFF',
                            fontSize: 20,
                            fontFamily: 'Poppins-Bold',
                            textAlign: 'center',
                            marginTop: 2.5,
                          }}>
                          {' '}
                          +{' '}
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <Divider
                      style={{
                        backgroundColor: 'black',
                        marginVertical: 10,
                        marginHorizontal: 30,
                        height: 1,
                      }}
                    />
                    {orderValue.map((orderValue, index) => (
                      <View
                        key={index}
                        style={{flexDirection: 'row', marginBottom: 10}}>
                        <Text
                          style={{
                            fontFamily: 'Poppins-Regular',
                            color: '#555555',
                            marginTop: 10,
                            fontSize: 13,
                            marginLeft: 10,
                          }}>
                          INR
                        </Text>
                        <View
                          style={{
                            width: 80,
                            marginLeft: 10,
                            justifyContent: 'space-between',
                          }}>
                          <TextInput
                            style={{
                              flex: 1,
                              marginRight: 10,
                              borderWidth: 1,
                              padding: 5,
                            }}
                            placeholder=""
                            value={orderValue.minOrderValue}
                            onChangeText={value =>
                              handleOrderValueInput(
                                index,
                                'minOrderValue',
                                value,
                              )
                            }
                            keyboardType="numeric"
                          />
                        </View>

                        <View
                          style={{
                            width: 150,
                            marginRight: 10,
                            marginHorizontal: 30,
                            justifyContent: 'space-between',
                          }}>
                          <TextInput
                            style={{
                              flex: 1,
                              marginRight: 10,
                              borderWidth: 1,
                              padding: 5,
                            }}
                            value={orderValue.discountValue}
                            onChangeText={value =>
                              handleOrderValueInput(
                                index,
                                'discountValue',
                                value,
                              )
                            }
                            keyboardType="numeric"
                          />
                        </View>

                        {index > 0 && (
                          <TouchableOpacity
                            style={{
                              height: 20,
                              width: 20,
                              backgroundColor: 'red',
                              borderRadius: 5,
                              alignSelf: 'center',
                              justifyContent: 'center',
                            }}
                            onPress={() => handleRemoveOrderValue(index)}>
                            <Text
                              style={{
                                color: '#FFF',
                                fontSize: 20,
                                fontFamily: 'Poppins-Bold',
                                textAlign: 'center',
                                marginTop: 2.5,
                              }}>
                              {' '}
                              -{' '}
                            </Text>
                          </TouchableOpacity>
                        )}
                      </View>
                    ))}
                  </>
                )}
              </View>

              {/* second radio option */}
              <View>
                <RadioButton.Item
                  label="Order at least fixed amount, get one unit of Product Y for amount or percentage off."
                  value="orderOption2"
                  color="#549666"
                  labelStyle={styles.labelStyle}
                  style={styles.radioButton}
                />
                {orderRadio === 'orderOption2' && (
                  <>
                    <View style={{flexDirection: 'row'}}>
                      <Text
                        style={{
                          marginLeft: 20,
                          fontFamily: 'Poppins-Regular',
                          color: '#555555',
                          fontSize: 13,
                          marginTop: 10,
                        }}>
                        - Order total at leastINR
                      </Text>
                      <TextInput
                        style={{
                          height: 38,
                          width: 40,
                          marginHorizontal: 2,
                          marginTop: 5,
                          fontFamily: 'Poppins-Regular',
                          borderWidth: 1,
                          borderColor: '#555555',
                          borderRadius: 5,
                          fontSize: 12,
                        }}
                        placeholderTextColor={'#555555'}
                        keyboardType="numeric"
                      />
                      <Text
                        style={{
                          fontFamily: 'Poppins-Regular',
                          color: '#555555',
                          fontSize: 13,
                          alignSelf: 'center',
                          width: 140,
                        }}>
                        , get one unit of the following products
                      </Text>
                    </View>

                    <View
                      style={{
                        height: 45,
                        width: 300,
                        marginLeft: 30,
                        marginTop: 5,
                        fontFamily: 'Poppins-Regular',
                        borderWidth: 1,
                        borderColor: '#B7B9C1',
                        fontSize: 12,
                        backgroundColor: '#E6EAF0',
                        paddingLeft: 10,
                        flexDirection: 'row',
                      }}>
                      <TextInput
                        onChangeText={val => updateSearchName(val)}
                        value={searchkey}
                        placeholderTextColor={'#555555'}
                        placeholder="Type product name"
                        style={{width: 250}}
                      />

                      <View
                        style={{
                          marginLeft: 'auto',
                          flexDirection: 'row',
                          marginRight: 15,
                        }}>
                        <TouchableOpacity
                          style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}
                          onPress={() => {
                            setsearchkey();
                            setsearchresults();
                            //   setIsSearched(false);
                          }}>
                          <Image
                            style={{
                              width: 20,
                              height: 20,
                              marginRight: 10,
                              // resizeMode: "center",
                              // marginBottom: 5,
                            }}
                            source={require('../../assets/close.png')}
                          />
                        </TouchableOpacity>
                      </View>
                    </View>

                    {isProductSearched == true && (
                      <View>
                        {refreshing && (
                          <ActivityIndicator size="large" color="#51AF5E" />
                        )}
                        {emptySearchResults != true ? (
                          <View>
                            <FlatList
                              data={searchresults}
                              renderItem={searchResultsList}
                            />
                          </View>
                        ) : (
                          <Text
                            style={{
                              textAlign: 'center',
                              justifyContent: 'center',
                            }}>
                            No Products Found
                          </Text>
                        )}
                      </View>
                    )}

                    <View
                      style={{
                        backgroundColor: '#e8e6e6',
                        marginHorizontal: 30,
                        padding: 10,
                        marginVertical: 20,
                      }}>
                      {selectedProduct.map((product, index) => (
                        <TouchableOpacity
                          key={index}
                          style={{flexDirection: 'row'}}
                          onPress={() => removeProductFromList(product)}>
                          <Image source={require('../../assets/minus.png')} />
                          <Text style={{marginLeft: 8}}>{product}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>

                    <View style={{flexDirection: 'row', marginTop: 20}}>
                      <Text
                        style={{
                          marginLeft: 20,
                          fontFamily: 'Poppins-Regular',
                          color: '#555555',
                          fontSize: 13,
                          marginTop: 10,
                        }}>
                        - for
                      </Text>
                      <TextInput
                        style={{
                          height: 38,
                          width: 40,
                          marginHorizontal: 5,
                          marginTop: 5,
                          fontFamily: 'Poppins-Regular',
                          borderWidth: 1,
                          borderColor: '#555555',
                          borderRadius: 5,
                          fontSize: 12,
                        }}
                        placeholderTextColor={'#555555'}
                        keyboardType="numeric"
                      />

                      <View
                        style={{
                          height: 38,
                          width: 60,
                          borderWidth: 1,
                          borderColor: 'gray',
                          justifyContent: 'center',
                          marginHorizontal: 5,
                          borderRadius: 5,
                          marginTop: 5,
                        }}>
                        <Menu
                          visible={discountTypeVisible}
                          onDismiss={closeDiscountMenu}
                          anchor={
                            <TouchableOpacity
                              style={{flexDirection: 'row'}}
                              onPress={openDiscountMenu}>
                              <Text
                                style={{alignSelf: 'center', marginLeft: 10}}>
                                {selectedDiscountType}
                              </Text>
                              <Image
                                style={{
                                  height: 15,
                                  width: 15,
                                  marginLeft: 'auto',
                                  marginRight: 4,
                                  alignSelf: 'center',
                                }}
                                source={require('../../assets/images/downIcon.png')}
                              />
                            </TouchableOpacity>
                          }>
                          <Menu.Item
                            onPress={() => handleDiscountType('%')}
                            title="%"
                          />
                          <Menu.Item
                            onPress={() => handleDiscountType('INR')}
                            title="INR"
                          />
                        </Menu>
                      </View>

                      <Text
                        style={{
                          fontFamily: 'Poppins-Regular',
                          color: '#555555',
                          fontSize: 13,
                          alignSelf: 'center',
                        }}>
                        off
                      </Text>
                    </View>

                    {/* additonal options */}
                    <Text
                      style={{
                        marginLeft: 20,
                        fontFamily: 'Poppins-Regular',
                        color: '#555555',
                        fontSize: 13,
                        marginTop: 20,
                      }}>
                      - Additional options
                    </Text>

                    <TouchableOpacity
                      onPress={() => setSpecialPrice(!specialPrice)}>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          marginLeft: 30,
                        }}>
                        <Checkbox.Android
                          status={specialPrice ? 'checked' : 'unchecked'}
                          color={'green'} // Customize the checkbox color
                        />
                        <Text
                          style={{
                            color: '#21272E',
                            fontSize: 13,
                            fontFamily: 'Poppins-Light',
                          }}>
                          Apply to product with special price.
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </>
                )}
              </View>

              {/* third radio option */}
              <View>
                <RadioButton.Item
                  label="Order at least fixed amount, get percentage off Z unit(s) of the (least or most) expensive item(s) in the cart."
                  value="orderOption3"
                  color="#549666"
                  labelStyle={styles.labelStyle}
                  style={styles.radioButton}
                />
                {orderRadio === 'orderOption3' && (
                  <>
                    <View style={{flexDirection: 'row'}}>
                      <Text
                        style={{
                          marginLeft: 20,
                          fontFamily: 'Poppins-Regular',
                          color: '#555555',
                          fontSize: 13,
                          marginTop: 10,
                        }}>
                        - If the order total is at leastINR
                      </Text>
                      <TextInput
                        style={{
                          height: 38,
                          width: 40,
                          marginHorizontal: 5,
                          marginTop: 5,
                          fontFamily: 'Poppins-Regular',
                          borderWidth: 1,
                          borderColor: '#555555',
                          borderRadius: 5,
                          fontSize: 12,
                        }}
                        placeholderTextColor={'#555555'}
                        keyboardType="numeric"
                      />
                    </View>

                    <View
                      style={{
                        flexDirection: 'row',
                        marginTop: 20,
                        marginBottom: 8,
                      }}>
                      <Text
                        style={{
                          marginLeft: 20,
                          fontFamily: 'Poppins-Regular',
                          color: '#555555',
                          fontSize: 13,
                          marginTop: 10,
                        }}>
                        - Then they will get
                      </Text>
                      <TextInput
                        style={{
                          height: 38,
                          width: 40,
                          marginHorizontal: 5,
                          marginTop: 5,
                          fontFamily: 'Poppins-Regular',
                          borderWidth: 1,
                          borderColor: '#555555',
                          borderRadius: 5,
                          fontSize: 12,
                        }}
                        placeholderTextColor={'#555555'}
                        keyboardType="numeric"
                      />

                      <Text
                        style={{
                          fontFamily: 'Poppins-Regular',
                          color: '#555555',
                          fontSize: 13,
                          alignSelf: 'center',
                        }}>
                        % off
                      </Text>

                      <TextInput
                        style={{
                          height: 38,
                          width: 40,
                          marginHorizontal: 5,
                          marginTop: 5,
                          fontFamily: 'Poppins-Regular',
                          borderWidth: 1,
                          borderColor: '#555555',
                          borderRadius: 5,
                          fontSize: 12,
                        }}
                        placeholderTextColor={'#555555'}
                        keyboardType="numeric"
                      />

                      <Text
                        style={{
                          fontFamily: 'Poppins-Regular',
                          color: '#555555',
                          fontSize: 13,
                          alignSelf: 'center',
                          width: 160,
                        }}>
                        unit(s)
                      </Text>
                    </View>

                    <View
                      style={{
                        flexDirection: 'row',
                        marginTop: 20,
                        marginBottom: 8,
                      }}>
                      <Text
                        style={{
                          marginLeft: 20,
                          fontFamily: 'Poppins-Regular',
                          color: '#555555',
                          fontSize: 13,
                          marginTop: 10,
                        }}>
                        - of the
                      </Text>
                      <View
                        style={{
                          height: 30,
                          width: 60,
                          borderWidth: 1,
                          borderColor: 'gray',
                          justifyContent: 'center',
                          marginHorizontal: 5,
                          borderRadius: 5,
                          marginTop: 5,
                        }}>
                        <Menu
                          visible={visible}
                          onDismiss={closeMenu}
                          anchor={
                            <TouchableOpacity
                              style={{flexDirection: 'row'}}
                              onPress={openMenu}>
                              <Text
                                style={{alignSelf: 'center', marginLeft: 5}}>
                                {selectedChoice}
                              </Text>
                              <Image
                                style={{
                                  height: 15,
                                  width: 15,
                                  marginLeft: 'auto',
                                  marginRight: 4,
                                  alignSelf: 'center',
                                }}
                                source={require('../../assets/images/downIcon.png')}
                              />
                            </TouchableOpacity>
                          }>
                          <Menu.Item
                            onPress={() => handleChoice('least')}
                            title="least"
                          />
                          <Menu.Item
                            onPress={() => handleChoice('more')}
                            title="more"
                          />
                        </Menu>
                      </View>
                      <Text
                        style={{
                          fontFamily: 'Poppins-Regular',
                          color: '#555555',
                          fontSize: 13,
                          alignSelf: 'center',
                        }}>
                        expensive item(s) in the cart
                      </Text>
                    </View>

                    {/* additonal options */}
                    <Text
                      style={{
                        marginLeft: 20,
                        fontFamily: 'Poppins-Regular',
                        color: '#555555',
                        fontSize: 13,
                        marginTop: 20,
                      }}>
                      - Additional options
                    </Text>

                    <TouchableOpacity
                      onPress={() => setSpecialPrice(!specialPrice)}>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          marginLeft: 30,
                        }}>
                        <Checkbox.Android
                          status={specialPrice ? 'checked' : 'unchecked'}
                          color={'green'} // Customize the checkbox color
                        />
                        <Text
                          style={{
                            color: '#21272E',
                            fontSize: 13,
                            fontFamily: 'Poppins-Light',
                          }}>
                          Apply to product with special price.
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            </RadioButton.Group>
          </View>
        )}

        {/* customer discount */}
        {selectedOption === 'Customer Discount' && (
          <View style={styles.radioContainer}>
            <RadioButton.Group
              onValueChange={value => setCustomerRadio(value)}
              value={customerRadio}>
              <View>
                <RadioButton.Item
                  label="Fixed amount discount for regular customers."
                  value="customerOption1"
                  color="#549666"
                  labelStyle={styles.labelStyle}
                  style={styles.radioButton}
                />

                {/* content occording to radio click */}
                {customerRadio === 'customerOption1' && (
                  <>
                    <View style={{flexDirection: 'row', marginBottom: 10}}>
                      <Text
                        style={{
                          marginLeft: 20,
                          fontFamily: 'Poppins-Regular',
                          color: '#555555',
                          fontSize: 13,
                          marginTop: 10,
                        }}>
                        - If the customer has placed at least
                      </Text>

                      <TextInput
                        style={{
                          height: 38,
                          width: 40,
                          marginHorizontal: 2,
                          marginTop: 5,
                          fontFamily: 'Poppins-Regular',
                          borderWidth: 1,
                          borderColor: '#555555',
                          borderRadius: 5,
                          fontSize: 12,
                        }}
                        placeholderTextColor={'#555555'}
                        keyboardType="numeric"
                      />

                      <Text
                        style={{
                          fontFamily: 'Poppins-Regular',
                          color: '#555555',
                          marginTop: 10,
                          fontSize: 13,
                          width: 60,
                        }}>
                        order(s) on store
                      </Text>
                    </View>

                    <View style={{flexDirection: 'row', marginBottom: 10}}>
                      <Text
                        style={{
                          marginLeft: 20,
                          fontFamily: 'Poppins-Regular',
                          color: '#555555',
                          fontSize: 13,
                          marginTop: 10,
                        }}>
                        - with order total at leastINR
                      </Text>

                      <TextInput
                        style={{
                          height: 38,
                          width: 40,
                          marginHorizontal: 2,
                          marginTop: 5,
                          fontFamily: 'Poppins-Regular',
                          borderWidth: 1,
                          borderColor: '#555555',
                          borderRadius: 5,
                          fontSize: 12,
                        }}
                        placeholderTextColor={'#555555'}
                        keyboardType="numeric"
                      />
                    </View>

                    <View style={{flexDirection: 'row', marginBottom: 10}}>
                      <Text
                        style={{
                          marginLeft: 20,
                          fontFamily: 'Poppins-Regular',
                          color: '#555555',
                          fontSize: 13,
                          marginTop: 10,
                        }}>
                        - then give themINR
                      </Text>

                      <TextInput
                        style={{
                          height: 38,
                          width: 40,
                          marginHorizontal: 2,
                          marginTop: 5,
                          fontFamily: 'Poppins-Regular',
                          borderWidth: 1,
                          borderColor: '#555555',
                          borderRadius: 5,
                          fontSize: 12,
                        }}
                        placeholderTextColor={'#555555'}
                        keyboardType="numeric"
                      />

                      <Text
                        style={{
                          fontFamily: 'Poppins-Regular',
                          color: '#555555',
                          marginTop: 10,
                          fontSize: 13,
                          width: 200,
                        }}>
                        off their total orders
                      </Text>
                    </View>
                  </>
                )}
              </View>

              {/* second radio option */}
              <View>
                <RadioButton.Item
                  label="Percentage discount for regular customers"
                  value="customerOption2"
                  color="#549666"
                  labelStyle={styles.labelStyle}
                  style={styles.radioButton}
                />
                {customerRadio === 'customerOption2' && (
                  <>
                    <View style={{flexDirection: 'row'}}>
                      <Text
                        style={{
                          marginLeft: 20,
                          fontFamily: 'Poppins-Regular',
                          color: '#555555',
                          fontSize: 13,
                          marginTop: 10,
                        }}>
                        - If the customer has placed at least
                      </Text>
                      <TextInput
                        style={{
                          height: 38,
                          width: 40,
                          marginHorizontal: 2,
                          marginTop: 5,
                          fontFamily: 'Poppins-Regular',
                          borderWidth: 1,
                          borderColor: '#555555',
                          borderRadius: 5,
                          fontSize: 12,
                        }}
                        placeholderTextColor={'#555555'}
                        keyboardType="numeric"
                      />
                      <Text
                        style={{
                          fontFamily: 'Poppins-Regular',
                          color: '#555555',
                          fontSize: 13,
                          alignSelf: 'center',
                          width: 60,
                        }}>
                        order(s) on store,
                      </Text>
                    </View>

                    <View style={{flexDirection: 'row', marginTop: 10}}>
                      <Text
                        style={{
                          marginLeft: 20,
                          fontFamily: 'Poppins-Regular',
                          color: '#555555',
                          fontSize: 13,
                          marginTop: 10,
                        }}>
                        - with order total at leastINR
                      </Text>
                      <TextInput
                        style={{
                          height: 38,
                          width: 40,
                          marginHorizontal: 5,
                          marginTop: 5,
                          fontFamily: 'Poppins-Regular',
                          borderWidth: 1,
                          borderColor: '#555555',
                          borderRadius: 5,
                          fontSize: 12,
                        }}
                        placeholderTextColor={'#555555'}
                        keyboardType="numeric"
                      />
                    </View>

                    <View style={{flexDirection: 'row'}}>
                      <Text
                        style={{
                          marginLeft: 20,
                          fontFamily: 'Poppins-Regular',
                          color: '#555555',
                          fontSize: 13,
                          marginTop: 10,
                        }}>
                        - then give them
                      </Text>
                      <TextInput
                        style={{
                          height: 38,
                          width: 40,
                          marginHorizontal: 2,
                          marginTop: 5,
                          fontFamily: 'Poppins-Regular',
                          borderWidth: 1,
                          borderColor: '#555555',
                          borderRadius: 5,
                          fontSize: 12,
                        }}
                        placeholderTextColor={'#555555'}
                        keyboardType="numeric"
                      />
                      <Text
                        style={{
                          fontFamily: 'Poppins-Regular',
                          color: '#555555',
                          fontSize: 13,
                          alignSelf: 'center',
                        }}>
                        % off their total orders
                      </Text>
                    </View>
                  </>
                )}
              </View>
            </RadioButton.Group>
          </View>
        )}

        <Divider style={{height: 1}} />
        <View style={{marginTop: 10}}>
          <Text
            style={{
              marginLeft: 12,
              fontFamily: 'Poppins-Regular',
              color: '#383838',
              fontSize: 20,
            }}>
            Settings :
          </Text>
        </View>

        <View style={{marginTop: 10}}>
          <Text
            style={{
              marginLeft: 12,
              fontFamily: 'Poppins-Bold',
              color: '#555555',
            }}>
            Promo Options
          </Text>
        </View>
        <FlatList
          data={PromoOptionsList}
          keyExtractor={item => item.id}
          renderItem={({item}) => (
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => handlePromoChecked(item.value)}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Checkbox
                  status={
                    selectPromoOptions.includes(item.value)
                      ? 'checked'
                      : 'unchecked'
                  }
                  color={'green'}
                />
                <Title
                  style={{
                    color: '#21272E',
                    fontSize: 13,
                    fontFamily: 'Poppins-Regular',
                  }}>
                  {item.value}
                </Title>

                {(item.id === 1 || item.id === 2) && (
                  <TextInput
                    style={{
                      height: 38,
                      width: 65,
                      marginHorizontal: 2,
                      marginTop: 5,
                      fontFamily: 'Poppins-Regular',
                      borderWidth: 1,
                      borderColor: '#555555',
                      borderRadius: 5,
                      fontSize: 12,
                    }}
                    onChangeText={val => setUnitPerUsed(val)}
                    value={unitPerUsed}
                    placeholderTextColor={'#555555'}
                    keyboardType="numeric"
                  />
                )}

                {item.id === 3 && (
                  <TextInput
                    style={{
                      height: 38,
                      width: 65,
                      marginHorizontal: 2,
                      marginTop: 5,
                      fontFamily: 'Poppins-Regular',
                      borderWidth: 1,
                      borderColor: '#555555',
                      borderRadius: 5,
                      fontSize: 12,
                    }}
                    onChangeText={val => setApplyCoupon(val)}
                    value={applyCoupon}
                    placeholderTextColor={'#555555'}
                  />
                )}
              </View>
              {(item.id === 1 || item.id === 2) && (
                <Title
                  style={{
                    color: '#21272E',
                    fontSize: 13,
                    fontFamily: 'Poppins-Regular',
                    marginLeft: 40,
                    marginTop: -20,
                  }}>
                  time(s)
                </Title>
              )}
            </TouchableOpacity>
          )}
        />

        <View style={{marginTop: 10}}>
          <Text
            style={{
              marginLeft: 12,
              fontFamily: 'Poppins-Bold',
              color: '#555555',
            }}>
            Customer Group
          </Text>
        </View>

        {/* customer groups */}
        <View>
          <RadioButton.Group
            onValueChange={value => setCustomerGroupRadio(value)}
            value={customerGroupRadio}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <RadioButton.Item label="" value="groupOption1" color="#549666" />
              <Text
                style={{
                  fontFamily: 'Poppins-Regular',
                  color: '#555555',
                  fontSize: 13,
                  marginLeft: -20,
                }}>
                All customers.
              </Text>
            </View>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: -15,
              }}>
              <RadioButton.Item label="" value="groupOption2" color="#549666" />
              <Text
                numberOfLines={2}
                style={{
                  fontFamily: 'Poppins-Regular',
                  color: '#555555',
                  fontSize: 13,
                  marginLeft: -20,
                  width: 300,
                }}>
                Only customers within the following customer groups.
              </Text>
            </View>

            {customerGroupRadio === 'groupOption2' && (
              <View>
                <FlatList
                  data={customerGroups}
                  keyExtractor={item => item.id}
                  renderItem={({item}) => (
                    <TouchableOpacity
                      activeOpacity={0.9}
                      onPress={() => handleGroups(item.value)}>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          marginLeft: 30,
                          backgroundColor: '#E6EAF0',
                          width: 300,
                        }}>
                        <Checkbox
                          status={
                            selectCustomerGroup.includes(item.value)
                              ? 'checked'
                              : 'unchecked'
                          }
                          color={'green'}
                        />
                        <Title
                          style={{
                            color: '#21272E',
                            fontSize: 13,
                            fontFamily: 'Poppins-Light',
                          }}>
                          {item.value}
                        </Title>
                      </View>
                    </TouchableOpacity>
                  )}
                />
              </View>
            )}
          </RadioButton.Group>
        </View>

        <View style={{marginTop: 10}}>
          <Text
            style={{
              marginLeft: 12,
              fontFamily: 'Poppins-Bold',
              color: '#555555',
            }}>
            Customer Profile
          </Text>
        </View>

        {/* customer profiles */}
        <View>
          <RadioButton.Group
            onValueChange={value => setCustomerProfileRadio(value)}
            value={customerProfileRadio}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <RadioButton.Item
                label=""
                value="profileOption1"
                color="#549666"
              />
              <Text
                style={{
                  fontFamily: 'Poppins-Regular',
                  color: '#555555',
                  fontSize: 13,
                  marginLeft: -20,
                }}>
                All customers.
              </Text>
            </View>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: -15,
              }}>
              <RadioButton.Item
                label=""
                value="profileOption2"
                color="#549666"
              />
              <Text
                numberOfLines={2}
                style={{
                  fontFamily: 'Poppins-Regular',
                  color: '#555555',
                  fontSize: 13,
                  marginLeft: -20,
                  width: 300,
                }}>
                Only apply to selected logged-in customers below.
              </Text>
            </View>

            {customerProfileRadio === 'profileOption2' && (
              <View>
                <View
                  style={{
                    height: 45,
                    width: 300,
                    marginLeft: 30,
                    marginTop: 5,
                    fontFamily: 'Poppins-Regular',
                    borderWidth: 1,
                    borderColor: '#B7B9C1',
                    fontSize: 12,
                    backgroundColor: '#E6EAF0',
                    paddingLeft: 10,
                    flexDirection: 'row',
                  }}>
                  <TextInput
                    onChangeText={val => searchCustomerName(val)}
                    value={customerSearchKey}
                    placeholderTextColor={'#555555'}
                    placeholder="Type customer name"
                    style={{width: 250}}
                  />

                  <View
                    style={{
                      marginLeft: 'auto',
                      flexDirection: 'row',
                      marginRight: 15,
                    }}>
                    <TouchableOpacity
                      style={{justifyContent: 'center', alignItems: 'center'}}
                      onPress={() => {
                        setSearchCustomer();
                        setSearchCustomerResults();
                      }}>
                      <Image
                        style={{
                          width: 20,
                          height: 20,
                          marginRight: 10,
                        }}
                        source={require('../../assets/close.png')}
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                {isProductSearched == true && (
                  <View>
                    {refreshing && (
                      <ActivityIndicator size="large" color="#51AF5E" />
                    )}
                    {emptySearchResults != true ? (
                      <View>
                        <FlatList
                          data={searchCustomerResults}
                          renderItem={searchCustomerList}
                        />
                      </View>
                    ) : (
                      <Text
                        style={{
                          textAlign: 'center',
                          justifyContent: 'center',
                        }}>
                        No Products Found
                      </Text>
                    )}
                  </View>
                )}

                <View
                  style={{
                    backgroundColor: '#e8e6e6',
                    marginHorizontal: 30,
                    padding: 10,
                    marginVertical: 20,
                  }}>
                  {selectedCustomer.map((customer, index) => (
                    <TouchableOpacity
                      key={index}
                      style={{flexDirection: 'row'}}
                      onPress={() => removeCustomerFromList(customer)}>
                      <Image source={require('../../assets/minus.png')} />
                      <Text style={{marginLeft: 8}}>{customer}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}
          </RadioButton.Group>
        </View>

        {/* date pickers */}
        <View style={{marginTop: 10}}>
          <Text
            style={{
              marginLeft: 12,
              fontFamily: 'Poppins-Bold',
              color: '#555555',
            }}>
            Date Duration
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            marginHorizontal: 10,
            marginTop: 10,
            justifyContent: 'space-between',
          }}>
          <DatePicker
            style={{width: 140}}
            date={startDate}
            mode="date"
            placeholder="Select date"
            format="YYYY-MM-DD"
            minDate={minSelectableDate}
            maxDate="2025-12-31"
            confirmBtnText="Confirm"
            cancelBtnText="Cancel"
            customStyles={{
              dateIcon: {
                position: 'absolute',
                left: 0,
                top: 4,
                marginLeft: 0,
              },
              dateInput: {
                marginLeft: 36,
              },
              // ...other custom styles
            }}
            onDateChange={handleStartDateChange}
          />

          <DatePicker
            style={{width: 140}}
            date={endDate}
            mode="date"
            placeholder="Select date"
            format="YYYY-MM-DD"
            minDate={startDate ? startDate : minSelectableDate}
            maxDate="2025-12-31"
            confirmBtnText="Confirm"
            cancelBtnText="Cancel"
            customStyles={{
              dateIcon: {
                position: 'absolute',
                left: 0,
                top: 4,
                marginLeft: 0,
              },
              dateInput: {
                marginLeft: 36,
              },
              // ...other custom styles
            }}
            onDateChange={handleEndDateChange}
          />

          <TouchableOpacity onPress={() => removeDates()}>
            <Image
              style={{height: 25, width: 25, marginRight: 10, marginTop: 5}}
              source={require('../../assets/redclose.png')}
            />
          </TouchableOpacity>
        </View>

        <View style={{marginTop: 10, flexDirection: 'row', marginTop: 20}}>
          <Text
            style={{
              marginLeft: 12,
              fontFamily: 'Poppins-Bold',
              color: '#555555',
              alignSelf: 'center',
            }}>
            Priority Order
          </Text>
          <TextInput
            style={{
              height: 45,
              width: 100,
              fontFamily: 'Poppins-Regular',
              borderWidth: 1,
              borderColor: '#B7B9C1',
              fontSize: 12,
              marginLeft: 20,
              color: '#000',
            }}
            onChangeText={val => textInputChange(val, 'priorityOrder')}
            value={priorityOrder}
            placeholder=""
            keyboardType="numeric"
            placeholderTextColor={'#555555'}
          />
        </View>

        {/* status dropdown */}
        <View style={{flexDirection: 'row', marginTop: 20}}>
          <Text
            style={{
              marginLeft: 12,
              fontFamily: 'Poppins-Bold',
              color: '#555555',
              alignSelf: 'center',
            }}>
            Status
          </Text>
          <View
            style={{
              height: 50,
              width: 100,
              borderWidth: 1,
              justifyContent: 'center',
              borderRadius: 5,
              marginTop: 5,
              marginLeft: 20,
            }}>
            <Menu
              visible={statusvisible}
              onDismiss={closeStatusMenu}
              anchor={
                <TouchableOpacity
                  style={{flexDirection: 'row'}}
                  onPress={openStatusMenu}>
                  <Text
                    style={{
                      alignSelf: 'center',
                      marginLeft: 10,
                      color: '#000',
                    }}>
                    {selectedStatus}
                  </Text>
                  <Image
                    style={{
                      height: 15,
                      width: 15,
                      marginLeft: 'auto',
                      marginRight: 4,
                      alignSelf: 'center',
                    }}
                    source={require('../../assets/images/downIcon.png')}
                  />
                </TouchableOpacity>
              }>
              <Menu.Item
                onPress={() => handleStatus('Enable')}
                title="Enable"
              />
              <Menu.Item
                onPress={() => handleStatus('Disable')}
                title="Disable"
              />
            </Menu>
          </View>
        </View>

        {/* design options */}
        <Divider style={{height: 1, marginTop: 10}} />
        <View style={{marginTop: 10}}>
          <Text
            style={{
              marginLeft: 12,
              fontFamily: 'Poppins-Regular',
              color: '#383838',
              fontSize: 20,
            }}>
            Design Options :
          </Text>
        </View>

        <View style={{flexDirection: 'row', marginTop: 20}}>
          <Text
            style={{
              marginLeft: 12,
              fontFamily: 'Poppins-Bold',
              color: '#555555',
              alignSelf: 'center',
            }}>
            Design Status
          </Text>
          <View
            style={{
              height: 50,
              width: 100,
              borderWidth: 1,
              justifyContent: 'center',
              borderRadius: 5,
              marginTop: 5,
              marginLeft: 20,
            }}>
            <Menu
              visible={designStatusvisible}
              onDismiss={closeDesignStatusMenu}
              anchor={
                <TouchableOpacity
                  style={{flexDirection: 'row'}}
                  onPress={openDesignStatusMenu}>
                  <Text
                    style={{
                      alignSelf: 'center',
                      marginLeft: 10,
                      color: 'black',
                    }}>
                    {selectedDesignStatus}
                  </Text>
                  <Image
                    style={{
                      height: 15,
                      width: 15,
                      marginLeft: 'auto',
                      marginRight: 4,
                      alignSelf: 'center',
                    }}
                    source={require('../../assets/images/downIcon.png')}
                  />
                </TouchableOpacity>
              }>
              <Menu.Item
                onPress={() => handleDesignStatus('Enable')}
                title="Enable"
              />
              <Menu.Item
                onPress={() => handleDesignStatus('Disable')}
                title="Disable"
              />
            </Menu>
          </View>
        </View>

        {/* module banner */}
        <View
          style={{alignItems: 'center', flexDirection: 'row', marginTop: 20}}>
          <Text
            style={{
              marginLeft: 12,
              fontFamily: 'Poppins-Bold',
              color: '#555555',
              alignSelf: 'center',
            }}>
            <Text style={{color: 'red'}}>*</Text> Module Banner
          </Text>

          <TouchableOpacity onPress={openImagePicker} style={{marginLeft: 20}}>
            {selectedImage ? (
              <View style={{flexDirection: 'row'}}>
                <Image
                  source={{uri: selectedImage}}
                  style={{width: 100, height: 100}}
                />
                <TouchableOpacity onPress={removeImage}>
                  <Image
                    source={require('../../assets/redclose.png')}
                    style={{width: 25, height: 25, marginLeft: 15}}
                  />
                </TouchableOpacity>
              </View>
            ) : (
              <View
                style={{
                  height: 40,
                  width: 140,
                  justifyContent: 'center',
                  borderRadius: 10,
                  backgroundColor: 'green',
                }}>
                <Text
                  style={{
                    color: '#FFF',
                    fontSize: 14,
                    fontFamily: 'Poppins-SemiBold',
                    alignSelf: 'center',
                  }}>
                  Upload Image
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* page header banner */}
        <View
          style={{alignItems: 'center', flexDirection: 'row', marginTop: 20}}>
          <Text
            style={{
              marginLeft: 12,
              fontFamily: 'Poppins-Bold',
              color: '#555555',
              alignSelf: 'center',
            }}>
            Page Header Banner
          </Text>

          <TouchableOpacity
            onPress={openHeaderBannerPicker}
            style={{marginLeft: 20}}>
            {headerBanner ? (
              <View style={{flexDirection: 'row'}}>
                <Image
                  source={{uri: headerBanner}}
                  style={{width: 100, height: 100}}
                />
                <TouchableOpacity onPress={removeHeaderBanner}>
                  <Image
                    source={require('../../assets/redclose.png')}
                    style={{width: 25, height: 25, marginLeft: 15}}
                  />
                </TouchableOpacity>
              </View>
            ) : (
              <View
                style={{
                  height: 40,
                  width: 140,
                  justifyContent: 'center',
                  borderRadius: 10,
                  backgroundColor: 'green',
                }}>
                <Text
                  style={{
                    color: '#FFF',
                    fontSize: 14,
                    fontFamily: 'Poppins-SemiBold',
                    alignSelf: 'center',
                  }}>
                  Upload Image
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>

      <TouchableOpacity
        style={{
          width: '94%',
          height: 45,
          paddingTop: 11,
          paddingBottom: 15,
          backgroundColor: 'green',
          alignSelf: 'center',
          borderRadius: 10,
        }}
        onPress={() => addPromotion()}>
        <Text
          style={{
            color: '#fff',
            textAlign: 'center',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: 16,
            fontFamily: 'Poppins-SemiBold',
          }}>
          Save
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default CreatePromotion;

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
  image: {
    width: 70,
    height: 70,
    borderRadius: 50,
    resizeMode: 'stretch',
  },
  heading: {
    color: '#2B2520',
    fontFamily: 'Lato-Bold',
    fontSize: 16,
    alignItems: 'center',
    textAlign: 'center',
  },

  number: {
    color: '#84694D',
    fontFamily: 'Lato-Regular',
    fontSize: 15,
    marginTop: 5,
  },
  btnText: {
    color: 'white',
    fontSize: 15,
    fontFamily: 'Lato-Bold',
    marginTop: 5,
  },
  body: {
    marginHorizontal: 10,
    marginVertical: 20,
  },
  card: {
    backgroundColor: '#fff',
    elevation: 1,
    padding: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  order: {
    color: '#2B2520',
    fontSize: 15,
    fontFamily: 'Lato-Bold',
    marginVertical: 10,
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
  },
  button: {
    marginHorizontal: 50,
    marginTop: 30,
    padding: 10,
    borderWidth: 1,
    borderColor: '#DDD6D1',
    borderRadius: 2,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#34A549',
  },
  logout: {
    color: '#A49A91',
    fontFamily: 'Lato-Bold',
    marginLeft: 10,
  },
  btn: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#34A549',
    marginRight: 30,
    marginLeft: 30,
    marginTop: 10,
    borderRadius: 5,
  },
  text: {
    fontSize: 18,
    textAlign: 'center',
  },
  instructions: {
    fontSize: 12,
    color: '#34A549',
    marginBottom: 5,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    textAlign: 'center',
  },
  radioContainer: {
    marginTop: 16,
  },
  textContainer: {
    marginTop: 16,
  },
  labelStyle: {
    color: '#595957',
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    marginLeft: 10,
  },
  radioButton: {
    flexDirection: 'row-reverse', // Reverse the direction of the row
    marginRight: 25,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  label: {
    marginLeft: 8,
    fontSize: 16, // Customize the label font size
  },
});
