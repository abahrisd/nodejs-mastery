const express = require('express');

const router = express.Router();

const adminData = require('./admin');

router.get('/', (req, res, next) => {
  console.log('prods', adminData.products);
  res.render('shop', {
    prods: adminData.products,
    docTitle: 'Shop',
    path: '/',
  });
});

module.exports = router;