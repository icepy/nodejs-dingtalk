const DTClient = require('./lib/dingtalk');
const installTransport = require('./lib/transport');
const installOAPIS = require('./lib/o_apis');
const installSNSAPIS = require('./lib/sns_apis');

installTransport(DTClient);
installOAPIS(DTClient);
installSNSAPIS(DTClient);

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