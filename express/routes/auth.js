const express = require('express');
const { check, body } = require("express-validator");

const User = require("../models/user");
const authController = require('../controllers/auth');

const router = express.Router();

router.get('/login', authController.getLogin);

router.post('/login',
  [
    body('email')
      .isEmail()
      .withMessage('Please enter a valid email')
      .normalizeEmail(),
    body('password', 'Password has to be valid')
      .isLength({ min: 5 })
      .isAlphanumeric()
      .trim()
  ],
  authController.postLogin);

router.post('/logout', authController.postLogout);

router.get('/signup', authController.getSignup);
router.post(
  '/signup',
  [
    check('email')
    .isEmail()
    .withMessage('Please enter valid email')
    .custom((value, {req}) => {
      return User.findOne({ email: value }).then(userDoc => {
        if (userDoc) {
          console.log('userDoc',userDoc);

          return Promise.reject('Email already exists. Please pick different one.');
        }
      })

      return true;
    })
    .normalizeEmail(),
    body('password', 'Please enter password with at least 5 symbols and only alphanumeric values')
      .isLength({ min: 5 })
      .isAlphanumeric()
      .trim(),
    body('confirmPassword')
      .custom((value, {req}) => {
        if (value !== req.body.password) {
          throw new Error('Passwords should be equal');
        }

        return true;
      })
      .trim(),
  ],
  authController.postSignup
);

router.get('/reset', authController.getReset);
router.post('/reset', authController.postReset);

router.get('/reset/:token', authController.getNewPassword);
router.post('/new-password', authController.postNewPassword);

module.exports = router;