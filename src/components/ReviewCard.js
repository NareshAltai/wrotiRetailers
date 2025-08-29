import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
} from "react-native";
import StarRating from "react-native-star-rating";
const width = Dimensions.get("window").width;

export default class ReviewCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      starCount: 4,
    };
  }
  render() {
    return (
      <TouchableOpacity style={styles.card}>
        <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
          <Image
            source={require("../assets/fb.png")}
            style={{ width: 50, height: 50, resizeMode: "stretch" }}
          />
          <View style={{ marginLeft: 10 }}>
            <Text style={styles.heading}>Amit Dutta</Text>
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
              rating={this.state.starCount}
            />
          </View>
        </View>
        <View>
          <Text
            style={[
              styles.heading,
              {
                color: "#95928F",
                fontFamily: "Lato-Regular",
                fontSize: 14,
                marginVertical: 5,
              },
            ]}
          >
            Reviewed on Sep 1, 2020
          </Text>
          <Text
            style={[
              styles.heading,
              {
                fontFamily: "Lato-Regular",
                fontSize: 14,
                textAlign: "justify",
                paddingTop: 10,
                width: width - 65,
              },
            ]}
          >
            Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
            nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam
            erat, sed diam voluptua. At vero eos et accusam et justo duo dolores
            et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    elevation: 4,
    padding: 10,
    marginTop: 13,
    borderRadius: 10,
    margin: 5,
  },
  heading: {
    color: "#2B2520",
    fontFamily: "Lato-Bold",
    fontSize: 16,
    marginLeft: 5,
    marginBottom: 5,
  },
});
