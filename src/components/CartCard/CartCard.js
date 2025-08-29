import React from "react";
import { View, Text, Image } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import styles from "./styles";

const CartCard = (props) => {
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
      <View style={styles.namePriceView}>
        <View>
          <Text class={styles.nameTitle}>{props.name}</Text>
          <Text class={styles.nameCompany}>{props.brand}</Text>
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

export default CartCard;
