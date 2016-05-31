var http = require('http');

export default class ExpressLite {

  constructor(){
    this.app =  http.createServer();
    this.stack = {get: {}, post: {}};
  }

  get(pathStr, fun){
    let handlers = this.stack.get;
    let pathStrArray = Object.keys(handlers);
    if(this.isRepeat(pathStr, pathStrArray))
      return ;
    this.stack.get[pathStr] = fun;
  }

  listen(port, addr){
    this.app.on('request', (req, res) => {
      let handler = this.matchHandlers(req);
      // console.log(handler);
      if(handler != null){
        handler(req, res);
      }
    });
    this.app.listen(port, addr);
  }

  matchHandlers(req){
    let method = req.method.toLowerCase();
    let handlers = this.stack[method];
    let pathStrArray = Object.keys(handlers);
    let matchedPath = this.matchPathStr(pathStrArray, req.url);
    if(matchedPath != null){
      return handlers[matchedPath];
    }else{
      return null;
    }
  }

  matchPathStr(pathStrArray, url){
    let pathElementArray = [];
    let urlElementArray = url.split('/').slice(1);
    let matchedPath = null;
    for(let i = 0; i < pathStrArray.length; i++){
      if(pathStrArray[i] == url){
        matchedPath = pathStrArray[i];
        break;
      }

      pathElementArray = pathStrArray[i].split('/').slice(1);
      if(pathElementArray.length != urlElementArray.length){
        continue;
      }

      let matched = false;
      for(let j = 0; j < pathElementArray.length; j++){
        if(pathElementArray[j] == urlElementArray[j] || pathElementArray[j].indexOf(':') > -1){
          if(j == pathElementArray.length - 1){
            matched = true;
            break;
          }
          continue;
        }else{
          break;
        }
      }

      if(matched == true){
        matchedPath = pathStrArray[i];
        break;
      }
    }
    return matchedPath;
  }

  isRepeat(pathStr, pathStrArray){
    let repeat = false;
    for(let i = 0; i < pathStrArray; i++){
      if(pathStr == pathStrArray[i]){
        repeat = true;
        break;
      }
    }
    return repeat;
  }
}