import React, { useEffect } from "react";
import {
  View,
  Text,
  StatusBar,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Linking,
  RefreshControl,
  StyleSheet,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import styles from "./Home/Styles";
import DeveloperAPIClient from "../state/middlewares/DeveloperAPIClient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FlatList, TextInput } from "react-native-gesture-handler";
import * as customerActions from "../redux/actions/customerActions";
import { useDispatch, useSelector } from "react-redux";
//import NetworkChecker from "react-native-network-checker";
import { useIsFocused } from "@react-navigation/native";

const CustumersScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const dispatch = useDispatch();
  const isFocused = useIsFocused();

  const theme = useTheme();
  const [displayCustomers, setDisplayCustomers] = React.useState();
  const [displayCustomerGroups, setDisplayCustomerGroups] = React.useState();
  const [refreshing, setRefreshing] = React.useState(false);
  const [tabValue, setTabValue] = React.useState("All Customers");
  const [currentPage, setCurrentPage] = React.useState(1);
  const [search, setSearch] = React.useState();
  const [isLoading, setIsLoading] = React.useState(false);
  const [issearched, setIsSearched] = React.useState(false);
  const [searchKey, setSearchKey] = React.useState(null);
  const [searchResults, setSearchresults] = React.useState();
  const [isLoadMore, setIsLoadMore] = React.useState(true);
  const [searchGroupResults, setSearchGroupResults] = React.useState();
  const CustumersData = useSelector((state) => state.customer.customerslist);
  const [countryCode, setCountryCode] = React.useState(91);

  const customerGroups = useSelector(
    (state) => state.customer.customersGroupList
  );

  const customerTotal = useSelector((state) => state.customer.customersTotal);

  const loadcustumers = async () => {
    setDisplayCustomers();
    setRefreshing(true);
    let countryCode = await AsyncStorage.getItem("countryCode");
    setCountryCode(countryCode);
    dispatch(customerActions.refreshCustomers());
    dispatch(customerActions.loadcustumers(1, ""));
    setRefreshing(false);
    setIsLoadMore(true);
    setCurrentPage(1);
  };

  const loadCustumerGroups = async () => {
    setDisplayCustomerGroups();
    setRefreshing(true);
    dispatch(customerActions.refreshCustomers());
    dispatch(customerActions.loadCustomerGroups("", 1));
    setRefreshing(false);
    setIsLoadMore(true);
  };

  const Tabs = [
    {
      name: "All Customers",
    },
    {
      name: "Groups",
    },
  ];

  const dialCall = (number) => {
    let phoneNumber = "";
    if (Platform.OS === "android") {
      phoneNumber = `tel:${number}`;
    } else {
      phoneNumber = `telprompt:${number}`;
    }
    Linking.openURL(phoneNumber);
  };

  const openWhatsapp = (number) => {
    let phoneNumber = "";
    if (Platform.OS === "android") {
      phoneNumber = `tel:${number}`;
    } else {
      phoneNumber = `telprompt:${number}`;
    }
    Linking.openURL(`whatsapp://send?text=&phone=${number}`);
  };

  const updateCustomer = (item) => {
    navigation.navigate("AddCustumersScreen", {
      customer_group_id: item,
      customer_id: item.customer_id,
      from: "allCustomers",
      item: item,
    });
  };

  const searchCustomerGroupName = async (val) => {
    setSearch(val);
    setCurrentPage(1);
    let api = new DeveloperAPIClient();
    let Token = await AsyncStorage.getItem("token");
    let CustumerGroupsData = await api.getCustomerGroups(Token, val);
    if (CustumerGroupsData.data.success == false) {
      setSearchGroupResults();
    } else {
      if (CustumerGroupsData.data.customergroups.length > 0) {
        setIsSearched(true);
      } else {
        setIsLoadMore(true);
        setIsSearched(false);
      }
      setSearchGroupResults(CustumerGroupsData.data.customergroups);
    }
  };

  const searchCustomerName = async (val) => {
    setSearchKey(val);
    setCurrentPage(1);
    let api = new DeveloperAPIClient();
    let UserMobile = await AsyncStorage.getItem("MobileNumber");
    let CustumerData = await api.getCustomer(UserMobile, 1, val);
    if (CustumerData.data.success == false) {
      setSearchresults();
    } else {
      if (CustumerData.data.customers.length > 0) {
        setIsSearched(true);
      } else {
        setIsLoadMore(true);
        setIsSearched(false);
      }
      setSearchresults(CustumerData.data.customers);
    }
  };

  useEffect(() => {
    if (isFocused == true) {
      if (tabValue == "All Customers") {
        setSearchKey();
        setIsSearched(false);
        setSearchresults([]);
        setDisplayCustomers();
        loadcustumers();
      }
      if (tabValue == "Groups") {
        setSearch();
        setIsSearched(false);
        setSearchGroupResults([]);
        setDisplayCustomerGroups();
        loadCustumerGroups();
      }
    }
  }, [isFocused]);

  useEffect(() => {
    if (CustumersData) {
      if (CustumersData.length < 10) {
        setIsLoadMore(false);
      } else {
        setIsLoadMore(true);
      }
      if (displayCustomers) {
        setDisplayCustomers([...displayCustomers, ...CustumersData]);
      } else {
        setDisplayCustomers(CustumersData);
      }
    }
  }, [CustumersData]);

  const customersList = ({ item, index }) => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("CustomersDetailsScreen", {
          name: item.name,
          phone: item.telephone,
          customer_id: item.customer_id,
        })
      }
      style={{
        marginHorizontal: 10,
        backgroundColor: "#FFF",
        elevation: 5,
        padding: 10,
        borderRadius: 5,
        marginVertical: 5,
      }}
    >
      <View style={{ flexDirection: "row" }}>
        <View style={{ elevation: 10 }}>
          <Image
            style={{ height: 50, width: 50, borderRadius: 5 }}
            source={require("../assets/Customer/Profile.jpg")}
          />
        </View>
        <View
          style={{
            flexDirection: "column",
            marginHorizontal: 10,
            marginVertical: 5,
          }}
        >
          <Text
            style={{
              fontSize: 16,
              fontFamily: "Poppins-Medium",
              color: "#21272E",
            }}
          >
            {item.name.substring(0, 14)}
            {item.name.length > 14 ? "..." : ""}
          </Text>
          <Text
            style={{
              fontSize: 14,
              fontFamily: "Poppins-Medium",
              color: "#21272E",
            }}
          >
            {item.telephone.substring(0, 13)}
            {item.telephone.length > 13 ? "..." : ""}
          </Text>
        </View>
        <View style={{ marginLeft: "auto", flexDirection: "row", margin: 5 }}>
          <TouchableOpacity
            onPress={() => updateCustomer(item)}
            style={{ justifyContent: "center", alignItems: "center" }}
          >
            <Image
              style={{
                height: 20,
                width: 20,
                resizeMode: "contain",
                marginRight: 5,
                marginLeft: 3,
              }}
              source={require("../assets/Customer/edit.png")}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => dialCall(item.telephone)}
            style={{
              elevation: 10,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Image
              style={{
                height: 20,
                width: 20,
                resizeMode: "contain",
                marginRight: 5,
                marginLeft: 3,
              }}
              source={require("../assets/Customer/call.png")}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => openWhatsapp(item.telephone)}
            style={{
              elevation: 10,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Image
              style={{
                height: 20,
                width: 20,
                resizeMode: "contain",
                marginRight: 5,
                marginLeft: 3,
              }}
              source={require("../assets/wp3.png")}
            />
          </TouchableOpacity>
          <View
            style={{
              elevation: 10,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Image
              style={{
                height: 25,
                width: 25,
                resizeMode: "contain",
                marginLeft: 5,
              }}
              source={require("../assets/Customer/Group.png")}
            />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
  const onPress = (val) => {
    setTabValue(val.name);
    if (val.name == "All Customers") {
      setIsSearched(false);
      loadcustumers();
    }
    if (val.name == "Groups") {
      setIsSearched(false);
      loadCustumerGroups();
    }
    setSearchKey();
  };

  const _handleLoadMore = async () => {
    if (isLoadMore) {
      setIsLoading(true);
      dispatch(customerActions.loadcustumers(currentPage + 1));
      setCurrentPage(currentPage + 1);
      setIsLoading(false);
    }
  };

  const renderItem = ({ item, index }) => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("customerGroupDetailsScreen", {
          groupName: item.name,
          customer_group_id: item.customer_group_id,
          groupObject: item,
        })
      }
      style={{
        marginHorizontal: 10,
        backgroundColor: "#FFF",
        elevation: 5,
        padding: 10,
        borderRadius: 5,
        marginVertical: 5,
      }}
    >
      <View style={{ flexDirection: "row" }}>
        <View
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            borderWidth: 1,
            borderColor: "#5EB169",
            borderStyle: "solid",
            marginTop: 8,
            justifyContent: "center",
            backgroundColor: "#5EB169",
          }}
        >
          <Text style={{ fontSize: 20, textAlign: "center", color: "#fff" }}>
            {item.name[0]?.toUpperCase()}
          </Text>
        </View>
        <View style={{ flexDirection: "column", marginHorizontal: 10 }}>
          <Text
            style={{
              fontSize: 16,
              fontFamily: "Poppins-Medium",
              marginLeft: "5%",
              marginTop: "6%",
              justifyContent: "space-between",
              flex: 1,
            }}
            numberOfLines={1}
          >
            {item.name ? item.name : "No Name"}
          </Text>
          <View style={{ flexDirection: "row" }}>
            <Text style={{ color: "black", marginLeft: "5%", fontSize: 13 }}>
              Group Id : {item.customer_group_id}
            </Text>
          </View>
        </View>
      </View>
      <Text
        style={{
          fontSize: 12,
          fontFamily: "Poppins-Regular",
          textDecorationLine: "underline",
          color: "#34A549",
          marginLeft: "auto",
          letterSpacing: 2,
        }}
      >
        View Group Details
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <>
        <StatusBar
          backgroundColor="#FFF"
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
          <View style={{ marginLeft: 5 }}>
            <Text
              style={{
                color: "#0F0F0F",
                fontFamily: "Poppins-Bold",
                fontSize: 16,
              }}
            >
              Customers
            </Text>
          </View>
          <View style={{ marginLeft: "auto" }}></View>
        </View>

        {tabValue === "All Customers" && (
          <View
            style={{
              marginBottom: 10,
              flexDirection: "row",
              backgroundColor: "#e6e6e6",
              borderRadius: 10,
              width: "95%",
              alignSelf: "center",
            }}
          >
            <Image
              style={{
                width: 25,
                height: 25,
                resizeMode: "center",
                alignSelf: "center",
                marginLeft: 10,
              }}
              source={require("../assets/path2x.png")}
            />
            <TextInput
              style={{ width: "80%", paddingLeft: 10 }}
              autoCapitalize="none"
              placeholder="Search Customer"
              underlineColorAndroid="transparent"
              onChangeText={(val) => searchCustomerName(val)}
              value={searchKey}
              maxLength={15}
            />
            <TouchableOpacity
              onPress={() => {
                (setSearchKey(), setIsLoadMore(true), setIsSearched(false));
              }}
            >
              <Image
                style={{
                  width: 10,
                  height: 10,
                  tintColor: "black",
                  marginTop: 20,
                }}
                source={require("../assets/close2x.png")}
              />
            </TouchableOpacity>
          </View>
        )}
        {tabValue === "Groups" && (
          <View
            style={{
              marginBottom: 10,
              flexDirection: "row",
              backgroundColor: "#e6e6e6",
              borderRadius: 10,
              width: "95%",
              alignSelf: "center",
            }}
          >
            <Image
              style={{
                width: 25,
                height: 25,
                resizeMode: "center",
                alignSelf: "center",
                marginLeft: 10,
              }}
              source={require("../assets/path2x.png")}
            />
            <TextInput
              style={{ width: "80%", paddingLeft: 10 }}
              placeholder="Search Customer Group"
              underlineColorAndroid="transparent"
              onChangeText={(val) => searchCustomerGroupName(val)}
              value={search}
              maxLength={15}
            />
            <TouchableOpacity
              onPress={() => {
                (setSearch(), setIsLoadMore(true), setIsSearched(false));
              }}
            >
              <Image
                style={{
                  width: 10,
                  height: 10,
                  tintColor: "black",
                  marginTop: 20,
                }}
                source={require("../assets/close2x.png")}
              />
            </TouchableOpacity>
          </View>
        )}

        <View style={{ flexDirection: "row", marginBottom: 10 }}>
          <TouchableOpacity
            style={{ marginLeft: "5%" }}
            onPress={() => navigation.navigate("AddCustumersScreen")}
          >
            <Text
              style={{
                color: "#2F6E8F",
                fontFamily: "Poppins-Medium",
                fontSize: 15,
              }}
            >
              Add Customer
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{ marginLeft: "auto", marginRight: "5%" }}
            onPress={() => navigation.navigate("AddGroupScreen")}
          >
            <Text
              style={{
                color: "#2F6E8F",
                fontFamily: "Poppins-Medium",
                fontSize: 15,
              }}
            >
              Add Group
            </Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            flexDirection: "row",
          }}
        >
          {Tabs &&
            Tabs.map((val, i) => {
              return (
                <TouchableOpacity
                  onPress={() => onPress(val)}
                  activeOpacity={0.7}
                  key={i}
                  style={{
                    width: "45.5%",
                    height: 50,
                    borderRadius: tabValue === val.name ? 5 : 5,
                    backgroundColor:
                      tabValue === val.name ? "#337D3E" : "#F2F7F9",
                    marginLeft: "3%",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{
                      color: tabValue === val.name ? "#FFFF" : "#21272E",

                      fontFamily:
                        tabValue === val.name
                          ? "Poppins-Bold"
                          : "Poppins-SemiBold",
                      fontSize: tabValue === val.name ? 18 : 13,
                      marginLeft: 8,
                    }}
                  >
                    {val.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
        </View>
        {tabValue === "All Customers" && (
          <View style={{ marginBottom: "20%" }}>
            {refreshing && <ActivityIndicator size="large" color="#51AF5E" />}
            {issearched == true ? (
              <View>
                {searchResults &&
                searchResults != null &&
                searchResults != undefined ? (
                  <FlatList data={searchResults} renderItem={customersList} />
                ) : (
                  <Text
                    style={{
                      textAlign: "center",
                      justifyContent: "center",
                      marginTop: "60%",
                    }}
                  >
                    No Customers Found
                  </Text>
                )}
              </View>
            ) : (
              <FlatList
                data={displayCustomers}
                onEndReached={() => _handleLoadMore()}
                onEndReachedThreshold={0.5}
                renderItem={customersList}
              />
            )}
          </View>
        )}
        {tabValue === "Groups" && (
          <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={() => loadCustumerGroups()}
              />
            }
          >
            {refreshing && <ActivityIndicator size="large" color="#51AF5E" />}
            <View style={{}}>
              {issearched == true ? (
                <View>
                  {searchGroupResults &&
                  searchGroupResults != null &&
                  searchGroupResults != undefined ? (
                    <FlatList
                      data={searchGroupResults}
                      renderItem={renderItem}
                    />
                  ) : (
                    <Text
                      style={{
                        textAlign: "center",
                        justifyContent: "center",
                        marginTop: "60%",
                      }}
                    >
                      No Search Customer Groups Found
                    </Text>
                  )}
                </View>
              ) : (
                <FlatList
                  onEndReachedThreshold={0.01}
                  data={customerGroups}
                  renderItem={renderItem}
                />
              )}
            </View>
          </ScrollView>
        )}
      </>
    </View>
  );
};

export default CustumersScreen;

const style = StyleSheet.create({
  chip: {
    borderRadius: 15,
    borderTopEndRadius: 450,
    width: "38%",
    justifyContent: "center",
    alignItems: "center",
  },
  chipText: {
    color: "#21272E",
    fontFamily: "Poppins-SemiBold",
    fontSize: 13,
    marginLeft: 8,
  },
});
