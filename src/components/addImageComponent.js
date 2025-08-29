import React, { useState, useEffect } from "react";
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

const App = ({ dataObject, index, input }) => {
  const [photo, setPhoto] = React.useState();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setPhoto(input?.image);
  }, []);

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
    // imageindex(index);
    if (imagedata == undefined) {
      Toast.showWithGravity(
        "Something Went Wrong or photo",
        Toast.LONG,
        Toast.BOTTOM
      );
      return false;
    }
    setPhoto(response);
    dataObject((prev) => {
      let array = [...prev];
      array[index].image = imagedata.data.path;
      return array;
    });
    setIsLoading(false);
    Toast.showWithGravity(imagedata.data.message, Toast.LONG, Toast.BOTTOM);
  };

  return (
    <View style={{}}>
      <TouchableOpacity
        style={{ marginVertical: 5, marginHorizontal: 10 }}
        onPress={() => handleChoosePhoto()}
      >
        {input?.image ? (
          <Image
            source={{ uri: input?.image }}
            style={{
              width: 100,
              height: 100,
              // resizeMode: "center",
              marginTop: 20,
            }}
          />
        ) : (
          <Image
            source={{
              uri: "https://ocuat.wroti.app/image/cache/no_image-100x100.png",
            }}
            style={{
              width: 100,
              height: 100,
              // resizeMode: "center",
              marginTop: 20,
            }}
          />
        )}
      </TouchableOpacity>
    </View>
  );
};

export default App;
