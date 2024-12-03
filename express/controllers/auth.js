const User = require("../models/user");
const bcrypt = require('bcryptjs');

exports.getLogin = (req, res, next) => {
  const message = req.flash('error');
  const errorMessage = message.length > 0 ? message[0] : null;

  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    errorMessage,
  });
}

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({email})
    .then(user => {
      console.log('postLogin user',user);

      if (!user) {
        req.flash('error', 'Invalid email or password.');
        return res.redirect('/login');
      }

      return bcrypt.compare(password, user.password)
        .then(doMatch => {
          if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.user = user;

            return req.session.save(err => {
              console.log('err', err);
              res.redirect('/');
            });
          }

          return res.redirect('/login');
        })
        .catch(err => console.log(err));
    });
}

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    // sessions is not available here anymore
    console.log('err', err);
    res.redirect('/');
  });
}

exports.getSignup = (req, res, next) => {
  const message = req.flash('error');
  const errorMessage = message.length > 0 ? message[0] : null;

  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    errorMessage,
  });
};

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  // const confirmPassword = req.body.confirmPassword;

  User.findOne({ email: email })
    .then(userDoc => {
      if (userDoc) {
        req.flash('error', 'Email already exists.');
        return res.redirect('/signup');
      }
      return bcrypt
        .hash(password, 12)
        .then(hashedPassword => {
          const user = new User({
            email: email,
            password: hashedPassword,
            cart: { items: [] }
          });
          return user.save();
        })
        .then(result => {
          res.redirect('/login');
        });
    })
    .catch(err => {
      console.log('postSignup', err);
    });
};
