const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require("path");

const appController = require('./controllers/error');
const User = require('./models/user');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

// const mongoConnect = require("./util/database").mongoConnect;
const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  User.findById('674c2df8fa54117d2cf8e220')
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log('error user',err));
});

app.use('/admin', adminRoutes.routes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(appController.get404);

mongoose.connect('mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000', {
  dbName: 'shop'
})
  .then(result => {
    User.findOne().then(user => {
      if (!user) {
        const user = new User({
          name: 'Samir',
          email: 'mail@mail.mail',
          cart: {items: []},
        });
        user.save();
      }
    });

    app.listen(3000, () => console.log('server started'));
  })
  .catch(err => console.log('connect err', err));


