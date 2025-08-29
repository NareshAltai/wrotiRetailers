import React from "react";
import { View, TouchableOpacity, Text, StyleSheet, Image } from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";
import { Searchbar, Divider } from "react-native-paper";

export default class OrderCard extends React.Component {
  render() {
    return (
      <View
        activeOpacity={0.7}
        onPress={this.props.onPress}
        style={styles.container}
      >
        <View style={styles.card}>
          <View>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text style={styles.text}>{this.props.ID}</Text>
            </View>
            <Divider />
            <View
              style={{
                flexDirection: "row",
                fontFamily: "Lato-RegularBold",
                fontWeight: "bold",
              }}
            >
              <Text style={styles.text}>{this.props.name}</Text>
            </View>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text
                style={{
                  marginLeft: 10,
                  color: "#3D86B4",
                }}
              >
                {this.props.orderType}
              </Text>
              <Image
                style={{ width: 20, height: 20, resizeMode: "center" }}
                source={require("../assets/Tick3x.png")}
              />
            </View>
            <Text
              style={{
                margin: 10,
              }}
            >
              {this.props.name2}
            </Text>

            <Divider />

            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text style={{ margin: 8, fontSize: 15 }}>{this.props.ID2}</Text>
            </View>
            <Text style={{marginTop: "1%", marginLeft:"3%",fontSize: 15}}>{this.props.mode}</Text>

            <Text
              style={{
                marginLeft: "5%",
                fontSize: 14,
                marginTop: 10,
              }}
            >
              {this.props.mode1}
            </Text>
            <Text
              style={{
                marginLeft: "5%",
                fontSize: 14,
                marginTop: 10,
              }}
            >
              {this.props.mode2}
            </Text>
            <Text
              style={{
                marginLeft: "5%",
                fontSize: 14,
                marginTop: 10,
              }}
            >
              {this.props.mode3}
            </Text>

            <Text style={styles.text}>{this.props.date}</Text>
            <Text style={styles.text}>{this.props.id}</Text>
          </View>
        </View>
        <View style={styles.details}>
          {/* <Text style={{ color: "grey" }}>{this.props.price}</Text> */}

          <Text style={{}}>{this.props.location}</Text>
          <Text style={{ color: "#34A549", marginLeft: 40 }}>
            {this.props.status}
          </Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 10,
    backgroundColor: "white",
    elevation: 2,
    padding: 10,
    borderRadius: 5,
  },
  card: {
    flexDirection: "row",
  },
  details: {
    flexDirection: "row",
    marginHorizontal: 10,
    justifyContent: "space-between",
  },
  text: {
    margin: 10,
    fontSize: 15,
  },

  SubmitButtonStyles: {
    marginTop: 10,
    width: 140,
    height: 45,
    paddingTop: 15,
    paddingBottom: 15,
    backgroundColor: "#E26251",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#fff",
    marginLeft: 20,
  },

  SubmitButtonStyle: {
    marginTop: 10,
    width: 140,
    height: 45,
    paddingTop: 15,
    paddingBottom: 15,
    backgroundColor: "#51AF5E",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#fff",
  },

  TextStyle: {
    color: "#fff",
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
    fontSize: 15,
  },
});
