import React from "react";

import { View, StyleSheet, Dimensions, Text } from "react-native";
import Swiper from "react-native-swiper";

export default class SwiperCard extends React.Component {
  render() {
    return (
      <View style={{ height: 180, width: "100%" }}>
        <Swiper
          loop={false}
          dot={<View style={styles.dot} />}
          activeDot={<View style={styles.activedot} />}
        >
          {this.props.children}
        </Swiper>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#BEC8D5",
    marginHorizontal: 2,
  },
  activedot: {
    backgroundColor: "#2B2520",
    width: 20,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 3,
  },
});
