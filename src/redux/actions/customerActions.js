import * as actionTypes from "./actionTypes";
import DeveloperAPIClient from "../../state/middlewares/DeveloperAPIClient";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const loadcustumers = (currentPage, search_key) => {
  return async (dispatch) => {
    let api = new DeveloperAPIClient();
    let UserMobile = await AsyncStorage.getItem("MobileNumber");
    let CustumerData = await api.getCustomer(
      UserMobile,
      currentPage,
      search_key
    );
    console.log("CustumerData",JSON.stringify(CustumerData))
    dispatch({
      type: actionTypes.LOAD_GET_CUSTOMERLIST,
      payload: CustumerData.data.customers,
      total: CustumerData.data.total,
    });
  };
};

export const loadCustomerGroups = (searchkey, currentPage) => {
  return async (dispatch) => {
    let api = new DeveloperAPIClient();
    let Token = await AsyncStorage.getItem("token");
    let CustumerData = await api.getCustomerGroups(
      Token,
      searchkey,
      currentPage
    );
    dispatch({
      type: actionTypes.LOAD_GET_CUSTOMERGROUPSLIST,
      payload: CustumerData.data.customergroups,
    });
  };
};

export const loadCustomerInGroups = (
  pageNo,
  search_key,
  customer_group_id,
  exclude
) => {
  return async (dispatch) => {
    let api = new DeveloperAPIClient();
    let Token = await AsyncStorage.getItem("token");
    let CustumerData = await api.getCustomersInCustomerGroup(
      Token,
      pageNo,
      search_key,
      customer_group_id,
      exclude
    );
    dispatch({
      type: actionTypes.LOAD_GET_CUSTOMER_IN_GROUPSLIST,
      payload: CustumerData.data.customers,
      total: CustumerData.data.total,
    });
  };
};

export const loadCustomersList = (currentPage, search_key) => {
  return async (dispatch) => {
    let api = new DeveloperAPIClient();
    let UserMobile = await AsyncStorage.getItem("MobileNumber");
    let CustumerData = await api.getCustomer(
      UserMobile,
      currentPage,
      search_key
    );
    dispatch({
      type: actionTypes.LOAD_GET_CUSTOMERS_LIST,
      payload: CustumerData.data.customers,
    });
  };
};

export const refreshCustomers = () => {
  return async (dispatch) => {
    dispatch({
      type: actionTypes.CLEAR_DATA,
    });
  };
};
