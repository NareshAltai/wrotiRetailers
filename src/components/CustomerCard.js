import React, { useState } from "react";
import { View, TouchableOpacity, Text, StyleSheet, Image } from "react-native";

export default class OrderCard extends React.Component {
  dailcall = () => {
    this.props.call(this.props.phone);
  };

  openWhatsapp = () => {
    this.props.whatsapp(this.props.phone);
  };

  editCustomer = () => {
    this.props.updateCustomer(this.props.customer_group_id)
  }

  render() {
    return (
      <TouchableOpacity onPress={this.props.onPress}>
        <View activeOpacity={0.7} style={styles.container}>
          <View style={styles.details}>
              <View
                style={{ marginLeft: 5, flexDirection: "row", marginBottom: 5 }}
              >
                <Text style={{ fontSize: 14, fontFamily: "Poppins-Bold" }} />
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: "Poppins-Medium",
                    color: "#21272E",
                  }}
                >
                 {this.props.name.substring(0, 14)}{this.props.name.length>14 ?'...': ''}
                </Text>
              </View>
              <View style={{flexDirection:'row',marginLeft:'auto'}}>
            <View style={{ marginRight:5}}>
              <TouchableOpacity onPress={this.editCustomer}>
                <Image
                  style={{ width: 28, height: 30, resizeMode: "center"}}
                  source={require("../assets/e3x.png")}
                />
              </TouchableOpacity>
            </View>
            <View style={{marginRight:5 }}>
              <TouchableOpacity onPress={this.dailcall}>
                <Image
                  style={{ width: 20, height: 20, marginRight: 5 }}
                  source={require("../assets/dail3x.png")}
                />
              </TouchableOpacity>
            </View>
            <View style={{ marginRight:5 }}>
              <TouchableOpacity onPress={this.openWhatsapp}>
                <Image
                  style={{ width: 25, height: 25, resizeMode: "center", }}
                  source={require("../assets/wp3.png")}
                />
              </TouchableOpacity>
            </View>
            <View style={{}}>
              <TouchableOpacity>
                <Image
                  style={{ width: 20, height: 20, resizeMode: "center" }}
                  source={require("../assets/customergroup.png")}
                />
              </TouchableOpacity>
            </View>
            </View>
          </View>

          <View style={styles.details}>
            {/* <Text style={{ color: "grey" }}>{this.props.price}</Text> */}
            <Text
              style={{
                marginLeft: 5,
                color: "#9BA0A7",
                fontFamily: "Poppins-Regular",
                fontSize: 12,
              }}
            >
              {this.props.phone.substring(0, 14)}
            </Text>
            
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
    padding: 15,
    // margin: 5
    //borderRadius: 5,
    //marginVertical: 1,
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
    // fontStyle:'Poppins-SemiBold'
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
