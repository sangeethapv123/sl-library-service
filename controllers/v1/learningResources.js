/**
 * name : learningResources.js
 * author : Rakesh Kumar
 * created-date : 24-Jun-2020
 * Description : Related to learning resources
 */

const learningResourceshelper = require(MODULES_BASE_PATH + "/learningResources/helper.js");

/**
   * LearningResources
   * @class
*/
module.exports = class LearningResources {

  static get name() {
    return "learningResources";
  }

  /**
  * @api {get} /library/api/v1/learningResources/all?limit=10&page=1&subCategory=class 1&category=cbse&&topic=mathematics
  * To get learning resources
  * @apiVersion 1.0.0
  * @apiGroup Learning Resources
  * @apiHeader {String} X-authenticated-user-token Authenticity token
  * @apiSampleRequest /library/api/v1/learningResources/all?limit=10&page=1&subCategory=class 1&category=cbse&&topic=mathematics 
  * @apiUse successBody
  * @apiUse errorBody
  * @apiParamExample {json} Response:
 {
    "message": "Learning resources fetched successfully",
    "status": 200,
    "result": [
        {
            "title": "Recently Added",
            "type": "card",
            "description": "Recently added",
            "imageurl": "https:ssdsada.png",
            "Totalcount": 4932,
            "resources": [
                {
                    "redirect_url": "https://dev.shikshalokam.org/resources/play/content/do_2130263126179512321922",
                    "header": "TLE-GEN-HK-002-CPA001",
                    "description": "Generic Housekeeping Public Area Cleaning Training",
                    "time": "2020-05-22T05:40:51.995+0000"
                },
                {
                    "redirect_url": "https://dev.shikshalokam.org/resources/play/content/do_2130262869306327041917",
                    "header": "TLE-GEN-HK-001-HHS001",
                    "description": "Generic Housekeeping Training Content for HHS",
                    "time": "2020-05-22T04:48:36.336+0000"
                },
                {
                    "redirect_url": "https://dev.shikshalokam.org/resources/play/content/do_2129746320902225921869",
                    "header": "Meet Harshitha, an Electronics Mechanic",
                    "time": "2020-03-10T05:16:33.826+0000"
                }
            ]
        },
        {
            "title": "Most Popular",
            "type": "card",
            "description": "Most popular",
            "imageurl": "https:ssdsada.png",
            "Totalcount": 4932,
            "resources": [
                {
                    "redirect_url": "https://dev.shikshalokam.org/resources/play/content/domain_8862",
                    "header": "वह हँस दिया",
                    "description": "क्‍या आपको दौड़ लगाने में मज़ा आता है? हमारी कहानी के हिरण को भी यह बहुत भाता है। इस कहानी को पढ़े और सुने। कहानी उन बच्चों के लिए है जो अभी वाक्य  पढ़ना शुरू कर रहे हैं।  ",
                    "rating": 56,
                    "time": "2016-06-14T05:13:28.192+0000"
                },
                {
                    "redirect_url": "https://dev.shikshalokam.org/resources/play/content/do_20044452",
                    "header": "चाँद और तारे",
                    "description": "चाँद और तारे",
                    "rating": 17,
                    "time": "2016-08-03T09:02:30.343+0000"
                },
                {
                    "redirect_url": "https://dev.shikshalokam.org/resources/play/content/do_20043292",
                    "header": "zoo1test2",
                    "description": "zoo1test2",
                    "rating": 13,
                    "time": "2016-07-14T08:50:43.177+0000"
                }
            ]
        }
    ]
}
  **/

  /**
   * To get list of resources
   * @method
   * @name list
   * @param  {req}  - requested data.
   * @returns {json} Response consists list of learning resource
  */

  all(req) {
    return new Promise(async (resolve, reject) => {
      try {

        let response = await learningResourceshelper.all(
          req.userDetails.userToken,
          req.body.pageSize,
          req.body.pageNo,
          req.body.category ? req.body.category : "",
          req.body.subCategory ? req.body.subCategory : "",
          req.body.topic ? req.body.topic : "",
          req.body.language ? req.body.language : "" 
          );


        return resolve(response);

      } catch (error) {

        return reject({
          status:
            error.status ||
            httpStatusCode["internal_server_error"].status,

          message:
            error.message ||
            httpStatusCode["internal_server_error"].message
        });
      }
    });
  }


    /**
  * @api {get} /library/api/v1/learningResources/popular?limit=10&page=1
  * To get popular learning resources
  * @apiVersion 1.0.0
  * @apiGroup Learning Resources
  * @apiHeader {String} X-authenticated-user-token Authenticity token
  * @apiSampleRequest /library/api/v1/learningResources/popular?limit=10&page=1&subCategory=class 1&category=cbse&&topic=mathematics 
  * @apiUse successBody
  * @apiUse errorBody
  * @apiParamExample {json} Response:
 {
    "message": "Learning resources found successfully",
    "status": 200,
    "result": {
        "title": "Most Popular",
        "type": "card",
        "description": "Most popular",
        "imageurl": "https:ssdsada.png",
        "Totalcount": 4932,
        "resources": [
            {
                "redirect_url": "https://dev.shikshalokam.org/resources/play/content/do_2125493655674306561553",
                "header": "3087-21",
                "description": "desc",
                "time": "2018-07-18T09:09:36.492+0000"
            }
        ]
    }
}
  **/

  /**
   * To get list of popular learning resources
   * @method
   * @name list
   * @param  {req}  - requested data.
   * @returns {json} Response consists list of learning resource
  */

 popular(req) {
  return new Promise(async (resolve, reject) => {
    try {

      let response = await learningResourceshelper.popular(
        req.userDetails.userToken,
        req.pageSize,
        req.pageNo,
        req.query.category ? req.query.category : "",
        req.query.subCategory ? req.query.subCategory : "",
        req.query.topic ? req.query.topic : "",
        req.query.language ? req.query.language : "" 
        );


      return resolve(response);

    } catch (error) {

      return reject({
        status:
          error.status ||
          httpStatusCode["internal_server_error"].status,

        message:
          error.message ||
          httpStatusCode["internal_server_error"].message
      });
    }
  });
}


    /**
  * @api {get} /library/api/v1/learningResources/recentlyAdded?limit=10&page=1&subCategory=class 1&category=cbse&&topic=mathematics
  * To get recently added learning resources
  * @apiVersion 1.0.0
  * @apiGroup Learning Resources
  * @apiHeader {String} X-authenticated-user-token Authenticity token
  * @apiSampleRequest /library/api/v1/learningResources/recentlyAdded?limit=10&page=1&subCategory=class 1&category=cbse&&topic=mathematics 
  * @apiUse successBody
  * @apiUse errorBody
  * @apiParamExample {json} Response:
 {
    "message": "Learning resources fetched successfully",
    "status": 200,
    "result": [
        {
            "title": "Recently Added",
            "type": "card",
            "description": "Recently added",
            "imageurl": "https:ssdsada.png",
            "Totalcount": 4932,
            "resources": [
                {
                    "redirect_url": "https://dev.shikshalokam.org/resources/play/content/do_2130263126179512321922",
                    "header": "TLE-GEN-HK-002-CPA001",
                    "description": "Generic Housekeeping Public Area Cleaning Training",
                    "time": "2020-05-22T05:40:51.995+0000"
                },
                {
                    "redirect_url": "https://dev.shikshalokam.org/resources/play/content/do_2130262869306327041917",
                    "header": "TLE-GEN-HK-001-HHS001",
                    "description": "Generic Housekeeping Training Content for HHS",
                    "time": "2020-05-22T04:48:36.336+0000"
                },
                {
                    "redirect_url": "https://dev.shikshalokam.org/resources/play/content/do_2129746320902225921869",
                    "header": "Meet Harshitha, an Electronics Mechanic",
                    "time": "2020-03-10T05:16:33.826+0000"
                }
            ]
        },
        {
            "title": "Most Popular",
            "type": "card",
            "description": "Most popular",
            "imageurl": "https:ssdsada.png",
            "Totalcount": 4932,
            "resources": [
                {
                    "redirect_url": "https://dev.shikshalokam.org/resources/play/content/domain_8862",
                    "header": "वह हँस दिया",
                    "description": "क्‍या आपको दौड़ लगाने में मज़ा आता है? हमारी कहानी के हिरण को भी यह बहुत भाता है। इस कहानी को पढ़े और सुने। कहानी उन बच्चों के लिए है जो अभी वाक्य  पढ़ना शुरू कर रहे हैं।  ",
                    "rating": 56,
                    "time": "2016-06-14T05:13:28.192+0000"
                },
                {
                    "redirect_url": "https://dev.shikshalokam.org/resources/play/content/do_20044452",
                    "header": "चाँद और तारे",
                    "description": "चाँद और तारे",
                    "rating": 17,
                    "time": "2016-08-03T09:02:30.343+0000"
                },
                {
                    "redirect_url": "https://dev.shikshalokam.org/resources/play/content/do_20043292",
                    "header": "zoo1test2",
                    "description": "zoo1test2",
                    "rating": 13,
                    "time": "2016-07-14T08:50:43.177+0000"
                }
            ]
        }
    ]
}
  **/

  /**
   * To get list of recently added learning resources
   * @method
   * @name list
   * @param  {req}  - requested data.
   * @returns {json} Response consists list of learning resource
  */

 recentlyAdded(req) {
  return new Promise(async (resolve, reject) => {
    try {

      
      let response = await learningResourceshelper.recentlyAdded(
        req.userDetails.userToken,
        req.pageSize,
        req.pageNo,
        req.query.category ? req.query.category : "",
        req.query.subCategory ? req.query.subCategory : "",
        req.query.topic ? req.query.topic : "",
        req.query.language ? req.query.language : "" 
        );
      return resolve(response);

    } catch (error) {

      return reject({
        status:
          error.status ||
          httpStatusCode["internal_server_error"].status,

        message:
          error.message ||
          httpStatusCode["internal_server_error"].message
      });
    }
  });
}

    /**
  * @api {get} /library/api/v1/learningResources/filtersList 
  * To get filters list of learning resources
  * @apiVersion 1.0.0
  * @apiGroup Learning Resources
  * @apiHeader {String} X-authenticated-user-token Authenticity token
  * @apiSampleRequest /library/api/v1/learningResources/filtersList
  * @apiUse successBody
  * @apiUse errorBody
  * @apiParamExample {json} Response:
  {
    "message": "filters fetched successfully",
    "status": 200,
    "result": [
        {
            "field": "category",
            "value": "",
            "visible": true,
            "editable": true,
            "label": "Category",
            "input": "select",
            "validation": [],
            "options": [
                {
                    "label": "sldev",
                    "value": "sldev"
                }
            ]
        },
        {
            "field": "language",
            "value": "",
            "visible": true,
            "editable": true,
            "label": "Language",
            "input": "select",
            "validation": [],
            "options": [
                {
                    "label": "English",
                    "value": "english"
                },
                {
                    "label": "Tamil",
                    "value": "tamil"
                },
                {
                    "label": "Hindi",
                    "value": "hindi"
                },
                {
                    "label": "Kannada",
                    "value": "kannada"
                }
            ]
        },
        {
            "field": "subCategory",
            "value": "",
            "visible": true,
            "editable": true,
            "label": "Sub Category",
            "input": "select",
            "validation": [],
            "options": [
                {
                    "label": "Class1",
                    "value": "class1"
                }
            ]
        },
        {
            "field": "topic",
            "value": "",
            "visible": true,
            "editable": true,
            "label": "Topic",
            "input": "select",
            "validation": [],
            "options": [
                {
                    "label": "Science",
                    "value": "science"
                }
            ]
        }
    ]
}
  **/

  /**
   * To get filters list
   * @method
   * @name filtersList
   * @param  {req}  - requested data.
   * @returns {json} Response consists list of learning resource
  */

  filtersList(req) {
    return new Promise(async (resolve, reject) => {
      try {

        let response = await learningResourceshelper.filtersList(req.userDetails.userToken);
        return resolve(response);

      } catch (error) {

        return reject({
          status:
            error.status ||
            httpStatusCode["internal_server_error"].status,

          message:
            error.message ||
            httpStatusCode["internal_server_error"].message
        });
      }
    });
  }
}