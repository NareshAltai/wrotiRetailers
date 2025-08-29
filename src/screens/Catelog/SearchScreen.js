import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  Keyboard,
  ScrollView,
  Image,
  FlatList,
  ActivityIndicator,
} from 'react-native';
// import OptionsMenu from "wroti-react-native-option-menu";
import Icon from 'react-native-vector-icons/EvilIcons';
import DeveloperAPIClient from '../../state/middlewares/DeveloperAPIClient';
import Toast from 'react-native-simple-toast';
import {Divider, Switch} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import style from '../Home/Styles';

const SearchScreen = ({navigation, route}) => {
  const [searchkey, setsearchkey] = React.useState();
  const [searchresults, setsearchresults] = React.useState();
  const [emptySearchResults, setEmptySearchResults] = React.useState(false);
  const [refreshing, setRefreshing] = React.useState(false);

  const [checked, setChecked] = React.useState(true);

  const MoreIcon = require('../../assets/menu3x.png');
  const [searchedProduct, setSearchedProduct] = React.useState(true);
  const [isProductSearched, setProductSearched] = React.useState(true);
  const [storeType, setStoreType] = React.useState();

  const updateProductStatus = async (id, status) => {
    setRefreshing(true);
    const api = new DeveloperAPIClient();
    let UserMobile = await AsyncStorage.getItem('MobileNumber');
    let Token = await AsyncStorage.getItem('token');
    let updateProductStatus = await api.getupdateProductStatus(
      UserMobile,
      id,
      status,
      Token,
    );
    setRefreshing(false);
    searchproduct(searchkey);
  };

  const searchproduct = async searchkey => {
    // setRefreshing(true);
    setsearchresults();
    const api = new DeveloperAPIClient();
    // let search_key = searchkey;
    let UserMobile = await AsyncStorage.getItem('MobileNumber');
    let Token = await AsyncStorage.getItem('token');
    let store_type = await AsyncStorage.getItem('store_type');
    setStoreType(store_type);
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
      //Toast.showWithGravity("No Products Found", Toast.LONG, Toast.BOTTOM);
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

  useEffect(() => {
    setTimeout(async () => {
      if (
        route != undefined &&
        (route?.params?.isProductSearched == true) == true
      ) {
        searchproduct(route.params.searchkey);
      }
    });
  }, [route]);

  const searchResultsList = ({item, index}) => (
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
            searchKey: searchkey,
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
                      updateProductStatus(
                        item.id,
                        item.status == '1' ? '0' : '1',
                      );
                    }}
                    color="#34A549"
                    marginLeft="7%"
                  />
                </View>
              )}
            </View>

            <View style={{flexDirection: 'row'}}>
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
                      updateProductStatus(
                        item.id,
                        item.status == '1' ? '0' : '1',
                      );
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

  const onSubmit = val => {
    Keyboard.dismiss();
    searchproduct(searchkey);
  };
  return (
    <View style={styles.container}>
      <View>
        <SafeAreaView>
          <View
            style={{
              borderWidth: 1,
              backgroundColor: '#fff',
              borderColor: '#337D3E',
              width: '95%',
              borderRadius: 5,
              flexDirection: 'row',
              height: 50,
              marginVertical: 10,
              marginHorizontal: 10,
            }}>
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => navigation.goBack()}
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                marginHorizontal: 10,
              }}>
              <Image
                style={{width: 18, height: 18}}
                source={require('../../assets/left-arrow.png')}
              />
            </TouchableOpacity>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                // marginBottom: 5,
              }}>
              <TextInput
                autoFocus={true}
                style={{
                  flex: 1.8,
                  fontFamily: 'Poppins-Regular',
                  fontSize: 12,
                  width: 200,
                }}
                placeholder="Search for Products and more"
                underlineColorAndroid="transparent"
                onChangeText={val => updateSearchName(val)}
                // {(val) => updateCategoryName(val)}
                value={searchkey}
                onSubmitEditing={() => onSubmit()}
                // maxLength={20}
                placeholderTextColor={'#337D3E'}
              />
            </View>
            <View
              style={{
                marginLeft: 'auto',
                flexDirection: 'row',
                marginRight: 15,
              }}>
              <TouchableOpacity
                style={{justifyContent: 'center', alignItems: 'center'}}
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
              <TouchableOpacity
                style={{justifyContent: 'center', alignItems: 'center'}}
                onPress={() => searchproduct(searchkey)}>
                <Image
                  style={{
                    width: 18,
                    height: 18,
                    // resizeMode: "center",
                    // marginBottom: 5,
                  }}
                  source={require('../../assets/find.png')}
                />
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>

        {isProductSearched == true && (
          <View style={styles.body}>
            {refreshing && <ActivityIndicator size="large" color="#51AF5E" />}
            {emptySearchResults != true ? (
              <View style={{marginBottom: 180}}>
                <FlatList
                  data={searchresults}
                  //onEndReached={() => _handleLoadMore()}
                  renderItem={searchResultsList}
                />
              </View>
            ) : (
              <Text
                style={{
                  // flex: 1,
                  textAlign: 'center',
                  justifyContent: 'center',
                  marginTop: '80%',
                }}>
                No Products Found
              </Text>
            )}
          </View>
        )}
      </View>
    </View>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  // container: {
  //   flex: 1,
  // },
  header: {
    backgroundColor: '#fff',
  },
  inputContainer: {
    marginVertical: 10,
    marginHorizontal: 10,
  },
  searchResultTextView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 10,
    marginVertical: 10,
  },
  heading: {
    fontSize: 14,
    width: 200,
  },
  sectionStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 0.5,
    borderColor: '#333333',
    height: 40,
    borderRadius: 30,
    marginVertical: 10,
  },
  imageStyle: {
    margin: 5,
    paddingLeft: 5,
  },
});
