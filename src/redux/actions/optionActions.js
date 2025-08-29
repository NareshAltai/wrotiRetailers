import * as actionTypes from "./actionTypes";
import DeveloperAPIClient from "../../state/middlewares/DeveloperAPIClient";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const refreshOptionData = () => {
    return async (dispatch) => {
      dispatch({
        type: actionTypes.CLEAR_DATA,
      });
    };
  };

  export const loadOptions = () => {
    return async (dispatch) => {
      let api = new DeveloperAPIClient();
      let UserMobile = await AsyncStorage.getItem("MobileNumber");
      let Token = await AsyncStorage.getItem("token");
      let OptionsData = await api.getOptions(UserMobile,Token);
      dispatch({
        type: actionTypes.OPTIONS_LIST,
        payload: OptionsData.data.productoptions,
        total: OptionsData.data.productoptions.total
      });
    };
  };