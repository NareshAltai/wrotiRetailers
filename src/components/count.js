import React, { Component } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

import AntDesign from "react-native-vector-icons/AntDesign";

class Counter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clicks: 0,
      show: true,
    };
  }

  IncrementItem = () => {
    this.setState({ clicks: this.state.clicks + 1 });
  };
  DecreaseItem = () => {
    if (this.state.clicks != 0) {
      this.setState({ clicks: this.state.clicks - 1 });
    }
  };
  ToggleClick = () => {
    this.setState({ show: !this.state.show });
  };

  render() {
    return (
      <View
        style={[styles.container, { borderColor: "#E85A00", borderWidth: 1 }]}
      >
        <TouchableOpacity
          style={[styles.button, { borderRightWidth: 0.7 }]}
          onPress={this.DecreaseItem}
          activeOpacity={0.6}
        >
          <AntDesign name="minus" size={18} color="#E85A00" />
        </TouchableOpacity>
        {this.state.show ? (
          <Text
            style={[
              styles.button,
              { borderWidth: 0, backgroundColor: "white" },
            ]}
          >
            {this.state.clicks}
          </Text>
        ) : null}
        <TouchableOpacity
          style={[styles.button, { borderLeftWidth: 0.7 }]}
          onPress={this.IncrementItem}
          activeOpacity={0.6}
        >
          <AntDesign name="plus" size={18} color="#E85A00" />
        </TouchableOpacity>
      </View>
    );
  }
}

export default Counter;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 4,
    borderWidth: 1,
    justifyContent: "space-between",
    width: 100,
    marginTop: 15,
  },
  button: {
    padding: 6,
    alignItems: "center",
    borderColor: "#E85A00",
    backgroundColor: "#FDEEE5",
  },
});
