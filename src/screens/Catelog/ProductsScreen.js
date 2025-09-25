import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StatusBar,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  RefreshControl,
  TextInput,
  FlatList,
  Button,
} from 'react-native';
import {useTheme} from '@react-navigation/native';
import {Divider, Menu} from 'react-native-paper';
import styles from '../Home/Styles';
import DeveloperAPIClient from '../../state/middlewares/DeveloperAPIClient';
import {Switch} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {decode} from 'html-entities';
// import OptionsMenu from 'wroti-react-native-option-menu';
import RBSheet from 'react-native-raw-bottom-sheet';
import Toast from 'react-native-simple-toast';
// import AnimateLoadingButton from "react-native-animate-loading-button";
import * as prodocutActions from '../../redux/actions/productActions';
import {useDispatch, useSelector} from 'react-redux';
//import NetworkChecker from "react-native-network-checker";
import {useIsFocused} from '@react-navigation/native';
import CustomLoadingButton from '../../components/CustomLoadingButton';
import Feather from 'react-native-vector-icons/Feather';
import Header from '../../components/Header';
import CustomDropDown from '../../components/CustomDropdown';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {hp, wp} from '../../utils/scale';

const ProductScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const {colors} = useTheme();
  const isFocused = useIsFocused();
  const [isLoading, setIsLoading] = React.useState(false);
  const [refreshing, setRefreshing] = React.useState(true);
  const [visibleCats, setVisibleCats] = React.useState(false);
  const [isLoadMore, setIsLoadMore] = React.useState(true);
  const [cats, setCats] = React.useState(-1);
  const [cattype, setcattype] = React.useState();
  const [name, setname] = React.useState();
  const [searchedProduct, setSearchedProduct] = React.useState(false);
  const [checked, setChecked] = React.useState(true);
  const [tabValue, setTabValue] = React.useState();
  const [editObj, seteditObj] = React.useState();
  const [getStartedButton, setgetStartedButton] = React.useState({
    getStartedButton: {},
  });
  const [currentPage, setCurrentPage] = React.useState(1);
  const [displayProducts, setDisplayProducts] = React.useState();
  const [languages, setlanguages] = React.useState();
  const [totalProducts, setTotalProducts] = React.useState();
  const [storeType, setStoreType] = React.useState();
  const [selectedItem, setSelectedItem] = useState(null);

  const products = useSelector(
    state => state.product.productsListingByCategory,
  );
  const productsCount = useSelector(state => state.product.productTotal);

  const TotalCount = async () => {
    if (
      (productsCount && productsCount != undefined) ||
      productsCount != null
    ) {
      setTotalProducts(productsCount);
    } else {
      setTotalProducts(0);
    }
  };

  const theme = useTheme();

  let productObj = {
    product_description: {
      1: {
        name: '',
        description: '',
        meta_title: '',
        meta_description: '',
        meta_keyword: '',
        tag: '',
      },
      2: {
        name: '',
        description: '',
        meta_title: '',
        meta_description: '',
        meta_keyword: '',
        tag: '',
      },
    },
  };

  const loadproducts = async (category_id, currentPage = 1) => {
    setIsLoading(true);
    setDisplayProducts();
    setRefreshing(true);
    dispatch(prodocutActions.refreshProdcuts());
    dispatch(prodocutActions.loadproducts(category_id, currentPage));
    setRefreshing(false);
    setIsLoading(false);
  };

  const loadupdatedCategory = async isEdit => {
    setIsLoading(true);
    setRefreshing(true);
    const api = new DeveloperAPIClient();
    let Token = await AsyncStorage.getItem('token');
    let UserMobile = await AsyncStorage.getItem('MobileNumber');
    let allcatsdata = await api.getcats(UserMobile, Token);
    // console.log("allcatsdata", allcatsdata);
    if (isEdit) {
      setcattype(allcatsdata.data.category_info);
      allcatsdata.data.category_info.map((val, i) => {
        if (val.category_id == cats.category_id) {
          setCats(val);
          loadproducts(val.category_id);
          // console.log("VAL====", val);
        }
        setIsLoading(false);
      });
    } else {
      // console.log("CateVal", allcatsdata.data.category_info[0]);
      setcattype(allcatsdata.data.category_info);
      setCats(allcatsdata.data.category_info[0]);
      loadproducts(allcatsdata.data.category_info[0].category_id);
      setSelectedItem({
        id: allcatsdata.data.category_info[0].category_id,
        name: allcatsdata.data.category_info[0].name,
      });
      setIsLoading(false);
    }
    // console.log("CATS=====", cats.category_id);
    setIsLoading(false);
    setRefreshing(false);
  };

  const deleteCategory = async () => {
    setRefreshing(true);
    const api = new DeveloperAPIClient();
    let Token = await AsyncStorage.getItem('token');
    let categoryId = cats.category_id;
    getStartedButton.getStartedButton.showLoading(true);
    let allcategorydata = await api.deleteCategory(Token, categoryId);
    if (allcategorydata.data != undefined) {
      Toast.showWithGravity(
        'Category deleted successfully',
        Toast.LONG,
        Toast.BOTTOM,
      );
    }
    loadupdatedCategory(false);
    dataa.RBSheet.close();
    setRefreshing(false);
    getStartedButton.getStartedButton.showLoading(false);
  };

  const getSupportedLanguages = async () => {
    setRefreshing(true);
    const api = new DeveloperAPIClient();
    let UserMobile = await AsyncStorage.getItem('MobileNumber');
    let allSupportedLanguagesdata = await api.getSupportedLanguages(UserMobile);
    setlanguages(allSupportedLanguagesdata.data.Languages);
    // console.log(
    //   "allSupportedLanguagesdata.data.Languages[0].language_id",
    //   allSupportedLanguagesdata.data.Languages[0].language_id
    // );
    setTabValue(allSupportedLanguagesdata.data.Languages[0].language_id);
    setRefreshing(false);
  };

  const updateCategory = async () => {
    if (name == '') {
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
    let categoryId = cats.category_id;
    let category_description = {};
    // console.log("editObject", editObj);
    Object.keys(editObj).map((val, i) => {
      // console.log("val===", val);
      category_description[val] = {
        name: editObj[val].name,
        description: '',
        meta_title: '',
        meta_description: '',
        meta_keyword: '',
        tag: '',
      };
    });
    getStartedButton.getStartedButton.showLoading(true);
    let allcategorydata = await api.updateCategory(
      Token,
      categoryId,
      category_description,
    );

    if (allcategorydata != undefined) {
      Toast.showWithGravity(
        'Category name updated successfully',
        Toast.LONG,
        Toast.BOTTOM,
      );
    }
    getStartedButton.getStartedButton.showLoading(false);
    loadupdatedCategory(true);
    editProduct.RBSheetEditProduct.close();
    setRefreshing(false);
  };

  const loadcats = async () => {
    setCurrentPage(1);
    setIsLoadMore(true);
    setDisplayProducts();
    setRefreshing(true);
    // console.log("isLoadMore",isLoadMore)
    const api = new DeveloperAPIClient();
    let Token = await AsyncStorage.getItem('token');
    let UserMobile = await AsyncStorage.getItem('MobileNumber');
    let store_type = await AsyncStorage.getItem('store_type');
    console.log('STORE TYPE==========>', store_type);
    setStoreType(store_type);
    let allcatsdata = await api.getcats(UserMobile, Token);
    //console.log("allcatsdata==", JSON.stringify(allcatsdata));
    const categoryData = allcatsdata.data.category_info[0];
    // console.log(
    //   "categoryData==>",
    //   JSON.stringify(
    //     allcatsdata.data.category_info[0].category_description[1].name
    //   )
    // );
    setname(allcatsdata.data.category_info[0].category_description[1].name);
    seteditObj(allcatsdata.data.category_info[0].category_description);
    if (cats.category_id == undefined || cats.category_id == -1) {
      setCats(categoryData);
      setcattype(allcatsdata.data.category_info);
    } else {
      setcattype(allcatsdata.data.category_info);
    }

    if (cats.category_id == undefined || cats.category_id == -1)
      loadproducts(categoryData.category_id, 1);
    else loadproducts(cats.category_id, 1);
    setRefreshing(false);
  };

  const updateAllProducts = async () => {
    setRefreshing(true);
    const api = new DeveloperAPIClient();
    let Token = await AsyncStorage.getItem('token');
    let UserMobile = await AsyncStorage.getItem('MobileNumber');
    let editArr = [];
    console.log('displayProducts', JSON.stringify(displayProducts));
    for (let i = 0; i < displayProducts?.length; i++) {
      console.log('1 check');
      if (displayProducts[i].isEdited == true) {
        if (displayProducts[i].formatted_price[0] == '0') {
          Toast.showWithGravity(
            'Price cannot be zero',
            Toast.LONG,
            Toast.BOTTOM,
          );
          setRefreshing(false);
          return false;
        }
        if (displayProducts[i].formatted_price[0] == '-') {
          Toast.showWithGravity(
            'Price cannot be negitive value',
            Toast.LONG,
            Toast.BOTTOM,
          );
          setRefreshing(false);
          return false;
        }
        if (displayProducts[i].special[0] == '0') {
          Toast.showWithGravity(
            'Special price cannot be zero',
            Toast.LONG,
            Toast.BOTTOM,
          );
          setRefreshing(false);
          return false;
        }
        if (displayProducts[i].special[0] == '-') {
          Toast.showWithGravity(
            'Special price cannot be negitive value',
            Toast.LONG,
            Toast.BOTTOM,
          );
          setRefreshing(false);
          return false;
        }
        console.log('2 check');
        editArr.push({
          product_description: displayProducts[i].product_description,
          sku: displayProducts[i].sku,
          price: displayProducts[i].price,
          special: '',
          status: displayProducts[i].status,
          product_id: displayProducts[i].product_id,
          product_category: [cats.category_id],
          product_special: [
            {
              customer_group_id: '1',
              priority: '',
              price: displayProducts[i].special,
              date_start: '',
              date_end: '',
            },
          ],
        });
      }
    }
    console.log('EditArray===', JSON.stringify(editArr));
    let updateAllProducts = await api.updateProduct(Token, editArr);
    loadproducts(cats.category_id, 1);
    setCurrentPage(1);
    console.log('updateallproducts', updateAllProducts.data);
    setRefreshing(false);
    setChecked(!checked);
  };
  const updatecat = async val => {
    setCurrentPage(1);
    setIsLoading(true);
    setChecked(true);
    setDisplayProducts();
    setVisibleCats(false);
    setCats(val);
    loadproducts(val?.id, 1);
    setIsLoading(false);
  };

  const updateSpecialProductRates = async (val, item, index) => {
    setIsLoadMore(false);
    item.special = val;
    item.formatted_price = item.formatted_price;
    item.isSpecialEdited = true;
  };

  const updateProductRates = async (val, item, index, textinputName) => {
    if (textinputName == 'Price') {
      console.log('Price');
      item.formatted_price = val;
      item.special = item.special;
      item.price = val;
    } else {
      console.log('SPECIAL');
      item.special = val;
      item.formatted_price = item.price;
    }
    item.isEdited = true;
    console.log('item===>', item);
  };

  const updateCategoryName = async val => {
    let data = cats;
    data.category_description[tabValue].name = val;
    setCats(data);
    setname(val);
    seteditObj(cats.category_description);
  };

  const loadCategoryNameByLanguage = async val => {
    // console.log("val", val);
    setTabValue(val.language_id);
    // console.log("cats", cats.category_description[val.language_id].name);
    setname(cats.category_description[val.language_id].name);
  };

  const updateProductStatus = async (item, status) => {
    // setIsLoading(true);
    // setDisplayProducts();
    setRefreshing(true);
    setDisplayProducts([]);
    const api = new DeveloperAPIClient();
    let Token = await AsyncStorage.getItem('token');
    let UserMobile = await AsyncStorage.getItem('MobileNumber');
    await api.getupdateProductStatus(UserMobile, item?.id, status, Token);
    // setRefreshing(false);
    setCurrentPage(1);
    setIsLoadMore(true);
    await loadproducts(item?.category_id);
    // setIsLoading(false);
  };
  const [data, setData] = React.useState({
    RBSheetDeleteCategory: {},
  });
  const [dataa, setDataa] = React.useState({
    RBSheet: {},
  });
  const [editProduct, seteditProduct] = React.useState({
    RBSheetEditProduct: {},
  });

  const onPress = () => {
    data?.RBSheetDeleteCategory?.close();
    dataa?.RBSheet?.open();
  };

  {
    /*const onEditCategoryClick = () => {
    // console.log("308", cats.category_description);
    // console.log("Language", languages[0].language_id);
    // setname(cats.category_description[languages[0].language_id].name);
    setTabValue(languages[0].language_id);
    // allSupportedLanguagesdata.data.Languages[0].language_id
    setname(cats.name);
    // console.log("310", name);
    seteditObj(cats.category_description);
    editProduct.RBSheetEditProduct.open();
  };*/
  }

  const _handleLoadMore = async () => {
    // console.log("Hey", isLoadMore);
    if (isLoadMore) {
      //console.log("isLoadmore", isLoadMore);
      dispatch(prodocutActions.loadproducts(cats.category_id, currentPage + 1));
      setCurrentPage(currentPage + 1);
    }
  };

  useEffect(() => {
    // if (isFocused == true) {
    getSupportedLanguages();
    const unsubscribe = navigation.addListener('focus', () => {
      setChecked(true);
      loadcats();
    });
    return unsubscribe;
  }, [cats]);

  const setIntialProducts = async () => {
    let localObject = products;
    for (let i = 0; i < localObject.length; i++) {
      localObject[i].isEdited = false;
    }
    setDisplayProducts(localObject);
  };

  const paginationProducts = async () => {
    let localObject = products;
    for (let i = 0; i < localObject.length; i++) {
      localObject[i].isEdited = false;
    }
    setDisplayProducts([...displayProducts, ...localObject]);
  };

  useEffect(() => {
    setIsLoading(true);
    if (products) {
      TotalCount();
      // console.log("OrdersData", products.length);
      if (productsCount == 10 || products.length < 10) {
        setIsLoadMore(false);
      } else {
        setIsLoadMore(true);
      }
      if (displayProducts) {
        paginationProducts();
      } else {
        setIntialProducts();
      }
    }
    setIsLoading(false);
  }, [products]);

  const renderItem = ({item, index}) => (
    <View>
      <TouchableOpacity
        onPress={() =>
          storeType === 'default' &&
          navigation.navigate('editProduct', {
            name: item.name,
            price: item.price,
            description: item.description,
            ID: item.id,
            categoryid: item.category_id,
            productObj: item,
            optionValues: item,
            product_image_path: item.image_path,
            productImage: item,
            productStatus: item.status,
            sku: item.sku,
            special: item.special,
            isProductSearched: searchedProduct,
          })
        }
        style={style.product}>
        <View>
          {/* <Text style={style.tagText}>{val.manufacturer}</Text> */}
        </View>
        {/* {item.image ==} */}
        <View style={{flexDirection: 'row'}}>
          <Image
            style={{
              width: 50,
              height: 100,
              flex: 0.7,
              borderRadius: 5,
              marginLeft: 10,
            }}
            source={{uri: item.image}}
          />
          <View style={{flexDirection: 'column', flex: 1.8}}>
            <View style={{flexDirection: 'row'}}>
              {/* <View
                style={{
                  backgroundColor: "#E6F6FF",
                  marginLeft: 10,
                }}
              >
                <Text
                  style={{
                    margin: 3,
                    fontFamily: "Poppins-Medium",
                  }}
                >
                  NEW{" "}
                </Text>
              </View> */}
              {/* <View style={{ flex: 1, alignItems: "flex-end" }}>
                <OptionsMenu
                  button={MoreIcon}
                  buttonStyle={{
                    width: 23,
                    height: 25.5,
                    resizeMode: "center",
                  }}
                  options={["Edit", "Delete"]}
                   actions={[editProduct, deletePost]}
                />
              </View> */}
            </View>
            <View style={{flexDirection: 'row'}}>
              <Text style={[style.tabText]}>{item.name}</Text>
              {!checked && (
                <View
                  style={{
                    alignItems: 'center',
                    marginLeft: 'auto',
                    marginTop: 15,
                    flexDirection: 'row',
                  }}>
                  <Text
                    style={{
                      color: '#21272E',
                      fontFamily: 'Poppins-Regular',
                    }}>
                    STOCK
                  </Text>
                  <Switch
                    value={item.status == '1' ? true : false}
                    onValueChange={() => {
                      updateProductStatus(item, item.status == '1' ? '0' : '1');
                    }}
                    color="#34A549"
                    marginLeft="7%"
                  />
                </View>
              )}
            </View>

            <View style={{flexDirection: 'row'}}>
              {checked ? (
                <View style={{flexDirection: 'row'}}>
                  {item.special != false && (
                    <Text
                      style={{
                        fontFamily: 'Poppins-SemiBold',
                        fontSize: 16,
                        marginLeft: 10,
                        marginTop: 10,
                        // textDecorationLine: 'line-through'
                      }}>
                      {parseInt(item.special).toFixed(2)}
                    </Text>
                  )}
                  <Text
                    style={{
                      fontFamily: 'Poppins-SemiBold',
                      fontSize: item.special != false ? 12 : 16,
                      marginLeft: 10,
                      color: item.special != false ? '#7d7675' : '#0f0f0f',
                      marginTop: item.special != false ? 13 : 10,
                      textDecorationLine:
                        item.special != false ? 'line-through' : '',
                    }}>
                    {item.formatted_price}
                  </Text>
                </View>
              ) : (
                <>
                  <TextInput
                    style={{
                      height: 40,
                      borderRadius: 5,
                      marginLeft: 10,
                      marginTop: 10,
                      borderWidth: 1,
                      borderColor: 'black',
                      paddingHorizontal: 5,
                      color: '#21272E',
                      fontSize: 12,
                      width: 80,
                    }}
                    defaultValue={
                      item.special != false
                        ? parseInt(item.special).toFixed(2)
                        : ''
                    }
                    autoCapitalize="none"
                    placeholder="Special Price"
                    placeholderTextColor="#9BA0A7"
                    returnKeyType="next"
                    keyboardType="numeric"
                    onChangeText={val =>
                      updateProductRates(val, item, index, 'Special')
                    }
                  />
                  <TextInput
                    style={{
                      height: 40,
                      borderRadius: 5,
                      marginLeft: 10,
                      marginTop: 10,
                      borderWidth: 1,
                      borderColor: 'black',
                      paddingHorizontal: 5,
                      color: '#21272E',
                      fontSize: 12,
                      width: 80,
                    }}
                    defaultValue={parseInt(item.price).toFixed(2)}
                    autoCapitalize="none"
                    placeholder="Price"
                    placeholderTextColor="#9BA0A7"
                    returnKeyType="next"
                    keyboardType="numeric"
                    onChangeText={val =>
                      updateProductRates(val, item, index, 'Price')
                    }
                  />
                </>
              )}
              {checked && (
                <View
                  style={{
                    alignItems: 'center',
                    marginLeft: 'auto',
                    marginTop: 15,
                    flexDirection: 'row',
                  }}>
                  <Text
                    style={{
                      color: '#21272E',
                      fontFamily: 'Poppins-Regular',
                    }}>
                    STOCK
                  </Text>
                  <Switch
                    value={item.status == '1' ? true : false}
                    onValueChange={() => {
                      updateProductStatus(item, item.status == '1' ? '0' : '1');
                    }}
                    color="#34A549"
                    marginLeft="7%"
                  />
                </View>
              )}
            </View>
          </View>
        </View>
      </TouchableOpacity>
      <Divider />
    </View>
  );
  const dropdownList = cattype?.map(item => ({
    name: item.name,
    id: item.category_id,
  }));

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator size="large" color="#51AF5E" />
      ) : cats?.name !== 0 ? (
        <
          // NetworkChecker
          // position="bottom"
          // duration={2000} // In milliseconds
          // notConnectedMessage="Not connected to Internet!"
          // notConnectedTextColor="white"
          // notConnectedBackgroundColor="red"
          // connectedMessage="Connected to Internet!"
          // connectedTextColor="white"
          // connectedBackgroundColor="green"
        >
          <StatusBar
            backgroundColor="#F4F5F7"
            barStyle={theme.dark ? 'light-content' : 'dark-content'}
          />
          <Header title={'Products'} />

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginVertical: responsiveHeight(1),
              paddingHorizontal: responsiveWidth(3),
            }}>
            <CustomDropDown
              isOpen={visibleCats}
              onToggle={() => setVisibleCats(!visibleCats)}
              data={dropdownList}
              selectedItem={selectedItem}
              onSelectItem={item => {
                setSelectedItem(item);
                updatecat(item);
              }}
              placeholder={decode(cats.name) || 'Select Category'}
              labelExtractor={item => item.name}
              maxHeight={200}
              dropdownContainerStyles={{
                width: responsiveWidth(80),
              }}
            />
            <View
              style={{
                flex: 1,
                alignItems: 'flex-end',
                // marginRight: responsiveWidth(3),
                // marginTop: 10,
                // marginLeft: 70,
              }}>
              <TouchableOpacity
                style={{marginRight: wp(2)}}
                activeOpacity={0.6}
                onPress={() => navigation.navigate('SearchScreen')}>
                <Feather name="search" size={25} color="#9CA3AF" />
              </TouchableOpacity>
            </View>
          </View>

          {/* <View
        style={{
          flexDirection: "row",
          marginLeft: "auto"
        }}
      >
        <TouchableOpacity onPress={() => navigation.navigate("AddItemScreen")}>
          <Text
            style={{
              color: "#2F6E8F",
              fontFamily: "Poppins-Medium",
              fontSize: 15,
              textAlign: "right",
              marginLeft: "2%",
              marginTop: 20,
            }}
          >
            Add Product{" "}
          </Text>
        </TouchableOpacity>
      </View> */}
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
                    fontFamily: 'Poppins-Medium',
                    flex: 1.8,

                    maxHeight: 80,
                  }}
                  numberOfLines={2}>
                  {cats.name != null ? decode(cats.name) : ''}
                </Text>
                {storeType === 'default' && (
                  <View style={{flex: 1, alignItems: 'flex-end'}}>
                    <TouchableOpacity
                      onPress={() => {
                        setChecked(!checked);
                      }}
                      style={{marginRight: 8}}>
                      {checked ? (
                        <Image
                          style={{
                            width: 25,
                            height: 25,
                            //resizeMode: "center",
                            // marginLeft: "80%",
                            flexDirection: 'row',
                          }}
                          source={require('../../assets/edit.png')}
                        />
                      ) : (
                        <TouchableOpacity onPress={() => updateAllProducts()}>
                          <Image
                            style={{
                              width: 25,
                              height: 25,
                              backgroundColor: '#ffff',
                              flexDirection: 'row',
                            }}
                            source={require('../../assets/save.png')}
                          />
                        </TouchableOpacity>
                      )}
                    </TouchableOpacity>
                  </View>
                )}

                {storeType === 'default' && (
                  <TouchableOpacity
                    onPress={() => data?.RBSheetDeleteCategory?.open()}>
                    <Image
                      style={{
                        width: 25,
                        height: 25,
                        flexDirection: 'row',
                      }}
                      source={require('../../assets/delete.png')}
                    />
                  </TouchableOpacity>
                )}
              </View>
              {displayProducts && (
                <View
                  style={{
                    marginBottom: 2,
                    flexDirection: 'row',
                    marginTop: 8,
                  }}>
                  <Text
                    style={{
                      fontSize: 12,
                      color: '#FFFFFF',
                      marginBottom: 5,
                      fontFamily: 'Poppins-Regular',
                      letterSpacing: 3,
                    }}>
                    {`${totalProducts} PRODUCTS`}
                  </Text>
                  {storeType === 'default' && (
                    <View
                      style={{
                        flexDirection: 'row',
                        marginLeft: 'auto',
                      }}>
                      <TouchableOpacity
                        onPress={() =>
                          navigation.navigate('AddItemScreen', {
                            productObject: productObj,
                            categoryObject: cats,
                          })
                        }>
                        <Text
                          style={{
                            color: 'white',
                            fontFamily: 'Poppins-Medium',
                            fontSize: 15,
                            textAlign: 'right',
                            marginLeft: '1%',
                          }}>
                          Add Product
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              )}
            </View>
          </View>

          {refreshing && <ActivityIndicator size="large" color="#51AF5E" />}
          <View style={{marginBottom: 170}}>
            {isLoading == true ? (
              <ActivityIndicator size="large" color="#51AF5E" />
            ) : (
              <>
                <View View style={styles.body}>
                  <FlatList
                    data={displayProducts}
                    numColumns={1}
                    nestedScrollEnabled={true}
                    renderItem={renderItem}
                    onEndReached={() => {
                      if (cats?.category_id) {
                        _handleLoadMore();
                      }
                    }}
                    onEndReachedThreshold={0.5}
                    contentContainerStyle={{marginBottom: hp(10)}}
                    // marginBottom={20}
                    ListEmptyComponent={
                      <Text
                        style={{
                          textAlign: 'center',
                          justifyContent: 'center',
                          marginTop: '70%',
                          color: '#000',
                        }}>
                        {!refreshing ? 'Loading...' : 'No Products Found'}
                      </Text>
                    }
                  />
                </View>
              </>
            )}
          </View>

          {/* {displayProducts && ( */}
          <RBSheet
            ref={ref => {
              data.RBSheetDeleteCategory = ref;
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
                Remove category
              </Text>
              <Text
                style={{
                  color: '#11151A',
                  fontSize: 14,
                  fontFamily: 'Poppins-Regular',
                  textAlign: 'center',
                }}>
                Are you sure you want to remove category {`\n`}
                {cats.name != null ? decode(cats.name) : ''} which has{' '}
                {`${
                  displayProducts?.length == undefined ||
                  displayProducts?.length <= 0
                    ? '0'
                    : displayProducts?.length
                } products`}{' '}
                in it?
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
          {/* // )} */}
          <RBSheet
            ref={ref => {
              dataa.RBSheet = ref;
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
              source={require('../../assets/category.png')}
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
                Category Removed from list
              </Text>
              <Text
                style={{
                  color: '#11151A',
                  fontSize: 14,
                  fontFamily: 'Poppins-Regular',
                  textAlign: 'center',
                  marginBottom: 5,
                }}>
                {cats.name != null ? decode(cats.name) : ''} was removed {`\n`}
                from the category list
              </Text>
              <CustomLoadingButton
                ref={c => (getStartedButton.getStartedButton = c)}
                width={328}
                height={52}
                title="Continue"
                titleFontSize={18}
                titleFontFamily="Poppins-Bold"
                titleColor="#FFF"
                backgroundColor="#34A549"
                borderRadius={4}
                onPress={() => {
                  deleteCategory();
                }}
              />
            </View>
          </RBSheet>

          <RBSheet
            ref={ref => {
              editProduct.RBSheetEditProduct = ref;
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
              Edit Category
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
                        style.chip,
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
                          style.chipText,
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
              value={name}
            />
            <CustomLoadingButton
              ref={c => (getStartedButton.getStartedButton = c)}
              width={328}
              height={52}
              title="Continue"
              titleFontSize={18}
              titleFontFamily="Poppins-Bold"
              titleColor="#FFF"
              backgroundColor="#34A549"
              borderRadius={4}
              onPress={() => {
                updateCategory();
              }}
            />
          </RBSheet>
        </>
      ) : (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text>No categories founds to display products</Text>
        </View>
      )}
    </View>
  );
};

export default ProductScreen;

const style = StyleSheet.create({
  tabText: {
    color: '#2B2520',
    fontFamily: 'Poppins-Medium',
    flex: 1.8,
    textAlign: 'left',
    marginLeft: 10,
    marginTop: 10,
    fontSize: 14,
    // marginTop: 5,
  },
  product: {
    backgroundColor: 'white',
    paddingTop: 20,
    paddingBottom: 10,
  },
  price: {
    fontFamily: 'Lato-Bold',
    fontSize: 20,
    marginLeft: '17%',
  },
  tagText: {
    color: '#84694D',
    fontFamily: 'Lato-Regular',
  },
  chip: {
    padding: 5,
    alignItems: 'center',
    marginHorizontal: 10,
  },
  chipText: {
    color: '#0F0F0F',
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 15,
    fontFamily: 'Poppins-SemiBold',
  },
});
