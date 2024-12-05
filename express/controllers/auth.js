const User = require("../models/user");
const bcrypt = require('bcryptjs');
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const sendgridTransport = require('nodemailer-sendgrid-transport');

const { validationResult } = require("express-validator");

const secrets = require("../secrets");

const transporter = nodemailer.createTransport(sendgridTransport({
    auth: {
      api_key: secrets.SEND_GRID_API_KEY2,
    }
}));

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
    oldInput: {
      email: '',
      password: '',
      confirmPassword: '',
    },
    validationErrors: [],
  });
};

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log('errors.array', errors.array());

    return res.status(422).render('auth/signup', {
      path: '/signup',
      pageTitle: 'Signup',
      errorMessage: errors.array()[0].msg,
      oldInput: {
        email,
        password,
        confirmPassword,
      },
      validationErrors: errors.array(),
    });
  }

  User.findOne({ email: email })
    .then(userDoc => {
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
          return transporter.sendMail({
            to: email,
            from: 'mylovelymail@yandex.ru',
            subject: 'Signup succeeded',
            html: `<h1>You successfully signed up</h1>`
          });
        });
    })
    .catch(err => {
      console.log('postSignup', err);
    });
};

exports.getReset = (req, res, next) => {
  const message = req.flash('error');
  const errorMessage = message.length > 0 ? message[0] : null;

  res.render('auth/reset', {
    path: '/reset',
    pageTitle: 'Reset',
    errorMessage,
  });
};

exports.postReset = (req, res, next) => {
  const email = req.body.email;
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log('err',err);
      return res.redirect('/reset');
    }
    const token = buffer.toString('hex');

    User.findOne({email})
      .then(user => {
        if (!user) {
          req.flash('error', 'No account with email was found');
          return res.redirect('/reset');
        }
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000;
        return user.save();
      })
      .then(result => {
        console.log(`Link: http://localhost:3000/reset/${token}`);

        return transporter.sendMail({
          to: email,
          from: 'mylovelymail@yandex.ru',
          subject: 'Password reset',
          html: `
            <p>You request a password reset</p>
            <p>Click this <a href="http://localhost:3000/reset/${token}">link</a> to set a new password</p>
          `
        });
      })
      .catch(err => console.log('postReset err', err));
  })
};

exports.getNewPassword = (req, res, next) => {
  const token = req.params.token;
  User.findOne({
    resetToken: token,
    resetTokenExpiration: {$gt: Date.now()}
  })
    .then(user => {
      console.log('user',user);
      const message = req.flash('error');
      const errorMessage = message.length > 0 ? message[0] : null;

      res.render('auth/new-password', {
        path: '/new-password',
        pageTitle: 'New Password',
        errorMessage,
        userId: user._id.toString(),
        passwordToken: token,
      });
    })
};

exports.postNewPassword = (req, res, next) => {
  const newPassword = req.body.password;
  const userId = req.body.userId;
  const passwordToken = req.body.passwordToken;
  let resetUser;

  User.findOne({
    resetToken: passwordToken,
    resetTokenExpiration: {$gt: Date.now()},
    _id: userId,
  })
    .then(user => {
      resetUser = user;
      return bcrypt.hash(newPassword, 12);
    })
    .then(hashedPassword => {
      resetUser.password = hashedPassword;
      resetUser.resetToken = undefined;
      resetUser.resetTokenExpiration = undefined;
      return resetUser.save();
    })
    .then(result => {
      return res.redirect('/login');
    })
    .catch(err => console.log('postNewPassword', err));

}