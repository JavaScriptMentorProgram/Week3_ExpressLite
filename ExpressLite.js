var http = require('http');
var url = require('url');

class ExpressLite {

  constructor(){
    this.app = null;
    this.stack = {get: {}, post: {}};
  },

  get(pathStr, fun){
    pathStrArray = Object.keys(handlers);
    if(isRepeat(pathStr, pathElementArray))
      return ;
    this.stack.get.push({pathStr: fun});
  },


  listen(port, addr){
    this.app = http.createServer(function(req, res){
      let handler = matchHandlers(req);
      if(handler != null){
        handler(req, res);
      }
    });
    this.app.listen(port, addr);
    return this.app;
  },

  matchHandlers(req){
    let url = req.url;
    let method = req.method.toLowerCase();
    let handlers = this.stack[method];
    let hanler = null;
    let pathStrArray = Object.keys(handlers);
    let matchedPath = matchPathStr(pathStrArray, req.url);
    if(matchedPath != null){
      return handlers[matchedPath];
    }else{
      return null;
    }
  }

  matchPathStr(pathStrArray, url){
    let pathElementArray = [];
    let urlElementArray = url.split('/');
    let matchedPath = null;
    for(let i = 0; i < pathStrArray.length; i++){
      if(pathStrArray[i] == url){
        matchedPath = pathStrArray[i];
        break;
      }

      pathElementArray = pathStrArray[i].split('/');

      if(pathElementArray.length != urlElementArray.length)
        continue;

      let matched = false;
      for(let j = 0; j < pathElementArray.length; j++){
        if(pathElementArray[j] == urlElementArray[j] || pathElementArray[j].indexOf(':') == -1)
          continue;
        else{
          break;
        }
        if(j == pathElementArray.length -1)
          matched = true;
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
        break；
      }
    }
    return repeat;
  }

}

exports.express = new ExpressLite();