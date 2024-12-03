const User = require("../models/user");

exports.getLogin = (req, res, next) => {
  // const isLoggedIn = req.get('Cookie').split(';')[1].trim().split('=')[1];

  console.log('req.session.isLoggedIn',req.session.isLoggedIn);

  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    isAuthenticated: false,
  });
}

exports.postLogin = (req, res, next) => {
  User.findById('674c2df8fa54117d2cf8e220')
    .then(user => {
      console.log('postLogin user',user);
      req.session.isLoggedIn = true;
      req.session.user = user;
      req.session.save(err => {
        console.log('err', err);
        res.redirect('/');
      })
    });
}

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    // sessions is not available here anymore
    console.log('err', err)
    res.redirect('/');
  });
}