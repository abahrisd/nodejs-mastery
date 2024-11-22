const express = require('express');

const router = express.Router();

router.get('/add-product', (req, res, next) => {
  console.log('in the middleware',);
  res.send(`
  <form action="/add-product" method="post">
    <input type="text" name="title">
    <button type="submit">Submit</button>
    </form>
  `);
});

router.post('/add-product', (req, res, next) => {
  console.log('req.body',req.body);
  res.redirect('/');
});

module.exports = router;