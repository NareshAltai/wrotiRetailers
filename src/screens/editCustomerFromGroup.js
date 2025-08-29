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
  CheckBox, FlatList
} from "react-native";
import { useTheme } from "@react-navigation/native";
import { Divider, Menu } from "react-native-paper";
import DeveloperAPIClient from "../state/middlewares/DeveloperAPIClient";
import ImagePicker from "../components/ImagePicker";
import Toast from "react-native-simple-toast";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { decode } from "html-entities";

const AddCustumerScreen = ({ navigation, route }) => {
  const theme = useTheme();
  const [number, setNumber] = React.useState();
  const [description, setDescription] = React.useState();
  const [FirstName, setFirstName] = React.useState();
  const [LastName, setLastName] = React.useState();
  const [isEdited, setIsEdited] = React.useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [visibleGroups, setVisibleGroups] = React.useState(false);
  const [customerGroupName, setCustomerGroupName] = React.useState(-1);
  const [customerGroups, setCustomerGroups] = React.useState();
  const [refreshing, setRefreshing] = React.useState(true);
  const [customerObject, setCustomerObject] = React.useState();
  const [countryCode, setCountryCode] = React.useState(91);
  const [selectedGroupNames, setSelectedGroupNames] = React.useState([]);
  const [selectedGroupId, setSelectedGroupId] = React.useState([]);

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
    if (LastName == null || LastName.trim() == "") {
      Toast.showWithGravity(
        "Please enter valid Last Name",
        Toast.LONG,
        Toast.BOTTOM
      );
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
    let customerGroupId = customerGroupName.customer_group_id;
    let customerResponse = await api.getAddCustomer(
      Token,
      UserMobile,
      FirstName.trim(),
      LastName.trim(),
      number,
      selectedGroupId
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
      navigation.goBack();
    } else {
      Toast.showWithGravity(
        customerResponse?.data?.message ? customerResponse?.data?.message : customerResponse?.message,
        Toast.LONG,
        Toast.BOTTOM
      )
    }
  };

  const updateCustomer = async () => {
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
    if (LastName == null || LastName.trim() == "") {
      Toast.showWithGravity(
        "Please enter valid Last Name",
        Toast.LONG,
        Toast.BOTTOM
      );
      return false;
    }
    const api = new DeveloperAPIClient();
    let UserMobile = await AsyncStorage.getItem("MobileNumber");
    let Token = await AsyncStorage.getItem("token");
    let customer_id = ""
    if (route != undefined && route.params.customer_group_id) {
      customer_id = route.params.customer_group_id?.customer_id
    }
    if (route != undefined && route.params.customerObject) {
      customer_id = route.params.customerObject.customer_id;
    }
    let customerResponse = await api.updateCustomerFromGroup(
      UserMobile,
      Token,
      customer_id,
      selectedGroupId,
      FirstName,
      LastName,
      number
    );
    setIsLoading(false);
    if (
      customerResponse.data != undefined &&
      customerResponse.data.success == true
    ) {
      Toast.showWithGravity(
        "Customer details updated.",
        Toast.SHORT,
        Toast.BOTTOM
      );
    } else {
      Toast.showWithGravity(
        "Opps, Something went wrong, please try after sometime.",
        Toast.SHORT,
        Toast.BOTTOM
      );
    }
    navigation.goBack();
  };

  const loadCustumerGroups = async () => {
    setRefreshing(true);
    const api = new DeveloperAPIClient();
    let UserMobile = await AsyncStorage.getItem("MobileNumber");
    let Token = await AsyncStorage.getItem("token");
    let CustumerData = await api.getCustomerGroups(Token);
    setRefreshing(false);
    setCustomerGroups(CustumerData.data.customergroups);
    if (route != undefined && route.params.customer_group_id) {
      const customer = route.params.customer_group_id.name.split(" ", 2);
      setFirstName(customer[0].trim());
      setLastName(customer[1].trim());
      setNumber(route.params.customer_group_id.telephone);
      setIsEdited(true);
      return;
    }
    if (route != undefined && route.params != undefined) {
      setCustomerGroupName(route.params.customerGroupObject);
      if (route != undefined && route.params.customerObject.isEdited == true) {
        setIsEdited(true);
        setCustomerObject(route.params.customerObject);
        const customer = route.params.customerObject.name.split(" ", 2);
        setFirstName(route.params.customerObject?.firstname);
        setLastName(route.params.customerObject?.lastname);
        setNumber(route.params.customerObject.telephone);
      }
    } else {
      setIsEdited(false);
      setCustomerGroupName(CustumerData.data.customergroups[0]);

    }
  };

  const onRemoveGroup = (item) => {
    let items = [...selectedGroupId];
    let itemsNames = [...selectedGroupNames];
    if (items.includes(item.customer_group_id)) {
      const index = items.indexOf(item.customer_group_id);
      if (index > -1) {
        items.splice(index, 1);
      }
    } else {
      items.push(item.customer_group_id);
    }

    if (itemsNames.length > 0) {
      let count = itemsNames.length;
      for (let i = 0; i < count; i++) {
        if (
          itemsNames[i] != undefined &&
          itemsNames[i].customer_group_id == item.customer_group_id
        ) {
          itemsNames.splice(i, 1);
        }
      }
    }
    setSelectedGroupId(items);
    setSelectedGroupNames(itemsNames);
  };

  const onSelectGroup = (item) => {
    let items = [...selectedGroupId];
    let itemsNames = [...selectedGroupNames];

    if (items.includes(item.customer_group_id)) {
      const index = items.indexOf(item.customer_group_id);
      if (index > -1) {
        items.splice(index, 1);
      }
    } else {
      items.push(item.customer_group_id);
    }
    itemsNames.push(item);
    setSelectedGroupId(items);
    setSelectedGroupNames(itemsNames);
  };

  const updateGroupName = async (val) => {
    setCustomerGroupName(val);
    setVisibleGroups(false);
  };

  const renderMethod = ({ item, index }) => (
    <View
      style={{
        borderRadius: 15,
        borderWidth: 1,
        borderColor: "#808080",
        width: "45%",
        flexDirection: "row",
        padding: 2,
        marginBottom: 5,
      }}
    >
      <Text
        style={{ padding: 2, flex: 2.5, color: "#808080" }}
        numberOfLines={1}
      >
        {item.name}
      </Text>
      <View style={{ flex: 1, flexDirection: "row" }}>
        <View style={{ alignItems: "flex-end", flex: 1 }}>
          <TouchableOpacity onPress={() => onRemoveGroup(item)}>
            <Image
              style={{
                width: 25,
                height: 25,
                resizeMode: "center",
              }}
              source={require("../assets/close2x.png")}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const getGroupsByCustomer = async () => {
    const api = new DeveloperAPIClient();
    let UserMobile = await AsyncStorage.getItem("MobileNumber");
    let Token = await AsyncStorage.getItem("token");
    let customer_id = route.params.customer_id;
    let customerResponse = await api.getGroupsByCustomer(
      UserMobile,
      Token, customer_id
    );
    setIsLoading(false);
    if (customerResponse.data.success == true) {

      setSelectedGroupId(customerResponse.data.customeringroups.map((obj) => obj.customer_group_id))
      setSelectedGroupNames(customerResponse.data.customeringroups)
    }
  }

  useEffect(() => {
    setTimeout(async () => {
      if (route.params.from != undefined) {
        setIsEdited(true);
      } else {
        setIsEdited(false)
      }
      if (route != undefined && route.params.customer_group_id) {
        setIsEdited(true);
      } else {
        setIsEdited(false);
      }
      if (route != undefined && route.params?.customerObject?.isEdited == true) {
        setIsEdited(true);
      } else {
        setIsEdited(false);
      }
      loadCustumerGroups(route);
      getGroupsByCustomer()
    });
    const unsubscribe = navigation.addListener("focus", () => {
      getGroupsByCustomer();
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
        {isEdited == true ? (
          <View style={{ marginLeft: 1 }}>
            <Text
              style={{
                color: "#2B2520",
                fontFamily: "Poppins-Medium",
                fontSize: 20,
              }}
            >
              Edit Customer{" "}
            </Text>
          </View>
        ) : (
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
        )}
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
        {isEdited != true ? (
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
        ) : (
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
            editable={false}
          />
        )}
        <View>
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
                    Please Select Customer Group
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
                    <View style={{ flexDirection: 'row' }}>
                      <CheckBox
                        value={
                          selectedGroupId.includes(val.customer_group_id)
                            ? true
                            : false
                        }
                        onValueChange={() =>
                          selectedGroupId.includes(val.customer_group_id)
                            ? onRemoveGroup(val)
                            : onSelectGroup(val)
                        }
                        style={{ marginTop: "4%" }}
                      />
                      <Menu.Item
                        key={i}
                        title={decode(val.name)}
                      />
                    </View>

                  );
                })}
            </Menu>

          </View>
          {selectedGroupNames.length != 0 ? (
            <View>
              <Text
                style={{
                  marginLeft: 12,
                  marginTop: 5,
                  fontFamily: "Poppins-Medium",
                }}
              >
                Selected Groups
              </Text>
              <View style={{}}>
                <FlatList
                  data={selectedGroupNames}
                  scrollEnabled={true}
                  renderItem={renderMethod}
                />
              </View>
            </View>
          ) : (
            <></>
          )}
        </View>
      </ScrollView>
      <View>
        {isEdited == true ? (
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
            onPress={() => updateCustomer()}
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
              Update
            </Text>
          </TouchableOpacity>
        ) : (
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
        )}
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
