import React, { useState, useEffect } from "react";
import {View,Text,StatusBar,Image,TouchableOpacity,TextInput,StyleSheet,ScrollView} from "react-native";
import { useTheme } from "@react-navigation/native";
import { Divider, Menu } from "react-native-paper";
import DeveloperAPIClient from "../state/middlewares/DeveloperAPIClient";
import ImagePicker from "../components/ImagePicker";
import Toast from "react-native-simple-toast";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { decode } from "html-entities";

const addCustomerFromGroup = ({ navigation, route }) => {
  const theme = useTheme();
  const [number, setNumber] = React.useState();
  const [FirstName, setFirstName] = React.useState();
  const [LastName, setLastName] = React.useState();
  const [isLoading, setIsLoading] = useState(false);
  const [customerGroupName, setCustomerGroupName] = React.useState(-1);

  const addnewcustomer = async () => {
    let phoneRegex = /^[0-9]{10}$/;
    let countryCode = await AsyncStorage.getItem("countryCode");
    setIsLoading(!isLoading);
    if (FirstName == null || FirstName.trim() == "") {
      Toast.showWithGravity(
        "Please enter valid First Name",
        Toast.LONG,
        Toast.BOTTOM
      );
      return false;
    }
    if (!isNaN(FirstName[0]) || !/^[a-zA-Z][a-zA-Z0-9\s]*$/.test(FirstName[0]) || FirstName.trim() == "" || FirstName[0] === "-" || FirstName[0] === "@" || FirstName[0] === ".") {
      Toast.showWithGravity("First name cannot accept negitive value, special character or spaces", Toast.LONG, Toast.BOTTOM);
      setIsLoading(false);
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

    if (!isNaN(LastName[0]) || !/^[a-zA-Z][a-zA-Z0-9\s]*$/.test(LastName[0]) || LastName.trim() == "" || LastName[0] === "-" || LastName[0] === "@" || LastName[0] === ".") {
      Toast.showWithGravity("Last name cannot accept negitive value, special character or spaces", Toast.LONG, Toast.BOTTOM);
      setIsLoading(false);
      return false;
    }
    if (!phoneRegex.test(number)) {

      Toast.showWithGravity(
        "Please enter valid mobile number.",
        Toast.LONG,
        Toast.TOP
      );
      return false;
    }

    if (number.trim() == "" || number == null) {
      Toast.showWithGravity(
        "Mobile Number Can't Be Empty",
        Toast.LONG,
        Toast.BOTTOM
      );
      return false;
    }
    const api = new DeveloperAPIClient();
    let Token = await AsyncStorage.getItem("token");
    let UserMobile = await AsyncStorage.getItem("MobileNumber");
    let customerGroupId = [route.params.customerGroupObject.customer_group_id];
    let customerResponse = await api.getAddCustomer(
      Token,
      UserMobile,
      FirstName.trim(),
      LastName.trim(),
      number,
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
      navigation.navigate('customerGroupDetailsScreen');
    } else {
      Toast.showWithGravity(
        customerResponse?.data?.message ? customerResponse?.data?.message : customerResponse?.message,
        Toast.LONG,
        Toast.BOTTOM
      )
    }
  };

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
      </ScrollView>
      <View>
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
              Save
            </Text>
          </TouchableOpacity>
      </View>
    </View>
  );
};

export default addCustomerFromGroup;

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
