import React from "react";
import { View, StyleSheet, Text, Image } from "react-native";

export default class ProductCard extends React.Component {
  render() {
    return (
      <View style={styles.product}>
        <View style={{ flex: 1 }}>
          <Image source={this.props.image} />
        </View>
        <View>
        <Text style={styles.tagText}>{this.props.manufacturer}</Text>
        </View>
        <View style={styles.infoContainer}>
          <View style={{ flexDirection: "row" }}>
            <Text style={[styles.tabText]}>{this.props.name}</Text>
            <Text style={styles.price}> {this.props.price}</Text>
          </View>          
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  tabText: {
    color: "#2B2520",
    fontFamily: "Lato-Black",
    flexWrap:"wrap",width:200,marginTop:5
  },
  product: {
    alignItems: "flex-start",
    marginTop: 10,
    backgroundColor: "white",
    elevation: 2,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "white",
    paddingTop: 20,
    paddingBottom: 10,
  },
  price: {
    fontFamily: "Lato-Bold",
    fontSize: 20,
    marginLeft: "16%",
  },
  infoContainer: {
    flex: 2,
    justifyContent: "space-between",
  },
  tagText: {
    color: "#84694D",
    fontFamily: "Lato-Regular",
  },
});
