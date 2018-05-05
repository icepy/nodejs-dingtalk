const http = require('http')
const DT = require('../index');

const env = process.env

const c = DT.createDTCompanyClient({
  CorpID: env['CorpId'],
  CorpSecret: env['CorpSecret'],
})
c.refreshCompanyAccessToken()
// http.createServer(function(req, res){

// }).listen(8083)