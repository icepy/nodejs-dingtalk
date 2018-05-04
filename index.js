const DTClient = require('./lib/dingtalk');
const installTransport = require('./lib/transport');

installTransport(DTClient);

function createInstall(devType, config){
  return new DTClient(devType, config);
}

module.exports = {
  createDTPersonalMiniClient(config){
    return createInstall('personalMini', config)
  },
  createDTCompanyClient(config){
    return createInstall('company', config)
  },
  createDTISVClient(config){
    return createInstall('isv', config)
  }
}