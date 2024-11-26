const express = require('express');
const bodyParser = require('body-parser');
const appController = require('./controllers/error');
const sequelize = require('./util/database');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const path = require("path");

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRoutes.routes);
app.use(shopRoutes);

app.use(appController.get404);

sequelize.sync().then(result => {
  console.log('result',result);
  app.listen(3000);
}).catch(err => {
  console.log('seq err',err);
})
