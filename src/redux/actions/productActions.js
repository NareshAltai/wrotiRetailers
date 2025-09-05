import * as actionTypes from './actionTypes';
import DeveloperAPIClient from '../../state/middlewares/DeveloperAPIClient';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const loadproducts = (category_id, currentPage) => {
  return async dispatch => {
    let api = new DeveloperAPIClient();
    let Token = await AsyncStorage.getItem('token');
    let UserMobile = await AsyncStorage.getItem('MobileNumber');
    let allproductsdata = await api.getProducts(
      UserMobile,
      category_id,
      Token,
      currentPage,
    );
    dispatch({
      type: actionTypes.LOAD_GET_PRODUCTS_BY_CATEGORY,
      payload: allproductsdata?.data?.products || [],
      total: allproductsdata?.data?.total || 0,
    });
  };
};

export const refreshProdcuts = () => {
  return async dispatch => {
    dispatch({
      type: actionTypes.CLEAR_DATA,
      // payload: allOrdersData.orders,
    });
  };
};
