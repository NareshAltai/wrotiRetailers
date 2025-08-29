import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import ImagePicker from "react-native-image-picker";
import DeveloperAPIClient from "../state/middlewares/DeveloperAPIClient";

export default class App extends React.Component {
  state = {
    photo: null,
  };

  uploadImage = async (photo) => {
    const api = new DeveloperAPIClient();
    let imagedata = await api.getuploadimage(photo);
  };

  handleChoosePhoto = () => {
    const options = {
      base64: true 
    };
    ImagePicker.launchImageLibrary(options, (response) => {
      if (response.uri) {
        this.setState({ photo: response });
        this.uploadImage(response.uri);
      }
    });
  };

  render() {
    const { photo } = this.state;
    return (
      <View style={{}}>
        <TouchableOpacity>
          <Image
            style={{
              width: 50,
              height: 50,
              resizeMode: "center",
              marginLeft: 120,
              marginTop: 30,
            }}
            source={require("../assets/image2x.png")}
          />
        </TouchableOpacity>
        <Text style={{ marginLeft: 68, color: "#9BA0A7" }}>
          Upload Image or Click Picture
        </Text>
        <TouchableOpacity
          style={{
            marginTop: 18,
            width: "40%",
            height: 38,
            paddingTop: 8,
            paddingBottom: 15,
            backgroundColor: "#51AF5E",
            borderRadius: 10,
            borderWidth: 1,
            borderColor: "#fff",
            marginLeft: "30%",
          }}
          onPress={this.handleChoosePhoto}
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
            Upload Image{" "}
          </Text>
        </TouchableOpacity>

        {photo && (
          <Image
            source={{ uri: photo.uri }}
            style={{
              width: 150,
              height: 100,
              resizeMode: "center",
              marginTop: 20,
            }}
          />
        )}
      </View>
    );
  }
}
