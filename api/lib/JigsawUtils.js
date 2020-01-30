const request = require('request-promise');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const jigsawEnv = process.env.ENV || 'training';
const jigsawLoginEnv = {
  training: 'training',
  production: 'live'
}[jigsawEnv];

const loginUrl = `https://${jigsawLoginEnv}.housingjigsaw.co.uk/auth/login`;

let bearerToken = null;
let lastLogin = null;

const getCSRFTokens = async function() {
  const httpResponse = await request.get({
    url: loginUrl,
    resolveWithFullResponse: true
  });

  const cookies = httpResponse.headers['set-cookie'].map(
    cookie => cookie.split(';')[0]
  );

  const dom = new JSDOM(httpResponse.body);
  const token = dom.window.document.querySelector(
    'input[name=__RequestVerificationToken]'
  ).value;

  return {
    cookies,
    token
  };
};

const login = async function() {
  if (bearerToken && lastLogin && lastLogin > new Date() - 3600) {
    return bearerToken;
  } else {
    const tokens = await getCSRFTokens();
    // make auth request to Jigsaw
    const authCredentials = {
      Email: process.env.Jigsaw_email,
      Password: process.env.Jigsaw_password,
      __RequestVerificationToken: tokens.token
    };

    const httpResponse = await request.post({
      url: loginUrl,
      form: authCredentials,
      headers: {
        Cookie: tokens.cookies.join('; ')
      },
      resolveWithFullResponse: true,
      simple: false
    });

    const matched = httpResponse.headers.location.match(/accesstoken=([^&]*)/);
    if (matched) {
      bearerToken = matched[1];
      lastLogin = new Date();
      return bearerToken;
    } else {
      throw 'Could not get auth token';
    }
  }
};

const doGetRequest = async function(url, qs, headers) {
  let options = { uri: url, resolveWithFullResponse: true };
  if (headers) options.headers = headers;
  if (qs) options.qs = qs;

  const httpResponse = await request.get(options);
  return JSON.parse(httpResponse.body);
};

const doPostRequest = async function(url, json, headers) {
  let options = { url, json, resolveWithFullResponse: true };
  if (headers) options.headers = headers;

  const httpResponse = await request.post(options);
  return httpResponse.body;
};

const doJigsawGetRequest = async function(url, qs) {
  const token = await login();
  return doGetRequest(url, qs, { Authorization: `Bearer ${token}` });
};

const doJigsawPostRequest = async function(url, json) {
  const token = await login();
  return doPostRequest(url, json, { Authorization: `Bearer ${token}` });
};

module.exports = { doJigsawGetRequest, jigsawEnv };
