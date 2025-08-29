import React from "react";
import { View, Text, Image, StyleSheet, Dimensions } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import StarRating from "react-native-star-rating";

const NewProductCard = (props) => {
  return (
    <View style={styles.container}>
      <View style={styles.favIconView}>
        <Icon name="heart-outline" size={24} />
      </View>
      <View style={styles.productImgView}>
        <Image
          source={
            props.image
              ? { uri: image }
              : require("../../assets/images/cheese.png")
          }
          style={styles.productImage}
        />
      </View>
      <View
        style={{
          marginHorizontal: 5,
          marginTop: 10,
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <StarRating
          disabled={true}
          maxStars={5}
          emptyStarColor="#EAECF0"
          fullStarColor="#F8CA0D"
          starSize={20}
          starStyle={{ marginLeft: 2 }}
          containerStyle={{
            width: 50,
          }}
          rating={4}
        />
        <Image source={props.tagImage1} />
      </View>
      <View style={styles.namePriceView}>
        <View>
          <Text style={styles.headingTitle} numberOfLines={1}> 
          {props.title.length > 20 ? props.title.substring(0, 20) + '...' : props.title} 
          </Text>
          <Text style={styles.headingSubTitle}>{props.tag}</Text>
        </View>
        <View style={styles.priceView}>
          <Text style={styles.priceText}>{props.price}</Text>
        </View>
      </View>
      <View style={styles.addToCartBtnView}>
        <Icon name="plus" size={16} color={"#E85A00"} />
        <Text style={styles.addToCartBtnText}>ADD TO CART</Text>
      </View>
    </View>
  );
};

const DEVICE_WIDTH = Dimensions.get("window").width;

const styles = StyleSheet.create({
  container: {
    width: (DEVICE_WIDTH * 3) / 5,
    marginVertical: 10,
    marginLeft: 2,
    marginRight: 20,
    shadowColor: "black",
    shadowOpacity: 0.26,
    shadowOffset: { width: 1, height: 2 },
    shadowRadius: 8, // Shadow only works on IOS
    elevation: 5, // Elevation works in Android
    borderRadius: 8,
    backgroundColor: "white",
  },
  favIconView: {
    alignItems: "flex-end",
    paddingHorizontal: 5,
    paddingVertical: 5,
  },
  productImgView: {
    alignItems: "center",
  },
  productImage: {
    width: 100,
    height: 100,
  },
  namePriceView: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  nameTitle: {
    color: "#2b2520",
    fontSize: 16,
    fontWeight: "bold",
  },
  nameCompany: {
    color: "#84694D",
    fontSize: 13,
  },
  priceView: {
    justifyContent: "center",
    alignItems: "center",
  },
  priceText: {
    color: "#2b2520",
    fontWeight: "900",
    fontSize: 16,
    fontFamily: "Lato-Bold",
  },
  addToCartBtnView: {
    marginHorizontal: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#E85A00",
    height: 25,
    borderRadius: 2,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  addToCartBtnText: {
    color: "#E85A00",
    paddingLeft: 5,
  },
  headingTitle: {
    color: "#2B2520",
    fontSize: 15,
    fontFamily: "Lato-Bold",
  },
  headingSubTitle: {
    color: "#84694D",
    fontSize: 14,
    fontFamily: "Lato-Regular",
    marginTop: 3,
  },
});

export default NewProductCard;
