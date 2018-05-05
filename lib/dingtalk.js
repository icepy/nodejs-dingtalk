const Cache = require('./cache');
const transport = require('./transport');
const util = require('./util');

const { httpRPC } = transport;
const { sign } = util;

function DTClient(devType, config){
  this.config = config;
  this.devType = devType;
  this.accessToken = '';
  this.ticket = '';
  this.snsAccessToken = '';
  this.accessTokenCache = new Cache('.' + devType + '_access_token_file')
  this.snsAccessTokenCache = new Cache('.' + devType + '_sns_access_token_file')
  this.ticketCache = new Cache('.' + devType + '_ticket_file')
}

/**
 * 获取企业access_token
 */
DTClient.prototype.refreshCompanyAccessToken = async function(){
  const result = await this.accessTokenCache.getMeta();
  if (result.success){
    const data = result.data;
    this.accessToken =  data['access_token'];
  } else {
    const params = {
      'corpid': this.config.CorpID,
      'corpsecret': this.config.CorpSecret,
    }
    const httpResult = await this.httpRPC('gettoken', params);
    const data = httpResult.data;
    if (data.errcode === 0){
      const expires = data['expires_in'];
      const access_token = data['access_token'];
      const created = new Date().getTime();
      const cacheFileResult = await this.accessTokenCache.setMeta({ 
        expires, 
        created, 
        'access_token': access_token 
      });
      this.accessToken = access_token;
      if (!cacheFileResult.success){
        // TODO 没有缓存写入文件成功
        console.log(cacheFileResult)
      }
    }
  }
}

/**
 * 获取Ticket
 */
DTClient.prototype.getJSAPITicket = async function(){
  const result = await this.ticketCache.getMeta();
  if (result.success){
    const data = result.data;
    this.ticket = data['ticket'];
  } else {
    const httpResult = await this.httpRPC('get_jsapi_ticket');
    const data = httpResult.data;
    if (data.errcode === 0){
      const expires = data['expires_in'];
      const ticket = data['ticket'];
      const created = new Date().getTime();
      const cacheFileResult = this.ticketCache.setMeta({
        expires,
        ticket,
        created
      });
      this.ticket = ticket;
      if (!cacheFileResult.success){
        console.log(cacheFileResult)
      }
    }
  }
}

/**
 * 获取第三方登录sns_access_token
 */
DTClient.prototype.refreshSNSAccessToken = async function(){
  const result = await this.snsAccessTokenCache.getMeta();
  if (result.success){
    const data = result.data;
    this.snsAccessToken = data['access_token'];
  } else {
    const params = {
      'appid': this.config.SNSAppID,
      'appsecret': this.config.SNSSecret,
    }
    const httpResult = await this.httpSNS('sns/gettoken', params);
    const data = httpResult.data;
    if (data.errcode === 0){
      const expires = data['expires_in'];
      const access_token = data['access_token'];
      const created = new Date().getTime();
      const cacheFileResult = await this.snsAccessTokenCache.setMeta({ 
        expires, 
        created, 
        'access_token': access_token 
      });
      this.snsAccessToken = access_token;
      if (!cacheFileResult.success){
        // TODO 没有缓存写入文件成功
        console.log(cacheFileResult)
      }
    }
  }
}

/**
 * 配置config信息
 * @param {*} nonceStr 
 * @param {*} timestamp 
 * @param {*} url 
 */
DTClient.prototype.getConfig = async function (nonceStr, timestamp, url){
  await this.getJSAPITicket()
  const config = {
    "url": url,
		"nonceStr": nonceStr,
		"agentId": this.config.AgentID,
		"timeStamp": timestamp,
		"corpId": this.config.CorpID,
		"ticket":  this.ticket,
		"signature": sign(this.ticket, nonceStr, timestamp, url),
  }
  return JSON.stringify(config)
}

module.exports = DTClient