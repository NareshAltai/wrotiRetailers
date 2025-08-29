import React, { useState, useEffect } from "react";
import {
  Text,
  StyleSheet,
  View,
  FlatList,
  Image,
  StatusBar,
  TouchableOpacity,
  ActivityIndicator
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Divider } from "react-native-paper";
import DeveloperAPIClient from "../../state/middlewares/DeveloperAPIClient";
import { useTheme } from "@react-navigation/native";
import * as optionActions from "../../redux/actions/optionActions";
import { useDispatch, useSelector } from "react-redux";
import Toast from "react-native-simple-toast";
import RBSheet from "react-native-raw-bottom-sheet";
import { decode } from "html-entities";

const OptionsScreen = ({ navigation, route }) => {
  const theme = useTheme();
  const [displayOptionsData, setDisplayOptionsData] = React.useState();
  const [refreshing, setRefreshing] = React.useState(false);
  const dispatch = useDispatch();
  const [optionId, setOptionId] = React.useState();
  const [optionName, setOptionName] = React.useState();
  const [deleteOptionRBSheet, setDeleteOptionRBSheet] = React.useState({
    RBSheetDeleteOption: {},
  });
  const [isOptionsAvailable, setIsOptionsAvailable] = useState(false)

  const optionListingData = useSelector((state) => state.options.loadOptions);

  const loadOptions = async () => {
    setIsOptionsAvailable(false)
    // setOptionsData(dummyData);
    // setRefreshing(true);
    // dispatch(optionActions.refreshOptionData());
    // dispatch(optionActions.loadOptions());
    // setRefreshing(false);
    setRefreshing(true)
    let api = new DeveloperAPIClient();
    let UserMobile = await AsyncStorage.getItem("MobileNumber");
    let Token = await AsyncStorage.getItem("token");
    let OptionsData = await api.getOptions(UserMobile, Token);
    console.log("OptionsData===>2212", JSON.stringify(OptionsData));
    if (OptionsData.data.success == true) {
      setDisplayOptionsData(OptionsData.data.productoptions)
      setRefreshing(false)
      console.log(OptionsData.data.productoptions)
    } else {
      setIsOptionsAvailable(true)
      setDisplayOptionsData()
      setRefreshing(false)
    }
  };

  const deleteOption = async () => {
    setRefreshing(true)
    console.log("OptionId", optionId)
    let api = new DeveloperAPIClient();
    let UserMobile = await AsyncStorage.getItem("MobileNumber");
    let Token = await AsyncStorage.getItem("token");
    let OptionsData = await api.getDeleteOption(UserMobile, Token, optionId);
    console.log("OptionsData===>2212", JSON.stringify(OptionsData));
    if (OptionsData.data.success == true) {
      loadOptions();
      Toast.showWithGravity(
        OptionsData.data.message,
        Toast.LONG,
        Toast.BOTTOM
      );
      setRefreshing(false)
      setOptionName();
      setOptionId();
      deleteOptionRBSheet.RBSheetDeleteOption.close();
    } else {
      loadOptions();
      setRefreshing(false)
    }
  };

  const onDeleteOption = async (item) => {
    setOptionName(item.name);
    setOptionId(item.option_id);
    deleteOptionRBSheet.RBSheetDeleteOption.open();
  };

  // useEffect(() => {
  //   if (optionListingData) {
  //     // if (couponsCount == 10 || couponsData.length < 10) {
  //     //   setIsLoadMore(false);
  //     // } else {
  //     //   setIsLoadMore(true);
  //     // }
  //     if (displayOptionsData) {
  //       setDisplayOptionsData([...displayOptionsData, ...displayOptionsData]);
  //     } else {
  //       setDisplayOptionsData(displayOptionsData);
  //     }
  //   }
  // }, [optionListingData]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      loadOptions();
    });
    return unsubscribe;
  }, []);

  const renderItem = ({ item, index }) => (
    <View style={{ marginTop: 2 }}>
      <View style={{ flexDirection: 'row', marginVertical: 10, marginHorizontal: 10 }}>
        <View style={{ width: "25.3%", height: 25, }} >
          <Text style={{
            flex: 1, color: "#0F0F0F",
            fontFamily: "Poppins-Medium",
            fontSize: 14,
            marginTop: 2,
          }}>{item.name}</Text>
        </View>
        <View style={{ width: "30.3%", height: 25, }} >
          <Text style={{
            flex: 1, color: "#0F0F0F",
            fontFamily: "Poppins-Medium",
            fontSize: 14,
            marginTop: 2,
          }}>{item.type}</Text>
        </View>
        <View style={{ width: "27.3%", height: 25, }}>
          <Text style={{
            flex: 1, color: "#0F0F0F",
            fontFamily: "Poppins-Medium",
            fontSize: 14,
            marginTop: 2,
          }}>{item.sort_order}</Text>
        </View>
        <View style={{ width: "3.3%", height: 25, flexDirection: 'row' }}>
          <TouchableOpacity onPress={() => navigation.navigate('addOptionScreen', {
            optionObject: item
          })}>
            <Image
              style={{
                width: 25,
                height: 25,
              }}
              source={require("../../assets/edit.png")}
            />
          </TouchableOpacity>
          <View style={{ marginLeft: 10 }}>
            <TouchableOpacity
              onPress={() => onDeleteOption(item)}
            >
              <Image
                style={{
                  width: 25,
                  height: 25,
                  flexDirection: "row",
                }}
                source={require("../../assets/delete.png")}
              />
            </TouchableOpacity>
          </View>
          <RBSheet
            ref={(ref) => {
              deleteOptionRBSheet.RBSheetDeleteOption = ref;
            }}
            height={200}
            openDuration={250}
            customStyles={{
              container: {
                justifyContent: "center",
                borderTopRightRadius: 30,
                borderTopLeftRadius: 30,
              },
            }}
          >
            <View>
              <Text
                style={{
                  fontSize: 20,
                  fontFamily: "Poppins-Bold",
                  color: "#11151A",
                  marginVertical: 10,
                  textAlign: "center",
                }}
              >
                Remove Option
              </Text>
              <Text
                style={{
                  color: "#11151A",
                  fontSize: 14,
                  fontFamily: "Poppins-Regular",
                  textAlign: "center",
                }}
              >
                Are you sure you want to remove option {`\n`}
                {item.name != null ? decode(optionName) : ""} ?
              </Text>
              <TouchableOpacity
                style={{
                  width: "90%",
                  height: 45,
                  paddingTop: 12,
                  paddingBottom: 15,
                  backgroundColor: "#E26251",
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: "#fff",
                  marginTop: 30,
                  marginLeft: 18,
                }}
                activeOpacity={0.6}
                onPress={() => deleteOption()}
              >
                <Text
                  style={{
                    textAlign: "center",
                    fontFamily: "Poppins-Bold",
                    fontSize: 16,
                    color: "#FFFFFF",
                  }}
                >
                  Remove{" "}
                </Text>
              </TouchableOpacity>
            </View>
          </RBSheet>
        </View>
      </View>
      <View style={{ marginBottom: 5 }} />
      <Divider />
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar
        backgroundColor="#F4F5F7"
        barStyle={theme.dark ? "light-content" : "dark-content"}
      />
      <View
        style={{
          flexDirection: "row",
          marginHorizontal: 5,
          marginVertical: 15,
        }}
      >
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() => navigation.goBack()}
        >
          <Image
            style={{ width: 28, height: 28, resizeMode: "center" }}
            source={require("../../assets/back3x.png")}
          />
        </TouchableOpacity>
        <View style={{ marginLeft: 5 }}>
          <Text
            style={{
              color: "#0F0F0F",
              fontFamily: "Poppins-Bold",
              fontSize: 16,
              marginTop: 2,
            }}
          >
            Options
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            marginLeft: "auto",
          }}
        >
          <TouchableOpacity
            onPress={() => navigation.navigate('addOptionScreen')}
          >
            <Text
              style={{
                color: "#1B6890",
                fontFamily: "Poppins-Medium",
                fontSize: 15,
                textAlign: "right",
                marginLeft: "1%",
              }}
            >
              Add New Option
            </Text>
          </TouchableOpacity>
        </View>

      </View>
      <View />
      <Divider />
      {!isOptionsAvailable && (
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
        <Text style={{
          marginVertical: 5, marginHorizontal: 5, color: "#0F0F0F",
          fontFamily: "Poppins-SemiBold",
          fontSize: 14,
          marginTop: 2,
        }}>
          Name
        </Text>
        <Text style={{
          marginVertical: 5, marginHorizontal: 5, color: "#0F0F0F",
          fontFamily: "Poppins-SemiBold",
          fontSize: 14,
          marginTop: 2,
        }}>
          Type
        </Text>
        <Text style={{
          marginVertical: 5, marginHorizontal: 5, color: "#0F0F0F",
          fontFamily: "Poppins-SemiBold",
          fontSize: 14,
          marginTop: 2,
        }}>
          Sort Order
        </Text>
        <Text style={{
          marginRight: 15, color: "#0F0F0F",
          fontFamily: "Poppins-SemiBold",
          fontSize: 14,
          marginTop: 2,
          // margin: '',
        }}>
          Actions
        </Text>
      </View>
      )}
      <View style={{ marginTop: 5 }} />
      <Divider style={{ borderRadius: 2, backgroundColor: 'black' }} />
      {refreshing ? (
        <ActivityIndicator size="large" color="#51AF5E" />
      ) : (
        <>
          {!isOptionsAvailable ? (
            <FlatList data={displayOptionsData} renderItem={renderItem} />
          ) : (
          <Text
            style={{
              // flex: 1,
              textAlign: "center",
              justifyContent: "center",
              marginTop: "60%",
            }}
          >
            No Options Found
          </Text>)}

        </>
      )}
      {/* <Table>
        <Row data={tableData[0]} />
        <Rows data={renderItem} />
      </Table> */}
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
    backgroundColor: "#F2F7F9",
    paddingTop: 10,
    paddingBottom: 10,
  },
  tagText: {
    color: "#84694D",
    fontFamily: "Lato-Regular",
  },
  tabText: {
    color: "#2B2520",
    fontFamily: "Poppins-Medium",
    flex: 1.8,
    textAlign: "left",
    marginLeft: 10,
    marginTop: 10,
    fontSize: 14,
    // marginTop: 5,
  },
});

export default OptionsScreen;
