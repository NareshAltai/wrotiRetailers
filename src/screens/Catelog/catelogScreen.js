import React, { useEffect } from "react";
import {
  Text,
  StyleSheet,
  FlatList,
  View,
  TouchableOpacity,
  StatusBar, Image
} from "react-native";
import { Divider } from "react-native-paper";
import { useTheme } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CatelogScreen = ({ navigation }) => {
  const [catelogScreenData, setCatelogScreensData] = React.useState();
  const catelogScreensData = [
    { name: "Categories", screen: "categoriesScreen" },
    { name: "Products", screen: "ProductScreen" },
    // { name: "Options", screen: "optionsScreen" },
  ];
  const theme = useTheme();

  const getStoreType = async()=>{
    let store_type = await AsyncStorage.getItem("store_type");
    if(store_type === "default"){
      setCatelogScreensData([
        { name: "Categories", screen: "categoriesScreen" },
        { name: "Products", screen: "ProductScreen" },
        { name: "Options", screen: "optionsScreen" },
      ])
    }else{
      setCatelogScreensData([
        { name: "Categories", screen: "categoriesScreen" },
        { name: "Products", screen: "ProductScreen" },
        // { name: "Options", screen: "optionsScreen" },
      ])
    }
  }

  useEffect(() => {
    getStoreType();
  }, []);


  const renderItem = ({ item }) => (
    <View >
      <TouchableOpacity onPress={() => navigationOfScreens(item)} style={styles.item}>
        <Text style={{ fontSize: 25, color:'#fff',fontFamily:'Poppins-Bold',textAlign:'center',marginTop:'6%' }}>{item.name}</Text>
      </TouchableOpacity>
      <Divider />
    </View>
  );

  const navigationOfScreens = async (item) => {
    if (item.name == "Categories") {
      navigation.navigate("categoriesScreen");
    } else if (item.name == "Products") {
      navigation.navigate("ProductScreen");
    } else {
      navigation.navigate("optionsScreen");
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
            Catalogue
          </Text>
        </View>
      </View>
      <Divider />
      <View style={{marginBottom:10}}/>
      <FlatList data={catelogScreenData} renderItem={renderItem} />
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
    height: 100,
      marginHorizontal: 10,
      backgroundColor: "#1B6890",
      elevation: 2,
      padding: 10,
      borderRadius: 5,
      marginVertical: 5,
  },
});

export default CatelogScreen;
