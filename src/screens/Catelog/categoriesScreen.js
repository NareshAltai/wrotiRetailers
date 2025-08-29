import React, {useState, useEffect} from 'react';
import {
  Text,
  StyleSheet,
  View,
  FlatList,
  Image,
  StatusBar,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Button,
  Switch,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Divider} from 'react-native-paper';
import DeveloperAPIClient from '../../state/middlewares/DeveloperAPIClient';
import {useTheme} from '@react-navigation/native';
import RBSheet from 'react-native-raw-bottom-sheet';
import {decode} from 'html-entities';
import Toast from 'react-native-simple-toast';
// import ImagePicker from "../../components/image";
import ImageUpload from '../../components/addImageComponentCategory';
import CustomLoadingButton from '../../components/CustomLoadingButton';
// import AnimateLoadingButton from "react-native-animate-loading-button";
// import {Switch} from 'react-native-switch';

const CategoryScreen = ({navigation}) => {
  const [cats, setCats] = useState();
  const [data, setData] = React.useState({
    getStartedButton: {},
  });
  const [dataaa, setDataaa] = React.useState({
    getEditButton: {},
  });
  const theme = useTheme();
  const [deleteCategoryRBSheet, setDeleteCategoryRBSheet] = React.useState({
    RBSheetDeleteCategory: {},
  });
  const [editProduct, seteditProduct] = React.useState({
    RBSheetEditCategory: {},
  });
  const [addNewCategory, setAddNewCategory] = React.useState({
    RBSheetAddNewCategory: {},
  });

  const [categoryObj, setCategoryObj] = React.useState();
  const [addNewCategoryName, setAddNewCategoryName] = React.useState();
  const [path, setpath] = React.useState();
  const [addNewDescription, setAddNewDescription] = React.useState();
  const [updateCategoryName, setUpdateCategoryName] = React.useState();
  const [updateDescription, setUpdateDescription] = React.useState();
  const [categoryName, setCategoryName] = React.useState();
  const [categoryId, setCategoryId] = React.useState();
  const [productImage, setProductImage] = React.useState();
  const [existingImage, setExistingImage] = React.useState();
  const [categoryStatus, setCategoryStatus] = React.useState();
  const [addNewCategoryStatus, setAddNewCategoryStatus] = React.useState(true);
  const [store_type, setStore_type] = React.useState();
  const [isLoading, setIsLoading] = React.useState(false);

  const loadcats = async () => {
    setIsLoading(true);
    const api = new DeveloperAPIClient();
    let Token = await AsyncStorage.getItem('token');
    let UserMobile = await AsyncStorage.getItem('MobileNumber');
    let store_type = await AsyncStorage.getItem('store_type');
    setStore_type(store_type);
    let allcatsdata = await api.getcats(UserMobile, Token);
    console.log('categories', JSON.stringify(allcatsdata.data));
    if (allcatsdata.data.success == true) {
      setCats(allcatsdata.data.category_info);
    }
    setIsLoading(false);
  };

  const onEditCategoryClick = item => {
    console.log('Item.Cateogry_id', item);
    setCategoryObj(item);
    setUpdateCategoryName(item.name);
    setUpdateDescription(item.description);
    setCategoryId(item.category_id);
    setCategoryStatus(item.status);
    console.log('Item===>', item);
    setExistingImage(
      item.image_path
        ? item.image_path
        : 'https://ocuat.wroti.app/image/cache/no_image-40x40.png',
    );
    setProductImage(
      item.image
        ? item.image
        : 'https://ocuat.wroti.app/image/cache/no_image-40x40.png',
    );
    editProduct.RBSheetEditCategory.open();
  };

  // const onAddNewCategoryClick = () => {
  //   addNewCategory.RBSheetAddNewCategory.open();
  // };

  // const updateCategoryName = async (val) => {
  //   let data = cats;
  //   data.category_description[tabValue].name = val;
  //   setCats(data);
  //   setname(val);
  //   seteditObj(cats.category_description);
  //   // console.log("catsObj===>", cats.category_description);
  // };

  const addCategory = async () => {
    data.getStartedButton.showLoading(true);
    if (addNewCategoryName == null || addNewCategoryName.trim() == '') {
      Toast.showWithGravity(
        'Category Name Cannot be Empty',
        Toast.LONG,
        Toast.BOTTOM,
      );
      data.getStartedButton.showLoading(false);
      return false;
    }
    const api = new DeveloperAPIClient();
    let Token = await AsyncStorage.getItem('token');
    let status = '';
    if (addNewCategoryStatus) {
      status = 1;
    } else {
      status = 0;
    }
    // let category_description = {};
    // Object.keys(editCategoryObject).map((val, i) => {
    //   category_description[val] = {
    //     name: editCategoryObject[val].name,
    //     description: "",
    //     meta_title: "",
    //     meta_description: "",
    //     meta_keyword: "",
    //     tag: "",
    //   };
    // });
    // console.log()
    let productDescription =
      addNewDescription == undefined ? '' : addNewDescription;
    let allcategorydata = await api.getAddNewCateogry(
      // category_description,
      Token,
      addNewCategoryName,
      productDescription,
      path || '',
      status,
    );
    console.log('allcategorydataAdd-===', allcategorydata);
    if (allcategorydata.data.success == true) {
      Toast.showWithGravity(
        'Category Created successfully',
        Toast.LONG,
        Toast.BOTTOM,
      );
      setAddNewCategoryName('');
      setAddNewDescription('');
      setpath('');
      loadcats();
      addNewCategory.RBSheetAddNewCategory.close();
    } else {
      if (productDescription == undefined) {
        Toast.showWithGravity(
          'Category Created successfully',
          Toast.LONG,
          Toast.BOTTOM,
        );
        setAddNewCategoryName('');
        setAddNewDescription('');
        setpath('');
        loadcats();
        addNewCategory.RBSheetAddNewCategory.close();
      }
    }
  };

  const updateCategory = async () => {
    console.log('cate', categoryStatus);
    dataaa.getEditButton.showLoading(true);
    if (updateCategoryName.trim() == '') {
      Toast.showWithGravity(
        'Category Name Cannot be Empty',
        Toast.LONG,
        Toast.BOTTOM,
      );
      dataaa.getEditButton.showLoading(false);
      return false;
    }
    let image_path = existingImage != undefined ? existingImage : path;
    let Status = categoryStatus == false ? 0 : 1;
    //setRefreshing(true);
    const api = new DeveloperAPIClient();
    let Token = await AsyncStorage.getItem('token');
    let category_description = {};
    // console.log("editObject", editObj);
    // Object.keys(editObj).map((val, i) => {
    // console.log("val===", val);
    //   category_description[val] = {
    //     name: editObj[val].name,
    //     description: "",
    //     meta_title: "",
    //     meta_description: "",
    //     meta_keyword: "",
    //     tag: "",
    //   };
    // });
    let allcategorydata = await api.updateCategory(
      Token,
      categoryId,
      updateCategoryName,
      image_path == undefined ? productImage : image_path,
      updateDescription,
      Status,
      //   category_description
    );

    if (allcategorydata != undefined) {
      Toast.showWithGravity(
        'Category updated successfully',
        Toast.LONG,
        Toast.BOTTOM,
      );
      console.log('allcategorydata.data', allcategorydata);
      loadcats();
      setAddNewCategoryName('');
      setAddNewDescription('');
    }
    editProduct.RBSheetEditCategory.close();
    dataaa.getEditButton.showLoading(false);
    //setRefreshing(false);
  };

  const onDeleteCategory = async item => {
    console.log('ItemFor===', item);
    setCategoryName(item.name);
    setCategoryId(item.category_id);
    deleteCategoryRBSheet.RBSheetDeleteCategory.open();
  };

  const deleteCategory = async () => {
    setCats();
    const api = new DeveloperAPIClient();
    let Token = await AsyncStorage.getItem('token');
    let allcategorydata = await api.deleteCategory(Token, categoryId);
    if (allcategorydata.data != undefined) {
      Toast.showWithGravity(
        'Category deleted successfully',
        Toast.LONG,
        Toast.BOTTOM,
      );
    }

    loadcats();
    setCategoryName();
    setCategoryId();
    setProductImage();
    deleteCategoryRBSheet.RBSheetDeleteCategory.close();
  };

  const updateCategoryStatus = async (item, status) => {
    Toast.showWithGravity(
      'Updating Category, please wait',
      Toast.LONG,
      Toast.BOTTOM,
    );
    //setRefreshing(true);
    const api = new DeveloperAPIClient();
    let Token = await AsyncStorage.getItem('token');
    let image_path =
      item.image == ''
        ? 'https://ocuat.wroti.app/image/cache/no_image-40x40.png'
        : item.image_path;
    let categoryName = item.name;
    let description = item.description;
    let categoryId = item.category_id;
    let allcategorydata = await api.updateCategory(
      Token,
      categoryId,
      categoryName,
      image_path,
      description,
      status,
      //   category_description
    );

    loadcats();
    console.log('allCategoryData', allcategorydata);
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadcats();
    });
    return unsubscribe;
  }, []);

  const renderItem = ({item, index}) => (
    <View style={styles.category}>
      <View style={{flexDirection: 'row', marginBottom: 10}}>
        <Image
          style={{
            width: 50,
            height: 100,
            flex: 0.7,
            borderRadius: 5,
            marginLeft: 10,
          }}
          source={{
            uri: item.image
              ? item.image
              : 'https://highoncafeocuat.wroti.app/image/cache/no_image-76x76.png',
          }}
        />
        <View style={{flexDirection: 'column', flex: 1.8}}>
          <View style={{flexDirection: 'row'}}>
            <Text
              style={{
                color: '#2B2520',
                fontFamily: 'Poppins-Medium',
                textAlign: 'left',
                marginLeft: 10,
                marginTop: 10,
                fontSize: 14,
              }}>
              Id :
            </Text>
            <Text style={[styles.tabText]}>{item.category_id}</Text>
            <View style={{marginRight: '6%', marginTop: 5}}>
              <Switch
                value={item.status == 1 ? true : false}
                onValueChange={() => {
                  updateCategoryStatus(item, item.status == 0 ? 1 : 0);
                }}
                color="#34A549"
                barHeight={18}
                circleSize={20}
              />
            </View>
          </View>
          <View style={{flexDirection: 'row'}}>
            <Text
              style={{
                color: '#2B2520',
                fontFamily: 'Poppins-Medium',
                textAlign: 'left',
                marginLeft: 10,
                marginTop: 7,
                fontSize: 14,
              }}>
              Name :
            </Text>
            <Text
              style={{
                color: '#2B2520',
                fontFamily: 'Poppins-Medium',
                flex: 1.8,
                textAlign: 'left',
                marginLeft: 10,
                marginTop: 8,
                fontSize: 14,
                // marginTop: 5,
              }}>
              {item.name}
            </Text>
          </View>
          <View style={{flexDirection: 'row'}}>
            <Text
              style={{
                color: '#2B2520',
                fontFamily: 'Poppins-Medium',
                textAlign: 'left',
                marginLeft: 10,
                marginTop: 7,
                fontSize: 14,
              }}>
              Description :
            </Text>
            <Text
              style={{
                color: '#2B2520',
                fontFamily: 'Poppins-Medium',
                flex: 1.8,
                textAlign: 'left',
                marginLeft: 10,
                marginTop: 8,
                fontSize: 12,
                // marginTop: 5,
              }}>
              {item.description ? item.description : 'No Description Available'}
            </Text>
          </View>
          {store_type === 'default' && (
            <View
              style={{flexDirection: 'row', marginLeft: 'auto', padding: 5}}>
              <TouchableOpacity
                onPress={() => onEditCategoryClick(item)}
                style={{marginRight: 8}}>
                <Image
                  style={{
                    width: 25,
                    height: 25,
                    flexDirection: 'row',
                  }}
                  source={require('../../assets/edit.png')}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => onDeleteCategory(item)}
                style={{marginRight: 8}}>
                <Image
                  style={{
                    width: 25,
                    height: 25,
                    flexDirection: 'row',
                  }}
                  source={require('../../assets/delete.png')}
                />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
      <Divider />

      <RBSheet
        ref={ref => {
          deleteCategoryRBSheet.RBSheetDeleteCategory = ref;
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
            {item.name != null ? decode(categoryName) : ''} ?
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
            onPress={() => deleteCategory()}>
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
          editProduct.RBSheetEditCategory = ref;
        }}
        height={450}
        openDuration={250}
        customStyles={{
          container: {
            // justifyContent: "center",
            borderTopRightRadius: 30,
            borderTopLeftRadius: 30,
          },
        }}>
        <ScrollView>
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
            onChangeText={val => setUpdateCategoryName(val)}
            value={updateCategoryName}
          />
          <Text
            style={{
              color: '#21272E',
              fontFamily: 'Poppins-SemiBold',
              fontSize: 14,
              marginVertical: 10,
              marginHorizontal: 10,
            }}>
            Image Upload
          </Text>
          <ImageUpload
            productImage={
              productImage
                ? productImage
                : 'https://highoncafeocuat.wroti.app/image/cache/no_image-76x76.png'
            }
            setProductImage={setProductImage}
            setExistingImage={setExistingImage}
            pathUpdate={setpath}
          />
          <Text
            style={{
              color: '#21272E',
              fontFamily: 'Poppins-SemiBold',
              fontSize: 14,
              marginVertical: 10,
              marginHorizontal: 10,
            }}>
            Category Description
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                height: 100,
                paddingVertical: 10,
                textAlignVertical: 'top',
              },
            ]}
            autoCapitalize="none"
            placeholder=""
            placeholderTextColor="#9BA0A7"
            onChangeText={val => setUpdateDescription(val)}
            value={updateDescription}
          />
          <View style={{flexDirection: 'row', marginTop: 5}}>
            <Text
              style={{
                color: '#21272E',
                fontFamily: 'Poppins-SemiBold',
                fontSize: 14,
                marginVertical: 10,
                marginHorizontal: 10,
              }}>
              Status :{' '}
            </Text>
            <View style={{marginTop: 11}}>
              <Switch
                value={categoryStatus == 0 ? false : true}
                onValueChange={() => setCategoryStatus(!categoryStatus)}
                color="#34A549"
                marginLeft="7%"
                circleActiveColor="#34A549"
                // style={{ marginTop: 10 }}
                barHeight={18}
                circleSize={20}
              />
            </View>
          </View>
          <View style={styles.button}>
            <CustomLoadingButton
              ref={c => (dataaa.getEditButton = c)}
              width={328}
              height={52}
              title="Update"
              titleFontSize={18}
              titleFontFamily="Poppins-Bold"
              titleColor="#FFF"
              backgroundColor="#34A549"
              borderRadius={4}
              onPress={() => {
                updateCategory();
              }}
            />
          </View>
        </ScrollView>
      </RBSheet>
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
        <View style={{marginLeft: 5}}>
          <Text
            style={{
              color: '#0F0F0F',
              fontFamily: 'Poppins-Bold',
              fontSize: 16,
              marginTop: 2,
            }}>
            Categories
          </Text>
        </View>
        {store_type === 'default' && (
          <View
            style={{
              flexDirection: 'row',
              marginLeft: 'auto',
            }}>
            <TouchableOpacity
              onPress={() => addNewCategory.RBSheetAddNewCategory.open()}>
              <Text
                style={{
                  color: '#1B6890',
                  fontFamily: 'Poppins-Medium',
                  fontSize: 15,
                  textAlign: 'right',
                  marginLeft: '1%',
                }}>
                Add New Category
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      {isLoading == true ? (
        <ActivityIndicator size="large" color="#51AF5E" />
      ) : (
        <FlatList data={cats} renderItem={renderItem} />
      )}

      <RBSheet
        ref={ref => {
          addNewCategory.RBSheetAddNewCategory = ref;
        }}
        height={480}
        openDuration={250}
        customStyles={{
          container: {
            // justifyContent: "center",
            borderTopRightRadius: 30,
            borderTopLeftRadius: 30,
          },
        }}>
        <ScrollView>
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
          {/*<Text
          style={{
            fontFamily: "Poppins-Regular",
            //fontWeight: "bold",
            fontSize: 12,
            color: "#21272E",
            marginVertical: 10,
            marginHorizontal: 10,
            textAlign: "left",
          }}
        >
          Language
        </Text> */}
          <Divider />
          <View>
            <Text
              style={{
                color: '#21272E',
                fontFamily: 'Poppins-SemiBold',
                fontSize: 14,
                marginVertical: 10,
                marginHorizontal: 10,
              }}>
              New Category Name
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
              autoCapitalize="none"
              placeholder=""
              placeholderTextColor="#9BA0A7"
              returnKeyType="next"
              onChangeText={val => setAddNewCategoryName(val)}
              value={addNewCategoryName}
            />
            <Text
              style={{
                color: '#21272E',
                fontFamily: 'Poppins-SemiBold',
                fontSize: 14,
                marginVertical: 10,
                marginHorizontal: 10,
              }}>
              Upload Image
            </Text>
            <ImageUpload
              setProductImage={setProductImage}
              setExistingImage={setExistingImage}
              pathUpdate={setpath}
            />

            <Text
              style={{
                color: '#21272E',
                fontFamily: 'Poppins-SemiBold',
                fontSize: 14,
                marginVertical: 10,
                marginHorizontal: 10,
              }}>
              Category Description
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  height: 100,
                  paddingVertical: 10,
                  textAlignVertical: 'top',
                },
              ]}
              autoCapitalize="none"
              placeholder=""
              placeholderTextColor="#9BA0A7"
              returnKeyType="next"
              onChangeText={val => setAddNewDescription(val)}
              value={addNewDescription}
            />
          </View>
          <View style={{flexDirection: 'row', marginTop: 5}}>
            <Text
              style={{
                color: '#21272E',
                fontFamily: 'Poppins-SemiBold',
                fontSize: 14,
                marginVertical: 10,
                marginHorizontal: 10,
              }}>
              Status :{' '}
            </Text>
            <View style={{marginTop: 11}}>
              <Switch
                value={addNewCategoryStatus}
                onValueChange={() =>
                  setAddNewCategoryStatus(!addNewCategoryStatus)
                }
                color="#34A549"
                marginLeft="7%"
                circleActiveColor="#34A549"
                // style={{ marginTop: 10 }}
                barHeight={18}
                circleSize={20}
              />
            </View>
          </View>
          <View style={styles.button}>
            <CustomLoadingButton
              ref={c => (data.getStartedButton = c)}
              width={328}
              height={52}
              title="Add New Category"
              titleFontSize={18}
              titleFontFamily="Poppins-Bold"
              titleColor="#FFF"
              backgroundColor="#34A549"
              borderRadius={4}
              onPress={() => {
                addCategory();
              }}
            />
          </View>
        </ScrollView>
      </RBSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
  category: {
    backgroundColor: '#F2F7F9',
    paddingTop: 10,
    paddingBottom: 10,
  },
  tagText: {
    color: '#84694D',
    fontFamily: 'Lato-Regular',
  },
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
  input: {
    width: '90%',
    height: 44,
    backgroundColor: '#f1f3f6',
    borderRadius: 6,
    paddingHorizontal: 10,
    marginLeft: 15,
  },
  button: {
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 10,
    // borderColor:'black'
  },
});

export default CategoryScreen;
