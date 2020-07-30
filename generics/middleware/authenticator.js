/**
 * name : middleware/authenticator.js
 * author : Aman Karki
 * Date : 20-July-2020
 * Description : Keycloak authentication.
 */

// dependencies
const jwtDecode = require('jwt-decode');
const slackClient = require("../helpers/slack-communications");
const messageUtil = require("./lib/message-util");
let responseCode = require("../http-status-codes");


const sunbird = require("../helpers/sunbird");
var reqMsg = messageUtil.REQUEST;


var respUtil = function (resp) {
  return {
    status: resp.errCode,
    message: resp.errMsg,
    currentDate: new Date().toISOString()
  };
};

var tokenAuthenticationFailureMessageToSlack = function (req, token, msg) {
  let jwtInfomration = jwtDecode(token)
  jwtInfomration["x-authenticated-user-token"] = token
  const tokenByPassAllowedLog = {
    method: req.method,
    url: req.url,
    headers: req.headers,
    body: req.body,
    errorMsg: msg,
    customFields:
      jwtInfomration,
    slackErrorName: process.env.SLACK_ERROR_NAME,
    color: process.env.SLACK_ERROR_MESSAGE_COLOR
  }

  slackClient.sendMessageToSlack(tokenByPassAllowedLog)
}

var removedHeaders = [
  "host",
  "origin",
  "accept",
  "referer",
  "content-length",
  "accept-encoding",
  "accept-language",
  "accept-charset",
  "cookie",
  "dnt",
  "postman-token",
  "cache-control",
  "connection"
];

async function getAllRoles(obj) {
  let roles = await obj.roles;
  await _.forEach(obj.organisations, async value => {
    roles = await roles.concat(value.roles);
  });
  return roles;
}



module.exports = async function (req, res, next, token = "") {

  removedHeaders.forEach(function (e) {
    delete req.headers[e];
  });

  var token = req.headers["x-authenticated-user-token"];
  if (!req.rspObj) req.rspObj = {};
  var rspObj = req.rspObj;


  // Allow search endpoints for non-logged in users.
  let guestAccessPaths = [];
  await Promise.all(guestAccessPaths.map(async function (path) {
    if (req.path.includes(path)) {
      next();
      return;
    }
  }));

  let internalAccessApiPaths = [];
  let performInternalAccessTokenCheck = false;
  await Promise.all(internalAccessApiPaths.map(async function (path) {
    if (req.path.includes(path)) {
      performInternalAccessTokenCheck = true;
    }
  }));

  if (performInternalAccessTokenCheck) {
    if (req.headers["internal-access-token"] == process.env.INTERNAL_ACCESS_TOKEN) {
      next();
      return;
    } else {
      rspObj.errCode = reqMsg.TOKEN.MISSING_CODE;
      rspObj.errMsg = reqMsg.TOKEN.MISSING_MESSAGE;
      rspObj.responseCode = responseCode.unauthorized;
      return res.status(HTTP_STATUS_CODE["unauthorized"].status).send(respUtil(rspObj));
    }
  }


  let securedApiPaths = [];
  let tokenAndInternalAccessTokenRequired = false;
  await Promise.all(securedApiPaths.map(async function (path) {
    if (req.path.includes(path)) {
      tokenAndInternalAccessTokenRequired = true;
    }
  }));

  if (tokenAndInternalAccessTokenRequired) {
    if (req.headers["internal-access-token"] == process.env.INTERNAL_ACCESS_TOKEN && token) {
      next();
      return;
    } else {
      rspObj.errCode = reqMsg.TOKEN.MISSING_TOKEN_AND_INTERNAL_ACCESS_TOKEN_CODE;
      rspObj.errMsg = reqMsg.TOKEN.MISSING_TOKEN_AND_INTERNAL_ACCESS_TOKEN_MESSAGE;
      rspObj.responseCode = responseCode.unauthorized;
      return res.status(HTTP_STATUS_CODE["unauthorized"].status).send(respUtil(rspObj));
    }
  }


  if (!token) {
    rspObj.errCode = reqMsg.TOKEN.MISSING_CODE;
    rspObj.errMsg = reqMsg.TOKEN.MISSING_MESSAGE;
    rspObj.responseCode = responseCode.unauthorized;
    return res.status(HTTP_STATUS_CODE["unauthorized"].status).send(respUtil(rspObj));
  }

  sunbird
    .verifyToken(token)
    .then(async userDetails => {
      if (userDetails.result.isValid == true) {
        req.userDetails = {};
        req.userDetails = userDetails.result;
        req.userDetails['userToken'] = token;
        req.userDetails['allRoles'] = await getAllRoles(req.userDetails);
        next();
      } else {
        tokenAuthenticationFailureMessageToSlack(
          req,
          token,
          "TOKEN VERIFICATION - FAILED TO GET USER DETAIL"
        );
        rspObj.errCode = reqMsg.TOKEN.INVALID_CODE;
        rspObj.errMsg = reqMsg.TOKEN.INVALID_MESSAGE;
        rspObj.responseCode = responseCode.UNAUTHORIZED_ACCESS;
        return res.status(HTTP_STATUS_CODE["unauthorized"].status).send(respUtil(rspObj));

      }

    }).catch(error => {
      tokenAuthenticationFailureMessageToSlack(
        req,
        token,
        "TOKEN VERIFICATION - ERROR FETCHING USER DETAIL"
      );

      return res.status(HTTP_STATUS_CODE["unauthorized"].status).send(error);
    });

};
