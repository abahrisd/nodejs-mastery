const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require("path");
const session = require("express-session");
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash= require('connect-flash');

const appController = require('./controllers/error');
const User = require('./models/user');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

const MONGO_DB_URI = 'mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000';

// const mongoConnect = require("./util/database").mongoConnect;
const app = express();
const store = new MongoDBStore({
  uri: MONGO_DB_URI,
  databaseName: 'shop',
  collection: 'sessions',
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// always parse body
app.use(bodyParser.urlencoded({ extended: false }));

// set public dir
app.use(express.static(path.join(__dirname, 'public')));

// sessions
app.use(session({
  secret: 'my secret',
  resave: false,
  saveUninitialized: false,
  store,
}));
app.use(csrf());
app.use(flash());

app.use((req, res, next) => {

  if (!req.session.user) {
    return next();
  }

  User.findById(req.session.user._id)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log('error user',err));
});

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
})

app.use('/admin', adminRoutes.routes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(appController.get404);

mongoose.connect(MONGO_DB_URI, {
  dbName: 'shop'
})
  .then(result => {
    // User.findOne().then(user => {
    //   if (!user) {
    //     const user = new User({
    //       name: 'Samir',
    //       email: 'mail@mail.mail',
    //       cart: {items: []},
    //     });
    //     user.save();
    //   }
    // });

    app.listen(3000, () => console.log('server started'));
  })
  .catch(err => console.log('connect err', err));


