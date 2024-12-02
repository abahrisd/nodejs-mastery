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
  // Expires= date of expire,
  // Max-Age= seconds before expiration
  // Domain
  // Secure - working only on https
  // HttpOnly - unable to edit with client javascript
  // res.setHeader('Set-Cookie', 'loggedIn=true; HttpOnly');
  req.session.isLoggedIn = true;

  res.redirect('/');
}