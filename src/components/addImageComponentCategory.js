import React, { Profiler, useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ImageBackground,
  TouchableHighlight,
  ActivityIndicator,
  PermissionsAndroid,
} from "react-native";
import ImagePicker from "react-native-image-picker";
import DeveloperAPIClient from "../state/middlewares/DeveloperAPIClient";
import Toast from "react-native-simple-toast";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
    name: photo.fileName,
    type: photo.type,
    uri: Platform.OS === "ios" ? photo.uri.replace("file://", "") : photo.uri,
  });

  Object.keys(body).forEach((key) => {
    data.append(key, body[key]);
  });

  return data;
};

const App = ({ pathUpdate, productImage, setProductImage,setExistingImage }) => {
  const [photo, setPhoto] = React.useState();
  const [isLoading, setIsLoading] = useState(false);

  const removePhoto = async () => {
    setPhoto(null);
    pathUpdate(
      "https://highoncafeocuat.wroti.app/image/cache/no_image-76x76.png"
    );
    setExistingImage("https://highoncafeocuat.wroti.app/image/cache/no_image-76x76.png")
    Toast.showWithGravity(
      "Product image removed successfully",
      Toast.LONG,
      Toast.BOTTOM
    );
  };

  useEffect(() => {
    setPhoto(productImage);
  }, [productImage]);

  const handleChoosePhoto = async () => {
    let options = {
      mediaType: "photo",
      maxWidth: 600,
      maxHeight: 600,
      quality: 1,
      presentationStyle: "pageSheet",
      cameraType: "back",
    };
    const granted = await PermissionsAndroid.requestMultiple(
      [
        PermissionsAndroid.PERMISSIONS.CAMERA,
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      ],
      {
        title: "Camera Permission",
        message:
          "WROTI App needs access to your camera " +
          "so you can take awesome pictures.",
        buttonNeutral: "Ask Me Later",
        buttonNegative: "Cancel",
        buttonPositive: "OK",
      }
    );

    return await ImagePicker.showImagePicker(options, async (response) => {
      if (response != undefined) {
        if (response.didCancel && response.didCancel == true) {
          setIsLoading(false);
          return false;
        }
        return await uploadImage(response);
      }
    });
  };

  const uploadImage = async (response) => {
    setIsLoading(true);
    const d = new Date();
    let time = d.getTime();
    let Token = await AsyncStorage.getItem("token");
    let UserMobile = await AsyncStorage.getItem("MobileNumber");
    const formData = await createFormData(response, time, {
      mobileNumber: UserMobile,
      merchantToken: Token
    });
    const api = new DeveloperAPIClient();
    let imagedata = await api.getuploadimage(formData);
    // console.log("imageData",JSON.stringify(imagedata))
    setProductImage(imagedata?.data?.path)
    setExistingImage(imagedata?.data?.path)
    pathUpdate(imagedata?.data?.path);
    setPhoto(response?.uri);
    setIsLoading(false);
    Toast.showWithGravity(imagedata.data.message, Toast.LONG, Toast.BOTTOM);
  };

  return (
    <View style={{}}>
      <TouchableOpacity
        style={{
          marginTop: 3,
          width: "40%",
          height: 38,
          paddingTop: 8,
          paddingBottom: 15,
          backgroundColor: "#51AF5E",
          borderRadius: 10,
          borderWidth: 1,
          borderColor: "#fff",
          marginLeft: "2.5%",
        }}
        onPress={handleChoosePhoto}
      >
        <Text
          style={{
            color: "#fff",
            textAlign: "center",
            justifyContent: "center",
            alignItems: "center",
            fontSize: 16,
            fontFamily:'Poppins-Medium'
          }}
        >
          {" "}
          Choose a file{" "}
        </Text>
      </TouchableOpacity>
      {isLoading && <ActivityIndicator size="small" color="black" />}
      {photo && (
        <ImageBackground
          source={{ uri: photo }}
          style={{
            width: 150,
            height: 100,
            resizeMode: "center",
            marginTop: 20,
          }}
        >
          <TouchableOpacity
            style={{alignItems: "flex-end" }}
            onPress={() => removePhoto()}
            activeOpacity={0.2}
          >
            <Image
              source={require("../assets/remove.png")}
              style={{ height: 20, width: 20, resizeMode: "center" }}
            />
          </TouchableOpacity>
        </ImageBackground>
      )}
    </View>
  );
};

export default App;
