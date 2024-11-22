const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.use('/', (req, res, next) => {
  console.log('This always run',);
  next();
});

app.use('/add-product', (req, res, next) => {
  console.log('in the middleware',);
  res.send(`
  <form action="/product" method="post">
    <input type="text" name="title">
    <button type="submit">Submit</button>
    </form>
  `);
});

app.post('/product', (req, res, next) => {
  console.log('req.body',req.body);
  res.redirect('/');
});

app.use('/', (req, res, next) => {
  console.log('in another middleware',);
  res.send('<h1>Hello from express!</h1>')
});

app.listen(3000);