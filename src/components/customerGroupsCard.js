import React, { useState } from "react";
import { View, TouchableOpacity, Text, StyleSheet, Image } from "react-native";

export default class OrderCard extends React.Component {
  dailcall = () => {
    this.props.call(this.props.phone);
  };

  openWhatsapp = () => {
    this.props.whatsapp(this.props.phone);
  };
 

  render() {
    return (
      <TouchableOpacity onPress={this.props.onPress}>
        <View activeOpacity={0.7} style={styles.container}>
          <View style={styles.card}>
            <View>
              <View
                style={{ marginLeft: 5, flexDirection: "row", marginBottom: 5 }}
              >
                <Text style={{ fontSize: 14, fontStyle: "Poppins-Medium" }} />
                <Text
                  style={{
                    fontSize: 14,
                    fontStyle: "Poppins-Medium",
                    color: "#21272E",
                  }}
                >
                  {this.props.name}
                </Text>
                {/* <View style={{}}>
                <Text
                  style={{
                    fontSize: 14,
                    justifyContent: "flex-end",
                    alignItems: "flex-end",
                  }}
                />
              </View> */}
              </View>
            </View>
          </View>

          <View style={styles.details}>
            {/* <Text style={{ color: "grey" }}>{this.props.price}</Text> */}
            <Text
              style={{
                marginLeft: 5,
                color: "#9BA0A7",
                fontFamily: "poppins-Regular",
                fontSize: 12,
              }}
            >
              {this.props.phone}
            </Text>
            <View style={{ flex: 1, alignItems: "flex-end" }}>
              <TouchableOpacity onPress={this.dailcall}>
                <Image
                  style={{ width: 20, height: 20, resizeMode: "center" }}
                  source={require("../assets/dail3x.png")}
                />
              </TouchableOpacity>
            </View>
            <View style={{ flex: 0.2, alignItems: "flex-end" }}>
              <TouchableOpacity onPress={this.openWhatsapp}>
                <Image
                  style={{ width: 25, height: 25, resizeMode: "center" }}
                  source={require("../assets/wp3.png")}
                />
              </TouchableOpacity>
            </View>
            <View style={{ flex: 0.2, alignItems: "flex-end" }}>
              <TouchableOpacity>
                <Image
                  style={{ width: 20, height: 20, resizeMode: "center" }}
                  source={require("../assets/customergroup.png")}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 10,
    backgroundColor: "white",
    elevation: 1,
    padding: 10,
  },
  card: {
    flexDirection: "row",
  },
  details: {
    flexDirection: "row",
    marginTop: 1,
  },
  text: {
    marginLeft: 10,
  },

  SubmitButtonStyles: {
    marginTop: 10,
    width: 150,
    height: 35,
    paddingTop: 8,
    paddingBottom: 15,
    backgroundColor: "#E26251",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#fff",
    marginLeft: 20,
  },

  SubmitButtonStyle: {
    marginTop: 10,
    width: 150,
    height: 35,
    paddingTop: 8,
    paddingBottom: 15,
    backgroundColor: "#51AF5E",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#fff",
  },

  TextStyle: {
    color: "#fff",
    fontSize: 13,
    marginHorizontal: 50,
    marginBottom: 20,
  },
});
