import React, { useState } from "react";
import { View, TouchableOpacity, Text, StyleSheet, Image } from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";

export default class AddItemCard extends React.Component {
  updatestatusorder = () => {
    this.props.statusUpdate(this.props.order_id, this.props.order_status_id);
  };
  render() {
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={this.props.onPress}
        style={styles.container}
      >
        <View style={styles.card}>
         {/* <Text>Product Image</Text>

          <View
            style={{
              width: 100,
              height: 100,
              backgroundColor: "red",
            }}
          />

          <Text>Product Name</Text>
          <TextInput
            style={styles.input}
            onChangeText={onChangeText}
            value={text}
            placeholder="useless placeholder"
          />
          <Text>Price</Text>
          <TextInput
            style={styles.input}
            onChangeText={onChangeNumber}
            value={number}
            placeholder="useless placeholder"
            keyboardType="numeric"
          />

          <View>
            <Text
              style={{
                color: "#292A31",
                fontSize: 14,
                fontFamily: "Lato-Regular",
                marginVertical: 2,
              }}
            >
              Category
            </Text>
            <View
              style={{
                width: "100%",
                paddingVertical: 15,
                backgroundColor: "#F7F7FC",
                marginVertical: 6,
              }}
            >
              <Menu
                anchor={
                  <TouchableOpacity
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginHorizontal: 10,
                    }}
                    activeOpacity={0.7}
                  >
                    <Text>CupCake</Text>
                    <Image
                      style={{
                        width: 16,
                        height: 11,
                        marginLeft: 10,
                      }}
                      source={require("../assets/downarrow.png")}
                    />
                  </TouchableOpacity>
                }
              />
            </View>
            <Text>Add Product Description</Text>
            <TextInput
              style={{
                height: 150,
                margin: 12,
                padding: 10,
                backgroundColor: "#F7F7FC",
              }}
              onChangeText={onChangeDescription}
              value={description}
              placeholder="useless placeholder"
            />

            <Text>Item Code</Text>
            <TextInput
              style={styles.input}
              onChangeText={onChangeItemCode}
              value={itemcode}
              placeholder="useless placeholder"
            />

            <TouchableOpacity
              style={{
                marginTop: 10,
                width: "100%",
                height: 45,
                paddingTop: 11,
                paddingBottom: 15,
                backgroundColor: "#51AF5E",
                borderRadius: 10,
                borderWidth: 1,
                borderColor: "#fff",
              }}
            >
              <Text
                style={{
                  color: "#fff",
                  textAlign: "center",
                  justifyContent: "center",
                  alignItems: "center",
                  fontSize: 16,
                }}
              >
                {" "}
                Save{" "}
              </Text>
            </TouchableOpacity>
          </View> */}
        </View>
      </TouchableOpacity>
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
    marginVertical: 5,
  },
  card: {
    flexDirection: "row",
  },
  details: {
    flexDirection: "row",
    marginHorizontal: 5,
    marginTop: 3,
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
