import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  ImageBackground,
  TouchableHighlight,
} from "react-native";
import ImagePicker from "react-native-image-picker";
import DeveloperAPIClient from "../state/middlewares/DeveloperAPIClient";
import AsyncStorage from "@react-native-async-storage/async-storage";
// import { showMessage } from "react-native-flash-message";
import Toast from "react-native-simple-toast";

const createFormData = async (photo, timeinmilliseconds, body = {}) => {
  const data = new FormData();
  let imagePath = "";
  try {
    let localimagePath = photo.fileName.split(".");
    imagePath =
      localimagePath[0] + "_" + timeinmilliseconds + "." + localimagePath[1];
  } catch (e) {
    imagePath = photo.fileName;
  }

  data.append("sendimage", {
    name: imagePath,
    type: photo.type,
    uri: Platform.OS === "ios" ? photo.uri.replace("file://", "") : photo.uri,
  });

  Object.keys(body).forEach((key) => {
    data.append(key, body[key]);
  });

  return data;
};

const App = ({ pathUpdate }) => {
  const [photo, setPhoto] = React.useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChoosePhoto = async () => {
    setPhoto(null);
    return await ImagePicker.launchImageLibrary(
      { noData: true },
      async (response) => {
        if (response != undefined) {
          if (response.didCancel && response.didCancel == true) {
            setIsLoading(false);
            return false;
          }
          return await uploadImage(response);
        }
      }
    );
  };

  const removePhoto = async () => {
    setPhoto(null);
  };

  uploadImage = async (response) => {
    const d = new Date();
    let time = d.getTime();
    setIsLoading(true);
    let Token = await AsyncStorage.getItem("token");
    let UserMobile = await AsyncStorage.getItem("MobileNumber");
    const formData = await createFormData(response, time, {
      mobileNumber: UserMobile,
      merchantToken: Token,
    });
    const api = new DeveloperAPIClient();
    let imagedata = await api.getuploadimage(formData);
    pathUpdate(imagedata.data.path);
    setPhoto(response);
    setIsLoading(false);
    Toast.showWithGravity(imagedata.data.message, Toast.LONG, Toast.BOTTOM);
  };

  return (
    <View style={{}}>
      <Text
        style={{
          marginLeft: "4%",
          fontSize: 18,
          fontWeight: "bold",
          marginTop: "5%",
        }}
      >
        Invoice
      </Text>
      <TouchableOpacity
        style={{
          width: "90%",
          height: 49,
          paddingTop: 12,
          paddingBottom: 15,
          backgroundColor: "#FFFFFF",
          borderRadius: 1,
          borderStyle: "dashed",
          borderWidth: 2,
          borderColor: "#00000014",
          marginTop: 10,
          marginLeft: 18,
        }}
        onPress={handleChoosePhoto}
      >
        <Text
          style={{
            color: "#b2b2b2",
            textAlign: "center",
            justifyContent: "center",
            alignItems: "center",
            fontSize: 12,
            fontFamily: "Poppins-Medium",
          }}
        >
          {" "}
          Upload Invoice{" "}
        </Text>
      </TouchableOpacity>
      {isLoading && <ActivityIndicator size="small" color="black" />}
      {photo && (
        <ImageBackground
          source={{ uri: photo.uri }}
          style={{
            width: 150,
            height: 100,
            resizeMode: "center",
            marginTop: 20,
          }}
        >
          <TouchableHighlight
            style={{ alignItems: "flex-end" }}
            onPress={() => removePhoto()}
          >
            <Image
              source={require("../assets/remove.png")}
              style={{ height: 20, width: 20, resizeMode: "center" }}
            />
          </TouchableHighlight>
        </ImageBackground>
      )}
    </View>
  );
};

export default App;
