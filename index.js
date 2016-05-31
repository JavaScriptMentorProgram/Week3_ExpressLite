import ExpressLite from './ExpressLite';

let app = new ExpressLite();

app.get('/home', (req, res) => {
  res.end('Hello');
});
app.get('/home/users', (req, res) => {
  res.end('I am /home/users');
});

app.get('/users/:id', (req, res) => {
  res.end('With params');
});

app.post('/post/Claire/123', (req, res) => {
  res.end("I am a post, /post/claire/123");
});

app.post('/post/Tom/456', (req, res) => {
  res.end("I am a post, post/Tom/456");
})

app.put('/put/Claire/123', (req, res) => {
  res.end("I am a put, /put/claire/123");
});

app.put('/put/Tom/456', (req, res) => {
  res.end("I am a put, put/Tom/456");
})

app.delete('/delete/Claire/123', (req, res) => {
  res.end("I am a delete, /delete/claire/123");
});

app.delete('/delete/Tom/456', (req, res) => {
  res.end("I am a delete, delete/Tom/456");
})

app.listen(8080,'localhost');
