const Cache = require('./cache');
const transport = require('./transport');
const { httpRPC } = transport;

function DTClient(devType, config){
  this.Config = config;
  this.DevType = devType;
  this.AccessToken = '';
  this.SNSAccessToken = '';
  this.AccessTokenCache = new Cache('.' + devType + '_access_token_file')
  this.SNSAccessTokenCache = new Cache('.' + devType + '_sns_access_token_file')
}

/**
 * 获取企业access_token
 */
DTClient.prototype.refreshCompanyAccessToken = async function(){
  const result = await this.AccessTokenCache.getMeta();
  if (result.success){
    const data = result.data;
    this.AccessToken =  data['access_token'];
  } else {
    const params = {
      'corpid': this.Config.CorpID,
      'corpsecret': this.Config.CorpSecret,
    }
    const httpResult = await this.httpRPC('gettoken', params);
    const data = httpResult.data;
    if (data.errcode === 0){
      const expires = data['expires_in'];
      const access_token = data['access_token'];
      const created = new Date().getTime();
      const cacheFileResult = await this.AccessTokenCache.setMeta({ 
        expires, 
        created, 
        'access_token': access_token 
      });
      if (!cacheFileResult.success){
        // TODO 没有缓存写入文件成功
        console.log(cacheFileResult)
      }
    }
  }
}

/**
 * 获取第三方登录sns_access_token
 */
DTClient.prototype.refreshSNSAccessToken = async function(){
  const result = await this.SNSAccessTokenCache.getMeta()
  if (result.success){
    const data = result.data;
    this.SNSAccessToken = data['access_token']
  } else {
    const params = {
      'appid': this.Config.SNSAppID,
      'appsecret': this.Config.SNSSecret,
    }
    const httpResult = await this.httpSNS('sns/gettoken', params);
    const data = httpResult.data;
    if (data.errcode === 0){
      const expires = data['expires_in'];
      const access_token = data['access_token'];
      const created = new Date().getTime();
      const cacheFileResult = await this.SNSAccessTokenCache.setMeta({ 
        expires, 
        created, 
        'access_token': access_token 
      });
      if (!cacheFileResult.success){
        // TODO 没有缓存写入文件成功
        console.log(cacheFileResult)
      }
    }
  }
}

module.exports = DTClient