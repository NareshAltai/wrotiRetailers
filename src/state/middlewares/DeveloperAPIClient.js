import RestClient from 'react-native-rest-client';

import Config from 'react-native-config';
import moment from 'moment';

const DEVELOPER_API_URL = Config.API_URL;
const PAGE_LIMIT = 10;

import Api from '../middlewares/Api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class DeveloperAPIClient extends RestClient {
  constructor(authToken) {
    super('https://wroti.app', {
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
    });
  }

  deleteCustomerGroupurl = () => {
    return `${DEVELOPER_API_URL}/v1/roti/deleteCustomerGroup`;
  };

  deleteCustomerGroup = async (Token, customer_group_id) => {
    let url = this.deleteCustomerGroupurl();
    let inputData = {
      merchantToken: Token,
      customer_group_id: customer_group_id,
    };
    let apiResponse = await Api.post(url, inputData, '', '', {
      'Content-Type': 'application/json',
    });
    return apiResponse.data;
  };

  getVariableDataURL = () => {
    return `${DEVELOPER_API_URL}/v1/roti/get-template-keys`;
  };

  getVariableData = async Token => {
    let url = this.getVariableDataURL();
    let inputData = {
      merchantToken: Token,
    };
    let apiResponse = await Api.post(url, inputData, '', '', {
      'Content-Type': 'application/json',
    });
    return apiResponse.data;
  };

  deleteCampaignURL = () => {
    return `${DEVELOPER_API_URL}/v1/roti/campaign`;
  };

  deleteCampaign = async (UserMobile, Token, id) => {
    let url = this.deleteCampaignURL();
    let inputData = {
      mobileNumber: UserMobile,
      merchantToken: Token,
      campaignId: id,
    };
    let apiResponse = await Api.delete(url, inputData, '', '', {
      'Content-Type': 'application/json',
      merchantToken: Token,
    });
    console.log('URL===>', url);
    return apiResponse.data;
  };

  getCampaignListURL = () => {
    return `${DEVELOPER_API_URL}/v1/roti/campaign?limit=10000`;
  };

  getCampaignList = async (UserMobile, Token) => {
    let url = this.getCampaignListURL();
    let apiResponse = await Api.get(url, '', '', '', {
      'Content-Type': 'application/json',
      merchantToken: Token,
    });
    console.log('URL===>', url);
    return apiResponse.data;
  };

  getMessageTemplatesurl = () => {
    return `${DEVELOPER_API_URL}/v1/roti/message-template`;
  };

  getMessageTemplates = async (UserMobile, Token) => {
    let url = this.getMessageTemplatesurl();
    let inputData = {
      merchantToken: Token,
      mobileNumber: UserMobile,
      limit: 10000,
      offset: 1,
    };
    let apiResponse = await Api.get(url, inputData, '', '', {
      'Content-Type': 'application/json',
      merchantToken: Token,
    });
    return apiResponse.data;
  };

  getSortMessageTemplatesurl = selecteSortOption => {
    return `${DEVELOPER_API_URL}/v1/roti/messageTemplates?sortBy=name:${selecteSortOption}`;
  };

  getSortMessageTemplates = async (selecteSortOption, Token, UserMobile) => {
    let url = this.getSortMessageTemplatesurl(selecteSortOption);
    let payLoad = {merchantToken: Token, mobileNumber: UserMobile};
    console.log('sortPayload', payLoad);
    let apiResponse = await Api.get(url, '', '', '', {
      'Content-Type': 'application/json',
      merchantToken: Token,
    });
    console.log('URL', url);
    return apiResponse.data;
  };

  getSearchMessageTemplatesurl = searchKey => {
    return `${DEVELOPER_API_URL}/v1/roti/messageTemplates?name=${searchKey}`;
  };

  getSearchMessageTemplates = async (searchKey, Token) => {
    let url = this.getSearchMessageTemplatesurl(searchKey);
    let apiResponse = await Api.get(url, '', '', '', {
      'Content-Type': 'application/json',
      merchantToken: Token,
    });
    console.log('URL', url);
    return apiResponse.data;
  };

  getDeleteMessageTemplatesurl = () => {
    return `${DEVELOPER_API_URL}/v1/roti/message-template`;
  };

  getDeleteMessageTemplates = async (templateId, Token, UserMobile) => {
    let url = this.getDeleteMessageTemplatesurl();
    let payLoad = {
      mobileNumber: UserMobile,
      merchantToken: Token,
      templateId: templateId,
    };
    console.log('URL', url);
    let apiResponse = await Api.delete(url, payLoad, '', '', {
      'Content-Type': 'application/json',
      merchantToken: Token,
    });
    return apiResponse.data;
  };

  updateCustomerFromGroupurl = () => {
    return `${DEVELOPER_API_URL}/v1/roti/updateCustomerToCustomerGroup`;
  };

  updateCustomerFromGroup = async (
    UserMobile,
    Token,
    customer_id,
    customerGroupId,
    FirstName,
    LastName,
    number,
  ) => {
    let url = this.updateCustomerFromGroupurl();
    let payLoad = {
      mobileNumber: UserMobile,
      merchantToken: Token,
      customer_id,
      customer_group_ids: customerGroupId,
      firstname: FirstName,
      lastname: LastName,
      telephone: number,
    };
    let apiResponse = await Api.post(url, payLoad, '', '', {
      'Content-Type': 'application/json',
    });
    console.log('payLoad', payLoad);
    console.log('URL', url);
    return apiResponse.data;
  };

  updateCampaignURL = () => {
    return `${DEVELOPER_API_URL}/v1/roti/campaign`;
  };

  updateCampaign = async (
    UserMobile,
    name,
    templateID,
    type,
    dateAndTime,
    selectedCustomerGroups,
    Token,
    campaignId,
  ) => {
    let url = this.updateCampaignURL();
    let payLoad = {
      mobileNumber: UserMobile,
      name: name,
      templateId: templateID,
      // schedule,now
      sendType: type,
      scheduledAt: dateAndTime ? dateAndTime : '',
      customerGroups: selectedCustomerGroups,
      merchantToken: Token,
      campaignId: campaignId,
    };
    console.log('payLoad', payLoad);
    let apiResponse = await Api.put(url, payLoad, '', '', {
      'Content-Type': 'application/json',
    });
    console.log('payLoad', payLoad);
    console.log('URL', url);
    return apiResponse.data;
  };

  sendCampaignURL = () => {
    return `${DEVELOPER_API_URL}/v1/roti/campaign`;
  };

  sendCampaign = async (
    UserMobile,
    name,
    templateID,
    type,
    dateAndTime,
    selectedCustomerGroups,
    Token,
  ) => {
    let url = this.sendCampaignURL();
    let payLoad = {
      mobileNumber: UserMobile,
      name: name,
      templateId: templateID,
      // schedule,now
      sendType: type,
      scheduledAt: dateAndTime ? dateAndTime : '',
      customerGroups: selectedCustomerGroups,
      merchantToken: Token,
    };
    console.log('payLoad', payLoad);
    // return false
    let apiResponse = await Api.post(url, payLoad, '', '', {
      'Content-Type': 'application/json',
    });
    console.log('payLoad', payLoad);
    console.log('URL', url);
    return apiResponse.data;
  };

  getAddNewCateogryURL = () => {
    return `${DEVELOPER_API_URL}/v1/roti/addNewCategory`;
  };

  getAddNewCateogry = async (
    // category_description,
    Token,
    addNewCategoryName,
    addNewDescription,
    image_path,
    status,
  ) => {
    let url = this.getAddNewCateogryURL();
    let description = '';
    // if(addNewDescription )
    let reqBody = {
      category_description: {
        1: {
          description: '',
          meta_description: '',
          meta_keyword: '',
          meta_title: '',
          name: 'TestCategory',
          tag: '',
        },
        2: {
          description: '',
          meta_description: '',
          meta_keyword: '',
          meta_title: '',
          name: 'TestCategory',
          tag: '',
        },
        3: {
          description: '',
          meta_description: '',
          meta_keyword: '',
          meta_title: '',
          name: 'TestCategory',
          tag: '',
        },
      },
      category_store: ['9'],
      column: '1',
      filter: '',
      image: '',
      parent_id: '0',
      path: '',
      sort_order: '0',
      status: '1',
      top: '1',
    };
    let inputData = {
      category_description: {
        1: {
          name: addNewCategoryName,
          description:
            addNewDescription != undefined || addNewDescription != ''
              ? addNewDescription
              : '',
          meta_title: '',
          meta_description: '',
          meta_keyword: '',
          tag: '',
        },
        2: {
          name: addNewCategoryName,
          description:
            addNewDescription != undefined || addNewDescription != ''
              ? addNewDescription
              : '',
          meta_title: '',
          meta_description: '',
          meta_keyword: '',
          tag: '',
        },
        3: {
          name: addNewCategoryName,
          description:
            addNewDescription != undefined || addNewCategoryName != ''
              ? addNewDescription
              : '',
          meta_title: '',
          meta_description: '',
          meta_keyword: '',
          tag: '',
        },
      },
      name: addNewCategoryName,
      path: '',
      parent_id: '0',
      filter: '',
      category_store: ['9'],
      image: image_path,
      top: '1',
      column: '1',
      sort_order: '0',
      status: status,
      merchantToken: Token,
    };
    let apiResponse = await Api.post(url, inputData, '', '', {
      'Content-Type': 'application/json',
    });
    console.log('AddCategoryPayload', inputData, '', url);
    return apiResponse.data;
  };

  getAddNewCustomerGroupURL = () => {
    return `${DEVELOPER_API_URL}/v1/roti/addNewCustomerGroup`;
  };

  getAddNewCustomerGroup = async (Token, groupName) => {
    let url = this.getAddNewCustomerGroupURL();
    let payLoad = {
      customer_group_description: {
        1: {
          name: groupName,
          description: 'test',
        },
        3: {
          name: groupName,
          description: 'test',
        },
        2: {
          name: groupName,
          description: 'test',
        },
      },
      approval: '0',
      sort_order: '5',
      merchantToken: Token,
    };
    let apiResponse = await Api.post(url, payLoad, '', '', {
      'Content-Type': 'application/json',
    });
    return apiResponse.data;
  };

  getCustomerGroupsURL = () => {
    return `${DEVELOPER_API_URL}/v1/roti/getCustomerGroups`;
  };

  getCustomerGroups = async (Token, search_key, currentPage) => {
    // console.log("payload@@@@")
    let url = this.getCustomerGroupsURL();
    let payLoad = {
      merchantToken: Token,
      seakeyword: search_key,
      offset: currentPage,
      limit: 10000,
    };
    let apiResponse = await Api.post(url, payLoad, '', '', {
      'Content-Type': 'application/json',
    });
    return apiResponse.data;
  };

  addCustomerToCustomerGroupUrl = () => {
    return `${DEVELOPER_API_URL}/v1/roti/addCustomerToGroup`;
  };

  addCustomerToCustomerGroup = async (Token, groupId, customerIds) => {
    let url = this.addCustomerToCustomerGroupUrl();
    let apiResponse = await Api.post(
      url,
      {
        merchantToken: Token,
        customer_group_id: groupId,
        customer_ids: customerIds,
      },
      '',
      '',
      {'Content-Type': 'application/json'},
    );
    return apiResponse.data;
  };

  getEditOptionsUrl = () => {
    return `${DEVELOPER_API_URL}/v1/roti/editOption`;
  };

  getEditOption = async (
    optionName,
    selectedOptionType,
    sortOrder,
    data,
    optionId,
    UserMobile,
    Token,
  ) => {
    let url = this.getEditOptionsUrl();
    let reqBody = {
      option_description: {
        1: {
          name: optionName,
        },
        3: {
          name: optionName,
        },
        2: {
          name: optionName,
        },
      },
      type: selectedOptionType,
      sort_order: sortOrder,
      option_value: data,
      option_id: optionId,
      mobileNumber: UserMobile,
      merchantToken: Token,
    };
    let apiResponse = await Api.post(url, reqBody, '', '', {
      'Content-Type': 'application/json',
    });
    console.log('PayLoadOptions', JSON.stringify(reqBody), ' ', url);
    return apiResponse.data;
  };

  getAddOptionsUrl = () => {
    return `${DEVELOPER_API_URL}/v1/roti/addOption`;
  };

  getAddOptions = async (
    optionName,
    selectedOptionType,
    sortOrder,
    data,
    UserMobile,
    Token,
  ) => {
    let url = this.getAddOptionsUrl();
    let reqBody = {
      option_description: {
        1: {
          name: optionName,
        },
        3: {
          name: optionName,
        },
        2: {
          name: optionName,
        },
      },
      type: selectedOptionType,
      sort_order: sortOrder,
      option_value: data,
      mobileNumber: UserMobile,
      merchantToken: Token,
    };
    console.log('URL', url);
    let apiResponse = await Api.post(url, reqBody, '', '', {
      'Content-Type': 'application/json',
    });
    console.log('PayLoadOptions', JSON.stringify(reqBody));
    return apiResponse.data;
  };

  getOptionDetailsByOptionIdUrl = () => {
    return `${DEVELOPER_API_URL}/v1/roti/getOptionValuebyid`;
  };

  getOptionDetailsByOptionId = async (UserMobile, Token, optionId) => {
    let url = this.getOptionDetailsByOptionIdUrl();
    let reqBody = {
      mobileNumber: UserMobile,
      merchantToken: Token,
      option_id: optionId,
    };
    let apiResponse = await Api.post(url, reqBody, '', '', {
      'Content-Type': 'application/json',
    });
    console.log('PayLoadOptions', reqBody, ' ', url);
    return apiResponse.data;
  };

  getOptionsUrl = () => {
    return `${DEVELOPER_API_URL}/v1/roti/getOptions`;
  };

  getOptions = async (UserMobile, Token) => {
    let url = this.getOptionsUrl();
    let reqBody = {
      mobileNumber: UserMobile,
      merchantToken: Token,
    };
    let apiResponse = await Api.post(url, reqBody, '', '', {
      'Content-Type': 'application/json',
    });
    console.log('PayLoadOptions', reqBody, ' ', url);
    return apiResponse.data;
  };

  getDeleteOptionUrl = () => {
    return `${DEVELOPER_API_URL}/v1/roti/deleteOption`;
  };

  getDeleteOption = async (UserMobile, Token, optionId) => {
    let url = this.getDeleteOptionUrl();
    let reqBody = {
      mobileNumber: UserMobile,
      merchantToken: Token,
      option_id: optionId,
    };
    let apiResponse = await Api.post(url, reqBody, '', '', {
      'Content-Type': 'application/json',
    });
    console.log('PayLoadOptions', reqBody, ' ', url);
    return apiResponse.data;
  };

  updateCategoryurl = () => {
    return `${DEVELOPER_API_URL}/v1/roti/updateCategory`;
  };

  updateCategory = async (
    Token,
    categoryId,
    updateCategoryName,
    image_path,
    updateDescription,
    status,
  ) => {
    let url = this.updateCategoryurl();
    let inputData = {
      category_id: categoryId,
      // category_description: category_description,
      category_description: {
        1: {
          name: updateCategoryName,
          meta_title: '',
          meta_description: '',
          meta_keyword: '',
          description:
            updateDescription != undefined || updateDescription != ''
              ? updateDescription
              : '',
        },
        2: {
          name: updateCategoryName,
          meta_title: '',
          meta_description: '',
          meta_keyword: '',
          description: updateDescription,
        },
      },
      name: updateCategoryName,
      path: '',
      parent_id: '',
      filter: '',
      category_store: [],
      image: image_path,
      top: '',
      column: '1',
      sort_order: '0',
      status: status,
      merchantToken: Token,
    };
    let apiResponse = await Api.post(url, inputData, '', '', {
      'Content-Type': 'application/json',
    });
    console.log('updateCategoryPayload', inputData);
    return apiResponse.data;
    // if(apiResponse.data.data.)
  };

  deleteCategoryurl = () => {
    return `${DEVELOPER_API_URL}/v1/roti/deleteCategory`;
  };

  deleteCategory = async (Token, categoryId) => {
    let url = this.deleteCategoryurl();
    let inputData = {
      merchantToken: Token,
      category_id: categoryId,
    };
    let apiResponse = await Api.post(url, inputData, '', '', {
      'Content-Type': 'application/json',
    });
    return apiResponse.data;
  };

  updateProducturl = () => {
    return `${DEVELOPER_API_URL}/v1/roti/updateAllProducts`;
  };

  updateProduct = async (Token, editArr) => {
    let url = this.updateProducturl();
    let inputData = {merchantToken: Token, productdata: editArr};
    let apiResponse = await Api.post(url, inputData, '', '', {
      'Content-Type': 'application/json',
    });
    console.log('inputData3763527365', inputData);
    return apiResponse.data;
    // if(apiResponse.data.data.)
  };

  FCTOKENUrl = () => {
    return `${DEVELOPER_API_URL}/v1/roti/saveFcmToken`;
  };

  FCTOKEN = async (UserMobile, fcmToken, uniqueId) => {
    let url = this.FCTOKENUrl();
    let inputData = {
      mobileNumber: UserMobile,
      fcmToken: fcmToken,
      deviceId: uniqueId,
    };
    console.log(
      'O====================> ~ DeveloperAPIClient ~ inputData:',
      inputData,
      url,
    );
    let apiResponse = await Api.post(url, inputData, '', '', {
      'Content-Type': 'application/json',
    });
    return apiResponse.data;
    // if(apiResponse.data.data.)
  };

  LoginwithPasswordUrl = () => {
    return `${DEVELOPER_API_URL}/v1/roti/loginWithPassword`;
  };

  LoginwithPassword = async (UserMobile, password) => {
    let url = this.LoginwithPasswordUrl();
    console.log('URLLLLLLL', url);
    console.log('payload', {
      username: UserMobile,
      password: password,
    });
    let apiResponse = await Api.post(
      url,
      {
        username: UserMobile,
        password: password,
      },
      '',
      '',
      {'Content-Type': 'application/json'},
    );
    // console.log("--------------------",apiResponse.data)
    return apiResponse.data;
  };

  deliverypartnerUrl = () => {
    return `${DEVELOPER_API_URL}/v1/roti/getDeliveryPartners`;
  };

  deliverypartner = async (UserMobile, Token) => {
    let url = this.deliverypartnerUrl();
    let inputData = {
      merchantToken: Token,
      mobileNumber: UserMobile,
    };
    let apiResponse = await Api.post(url, inputData, '', '', {
      'Content-Type': 'application/json',
    });
    return apiResponse.data;
  };

  getDeliveryBoysbyMobileUrl = () => {
    return `${DEVELOPER_API_URL}/v1/roti/getDeliveryBoysbyMobile`;
  };

  getDeliveryBoysbyMobile = async (UserMobile, Token) => {
    let url = this.getDeliveryBoysbyMobileUrl();
    let inputData = {
      merchantToken: Token,
      mobileNumber: UserMobile,
    };
    let apiResponse = await Api.post(url, inputData, '', '', {
      'Content-Type': 'application/json',
    });
    return apiResponse.data;
  };

  searchProductUrl = () => {
    return `${DEVELOPER_API_URL}/v1/roti/searchProduct`;
  };

  searchProduct = async (UserMobile, search_key, Token, limit, pageNo) => {
    //console.log("searche", search_key);
    let url = this.searchProductUrl();
    let reqBody = {
      mobileNumber: UserMobile,
      search_key,
      merchantToken: Token,
      limit: limit,
      offset: pageNo,
    };
    let apiResponse = await Api.post(url, reqBody, '', '', {
      'Content-Type': 'application/json',
    });
    console.log('ReqBody', reqBody);
    return apiResponse.data;
  };

  getordercountURL = () => {
    return `${DEVELOPER_API_URL}/v1/roti/getOrdersCountByCustomer`;

    // http://wroti.app/v1/roti/getOrdersByCustomer
    // https://wroti.app/api/v1/roti/getOrdersCountByCustomer
  };

  getordercount = async (UserMobile, customer_id) => {
    let url = this.getordercountURL();
    let apiResponse = await Api.post(
      url,
      {mobileNumber: UserMobile, customer_id},
      '',
      '',
      {
        'Content-Type': 'application/json',
      },
    );
    // console.log('response--->orderhistory', apiResponse.data, url, {
    //   mobileNumber: UserMobile,
    //   customer_id,
    // });
    return apiResponse.data;
  };

  updateProductStatusUrl = () => {
    return `${DEVELOPER_API_URL}/v1/roti/updateProductStatus`;
  };

  getupdateProductStatus = async (UserMobile, product_id, status, Token) => {
    let url = this.updateProductStatusUrl();
    let payLoad = {
      mobileNumber: UserMobile,
      product_id,
      status,
      merchantToken: Token,
    };
    let apiResponse = await Api.post(url, payLoad, '', '', {
      'Content-Type': 'application/json',
    });
    console.log('Payload ,', payLoad, url);
    return apiResponse.data;
  };

  ValidateOTPUrl = () => {
    return `${DEVELOPER_API_URL}/v1/roti/validateOTP`;
  };

  ValidateOTP = async (OTP, otpToken) => {
    let url = this.ValidateOTPUrl();
    let apiResponse = await Api.post(
      url,
      {
        mobileNumber: USERNAME,
        otp: OTP,
        access_token: otpToken,
      },
      '',
      '',
      {'Content-Type': 'application/json'},
    );
    return apiResponse.data;
  };

  sendOTPUrl = () => {
    return `${DEVELOPER_API_URL}/v1/roti/sendOTP`;
  };

  sendOTP = async mobile => {
    let url = this.sendOTPUrl();
    let apiResponse = await Api.post(
      url,
      {
        mobileNumber: mobile,
      },
      '',
      '',
      {'Content-Type': 'application/json'},
    );
    return apiResponse.data;
  };

  getProductsUrl = () => {
    return `${DEVELOPER_API_URL}/v1/catalog/getProductsByCategory`;
  };

  getProducts = async (UserMobile, category_id, Token, currentPage) => {
    let url = this.getProductsUrl();
    let inputObject = {
      mobileNumber: UserMobile,
      category_id: category_id,
      merchantToken: Token,
      offset: currentPage,
    };
    console.log('payload====', inputObject);
    console.log('url====', url);
    let apiResponse = await Api.post(url, inputObject, '', '', {
      'Content-Type': 'application/json',
    });
    console.log('heyProducts', inputObject);
    // console.log(category_id);
    // console.log(
    //   "URL-------->",
    //   url,
    //   "catid--->",
    //   category_id,
    //   "InputObject------------>",
    //   inputObject
    // );
    //console.log("Response", apiResponse);
    return apiResponse.data;
  };

  getEditProductUrl = () => {
    return `${DEVELOPER_API_URL}/v1/roti/editProduct`;
  };

  getEditProduct = async (
    product_description,
    price,
    product_id,
    itemcode,
    catname,
    imagepath,
    Token,
    UserMobile,
    productStatus,
    selectedOptionNames,
    specialPrice,
    swiggyPrice,
    zomatoPrice,
  ) => {
    let url = this.getEditProductUrl();
    let inputData = {
      product_description,
      model: 'SBC100090',
      sku: itemcode,
      upc: '',
      product_id: product_id,
      ean: '',
      jan: '',
      isbn: '',
      mpn: '',
      location: '',
      price: price,
      tax_class_id: '0',
      quantity: '100',
      minimum: '1',
      subtract: '1',
      stock_status_id: '6',
      shipping: '1',
      date_available: '2022-06-22',
      length: '',
      width: '',
      height: '',
      length_class_id: '1',
      weight: '',
      weight_class_id: '1',
      status: productStatus,
      sort_order: '1',
      manufacturer: '',
      manufacturer_id: '0',
      category: catname,
      product_category: [catname],
      filter: '',
      product_store: ['0'],
      download: '',
      related: '',
      option: '',
      image: imagepath == undefined ? '' : imagepath,
      points: '',
      product_reward: {
        1: {
          points: '',
        },
      },
      product_special: [
        {
          customer_group_id: '1',
          priority: '',
          price: specialPrice,
          date_start: '',
          date_end: '',
        },
      ],
      product_seo_url: [
        {
          1: '',
          2: '',
        },
        {
          1: '',
          2: '',
        },
      ],
      product_layout: ['', ''],
      product_option: selectedOptionNames,
      mobileNumber: UserMobile,
      merchantToken: Token,
      sprice: swiggyPrice,
      zprice: zomatoPrice,
    };
    let apiResponse = await Api.post(url, inputData, '', '', {
      'Content-Type': 'application/json',
    });
    console.log('inputDataEditProduct', JSON.stringify(inputData), 'URL', url);
    return apiResponse.data;
  };

  getAddProductUrl = () => {
    return `${DEVELOPER_API_URL}/v1/roti/addProduct`;
  };

  getAddProduct = async (
    product_description,
    price,
    itemcode,
    catname,
    imagepath,
    localOptions,
    Token,
    UserMobile,
    specialPrice,
    swiggyPrice,
    zomatoPrice,
  ) => {
    let url = this.getAddProductUrl();
    let inputData = {
      product_description,
      model: '',
      sku: itemcode,
      upc: '',
      ean: '',
      jan: '',
      isbn: '',
      mpn: '',
      location: '',
      price: price,
      tax_class_id: '0',
      quantity: '100',
      minimum: '1',
      subtract: '1',
      stock_status_id: '6',
      shipping: '1',
      date_available: '2022-06-22',
      length: '',
      width: '',
      height: '',
      length_class_id: '1',
      weight: '',
      weight_class_id: '1',
      status: '1',
      sort_order: '1',
      manufacturer: '',
      manufacturer_id: '0',
      category: catname,
      product_category: [catname],
      filter: '',
      product_store: ['0'],
      download: '',
      related: '',
      option: '',
      product_special: [
        {
          customer_group_id: '1',
          priority: '',
          price: specialPrice,
          date_start: '',
          date_end: '',
        },
      ],
      image: imagepath == undefined ? '' : imagepath,
      points: '',
      product_reward: {
        1: {
          points: '',
        },
      },

      product_seo_url: [
        {
          1: '',
          2: '',
        },
        {
          1: '',
          2: '',
        },
      ],
      product_layout: ['', ''],
      product_option: localOptions,
      mobileNumber: UserMobile,
      merchantToken: Token,
      sprice: swiggyPrice,
      zprice: zomatoPrice,
    };
    console.log('inputData', JSON.stringify(inputData));
    let apiResponse = await Api.post(url, inputData, '', '', {
      'Content-Type': 'application/json',
    });

    return apiResponse.data;
  };

  getAddCustomerUrl = () => {
    return `${DEVELOPER_API_URL}/v1/roti/addNewCustomer`;
  };

  getAddCustomer = async (
    Token,
    UserMobile,
    FirstName,
    LastName,
    number,
    selectedGroupId,
  ) => {
    let url = this.getAddCustomerUrl();
    let inputData = {
      merchantToken: Token,
      mobileNumber: UserMobile,
      firstname: FirstName,
      lastname: LastName,
      telephone: number,
      customer_group_ids: selectedGroupId,
    };
    console.log(url);
    console.log('TestPayLoad', inputData);
    let apiResponse = await Api.post(url, inputData, '', '', {
      'Content-Type': 'application/json',
    });
    return apiResponse.data;
  };

  getCustomerDetailsByIdUrl = () => {
    return `${DEVELOPER_API_URL}/v1/roti/getCustomerDetailsById`;
  };

  getCustomerDetailsById = async (Token, customer_id) => {
    let url = this.getCustomerDetailsByIdUrl();
    let payLoad = {merchantToken: Token, customer_id};
    let apiResponse = await Api.post(url, payLoad, '', '', {
      'Content-Type': 'application/json',
    });
    return apiResponse.data;
  };

  getUpdateStoreTimingsUrl = () => {
    return `${DEVELOPER_API_URL}/v1/roti/updatedStoreTimings`;
  };

  getUpdateStoreTimings = async (UserMobile, Token, value) => {
    let url = this.getUpdateStoreTimingsUrl();
    let payLoad = {
      mobileNumber: UserMobile,
      merchantToken: Token,
      value: value,
    };
    console.log('PayLoadStore', payLoad);
    console.log('url', url);
    let apiResponse = await Api.post(url, payLoad, '', '', {
      'Content-Type': 'application/json',
      merchantToken: Token,
    });
    return apiResponse.data;
  };

  getStoreTimingsUrl = () => {
    return `${DEVELOPER_API_URL}/v1/roti/store-timings`;
  };

  getStoreTimings = async (UserMobile, Token) => {
    let url = this.getStoreTimingsUrl();
    let payLoad = {mobileNumber: UserMobile, merchantToken: Token};
    console.log('PayLoadStore', payLoad);
    let apiResponse = await Api.get(url, payLoad, '', '', {
      'Content-Type': 'application/json',
      merchantToken: Token,
    });
    return apiResponse.data;
  };

  getDeleteCustomerFromGroupUrl = () => {
    return `${DEVELOPER_API_URL}/v1/roti/deleteCustomerFromGroup`;
  };

  getDeleteCustomerFromGroup = async (
    Token,
    customer_group_id,
    customer_id,
  ) => {
    let url = this.getDeleteCustomerFromGroupUrl();
    let payLoad = {merchantToken: Token, customer_group_id, customer_id};
    let apiResponse = await Api.post(url, payLoad, '', '', {
      'Content-Type': 'application/json',
    });
    return apiResponse.data;
  };

  getGroupsByCustomerUrl = () => {
    return `${DEVELOPER_API_URL}/v1/roti/getCustomerInGroups`;
  };

  getGroupsByCustomer = async (UserMobile, Token, customer_id) => {
    let url = this.getGroupsByCustomerUrl();
    let payLoad = {
      mobileNumber: UserMobile,
      merchantToken: Token,
      customer_id: customer_id,
    };
    console.log('PayLoadGroups', payLoad);
    console.log('URl', url);
    let apiResponse = await Api.post(url, payLoad, '', '', {
      'Content-Type': 'application/json',
    });

    return apiResponse.data;
  };

  getCustomersInCustomerGroupUrl = () => {
    return `${DEVELOPER_API_URL}/v1/roti/getCustomersInCustomerGroup`;
  };

  getCustomersInCustomerGroup = async (
    Token,
    currentPage,
    search_key,
    customer_group_id,
    exclude,
  ) => {
    let url = this.getCustomersInCustomerGroupUrl();
    let payLoad = {
      merchantToken: Token,
      offset: currentPage,
      seakeyword: search_key,
      customer_group_id,
      exclude: exclude,
    };
    let apiResponse = await Api.post(url, payLoad, '', '', {
      'Content-Type': 'application/json',
    });
    return apiResponse.data;
  };

  updateStoreStatusUrl = () => {
    return `${DEVELOPER_API_URL}/v1/roti/updateStoreStatus`;
  };

  updateStoreStatus = async (UserMobile, Token, storeStatus) => {
    let url = this.updateStoreStatusUrl();
    let payLoad = {
      mobileNumber: UserMobile,
      merchantToken: Token,
      storeStatus: storeStatus,
    };
    console.log('payLoad', payLoad);
    let apiResponse = await Api.post(url, payLoad, '', '', {
      'Content-Type': 'application/json',
    });
    return apiResponse.data;
  };

  getStoreStatusUrl = () => {
    return `${DEVELOPER_API_URL}/v1/roti/getStoreStatus`;
  };

  getStoreStatus = async (UserMobile, Token) => {
    let url = this.getStoreStatusUrl();
    let payLoad = {
      mobileNumber: UserMobile,
      merchantToken: Token,
    };
    console.log('payLoad', payLoad);
    let apiResponse = await Api.post(url, payLoad, '', '', {
      'Content-Type': 'application/json',
    });
    return apiResponse.data;
  };

  getCustomerUrl = () => {
    return `${DEVELOPER_API_URL}/v1/roti/getCustomersList`;
  };

  getCustomer = async (UserMobile, currentPage, search_key) => {
    let url = this.getCustomerUrl();
    let payLoad = {
      mobileNumber: UserMobile,
      limit: `${PAGE_LIMIT}`,
      offset: currentPage,
      seakeyword: search_key,
    };
    console.log('payLoad', payLoad);
    let apiResponse = await Api.post(url, payLoad, '', '', {
      'Content-Type': 'application/json',
    });
    return apiResponse.data;
  };

  getCouponsUrl = () => {
    return `${DEVELOPER_API_URL}/v1/roti/getCoupons`;
  };

  getCoupons = async (UserMobile, Token, currentPage, search_key) => {
    let url = this.getCouponsUrl();

    let payLoad = {
      mobileNumber: UserMobile,
      merchantToken: Token,
      offset: currentPage,
      limit: 1000,
      seakeyword: search_key,
    };
    let apiResponse = await Api.post(url, payLoad, '', '', {
      'Content-Type': 'application/json',
    });
    return apiResponse.data;
  };

  getCreateTemplateUrl = () => {
    return `${DEVELOPER_API_URL}/v1/roti/message-template`;
  };

  getCreateTemplate = async (
    categoryName,
    templateName,
    language,
    component,
    Token,
  ) => {
    let url = this.getCreateTemplateUrl();
    let payLoad = {
      category: categoryName,
      components: component,
      name: templateName,
      language: language,
    };
    console.log('TestCreateTemplatePayLoad', JSON.stringify(payLoad));
    let apiResponse = await Api.post(url, payLoad, '', '', {
      'Content-Type': 'application/json',
      merchantToken: Token,
    });
    return apiResponse.data;
  };

  getOrderDetailsByOrderIdUrl = () => {
    return `${DEVELOPER_API_URL}/v1/roti/get-delivery-details`;
  };

  getOrderDetailsByOrderId = async (order_id, Token, mobileNumber) => {
    let url = this.getOrderDetailsByOrderIdUrl();
    let payLoad = {
      mobileNumber: mobileNumber,
      merchantToken: Token,
      // "order_id": 2234
      order_id: order_id,
    };
    // console.log("url", url);
    // console.log("detailsPayload", JSON.stringify(payLoad));
    let apiResponse = await Api.post(url, payLoad, '', '', {
      'Content-Type': 'application/json',
    });
    return apiResponse.data;
  };

  updateTemplateUrl = () => {
    return `${DEVELOPER_API_URL}/v1/roti/message-template`;
  };
  updateTemplate = async (
    categoryName,
    templateName,
    language,
    component,
    Token,
    Id,
    UserMobile,
  ) => {
    let url = this.updateTemplateUrl();
    let payLoad = {
      category: categoryName,
      components: component,
      name: templateName,
      language: language,
      templateId: Id,
      merchantToken: Token,
      mobileNumber: UserMobile,
    };
    console.log('TestEdditTemplatePayLoad', JSON.stringify(payLoad));
    let apiResponse = await Api.put(url, payLoad, '', '', {
      'Content-Type': 'application/json',
      merchantToken: Token,
    });
    return apiResponse.data;
  };

  getCouponByIdUrl = () => {
    return `${DEVELOPER_API_URL}/v1/roti/getCouponById`;
  };

  getCouponById = async (UserMobile, Token, coupon_Id) => {
    let url = this.getCouponByIdUrl();
    let payLoad = {
      mobileNumber: UserMobile,
      merchantToken: Token,
      coupon_id: coupon_Id,
    };
    let apiResponse = await Api.post(url, payLoad, '', '', {
      'Content-Type': 'application/json',
    });
    return apiResponse.data;
  };

  getDeleteCouponsUrl = () => {
    return `${DEVELOPER_API_URL}/v1/roti/deleteCoupon`;
  };

  getDeleteCoupons = async (UserMobile, Token, coupon_id) => {
    let url = this.getDeleteCouponsUrl();

    let payLoad = {
      mobileNumber: UserMobile,
      merchantToken: Token,
      coupon_id: coupon_id,
    };
    let apiResponse = await Api.post(url, payLoad, '', '', {
      'Content-Type': 'application/json',
    });
    return apiResponse.data;
  };

  getRatingNumberUrl = () => {
    return `${DEVELOPER_API_URL}/v1/roti/getRatingsByNumber`;
  };

  getRatingNumber = async (UserMobile, Token) => {
    let url = this.getRatingNumberUrl();

    let payLoad = {
      mobileNumber: UserMobile,
      merchantToken: Token,
    };
    console.log('RatingsPayload', payLoad);
    let apiResponse = await Api.post(url, payLoad, '', '', {
      'Content-Type': 'application/json',
    });
    console.log('OrderRatings', apiResponse.data);
    return apiResponse.data;
  };

  getClearAllFilterUrl = () => {
    return `${DEVELOPER_API_URL}/v1/roti/getOrderRatings`;
  };

  getClearAllFilter = async (UserMobile, Token) => {
    let url = this.getClearAllFilterUrl();

    let payLoad = {
      mobileNumber: UserMobile,
      merchantToken: Token,
    };

    console.log('helloPayload', payLoad);

    let apiResponse = await Api.post(url, payLoad, '', '', {
      'Content-Type': 'application/json',
    });
    console.log('ClearRatings', apiResponse.data);
    return apiResponse.data;
  };

  getOrderRatingUrl = () => {
    return `${DEVELOPER_API_URL}/v1/roti/getOrderRatings`;
  };

  getOrderRating = async (
    UserMobile,
    Token,
    val,
    //code,
    fromFDate,
    toFDate,
    ratingFilter,
  ) => {
    console.log('1', fromFDate);
    console.log('2', toFDate);
    console.log('3', ratingFilter);
    let url = this.getOrderRatingUrl();

    let payLoad = {
      mobileNumber: UserMobile,
      merchantToken: Token,
      seakeyword: val.trim(),
      //code: "",
      filter_date_start: fromFDate,
      filter_date_end: toFDate,
      rating: ratingFilter,
    };

    console.log('helloPayload', payLoad);

    let apiResponse = await Api.post(url, payLoad, '', '', {
      'Content-Type': 'application/json',
    });
    console.log('OrderRatings', apiResponse.data);
    return apiResponse.data;
  };

  getAddCouponUrl = () => {
    return `${DEVELOPER_API_URL}/v1/roti/addCoupon`;
  };

  getAddCoupon = async (
    UserMobile,
    Token,
    couponName,
    couponCode,
    PercentageCode,
    discount,
    totalAmount,
    CustomerLoginCode,
    FreeShippingCode,
    selectedItems,
    selectedCategories,
    startDate,
    endDate,
    usesPerCoupon,
    usesPerCustomer,
    StatusCode,
    coupon_cap,
  ) => {
    let url = this.getAddCouponUrl();

    let payLoad = {
      mobileNumber: UserMobile,
      merchantToken: Token,
      name: couponName,
      code: couponCode,
      type: PercentageCode,
      discount: discount,
      total: totalAmount,
      logged: CustomerLoginCode,
      shipping: FreeShippingCode,
      product: '',
      category: '',
      date_start: startDate,
      date_end: endDate,
      uses_total: usesPerCoupon,
      uses_customer: usesPerCustomer,
      status: StatusCode,
      coupon_product: selectedItems,
      coupon_category: selectedCategories,
      coupon_cap: coupon_cap,
    };
    let apiResponse = await Api.post(url, payLoad, '', '', {
      'Content-Type': 'application/json',
    });
    console.log('AddCouponPayload', payLoad);
    return apiResponse.data;
  };

  getEditCouponUrl = () => {
    return `${DEVELOPER_API_URL}/v1/roti/editCoupon`;
  };

  getEditCoupon = async (
    UserMobile,
    Token,
    coupon_id,
    couponName,
    couponCode,
    PercentageCode,
    discount,
    totalAmount,
    CustomerLoginCode,
    FreeShippingCode,
    selectedItems,
    selectedCategories,
    startDate,
    endDate,
    usesPerCoupon,
    usesPerCustomer,
    StatusCode,
    coupon_cap,
    description,
  ) => {
    let url = this.getEditCouponUrl();
    console.log('URL', url);

    let payLoad = {
      mobileNumber: UserMobile,
      merchantToken: Token,
      coupon_id: coupon_id,
      name: couponName,
      code: couponCode,
      type: PercentageCode,
      discount: discount,
      total: totalAmount,
      logged: CustomerLoginCode,
      shipping: FreeShippingCode,
      product: '',
      category: '',
      date_start: startDate,
      date_end: endDate,
      uses_total: usesPerCoupon,
      uses_customer: usesPerCustomer,
      status: StatusCode,
      coupon_product: selectedItems,
      coupon_category: selectedCategories,
      coupon_cap: coupon_cap,
      description: description == undefined ? '' : descriptions,
    };
    console.log('PAYLOADEDITCOUPON', payLoad);
    let apiResponse = await Api.post(url, payLoad, '', '', {
      'Content-Type': 'application/json',
    });
    console.log('editCouponPayLoad', payLoad);
    return apiResponse.data;
  };

  getuploadimageURL = () => {
    return `${DEVELOPER_API_URL}/v1/roti/uploadImage`;
  };

  getuploadimage = async formData => {
    let url = this.getuploadimageURL();
    console.log('formData-==-=-=-=', JSON.stringify(formData));
    let apiResponse = await Api.post(url, formData, '', '', {
      Accept: 'application/json',
      'Content-Type': 'multipart/form-data',
    });
    return apiResponse.data;
  };

  getSupportedLanguagesURL = () => {
    return `${DEVELOPER_API_URL}/v1/roti/getSupportedLanguages`;

    // http://wroti.app/v1/roti/getOrdersByCustomer
  };

  getSupportedLanguages = async UserMobile => {
    let url = this.getSupportedLanguagesURL();
    let apiResponse = await Api.post(
      url,
      {
        mobileNumber: UserMobile,
      },
      '',
      '',
      {'Content-Type': 'application/json'},
    );
    // console.log("response--->orderhistory", apiResponse.data);
    return apiResponse.data;
  };

  getcatsURL = () => {
    return `${DEVELOPER_API_URL}/v1/roti/getCategories`;
    // return `${DEVELOPER_API_URL}/v1/catalog/getAllCategories`;

    // http://wroti.app/v1/roti/getOrdersByCustomer
  };

  getcats = async (UserMobile, Token) => {
    let url = this.getcatsURL();
    let reqBody = {
      mobileNumber: UserMobile,
      merchantToken: Token,
      limit: 10000,
      offset: 1,
      status: 2,
    };
    console.log('--------------->reqBody', reqBody, url);
    let apiResponse = await Api.post(url, reqBody, '', '', {
      'Content-Type': 'application/json',
    });
    return apiResponse.data;
  };

  getMerchantInfoURL = () => {
    return `${DEVELOPER_API_URL}/v1/roti/getMerchantInfo`;

    // http://wroti.app/v1/roti/getOrdersByCustomer
  };

  getMerchantInfo = async (UserMobile, Token) => {
    let url = this.getMerchantInfoURL();
    let reqBody = {
      mobileNumber: UserMobile,
      merchantToken: Token,
    };
    let apiResponse = await Api.post(url, reqBody, '', '', {
      'Content-Type': 'application/json',
    });
    // console.log("apiResponse.data",JSON.stringify(apiResponse.data))
    return apiResponse.data;
  };

  getOrderstatsURL = () => {
    return `${DEVELOPER_API_URL}/v1/order/getOrderStats`;

    // http://wroti.app/v1/roti/getOrdersByCustomer
  };

  getOrderstats = async UserMobile => {
    let url = this.getOrderstatsURL();
    const token = await AsyncStorage.getItem('token');
    let apiResponse = await Api.post(
      url,
      {
        mobileNumber: UserMobile,
        merchantToken: token,
      },
      '',
      '',
      {'Content-Type': 'application/json'},
    );
    console.log('orderstats--------------->', url, apiResponse.data, token);
    console.log('PAYLOAD', {
      mobileNumber: UserMobile,
    });
    return apiResponse.data;
  };

  getorderstatusURL = () => {
    return `${DEVELOPER_API_URL}/v1/roti/getOrderStatusList`;

    // http://wroti.app/v1/roti/getOrdersByCustomer
  };

  getorderstatus = async () => {
    let url = this.getorderstatusURL();
    let apiResponse = await Api.post(
      url,
      {
        mobileNumber: USERNAME,
      },
      '',
      '',
      {'Content-Type': 'application/json'},
    );
    // console.log("response--->orderhistory", apiResponse.data);
    return apiResponse.data;
  };

  getorderupdateURL = () => {
    return `${DEVELOPER_API_URL}/v1/roti/updateOrderStatus`;

    // http://wroti.app/v1/roti/getOrdersByCustomer
  };

  getorderupdate = async (
    UserMobile,
    orderId,
    statusid,
    comments,
    customer_mobile,
    deliveryBoyId,
    deliveryType,
  ) => {
    let url = this.getorderupdateURL();
    let reqBody = {
      mobileNumber: UserMobile,
      order_id: orderId,
      order_status_id: statusid,
      comments: comments,
      is_notify: '',
      customer_mobile,
      deliveryType: deliveryType ? deliveryType : '',
      // devlieryBoyId
      custom_feild: {deliveryBoyId: deliveryBoyId ? deliveryBoyId : ''},
    };
    console.log('reqBody=== for order update', reqBody, url);
    // return false;
    let apiResponse = await Api.post(url, reqBody, '', '', {
      'Content-Type': 'application/json',
    });
    return apiResponse.data;
  };

  updateCustomerGroupurl = () => {
    return `${DEVELOPER_API_URL}/v1/roti/updateCustomerGroup`;
  };

  updateCustomerGroup = async (Token, name, customer_group_id) => {
    let url = this.updateCustomerGroupurl();
    let payLoad = {
      customer_group_description: {
        1: {
          name: name,
          description: 'test',
        },
        3: {
          name: name,
          description: 'test',
        },
        2: {
          name: name,
          description: 'test',
        },
      },
      approval: '0',
      sort_order: '5',
      merchantToken: Token,
      customer_group_id: customer_group_id,
    };
    let apiResponse = await Api.post(url, payLoad, '', '', {
      'Content-Type': 'application/json',
    });
    return apiResponse.data;
  };

  getOrderDetailsURL = () => {
    return `${DEVELOPER_API_URL}/v1/order/getOrderByOrderId`;

    // http://wroti.app/v1/roti/getOrdersByCustomer
  };

  getOrderDetails = async (UserMobile, orderId) => {
    let url = this.getOrderDetailsURL();
    const token = await AsyncStorage.getItem('token');
    let inputdata = {
      mobileNumber: UserMobile,
      order_id: orderId,
      merchantToken: token,
    };
    console.log('inputDataget OrderDetails', inputdata);
    console.log('URL+++++++++++ getOrderDetails', url);
    let apiResponse = await Api.post(url, inputdata, '', '', {
      'Content-Type': 'application/json',
    });
    console.log('------apiResponse---->', apiResponse?.data);
    return apiResponse.data;
  };

  getOrdersHistoryURL = () => {
    return `${DEVELOPER_API_URL}/v1/roti/getOrdersByMerchant`;

    // http://wroti.app/v1/roti/getOrdersByCustomer
  };

  getOrdersHistory = async (
    UserMobile,
    order_status_id,
    Token,
    currentPage,
  ) => {
    let url = this.getOrdersHistoryURL();
    let inputData = {
      mobileNumber: UserMobile,
      order_status_id: order_status_id,
      merchantToken: Token,
      offset: currentPage,
      limit: `${PAGE_LIMIT}`,
    };

    console.log('input data ===>new', inputData, 'url', url);

    let apiResponse = await Api.post(url, inputData, '', '', {
      'Content-Type': 'application/json',
    });
    // console.log('apiResponse==orders===>', JSON.stringify(apiResponse.data));
    return apiResponse;
  };

  getShippingAddresses = async (UserId, accesstoken) => {
    let timestamp = new Date().getTime();
    let url = this.getShippingAddressesURL(UserId);
    let responseData = await this.getOAuthSignature(timestamp, url, 'GET');

    let apiResponse = await Api.get(
      this.getfinalUrl(url, timestamp, responseData.data),
      '',
      '',
      '',
      {accesstoken, apiversion: '4'},
    );

    return apiResponse;
  };
  // create account

  LoginWithThirdPartyProvider = async (
    firstName,
    lastName,
    provider,
    profileId,
    loginId,
  ) => {
    let timestamp = new Date().getTime();
    let url = this.getLoginWithThirdPartyProviderURL();
    let responseData = await this.getOAuthSignature(timestamp, url, 'POST');

    let inputData = `InputFormat=application/json&InputData={"provider":"${provider}","profileId":"${profileId}","FirstName":"${firstName}","email":"${loginId}","loginId":"${loginId}",    "LastName":"${lastName}"}`;

    let apiResponse = await Api.post(
      this.getfinalUrl(url, timestamp, responseData.data),
      inputData,
      '',
      '',
      {},
    );
    return apiResponse;
  };

  Login = async (mobile, password) => {
    let timestamp = new Date().getTime();
    let url = this.getLoginUrl();
    let responseData = await this.getOAuthSignature(timestamp, url, 'POST');

    let inputData = `InputFormat=application/json&InputData={"username":"${mobile}","password":"${password}"}`;

    let apiResponse = await Api.post(
      this.getfinalUrl(url, timestamp, responseData.data),
      inputData,
      '',
      '',
      {},
    );

    return apiResponse;
  };

  LoginWithOTP = async (mobile, otp, otptoken) => {
    let timestamp = new Date().getTime();
    let url = this.getLoginWithOTPURL();
    let responseData = await this.getOAuthSignature(timestamp, url, 'POST');

    let inputData = `InputFormat=application/json&InputData={"UserName":"${mobile}","OTP":"${otp}"}`;

    let AccessToken = await this.GetAccessToken();

    let apiResponse = await Api.post(
      this.getfinalUrl(url, timestamp, responseData.data),
      inputData,
      '',
      '',
      {otptoken, AccessToken},
    );

    //console.log("ACCESS TOKEN---->",apiResponse.data);
    return apiResponse;
  };

  getStates = async () => {
    let timestamp = new Date().getTime();
    let url = this.getStatesUrl();
    let responseData = await this.getOAuthSignature(timestamp, url, 'GET');

    let apiResponse = await Api.get(
      this.getfinalUrl(url, timestamp, responseData.data),
      '',
      '',
      '',
      {},
    );
  };

  verifyOTP(lat, lon) {
    return this.POST('/checkin', {lat, lon});
  }

  getOAuthSignature = async (timestamp, url, method) => {
    let signatureUrl =
      DEVELOPER_API_URL +
      '/OAuth/Signature/' +
      publicKey +
      '/' +
      secretKey +
      '/' +
      timestamp +
      '/' +
      timestamp +
      '/' +
      method +
      '?url=' +
      url;
    let apiResponse = await Api.get(signatureUrl, {}, '', '');

    return apiResponse;
  };

  GetAccessToken = async () => {
    let timestamp = new Date().getTime();
    let url = this.getGetAccessTokenURL();

    let responseData = await this.getOAuthSignature(timestamp, url, 'POST');
    let apiResponse = await Api.post(
      this.getfinalUrl(url, timestamp, responseData.data),
      '',
      '',
      '',
      {},
    );

    return apiResponse.data.Token.AccessToken;
  };

  getfinalUrl(url, timestamp, signature) {
    return `${url}?oauth_consumer_key=${publicKey}&oauth_nonce=${timestamp}&oauth_signature_method=HMAC-SHA1&oauth_timestamp=${timestamp}&oauth_version=1.0&oauth_signature=${signature}`;
  }

  // searchCustomer = async (mobile) => {
  //   let timestamp = new Date().getTime();
  //   let url = this.getCustomerSearchUrl();
  //   let responseData = await this.getOAuthSignature(timestamp, url, "POST");

  //   let inputData = `InputFormat=application/json&InputData={"customerSearch":{"UserName":"${mobile}"}}`;

  //   let apiResponse = await Api.post(
  //     this.getfinalUrl(url, timestamp, responseData.data),
  //     inputData,
  //     "",
  //     ""
  //   );

  //   return apiResponse;
  // };

  getSucessMessageCode() {
    return '1004';
  }

  sendReminderMessage = async (
    UserMobile,
    orderId,
    order_status_id,
    customerMobile,
    comments,
  ) => {
    let url = `${DEVELOPER_API_URL}/v1/roti/sendReminderMessage`;
    let payLoad = {
      mobileNumber: UserMobile,
      order_status_id: order_status_id,
      order_id: orderId,
      customer_mobile: customerMobile,
      comments: '',
    };
    console.log('reminder button Payload', payLoad);
    let apiResponse = await Api.post(url, payLoad, '', '', {
      'Content-Type': 'application/json',
    });
    return apiResponse;
  };

  addPromotion = async (
    UserMobile,
    Token,
    title,
    selectedOption,
    selectedRadio,
    orderUnit,
    spendINR,
    getOff,
    specialPrice,
    unitPerUsed,
    customerGroupRadio,
    startDate,
    endDate,
    priorityOrder,
    selectedStatus,
    selectedDesignStatus,
    selectedImage,
    headerBanner,
  ) => {
    let url = `${DEVELOPER_API_URL}/v1/roti/addPromotion`;
    let payLoad = {
      mobileNumber: UserMobile,
      merchantToken: Token,
      title: {title},
      meta: {},
      rule_group: selectedOption,
      rule_type: selectedRadio,
      condition_min_quantity: orderUnit,
      condition_min_quantities: '',
      condition_min_amount: spendINR,
      condition_min_amounts: '',
      condition_min_orders: '',
      condition_category_ids: '',
      discount_product_ids: '',
      discount_category_ids: '',
      discount_manufacturer_ids: '',
      discount_value: getOff,
      discount_values: '',
      discount_type: '',
      discount_qualifier: '',
      zone_ids: '',
      exclude_categories: '',
      condition_manufacturer_ids: '',
      excluded_category_ids: '',
      apply_once: '',
      customer_ids: '',
      condition_product_ids: ['321'],
      discount_quantity: '1',
      apply_special: specialPrice,
      limit_usage: unitPerUsed,
      limit_max_usage: '10',
      coupon_code: '',
      limit_customer_groups: '0',
      customer_group_ids: [customerGroupRadio],
      limit_customer_profile: '0',
      stores: ['0', '7'],
      date_start: startDate,
      date_end: endDate,
      priority: priorityOrder,
      status: selectedStatus,
      design_status: selectedDesignStatus,
      design_module_banner: selectedImage,
      design_page_banner: headerBanner,
      design_page_message: {
        1: 'Buy 1 Get ',
        3: 'Buy 1 Get',
        2: 'Buy 1 Get  ',
      },
      message_congrats: {
        1: 'Congratulations! {promo_name} offer for product {promo_items} successfully applied to cart!',
        3: 'Congratulations! {promo_name} offer for product {promo_items} successfully applied to cart!',
        2: 'Congratulations! {promo_name} offer for product {promo_items} successfully applied to cart',
      },
      message_eligible: {
        1: 'Products {promo_items} in shopping cart qualifies for a free item from <b>{promo_name} offer, add {discount_quantity} more unit as free item! ',
        3: 'Products {promo_items} in shopping cart qualifies for a free item from <b>{promo_name} offer, add {discount_quantity} more unit as free item ',
        2: 'Products {promo_items} in shopping cart qualifies for a free item from <b>{promo_name} offer, add {discount_quantity} more unit as free item! ',
      },
      message_upsell: {
        1: '',
        2: '',
        3: '',
      },
    };
    console.log('add promotions Payload', payLoad);
    let apiResponse = await Api.post(url, payLoad, '', '', {
      'Content-Type': 'application/json',
    });
    return apiResponse;
  };

  getMediaFiles = async type => {
    let url = `${DEVELOPER_API_URL}/v1/roti/getMediaFiles`;
    let payLoad = {
      type: type,
    };
    let apiResponse = await Api.post(url, payLoad, '', '', {
      'Content-Type': 'application/json',
    });
    return apiResponse;
  };

  checkPaymentStatus = async (mobile, Token, orderId) => {
    let url = `${DEVELOPER_API_URL}/v1/payment/checkPaymentByOrderId`;
    let payLoad = {
      mobileNumber: mobile,
      merchantToken: Token,
      order_id: orderId,
    };
    console.log(url, payLoad);
    let apiResponse = await Api.post(url, payLoad, '', '', {
      'Content-Type': 'application/json',
    });
    return apiResponse.data;
  };
  pushOrderToPOS = async (mobile, Token, orderId) => {
    let url = `${DEVELOPER_API_URL}/v1/pos/pushOrderToPOSFromMerchant`;
    let payLoad = {
      mobileNumber: mobile,
      merchantToken: Token,
      orderId: orderId,
    };
    console.log(url, payLoad);
    let apiResponse = await Api.post(url, payLoad, '', '', {
      'Content-Type': 'application/json',
    });
    return apiResponse.data;
  };
  getOrdersByMobile = async (
    merchantMobile,
    token,
    searchMobile,
    limit,
    offset,
  ) => {
    let url = `${DEVELOPER_API_URL}/v1/roti/getOrdersByMerchant`;
    let payLoad = {
      mobileNumber: merchantMobile,
      merchantToken: token,
      customer_mobile: searchMobile,
      limit: limit,
      offset: offset,
    };
    console.log('payLoad orders==================>', payLoad, 'url:', url);
    let apiResponse = await Api.post(url, payLoad, '', '', {
      'Content-Type': 'application/json',
    });
    return apiResponse;
  };

  getBanners = async (UserMobile, tag) => {
    let url = `${DEVELOPER_API_URL}/v1/merchant/getBanners`;
    let payLoad = {
      mobileNumber: UserMobile,
      tag: tag,
    };
    console.log('getbanner payload', payLoad);
    let apiResponse = await Api.post(url, payLoad, '', '', {
      'Content-Type': 'application/json',
    });
    return apiResponse;
  };

  addBanners = async (
    UserMobile,
    type,
    storeId,
    bannerName,
    path,
    sequence,
    status,
  ) => {
    let url = `${DEVELOPER_API_URL}/v1/merchant/addBanners`;
    let payLoad = {
      mobileNumber: UserMobile,
      banner_type: type,
      store_id: storeId,
      images: [
        {
          url: 'https://biryanistationocuat.wroti.app/image/' + path,
          sequence: sequence,
          is_active: 'true',
          banner_name: bannerName,
        },
      ],
      status: status,
    };
    console.log('add banners payload 66666666', payLoad);
    let apiResponse = await Api.post(url, payLoad, '', '', {
      'Content-Type': 'application/json',
    });
    return apiResponse;
  };

  updateBanners = async (
    id,
    UserMobile,
    type,
    storeId,
    bannerName,
    updatedImage,
    sequence,
    status,
  ) => {
    let url = `${DEVELOPER_API_URL}/v1/merchant/updateBanners`;
    let imageUrl = '';
    if (updatedImage) {
      if (
        updatedImage.startsWith('https://biryanistationocuat.wroti.app/image/')
      ) {
        imageUrl = updatedImage;
      } else {
        imageUrl =
          'https://biryanistationocuat.wroti.app/image/' + updatedImage;
      }
    }
    let payLoad = {
      id: id,
      mobileNumber: UserMobile,
      banner_type: type,
      store_id: storeId,
      images: [
        {
          url: imageUrl,
          sequence: sequence,
          is_active: 'true',
          banner_name: bannerName,
        },
      ],
      status: status,
    };
    console.log('update------', payLoad);
    let apiResponse = await Api.post(url, payLoad, '', '', {
      'Content-Type': 'application/json',
    });
    return apiResponse;
  };

  deleteBanner = async id => {
    let url = `${DEVELOPER_API_URL}/v1/merchant/deleteBanner`;
    let payLoad = {
      id: id,
    };
    let apiResponse = await Api.post(url, payLoad, '', '', {
      'Content-Type': 'application/json',
    });
    return apiResponse;
  };

  salesReports = async (
    startDate,
    endDate,
    selectedItem,
    selectedOrderTypeId,
    UserMobile,
    Token,
    reportType,
    pageNumber,
    limit,
  ) => {
    let url = `${DEVELOPER_API_URL}/v1/roti/reports`;
    let payLoad = {
      filter_date_end: endDate,
      filter_date_start: startDate,
      filter_group: selectedItem,
      filter_order_status_id: selectedOrderTypeId,
      merchantToken: Token,
      mobileNumber: UserMobile,
      offset: pageNumber,
      limit: limit,
      report_type: reportType,
    };
    console.log('getTotalSales payload', payLoad);
    let apiResponse = await Api.post(url, payLoad, '', '', {
      'Content-Type': 'application/json',
    });
    return apiResponse;
  };

  getCustomersList = async (UserMobile, Token, searchKey) => {
    let url = `${DEVELOPER_API_URL}/v1/roti/getCustomersList`;
    let payLoad = {
      mobileNumber: UserMobile,
      merchantToken: Token,
      seakeyword: searchKey,
      offset: 1,
      limit: 100,
    };
    let apiResponse = await Api.post(url, payLoad, '', '', {
      'Content-Type': 'application/json',
    });
    return apiResponse;
  };

  getMongoChatMessages = async (UserMobile, Token, CustomerMobile) => {
    let url = `${DEVELOPER_API_URL}/v1/roti/getMongoChatMessages`;
    let payLoad = {
      mobileNumber: UserMobile,
      merchantToken: Token,
      customer_mobile: CustomerMobile,
      // active:true
    };
    console.log('payload------', payLoad);
    let apiResponse = await Api.post(url, payLoad, '', '', {
      'Content-Type': 'application/json',
    });
    return apiResponse;
  };

  sendMongoChatMessages = async (
    UserMobile,
    Token,
    CustomerMobile,
    Store,
    customername,
    replyMessage,
  ) => {
    let url = `${DEVELOPER_API_URL}/v1/roti/sendMongoChatMessages`;
    let payLoad = {
      mobileNumber: UserMobile,
      merchantToken: Token,
      customer_mobile: CustomerMobile,
      customer_name: customername,
      merchant_name: Store,
      sessionId: CustomerMobile,
      message: replyMessage,
      messageId: '',
      // active:true
    };
    console.log('payload------replay', payLoad);
    let apiResponse = await Api.post(url, payLoad, '', '', {
      'Content-Type': 'application/json',
    });
    return apiResponse;
  };

  activeUser = async (UserMobile, Token) => {
    let url = `${DEVELOPER_API_URL}/v1/roti/getMongoChatMessages`;
    let payLoad = {
      mobileNumber: UserMobile,
      merchantToken: Token,
      active: true,
    };
    console.log('payload------', payLoad);
    let apiResponse = await Api.post(url, payLoad, '', '', {
      'Content-Type': 'application/json',
    });
    return apiResponse;
  };

  updateAgentStatus = async (UserMobile, Token, CustomerMobile, isEnabled) => {
    let url = `${DEVELOPER_API_URL}/v1/roti/updateAgentStatus`;
    let payLoad = {
      mobileNumber: UserMobile,
      merchantToken: Token,
      customer_mobile: CustomerMobile,
      status: isEnabled,
    };
    console.log('payload status------', payLoad);
    let apiResponse = await Api.post(url, payLoad, '', '', {
      'Content-Type': 'application/json',
    });
    return apiResponse;
  };

  getChatStatus = async () => {
    let url = `${DEVELOPER_API_URL}/v1/roti/getChatStatus`;
    let apiResponse = await Api.get(url, '', '', '', {
      'Content-Type': 'application/json',
    });
    return apiResponse;
  };

  updateChatStatus = async (
    UserMobile,
    Token,
    CustomerMobile,
    selectedStatus,
  ) => {
    let url = `${DEVELOPER_API_URL}/v1/roti/updateChatStatus`;
    let payLoad = {
      mobileNumber: UserMobile,
      merchantToken: Token,
      customerMobile: CustomerMobile,
      status: selectedStatus,
    };
    console.log('payload status------', payLoad);
    let apiResponse = await Api.post(url, payLoad, '', '', {
      'Content-Type': 'application/json',
    });
    return apiResponse;
  };

  getAgentStatus = async (UserMobile, Token, CustomerMobile) => {
    let url = `${DEVELOPER_API_URL}/v1/roti/getAgentStatus`;
    let payLoad = {
      mobileNumber: UserMobile,
      merchantToken: Token,
      customerMobile: CustomerMobile,
    };
    console.log('agent payload status------', payLoad);
    let apiResponse = await Api.post(url, payLoad, '', '', {
      'Content-Type': 'application/json',
    });
    return apiResponse;
  };
}
