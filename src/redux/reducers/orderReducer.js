import * as actionTypes from "../actions/actionTypes";

const initialState = {
  loadOrdersById: null,
  message: null,
  responseStatusCode: null,
  newOrderCount: null,
  processingOrderCount: null,
  outForDelivereyOrderCount: null,
  deliveredOrderCount: null,
  cancelledOrderCount: null,
  rejectedOrderCount: null,
  authorizedCount: null,
  paymentReceived: null,
  isNewOrderFromNotificationFlag: null,
  merchantMessage: null,
  isLoading: false,
};

const OrderReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.CLEAR_DATA:
      return {
        ...state,
        loadOrdersById: null,
        responseStatusCode: null,
        newOrderCount: null,
        processingOrderCount: null,
        outForDelivereyOrderCount: null,
        deliveredOrderCount: null,
        cancelledOrderCount: null,
        rejectedOrderCount: null,
        authorizedCount: null,
        paymentReceived: null,
        isNewOrderFromNotificationFlag: null,
        merchantMessage: null,
        isLoading: false,
      };

    case actionTypes.LOAD_ORDERS_BY_ID:
      return {
        ...state,
        loadOrdersById: action.payload,
        message: action.message,
        responseStatusCode: action.responseStausCode,
        isNewOrderFromNotificationFlag: action.isFromNotificationFlag,
      };
      case actionTypes.SET_LOADING:
        return {
          ...state,
          isLoading: true,
        };
  
      case actionTypes.CLEAR_LOADING:
        return {
          ...state,
          isLoading: false,
        };
    case actionTypes.ORDERS_COUNT:
      return {
        ...state,
        newOrderCount: action.newOrderCount,
        processingOrderCount: action.processingOrderCount,
        outForDelivereyOrderCount: action.outForDelivereyOrderCount,
        deliveredOrderCount: action.deliveredOrderCount,
        cancelledOrderCount: action.cancelledOrderCount,
        rejectedOrderCount: action.rejectedOrderCount,
        authorizedCount: action.authorizedCount,
        paymentReceived: action.paymentReceived
      };

    case actionTypes.MERCHANT_INFO:
      return {
        ...state,
        merchantMessage: action.message,
      };

      case actionTypes.RBCARD_HEIGHT:
      // console.log("actions========>", action);
      return {
        ...state,
        RBSheetCardHeight: action.cardHeight,
      };

    default:
      return state;
  }
};

export default OrderReducer;
