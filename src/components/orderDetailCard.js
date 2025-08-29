import React, { useState } from "react";
import { View, TouchableOpacity, Text, StyleSheet, Image } from "react-native";
import { Searchbar, Divider } from "react-native-paper";
import AntDesign from "react-native-vector-icons/AntDesign";
import RBSheet from "react-native-raw-bottom-sheet";

export default class OrderCard extends React.Component {
  render() {
    return (
      <View>
        <View style={styles.container}>
          <View style={styles.card}>
            <View>
              <View style={{ marginLeft: "32%", marginBottom: 5 }}>
                <Text
                  style={{
                    fontSize: 18,
                    color: "#FFFFFF",
                    marginBottom: 5,
                  }}
                >
                  Order Processing
                </Text>
              </View>
              <View style={{ flexDirection: "row" }}>
                <Text
                  style={{
                    marginLeft: 10,
                    fontSize: 15,
                    color: "#FFFFFF",
                    marginBottom: 5,
                  }}
                >
                  Order Id :{this.props.ID}
                </Text>
                <Text
                  style={{
                    fontSize: 15,
                    color: "#FFFFFF",
                    marginLeft: "44%",
                  }}
                >
                  {this.props.time}
                </Text>
              </View>

              <View style={{ flexDirection: "row", marginTop: 3 }}>
                <Text
                  style={{
                    marginLeft: 10,
                    fontSize: 15,
                    color: "#FFFFFF",
                    marginBottom: 5,
                  }}
                >
                  {this.props.orderType}
                </Text>
                <Text
                  style={{
                    marginLeft: "37%",
                    fontSize: 15,
                    color: "#FFFFFF",
                  }}
                >
                  Total Items • {this.props.total}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View
          style={{
            marginHorizontal: 10,
            backgroundColor: "#fff",
            elevation: 2,
            padding: 10,
            borderRadius: 5,
            marginVertical: 5,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 5,
            }}
          >
            <TouchableOpacity onPress={() =>this.data}>
              <View style={{ flexDirection: "row" }}>
                <Image
                  style={{ width: 12, height: 12, marginTop: 3 }}
                  source={require("../assets/edit2x.png")}
                />
                <Text style={{ color: "#2F6E8F", marginLeft: 5 }}>Edit</Text>
              </View>
            </TouchableOpacity>
          </View>
          <Divider />
          <View style={{ margin: 5 }} />
          {this.props.products &&
            this.props.products.map((val, i) => {
              return (
                <View style={{ flexDirection: "row" }}>
                  <Text
                    style={{
                      fontSize: 15,
                      color: "#21272E",
                      marginBottom: 5,
                      flexWrap:"wrap",width:190 
                    }}
                  >
                    {val.name}
                  </Text>
                  <Text
                    style={{
                      marginLeft: "20%",
                      fontSize: 15,
                      color: "#21272E",
                    }}
                  >
                   {val.quantity} x {val.price}
                  </Text>
                </View>
              );
            })}

          <View style={{ marginBottom: 5 }} />
          <Divider />

          <View style={{ flexDirection: "row", marginTop: 5 }}>
            <Text
              style={{
                marginLeft: 3,
                fontSize: 15,
                color: "#21272E",
                marginBottom: 5,
              }}
            >
              {this.props.itemtotal}
            </Text>
            <Text
              style={{
                marginLeft: "65%",
                fontSize: 12,
                color: "#21272E",
              }}
            >
             {this.props.cost4}
            </Text>
          </View>

          <View style={{ flexDirection: "row" }}>
            <Text
              style={{
                marginLeft: 3,
                fontSize: 15,
                color: "#21272E",
                marginBottom: 5,
              }}
            >
              {this.props.dc}
            </Text>
            <Text
              style={{
                marginLeft: "56%",
                fontSize: 12,
                color: "#21272E",
              }}
            >
              {this.props.cost5}
            </Text>
          </View>
          {/* <View style={{marginBottom:10}}/> */}
          <Divider />
          <View style={{ flexDirection: "row", marginTop: 8 }}>
            <Text
              style={{
                marginLeft: 3,
                fontSize: 15,
                color: "#21272E",
                marginBottom: 5,
              }}
            >
              {this.props.ot}
            </Text>
            <Text
              style={{
                marginLeft: "57%",
                fontSize: 15,
                color: "#21272E",
              }}
            >
              {this.props.cost6}
            </Text>
          </View>
        </View>

        <View
          style={{
            marginHorizontal: 10,
            backgroundColor: "#fff",
            elevation: 2,
            padding: 10,
            borderRadius: 5,
            marginVertical: 5,
          }}
        >
          <Text
            style={{
              marginLeft: 10,
              fontSize: 15,
              color: "#9BA0A7",
              marginBottom: 5,
            }}
          >
            {this.props.custitle}
          </Text>
          <Text
            style={{
              marginLeft: 10,
              fontSize: 12,
              color: "#21272E",
              marginBottom: 5,
            }}
          >
            {this.props.cusname}
          </Text>
          <Text
            style={{
              marginLeft: 10,
              fontSize: 15,
              color: "#9BA0A7",
              marginBottom: 5,
            }}
          >
            {this.props.mobtitle}
          </Text>
          <Text
            style={{
              marginLeft: 10,
              fontSize: 12,
              color: "#21272E",
              marginBottom: 5,
            }}
          >
            {this.props.mobile}
          </Text>
          <Text
            style={{
              marginLeft: 10,
              fontSize: 15,
              color: "#9BA0A7",
              marginBottom: 5,
            }}
          >
            {this.props.mailtitle}
          </Text>
          <Text
            style={{
              marginLeft: 10,
              fontSize: 12,
              color: "#21272E",
              marginBottom: 5,
            }}
          >
            {this.props.mailid}
          </Text>
          <Text
            style={{
              marginLeft: 10,
              fontSize: 15,
              color: "#9BA0A7",
              marginBottom: 5,
            }}
          >
            {this.props.addtitle}
          </Text>
          <Text
            style={{
              marginLeft: 10,
              fontSize: 12,
              color: "#21272E",
              marginBottom: 5,
            }}
          >
            {this.props.add}
          </Text>
        </View>
        {/* <View style={{ flexDirection: "column" }}>
          <TouchableOpacity style={styles.SubmitButtonStyle}>
            <Text style={styles.TextStyle}> Accept </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.SubmitButtonStyles}>
            <Text
              style={{
                color: "#0F0F0F",
                textAlign: "center",
                justifyContent: "center",
                alignItems: "center",
                fontSize: 13,
              }}
            >
              {" "}
              Decline{" "}
            </Text>
          </TouchableOpacity>
        </View> */}
      </View>
    );
  }
}



const styles = StyleSheet.create({
  container: {
    marginHorizontal: 10,
    backgroundColor: "#2F6E8F",
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
    marginHorizontal: 10,
    justifyContent: "space-between",
  },
  text: {
    marginLeft: 10,
  },

  SubmitButtonStyles: {
    marginTop: 10,
    width: "100%",
    height: 45,
    paddingTop: 15,
    paddingBottom: 15,
    backgroundColor: "#F7F7FC",
    borderRadius: 10,
  },

  SubmitButtonStyle: {
    marginTop: 10,
    width: "100%",
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
