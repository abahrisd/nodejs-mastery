const Product = require('../models/product');
const Order = require('../models/order');
const path = require('path');
const fs = require('fs');
const {error500next} = require("../util/errors");

exports.getProducts = (req, res, next) => {
  Product
    .find()
    .then(products => {
      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'All products',
        path: '/products',
      });
    })
    .catch(err => {
      return error500next(err, next);
    });
}

exports.getProduct = (req, res, next) => {
  const productId = req.params.productId;

  Product.findById(productId)
    .then(product => {
      console.log('product',product);

      res.render('shop/product-detail', {
        product: product,
        pageTitle: 'Product',
        path: '/products/' + productId,
      })
    })
    .catch(err => {
      return error500next(err, next);
    });
}

exports.getIndex = (req, res, next) => {
  Product
    .find()
    .then(products => {
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/',
      })
    })
    .catch(err => {
      return error500next(err, next);
    });
}

exports.getCart = (req, res, next) => {
  req.user
    .populate('cart.items.productId')
    .then(user => {
      const products = user.cart.items;
      console.log('getCart products',products);

      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Shop',
        products,
      });
    })
    .catch(err => {
      return error500next(err, next);
    });
}

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;

  Product.findById(prodId)
    .then(product => {
      console.log('product cart', {product, user: req.user});

      return req.user.addToCart(product);
    })
    .then(result => {
      console.log('postCart result', result);
      res.redirect(`/cart`);
    })
    .catch(err => {
      return error500next(err, next);
    });
}

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;

  req.user.removeFromCart(prodId)
    .then(result => {
      console.log('postCartDeleteProduct result',result)
      res.redirect(`/cart`);
    })
    .catch(err => {
      return error500next(err, next);
    });
}

exports.postOrder = (req, res, next) => {
  req.user
    .populate('cart.items.productId')
    .then(user => {
      const order =  new Order({
        user: {
          email: req.user.email,
          userId: req.user,
        },
        products: user.cart.items.map((item) => {
          return {
            quantity: item.quantity,
            product: {...item.productId._doc},
          }
        }),
      });
      return order.save();
    })
    .then(result => {
      return req.user.clearCart();
    })
    .then(result => {
      res.redirect(`/orders`);
    })
    .catch(err => {
      return error500next(err, next);
    });
}

exports.getOrders = (req, res, next) => {
  Order.find({'user.userId': req.user._id})
    .then(orders => {
      console.log('orders',orders);
      res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'Your Orders',
        orders,
      });
    })
    .catch(err => {
      return error500next(err, next);
    });
}

exports.getInvoice = (req, res, next) => {
  const orderId = req.params.orderId;
  const invoiceName = `invoice-${orderId}.pdf`;
  const invoicePath = path.join('express', 'data', 'invoices', invoiceName);
  fs.readFile(invoicePath, (err, data) => {
    if (err) {
      return next(err);
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename="'+invoiceName+'"');
    res.send(data);
  });
}

