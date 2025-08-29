import React from "react";
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Image,
} from "react-native";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import StarRating from "react-native-star-rating";
import Count from "./count";

export default class NewRecepieCard extends React.Component {
  render() {
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={this.props.onPress}
        activeOpacity={0.9}
      >
        <ImageBackground
          imageStyle={{ borderRadius: 6 }}
          source={this.props.image}
          style={styles.image}
        >
          <View style={styles.itemContainer}>
            {this.props.showTime ? (
              <View
                style={[
                  styles.timeBox,
                  { backgroundColor: this.props.backgroundColor },
                ]}
              >
                <Text style={styles.time}>{this.props.time}</Text>
              </View>
            ) : (
              <View />
            )}
            <View style={{ marginTop: 10, marginRight: 10 }}>
              <EvilIcons name="heart" size={25} color="white" />
            </View>
          </View>
        </ImageBackground>
        <View style={styles.cardBody}>
          <View style={styles.itemContainer}>
            <View>
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
            </View>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Image source={this.props.tagImage1} />
              <Image source={this.props.tagImage2} />
            </View>
          </View>
          <View style={styles.itemContainer}>
            <View>
              <Text style={styles.headingTitle}>{this.props.title}</Text>
              <Text style={styles.headingSubTitle}>{this.props.tags}</Text>
            </View>
            <View>
              <Text style={[styles.headingTitle, { fontSize: 18 }]}>
                {this.props.price}
              </Text>
            </View>
          </View>
          {this.props.showButton ? (
            <View>
              <TouchableOpacity
                style={styles.button}
                activeOpacity={0.9}
                onPress={() => alert("Add Cart")}
              >
                <EvilIcons name="plus" size={25} color="#E85A00" />

                <Text style={styles.addText}>ADD TO CART</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.itemContainer}>
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => alert("remove")}
              >
                <Text style={styles.remove}>Remove</Text>
              </TouchableOpacity>
              <View>
                <Count />
              </View>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    elevation: 2,
    margin: 3,
  },
  image: {
    height: 180,
    resizeMode: "stretch",
  },
  time: {
    color: "#FFFFFF",
    fontSize: 12,
    fontFamily: "Lato-Bold",
    letterSpacing: 2,
  },
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  timeBox: {
    borderBottomRightRadius: 7,
    borderTopRightRadius: 7,
    padding: 7,
    marginTop: 10,
  },
  cardBody: {
    padding: 10,
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
  remove: {
    color: "#95928F",
    fontSize: 16,
  },
  button: {
    borderWidth: 1,
    borderColor: "#E85A00",
    padding: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    borderRadius: 6,
  },
  addText: {
    color: "#E85A00",
    fontSize: 14,
    fontFamily: "Lato-Bold",
    marginLeft: 6,
  },
});
