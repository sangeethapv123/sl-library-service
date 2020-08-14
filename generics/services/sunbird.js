/**
 * name : sunbird.js
 * author : Rakesh Kumar
 * Date : 24-jun-2020
 * Description : All sunbird service related information.
 */

//dependencies

const request = require('request');



/**
  * Call to sunbird service. 
  * @function
  * @name callToSunbird
  * @param requestBody - Logged in user Id.
  * @param token - Logged in user token.
  * @param url - url of the api call.
  * @param requestType - http request method
  * @returns {JSON} - sunbird service response
*/

function callToSunbird(requestType, url, token="", requestBody = "") {
    return new Promise(async (resolve, reject) => {

        let options = {
            "headers": {
                "content-type": "application/json",
                "internal-access-token":process.env.INTERNAL_ACCESS_TOKEN
            }
        };
        if(token){
            options['headers']["x-authenticated-user-token"] = token;
        }

        if (requestType != "GET") {
            options['json'] = requestBody;
        }

        url = process.env.SUNBIRD_SERIVCE_HOST + process.env.SUNBIRD_SERIVCE_BASE_URL + process.env.URL_PREFIX + url;
        if (requestType == "PATCH") {
            request.patch(url, options, callback);
        } else if (requestType == "GET") {
            request.get(url, options, callback);
        } else {
            request.post(url, options, callback);
        }

        function callback(err, data) {

            if (err) {
                 return reject({
                    message: CONSTANTS.apiResponses.SUNBIRD_SERVICE_DOWN
                });
            } else {
                return resolve(data.body);
            }
        }

    });
}


/**
* To get list of learning resources
* @method
* @name  learningResources
* @param {String} token - user access token.
* @param {String} pageSize - page size of the request
* @param {String} pageNo - page no of the request
* @param {String} category - category for the learning resource
* @param {String} subCategory - subcategory for the learning resource
* @param {String} topic -  topic for the learning resource
* @param {String} language - language for the learning resource
* @param {String} sortBy - sortBy option for the learning resource
* @returns {json} Response consists of list of learning resources
*/

const learningResources = function (token, pageSize, pageNo, filters, sortBy) {
    return new Promise(async (resolve, reject) => {
        try {

            let learningResourceApiUrl = CONSTANTS.endpoints.GET_RESOURCES_LIST
            learningResourceApiUrl = learningResourceApiUrl + "?limit=" + pageSize + "&page=" + pageNo + "&sortBy=" + sortBy;
            let mappedFilterList = {};
            let filterKeys = Object.keys(filters);
            
            if (filterKeys && filterKeys.length > 0) {
                filterKeys.map(filter => {
                    let mappingType = "";
                   
                    if (filter == "category") {
                        mappingType = "board"
                    } else if (filter == "subCategory") {
                        mappingType = "gradeLevel"
                    } else if (filter == "topic") {
                        mappingType = "medium"
                    } else if (filter == "language") {
                        mappingType = "subject"
                    }
                    mappedFilterList[mappingType] = filters[filter];
                });
            }

            let requestBody = {
                filters: mappedFilterList
            }
            
            let response = await callToSunbird("POST", learningResourceApiUrl, token, requestBody);
            return resolve(response);
        } catch (error) {
            reject({ message: CONSTANTS.apiResponses.SUNBIRD_SERVICE_DOWN });
        }


    })
}

/**
  * Get filters of learning resources
  * @function
  * @name filtersList
  * @param token - Logged in user token.
  * @returns {JSON} - consist filters list of learning resources
*/
const filtersList = function (token) {
    return new Promise(async (resolve, reject) => {
        try {
            const categoryListApiUrl = CONSTANTS.endpoints.GET_CATEGORY_LIST;
            let response = await callToSunbird("GET", categoryListApiUrl, token);
            return resolve(JSON.parse(response));
        } catch (error) {

            reject({ message: CONSTANTS.apiResponses.SUNBIRD_SERVICE_DOWN });
        }
    })
}

/**
  * to Varify token is valid or not
  * @function
  * @name verifyToken
  * @param token - user token for verification 
  * @returns {JSON} - consist of token verification details
*/
const verifyToken = function (token) {
    return new Promise(async (resolve, reject) => {
        try {
            const verifyTokenEndpoint = CONSTANTS.endpoints.VERIFY_TOKEN;

            let requestBody = {
                token: token
            }
            let response = await callToSunbird("POST", verifyTokenEndpoint, "",requestBody);
            return resolve(response);
        } catch (error) {

            reject({ message: CONSTANTS.apiResponses.SUNBIRD_SERVICE_DOWN });
        }
    })
}


module.exports = {
    learningResources: learningResources,
    filtersList: filtersList,
    verifyToken: verifyToken
};