import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

export default class MyOrderCard extends React.Component {
  render() {
    return (
      <View style={styles.card}>
        <View style={styles.info}>
          <View>
            <Text style={styles.title}>{`${this.props.name}`}</Text>
            <Text style={styles.tags}>4 Items •{`${this.props.price}`}</Text>
          </View>
          <View style={styles.chip}>
            <Text
              style={[
                styles.status,
                {
                  color:
                    this.props.status === "In-Progress" ? "#EA7878" : "green",
                },
              ]}
            >
              {this.props.status}
            </Text>
          </View>
        </View>
        <View style={{ marginVertical: 20 }}>
          <Text style={{ fontFamily: "Lato-Regular", color: "#2B2520" }}>
            Orange • 1kg, Apple • 1kg
          </Text>
          <Text
            style={{
              fontFamily: "Lato-Regular",
              color: "#2B2520",
              marginTop: 5,
            }}
          >
            {this.props.orderDate}
          </Text>
        </View>
        {this.props.showButton ? (
          <TouchableOpacity activeOpacity={0.7} style={styles.btn}>
            <Text style={styles.track}>TRACK ORDER</Text>
          </TouchableOpacity>
        ) : (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginHorizontal: 10,
            }}
          >
            <TouchableOpacity
              style={styles.reorder}
              activeOpacity={0.7}
              onPress={() => alert("")}
            >
              <Text
                style={{
                  color: "#ED813C",
                  fontFamily: "Lato-Bold",
                  textAlign: "center",
                }}
              >
                REORDER
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.rate}
              activeOpacity={0.7}
              onPress={() => alert("")}
            >
              <Text
                style={{
                  color: "#47433E",
                  fontFamily: "Lato-Bold",
                  textAlign: "center",
                }}
              >
                RATE ORDER
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    marginTop: 30,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "lightgrey",
  },
  info: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  chip: {
    backgroundColor: "#F9F5F5",
    padding: 5,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    height: 24,
  },
  status: {
    fontFamily: "Lato-Bold",
    fontSize: 10,
  },
  title: {
    fontFamily: "Lato-Bold",
    fontSize: 16,
    color: "#2B2520",
  },
  tags: {
    color: "#84694D",
    fontFamily: "Lato-Regular",
    marginTop: 5,
  },
  btn: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "#EF8C4E",
    backgroundColor: "#FEF5F0",
  },
  track: {
    color: "#EC7A32",
    fontFamily: "Lato-Bold",
    textAlign: "center",
  },
  reorder: {
    borderWidth: 1,
    borderColor: "#EF8C4E",
    padding: 10,
    borderRadius: 5,
    width: 150,
  },
  rate: {
    borderWidth: 1,
    borderColor: "#47433E",
    padding: 10,
    borderRadius: 5,
    width: 150,
  },
});
