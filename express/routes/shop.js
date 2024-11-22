const express = require('express');

const router = express.Router();

const adminData = require('./admin');

router.get('/', (req, res, next) => {
  console.log('prods', adminData.products);
  const products = adminData.products;
  res.render('shop', {
    prods: products,
    hasProds: products.length > 0,
    docTitle: 'Shop',
    activeShop: true,
    pageTitle: 'Shop',
    path: '/',
    productCSS: true,
    formsCSS: true,
  });
});

module.exports = router;