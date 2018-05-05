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
            console.log('requestUrl -> ', requestUrl);
            console.log('result -> ', res.data);
            resolve(res);
          }).catch((e) => {
            reject(e)
          })
        }
      }
    })
  }
  DTClient.prototype.httpRPC = function(path, params, requestData){
    if (this.accessToken !== ''){
      if (!params){
        params = {}
      } 
      if (params['access_token'] === ''){
        params['access_token'] = this.accessToken;
      }
    }
    return this.httpRequest(TAG.OAPI, path, params, requestData)
  }
  DTClient.prototype.httpSNS = function(path, params, requestData){
    if (this.snsAccessToken !== '' && path !== 'sns/getuserinfo'){
      if (!params){
        params = {}
      } 
      if (params['access_token'] === ''){
        params['access_token'] = this.snsAccessToken;
      }
    }
    return this.httpRequest(TAG.OAPI, path, params, requestData)
  }
}

module.exports = installTransport