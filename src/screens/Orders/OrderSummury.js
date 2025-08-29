import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Platform,
  StyleSheet,
  StatusBar,
  Alert,
  Image,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Modal,
  Button,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import OrderCard from "../../components/orderDetailCard";
import RBSheet from "react-native-raw-bottom-sheet";
import DeveloperAPIClient from "../../state/middlewares/DeveloperAPIClient";
import { Searchbar, Divider } from "react-native-paper";

const OrdersScreen = ({ navigation, route }) => {
  const { colors } = useTheme();
  const [ordersData, setOrdersData] = useState();

  const theme = useTheme();
  const [data, setData] = React.useState({
    RBSheetLogout: {},
  });

  const [datas, setDataa] = React.useState({
    EDIT: {},
  });

  const updatestatusorder = async () => {
    //console.log("=====", order_id, "sddf ", status_id);
    const api = new DeveloperAPIClient();
    let status_id = 15;
    let order_id = route.params.ID;
    let MOBILE = await AsyncStorage.getItem('userName');

    let statusdata = await api.getorderupdate(MOBILE,order_id, status_id);
    navigation.navigate("Orders");
  };

  const declineorder = async () => {
   // console.log("=====", order_id, "sddf ", status_id);
    const api = new DeveloperAPIClient();
    let order_id = route.params.ID;
    let MOBILE = await AsyncStorage.getItem('userName');

    let statusdata = await api.getorderupdate(MOBILE,order_id, 17);
  };

  const orderdetails = async () => {
    let MOBILE = await AsyncStorage.getItem('userName');
    const api = new DeveloperAPIClient();
    let orderId = route.params.ID;
    // let orders = route.params.orders;
    let allOrdersData = await api.getOrderDetails(MOBILE,orderId);
    // console.log(
    //   "allsummuryordersdetails######",
    //   JSON.stringify(allOrdersData.data)
    // );
    setOrdersData(allOrdersData.data);
  };

  useEffect(() => {
    orderdetails();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar
        backgroundColor="#F4F5F7"
        barStyle={theme.dark ? "light-content" : "dark-content"}
      />

      <View style={styles.header}>
        <TouchableOpacity activeOpacity={0.6} onPress={() => navigation.goBack()}>
          <Image
            style={{ width: 28, height: 28, resizeMode: "center" }}
            source={require("../../assets/back3x.png")}
          />
        </TouchableOpacity>
        
          <View style={{ marginLeft: 1, flexDirection: "row" }}>
            <Text style={styles.headerTitle}>Order Summery</Text>   
          </View>
       
      </View>

      <ScrollView>
        <View style={{ marginVertical: 10 }}>
          {ordersData && (
            <View>
              <View style={styles.container}>
                <View
                  style={{
                    marginHorizontal: 10,
                    backgroundColor: "#2F6E8F",
                    elevation: 2,
                    padding: 10,
                    borderRadius: 5,
                    marginVertical: 5,

                  }}
                >
                  <View style={{marginTop:10}}>
                    
                    <View style={{ flexDirection: "row" }}>
                      <Text
                        style={{
                          marginLeft: 10,
                          fontSize: 15,
                          color: "#FFFFFF",
                          marginBottom: 5,
                        }}
                      >
                      # {ordersData.orders.order_info.order_id} • {ordersData.orders.order_info.firstname}
                      </Text>
                      {/* <Text
                        style={{
                          fontSize: 15,
                          color: "#FFFFFF",
                          marginLeft: "44%",
                        }}
                      >
                        Today, 11:31 AM
                      </Text> */}
                    </View>

                    <View style={{ flexDirection: "row", marginTop: 3 }}>
                      <Text
                        style={{
                          marginLeft: 10,
                          fontSize: 15,
                          color: "#FFFFFF",
                          marginBottom: 5,
                        }}
                      >
                        {ordersData.orders.order_info.payment_method}
                      </Text>
                      <Text
                        style={{
                          marginLeft: "37%",
                          fontSize: 15,
                          color: "#FFFFFF",
                        }}
                      >
                        Total Items • {ordersData.orders.products.length}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>

              <View
                style={{
                  marginHorizontal: 10,
                  backgroundColor: "#fff",
                  elevation: 2,
                  padding: 10,
                  borderRadius: 5,
                  marginVertical: 5,
                }}
              >
                <View style={{ margin: 5 }} />
                {ordersData.orders.products &&
                  ordersData.orders.products.map((val, i) => {
                    //console.log("name###", ordersData);
                    return (
                      <View style={{ flexDirection: "row" }}>
                        <Text
                          style={{
                            fontSize: 15,
                            color: "#21272E",
                            marginBottom: 5,
                            flexWrap: "wrap",
                            width: 190,
                          }}
                        >
                          {val.name}
                        </Text>
                        <Text
                          style={{
                            marginLeft: "20%",
                            fontSize: 15,
                            color: "#21272E",
                          }}
                        >
                          {val.quantity} x {val.price}
                        </Text>
                      </View>
                    );
                  })}

                <View style={{ marginBottom: 5 }} />
                <Divider />

                <View style={{ flexDirection: "row", marginTop: 5 }}>
                  <Text
                    style={{
                      marginLeft: 3,
                      fontSize: 15,
                      color: "#21272E",
                      marginBottom: 5,
                    }}
                  >
                    Item Total
                  </Text>
                  <Text
                    style={{
                      marginLeft: "63%",
                      fontSize: 12,
                      color: "#21272E",
                    }}
                  >
                    {ordersData.orders.totals[0].value}
                  </Text>
                </View>

                <View style={{ flexDirection: "row" }}>
                  <Text
                    style={{
                      marginLeft: 3,
                      fontSize: 15,
                      color: "#21272E",
                      marginBottom: 5,
                    }}
                  >
                    Delivery Charges
                  </Text>
                  <Text
                    style={{
                      marginLeft: "56%",
                      fontSize: 12,
                      color: "#21272E",
                    }}
                  >
                    {ordersData.orders.totals[1].value}
                  </Text>
                </View>
                {/* <View style={{marginBottom:10}}/> */}
                <Divider />
                <View style={{ flexDirection: "row", marginTop: 8 }}>
                  <Text
                    style={{
                      marginLeft: 3,
                      fontSize: 15,
                      color: "#21272E",
                      marginBottom: 5,
                    }}
                  >
                    Order Total
                  </Text>
                  <Text
                    style={{
                      marginLeft: "57%",
                      fontSize: 15,
                      color: "#21272E",
                    }}
                  >
                    {ordersData.orders.totals[2].value}
                  </Text>
                </View>
              </View>
            </View>
            // <OrderCard
            //   onPress={() => navigation.navigate("OrderDetails")}
            //   ID={ordersData.orders.order_info.order_id}
            //   price="₹ 225.00"
            //   time="Today, 11:31 AM"
            //   orderType={ordersData.orders.order_info.payment_method}
            //   total={ordersData.orders.products.length}
            //   products={ordersData.orders.products}
            //   itemtotal="Item Total"
            //   cost4={ordersData.orders.totals[0].value}
            //   cost5={ordersData.orders.totals[1].value}
            //   cost6={ordersData.orders.totals[2].value}
            //   dc="Delivery Charges"
            //   ot="Order Total"
            //   custitle="Customer Name"
            //   cusname={ordersData.orders.order_info.firstname}
            //   mobtitle="Mobile Number"
            //   mobile={ordersData.orders.order_info.telephone}
            //   mailtitle="Email Address"
            //   mailid={ordersData.orders.order_info.email}
            //   addtitle="Address"
            //   add={ordersData.orders.order_info.shipping_address_1}
            // />
          )}

          <View style={{ flexDirection: "column",marginTop:"65%" }}>
            <TouchableOpacity
              style={styles.SubmitButtonStyle}
              // onPress={() =>
              //   navigation.navigate("OrderSummury", {
              //     ID: val.order_id,
              //   })
              // }
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
                Share on WhatsApp{" "}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.SubmitButtonStyles} onPress={()=>updatestatusorder()}>
              <Text
                style={{
                  color: "#FFFFFF",
                  textAlign: "center",
                  justifyContent: "center",
                  alignItems: "center",
                  fontSize: 16,
                }}
              >
                Mark for Delivery
              </Text>
            </TouchableOpacity>
          </View>

          <RBSheet
            ref={(ref) => {
              data.RBSheetLogout = ref;
            }}
            height={335}
            openDuration={250}
            customStyles={{
              container: {
                justifyContent: "center",
                borderTopRightRadius: 30,
                borderTopLeftRadius: 30,
              },
            }}
          >
            <Image
              style={{
                width: 156,
                height: 137,
                alignSelf: "center",
                resizeMode: "stretch",
              }}
              source={require("../../assets/sucess3x.png")}
            />
            <View>
              <Text
                style={{
                  color: "#34A549",
                  fontSize: 20,
                  marginVertical: 10,
                  textAlign: "center",
                  marginTop: 8,
                }}
              >
                Accepted • Order Processing
              </Text>

              <TouchableOpacity
                style={{
                  width: "90%",
                  height: 45,
                  paddingTop: 12,
                  paddingBottom: 15,
                  backgroundColor: "#51AF5E",
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: "#fff",
                  marginTop: 30,
                  marginLeft: 18,
                }}
                onPress={() => navigation.navigate("OrderSummury")}
              >
                <Text
                  style={{
                    color: "#FFFFFF",
                    textAlign: "center",
                    justifyContent: "center",
                    alignItems: "center",
                    fontSize: 16,
                  }}
                >
                  Continue
                </Text>
              </TouchableOpacity>
            </View>
          </RBSheet>
        </View>
      </ScrollView>
    </View>
  );
};

export default OrdersScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F5F7",
  },

  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.8)",
  },

  modalView: {
    margin: 20,
    backgroundColor: "#fff",
    shadowColor: "#1B365E",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: "90%",
  },

  SubmitButtonStyles: {
    marginTop: 10,
    width: "100%",
    height: 45,
    paddingTop: 11,
    paddingBottom: 15,
    backgroundColor: "#3D86B4",
    borderRadius: 10,
  },

  SubmitButtonStyle: {
    marginTop: 10,
    width: "100%",
    height: 45,
    paddingTop: 11,
    paddingBottom: 15,
    backgroundColor: "#51AF5E",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#fff",
  },

  headerTitle: {
    color: "#2B2520",
    fontFamily: "Poppins-Medium",
    fontSize: 20,
  },
  header: {
    flexDirection: "row",
    marginHorizontal: 5,
    marginVertical: 15,
  },
  mainHeader: {
    backgroundColor: "#ffffff",
    height: 45,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  icon: {
    width: 40,
    height: 40,
  },
  logo: {
    width: 80,
    height: 80,
    marginLeft: 10,
  },
  categoryContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 5,
    marginHorizontal: 30,
  },
  card: {
    width: 140,
    height: 140,
    borderRadius: 15,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
  },
  mainCategoryContainer: {
    marginVertical: 30,
  },
  iconContainer: {
    backgroundColor: "#fe5e00",
    borderRadius: 50,
    width: 100,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  cardTitle: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginHorizontal: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    alignSelf: "center",
    marginVertical: 10,
  },
  footer: {
    flex: 3,
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  text_header: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 30,
  },
  text_footer: {
    color: "#05375a",
    fontSize: 18,
  },
  action: {
    flexDirection: "row",
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f2f2f2",
    paddingBottom: 5,
  },
  actionError: {
    flexDirection: "row",
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#FF0000",
    paddingBottom: 5,
  },
  textInput: {
    flex: 1,
    marginTop: Platform.OS === "ios" ? 0 : -12,
    paddingLeft: 10,
    color: "#05375a",
  },
  errorMsg: {
    color: "#FF0000",
    fontSize: 14,
  },
  button: {
    alignItems: "center",
    marginTop: 18,
  },
  signIn: {
    width: "100%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  textSign: {
    fontSize: 18,
    fontWeight: "bold",
  },
  SectionStyle: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 0.5,
    borderColor: "#fff",
    height: 40,
    borderRadius: 50,
    marginHorizontal: 15,
    marginVertical: 5,
    paddingRight: 5,
    paddingLeft: 5,
  },

  IconStyle: {
    alignItems: "center",
    margin: 5,
  },

  productCard: {
    width: 160,
    elevation: 2,
    borderRadius: 15,
    padding: 10,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    margin: 4,
  },
  menuText: {
    color: "#21272E",
    // opacity: 0.5,
    fontSize: 15,
    marginRight: 20,
    margin: 10,
    backgroundColor: "#FFFFFF",
    // fontStyle:'Poppins-SemiBold'
  },
});
