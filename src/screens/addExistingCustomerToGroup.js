import React, { useState, useEffect } from "react";
import {View,Text,StatusBar,Image,TouchableOpacity,TextInput,StyleSheet,ScrollView} from "react-native";
import { useTheme } from "@react-navigation/native";
import { Divider, Menu } from "react-native-paper";
import DeveloperAPIClient from "../state/middlewares/DeveloperAPIClient";
import Toast from "react-native-simple-toast";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { decode } from "html-entities";

const AddCustumerScreen = ({ navigation, route }) => {
  const theme = useTheme();
  const [number, setNumber] = React.useState();
  const [FirstName, setFirstName] = React.useState();
  const [LastName, setLastName] = React.useState();
  const [isLoading, setIsLoading] = useState(false);
  const [visibleGroups, setVisibleGroups] = React.useState(false);
  const [customerGroupName, setCustomerGroupName] = React.useState(-1);
  const [customerGroups, setCustomerGroups] = React.useState();
  const [refreshing, setRefreshing] = React.useState(true);

  const addnewcustomer = async () => {
    let countryCode = await AsyncStorage.getItem("countryCode");
    setIsLoading(!isLoading);
    if (FirstName == null ||FirstName.trim() == "") {
      Toast.showWithGravity(
        "Please enter valid First Name",
        Toast.LONG,
        Toast.BOTTOM
      );
      return false;
    }
    if (LastName == null || LastName.trim() == "") {
      Toast.showWithGravity(
        "Please enter valid Last Name",
        Toast.LONG,
        Toast.BOTTOM
      );
      return false;
    }
    if (number == null || number.trim() == "") {
      Toast.showWithGravity(
        "Please enter valid Mobile Number",
        Toast.LONG,
        Toast.BOTTOM
      );
      return false;
    }
    const api = new DeveloperAPIClient();
    let UserMobile = await AsyncStorage.getItem("MobileNumber");
    let customerGroupId = customerGroupName.customer_group_id;
    let customerResponse = await api.getAddCustomer(
      UserMobile,
      FirstName,
      LastName,
      countryCode + number,
      customerGroupId
    );
    setIsLoading(false);
    if (
      customerResponse?.data != undefined &&
      customerResponse?.data?.success == true
    ) {
      Toast.showWithGravity(
        "Customer added successfully.",
        Toast.LONG,
        Toast.BOTTOM
      );
      loadCustomersByGroupId();
      navigation.goBack();
    } else {
      if (
        customerResponse?.data != undefined &&
        customerResponse?.data?.message == "Email Alredy Exist"
      ) {
        Toast.showWithGravity(
          "MobileNumber Already Exists",
          Toast.LONG,
          Toast.BOTTOM
        );
      } else {
        Toast.showWithGravity(
          customerResponse?.data?.message ? customerResponse?.data?.message : customerResponse?.message,
          Toast.LONG,
          Toast.BOTTOM
        )
      }
    }
  };

  const loadCustomersByGroupId = async () => {
    setRefreshing(true);
    const api = new DeveloperAPIClient();
    let customer_group_id = route.params.customerGroupObject.customer_group_id;
    let UserMobile = await AsyncStorage.getItem("MobileNumber");
    let Token = await AsyncStorage.getItem("token");
    let CustumerData = await api.getCustomersInCustomerGroup(
      Token,
      customer_group_id
    );
    setRefreshing(false);
  };

  const loadCustumerGroups = async () => {
    setRefreshing(true);
    const api = new DeveloperAPIClient();
    let UserMobile = await AsyncStorage.getItem("MobileNumber");
    let Token = await AsyncStorage.getItem("token");
    let CustumerData = await api.getCustomerGroups(Token);
    setRefreshing(false);
    setCustomerGroups(CustumerData.data.customergroups);
    setCustomerGroupName(route.params.customerGroupObject);
  };

  const updateGroupName = async (val) => {
    setCustomerGroupName(val);
    setVisibleGroups(false);
  };

  useEffect(() => {
    setTimeout(async () => {
      loadCustumerGroups();
    }, 1000);
    const unsubscribe = navigation.addListener("focus", () => {
      loadCustumerGroups();
    });
    return unsubscribe;
  }, []);

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
            source={require("../assets/back3x.png")}
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
            Add Customer{" "}
          </Text>
        </View>
        <View style={{ marginLeft: "45%" }} />
      </View>
      <Divider />
      <ScrollView>
        <View style={{ marginTop: 10 }}>
          <Text style={{ marginLeft: 12, fontFamily: "Poppins-Medium" }}>
            First Name
          </Text>
        </View>
        <TextInput
          style={{
            height: 40,
            margin: 12,
            padding: 10,
            backgroundColor: "#F7F7FC",
            fontFamily: "Poppins-Regular",
          }}
          onChangeText={(val) => setFirstName(val)}
          value={FirstName}
          placeholder="Enter First Name"
        />

        <Text style={{ marginLeft: 12, fontFamily: "Poppins-Medium" }}>
          Last Name
        </Text>

        <TextInput
          style={{
            height: 40,
            margin: 12,
            padding: 10,
            backgroundColor: "#F7F7FC",
            fontFamily: "Poppins-Regular",
          }}
          onChangeText={(val) => setLastName(val)}
          value={LastName}
          placeholder="Enter Last Name"
        />

        <Text style={{ marginLeft: 12, fontFamily: "Poppins-Medium" }}>
          Mobile Number
        </Text>
        <TextInput
          style={{
            height: 40,
            margin: 12,
            padding: 10,
            backgroundColor: "#F7F7FC",
            fontFamily: "Poppins-Regular",
          }}
          onChangeText={(val) => setNumber(val)}
          value={number}
          placeholder="Enter Mobile Number"
          keyboardType="numeric"
          maxLength={10}
        />

        <Text style={{ marginLeft: 12, fontFamily: "Poppins-Medium" }}>
          Customer Group
        </Text>
        <View
          style={{
            height: 40,
            margin: 12,
            padding: 10,
            backgroundColor: "#F7F7FC",
          }}
        >
          <Menu
            visible={visibleGroups}
            onDismiss={() => setVisibleGroups(!visibleGroups)}
            anchor={
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginHorizontal: 10,
                }}
                activeOpacity={0.7}
                onPress={() => setVisibleGroups(!visibleGroups)}
              >
                <Text style={{ fontFamily: "Poppins-Medium" }}>
                  {customerGroupName.name}
                </Text>
                <View>
                  <Image
                    style={{ height: 20, width: 15 }}
                    source={require("../assets/ddarrow.png")}
                  />
                </View>
              </TouchableOpacity>
            }
          >
            {customerGroups &&
              customerGroups.map((val, i) => {
                return (
                  <Menu.Item
                    key={i}
                    title={decode(val.name)}
                    onPress={() => updateGroupName(val)}
                  />
                );
              })}
          </Menu>
        </View>
      </ScrollView>
      <View style>
        <TouchableOpacity
          style={{
            marginTop: 10,
            width: "94%",
            height: 45,
            paddingTop: 11,
            paddingBottom: 15,
            backgroundColor: "#5EB169",
            marginBottom: "5%",
            marginLeft: 10,
          }}
          onPress={() => addnewcustomer()}
        >
          <Text
            style={{
              color: "#fff",
              textAlign: "center",
              justifyContent: "center",
              alignItems: "center",
              fontSize: 16,
            }}
          >
            {" "}
            SAVE{" "}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AddCustumerScreen;

const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    padding: 10,
    backgroundColor: "#F7F7FC",
  },
  container: {
    flex: 1,
    backgroundColor: "#FFFF",
  },
});
