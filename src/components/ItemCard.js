import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import StarRating from "react-native-star-rating";

export default class ItemCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      starCount: 3.5,
    };
  }
  render() {
    return (
      <View style={styles.card}>
        <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
          <View style={{ flex: 1 }}>
            <Image
              source={require("../assets/images/01.png")}
              style={styles.Image}
            />
          </View>
          <View style={{ flex: 3 }}>
            <Text style={{ fontWeight: "bold" }}>
              FRONT SHOCK ABSORBER GREEN BUSH SET ACTIVA (OE)
            </Text>
            <View
              style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 5 }}
            >
              <Text style={styles.text}>Supplier:</Text>
              <Text style={{ fontWeight: "bold" }}>
                &nbsp;Shine Auto Spare Parts
              </Text>
            </View>
            <Text style={[styles.text, { fontSize: 13, marginTop: 7 }]}>
              Lorem Ipsum has been the industry's standard dummy text
            </Text>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 10,
              }}
            >
              <Text style={{ fontWeight: "bold" }}>RS.38.95</Text>
              <Text style={{ fontWeight: "bold" }}>Quantity:1</Text>
            </View>
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 20,
          }}
        >
          <StarRating
            disabled={true}
            maxStars={5}
            fullStarColor="#F1CA00"
            rating={this.state.starCount}
            emptyStarColor="#F1CA00"
            starSize={20}
            containerStyle={{ width: 40 }}
          />

          <TouchableOpacity style={styles.button}>
            <Text style={{ fontSize: 10 }}>Write a Review</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  card: {
    elevation: 2,
    backgroundColor: "white",
    padding: 20,
    marginTop: 10,
    borderRadius: 10,
    marginHorizontal: 2,
  },
  Image: {
    width: 60,
    height: 60,
    resizeMode: "stretch",
  },
  text: {
    color: "grey",
    fontSize: 14,
  },
  button: {
    borderColor: "grey",
    padding: 5,
    borderRadius: 6,
    borderWidth: 1,
  },
});
