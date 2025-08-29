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
  ActivityIndicator,
  FlatList,
  Button,
  Modal,
  Switch,
} from 'react-native';
import {useTheme} from '@react-navigation/native';
import {Divider, Menu} from 'react-native-paper';
import DeveloperAPIClient from '../../state/middlewares/DeveloperAPIClient';
import ImageUpload from '../../components/ImageUpload';
import Toast from 'react-native-simple-toast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {decode} from 'html-entities';
import RBSheet from 'react-native-raw-bottom-sheet';
import CustomLoadingButton from '../../components/CustomLoadingButton';
// import AnimateLoadingButton from "react-native-animate-loading-button";
//import NetworkChecker from "react-native-network-checker";
// import { Switch } from "react-native-paper";
// import {Switch} from 'react-native-switch';
// import Modal from 'react-native-modal';
// import CheckBox from 'react-native-check-box';

const editProductScreen = ({navigation, route}) => {
  const {colors} = useTheme();
  const theme = useTheme();
  const [name, setname] = React.useState();
  const [productOptions, setProductOptions] = React.useState([]);
  const [price, setprice] = React.useState();
  const [data, setData] = useState([]);
  const [visibleOptions, setVisibleOptions] = React.useState(false);
  const [displayOptionsData, setDisplayOptionsData] = React.useState();
  const [description, setdescription] = React.useState();
  const [itemcode, setItemCode] = React.useState();
  const [path, setpath] = React.useState();
  const [product_id, setproduct_id] = React.useState();
  const [productStatus, setProductStatus] = React.useState();
  const [cattype, setcattype] = React.useState();
  const [visibleCats, setVisibleCats] = React.useState(false);
  const [cats, setCats] = React.useState(false);
  const [tabValue, setTabValue] = React.useState();
  const [productImage, setProductImage] = React.useState();
  const [refreshing, setRefreshing] = React.useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [languages, setlanguages] = React.useState();
  const [productObj, setproductObj] = React.useState();
  const [editObj, seteditObj] = React.useState();
  const [categoryName, setCategoryName] = React.useState();
  const [editCategoryObject, setEditCategoryObject] = React.useState();
  const [searchKey, setSearchKey] = React.useState();
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [specialPrice, setSpecialPrice] = useState('');
  const [selectedOptionType, setSelectedOptionType] = useState();
  const [optionsValueModalVisible, setOptionsValueModalVisible] =
    useState(false);
  const [selectedOptionValueName, setSelectedOptionValueName] = useState([]);
  const [selectedOptionValueId, setSelectedOptionValueId] = useState([]);
  const [optionsValueNamesModalVisible, setOptionsValueNamesModalVisible] =
    useState(false);
  const [optionValueNameIndex, setOptionsValueNameIndex] = useState();
  const [selectedOptionNameIndex, setSelectedOptionNameIndex] =
    React.useState();
  const [optionValueData, setOptionValueData] = React.useState();
  const [pricePreFixValue, setPricePrefixValue] = React.useState(false);
  const [weightPreFixValue, setWeightPrefixValue] = React.useState(false);
  const [dummyData, setDummyData] = React.useState([]);
  const [localOptions, setLocalOptions] = useState([]);
  const [selectedOptionValue, setSelectedOptionValue] = useState();
  const [selectedOptionValueIndex, setSelectedOptionValueIndex] = useState(-1);
  const [optionData, setOptionData] = useState(null);
  const [swiggyPrice, setSwiggyPrice] = React.useState();
  const [zomatoPrice, setZomatoPrice] = React.useState();

  const [addNewCategory, setAddNewCategory] = React.useState({
    RBSheetAddNewCategory: {},
  });

  const [getStartedButton, setgetStartedButton] = React.useState({
    getStartedButton: {},
  });

  const removeInput = (input, index) => {
    let obj = {...optionData};
    obj.product_option_value.splice(index, 1);
    setOptionData(obj);
  };

  const toggleModal = (item, index) => {
    console.log('item', item);
    setSelectedOptionValue(item);
    setOptionsValueModalVisible(!optionsValueModalVisible);
  };

  const onCloseModal = () => {
    setOptionsValueModalVisible(!optionsValueModalVisible);
  };

  const openOptionModel = () => {
    if (displayOptionsData == undefined) {
      setVisibleOptions(false);
      Toast.showWithGravity(
        'No options available please try to add some.',
        Toast.LONG,
        Toast.BOTTOM,
      );
      return false;
    }
    setVisibleOptions(!visibleOptions);
  };

  const getOptionsDataById = async (item, index) => {
    console.log('optionData', JSON.stringify(optionData));
    setOptionData(null);
    setSelectedOptionValueIndex(index);
    let api = new DeveloperAPIClient();
    let UserMobile = await AsyncStorage.getItem('MobileNumber');
    let Token = await AsyncStorage.getItem('token');
    let addOptionsData = await api.getOptionDetailsByOptionId(
      UserMobile,
      Token,
      item.option_id,
    );
    if (addOptionsData.data.success == true) {
      setOptionValueData(addOptionsData.data.optiondata);
    }
    // let cloneData = [...localOptions];
    let cloneData = JSON.parse(JSON.stringify(localOptions));
    let localObj = cloneData[index];
    if (localObj?.product_option_value) {
    } else {
      localObj.product_option_value = optionData[index].product_option_value;
    }
    console.log('optionData', JSON.stringify(optionData));
    if (localObj.product_option_value.length == 0) {
      localObj.product_option_value.push({
        option_value_id: '0',
        name: '',
        product_option_value_id: '',
        quantity: '',
        subtract: 0,
        price_prefix: '+',
        price: '',
        points_prefix: '',
        points: '',
        weight_prefix: '+',
        weight: '',
      });
    }
    setOptionData(localObj);
    toggleModal(item, index);
  };

  const renderOptionsValues = ({item, index}) => (
    <View style={{marginTop: 2}}>
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          marginVertical: 10,
          marginHorizontal: 10,
        }}
        onPress={() => updateOptionValues(item, index)}>
        <View style={{flex: 2, height: 25}}>
          <Text
            style={{
              flex: 1,
              color: '#0F0F0F',
              fontFamily: 'Poppins-Medium',
              fontSize: 14,
              marginTop: 2,
            }}>
            {item.name}
          </Text>
        </View>
      </TouchableOpacity>
      <View style={{marginBottom: 5}} />
      <Divider />
    </View>
  );

  const onselectedOptionValues = item => {
    let items = [...selectedOptionValueId];
    let itemsNames = [...selectedOptionValueName];

    if (items.includes(item.option_value_id)) {
      const index = items.indexOf(item.option_value_id);
      if (index > -1) {
        items.splice(index, 1);
      }
    } else {
      items.push(item.option_value_id);
    }
    itemsNames.push(item);
    setSelectedOptionValueId(items);
    setSelectedOptionValueName(itemsNames);
  };

  const onSelectedRemoveOptionValues = item => {
    let items = [...selectedOptionValueId];
    if (items.includes(item)) {
      const index = items.indexOf(item);
      if (index > -1) {
        items.splice(index, 1);
      }
    } else {
      items.push(item);
    }
    setSelectedOptionValueId(items);
    // setSelectedOptionValueName(itemsNames);
  };

  const updateOptionValues = async (item, index) => {
    console.log('index==', index);
    for (let i = 0; i < optionData.product_option_value.length; i++) {
      if (
        optionData.product_option_value[i].option_value_id ==
        item.option_value_id
      ) {
        Toast.showWithGravity(
          'Option Type Already Exists',
          Toast.LONG,
          Toast.BOTTOM,
        );
        return false;
      }
    }
    setOptionsValueNamesModalVisible(false);
    setOptionData(prev => {
      let obj = {...prev};
      console.log(index);
      obj.product_option_value[optionValueNameIndex].name = item.name;
      obj.product_option_value[optionValueNameIndex].option_value_id =
        item.option_value_id;
      console.log('obj', obj);
      return obj;
    });
  };

  const handleAddTextInput = () => {
    if (optionValueData.length <= optionData.product_option_value.length) {
      return false;
    }
    let LocalData = {...optionData};
    console.log(JSON.stringify(LocalData));
    LocalData.product_option_value.push({
      option_value_id: '',
      name: '',
      product_option_value_id: '',
      quantity: '',
      subtract: 0,
      price_prefix: '+',
      price: '',
      points_prefix: '',
      points: '',
      weight_prefix: '+',
      weight: '',
    });
    setOptionData(LocalData);
  };

  const onSelectedRemoveOptions = (item, index) => {
    let result = [...localOptions];
    result.splice(index, 1);
    setLocalOptions(result);
  };

  const loadOptions = async () => {
    // setOptionsData(dummyData);
    // setRefreshing(true);
    // dispatch(optionActions.refreshOptionData());
    // dispatch(optionActions.loadOptions());
    // setRefreshing(false);
    setRefreshing(true);
    let api = new DeveloperAPIClient();
    let UserMobile = await AsyncStorage.getItem('MobileNumber');
    let Token = await AsyncStorage.getItem('token');
    let OptionsData = await api.getOptions(UserMobile, Token);
    setSelectedOptions(
      route.params.productObj.options.map(obj => obj.option_id),
    );
    if (OptionsData.data.success == true) {
      setDisplayOptionsData(OptionsData.data.productoptions);
      setRefreshing(false);
    } else {
      setRefreshing(false);
    }
  };

  const EditProduct = async () => {
    setIsLoading(!isLoading);
    if (name == null || name.length == 0 || name.trim() == '') {
      Toast.showWithGravity(
        'Product name cannot be empty',
        Toast.LONG,
        Toast.BOTTOM,
      );
      setIsLoading(false);
      return false;
    }
    if (
      !isNaN(name[0]) ||
      !/^[a-zA-Z][a-zA-Z0-9\s]*$/.test(name[0]) ||
      name[0] === '-' ||
      name[0] === '@' ||
      name[0] === '.'
    ) {
      Toast.showWithGravity(
        'Product name only starts with alphabets',
        Toast.LONG,
        Toast.BOTTOM,
      );
      setIsLoading(false);
      return false;
    }
    if (price == null || price.length == 0 || price.trim() == '') {
      Toast.showWithGravity('Price cannot be empty', Toast.LONG, Toast.BOTTOM);
      setIsLoading(false);
      return false;
    }
    if (price[0] == '-') {
      Toast.showWithGravity(
        'Price cannot accept negitive value',
        Toast.LONG,
        Toast.BOTTOM,
      );
      setIsLoading(false);
      return false;
    }
    if (specialPrice[0] == '-') {
      Toast.showWithGravity(
        'Special Price cannot accept negitive value',
        Toast.LONG,
        Toast.BOTTOM,
      );
      setIsLoading(false);
      return false;
    }
    if (cats.name == null) {
      Toast.showWithGravity('Please Select Category', Toast.LONG, Toast.BOTTOM);
      setIsLoading(false);
      return false;
    }
    for (let i = 0; i < localOptions.length; i++) {
      if (
        localOptions[i].type == 'checkbox' ||
        localOptions[i].type == 'select' ||
        localOptions[i].type == 'radio'
      ) {
        if (localOptions[i].product_option_value.length <= 0) {
          Toast.showWithGravity(
            'Please add option Values for selected product options.',
            Toast.LONG,
            Toast.BOTTOM,
          );
          setIsLoading(false);
          return false;
        }
      }
    }
    setIsLoading(!isLoading);
    const api = new DeveloperAPIClient();
    let catname = cats.category_id;
    let imagepath = path == undefined ? route.params.product_image_path : path;
    let UserMobile = await AsyncStorage.getItem('MobileNumber');
    let Token = await AsyncStorage.getItem('token');
    // let productObj = editObj;
    let product_description = {};
    // if(price != null || price != '' && name!= null){
    Object.keys(editObj).map((val, i) => {
      product_description[val] = {
        name: editObj[val].name,
        description: description,
        meta_title: '',
        meta_description: '',
        meta_keyword: '',
        tag: '',
      };
    });
    let Editproductdata = await api.getEditProduct(
      product_description,
      price,
      product_id,
      itemcode,
      catname,
      imagepath,
      Token,
      UserMobile,
      productStatus,
      localOptions,
      specialPrice,
      swiggyPrice,
      zomatoPrice,
    );
    if (Editproductdata.data != undefined) {
      Toast.showWithGravity(
        'Product updated successfully.',
        Toast.LONG,
        Toast.BOTTOM,
      );
    }

    if (route.params.isProductSearched == false) {
      navigation.navigate('ProductScreen');
    }
    if (route.params.isProductSearched == true) {
      navigation.navigate('SearchScreen', {
        isProductSearched: true,
        searchkey: searchKey,
      });
    }
  };

  const getSupportedLanguages = async () => {
    setRefreshing(true);
    const api = new DeveloperAPIClient();
    let UserMobile = await AsyncStorage.getItem('MobileNumber');
    let allSupportedLanguagesdata = await api.getSupportedLanguages(UserMobile);
    setlanguages(allSupportedLanguagesdata.data.Languages);
    setTabValue(allSupportedLanguagesdata.data.Languages[0].language_id);
    setRefreshing(false);
  };

  const loadcats = async () => {
    getSupportedLanguages();
    const api = new DeveloperAPIClient();
    let UserMobile = await AsyncStorage.getItem('MobileNumber');
    let Token = await AsyncStorage.getItem('token');
    let allcatsdata = await api.getcats(UserMobile, Token);
    for (let i = 0; i < allcatsdata.data.category_info.length; i++) {
      if (
        allcatsdata.data.category_info[i].category_id == route.params.categoryid
      ) {
        setCats(allcatsdata.data.category_info[i]);
      }
    }

    setcattype(allcatsdata.data.category_info);
  };

  const requiredSwitchControl = async item => {
    console.log('item', item);
    let data = [...localOptions];
    for (let i = 0; i < data.length; i++) {
      if (data[i].option_id == item.option_id) {
        if (data[i].required) {
          data[i].required = false;
        } else {
          data[i].required = true;
        }
      }
    }
    setLocalOptions(data);
  };

  const loadOptionValues = async () => {
    console.log(
      'LocalOptions==',
      JSON.stringify(route.params.productObj.options),
    );
    let localValues = [...route.params.productObj.options];
    setOptionData(localValues);
  };

  useEffect(() => {
    setLocalOptions(route.params.productObj.options);
    setproductObj(route.params.productObj);
    if (
      route?.params?.isProductSearched &&
      route?.params?.isProductSearched == true
    ) {
      setLocalOptions(route.params.productObj.options);
      setSwiggyPrice(route.params.productObj.sprice);
      setZomatoPrice(route.params.zprice);
    }
    setname(route.params.name);
    setprice(parseInt(route.params.price).toFixed(2));
    setdescription(route.params.description);
    setproduct_id(route.params.ID);
    setProductImage(route.params.productImage.image);
    setSwiggyPrice(route.params.productObj.sprice);
    setZomatoPrice(route.params.productObj.zprice);
    setProductStatus(route.params.productStatus);
    setSpecialPrice(
      route.params.special == false
        ? ''
        : parseInt(route.params.special).toFixed(2),
    );
    setItemCode(route.params.sku);
    loadOptionValues();
    if (route.params.searchKey) {
      setSearchKey(route.params.searchKey);
    }
    seteditObj(route.params.productObj.product_description);
    loadcats();
    loadOptions();
  }, []);

  const updatecat = async val => {
    setVisibleCats(false);
    setCats(val);
  };

  const onSubmit = () => {
    const pattern = /^\d+-$/;
    if (optionData.product_option_value.length <= 0) {
      Toast.showWithGravity(
        'Option Values Cannot Save as Empty',
        Toast.LONG,
        Toast.BOTTOM,
      );
      return false;
    }
    for (let i = 0; i < optionData.product_option_value.length; i++) {
      if (
        optionData?.product_option_value[i]?.quantity?.trim() == '' ||
        optionData?.product_option_value[i]?.quantity == 0 ||
        JSON.stringify(optionData?.product_option_value[i]?.quantity[0]) == '0'
      ) {
        Toast.showWithGravity(
          'Option Stock Cannot Save as Empty',
          Toast.LONG,
          Toast.BOTTOM,
        );
        return false;
      }
      if (
        pattern.test(optionData?.product_option_value[i]?.quantity) ||
        pattern.test(optionData?.product_option_value[i]?.quantity[0]) ||
        optionData?.product_option_value[i]?.quantity[0] === '-' ||
        optionData?.product_option_value[i]?.quantity[0] === ',' ||
        optionData?.product_option_value[i]?.quantity[0] === '.' ||
        optionData?.product_option_value[i]?.quantity?.trim() == ''
      ) {
        Toast.showWithGravity(
          'Option Stock cannot accept negative value, space or special characters.',
          Toast.LONG,
          Toast.BOTTOM,
        );
        return false;
      }
      if (
        optionData?.product_option_value[i]?.price?.length <= 0 ||
        optionData?.product_option_value[i]?.price == 0 ||
        JSON.stringify(optionData?.product_option_value[i]?.price[0]) == '0'
      ) {
        Toast.showWithGravity(
          'Option Price Cannot Save as Empty',
          Toast.LONG,
          Toast.BOTTOM,
        );
        return false;
      }
      if (
        pattern.test(optionData?.product_option_value[i]?.price) ||
        pattern.test(optionData?.product_option_value[i]?.price[0]) ||
        optionData?.product_option_value[i]?.price[0] === '-' ||
        optionData?.product_option_value[i]?.price[0] === ',' ||
        optionData?.product_option_value[i]?.price[0] === '.' ||
        optionData?.product_option_value[i]?.price?.trim() == ''
      ) {
        Toast.showWithGravity(
          'Option price cannot accept negative value, space or special characters.',
          Toast.LONG,
          Toast.BOTTOM,
        );
        return false;
      }
      if (optionData?.product_option_value[i]?.name?.length <= 0) {
        Toast.showWithGravity(
          'Option Value Cannot Save as Empty',
          Toast.LONG,
          Toast.BOTTOM,
        );
        return false;
      }
      if (
        optionData?.product_option_value[i]?.weight?.trim() == '' ||
        optionData?.product_option_value[i]?.weight?.length <= 0 ||
        optionData?.product_option_value[i]?.weight == 0 ||
        JSON.stringify(optionData?.product_option_value[i]?.weight[0]) == '0'
      ) {
        Toast.showWithGravity(
          'Option weight Cannot Save as Empty',
          Toast.LONG,
          Toast.BOTTOM,
        );
        return false;
      }
      if (
        pattern.test(optionData?.product_option_value[i]?.weight) ||
        pattern.test(optionData?.product_option_value[i]?.weight[0]) ||
        optionData?.product_option_value[i]?.weight[0] === '-' ||
        optionData?.product_option_value[i]?.weight[0] === ',' ||
        optionData?.product_option_value[i]?.weight[0] === '.' ||
        optionData?.product_option_value[i]?.weight[0].trim() == ''
      ) {
        Toast.showWithGravity(
          'Option weight cannot accept negative value, space or special characters.',
          Toast.LONG,
          Toast.BOTTOM,
        );
        return false;
      }
    }
    let cloneOption = [...localOptions];
    cloneOption[selectedOptionValueIndex] = optionData;
    setLocalOptions(cloneOption);
    setOptionsValueModalVisible(!optionsValueModalVisible);
  };
  const onChangeValueQuantity = (index, val) => {
    console.log(index);
    setOptionData(prev => {
      let obj = {...prev};
      obj.product_option_value[index].quantity = val;
      console.log(obj);
      return obj;
    });
  };

  const onChangePricePrefix = async index => {
    setOptionData(prev => {
      let array = {...prev};
      if (array.product_option_value[index].price_prefix == '-') {
        array.product_option_value[index].price_prefix = '+';
        setPricePrefixValue(true);
      } else {
        array.product_option_value[index].price_prefix = '-';
      }
      return array;
    });
  };

  const onChangeWeightPrefix = async index => {
    setOptionData(prev => {
      let array = {...prev};
      if (array.product_option_value[index].weight_prefix == '-') {
        array.product_option_value[index].weight_prefix = '+';
        setWeightPrefixValue(true);
      } else {
        array.product_option_value[index].weight_prefix = '-';
        setWeightPrefixValue(false);
      }
      return array;
    });
  };

  const optionValueSwitchControl = async index => {
    let array = {...optionData};
    console.log('array', JSON.stringify(array));
    if (array.product_option_value[index].subtract == 1) {
      array.product_option_value[index].subtract = 0;
    } else {
      array.product_option_value[index].subtract = 1;
    }
    setOptionData(array);
  };

  const onChangeValuePrice = (index, val) => {
    setOptionData(prev => {
      let obj = {...prev};
      obj.product_option_value[index].price = val;
      return obj;
    });
  };

  const onChangeValueWeight = (index, val) => {
    setOptionData(prev => {
      let obj = {...prev};
      obj.product_option_value[index].weight = val;
      return obj;
    });
  };

  const updateOptionType = async (val, index) => {
    setVisibleOptions(false);
    setSelectedOptionType(val);
    const result = localOptions.filter(
      option => option.option_id == val.option_id,
    );
    if (result.length == 0) {
      let localItem = [...localOptions];
      let localvalue = {...val};
      localvalue.product_option_value = [];
      localvalue.OptionValues = [];
      localItem.push(localvalue);
      setLocalOptions(localItem);
    } else {
      Toast.showWithGravity(
        'Option Type Already Exists',
        Toast.LONG,
        Toast.BOTTOM,
      );
    }
  };

  const loadProductNameByLanguage = async val => {
    setTabValue(val.language_id);
    setname(productObj.product_description[val.language_id].name);
  };

  const loadCategoryNameByLanguage = async val => {
    setTabValue(val.language_id);
    setCategoryName(cats.category_description[val.language_id].name);
  };

  const onEditCategoryClick = () => {
    setCategoryName(cats.category_description[languages[0].language_id].name);
    setTabValue(languages[0].language_id);
    addNewCategory.RBSheetAddNewCategory.open();
  };

  const renderOptionsTable = ({item, index}) => (
    <View style={{marginTop: 2}}>
      <View
        style={{
          flexDirection: 'row',
          marginVertical: 10,
          marginHorizontal: 10,
        }}>
        <View style={{flex: 2, height: 25}}>
          <Text
            style={{
              flex: 1,
              color: '#0F0F0F',
              fontFamily: 'Poppins-Medium',
              fontSize: 14,
              marginTop: 2,
            }}>
            {item.name}
          </Text>
        </View>
        <View>
          <Switch
            value={item.required == 0 ? false : true}
            onValueChange={() => requiredSwitchControl(item)}
            style={{marginRight: 10}}
            barHeight={18}
            circleSize={20}
          />
        </View>
        {item.type == 'checkbox' ||
        item.type == 'select' ||
        item.type == 'radio' ? (
          <View
            style={{flex: 1.2, height: 25, marginLeft: '10%', marginTop: 2}}>
            <Text
              onPress={() => {
                getOptionsDataById(item, index);
              }}
              style={{
                flex: 1,
                color: '#1B6890',
                fontFamily: 'Poppins-Medium',
                fontSize: 12,
                marginTop: 2,
                textDecorationLine: 'underline',
                // color: "#34A549",
              }}>
              Click Here
            </Text>
          </View>
        ) : (
          <View
            style={{flex: 1.2, height: 25, marginLeft: '13%', marginTop: 2}}
          />
        )}
        <View style={{flex: 0.5}}>
          <TouchableOpacity
            onPress={() => onSelectedRemoveOptions(item, index)}>
            <Image
              style={{
                width: 25,
                height: 25,
              }}
              source={require('../../assets/delete.png')}
            />
          </TouchableOpacity>
        </View>
      </View>
      <View style={{marginBottom: 5}} />
      <Divider />
    </View>
  );

  const updateCategoryName = async val => {
    let data = cats;
    data.category_description[tabValue].name = val;
    setCats(data);
    setCategoryName(val);
    setEditCategoryObject(cats.category_description);
  };

  const addCategory = async () => {
    if (categoryName.trim() == '') {
      Toast.showWithGravity(
        'Category Name Cannot be Empty',
        Toast.LONG,
        Toast.BOTTOM,
      );
      getStartedButton.getStartedButton.showLoading(false);
      return false;
    }
    setRefreshing(true);
    const api = new DeveloperAPIClient();
    let Token = await AsyncStorage.getItem('token');
    let UserMobile = await AsyncStorage.getItem('MobileNumber');
    let category_description = {};
    Object.keys(editCategoryObject).map((val, i) => {
      category_description[val] = {
        name: editCategoryObject[val].name,
        description: '',
        meta_title: '',
        meta_description: '',
        meta_keyword: '',
        tag: '',
      };
    });
    getStartedButton.getStartedButton.showLoading(true);
    let allcategorydata = await api.getAddNewCateogry(
      category_description,
      Token,
    );

    if (allcategorydata.data.success == true) {
      Toast.showWithGravity(
        'Category name updated successfully',
        Toast.LONG,
        Toast.BOTTOM,
      );
    }
    loadcats();
    getStartedButton.getStartedButton.showLoading(false);
    addNewCategory.RBSheetAddNewCategory.close();
    setRefreshing(false);
  };

  const updateProductNameByLanguage = async val => {
    let data = productObj;
    data.product_description[tabValue].name = val;
    setproductObj(data);
    setname(val);
    seteditObj(productObj.product_description);
  };

  const OpenSecondModal = async (index, input) => {
    if (optionValueData == undefined || optionValueData.length <= 0) {
      setOptionsValueNamesModalVisible(false);
      Toast.showWithGravity(
        'No Option values added, add some values.',
        Toast.LONG,
        Toast.BOTTOM,
      );
      return false;
    }
    setOptionsValueNameIndex();
    setOptionsValueNameIndex(index);
    setOptionsValueNamesModalVisible(!optionsValueNamesModalVisible);
  };

  return (
    <View style={styles.container}>
      <>
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
              Edit Product{' '}
            </Text>
          </View>
          <View style={{marginLeft: '45%'}} />
        </View>
        <Divider />
        <Modal
          onRequestClose={() => setOptionsValueModalVisible(false)}
          style={{margin: 2, zIndex: 0}}
          visible={optionsValueModalVisible}>
          <View
            style={{
              backgroundColor: '#FFFF',
              elevation: 2,
              borderRadius: 5,
              height: 500,
            }}>
            <View
              style={{
                flexDirection: 'row',
                marginTop: 10,
                backgroundColor: '#fff',
                justifyContent: 'space-around',
              }}>
              <Text
                style={{
                  color: '#0F0F0F',
                  fontFamily: 'Poppins-SemiBold',
                  fontSize: 14,
                  marginTop: 2,
                }}>
                Value
              </Text>
              <Text
                style={{
                  color: '#0F0F0F',
                  fontFamily: 'Poppins-SemiBold',
                  fontSize: 14,
                  marginTop: 2,
                }}>
                Stock
              </Text>
              <Text
                style={{
                  color: '#0F0F0F',
                  fontFamily: 'Poppins-SemiBold',
                  fontSize: 14,
                  marginTop: 2,
                  // margin: '',
                }}>
                Subtract
              </Text>
              <Text
                style={{
                  color: '#0F0F0F',
                  fontFamily: 'Poppins-SemiBold',
                  fontSize: 14,
                  marginTop: 2,
                  // margin: '',
                }}>
                Price
              </Text>
              <Text
                style={{
                  color: '#0F0F0F',
                  fontFamily: 'Poppins-SemiBold',
                  fontSize: 14,
                  marginTop: 2,
                  // margin: '',
                }}>
                Weight
              </Text>
            </View>
            <ScrollView>
              {optionData &&
                optionData?.product_option_value?.map((input, index) => (
                  <View
                    style={{
                      borderWidth: 1,
                      borderRadius: 3,
                      paddingBottom: 10,
                    }}>
                    <View style={{marginTop: 10, flexDirection: 'row'}}>
                      <View
                        style={{
                          height: 40,
                          width: '15.5%',
                          padding: 10,
                          backgroundColor: '#F7F7FC',
                          marginLeft: 4,
                        }}>
                        <TouchableOpacity
                          onPress={() => OpenSecondModal(index, input)}>
                          <Text numberOfLines={1}>
                            {input?.name ? input.name : 'Select'}
                          </Text>
                        </TouchableOpacity>
                      </View>
                      <TextInput
                        onChangeText={val => onChangeValueQuantity(index, val)}
                        placeholder="Qnty"
                        style={{
                          height: 40,
                          padding: 10,
                          width: 33,
                          backgroundColor: '#F7F7FC',
                          marginLeft: '5%',
                        }}
                        maxLength={4}
                        value={input?.quantity.toString()}
                        keyboardType="numeric"
                      />
                      <View style={{marginTop: 5, marginLeft: '8%'}}>
                        <Switch
                          value={
                            input?.subtract == 0 || input?.subtract == false
                              ? true
                              : false
                          }
                          onValueChange={() => optionValueSwitchControl(index)}
                          circleActiveColor="#34A549"
                          barHeight={18}
                          circleSize={20}
                        />
                      </View>

                      <View
                        style={{flexDirection: 'column', marginLeft: '10%'}}>
                        <View
                          style={{
                            flexDirection: 'row',
                            marginBottom: 4,
                            marginLeft: '8%',
                          }}>
                          <Switch
                            value={input?.price_prefix == '-' ? false : true}
                            onValueChange={() => onChangePricePrefix(index)}
                            circleActiveColor="#34A549"
                            barHeight={18}
                            circleSize={20}
                            activeText={'+'}
                            inActiveText={'-'}
                          />
                        </View>
                        <TextInput
                          onChangeText={val => onChangeValuePrice(index, val)}
                          placeholder="Price"
                          style={{
                            height: 40,
                            padding: 10,
                            width: 52,
                            backgroundColor: '#F7F7FC',
                            marginTop: 5,
                          }}
                          maxLength={4}
                          value={input?.price?.toString()}
                          keyboardType="numeric"
                        />
                      </View>

                      <View style={{flexDirection: 'column', marginLeft: '2%'}}>
                        <View
                          style={{
                            flexDirection: 'row',
                            marginBottom: 8,
                            marginLeft: '5%',
                          }}>
                          <Switch
                            value={input?.weight_prefix == '-' ? false : true}
                            onValueChange={() => onChangeWeightPrefix(index)}
                            circleActiveColor="#34A549"
                            barHeight={18}
                            circleSize={20}
                            activeText={'+'}
                            inActiveText={'-'}
                          />
                        </View>
                        <TextInput
                          onChangeText={val => onChangeValueWeight(index, val)}
                          placeholder="Weight"
                          style={{
                            height: 40,
                            // marginLeft: 3,
                            padding: 5,
                            width: 52,
                            backgroundColor: '#F7F7FC',
                            marginTop: 1,
                            marginRight: '5%',
                          }}
                          value={input?.weight?.toString()}
                          keyboardType="numeric"
                        />
                      </View>
                    </View>
                    <TouchableOpacity
                      style={{paddingTop: 20}}
                      onPress={() => removeInput(input, index)}>
                      <Text
                        style={{
                          textAlign: 'center',
                          color: '#FF0000',
                          textDecorationLine: 'underline',
                        }}>
                        Delete Option Value
                      </Text>
                    </TouchableOpacity>
                  </View>
                ))}
            </ScrollView>
            <TouchableOpacity
              style={{
                marginTop: 10,
                width: '15%',
                height: 45,
                paddingTop: 11,
                paddingBottom: 15,
                borderRadius: 5,
                backgroundColor: '#008080',
                marginBottom: '5%',
                marginLeft: 'auto',
                marginRight: 13,
              }}
              onPress={() => handleAddTextInput()}>
              <Text
                style={{
                  color: '#fff',
                  textAlign: 'center',
                  justifyContent: 'center',
                  alignItems: 'center',
                  fontSize: 10,
                  fontFamily: 'Poppins-Medium',
                }}>
                Add New Value
              </Text>
            </TouchableOpacity>
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
              onPress={() => onSubmit()}>
              <Text
                style={{
                  color: '#fff',
                  textAlign: 'center',
                  justifyContent: 'center',
                  alignItems: 'center',
                  fontSize: 16,
                }}>
                Submit
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                marginTop: 10,
                marginBottom: '5%',
                marginLeft: 10,
              }}
              onPress={() => onCloseModal()}>
              <Text
                style={{
                  color: 'black',
                  textAlign: 'center',
                  justifyContent: 'center',
                  alignItems: 'center',
                  fontSize: 16,
                }}>
                Close
              </Text>
            </TouchableOpacity>
          </View>
        </Modal>
        <Modal
          onRequestClose={() => setOptionsValueNamesModalVisible(false)}
          style={{margin: 2, zIndex: 0}}
          visible={optionsValueNamesModalVisible}>
          <View
            style={{
              backgroundColor: '#FFFF',
              elevation: 2,
              borderRadius: 5,
              height: 200,
            }}>
            {/* {selectedOptionValueIndex?.length > -1 && */}
            <FlatList data={optionValueData} renderItem={renderOptionsValues} />
          </View>
        </Modal>
        <ScrollView>
          <View
            style={{
              marginHorizontal: 10,
              backgroundColor: 'white',
              elevation: 2,
              padding: 10,
              borderRadius: 5,
              marginVertical: 5,
            }}>
            <Text>1. Product Image</Text>
            {/* <ImagePicker /> */}
            <ImageUpload
              from={'editItem'}
              productImage={productImage}
              pathUpdate={setpath}
            />
            <View style={{marginTop: 15}}>
              {/* <Image
            style={{
              width: 50,
              height: 100,
              flex: 0.7,
              borderRadius: 5,
              marginLeft: 10,
            }}
            source={{ uri: productImage }}
          /> */}
              <Divider />
            </View>
            <View style={{marginTop: 10}}>
              <Text>2. Product Details</Text>
            </View>
            <Text style={{marginBottom: 20, marginTop: 15, fontSize: 14}}>
              {'    '}Language
            </Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-around',
              }}>
              {languages &&
                languages.map((val, i) => {
                  return (
                    <TouchableOpacity
                      activeOpacity={0.7}
                      key={i}
                      style={[styles.chip]}
                      onPress={() => loadProductNameByLanguage(val)}>
                      <Text
                        style={[
                          styles.chipText,

                          {
                            opacity: tabValue === val.language_id ? 1 : 0.6,
                            borderBottomWidth:
                              tabValue === val.language_id ? 2 : 0,
                            borderColor:
                              tabValue === val.language_id ? '#34A549' : null,
                            borderBottomRightRadius:
                              tabValue === val.language_id ? 2 : 2,
                            borderBottomLeftRadius:
                              tabValue === val.language_id ? 2 : 2,
                          },
                        ]}>
                        {val.name}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
            </View>
            <View>
              <View style={{marginTop: 10}}>
                <Text>{'    '}Product name</Text>
              </View>
              <TextInput
                style={styles.input}
                // defaultValue={name}
                onChangeText={val => updateProductNameByLanguage(val)}
                placeholder="Enter Product name"
                value={name}
              />
              <Text>{'    '}Add Product Description</Text>
              <TextInput
                style={{
                  height: 150,
                  margin: 12,
                  padding: 10,
                  backgroundColor: '#F7F7FC',
                  textAlignVertical: 'top',
                }}
                multiline={true}
                onChangeText={val => setdescription(val)}
                value={description}
                placeholder="Enter Product Description"
              />

              <View style={{marginBottom: 10}}>
                <Divider />
              </View>
              <Text>3. Price</Text>
              <TextInput
                style={styles.input}
                onChangeText={val => setprice(val)}
                value={price}
                placeholder="Enter Price"
                keyboardType="numeric"
              />

              <Text>4. Special Price</Text>
              <TextInput
                style={styles.input}
                onChangeText={val => setSpecialPrice(val)}
                value={specialPrice}
                placeholder="Enter Special Price"
                keyboardType="numeric"
              />

              <Text>5. Swiggy Price</Text>
              <TextInput
                style={styles.input}
                onChangeText={val => setSwiggyPrice(val)}
                value={swiggyPrice}
                placeholder="Enter S Price"
                keyboardType="numeric"
              />

              <Text>6. Zomato Price</Text>
              <TextInput
                style={styles.input}
                onChangeText={val => setZomatoPrice(val)}
                value={zomatoPrice}
                placeholder="Enter Z Price"
                keyboardType="numeric"
              />

              <View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                  <Text
                    style={{
                      color: '#292A31',
                      fontSize: 14,
                      fontFamily: 'Lato-Regular',
                      marginVertical: 5,
                    }}>
                    7. Category
                  </Text>
                  {/* <Text
                    onPress={() => onEditCategoryClick()}
                    style={{ color: "#2F6E8F" }}
                  >
                    +Add New Category
                  </Text> */}
                </View>
                <View
                  style={{
                    height: 40,
                    margin: 12,
                    padding: 10,
                    backgroundColor: '#F7F7FC',
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
                        <Text>{decode(cats ? cats.name : '')}</Text>
                      </TouchableOpacity>
                    }>
                    {cattype &&
                      cattype.map((val, i) => {
                        return (
                          <Menu.Item
                            key={i}
                            title={decode(val.name)}
                            onPress={() => updatecat(val)}
                          />
                        );
                      })}
                  </Menu>
                </View>
              </View>

              <Text>8. Product SKU</Text>
              <TextInput
                style={styles.input}
                onChangeText={val => setItemCode(val)}
                value={itemcode}
                placeholder="Enter SKU"
              />

              <Text style={{marginBottom: 10}}>9. Options</Text>
              <View
                style={{
                  height: 40,
                  width: '93.5%',
                  padding: 10,
                  backgroundColor: '#F7F7FC',
                  marginLeft: 10,
                }}>
                <Menu
                  visible={visibleOptions}
                  onDismiss={() => openOptionModel()}
                  anchor={
                    <TouchableOpacity
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginHorizontal: 10,
                        // marginBottom:5
                      }}
                      activeOpacity={0.7}
                      onPress={() => setVisibleOptions(!visibleOptions)}>
                      <Text
                        numberOfLines={1}
                        style={{fontFamily: 'Poppins-Regular'}}>
                        Please select any option
                        {/* {cats.name != null || cats ? decode(cats.name) : " "} */}
                      </Text>
                      <View>
                        <Image
                          style={{height: 20, width: 15}}
                          source={require('../../assets/ddarrow.png')}
                        />
                      </View>
                    </TouchableOpacity>
                  }>
                  {displayOptionsData &&
                    displayOptionsData.map((val, i) => {
                      return (
                        <View style={{flexDirection: 'row'}}>
                          {/* <CheckBox
                            value={
                              selectedOptions.includes(val.option_id)
                                ? true
                                : false
                            }
                            onValueChange={() =>
                              selectedOptions.includes(val.option_id)
                                ? onSelectedRemoveCategories(val)
                                : onselectedOptions(val)
                            }
                            style={{ marginTop: "4%" }}
                          /> */}
                          <Menu.Item
                            key={i}
                            title={decode(val.name)}
                            onPress={() => updateOptionType(val)}
                          />
                        </View>
                      );
                    })}
                </Menu>
              </View>

              {localOptions?.length > 0 && (
                <View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      marginTop: 10,
                    }}>
                    <Text
                      style={{
                        marginVertical: 5,
                        marginHorizontal: 5,
                        color: '#0F0F0F',
                        fontFamily: 'Poppins-SemiBold',
                        fontSize: 14,
                        marginTop: 2,
                      }}>
                      Option Name
                    </Text>
                    <Text
                      style={{
                        marginVertical: 5,
                        marginHorizontal: 5,
                        color: '#0F0F0F',
                        fontFamily: 'Poppins-SemiBold',
                        fontSize: 14,
                        marginTop: 2,
                      }}>
                      Required
                    </Text>
                    <Text
                      style={{
                        marginVertical: 5,
                        marginHorizontal: 5,
                        color: '#0F0F0F',
                        fontFamily: 'Poppins-SemiBold',
                        fontSize: 14,
                        marginTop: 2,
                      }}>
                      Value
                    </Text>
                    <Text
                      style={{
                        marginRight: 5,
                        color: '#0F0F0F',
                        fontFamily: 'Poppins-SemiBold',
                        fontSize: 14,
                        marginTop: 2,
                      }}>
                      Actions
                    </Text>
                  </View>
                  <View style={{marginTop: 5}} />
                  <Divider
                    style={{borderRadius: 2, backgroundColor: 'black'}}
                  />
                </View>
              )}
              <FlatList data={localOptions} renderItem={renderOptionsTable} />

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
                onPress={() => EditProduct()}>
                {isLoading && <ActivityIndicator size="small" color="#fff" />}
                <Text
                  style={{
                    color: '#fff',
                    textAlign: 'center',
                    justifyContent: 'center',
                    alignItems: 'center',
                    fontSize: 16,
                  }}>
                  {' '}
                  Save{' '}
                </Text>
              </TouchableOpacity>
            </View>
            <RBSheet
              ref={ref => {
                addNewCategory.RBSheetAddNewCategory = ref;
              }}
              height={350}
              openDuration={250}
              customStyles={{
                container: {
                  // justifyContent: "center",
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
                Add New Category
              </Text>
              <Divider />
              <Text
                style={{
                  fontFamily: 'Poppins-Regular',
                  //fontWeight: "bold",
                  fontSize: 12,
                  color: '#21272E',
                  marginVertical: 10,
                  marginHorizontal: 10,
                  textAlign: 'left',
                }}>
                Language
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                }}>
                {languages &&
                  languages.map((val, i) => {
                    return (
                      <TouchableOpacity
                        activeOpacity={0.7}
                        key={i}
                        style={[
                          styles.chip,
                          {
                            // borderBottomWidth: tabValue === val.name ? 2 : 0,
                            // borderColor: tabValue === val.name ? "#34A549" : null,
                            // borderBottomRightRadius: tabValue === val.name ? 2 : 2,
                            // borderBottomLeftRadius: tabValue === val.name ? 2 : 2,
                          },
                        ]}
                        onPress={() => loadCategoryNameByLanguage(val)}>
                        <Text
                          style={[
                            styles.chipText,
                            {
                              opacity: tabValue === val.language_id ? 1 : 0.6,
                              borderBottomWidth:
                                tabValue === val.language_id ? 2 : 0,
                              borderColor:
                                tabValue === val.language_id ? '#34A549' : null,
                              borderBottomRightRadius:
                                tabValue === val.language_id ? 2 : 2,
                              borderBottomLeftRadius:
                                tabValue === val.language_id ? 2 : 2,
                            },
                          ]}>
                          {val.name}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
              </View>
              <Divider />

              <Text
                style={{
                  color: '#21272E',
                  fontFamily: 'Poppins-SemiBold',
                  fontSize: 14,
                  marginVertical: 10,
                  marginHorizontal: 10,
                }}>
                Category Name
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
                onChangeText={val => updateCategoryName(val)}
                value={categoryName ? categoryName : ''}
              />
              <CustomLoadingButton
                ref={c => (data.getStartedButton = c)}
                width={328}
                height={52}
                title="Continue"
                titleFontSize={18}
                titleFontFamily="Poppins-Bold"
                titleColor="#FFF"
                backgroundColor="#34A549"
                borderRadius={4}
                onPress={() => {
                  addCategory();
                }}
              />
            </RBSheet>
          </View>
        </ScrollView>
      </>
    </View>
  );
};

export default editProductScreen;

const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    padding: 10,
    backgroundColor: '#F7F7FC',
  },
  container: {
    flex: 1,
    backgroundColor: '#F4F5F7',
  },
  chipText: {
    color: '#0F0F0F',
    fontWeight: 'bold',
    fontSize: 15,
    fontFamily: 'Poppins-SemiBold',
  },
  chip: {
    margin: 5,
    borderRadius: 10,
    padding: 5,
    width: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
