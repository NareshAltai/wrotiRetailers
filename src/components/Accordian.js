import React, { Component } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  LayoutAnimation,
  Platform,
  UIManager,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";

export default class Accordian extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: props.data,
      expanded: false,
    };

    if (Platform.OS === "android") {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }

  render() {
    return (
      <View
        style={{
          marginVertical: 10,
          borderBottomWidth: 1,
          borderBottomColor: "#DCDCDC",
          padding: 5,
        }}
      >
        <TouchableOpacity
          activeOpacity={0.7}
          ref={this.accordian}
          style={styles.row}
          onPress={() => this.toggleExpand()}
        >
          <Text
            style={[
              styles.title,
              {
                fontFamily: this.state.expanded
                  ? "Poppins-Medium"
                  : "Poppins-Medium",
                color: this.state.expanded ? "#34A549" : "black",
              },
            ]}
          >
            {this.props.title}{' '}{this.props.subTitle}
          </Text>
          <Icon
            name={this.state.expanded ? "arrow-up" : "arrow-down"}
            size={20}
            color={this.state.expanded ? "#34A549" : "black"}
          />
        </TouchableOpacity>
        <View style={styles.parentHr} />
        {this.state.expanded && this.props.children}
      </View>
    );
  }

  toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    this.setState({ expanded: !this.state.expanded });
    if (!this.state.expanded) {
      this.props.loadOrdersById(
        this.props.main_tab_key,
        this.props.sub_tab_Key
      );
    }
  };
}

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  parentHr: {
    height: 10,
    width: "100%",
  },
});
