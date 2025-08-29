import React, { useState, useEffect } from "react";
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
  FlatList, Alert
} from "react-native";
import { useTheme } from "@react-navigation/native";
import { Divider, Menu } from "react-native-paper";
import DeveloperAPIClient from "../../state/middlewares/DeveloperAPIClient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-simple-toast";

const BroadCastsScreen = ({ navigation }) => {
  const theme = useTheme();
  const { colors } = useTheme();
  const [displayBroadCasts, setDisplayBroadCasts] = React.useState();
  const [refreshing, setRefreshing] = React.useState(false);

  const loadBroadCastMessages = async () => {
    setDisplayBroadCasts();
    let api = new DeveloperAPIClient();
    let UserMobile = await AsyncStorage.getItem("MobileNumber");
    let Token = await AsyncStorage.getItem("token");
    let loadBroadCastResponse = await api.getCampaignList(UserMobile, Token);
    if (loadBroadCastResponse.success == true) {
      setDisplayBroadCasts(loadBroadCastResponse.campaigns)
    }
    console.log("loadCampaign Messages", JSON.stringify(loadBroadCastResponse))
  }

  const deleteCampaign = async (ID) => {
    let api = new DeveloperAPIClient();
    let UserMobile = await AsyncStorage.getItem("MobileNumber");
    let Token = await AsyncStorage.getItem("token");
    let loadBroadCastResponse = await api.deleteCampaign(UserMobile, Token, ID);
    if (loadBroadCastResponse.success == true) {
      Toast.showWithGravity(
        loadBroadCastResponse.message,
        Toast.LONG,
        Toast.BOTTOM
      );
      loadBroadCastMessages();
    }
  }

  const showDeleteAlert = async (item) => {
    Alert.alert('Delete Campaign', 'Are you sure do you want to delete campaign?', [
      { text: 'No', cancellable: true }, { text: 'Yes', onPress: () => deleteCampaign(item.id) }
    ])
  }


  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      loadBroadCastMessages();
    });
    return unsubscribe;
  }, [])

  const renderItem = ({ item, index }) => (
    <View style={{ marginTop: 2 }}>
      <View style={{ flexDirection: 'row', marginVertical: 10, marginHorizontal: 10 }}>
        <View style={{ width: "35.3%", height: 25, }} >
          <Text style={{
            flex: 1, color: "#0F0F0F",
            fontFamily: "Poppins-Medium",
            fontSize: 14,
            marginTop: 2,
          }}>{item.name.length > 14 ? `${item.name.substring(0, 14)}...` : item.name}</Text>
        </View>
        <View style={{ width: "45.3%", height: 25, }}>
          <Text style={{
            flex: 1, color: "#0F0F0F",
            fontFamily: "Poppins-Medium",
            fontSize: 14,
            marginTop: 2,
          }}>{item.sendType}</Text>
        </View>
        <View style={{ width: "3.3%", height: 25, flexDirection: 'row' }}>
          <TouchableOpacity onPress={() => navigation.navigate('NewBroadCastsScreen', {
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
              onPress={() => showDeleteAlert(item)}
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
        <View style={{ marginLeft: 1 }}>
          <Text
            style={{
              color: "#2B2520",
              fontFamily: "Poppins-Medium",
              fontSize: 20,
            }}
          >
            Campaigns{" "}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate("NewBroadCastsScreen")}
          style={{ marginLeft: "auto",marginRight:'3%' }}
        >
          <Text
            style={{
              color: "#1B6890",
              fontFamily: "Poppins-Medium",
              fontSize: 15,
              marginTop:4
            }}
          >
            Add New Campaign
          </Text>
        </TouchableOpacity>
      </View>

      {/* <View style={{ flexDirection: "row" }}>
        <View
          style={{
            backgroundColor: "#caede9",
            alignItems: "center",
            //justifyContent: "center",
            flexDirection: "row",
            marginLeft: "2%",
            marginTop: 5,
            width: "60%"
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
            />
          </View>

          <View style={{ flex: 1, flexDirection: "row" }}>
            <View style={{ alignItems: "flex-end", flex: 1 }}>
              <TouchableOpacity
                onPress={() => {
                }}
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
        <TouchableOpacity
          onPress={() => navigation.navigate("NewBroadCastsScreen")}
          style={{ marginLeft: "auto", marginRight: "2%", marginTop: "4%" }}
        >
          <Text
            style={{
              color: "#1B6890",
              fontFamily: "Poppins-Medium",
              fontSize: 15,
              textAlign: "right",
            }}
          >
            Create Campaign
          </Text>
        </TouchableOpacity>
      </View> */}
      <Divider />
      <View style={{ flexDirection: 'row', marginTop: 10 }}>
        <View style={{ width: "35.3%" }}>
          <Text style={{
            marginVertical: 5, marginHorizontal: 5, color: "#0F0F0F",
            fontFamily: "Poppins-SemiBold",
            fontSize: 14,
            marginTop: 2,
          }}>
            Campaign
          </Text>
        </View>
        <View style={{ width: "45.3%" }}>
          <Text style={{
            marginVertical: 5, marginHorizontal: 5, color: "#0F0F0F",
            fontFamily: "Poppins-SemiBold",
            fontSize: 14,
            marginTop: 2,
          }}>
            Type
          </Text>
        </View>
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
      <View style={{ marginTop: 5 }} />
      <Divider style={{ borderRadius: 2, backgroundColor: 'black' }} />
      {refreshing ? (
        <ActivityIndicator size="large" color="#51AF5E" />
      ) : (
        <FlatList data={displayBroadCasts} renderItem={renderItem} />
      )}
    </View>
  );
};

export default BroadCastsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFF",
  },
});