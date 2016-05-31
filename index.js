import ExpressLite from './ExpressLite';

let app = new ExpressLite();

app.get('/home', function(req, res){
  res.end('Hello');
});
app.get('/home/users', (req, res) => {
  res.end('I am /home/users');
});

app.get('/users/:id', function(req, res){
  res.end('With params');
});



app.listen(8080,'localhost');
