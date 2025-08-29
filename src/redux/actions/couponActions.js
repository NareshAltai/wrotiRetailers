import * as actionTypes from "./actionTypes";
import DeveloperAPIClient from "../../state/middlewares/DeveloperAPIClient";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const refreshCouponData = () => {
    return async (dispatch) => {
      dispatch({
        type: actionTypes.CLEAR_DATA,
      });
    };
  };

  export const loadCoupons = (currentPage,search_key) => {
    return async (dispatch) => {
      let api = new DeveloperAPIClient();
      let UserMobile = await AsyncStorage.getItem("MobileNumber");
      let Token = await AsyncStorage.getItem("token");
      let CouponData = await api.getCoupons(UserMobile,Token,currentPage,search_key);
      dispatch({
        type: actionTypes.COUPONS_LIST,
        payload: CouponData.data.coupons,
        total: CouponData.data.total
      });
    };
  };