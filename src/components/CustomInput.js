import React, { Component } from "react";
import { TextInput, StyleSheet, View, Image, Text } from "react-native";

export default class CustomApp extends Component {
  render() {
    return (
      <View>
        <Text
          style={{
            marginLeft: 6,
            fontWeight: "bold",
            color: "#847D76",
            marginTop: 20,
            fontFamily: "Lato-Regular",
          }}
        >
          {this.props.title.toUpperCase()}
        </Text>
        <View style={styles.SectionStyle}>
          <TextInput
            style={{ flex: 1 }}
            value={this.props.value}
            editable={this.props.editable}
            placeholder={this.props.placeholder}
            underlineColorAndroid="transparent"
            onChangeText={(val) => this.props.onChangeText(val)}
            autoCapitalize={'none'}
            secureTextEntry={this.props.secureTextEntry}
            returnKeyType={this.props.returnKeyType}
          />
          <Image
            //We are showing the Image from online
            source={this.props.image}
            style={styles.ImageStyle}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  SectionStyle: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    borderBottomWidth: 0.5,
    borderBottomColor: "#847D76",
    height: 40,
    borderRadius: 5,
    marginTop: 10,
  },

  ImageStyle: {
    padding: 10,
    margin: 5,
    height: 30,
    width: 30,
    resizeMode: "stretch",
    alignItems: "center",
  },
});
