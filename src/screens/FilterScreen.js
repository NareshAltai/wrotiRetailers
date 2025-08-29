import React from "react";
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
  Button,
  FlatList,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import OrderCard from "../components/OrderCard";
import FilterCard from "../components/FilterCard";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import { Searchbar, Divider } from "react-native-paper";
// import styles from '../Home/Styles';

import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

const FilterScreen = ({ navigation }) => {
  const { colors } = useTheme();

  const theme = useTheme();

  const homeMenu = [
    {
      id: "bd7acbea-c1b1-46c2-aed5-3ad53abb28ba",
      title: "New",
    },
    {
      id: "3ac68afc-c605-48d3-a4f8-fbd91aa97f63",
      title: "Processing",
      // key:'Previous Orders'
    },
    {
      id: "58694a0f-3da1-471f-bd96-145571e29d72",
      title: "Out for Delivery",
    },
  ];

  const data = [
    {
      id: "bd7acbea-c1b1-46c2-aed5-3ad53abb28ba",
      title: "Active Order",
    },
    {
      id: "3ac68afc-c605-48d3-a4f8-fbd91aa97f63",
      title: "Previous Orders",
    },
  ];

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
            source={require("../assets/back3x.png")}
          />
        </TouchableOpacity>
        <View style={{marginLeft:1}}>
        <Text style={styles.headerTitle}>Sort & Filter</Text>
        </View>
      </View>

      <ScrollView>

        <View >

          <FilterCard
            
            ID="S O R T BY                                                                             "
            name="Orders"
            ID2="FILTER"
            mode='Mode of Payment'
            mode1="Cash on Delivery"
            mode2="Card Payment"
            mode3="Online Payment"
            Time="7Mins Ago"
            orderType="Newest orders first"
            name2='Oldest orders first'
          />
        </View>
      </ScrollView>
      <TouchableOpacity style={styles.SubmitButtonStyle}>
          <Text style={{fontSize:18,marginLeft:'43%',marginBottom:"12%",color:'#fff'}}>Apply</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.SubmitButtonStyles}>
          <Text style={{fontSize:18,marginLeft:'40%',marginBottom:10,color:'#21272E'}}>Clear All</Text>
      </TouchableOpacity>
    </View>
  );
};

export default FilterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F5F7",
  },
  headerTitle: {
    color: "#2B2520",
    fontFamily: "Poppins-Medium",
    fontSize: 18,
    marginTop:2
  },
  SubmitButtonStyles: {
    marginTop: 10,
    width: '100%',
    height: 45,
    paddingTop: 15,
    paddingBottom: 15,
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#fff",
    marginBottom:10
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
  SubmitButtonStyle: {
    marginTop: 10,
    width: '100%',
    height: 45,
    paddingTop: "3%",
    paddingBottom: 15,
    backgroundColor: "#51AF5E",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#fff",
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
