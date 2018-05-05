const crypto = require('crypto');
const querystring = require('querystring');
const url = require('url');

function success(data){
  return {
    success: true,
    data
  }
}

function error(err){
  return {
    success: false,
    err
  }
}

function sign(params) {
  const origUrl = params.signedUrl;
  let origUrlObj =  url.parse(origUrl);
  delete origUrlObj['hash'];
  const newUrl = url.format(origUrlObj);
  const plain = 'jsapi_ticket=' + params.ticket +
      '&noncestr=' + params.nonceStr +
      '&timestamp=' + params.timeStamp +
      '&url=' + newUrl;
  const sha1 = crypto.createHash('sha1');
  sha1.update(plain, 'utf8');
  const signature = sha1.digest('hex');
  return signature;
}

module.exports = {
  success,
  error,
  sign
}