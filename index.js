var express = require('ExpressLite');
var app = express();

app.get('/', function(req, res){
  res.send('Hello, I am listening');
  res.end();
});

app.get('/about', function(req, res){
  res.send('Hello, I am about');
  res.end();
});

app.get('/param:id', function(req, res){
  res.send('Hello, I am with param');
  res.end();
});

app.listen(8080,'localhost');
