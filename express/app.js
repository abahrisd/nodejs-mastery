const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require("path");
const session = require("express-session");
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash= require('connect-flash');
const multer = require('multer');

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

const fileStorage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'express/images');
  },
  filename: (req, file, callback) => {
    callback(null, Date.now() + '-' + file.originalname);
  }
});

const fileFilter = (req, file, callback) => {
  if ([
    'image/png',
    'image/jpg',
    'image/jpeg',
  ].includes(file.mimetype)) {
    callback(null, true);
  } else {
    callback(null, false);
  }
}

// handle file field with name image
app.use(multer({
  storage: fileStorage,
  fileFilter,
}).single('image'));

// set public dir
app.use(express.static(path.join(__dirname, 'public')));
app.use('/express/images', express.static(path.join(__dirname, 'images')));

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
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
})

app.use((req, res, next) => {

  // outside of promise we can just throw error, but inside - only with next
  // throw new Error('Sync dum!');

  if (!req.session.user) {
    return next();
  }

  User.findById(req.session.user._id)
    .then(user => {
      if (!user) {
        return next();
      }
      req.user = user;
      next();
    })
    .catch(err => {
      next(new Error(err))
    });
});

app.use('/admin', adminRoutes.routes);
app.use(shopRoutes);
app.use(authRoutes);

app.get('/500', appController.get500);
app.use(appController.get404);

app.use((error, req, res, next) => {
  console.log('error handler',error)
  res.redirect('/500');
})

mongoose.connect(MONGO_DB_URI, {
  dbName: 'shop'
})
  .then(result => {
    app.listen(3000, () => console.log('server started'));
  })
  .catch(err => console.log('connect err', err));


