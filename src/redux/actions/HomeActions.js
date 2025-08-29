import * as actionTypes from "./actionTypes";
import FrontAPIClient from "../../state/middlewares/FrontAPIClient";
import DeveloperAPIClient from "../../state/middlewares/DeveloperAPIClient";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const getAppConfig = () => {
  return async (dispatch) => {
    let apiClient = new FrontAPIClient();
    let configData = await apiClient.getConfig();
    dispatch({
      type: actionTypes.GET_APP_CONFIG,
      payload: configData,
    });
  };
};

export const loadNavigation = () => {
  return async (dispatch) => {
    let apiClient = new FrontAPIClient();
    let navResp = await apiClient.getNavigationData("11431");
    dispatch({
      type: actionTypes.GET_NAVIGATION,
      payload: navResp,
    });
  };
};

export const loadHomeScreenData = () => {
  return async (dispatch) => {
    let apiClient = new FrontAPIClient();
    let homescreenData = await apiClient.getBanners();
    dispatch({
      type: actionTypes.GET_HOME_SCREEN_DATA,
      payload: homescreenData,
    });
  };
};

export const loadProductsByTag = (tagId) => {
  return async (dispatch) => {
    let api = new FrontAPIClient();
    let products = await api.getProductsByTag(tagId);
    dispatch({
      type: actionTypes.LOAD_PRODUCTS_BY_TAG,
      payload: products,
      payloadId: tagId
    });
  };
}

export const loadcustumers = () => {
  return async (dispatch) => {
    let api = new DeveloperAPIClient();
    let UserMobile = await AsyncStorage.getItem("MobileNumber");
    let CustumerData = await api.getCustomer(UserMobile)
    dispatch({
      type: actionTypes.LOAD_GET_CUSTOMERLIST,
      payload: CustumerData.data.customers,
    });
  };
}