import * as actionTypes from "../actions/actionTypes";

const initialState = {
  customerslist: [],
  customersGroupList: [],
  customerTotal: null,customersGroupInList:null,customersListInAddGroup:null,customerInGroupsTotal:null,customersListInGroup:null
};

const CustomerReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.CLEAR_DATA:
      return { ...state, customerslist: null, customersGroupList: null,customerInGroupsTotal:null,customersListInGroup:null };
    case actionTypes.LOAD_GET_CUSTOMERLIST:
      return {
        ...state,
        customerslist: action.payload,
        customerTotal: action.total
      };
    case actionTypes.LOAD_GET_CUSTOMERGROUPSLIST:
      return {
        ...state,
        customersGroupList: action.payload,
      };
    case actionTypes.LOAD_GET_CUSTOMER_IN_GROUPSLIST:
      return {
        ...state,
        customersGroupInList: action.payload,
        customerInGroupsTotal: action.total,
        customersListInGroup: action.totalCustomersList
      };

    default:
      return state;
  }
};

export default CustomerReducer;
