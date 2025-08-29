import React, {useState, useEffect} from 'react';
import {
  TextInput,
  View,
  Button,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Image,
  Text,
  ScrollView,
  Picker,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Divider, Menu} from 'react-native-paper';
import DeveloperAPIClient from '../../state/middlewares/DeveloperAPIClient';
import AddImageComponent from '../../components/addImageComponent';
import {useTheme} from '@react-navigation/native';
import Toast from 'react-native-simple-toast';
// import AnimateLoadingButton from "react-native-animate-loading-button";
import ImagePicker from 'react-native-image-picker';
import CustomLoadingButton from '../../components/CustomLoadingButton';

const addOptionScreen = ({navigation, route}) => {
  const [inputs, setInputs] = useState(['']);
  const [data, setData] = useState([]);
  const [screenName, setScreenName] = useState();
  const [optionName, setOptionName] = useState();
  const [sortOrder, setSortOrder] = useState();
  const [selectedOptionType, setSelectedOptionType] = useState('select');
  const [visibleCats, setVisibleCats] = React.useState(false);
  const theme = useTheme();
  const [onAddNewInput, setOnAddNewInput] = useState([]);
  const [imagePath, setImagePath] = useState();
  const [loader, setLoader] = React.useState(false);

  const [button, setButton] = React.useState({
    updateOptionButton: {},
  });

  const handleAddTextInput = () => {
    console.log('test');
    let array = [...data];
    setData([]);
    array.push({
      option_value_description: {
        1: {
          name: '',
        },
        2: {
          name: '',
        },
        3: {
          name: '',
        },
      },
      sort_order: '',
      image: '',
      option_value_id: '',
      image_path: '',
    });
    console.log(array);
    setData(array);
    console.log('DATA+++++', JSON.stringify(data));
  };

  const removeInput = (index, input) => {
    console.log('Data', JSON.stringify(data));
    let array = [...data];
    array.splice(index, 1);
    setData(array);
  };

  // .sort()
  const optionTypeData = [
    'select',
    'radio',
    'checkbox',
    'text',
    'textArea',
    'file',
    'date',
    'time',
    'datetime',
  ];

  const updatecat = async val => {
    setVisibleCats(false);
    setSelectedOptionType(val);
    setData([]);
  };

  const getOptionsDataById = async () => {
    setScreenName('Edit Option Screen');
    setOptionName(route.params.optionObject.name);
    setSelectedOptionType(route.params.optionObject.type);
    setSortOrder(route.params.optionObject.sort_order);
    let optionId = route.params.optionObject.option_id;
    let api = new DeveloperAPIClient();
    let UserMobile = await AsyncStorage.getItem('MobileNumber');
    let Token = await AsyncStorage.getItem('token');
    let addOptionsData = await api.getOptionDetailsByOptionId(
      UserMobile,
      Token,
      optionId,
    );
    if (addOptionsData.data.success == true) {
      console.log(
        'addOptionsData',
        JSON.stringify(addOptionsData.data.optiondata),
      );
      setData(addOptionsData.data.optiondata);
      console.log(
        'addOptionsData.data.optiondata',
        JSON.stringify(addOptionsData.data.optiondata),
      );
    }
  };

  const editOption = async () => {
    const pattern = /^\d+-$./;
    button.updateOptionButton.showLoading(true);
    let stringNum = sortOrder?.toString().replace(/ /g, '');
    let sortNumber = parseInt(stringNum);
    if (
      optionName?.trim() == '' ||
      optionName == undefined ||
      optionName.length <= 0
    ) {
      Toast.showWithGravity(
        'Option Name Cannot be Empty',
        Toast.LONG,
        Toast.BOTTOM,
      );
      button.updateOptionButton.showLoading(false);
      return false;
    }

    if (
      !isNaN(optionName[0]) ||
      !/^[a-zA-Z][a-zA-Z0-9\s]*$/.test(optionName) ||
      !/^[a-zA-Z][a-zA-Z0-9\s]*$/.test(optionName[0]) ||
      optionName[0] === '-' ||
      optionName[0] === '@' ||
      optionName[0] === '.'
    ) {
      Toast.showWithGravity(
        'Option name should starts with alphabets.',
        Toast.LONG,
        Toast.BOTTOM,
      );
      button.updateOptionButton.showLoading(false);
      return false;
    }

    if (
      sortOrder?.trim() == '' ||
      sortOrder == undefined ||
      sortOrder.length <= 0
    ) {
      Toast.showWithGravity(
        'Sort Order Cannot be Empty',
        Toast.LONG,
        Toast.BOTTOM,
      );
      button.updateOptionButton.showLoading(false);
      return false;
    }

    if (
      pattern.test(sortOrder) ||
      pattern.test(sortOrder[0]) ||
      sortOrder[0] === '-' ||
      sortOrder[0] === '.'
    ) {
      Toast.showWithGravity(
        "Sort Order field doesn't support special characters",
        Toast.LONG,
        Toast.BOTTOM,
      );
      button.updateOptionButton.showLoading(false);
      return false;
    }

    for (let i = 0; i < data.length; i++) {
      if (
        data[i].option_value_description[1].name?.trim() == '' ||
        data[i].option_value_description[1].name.length <= 0
      ) {
        Toast.showWithGravity(
          'Option Value Name Cannot be Empty',
          Toast.LONG,
          Toast.BOTTOM,
        );
        button.updateOptionButton.showLoading(false);
        return false;
      }
      if (
        !isNaN(data[i].option_value_description[1].name[0]) ||
        !/^[a-zA-Z][a-zA-Z0-9\s]*$/.test(
          data[i].option_value_description[1].name,
        ) ||
        !/^[a-zA-Z][a-zA-Z0-9\s]*$/.test(
          data[i].option_value_description[1].name[0],
        ) ||
        data[i].option_value_description[1].name[0] === '-' ||
        data[i].option_value_description[1].name[0] === '.'
      ) {
        Toast.showWithGravity(
          'Option value name should starts with alphabets.',
          Toast.LONG,
          Toast.BOTTOM,
        );
        button.updateOptionButton.showLoading(false);
        return false;
      }
      if (data[i].sort_order?.trim() == '' || data[i].sort_order.length <= 0) {
        Toast.showWithGravity(
          'Sort Order Value Cannot be Empty',
          Toast.LONG,
          Toast.BOTTOM,
        );
        button.updateOptionButton.showLoading(false);
        return false;
      }
      if (
        pattern.test(data[i].sort_order) ||
        pattern.test(data[i].sort_order[0]) ||
        data[i].sort_order[0] === '-'
      ) {
        Toast.showWithGravity(
          "Option Value Sort Order field doesn't support special characters",
          Toast.LONG,
          Toast.BOTTOM,
        );
        button.updateOptionButton.showLoading(false);
        return false;
      }
    }
    if (selectedOptionType == undefined) {
      Toast.showWithGravity(
        'Please Select Option Type',
        Toast.LONG,
        Toast.BOTTOM,
      );
      button.updateOptionButton.showLoading(false);
      return false;
    }
    if (
      selectedOptionType === 'checkbox' ||
      selectedOptionType === 'select' ||
      selectedOptionType === 'radio'
    ) {
      if (data.length <= 0) {
        Toast.showWithGravity(
          'Please add Option Values',
          Toast.LONG,
          Toast.BOTTOM,
        );
        button.updateOptionButton.showLoading(false);
        return false;
      }
    }
    for (let i = 0; i < data.length; i++) {
      setData(prev => {
        let array = [...prev];
        array[i].image = array[i].image_path;
        return array;
      });
    }
    console.log('INPUTS', onAddNewInput);
    let api = new DeveloperAPIClient();
    let UserMobile = await AsyncStorage.getItem('MobileNumber');
    let Token = await AsyncStorage.getItem('token');
    let optionId = route.params.optionObject.option_id;
    let editOptionsData = await api.getEditOption(
      optionName,
      selectedOptionType,
      sortNumber,
      data,
      optionId,
      UserMobile,
      Token,
    );
    button.updateOptionButton.showLoading(false);
    if (editOptionsData.data.success === true) {
      Toast.showWithGravity(
        'Option Updated Successfully',
        Toast.LONG,
        Toast.BOTTOM,
      );
      button.updateOptionButton.showLoading(false);
      navigation.goBack();
    }
    console.log('addOptionsData', editOptionsData);
  };

  const addNewOption = async () => {
    const pattern = /^\d+-$/;
    button.updateOptionButton.showLoading(true);
    let stringNum = sortOrder?.toString().replace(/ /g, '');
    let sortNumber = parseInt(stringNum);
    if (
      optionName?.trim() == '' ||
      optionName == undefined ||
      optionName.length <= 0
    ) {
      Toast.showWithGravity(
        'Option Name Cannot be Empty',
        Toast.LONG,
        Toast.BOTTOM,
      );
      button.updateOptionButton.showLoading(false);
      return false;
    }

    if (
      !isNaN(optionName[0]) ||
      !/^[a-zA-Z][a-zA-Z0-9\s]*$/.test(optionName) ||
      !/^[a-zA-Z][a-zA-Z0-9\s]*$/.test(optionName[0]) ||
      optionName[0] === '-' ||
      optionName[0] === '@' ||
      optionName[0] === '.'
    ) {
      Toast.showWithGravity(
        'Option name should starts with alphabets.',
        Toast.LONG,
        Toast.BOTTOM,
      );
      button.updateOptionButton.showLoading(false);
      return false;
    }

    if (
      sortOrder?.trim() == '' ||
      sortOrder == undefined ||
      sortOrder.length <= 0
    ) {
      Toast.showWithGravity(
        'Sort Order Cannot be Empty',
        Toast.LONG,
        Toast.BOTTOM,
      );
      button.updateOptionButton.showLoading(false);
      return false;
    }

    if (
      pattern.test(sortOrder) ||
      pattern.test(sortOrder[0]) ||
      sortOrder[0] === '-' ||
      sortOrder[0] === '.'
    ) {
      Toast.showWithGravity(
        "Sort Order field doesn't support special characters",
        Toast.LONG,
        Toast.BOTTOM,
      );
      button.updateOptionButton.showLoading(false);
      return false;
    }

    if (
      selectedOptionType === 'checkbox' ||
      selectedOptionType === 'select' ||
      selectedOptionType === 'radio'
    ) {
      for (let i = 0; i < data.length; i++) {
        if (
          data[i].option_value_description[1].name?.trim() == '' ||
          data[i].option_value_description[1].name.length <= 0
        ) {
          Toast.showWithGravity(
            'Option Value Name Cannot be Empty',
            Toast.LONG,
            Toast.BOTTOM,
          );
          button.updateOptionButton.showLoading(false);
          return false;
        }
        if (
          !isNaN(data[i].option_value_description[1].name[0]) ||
          !/^[a-zA-Z][a-zA-Z0-9\s]*$/.test(
            data[i].option_value_description[1].name,
          ) ||
          !/^[a-zA-Z][a-zA-Z0-9\s]*$/.test(
            data[i].option_value_description[1].name[0],
          ) ||
          data[i].option_value_description[1].name[0] === '-' ||
          data[i].option_value_description[1].name[0] === '.'
        ) {
          Toast.showWithGravity(
            'Option value name should starts with alphabets.',
            Toast.LONG,
            Toast.BOTTOM,
          );
          button.updateOptionButton.showLoading(false);
          return false;
        }
        if (
          data[i].sort_order?.trim() == '' ||
          data[i].sort_order.length <= 0
        ) {
          Toast.showWithGravity(
            'Sort Order Value Cannot be Empty',
            Toast.LONG,
            Toast.BOTTOM,
          );
          button.updateOptionButton.showLoading(false);
          return false;
        }
        if (
          pattern.test(data[i].sort_order) ||
          pattern.test(data[i].sort_order[0]) ||
          data[i].sort_order[0] === '-'
        ) {
          Toast.showWithGravity(
            "Option Value Sort Order field doesn't support special characters",
            Toast.LONG,
            Toast.BOTTOM,
          );
          button.updateOptionButton.showLoading(false);
          return false;
        }
      }
    }
    if (selectedOptionType == undefined) {
      Toast.showWithGravity(
        'Please Select Option Type',
        Toast.LONG,
        Toast.BOTTOM,
      );
      button.updateOptionButton.showLoading(false);
      return false;
    }
    if (
      selectedOptionType === 'checkbox' ||
      selectedOptionType === 'select' ||
      selectedOptionType === 'radio'
    ) {
      if (data.length <= 0) {
        Toast.showWithGravity(
          'Please add Option Values',
          Toast.LONG,
          Toast.BOTTOM,
        );
        button.updateOptionButton.showLoading(false);
        return false;
      }
    }
    for (let i = 0; i < data.length; i++) {
      setData(prev => {
        let array = [...prev];
        array[i].image = array[i].image_path;
        return array;
      });
    }
    console.log('INPUTS', onAddNewInput);
    let api = new DeveloperAPIClient();
    let UserMobile = await AsyncStorage.getItem('MobileNumber');
    let Token = await AsyncStorage.getItem('token');
    let addOptionsData = await api.getAddOptions(
      optionName,
      selectedOptionType,
      sortNumber,
      data,
      UserMobile,
      Token,
    );
    button.updateOptionButton.showLoading(false);

    if (
      addOptionsData &&
      addOptionsData.data &&
      typeof addOptionsData.data === 'string' &&
      addOptionsData.data.includes('success')
    ) {
      button.updateOptionButton.showLoading(false);
      Toast.showWithGravity(
        'Option Added Successfully',
        Toast.LONG,
        Toast.BOTTOM,
      );
      navigation.navigate('optionsScreen');
    }

    if (addOptionsData.data.success === true) {
      button.updateOptionButton.showLoading(false);
      Toast.showWithGravity(
        'Option Added Successfully',
        Toast.LONG,
        Toast.BOTTOM,
      );
      navigation.navigate('optionsScreen');
    }
    console.log('addOptionsData', addOptionsData.data);
  };

  useEffect(() => {
    setTimeout(async () => {
      if (route.params.optionObject != undefined) {
        getOptionsDataById();
      }
    });
  }, [route]);

  const onChangeOptionValueName = async (index, val) => {
    console.log('pathupadate', imagePath);
    setData(prev => {
      let array = [...prev];
      array[index].option_value_description[1].name = val;
      return array;
    });
  };

  const onChangeOptionValueSortOrder = async (index, val) => {
    setData(prev => {
      let array = [...prev];
      array[index].sort_order = val;
      return array;
    });
  };

  const handleChoosePhoto = async (index, input) => {
    return await ImagePicker.launchImageLibrary(
      {noData: true},
      async response => {
        if (response != undefined) {
          if (response.didCancel && response.didCancel == true) {
            // console.log("response",response)
            // setIsLoading(false);
            return false;
          }
          return await uploadImage(response, index);
        }
      },
    );
  };

  const createFormData = async (photo, timeinmilliseconds, body = {}) => {
    console.log('Hi');
    const data = new FormData();
    let imagePath = '';
    try {
      let localimagePath = photo.fileName.split('.');
      imagePath =
        localimagePath[0] + '_' + timeinmilliseconds + '.' + localimagePath[1];
    } catch (e) {
      imagePath = photo.fileName;
    }
    data.append('sendimage', {
      name: imagePath,
      type: photo.type,
      uri: Platform.OS === 'ios' ? photo.uri.replace('file://', '') : photo.uri,
    });

    Object.keys(body).forEach(key => {
      data.append(key, body[key]);
    });
    return data;
  };

  const uploadImage = async (response, index) => {
    setLoader(true);
    //  console.log("ImageUploadPath", response)
    const d = new Date();
    let time = d.getTime();
    //  console.log("time", time)
    // setIsLoading(true);
    let Token = await AsyncStorage.getItem('token');
    let UserMobile = await AsyncStorage.getItem('MobileNumber');
    const formData = await createFormData(response, time, {
      mobileNumber: UserMobile,
      merchantToken: Token,
    });
    const api = new DeveloperAPIClient();
    let imagedata = await api.getuploadimage(formData);
    console.log('FormData', JSON.stringify(formData));
    // imageindex(index);
    if (imagedata == undefined || imagedata.data.path == undefined) {
      Toast.showWithGravity(
        'Something Went Wrong or photo size unsupported',
        Toast.LONG,
        Toast.BOTTOM,
      );
      setLoader(false);
      return false;
    }
    console.log('response', response);
    console.log('imageData', imagedata);
    setData(prev => {
      let array = [...prev];
      array[index].image = imagedata?.data?.url;
      array[index].image_path = imagedata?.data?.path;
      return array;
    });
    setLoader(false);
    // setIsLoading(false);
    //console.log("imagedata ::::::::::::::::::::: ", imagedata.data.path);
    Toast.showWithGravity(imagedata.data.message, Toast.LONG, Toast.BOTTOM);
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
        <View style={{marginLeft: 5}}>
          <Text
            style={{
              color: '#0F0F0F',
              fontFamily: 'Poppins-Bold',
              fontSize: 16,
              marginTop: 2,
            }}>
            {screenName ? screenName : 'Add Option'}
          </Text>
        </View>
      </View>
      <ScrollView>
        <View style={{marginTop: 10, flexDirection: 'row'}}>
          <Text
            style={{
              marginLeft: 12,
              fontFamily: 'Poppins-Regular',
              fontSize: 12,
              marginTop: 3,
              color: '#F00',
            }}>
            *
          </Text>
          <Text style={{marginLeft: 6, fontFamily: 'Poppins-Medium'}}>
            Option Name
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
          onChangeText={val => setOptionName(val)}
          value={optionName}
          maxLength={20}
          placeholder="Option Name"
        />
        <View style={{marginTop: 10}}>
          <Text style={{marginLeft: 12, fontFamily: 'Poppins-Medium'}}>
            Type
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
                <Text style={{marginTop: 3}} numberOfLines={1}>
                  {selectedOptionType
                    ? selectedOptionType
                    : 'Please Select Option Type'}
                </Text>
                {/* <Text style={{ color: "#2F6E8F" }}>+ ADD</Text> */}
              </TouchableOpacity>
            }>
            {optionTypeData &&
              optionTypeData.map((val, i) => {
                return (
                  <Menu.Item
                    key={i}
                    title={val}
                    onPress={() => updatecat(val)}
                  />
                );
              })}
          </Menu>
        </View>

        <View style={{marginTop: 10}}>
          <Text style={{marginLeft: 12, fontFamily: 'Poppins-Medium'}}>
            Sort Order
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
          onChangeText={val => setSortOrder(val)}
          value={sortOrder}
          keyboardType="number-pad"
          placeholder="Sort Order"
          maxLength={5}
        />

        <View>
          {selectedOptionType === 'checkbox' ||
          selectedOptionType === 'select' ||
          selectedOptionType === 'radio' ? (
            <ScrollView>
              <View style={{marginTop: 10}}>
                <Text
                  style={{
                    marginLeft: 12,
                    fontFamily: 'Poppins-Medium',
                    fontSize: 15,
                  }}>
                  Option Values
                </Text>
              </View>

              {data.length > 0 &&
                data.map((input, index) => (
                  <View>
                    <View
                      style={{
                        width: '94%',
                        // height: '40%',
                        backgroundColor: '#F7F7FC',
                        borderWidth: 1,
                        borderRadius: 3,
                        marginVertical: 12,
                        marginBottom: 10,
                        marginHorizontal: 12,
                      }}
                      key={index}>
                      <View style={{marginTop: 10, flexDirection: 'row'}}>
                        <Text
                          style={{
                            marginLeft: 12,
                            fontFamily: 'Poppins-Regular',
                            fontSize: 12,
                            marginTop: 2,
                            color: '#F00',
                          }}>
                          *
                        </Text>
                        <Text
                          style={{
                            marginLeft: 5,
                            fontFamily: 'Poppins-Regular',
                          }}>
                          Option Value Name
                        </Text>
                        <View style={{marginLeft: 'auto', marginRight: 5}}>
                          <TouchableOpacity
                            onPress={() => removeInput(index, input)}>
                            <Image
                              style={{
                                width: 15,
                                height: 15,
                                flexDirection: 'row',
                              }}
                              source={require('../../assets/delete.png')}
                            />
                          </TouchableOpacity>
                        </View>
                      </View>
                      <TextInput
                        onChangeText={val =>
                          onChangeOptionValueName(index, val)
                        }
                        placeholder={`Text Input ${index + 1}`}
                        style={{
                          height: 40,
                          margin: 12,
                          padding: 10,
                          backgroundColor: '#FFFF',
                        }}
                        value={input?.option_value_description[1]?.name}
                      />

                      <View style={{marginTop: 10}}>
                        <Text
                          style={{
                            marginLeft: 12,
                            fontFamily: 'Poppins-Regular',
                          }}>
                          Upload Image
                        </Text>
                        {/* <AddImageComponent dataObject={setData} index={index} input={input} /> */}
                        {loader ? (
                          <ActivityIndicator color="#51AF5E" size="small" />
                        ) : (
                          <TouchableOpacity
                            style={{marginVertical: 5, marginHorizontal: 10}}
                            onPress={() => handleChoosePhoto(index, input)}>
                            {input?.image ? (
                              <Image
                                source={{uri: input?.image}}
                                style={{
                                  width: 100,
                                  height: 100,
                                  // resizeMode: "center",
                                  marginTop: 20,
                                }}
                              />
                            ) : (
                              <Image
                                source={{
                                  uri: 'https://ocuat.wroti.app/image/cache/no_image-100x100.png',
                                }}
                                style={{
                                  width: 100,
                                  height: 100,
                                  // resizeMode: "center",
                                  marginTop: 20,
                                }}
                              />
                            )}
                          </TouchableOpacity>
                        )}
                      </View>
                      <View style={{marginTop: 10}}>
                        <Text
                          style={{
                            marginLeft: 12,
                            fontFamily: 'Poppins-Regular',
                          }}>
                          Sort Order
                        </Text>
                      </View>
                      <TextInput
                        style={{
                          height: 40,
                          margin: 12,
                          padding: 10,
                          backgroundColor: '#FFFF',
                          fontFamily: 'Poppins-Regular',
                        }}
                        onChangeText={val =>
                          onChangeOptionValueSortOrder(index, val)
                        }
                        keyboardType="number-pad"
                        placeholder="Sort Order"
                        maxLength={5}
                        value={input?.sort_order}
                      />
                    </View>
                  </View>
                ))}

              <TouchableOpacity
                style={{
                  marginTop: 10,
                  width: '15%',
                  height: 48,
                  paddingTop: 11,
                  paddingBottom: 15,
                  borderRadius: 5,
                  backgroundColor: '#008080',
                  // marginBottom: "2%",
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
            </ScrollView>
          ) : (
            <></>
          )}
        </View>
        {screenName == 'Edit Option Screen' ? (
          // <TouchableOpacity
          //   style={{
          //     marginTop: 10,
          //     width: "100%",
          //     height: 45,
          //     paddingTop: 11,
          //     paddingBottom: 15,
          //     backgroundColor: "#51AF5E",
          //     borderRadius: 10,
          //     borderWidth: 1,
          //     borderColor: "#fff",
          //   }}
          //   onPress={() => editOption()}
          // >
          //   <Text
          //     style={{
          //       color: "#fff",
          //       textAlign: "center",
          //       justifyContent: "center",
          //       alignItems: "center",
          //       fontSize: 16,
          //     }}
          //   >
          //     Update
          //   </Text>
          // </TouchableOpacity>
          <View
            style={{
              alignItems: 'center',
              marginTop: 46,
            }}>
            <CustomLoadingButton
              ref={c => (button.updateOptionButton = c)}
              width={328}
              height={52}
              title="Update"
              titleFontSize={18}
              titleFontFamily="Poppins-Bold"
              titleColor="#FFF"
              backgroundColor="#34A549"
              borderRadius={4}
              onPress={() => {
                editOption();
              }}
            />
          </View>
        ) : (
          // <TouchableOpacity
          //   style={{
          //     marginTop: 10,
          //     width: "100%",
          //     height: 45,
          //     paddingTop: 11,
          //     paddingBottom: 15,
          //     backgroundColor: "#51AF5E",
          //     borderRadius: 10,
          //     borderWidth: 1,
          //     borderColor: "#fff",
          //   }}
          //   onPress={() => addNewOption()}
          // >
          //   <Text
          //     style={{
          //       color: "#fff",
          //       textAlign: "center",
          //       justifyContent: "center",
          //       alignItems: "center",
          //       fontSize: 16,
          //     }}
          //   >
          //     Save
          //   </Text>
          // </TouchableOpacity>
          <View
            style={{
              alignItems: 'center',
              marginTop: 46,
            }}>
            <CustomLoadingButton
              ref={c => (button.updateOptionButton = c)}
              width={328}
              height={52}
              title="Add Option"
              titleFontSize={18}
              titleFontFamily="Poppins-Bold"
              titleColor="#FFF"
              backgroundColor="#34A549"
              borderRadius={4}
              onPress={() => {
                addNewOption();
              }}
            />
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  baseText: {
    fontFamily: 'Cochin',
  },
  container: {
    flex: 1,
  },
  titleText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  input: {
    height: 40,
    margin: 12,
    padding: 10,
    backgroundColor: '#F7F7FC',
  },
});

export default addOptionScreen;
