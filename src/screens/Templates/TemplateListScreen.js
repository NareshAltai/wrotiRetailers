import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StatusBar,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  FlatList,
  TextInput,
  ActivityIndicator,
  Alert,
  ViewBase,
  Modal,
} from 'react-native';
import {useTheme} from '@react-navigation/native';
import {Card, Divider, Menu} from 'react-native-paper';
// import { Card, Card.Content } from "native-base";
import DeveloperAPIClient from '../../state/middlewares/DeveloperAPIClient';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import Modal from "react-native-modal";
import RBSheet from 'react-native-raw-bottom-sheet';
import {decode} from 'html-entities';
import Toast from 'react-native-simple-toast';

const TemplateListScreen = ({navigation}) => {
  const theme = useTheme();
  const {colors} = useTheme();
  const [templateListing, setTemplateListing] = React.useState([]);
  const [visibleSortOptions, setVisibleSortOptions] = React.useState(false);
  const [searchKey, setSearchKey] = React.useState(false);
  const [templateName, setTemplateName] = React.useState();
  const [templateId, setTemplateId] = React.useState();
  const [deleteTemplateRBSheet, setDeleteTemplateRBSheet] = React.useState({
    RBSheetDeleteTemplate: {},
  });

  const SortListingMenu = [
    {name: 'None', id: 3},
    {name: 'Latest', id: 1, type: 'desc'},
    {name: 'Oldest', id: 2, type: 'asc'},
  ];

  const loadTemplates = async () => {
    setTemplateListing([]);
    let api = new DeveloperAPIClient();
    let UserMobile = await AsyncStorage.getItem('MobileNumber');
    let Token = await AsyncStorage.getItem('token');
    let loadTemplates = await api.getMessageTemplates(UserMobile, Token);
    if (loadTemplates.success == true) {
      setTemplateListing(loadTemplates.templates);
    } else {
      setTemplateListing([]);
    }
  };

  const updateSortValue = async val => {
    setVisibleSortOptions(false);
    let api = new DeveloperAPIClient();
    let Token = await AsyncStorage.getItem('token');
    let UserMobile = await AsyncStorage.getItem('MobileNumber');
    if (val.name == 'None') {
      let loadTemplates = await api.getMessageTemplates(UserMobile, Token);
      setTemplateListing(loadTemplates.data);
    } else {
      let sortTemplates = await api.getSortMessageTemplates(val.type, Token);
      setTemplateListing(sortTemplates.data);
    }
  };

  const renderSortOptionsValues = ({item, index}) => (
    <View style={{marginTop: 2}}>
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          marginVertical: 10,
          marginHorizontal: 10,
        }}
        onPress={() => updateSortValue(item)}>
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

  const onDeleteTemplate = async item => {
    Alert.alert(
      'Delete Campaign',
      'Are you sure do you want to delete template?',
      [
        {text: 'No', cancellable: true},
        {text: 'Yes', onPress: () => deleteTemplate(item)},
      ],
    );
  };

  const deleteTemplate = async item => {
    let api = new DeveloperAPIClient();
    let UserMobile = await AsyncStorage.getItem('MobileNumber');
    let Token = await AsyncStorage.getItem('token');
    let deleteTemplates = await api.getDeleteMessageTemplates(
      item.id,
      Token,
      UserMobile,
    );
    console.log('deleteTemaplates', deleteTemplates);
    if (deleteTemplates.message == true) {
      Toast.showWithGravity(deleteTemplates?.message, Toast.LONG, Toast.BOTTOM);
    } else {
      Toast.showWithGravity(deleteTemplates?.message, Toast.LONG, Toast.BOTTOM);
    }
    setTemplateListing([]);
    loadTemplates();
  };

  const searchTemplate = async val => {
    setSearchKey(val);
    let api = new DeveloperAPIClient();
    let Token = await AsyncStorage.getItem('token');
    let UserMobile = await AsyncStorage.getItem('MobileNumber');
    if (val == '' || val == null || val.length < 0) {
      let loadTemplates = await api.getMessageTemplates(UserMobile, Token);
      loadTemplates();
    } else {
      let searchTtemplates = await api.getSearchMessageTemplates(val, Token);
      setTemplateListing(searchTtemplates.data);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadTemplates();
    });
    return unsubscribe;
  }, []);

  const messageTemplatesRenderItem = ({item, index}) => (
    <View>
      <View>
        <Card style={{marginTop: 5}}>
          <Card.Content header bordered style={styles.cardHeader}>
            {/* <Image style={{resizeMode:'center',height:25,width:25}} source={require("../../assets/templates.png")}/> */}
            <Text style={{color: 'white', fontFamily: 'Poppins-Bold'}}>
              {item.name}
            </Text>
            <View style={{marginLeft: 'auto', flexDirection: 'row'}}>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('EditTemplateScreen', {
                    template: item,
                  })
                }
                style={{marginLeft: 'auto', marginRight: 10}}>
                <Image
                  style={{
                    width: 30,
                    height: 30,
                  }}
                  source={require('../../assets/edit.png')}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => onDeleteTemplate(item)}
                style={{marginLeft: 'auto'}}>
                <Image
                  style={{
                    width: 30,
                    height: 30,
                    flexDirection: 'row',
                  }}
                  source={require('../../assets/delete.png')}
                />
              </TouchableOpacity>
            </View>
          </Card.Content>
          <RBSheet
            ref={ref => {
              deleteTemplateRBSheet.RBSheetDeleteTemplate = ref;
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
                Remove Template
              </Text>
              <Text
                style={{
                  color: '#11151A',
                  fontSize: 14,
                  fontFamily: 'Poppins-Regular',
                  textAlign: 'center',
                }}>
                Are you sure you want to remove template {`\n`}
                {item.name != null ? decode(templateName) : ''} ?
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
                onPress={() => deleteTemplate()}>
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

          <Card.Content>
            {/* <View>
              <View style={{ flexDirection: "row" }}>
                <Text style={{ fontSize: 15, fontFamily: "Poppins-Regular", marginRight:'auto' }}>
                  Template Name
                </Text>
                <Text
                  style={{
                    fontSize: 15,
                    fontFamily: "Poppins-Regular",
                    marginLeft: "auto",
                  }}
                >
                  :
                </Text>
                <Text
                  style={{
                    fontSize: 15,
                    fontFamily: "Poppins-Medium",
                    marginLeft: "auto",
                  }}
                >
                  {item.name}
                </Text>
              </View>

              <View style={{ flexDirection: "row" }}>
                <Text style={{ fontSize: 15, fontFamily: "Poppins-Regular" }}>
                  Category
                </Text>
                <Text
                  style={{
                    fontSize: 15,
                    fontFamily: "Poppins-Regular",
                    marginLeft: "1.5%",
                  }}
                >
                  :
                </Text>
                <Text
                  style={{
                    fontSize: 15,
                    fontFamily: "Poppins-Medium",
                    marginLeft: "auto",
                  }}
                >
                  {item.category}
                </Text>
              </View>

              <View style={{ flexDirection: "row" }}>
                <Text style={{ fontSize: 15, fontFamily: "Poppins-Regular" }}>
                  Status
                </Text>
                <Text
                  style={{
                    fontSize: 15,
                    fontFamily: "Poppins-Regular",
                    marginLeft: "1.5%",
                  }}
                >
                  :
                </Text>
                <Text
                  style={{
                    fontSize: 15,
                    fontFamily: "Poppins-Medium",
                    marginLeft: "auto",
                  }}
                >
                  {item.status}
                </Text>
              </View>

              <View style={{ flexDirection: "row" }}>
                <Text style={{ fontSize: 15, fontFamily: "Poppins-Regular" }}>
                  Language
                </Text>
                <Text
                  style={{
                    fontSize: 15,
                    fontFamily: "Poppins-SemiBold",
                    marginLeft: "1.5%",
                  }}
                >
                  :
                </Text>
                <Text
                  style={{
                    fontSize: 15,
                    fontFamily: "Poppins-Medium",
                    marginLeft: "auto",
                  }}
                >
                  {item.language}
                </Text>
              </View>
            </View> */}

            <View style={{flexDirection: 'row'}}>
              <View style={{flexDirection: 'column'}}>
                <Text
                  style={{
                    fontSize: 15,
                    fontFamily: 'Poppins-Regular',
                    marginRight: 'auto',
                  }}>
                  Template Name
                </Text>
                <Text
                  style={{
                    fontSize: 15,
                    fontFamily: 'Poppins-Regular',
                    marginRight: 'auto',
                  }}>
                  Category
                </Text>
                <Text
                  style={{
                    fontSize: 15,
                    fontFamily: 'Poppins-Regular',
                    marginRight: 'auto',
                  }}>
                  Status
                </Text>
                <Text
                  style={{
                    fontSize: 15,
                    fontFamily: 'Poppins-Regular',
                    marginRight: 'auto',
                  }}>
                  Language
                </Text>
              </View>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginLeft: '15%',
                }}>
                <Text
                  style={{
                    fontSize: 15,
                    fontFamily: 'Poppins-SemiBold',
                    textAlign: 'center',
                  }}>
                  :
                </Text>
                <Text
                  style={{
                    fontSize: 15,
                    fontFamily: 'Poppins-SemiBold',
                    textAlign: 'center',
                  }}>
                  :
                </Text>
                <Text
                  style={{
                    fontSize: 15,
                    fontFamily: 'Poppins-SemiBold',
                    textAlign: 'center',
                  }}>
                  :
                </Text>
                <Text
                  style={{
                    fontSize: 15,
                    fontFamily: 'Poppins-SemiBold',
                    textAlign: 'center',
                  }}>
                  :
                </Text>
              </View>
              <View style={{marginLeft: '5%'}}>
                <Text
                  style={{
                    fontSize: 15,
                    fontFamily: 'Poppins-Medium',
                    // marginLeft: "auto",
                  }}>
                  {item.name}
                </Text>
                <Text
                  style={{
                    fontSize: 15,
                    fontFamily: 'Poppins-Medium',
                    // marginLeft: "auto",
                  }}>
                  {item.category}
                </Text>
                <Text
                  style={{
                    fontSize: 15,
                    fontFamily: 'Poppins-Bold',
                    color: item.status == 'PENDING' ? '#F29339' : '#6EA400',
                    // marginLeft: "auto",
                  }}>
                  {item.status}
                </Text>
                <Text
                  style={{
                    fontSize: 15,
                    fontFamily: 'Poppins-Medium',
                    // marginLeft: "auto",
                  }}>
                  {item.language}
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>
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
            Templates{' '}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate('NewTemplateScreen')}
          style={{marginLeft: 'auto', marginRight: '2%', marginTop: '2%'}}>
          <Text
            style={{
              color: '#1B6890',
              fontFamily: 'Poppins-Medium',
              fontSize: 15,
              textAlign: 'right',
            }}>
            Add New Template
          </Text>
        </TouchableOpacity>
      </View>
      <Divider />

      <Modal
        onRequestClose={() => setVisibleSortOptions(false)}
        style={{margin: 2, zIndex: 0}}
        visible={visibleSortOptions}>
        <View
          style={{
            backgroundColor: '#FFFF',
            elevation: 2,
            borderRadius: 5,
            height: 200,
          }}>
          <FlatList
            data={SortListingMenu}
            renderItem={renderSortOptionsValues}
          />
        </View>
      </Modal>
      {/* <View style={{ flexDirection: "row" }}>
        <View
          style={{
            backgroundColor: "#caede9",
            alignItems: "center",
            //justifyContent: "center",
            flexDirection: "row",
            marginLeft: "2%",
            marginTop: 5,
            width: "80%"
          }}
        >
          <TouchableOpacity style={{ marginLeft: "3%", marginBottom: 5 }}>
            <Image
              style={{
                width: 25,
                height: 25,
                resizeMode: "center",
              }}
              source={require("../../assets/path2x.png")}
            />
          </TouchableOpacity>
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              //marginBottom: 5,
            }}
          >
            <TextInput
              autoCapitalize="none"
              placeholder="Search"
              underlineColorAndroid="transparent"
              maxLength={15}
              value={searchKey}
              onChangeText={(val) => searchTemplate(val)}
            />
          </View>

          <View style={{ flex: 1, flexDirection: "row" }}>
            <View style={{ alignItems: "flex-end", flex: 1 }}>
              <TouchableOpacity
                onPress={() => setSearchKey()}
              >
                <Image
                  style={{
                    width: 25,
                    height: 25,
                    resizeMode: "center",
                    marginBottom: 5,
                  }}
                  source={require("../../assets/close2x.png")}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <TouchableOpacity onPress={() => setVisibleSortOptions(!visibleSortOptions)}>
          <Image
            style={{
              width: 25,
              height: 25,
              marginTop: 15,
              marginLeft: 15
            }}
            source={require("../../assets/sort1.png")}
          />
        </TouchableOpacity>
      </View> */}
      <View style={{marginBottom: 50}}>
        <FlatList
          data={templateListing}
          numColumns={1}
          nestedScrollEnabled={true}
          renderItem={messageTemplatesRenderItem}
          onEndReachedThreshold={0.5}
          marginBottom={20}
        />
      </View>
    </View>
  );
};

export default TemplateListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFF',
  },
  cardHeader: {
    backgroundColor: '#1B6890',
    flexDirection: 'row',
  },
});
