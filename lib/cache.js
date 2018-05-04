const fs = require('fs')
const path = require('path')

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

class Cache{
  constructor(fileName){
    this.FilePath = path.resolve(process.cwd(), fileName);
  }
  async getMeta(){
    return await this.readFile()
  }
  async setMeta(data){
    return await this.createFile(data)
  }
  createFile(data){
    return new Promise((resolve, reject) => {
      fs.open(this.FilePath, 'w', (err, b) => {
        if (err){
          reject(error(err))
        } else {
          fs.write(b, JSON.stringify(data), 'utf8', (err) => {
            if (err){
              reject(error(err))
            } else {
              fs.closeSync(b);
              resolve(success(1))
            }
          })
        }
      })
    }).then((res) => {
      return res
    }).catch((err) => {
      return err
    })
  }
  readFile(){
    return new Promise((resolve, reject) => {
      fs.readFile(this.FilePath, (err, data) => {
        if (err){
          reject(error(err))
        } else {
          let json;
          try{
            json = JSON.parse(data)
          } catch(e){
            reject(error(e))
          }
          if (json){
            const created = json.created;
            const expires = json.expires;
            const now = new Date().getTime()
            if (now > created + ((expires * 1000) - (60*1000))){
              reject(error('缓存时间即将过期'))
            } else {
              resolve(success(json))
            }
          } 
        }
      })
    }).then((res) => {
      return res
    }).catch((err) => {
      return err
    })
  }
}

module.exports = Cache;