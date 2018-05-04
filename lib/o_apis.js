const batchApis = [
  {
    path: 'user/getuserinfo',
    methodSignature: 'UserIdByCode'
  },
  {
    path: 'user/getUseridByUnionid',
    methodSignature: 'UserIdByUnionId'
  }
]

function installOAPIS(DTClient){
  batchApis.forEach(function(item){
    DTClient.prototype[item.methodSignature] = async function(params, requestData){
      return await this.httpRPC(item.path, params, requestData);
    }
  })
}

module.exports = installOAPIS