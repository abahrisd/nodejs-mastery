const express = require('express');
const bodyParser = require('body-parser');
const appController = require('./controllers/error');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const path = require("path");

const mongoConnect = require("./util/database").mongoConnect;
const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRoutes.routes);
app.use(shopRoutes);

app.use(appController.get404);

mongoConnect(client => {
  console.log('client',client);

  app.listen(3000, () => console.log('server started'));
});

