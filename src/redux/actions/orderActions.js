import * as actionTypes from './actionTypes';
import DeveloperAPIClient from '../../state/middlewares/DeveloperAPIClient';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const loadorders = (
  order_status_id,
  currentPage,
  isFromNotification,
  loadsData,
) => {
  console.log('offset==========>', currentPage);
  return async dispatch => {
    if (loadsData) dispatch({type: actionTypes.SET_LOADING});
    let api = new DeveloperAPIClient();
    let Token = await AsyncStorage.getItem('token');
    let UserMobile = await AsyncStorage.getItem('MobileNumber');
    let allOrdersData = await api.getOrdersHistory(
      UserMobile,
      order_status_id,
      Token,
      currentPage,
    );
    // console.log('---------orders-------->', allOrdersData.data.orders);
    dispatch({
      type: actionTypes.LOAD_ORDERS_BY_ID,
      payload: allOrdersData.data.orders,
      message: allOrdersData.data.message,
      responseStausCode: allOrdersData.status,
      isFromNotificationFlag: isFromNotification,
    });

    if (loadsData) dispatch({type: actionTypes.CLEAR_LOADING});
  };
};

export const OrderStats = () => {
  return async dispatch => {
    const api = new DeveloperAPIClient();
    let UserMobile = await AsyncStorage.getItem('MobileNumber');
    const storeType = await AsyncStorage.getItem('StoreType');
    let OrderStatsData = await api.getOrderstats(UserMobile);
    if (OrderStatsData.data != undefined) {
      dispatch({
        type: actionTypes.ORDERS_COUNT,
        newOrderCount:
          storeType === 'nexus' || storeType === 'forum'
            ? OrderStatsData.data.order_counts[20]
            : OrderStatsData.data.order_counts[1],
        processingOrderCount: OrderStatsData.data.order_counts[2],
        outForDelivereyOrderCount: OrderStatsData.data.order_counts[15],
        deliveredOrderCount: OrderStatsData.data.order_counts[5],
        cancelledOrderCount: OrderStatsData.data.order_counts[7],
        rejectedOrderCount: OrderStatsData.data.order_counts[17],
        authorizedCount: OrderStatsData.data.order_counts[19],
        paymentReceived: OrderStatsData.data.order_counts[20],
      });
    } else {
      dispatch({
        type: actionTypes.ORDERS_COUNT,
        newOrderCount: 0,
        processingOrderCount: 0,
        outForDelivereyOrderCount: 0,
        deliveredOrderCount: 0,
        cancelledOrderCount: 0,
        rejectedOrderCount: 0,
        authorized: 0,
        paymentReceived: 0,
      });
    }
  };
};

export const refreshOrders = () => {
  return async dispatch => {
    dispatch({
      type: actionTypes.CLEAR_DATA,
      // payload: allOrdersData.orders,
    });
  };
};

export const loadMerchantInfo = () => {
  return async dispatch => {
    let api = new DeveloperAPIClient();
    let Token = await AsyncStorage.getItem('token');
    let UserMobile = await AsyncStorage.getItem('MobileNumber');
    let merchanrInfo = await api.getMerchantInfo(UserMobile, Token);
    dispatch({
      type: actionTypes.MERCHANT_INFO,
      message: merchanrInfo?.message,
    });
  };
};

export const RBCardHeight = height => {
  return async dispatch => {
    dispatch({
      type: actionTypes.RBCARD_HEIGHT,
      cardHeight: height,
    });
  };
};
