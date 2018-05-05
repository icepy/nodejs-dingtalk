const batchApis = [
  {
    path: 'user/getuserinfo',
    methodSignature: 'UserIdByCode'
  },
  {
    path: 'user/getUseridByUnionid',
    methodSignature: 'UserIdByUnionId'
  },
  {
    path: 'user/get',
    methodSignature: 'UserInfoByUserId'
  },
  {
    path: 'user/simplelist',
    methodSignature: 'UserSimpleList'
  },
  {
    path: 'user/list',
    methodSignature: 'UserList'
  },
  {
    path: 'user/get_admin',
    methodSignature: 'UserAdminList'
  },
  {
    path: 'user/can_access_microap',
    methodSignature: 'UserCanAccessMicroapp'
  },
  {
    path: 'user/create',
    methodSignature: 'UserCreate'
  },
  {
    path: 'user/update',
    methodSignature: 'UserUpdate'
  },
  {
    path: 'user/delete',
    methodSignature: 'UserDelete'
  },
  {
    path: 'user/batchdelete',
    methodSignature: 'UserBatchDelete'
  },
  {
    path: 'user/get_org_user_count',
    methodSignature: 'UserGetOrgUserCount'
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