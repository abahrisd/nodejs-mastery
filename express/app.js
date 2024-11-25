const express = require('express');
const bodyParser = require('body-parser');
const appController = require('./controllers/error');
const db = require('./util/database');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const path = require("path");

db.execute('SELECT * FROM products')
  .then(result => {
    console.log('db result', result[0], result[1]);
  }).catch((err) => {
    console.log('err', err);
  });

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRoutes.routes);
app.use(shopRoutes);

app.use(appController.get404);

app.listen(3000);