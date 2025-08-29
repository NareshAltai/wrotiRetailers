import React, { useState } from "react";
import { View, TouchableOpacity, Text, StyleSheet, Image } from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";

export default class OrderDeliveredCard extends React.Component {
  updatestatusorder = () => {
    this.props.statusUpdate(this.props.order_id, this.props.order_status_id);
  };
  render() {
    return (
      <View
        activeOpacity={0.7}
        style={styles.container}
      >
        <View style={styles.card}>
          <View>
            <View style={{ flexDirection: "row", marginBottom: 5 }}>
              <Text style={{  fontSize: 14,fontStyle:"Poppins-Medium" }}>
                #{this.props.ID}
              </Text>
              <Text style={{ marginLeft: 1, fontSize: 14,fontStyle:"Poppins-Medium"  }}>
                {" "}
                • {this.props.name}
              </Text>
            </View>
            <View >
            {this.props.products &&
            this.props.products.map((val, i) => {
              return (
                <View style={{ flexDirection:"row"}}>
                  <Text
                    style={{
                      fontSize: 15,
                      color: "#21272E",
                      flexWrap:"wrap",width:190,fontStyle:"Poppins-Medium",
                      marginBottom:5
                    }}
                  >
                    {val.name}
                  </Text>
                  <View style={{marginLeft:"16%"}}>
                    <Text style={{textAlign:'right',fontSize:16,fontStyle:"Poppins-ExtraBold"}}>
                    {val.price}
                    </Text>
                  </View>
                </View>
              );
            })}
            </View>
            <Text
              style={{
                color: "#3D86B4",marginTop:1,
                marginBottom: 3,fontStyle:"Poppins-Medium" 
              }}
            >
              {this.props.orderType}
            </Text>
          </View>
        </View>
        <View style={styles.details}>
          <Image
            style={{ width: 20, height: 20, resizeMode: "center" }}
            source={require("../assets/loc3x.png")}
          />
          <Text style={{flexWrap:"wrap",width:155}}>{this.props.location}</Text>
          <TouchableOpacity onPress={this.props.onPress}>
          <Text style={{ color: "#34A549",fontSize: 14,marginLeft:'31%' }}>
          VIEW DETAILS
          </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
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
