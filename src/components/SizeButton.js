import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

export default class SizeButton extends React.Component {
  render() {
    return (
      <TouchableOpacity
        activeOpacity={0.6}
        onPress={() => alert("")}
        style={[
          styles.button,
          {
            backgroundColor: this.props.active ? "#6AA34A10" : "white",
            borderColor: this.props.active ? "#6AA34A" : "#EDEDED",
          },
        ]}
      >
        <Text
          style={[
            styles.heading,
            {
              color: this.props.active ? "#6AA34A" : "black",
              fontSize: 16,
              textAlign: "center",
            },
          ]}
        >
          {this.props.number}
        </Text>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    borderWidth: 1,
    margin: 10,
    padding: 10,
    paddingLeft: 15,
    paddingRight: 15,
  },
  heading: {
    color: "#2B2520",
    fontFamily: "Lato-Bold",
    fontSize: 22,
  },
});
