import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";

const PromotionListing = ({ navigation }) => {
  return (
    <View style={styles.container}>
    <TouchableOpacity style={{height: 50, width: 300, justifyContent: "center", alignSelf: "center",
     borderRadius:10, backgroundColor: "#549666"}}
     onPress={()=> navigation.navigate('CreatePromotion')}>
      <Text style={{color: "#FFF", alignSelf: "center",fontSize: 14, fontFamily: "Poppins-SemiBold"}}>Add Promotion</Text>
    </TouchableOpacity>
    </View>
  );
};

export default PromotionListing;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent:'center',
    alignItems:'center'
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
    marginHorizontal: 5,
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 50,
    resizeMode: "stretch",
  },
  heading: {
    color: "#2B2520",
    fontFamily: "Lato-Bold",
    fontSize: 16,
    alignItems: "center",
    textAlign: "center",
  },

  number: {
    color: "#84694D",
    fontFamily: "Lato-Regular",
    fontSize: 15,
    marginTop: 5,
  },
  btnText: {
    color: "white",
    fontSize: 15,
    fontFamily: "Lato-Bold",
    marginTop: 5,
  },
  body: {
    marginHorizontal: 10,
    marginVertical: 20,
  },
  card: {
    backgroundColor: "#fff",
    elevation: 1,
    padding: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  order: {
    color: "#2B2520",
    fontSize: 15,
    fontFamily: "Lato-Bold",
    marginVertical: 10,
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FAFAFA",
  },
  button: {
    marginHorizontal: 50,
    marginTop: 30,
    padding: 10,
    borderWidth: 1,
    borderColor: "#DDD6D1",
    borderRadius: 2,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#34A549",
  },
  logout: {
    color: "#A49A91",
    fontFamily: "Lato-Bold",
    marginLeft: 10,
  },
  btn: {
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#34A549",
    marginRight: 30,
    marginLeft: 30,
    marginTop: 10,
    borderRadius: 5,
  },
  text: {
    fontSize: 18,
    textAlign: "center",
  },
  instructions: {
    fontSize: 12,
    color: "#34A549",
    marginBottom: 5,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    textAlign: "center",
  },
});
