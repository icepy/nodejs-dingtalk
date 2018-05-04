const batchApis = [
  {
    path: 'sns/get_persistent_code',
    methodSignature: 'SNSGetPersistentCode'
  },
  {
    path: 'sns/get_sns_token',
    methodSignature: 'SNSGetSNSToken'
  },
  {
    path: 'sns/getuserinfo',
    methodSignature: 'SNSGetUserInfo'
  }
]

function installSNSAPIS(DTClient){
  batchApis.forEach(function(item){
    DTClient.prototype[item.methodSignature] = async function(params, requestData){
      return await this.httpSNS(item.path, params, requestData);
    }
  })
}

module.exports = installSNSAPIS