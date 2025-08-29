import * as actionTypes from "../actions/actionTypes";

const initialState = {
  configData: null,
  homeNav: null,
  banners: null,
  homeScreenData: null,
  trendingProducts: null,
  quickBuys: null,
};

const HomeReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GET_APP_CONFIG:
      return {
        ...state,
        configData: action.payload,
      };
    case actionTypes.GET_NAVIGATION:
      return {
        ...state,
        homeNav: action.payload,
      };
    case actionTypes.GET_HOME_SCREEN_DATA:
      return {
        ...state,
        homeScreenData: action.payload,
      };
    case actionTypes.LOAD_PRODUCTS_BY_TAG:
      if (action.payloadId === "Trending") {
        return {
          ...state,
          trendingProducts: action.payload,
        };
      } else if (action.payloadId === "Quick Buys") {
        return {
          ...state,
          quickBuys: action.payload,
        };
      }
    default:
      return state;
  }
};

export default HomeReducer;
