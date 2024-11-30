const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const appController = require('./controllers/error');
// const User = require('./models/user');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const path = require("path");

// const mongoConnect = require("./util/database").mongoConnect;
const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// app.use((req, res, next) => {
//   User.findById('67484fd68533476e21da481e')
//     .then(user => {
//       req.user = new User(user);
//       next();
//     })
//     .catch(err => console.log('error user',err));
// });

app.use('/admin', adminRoutes.routes);
app.use(shopRoutes);

app.use(appController.get404);

mongoose.connect('mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000', {
  dbName: 'shop'
})
  .then(result => {
    // console.log('result',result);
    app.listen(3000, () => console.log('server started'));
  })
  .catch(err => console.log('connect err', err));


