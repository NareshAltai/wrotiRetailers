import axios from 'axios';
// var qs = require('qs');

function buildHeaders(headers, token) {
  if (token && token != '') {
    return {
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',

      token: token,

      ...headers,
    };
  }
  return {
    Accept: 'application/json',
    'Content-Type': 'application/x-www-form-urlencoded',

    ...headers,
  };
}

function request(props) {
  const {url, init, query, option, token} = props;

  const strQuery = query ? `?${query}` : '';
  const fetchUrl = `${url}${strQuery}`;

  let axiosData = {
    url: fetchUrl,
    method: init.method,

    headers: buildHeaders(init.headers, token),
    timeout: option && option.timeout ? option.timeout : 0,
  };

  if (axiosData.method != 'GET') {
    axiosData.data = option;
  }

  return axios(axiosData)
    .then(response => response)
    .catch(error => error.response);
}

const Api = {
  get: (url, option, query, token, customheaders) =>
    request({
      url,
      init: {
        method: 'GET',
        headers: customheaders,
      },
      option,
      query,
      token,
    }),

  delete: (url, option, query, token, customheaders) =>
    request({
      url,
      init: {
        method: 'DELETE',
        headers: customheaders,
      },
      option,
      query,
      token,
    }),

  post: (url, option, query, token, customheaders) =>
    request({
      url,
      init: {
        method: 'POST',
        headers: customheaders,
      },
      option,
      query,
      token,
    }),
  put: (url, option, query, token, customheaders) =>
    request({
      url,
      init: {
        method: 'PUT',
        headers: customheaders,
      },
      option,
      query,
      token,
    }),
};

export default Api;
