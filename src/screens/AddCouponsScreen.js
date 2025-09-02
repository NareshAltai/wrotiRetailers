import React, {useState, useEffect} from 'react';
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
  // CheckBox,
  ActivityIndicator,
} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import {useTheme} from '@react-navigation/native';
import {Divider, Menu} from 'react-native-paper';
import DatePicker from 'react-native-date-picker';
import {RadioButton} from 'react-native-paper';
import DeveloperAPIClient from '../state/middlewares/DeveloperAPIClient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {decode} from 'html-entities';
import Toast from 'react-native-simple-toast';
import moment from 'moment';

const AddCouponsScreen = ({navigation, route}) => {
  const theme = useTheme();
  const {colors} = useTheme();
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [customerLoginCode, setCustomerLoginCode] = React.useState();
  const [freeShippingCode, setFreeShippingCode] = React.useState();
  const [statusCode, setStatusCode] = React.useState();
  const [couponName, setCouponName] = React.useState();
  const [couponCode, setCouponCode] = React.useState();
  const [discount, setDiscount] = React.useState();
  const [totalAmount, setTotalAmount] = React.useState();
  const [usesPerCoupon, setUsesPerCoupon] = React.useState();
  const [usesPerCustomer, setUsesPerCustomer] = React.useState();
  const [percentageCode, setPercentageCode] = React.useState();
  const [productSearchKey, setProductSearchkey] = React.useState();
  const [searchresults, setsearchresults] = React.useState();
  const [isProductSearch, setIsProductSearch] = React.useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedCategoryNames, setSelectedCategoryNames] = useState([]);
  const [selectedItemsNames, setSelectedItemsNames] = useState([]);
  const [visibleCats, setVisibleCats] = React.useState(false);
  const [cats, setCats] = React.useState(-1);
  const [cattype, setcattype] = React.useState();
  const [isEdited, setIsEdited] = React.useState(false);
  const [screenName, setScreenName] = React.useState('');
  const [maxCouponCap, setMaxCouponCap] = React.useState();
  const [coupon_Id, setCoupon_Id] = React.useState();
  const [emptySearchResults, setEmptySearchResults] = React.useState(false);
  const [description, setDescription] = React.useState();
  const [loader, setIsLoader] = React.useState(false);
  const [updateLoader, setUpdateLoader] = React.useState(false);
  const [openStartDate, setOpenStartDate] = useState(false);
  const [openEndDate, setOpenEndDate] = useState(false);

  const isCustomerLogin = [
    {id: '1', name: 'Yes'},
    {id: '0', name: 'No'},
  ];

  const percentageList = [
    {id: '1', name: 'Percentage'},
    {id: '0', name: 'Fixed Amount'},
  ];

  const status = [
    {id: '1', name: 'Enable'},
    {id: '0', name: 'Disable'},
  ];

  const onChangeMaxCouponCap = async val => {
    const numericValue = val.replace(/[^0-9]/g, '');
    if (numericValue.split('.').length <= 2) {
      setMaxCouponCap(numericValue);
    }
  };

  const onChangeDiscount = val => {
    if (percentageCode == 'Percentage') {
      const numericValue = val.replace(/[^0-9.]/g, '');
      if (numericValue.split('.').length <= 2) {
        const parsedValue = parseFloat(numericValue);
        if (parsedValue <= 100) {
          setDiscount(numericValue);
        } else {
          Toast.showWithGravity(
            'Discount value cannot be more than 100.',
            Toast.LONG,
            Toast.BOTTOM,
          );
          setDiscount('');
        }
      }
    } else if (percentageCode == 'Fixed Amount') {
      const numericValue = val.replace(/[^0-9.]/g, '');
      if (numericValue.split('.').length <= 2) {
        setDiscount(numericValue);
      }
    }
  };

  const onChangeTotal = val => {
    const numericValue = val.replace(/[^0-9.]/g, '');
    if (numericValue.split('.').length <= 2) {
      setTotalAmount(numericValue);
    }
  };

  const onChangeUsesPerCoupon = async val => {
    const numericValue = val.replace(/[^0-9]/g, '');
    if (numericValue.split('.').length <= 2) {
      setUsesPerCoupon(numericValue);
    }
  };

  const onChangeUsesPerCustomer = async val => {
    const numericValue = val.replace(/[^0-9]/g, '');
    if (numericValue.split('.').length <= 2) {
      setUsesPerCustomer(numericValue);
    }
  };

  const loadcats = async () => {
    const api = new DeveloperAPIClient();
    let Token = await AsyncStorage.getItem('token');
    let UserMobile = await AsyncStorage.getItem('MobileNumber');
    let allcatsdata = await api.getcats(UserMobile, Token);
    setcattype(allcatsdata.data.category_info);
  };

  const loadCouponById = async () => {
    setIsLoader(true);
    setCoupon_Id(route.params?.couponObject?.coupon_id || '');
    const api = new DeveloperAPIClient();
    let Token = await AsyncStorage.getItem('token');
    let UserMobile = await AsyncStorage.getItem('MobileNumber');
    let coupon_Id = route.params.couponObject.coupon_id;
    let allcoupondata = await api.getCouponById(UserMobile, Token, coupon_Id);
    console.log('helooooo', allcoupondata.data);
    if (allcoupondata && allcoupondata != undefined) {
      setScreenName('Edit Coupon');
      setCouponName(allcoupondata.data.results.name);
      // setDescription(allcoupondata.data.results.description)
      setMaxCouponCap(allcoupondata.data.results.coupon_cap);
      setCouponCode(allcoupondata.data.results.code);
      if (allcoupondata.data.results.type == 'P') {
        setPercentageCode('Percentage');
      } else setPercentageCode('Fixed Amount');
      setDiscount(allcoupondata.data.results.discount);
      setTotalAmount(allcoupondata.data.results.total);
      if (allcoupondata?.data?.results?.logged == '1') {
        setCustomerLoginCode('Yes');
      } else setCustomerLoginCode('No');
      if (allcoupondata?.data?.results?.logged == '1') {
        setFreeShippingCode('Yes');
      } else setFreeShippingCode('No');
      setStartDate(
        allcoupondata.data.results.date_start
          ? new Date(allcoupondata.data.results.date_start)
          : new Date(),
      );
      setEndDate(
        allcoupondata.data.results.date_end
          ? new Date(allcoupondata.data.results.date_end)
          : new Date(),
      );
      setUsesPerCoupon(allcoupondata.data.results.uses_total);
      setUsesPerCustomer(allcoupondata.data.results.uses_customer);
      if (allcoupondata.data.results.status == '1') {
        setStatusCode('Enable');
      } else setStatusCode('Disable');

      if (
        (allcoupondata.data.results.products &&
          allcoupondata.data.results.products.length != 0) ||
        allcoupondata.data.results.products != undefined
      ) {
        setSelectedItemsNames(allcoupondata.data.results.products);
      }
      if (
        (allcoupondata.data.results.products &&
          allcoupondata.data.results.products.length != 0) ||
        allcoupondata.data.results.products != undefined
      ) {
        let items = [];
        for (let i = 0; i <= allcoupondata.data.results.products.length; i++) {
          let productsData = allcoupondata.data.results.products[i];
          if (
            productsData &&
            productsData != undefined &&
            productsData.id != undefined
          ) {
            let productid = productsData.id;
            items.push(productid);
          }
        }
        let finalSelectedItems = items;
        setSelectedItems(finalSelectedItems);
      }
      if (
        allcoupondata.data.results.categories &&
        allcoupondata.data.results.categories.length != 0 &&
        allcoupondata.data.results.categories != undefined
      ) {
        let items = [];
        for (
          let i = 0;
          i <= allcoupondata.data.results.categories.length;
          i++
        ) {
          let categoryData = allcoupondata.data.results.categories[i];
          if (
            categoryData &&
            categoryData != undefined &&
            categoryData.category_id != undefined
          ) {
            let categoryID = categoryData.category_id;
            items.push(categoryID);
          }
        }
        let finalSelectedItems = items;
        setSelectedCategories(finalSelectedItems);
      }
      if (
        allcoupondata.data.results.categories &&
        allcoupondata.data.results.categories.length != 0 &&
        allcoupondata.data.results.categories != undefined
      ) {
        setSelectedCategoryNames(allcoupondata.data.results.categories);
      }
    }
    setIsLoader(false);
  };

  const updatecat = async val => {
    setVisibleCats(false);
    setCats(val);
  };

  const onRemoveCategory = async val => {
    for (let i = 0; i <= selectedCategories.length; i++) {
      if (selectedCategories[i] == val.category_id) {
        const index = selectedCategories.indexOf(val.category_id);
        if (index > -1) {
          // only splice array when item is found
          selectedCategories.splice(index, 1); // 2nd parameter means remove one item only
        }
        setSelectedCategories(selectedCategories);
      }
    }

    let localSelectedCategories = selectedCategoryNames.filter(function (item) {
      return item.name != val.name;
    });
    setSelectedCategoryNames([]);
    setSelectedCategoryNames(localSelectedCategories);
  };

  const onRemoveProduct = async val => {
    let localSelectedProducts = selectedItemsNames.filter(function (item) {
      return item.name != val.name;
    });
    setSelectedItemsNames([]);
    setSelectedItemsNames(localSelectedProducts);

    for (let i = 0; i <= selectedItems.length; i++) {
      if (selectedItems[i] == val.id) {
        const index = selectedItems.indexOf(val.id);
        if (index > -1) {
          // only splice array when item is found
          selectedItems.splice(index, 1); // 2nd parameter means remove one item only
        }
        setSelectedItems(selectedItems);
      }
    }
  };

  const onSelectedRemoveCategories = item => {
    let items = [...selectedCategories];
    let itemsNames = [...selectedCategoryNames];
    if (items.includes(item.category_id)) {
      const index = items.indexOf(item.category_id);
      if (index > -1) {
        items.splice(index, 1);
      }
    } else {
      items.push(item.category_id);
    }

    if (itemsNames.length > 0) {
      let count = itemsNames.length;
      for (let i = 0; i < count; i++) {
        if (
          itemsNames[i] != undefined &&
          itemsNames[i].category_id == item.category_id
        ) {
          itemsNames.splice(i, 1);
        }
      }
    }
    setSelectedCategories(items);
    setSelectedCategoryNames(itemsNames);
  };

  const onSelectedCategories = item => {
    let items = [...selectedCategories];
    let itemsNames = [...selectedCategoryNames];

    if (items.includes(item.category_id)) {
      const index = items.indexOf(item.category_id);
      if (index > -1) {
        items.splice(index, 1);
      }
    } else {
      items.push(item.category_id);
    }
    itemsNames.push(item);
    setSelectedCategories(items);
    setSelectedCategoryNames(itemsNames);
  };

  const loadAddCouponPage = () => {
    if (route.params === undefined) {
      setPercentageCode('Percentage');
      setCustomerLoginCode('No');
      setFreeShippingCode('No');
      setStatusCode('Enable');
    }
  };

  const onSelectedRemoveItemsChange = item => {
    let items = [...selectedItems];
    let itemsNames = [...selectedItemsNames];

    if (items.includes(item.id)) {
      const index = items.indexOf(item.id);
      if (index > -1) {
        items.splice(index, 1);
      }
    } else {
      items.push(item.id);
    }

    if (itemsNames.length > 0) {
      let count = itemsNames.length;
      for (let i = 0; i < count; i++) {
        if (itemsNames[i] != undefined && itemsNames[i].id == item.id) {
          itemsNames.splice(i, 1);
        }
      }
    }
    setSelectedItems(items);
    setSelectedItemsNames(itemsNames);
  };

  const onSelectedItemsChange = item => {
    let items = [...selectedItems];
    let itemsNames = [...selectedItemsNames];

    if (items.includes(item.id)) {
      const index = items.indexOf(item.id);
      if (index > -1) {
        items.splice(index, 1);
      }
    } else {
      items.push(item.id);
    }
    itemsNames.push(item);
    setSelectedItems(items);
    setSelectedItemsNames(itemsNames);
  };

  useEffect(() => {
    setTimeout(async () => {
      if (route != undefined && route.params?.couponObject?.isEdited == true) {
        setIsEdited(true);
      } else {
        setIsEdited(false);
        loadAddCouponPage();
      }
    });

    const unsubscribe = navigation.addListener('focus', () => {
      loadcats();
      loadCouponById(route);
      loadAddCouponPage();
    });
    return unsubscribe;
  }, [cats]);

  const AddCoupon = async () => {
    if (
      couponName == null ||
      couponName.trim() == '' ||
      couponName.length < 0
    ) {
      Toast.showWithGravity(
        'Coupon name cannot be empty.',
        Toast.LONG,
        Toast.BOTTOM,
      );
      return false;
    }
    if (
      description == null ||
      description.trim() == '' ||
      description.length < 0
    ) {
      Toast.showWithGravity(
        'Coupon description cannot be empty.',
        Toast.LONG,
        Toast.BOTTOM,
      );
      return false;
    }
    if (
      couponCode == null ||
      couponCode.trim() == '' ||
      couponCode.length <= 2
    ) {
      Toast.showWithGravity(
        'Coupon code cannot be empty.',
        Toast.LONG,
        Toast.BOTTOM,
      );
      return false;
    }

    if (discount == null || discount == 0) {
      Toast.showWithGravity(
        'Discount Value cannot be empty.',
        Toast.LONG,
        Toast.BOTTOM,
      );
      return false;
    }

    if (totalAmount == null || totalAmount == 0) {
      Toast.showWithGravity(
        'Cart Total cannot be empty.',
        Toast.LONG,
        Toast.BOTTOM,
      );
      return false;
    }
    const api = new DeveloperAPIClient();
    let Token = await AsyncStorage.getItem('token');
    let UserMobile = await AsyncStorage.getItem('MobileNumber');
    let category_id = cats.category_id;
    let CustomerLoginCode = '';
    if (customerLoginCode == 'Yes') {
      CustomerLoginCode = 1;
    } else {
      CustomerLoginCode = 0;
    }
    let FreeShippingCode = '';
    if (freeShippingCode == 'Yes') {
      FreeShippingCode = 1;
    } else {
      FreeShippingCode = 0;
    }
    let StatusCode = '';
    if (statusCode == 'Enable') {
      StatusCode = 1;
    } else {
      StatusCode = 0;
    }
    let PercentageCode = '';
    if (percentageCode == 'Percentage') {
      PercentageCode = 'P';
    }

    if (discount == null || discount == 0) {
      Toast.showWithGravity(
        'Discount Value cannot be empty.',
        Toast.LONG,
        Toast.BOTTOM,
      );
      return false;
    }

    // if (percentageCode == "Percentage") {
    //   if (maxCouponCap == null || maxCouponCap == 0) {
    //     Toast.showWithGravity(
    //       "Maximum Coupon Cap Value cannot be empty.",
    //       Toast.LONG,
    //       Toast.BOTTOM
    //     );
    //     return false;
    //   }
    // }

    if (totalAmount == null || totalAmount == 0) {
      Toast.showWithGravity(
        'Cart Total cannot be empty.',
        Toast.LONG,
        Toast.BOTTOM,
      );
      return false;
    }
    let coupon_cap = '';
    if (maxCouponCap != null || maxCouponCap != undefined) {
      coupon_cap = maxCouponCap;
    } else {
      coupon_cap = '';
    }

    if (usesPerCoupon == null || usesPerCoupon == 0) {
      Toast.showWithGravity(
        'Uses Per Coupon cannot be empty.',
        Toast.LONG,
        Toast.BOTTOM,
      );
      return false;
    }
    if (usesPerCustomer == null || usesPerCustomer == 0) {
      Toast.showWithGravity(
        'Uses Per Customer cannot be empty.',
        Toast.LONG,
        Toast.BOTTOM,
      );
      return false;
    }
    let AddCouponData = await api.getAddCoupon(
      UserMobile,
      Token,
      couponName.trim(),
      couponCode.trim(),
      PercentageCode,
      discount,
      totalAmount,
      CustomerLoginCode,
      FreeShippingCode,
      selectedItems,
      selectedCategories,
      startDate,
      endDate,
      usesPerCoupon,
      usesPerCustomer,
      StatusCode,
      coupon_cap,
      description,
    );
    if (AddCouponData.data.success && AddCouponData.data.success == true) {
      Toast.showWithGravity(
        'Coupon Created successfully.',
        Toast.LONG,
        Toast.BOTTOM,
      );
      navigation.navigate('CouponsScreen');
    } else {
      Toast.showWithGravity(
        AddCouponData.data.message,
        Toast.LONG,
        Toast.BOTTOM,
      );
    }
  };

  const editCoupon = async () => {
    if (
      couponName == null ||
      couponName == '' ||
      couponName.trim() == '' ||
      couponName.length < 0
    ) {
      Toast.showWithGravity(
        'Coupon name cannot be empty.',
        Toast.LONG,
        Toast.BOTTOM,
      );
      return false;
    }

    if (
      couponCode == null ||
      couponCode == '' ||
      couponCode.trim() == '' ||
      couponCode.length <= 2
    ) {
      Toast.showWithGravity(
        'Coupon code cannot be empty.',
        Toast.LONG,
        Toast.BOTTOM,
      );
      return false;
    }
    if (discount == null || discount == 0) {
      Toast.showWithGravity(
        'Discount Value cannot be empty.',
        Toast.LONG,
        Toast.BOTTOM,
      );
      return false;
    }

    // if (percentageCode == "Percentage") {
    //   if (maxCouponCap == null || maxCouponCap == 0) {
    //     Toast.showWithGravity(
    //       "Maximum Coupon Cap Value cannot be empty.",
    //       Toast.LONG,
    //       Toast.BOTTOM
    //     );
    //     return false;
    //   }
    // }

    if (totalAmount == null || totalAmount == 0) {
      Toast.showWithGravity(
        'Cart Total cannot be empty.',
        Toast.LONG,
        Toast.BOTTOM,
      );
      return false;
    }
    let coupon_cap = '';
    if (maxCouponCap != null || maxCouponCap != undefined) {
      coupon_cap = maxCouponCap;
    } else {
      coupon_cap = '';
    }
    if (usesPerCoupon == null || usesPerCoupon == 0) {
      Toast.showWithGravity(
        'Uses Per Coupon cannot be empty.',
        Toast.LONG,
        Toast.BOTTOM,
      );
      return false;
    }
    if (usesPerCustomer == null || usesPerCustomer == 0) {
      Toast.showWithGravity(
        'Uses Per Customer cannot be empty.',
        Toast.LONG,
        Toast.BOTTOM,
      );
      return false;
    }
    setUpdateLoader(true);
    const api = new DeveloperAPIClient();
    let Token = await AsyncStorage.getItem('token');
    let UserMobile = await AsyncStorage.getItem('MobileNumber');
    let CustomerLoginCode = '';
    if (customerLoginCode == 'Yes') {
      CustomerLoginCode = 1;
    } else {
      CustomerLoginCode = 0;
    }
    let FreeShippingCode = '';
    if (freeShippingCode == 'Yes') {
      FreeShippingCode = 1;
    } else {
      FreeShippingCode = 0;
    }
    let StatusCode = '';
    if (statusCode == 'Enable') {
      StatusCode = 1;
    } else {
      StatusCode = 0;
    }
    let PercentageCode = '';
    if (percentageCode == 'Percentage') {
      PercentageCode = 'P';
    } else {
      PercentageCode = 'F';
    }
    let AddCouponData = await api.getEditCoupon(
      UserMobile,
      Token,
      coupon_Id,
      couponName.trim(),
      couponCode.trim(),
      PercentageCode,
      discount,
      totalAmount,
      CustomerLoginCode,
      FreeShippingCode,
      selectedItems,
      selectedCategories,
      startDate,
      endDate,
      usesPerCoupon,
      usesPerCustomer,
      StatusCode,
      coupon_cap,
      description,
    );
    if (AddCouponData.data.success == true) {
      Toast.showWithGravity(
        'Coupon Updated successfully.',
        Toast.LONG,
        Toast.BOTTOM,
      );
      navigation.navigate('CouponsScreen');
      setUpdateLoader(false);
    } else {
      Toast.showWithGravity(
        AddCouponData.data.message,
        Toast.LONG,
        Toast.BOTTOM,
      );
    }
  };

  const getSearchResultsofProducts = async val => {
    setIsLoader(true);
    const api = new DeveloperAPIClient();
    let UserMobile = await AsyncStorage.getItem('MobileNumber');
    let Token = await AsyncStorage.getItem('token');
    let limit = 30;
    let offset = 1;
    let allsearchdata = await api.searchProduct(
      UserMobile,
      val,
      Token,
      limit,
      offset,
    );
    // console.log("------search",allsearchdata.data)
    setsearchresults(allsearchdata.data.products);
    setIsLoader(false);
  };

  const onSearchProduct = async val => {
    setProductSearchkey(val);
    if (val == '' || val.length <= 0) {
      setIsProductSearch(false);
      setProductSearchkey();
      setsearchresults([]);
      return false;
    } else {
      setIsProductSearch(true);
      getSearchResultsofProducts(
        productSearchKey == undefined ? val : productSearchKey,
      );
    }
  };

  const render = ({item, index}) => (
    <View style={{flexDirection: 'row'}}>
      <TouchableOpacity
        onPress={() =>
          selectedItems.includes(item.id)
            ? onSelectedRemoveItemsChange(item)
            : onSelectedItemsChange(item)
        }
        style={{flexDirection: 'column', margin: 5}}>
        <Text
          style={{
            fontSize: 16,
            fontFamily: 'Poppins-Medium',
            marginLeft: '5%',
            justifyContent: 'space-between',
          }}>
          {item.name ? item.name : 'No Name'}
        </Text>
      </TouchableOpacity>
      <View style={{marginLeft: 'auto', marginTop: 2}}>
        {/* <CheckBox
          value={selectedItems.includes(item.id) ? true : false}
          onValueChange={() =>
            selectedItems.includes(item.id)
              ? onSelectedRemoveItemsChange(item)
              : onSelectedItemsChange(item)
          }
          style={styles.checkbox}
        /> */}
        <CheckBox
          value={selectedItems.includes(val.category_id)}
          onValueChange={newValue => {
            if (newValue) {
              onSelectedRemoveItemsChange(val);
            } else {
              onSelectedItemsChange(val);
            }
          }}
          style={{marginTop: '4%'}}
        />
      </View>
    </View>
  );

  const renderItem = ({item, index}) => (
    <View
      style={{
        borderRadius: 15,
        borderWidth: 1,
        borderColor: '#808080',
        width: '45%',
        flexDirection: 'row',
        padding: 2,
        marginBottom: 5,
      }}>
      <Text style={{padding: 2, flex: 2.5, color: '#808080'}} numberOfLines={1}>
        {item.name}
      </Text>
      <View style={{flex: 1, flexDirection: 'row'}}>
        <View style={{alignItems: 'flex-end', flex: 1}}>
          <TouchableOpacity onPress={() => onRemoveProduct(item)}>
            <Image
              style={{
                width: 25,
                height: 25,
                resizeMode: 'center',
              }}
              source={require('../assets/close2x.png')}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderItemCategories = ({item, index}) => (
    <View
      style={{
        borderRadius: 15,
        borderWidth: 1,
        borderColor: '#808080',
        width: '45%',
        flexDirection: 'row',
        padding: 2,
        marginBottom: 5,
      }}>
      <Text style={{padding: 2, flex: 2.5, color: '#808080'}} numberOfLines={1}>
        {item.name}
      </Text>
      <View style={{flex: 1, flexDirection: 'row'}}>
        <View style={{alignItems: 'flex-end', flex: 1}}>
          <TouchableOpacity onPress={() => onRemoveCategory(item)}>
            <Image
              style={{
                width: 25,
                height: 25,
                resizeMode: 'center',
              }}
              source={require('../assets/close2x.png')}
            />
          </TouchableOpacity>
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
      <View
        style={{
          flexDirection: 'row',
          marginHorizontal: 5,
          marginVertical: 10,
          marginTop: 25,
        }}>
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() => navigation.goBack()}>
          <Image
            style={{width: 28, height: 28, resizeMode: 'center'}}
            source={require('../assets/back3x.png')}
          />
        </TouchableOpacity>

        {isEdited == true ? (
          <View style={{marginLeft: 1}}>
            <Text
              style={{
                color: '#2B2520',
                fontFamily: 'Poppins-Medium',
                fontSize: 20,
              }}>
              Edit Coupon{' '}
            </Text>
          </View>
        ) : (
          <View style={{marginLeft: 1}}>
            <Text
              style={{
                color: '#2B2520',
                fontFamily: 'Poppins-Medium',
                fontSize: 20,
              }}>
              Add Coupon{' '}
            </Text>
          </View>
        )}
      </View>
      <Divider />

      {isEdited && loader && <ActivityIndicator size="large" color="green" />}

      <ScrollView>
        <View style={{marginTop: 10}}>
          <Text
            style={{
              marginLeft: 12,
              fontFamily: 'Poppins-Medium',
              color: '#000',
            }}>
            Coupon Name
          </Text>
        </View>
        <TextInput
          style={styles.commonInput}
          onChangeText={val => setCouponName(val)}
          value={couponName}
          maxLength={20}
          placeholder="Please enter coupon name"
          placeholderTextColor={'grey'}
        />
        <View style={{marginTop: 10}}>
          <Text
            style={{
              marginLeft: 12,
              fontFamily: 'Poppins-Medium',
              color: '#000',
            }}>
            Coupon Description
          </Text>
        </View>
        <TextInput
          style={styles.commonInput}
          onChangeText={val => setDescription(val)}
          value={description}
          maxLength={50}
          placeholder="Please enter coupon description"
          placeholderTextColor={'grey'}
        />
        <View style={{marginTop: 10}}>
          <Text
            style={{
              marginLeft: 12,
              fontFamily: 'Poppins-Medium',
              color: '#000',
            }}>
            Code
          </Text>
        </View>
        <TextInput
          style={styles.commonInput}
          onChangeText={val => setCouponCode(val)}
          value={couponCode}
          placeholder="Please enter coupon code"
          maxLength={20}
          editable={!isEdited}
          placeholderTextColor={'grey'}
        />
        <View style={{marginTop: 10}}>
          <Text style={{marginLeft: 12, fontFamily: 'Poppins-Medium'}}>
            Type
          </Text>
        </View>
        <View style={{flexDirection: 'row'}}>
          <FlatList
            data={percentageList}
            numColumns={1}
            scrollEnabled={false}
            renderItem={({item, index}) => (
              <TouchableOpacity onPress={() => setPercentageCode(item.name)}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <RadioButton.Android
                    onPress={() => setPercentageCode(item.name)}
                    uncheckedColor="#2ea048"
                    status={
                      item.name === percentageCode ? 'checked' : 'unchecked'
                    }
                  />
                  <Text style={{color: '#000'}}>{item.name}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
        {percentageCode == 'Percentage' && (
          <View>
            <View style={{marginTop: 10}}>
              <Text
                style={{
                  marginLeft: 12,
                  fontFamily: 'Poppins-Medium',
                  color: '#000',
                }}>
                Maximum Discount
              </Text>
            </View>
            <TextInput
              style={styles.commonInput}
              onChangeText={val => onChangeMaxCouponCap(val)}
              value={maxCouponCap}
              placeholder="Please enter maximum value"
              keyboardType="numeric"
              placeholderTextColor={'grey'}
            />
          </View>
        )}

        <View style={{marginTop: 10}}>
          <Text
            style={{
              marginLeft: 12,
              fontFamily: 'Poppins-Medium',
              color: '#000',
            }}>
            Discount
          </Text>
        </View>
        <TextInput
          style={styles.commonInput}
          onChangeText={val => onChangeDiscount(val)}
          value={discount}
          placeholder="Please enter discount"
          keyboardType="numeric"
          placeholderTextColor={'grey'}
        />
        <View style={{marginTop: 10}}>
          <Text
            style={{
              marginLeft: 12,
              fontFamily: 'Poppins-Medium',
              color: '#000',
            }}>
            Cart Total
          </Text>
        </View>
        <TextInput
          style={styles.commonInput}
          onChangeText={val => onChangeTotal(val)}
          value={totalAmount}
          placeholder="Please enter cart total"
          keyboardType="numeric"
          placeholderTextColor={'grey'}
        />
        <View style={{marginTop: 10}}>
          <Text style={{marginLeft: 12, fontFamily: 'Poppins-Medium'}}>
            Free Shipping
          </Text>
          <View style={{flexDirection: 'row'}}>
            <FlatList
              data={isCustomerLogin}
              numColumns={1}
              scrollEnabled={false}
              renderItem={({item, index}) => (
                <TouchableOpacity
                  onPress={() => setFreeShippingCode(item.name)}>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <RadioButton.Android
                      onPress={() => setFreeShippingCode(item.name)}
                      uncheckedColor="#2ea048"
                      status={
                        item.name === freeShippingCode ? 'checked' : 'unchecked'
                      }
                    />
                    <Text style={{color: '#000'}}>{item.name}</Text>
                  </View>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
        <View style={{marginTop: 10}}>
          <Text
            style={{
              marginLeft: 12,
              fontFamily: 'Poppins-Medium',
              color: '#000',
            }}>
            Products
          </Text>
        </View>

        <View
          style={{
            backgroundColor: '#F7F7FC',
            marginBottom: 10,
            flexDirection: 'row',
            width: '95%',
            alignSelf: 'center',
          }}>
          <TextInput
            style={{width: '90%', paddingLeft: 10, color: '#000'}}
            onChangeText={val => onSearchProduct(val)}
            value={productSearchKey}
            placeholder="Search for Products"
            placeholderTextColor={'grey'}
          />

          <TouchableOpacity
            onPress={() => {
              setProductSearchkey(),
                setsearchresults(),
                setIsProductSearch(false);
            }}>
            <Image
              style={{
                width: 10,
                height: 10,
                marginTop: 20,
                marginLeft: 10,
              }}
              source={require('../assets/close2x.png')}
            />
          </TouchableOpacity>
        </View>

        {isProductSearch == true && (
          <View>
            <View style={{marginBottom: 20}}>
              {loader ? (
                <ActivityIndicator size="small" color="#337D3E" />
              ) : (
                <FlatList
                  nestedScrollEnabled={true}
                  data={searchresults}
                  numColumns={1}
                  scrollEnabled={true}
                  renderItem={render}
                />
              )}
            </View>
          </View>
        )}

        {selectedItemsNames && selectedItemsNames?.length > 0 && (
          <View>
            <Text style={{marginLeft: 12, fontFamily: 'Poppins-Medium'}}>
              Selected Products
            </Text>
            <View style={{}}>
              <FlatList
                nestedScrollEnabled={true}
                data={selectedItemsNames}
                numColumns={1}
                scrollEnabled={true}
                renderItem={renderItem}
              />
            </View>
          </View>
        )}

        <View style={{marginTop: 10}}>
          <Text style={{marginLeft: 12, fontFamily: 'Poppins-Medium'}}>
            Category
          </Text>
        </View>
        <View
          style={{
            height: 40,
            width: '93.5%',
            padding: 10,
            backgroundColor: '#F7F7FC',
            marginLeft: 10,
          }}>
          <Menu
            visible={visibleCats}
            onDismiss={() => setVisibleCats(!visibleCats)}
            anchor={
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginHorizontal: 10,
                }}
                activeOpacity={0.7}
                onPress={() => setVisibleCats(!visibleCats)}>
                <Text
                  numberOfLines={1}
                  style={{fontFamily: 'Poppins-Medium', color: '#000'}}>
                  Please select category
                </Text>
                <View>
                  <Image
                    style={{height: 20, width: 15}}
                    source={require('../assets/ddarrow.png')}
                  />
                </View>
              </TouchableOpacity>
            }>
            {cattype &&
              cattype.map((val, i) => {
                return (
                  <View style={{flexDirection: 'row'}}>
                    {/* <CheckBox
                      value={
                        selectedCategories.includes(val.category_id)
                          ? true
                          : false
                      }
                      onValueChange={() =>
                        selectedCategories.includes(val.category_id)
                          ? onSelectedRemoveCategories(val)
                          : onSelectedCategories(val)
                      }
                      style={{marginTop: '4%'}}
                    /> */}
                    <CheckBox
                      value={selectedCategories.includes(val.category_id)}
                      onValueChange={newValue => {
                        if (newValue) {
                          onSelectedCategories(val);
                        } else {
                          onSelectedRemoveCategories(val);
                        }
                      }}
                      style={{marginTop: '4%'}}
                    />
                    <Menu.Item
                      key={i}
                      title={decode(val.name)}
                      onPress={() => updatecat(val)}
                      titleStyle={{color: '#000'}} // ✅ text color here
                    />
                  </View>
                );
              })}
          </Menu>
        </View>
        {selectedCategoryNames.length != 0 ? (
          <View>
            <Text
              style={{
                marginLeft: 12,
                marginTop: 5,
                fontFamily: 'Poppins-Medium',
              }}>
              Selected Categories
            </Text>
            <View style={{}}>
              <FlatList
                data={selectedCategoryNames}
                numColumns={1}
                scrollEnabled={true}
                renderItem={renderItemCategories}
              />
            </View>
          </View>
        ) : (
          <></>
        )}
        {/* <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingRight: 15,
          }}>
          <View
            style={{marginTop: 10, flexDirection: 'row', alignItems: 'center'}}>
            <Text
              style={{
                marginLeft: 12,
                fontFamily: 'Poppins-Medium',
                marginTop: '3%',
                color: '#000',
              }}>
              Start Date:
            </Text>

            <TouchableOpacity onPress={() => setOpenStartDate(true)}>
              <Image source={require('../assets/calendar.png')} />
            </TouchableOpacity>
            <DatePicker
              modal
              open={openStartDate}
              date={endDate}
              mode="date"
              minimumDate={moment().toDate()}
              onConfirm={val => {
                setOpenStartDate(false);
                setEndDate(val);
              }}
              onCancel={() => {
                setOpenStartDate(false);
              }}
            />
          </View>

          <View
            style={{marginTop: 30, flexDirection: 'row', alignItems: 'center'}}>
            <Text
              style={{
                marginLeft: 12,
                fontFamily: 'Poppins-Medium',
                marginTop: '3%',
                color: '#000',
              }}>
              End Date:
            </Text>
            <TouchableOpacity onPress={() => setOpenEndDate(true)}>
              <Image source={require('../assets/calendar.png')} />
            </TouchableOpacity>
            <DatePicker
              modal
              open={openEndDate}
              date={endDate}
              mode="date"
              minimumDate={moment().toDate()}
              onConfirm={val => {
                setOpenEndDate(false);
                setEndDate(val);
              }}
              onCancel={() => {
                setOpenEndDate(false);
              }}
            />
          </View>
        </View> */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingRight: 15,
          }}>
          {/* Start Date */}
          <View
            style={{marginTop: 10, flexDirection: 'row', alignItems: 'center'}}>
            <View>
              <Text
                style={{
                  marginLeft: 12,
                  fontFamily: 'Poppins-Medium',
                  marginTop: '3%',
                  color: '#000',
                }}>
                Start Date:
              </Text>

              {/* Show selected start date */}
              <Text
                style={{
                  marginLeft: 8,
                  fontFamily: 'Poppins-Regular',
                  color: '#333',
                }}>
                {startDate ? moment(startDate).format('DD-MMM-YYYY') : '--'}
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => setOpenStartDate(true)}
              style={{marginLeft: 8}}>
              <Image source={require('../assets/calendar.png')} />
            </TouchableOpacity>

            <DatePicker
              modal
              open={openStartDate}
              date={startDate || new Date()}
              mode="date"
              minimumDate={moment().toDate()}
              onConfirm={val => {
                setOpenStartDate(false);
                setStartDate(val);
              }}
              onCancel={() => {
                setOpenStartDate(false);
              }}
            />
          </View>

          {/* End Date */}
          <View
            style={{marginTop: 30, flexDirection: 'row', alignItems: 'center'}}>
            <View>
              <Text
                style={{
                  marginLeft: 12,
                  fontFamily: 'Poppins-Medium',
                  marginTop: '3%',
                  color: '#000',
                }}>
                End Date:
              </Text>

              {/* Show selected end date */}
              <Text
                style={{
                  marginLeft: 8,
                  fontFamily: 'Poppins-Regular',
                  color: '#333',
                }}>
                {endDate ? moment(endDate).format('DD-MMM-YYYY') : '--'}
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => setOpenEndDate(true)}
              style={{marginLeft: 8}}>
              <Image source={require('../assets/calendar.png')} />
            </TouchableOpacity>

            <DatePicker
              modal
              open={openEndDate}
              date={endDate || new Date()}
              mode="date"
              minimumDate={moment().toDate()}
              onConfirm={val => {
                setOpenEndDate(false);
                setEndDate(val);
              }}
              onCancel={() => {
                setOpenEndDate(false);
              }}
            />
          </View>
        </View>

        <View style={{marginTop: 10}}>
          <Text
            style={{
              marginLeft: 12,
              fontFamily: 'Poppins-Medium',
              color: '#000',
            }}>
            Uses Per Coupon
          </Text>
        </View>
        <TextInput
          style={styles.commonInput}
          onChangeText={val => onChangeUsesPerCoupon(val)}
          value={usesPerCoupon}
          placeholder="Please enter uses per coupon"
          keyboardType="numeric"
          maxLength={4}
          placeholderTextColor={'grey'}
        />
        <View style={{marginTop: 10}}>
          <Text
            style={{
              marginLeft: 12,
              fontFamily: 'Poppins-Medium',
              color: '#000',
            }}>
            Uses Per Customer
          </Text>
        </View>
        <TextInput
          style={styles.commonInput}
          onChangeText={val => onChangeUsesPerCustomer(val)}
          value={usesPerCustomer}
          maxLength={3}
          placeholder="Please enter uses per customer"
          keyboardType="numeric"
          placeholderTextColor={'grey'}
        />
        <View style={{marginTop: 10}}>
          <Text
            style={{
              marginLeft: 12,
              fontFamily: 'Poppins-Medium',
              color: '#000',
            }}>
            Status
          </Text>
        </View>
        <View style={{flexDirection: 'row', marginBottom: 60}}>
          <FlatList
            data={status}
            numColumns={1}
            scrollEnabled={false}
            renderItem={({item, index}) => (
              <TouchableOpacity onPress={() => setStatusCode(item.name)}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <RadioButton.Android
                    onPress={() => setStatusCode(item.name)}
                    uncheckedColor="#2ea048"
                    status={item.name === statusCode ? 'checked' : 'unchecked'}
                  />
                  <Text style={{color: '#000'}}>{item.name}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      </ScrollView>

      <View>
        {isEdited == true ? (
          <TouchableOpacity
            style={{
              marginTop: 10,
              width: '94%',
              height: 45,
              paddingTop: 11,
              paddingBottom: 15,
              backgroundColor: '#5EB169',
              marginBottom: '5%',
              marginLeft: 10,
            }}
            onPress={() => editCoupon()}>
            {updateLoader ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text
                style={{
                  color: '#fff',
                  textAlign: 'center',
                  justifyContent: 'center',
                  alignItems: 'center',
                  fontSize: 16,
                }}>
                Update
              </Text>
            )}
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={{
              marginTop: 10,
              width: '94%',
              height: 45,
              paddingTop: 11,
              paddingBottom: 15,
              backgroundColor: '#5EB169',
              marginBottom: '5%',
              marginLeft: 10,
            }}
            onPress={() => AddCoupon()}>
            <Text
              style={{
                color: '#fff',
                textAlign: 'center',
                justifyContent: 'center',
                alignItems: 'center',
                fontSize: 16,
              }}>
              Save
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default AddCouponsScreen;

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
  dropdown: {
    borderColor: '#e0dfdc',
    height: 50,
  },
  label: {
    marginBottom: 7,
    marginStart: 10,
  },
  placeholderStyles: {
    color: 'grey',
  },
  dropdownGender: {
    marginHorizontal: 10,
    marginBottom: 25,
  },
  dropdownCompany: {
    marginHorizontal: 10,
    marginBottom: 15,
  },
  datePickerStyle: {
    width: 200,
    marginLeft: '5%',
  },
  radioView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
    marginLeft: 5,
  },
  radioViewText: {
    fontSize: 16,
    fontWeight: '500',
  },
  checkbox: {
    marginTop: '7%',
  },
  commonInput: {
    height: 40,
    margin: 12,
    padding: 10,
    backgroundColor: '#F7F7FC',
    fontFamily: 'Poppins-Regular',
    color: '#000',
  },
});
