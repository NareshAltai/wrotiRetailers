import * as actionTypes from "../actions/actionTypes";

const initialState = {
  productsListingByCategory : [],
  productTotal: null
};

const ProductReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.CLEAR_DATA:
      return {
        ...state,
        productsListingByCategory:null,
        productTotal: null,
      };
      case actionTypes.LOAD_GET_PRODUCTS_BY_CATEGORY:
      return {
        ...state,
        productsListingByCategory: action.payload,
        productTotal: action.total
      };
    default:
      return state;
  }
};

export default ProductReducer;
