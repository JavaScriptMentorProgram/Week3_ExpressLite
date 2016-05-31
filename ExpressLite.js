var http = require('http');

export default class ExpressLite {

  constructor(){
    this.app =  http.createServer();
    this.stack = {get: {}, post:{}, put:{}, delete:{}};
    this.middleware = {global:[], specific: {} };
    this.middlewarePosition = 0;
  }

  use(...args){
    if(args.length == 1){
      this.middleware.global.push(args[0]);
    }else{
      let pathStrArray = Object.keys(this.middleware.specific);
      if(this.isRepeat(args[0], pathStrArray)){
        this.middleware.specific[args[0]].push(args[1]);
        return ;
      }
      this.middleware.specific[args[0]] = [args[1]];
    }
  }

  get(pathStr, callback){
    let handlers = this.stack.get;
    let pathStrArray = Object.keys(handlers);
    if(this.isRepeat(pathStr, pathStrArray)){
      this.stack.get[pathStr].push(callback);
      return ;
    }
    this.stack.get[pathStr] = [callback];
  }

  post(pathStr, callback){
    let handlers = this.stack.post;
    let pathStrArray = Object.keys(handlers);
    if(this.isRepeat(pathStr, pathStrArray)){
      this.stack.post[pathStr].push(callback);
      return;
    }
    this.stack.post[pathStr] = [callback];
  }

  put(pathStr, callback){
    let handlers = this.stack.put;
    let pathStrArray = Object.keys(handlers);
    if(this.isRepeat(pathStr, pathStrArray)){
      this.stack.put[pathStr].push(callback);
      return;
    }
    this.stack.put[pathStr] = [callback];
  }

  delete(pathStr, callback){
    let handlers = this.stack.delete;
    let pathStrArray = Object.keys(handlers);
    if(this.isRepeat(pathStr, pathStrArray)){
      this.stack.delete[pathStr].push(callback);
      return;
    }
    this.stack.delete[pathStr] = [callback];
  }

  listen(port, addr){
    this.app.on('request', (req, res) => {
      this.middlewareExecution(req, res);
      let body = [];
      req.on('data', (chunk) => {
        body.push(chunk);
      }).on('end', () => {
        body = Buffer.concat(body).toString();
        req.body = body;
        let handler = this.matchHandlers(req);
        if(handler != null){
          handler(req, res);
        }
      });
    });
    this.app.listen(port, addr);
  }

  middlewareExecution(req, res){
    this.middlewarePosition = 0;
    //First, execute global middleware
    for(let i = 0; i < this.middleware.global.length; i++){
      if(this.middlewarePosition == i){
        this.middleware.global[i](req, res, this.next.bind(this));
      }
    }

    if(this.middlewarePosition == this.middleware.global.length){
      return ;
    }
  }

  matchHandlers(req){
    let method = req.method.toLowerCase();
    let handlers = this.stack[method];
    let pathStrArray = Object.keys(handlers);
    let matchedPath = this.matchPathStr(pathStrArray, req.url);
    if(matchedPath != null){
      return handlers[matchedPath][0];
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

  next(){
    this.middlewarePosition++;
  }
}