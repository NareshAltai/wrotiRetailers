import * as actionTypes from "../actions/actionTypes";

const initialState = {
  loadOptions: null,
  total: null
};

const optionReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.CLEAR_DATA:
      return { ...state, loadOptions: null, total: null };

    case actionTypes.OPTIONS_LIST:
      return {
        ...state,
        loadOptions: action.payload,
        total: action.total,
      };
    default:
      return state;
  }
};

export default optionReducer;
