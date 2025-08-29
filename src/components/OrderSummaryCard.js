import React from "react";
import { View, TouchableOpacity, Text, StyleSheet,Image } from "react-native";
import { Searchbar, Divider } from "react-native-paper";
import AntDesign from "react-native-vector-icons/AntDesign";

export default class OrderCard extends React.Component {
  render() {
    return (
      <View>
        <View style={styles.container}>
          <View style={styles.card}>
            <View>
              <View style={{ marginLeft: "35%", marginBottom: 5 }}>
                {/* <Text
                  style={{
                    marginLeft: "8%",
                    fontSize: 18,
                    color: "#FFFFFF",
                    marginBottom: 5,
                  }}
                >
                  {this.props.ID}
                </Text> */}
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
                  {this.props.name}
                </Text>
                <Text
                  style={{
                    marginLeft: "28%",
                    fontSize: 12,
                    color: "#FFFFFF",
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
                    marginLeft: "40%",
                    fontSize: 18,
                    color: "#FFFFFF",
                  }}
                >
                  {this.props.total}
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
        {/* <Text style={{color:'#34A549',marginBottom:3}}>Item Replaced</Text> */}
          <View style={{ flexDirection: "row" }}>
            <Text
              style={{
                fontSize: 15,
                color: "#21272E",
                marginBottom: 5,
              }}
            >
              {this.props.list1}
            </Text>
            <Text
              style={{
                marginLeft: "30%",
                fontSize: 15,
                color: "#21272E",
              }}
            >
              {this.props.cost1}
            </Text>
          </View>

          <View style={{ flexDirection: "row" }}>
          
            <Text
              style={{
                fontSize: 15,
                color: "#21272E",
                marginBottom: 5,
              }}
            >
              {this.props.list2}
            </Text>
            <Text
              style={{
                marginLeft: "21%",
                fontSize: 15,
                color: "#21272E",
              }}
            >
              {this.props.cost2}
            </Text>
          </View>

          <View style={{ flexDirection: "row" }}>
          
            <Text
              style={{
                fontSize: 15,
                color: "#21272E",
                marginBottom: 5,
              }}
            >
              {this.props.list3}
            </Text>
            <Text
              style={{
                marginLeft: "33%",
                fontSize: 15,
                color: "#21272E",
              }}
            >
              {this.props.cost3}
            </Text>
          </View>
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
                marginLeft: "64%",
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
                marginLeft: "57%",
                fontSize: 12,
                color: "#21272E",
              }}
            >
              {this.props.cost5}
            </Text>
          </View>
          {/* <View style={{marginBottom:10}}/> */}
          <View style={{ flexDirection: "row"}}>
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
                marginLeft: "52%",
                fontSize: 15,
                color: "#21272E",
              }}
            >
              {this.props.cost6}
            </Text>
          </View>

<Divider/>
<View style={{ flexDirection: "row",marginTop:10}}>
            <Text
              style={{
                marginLeft: 3,
                fontSize: 15,
                color: "#21272E",
                marginBottom: 5,
              }}
            >
              {this.props.tobepaid}
            </Text>
            <Text
              style={{
                marginLeft: "62%",
                fontSize: 15,
                color: "#21272E",
              }}
            >
              {this.props.cost7}
            </Text>
          </View>

        </View>

        <View
          style={{
            // marginHorizontal: 10,
            backgroundColor: "#fff",
            elevation: 2,
            padding: 10,
            borderRadius: 5,
            marginVertical: 5,
            marginTop:210
          }}
        >
          <TouchableOpacity style={{marginTop: 10,
    width: "100%",
    height: 45,
    paddingTop: 15,
    paddingBottom: 15,
    backgroundColor: "#5EB169",
    borderRadius: 10,}}>
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
                Share on WhatsApp{" "}
              </Text>
          </TouchableOpacity>
          <TouchableOpacity style={{marginTop: 10,
    width: "100%",
    height: 45,
    paddingTop: 15,
    paddingBottom: 15,
    backgroundColor: "#3D86B4",
    borderRadius: 10,}}>
          <Text
                style={{
                  color: "#FFFFFF",
                  textAlign: "center",
                  justifyContent: "center",
                  alignItems: "center",
                  fontSize: 16,
                }}
              >
               Mark for Delivery
              </Text>
          </TouchableOpacity>
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
    // flex:0.5
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
    // fontStyle:'Poppins-SemiBold'
  },

  SubmitButtonStyles: {
    marginTop: 10,
    width: '100%',
    height: 45,
    paddingTop: 15,
    paddingBottom: 15,
    backgroundColor: "#F7F7FC",
    borderRadius: 10
  },

  SubmitButtonStyle: {
    marginTop: 10,
    width: '100%',
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
