import React, { useEffect, useState } from "react";
import { ScrollView } from "react-native";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import EvilIcons from "react-native-vector-icons/EvilIcons";

import MyOrderCard from "../../components/MyOrderCard";
import { useTheme } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DeveloperAPIClient from "../../state/middlewares/DeveloperAPIClient";

const OrdersScreen = ({ navigation }) => {
  const [ordersData, setOrdersData] = useState();

  const theme = useTheme();
  const loadUser = async () => {

    let userToken = await AsyncStorage.getItem("userToken");
    let user = await AsyncStorage.getItem("user");
    user = JSON.parse(user);
    let MOBILE = await AsyncStorage.getItem('userName');

    const api = new DeveloperAPIClient();
    let UserId = user && user.UserId;
    let AccessToken = user && user.userToken;

    let allOrdersData = await api.getOrdersHistory(MOBILE,order_status_id);
    console.log('HEYYHEYEY',JSON.stringify(allOrdersData.data))
//    console.log(allOrdersData.data.Orders[0], "here is data");

    setOrdersData(allOrdersData && allOrdersData.data.Orders);
  };

  useEffect(() => {
    loadUser();
  }, []);
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <EvilIcons name="arrow-left" size={26} color="#55514D" />
        <Text style={styles.addressText}>Your Orders</Text>
        <Text />
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.body}>
          {ordersData ? (
            ordersData.map((val, i) => {
              return (
                <MyOrderCard
                  onPress={() => navigation.navigate("OrderDetails")}
                  orderDate={val.OrderDateLocal}
                  satus={val.Status === "P" ? "In-Progress" : ""}
                  price={val.TotalAmount}
                />
              );
            })
          ) : (
            <ActivityIndicator color="#2B2520" size={40} />
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 5,
    marginVertical: 10,
    alignItems: "center",
  },
  addressText: {
    fontFamily: "PlayfairDisplay-Regular",
    fontSize: 24,
  },
  body: {
    marginHorizontal: 10,
  },
});

export default OrdersScreen;
