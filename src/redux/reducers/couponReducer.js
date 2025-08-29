import * as actionTypes from "../actions/actionTypes";

const initialState = {
  loadCoupons: null,
  total: null
};

const couponReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.CLEAR_DATA:
      return { ...state, loadCoupons: null, total: null };

    case actionTypes.COUPONS_LIST:
      return {
        ...state,
        loadCoupons: action.payload,
        total: action.total,
      };
    default:
      return state;
  }
};

export default couponReducer;
