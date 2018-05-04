const querystring = require('querystring');
const axios = require('axios');

const OAPIURL = 'https://oapi.dingtalk.com/'
const TOPAPIURL = 'https://eco.taobao.com/router/rest'
const TAG = {
  OAPI: 'oapi',
  TAPI: 'tapi',
}

function installTransport(DTClient){
  DTClient.prototype.httpRequest = function(tagType, path, params, requestData){
    return new Promise((resolve, reject) => {
      let requestUrl;
      if (tagType === TAG.OAPI){
        requestUrl = OAPIURL + path
        if (requestData){
  
        } else {
          axios({
            method: 'GET',
            url: requestUrl,
            params: params
          }).then((res) => {
            resolve(res);
          }).catch((e) => {
            reject(e)
          })
        }
      }
    })
  }
  DTClient.prototype.httpRPC = function(path, params, requestData){
    if (this.AccessToken !== ''){
      if (!params){
        params = {}
      } 
      if (params['access_token'] === ''){
        params['access_token'] = this.AccessToken;
      }
    }
    return httpRequest(TAG.OAPI, path, params, requestData)
  }
  DTClient.prototype.httpSNS = function(path, params, requestData){
    if (this.SNSAccessToken !== '' && path !== 'sns/getuserinfo'){
      if (!params){
        params = {}
      } 
      if (params['access_token'] === ''){
        params['access_token'] = this.SNSAccessToken;
      }
    }
    return httpRequest(TAG.OAPI, path, params, requestData)
  }
}

module.exports = installTransport