const Product = require('../models/product');

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
    .catch(err => console.log('getProducts err',err));
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
    .catch(err => console.log('getProduct err',err));
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
    .catch(err => console.log('getIndex err', err));
}

exports.getCart = (req, res, next) => {
  console.log('getCart',req.user.cart);

  // Product.find({
  //   '_id': { $in: req.user.cart.items.map(ci => ci.productId)}
  // })
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
    .catch(err => console.log('getIndex err',err));
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
    .catch((err) => console.log('postCart err',err));
}

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;

  req.user.removeFromCart(prodId)
    .then(result => {
      console.log('postCartDeleteProduct result',result)
      res.redirect(`/cart`);
    })
    .catch(err => console.log('postCartDeleteProduct err',err));
}

exports.postOrder = (req, res, next) => {
  req.user.addOrder().then(result => {
      res.redirect(`/orders`);
    })
    .catch(err => console.log('postOrder',err));
}

exports.getOrders = (req, res, next) => {
  req.user.getOrders()
    .then(orders => {
      console.log('orders',orders);
      res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'Your Orders',
        orders,
      });
    })
    .catch(err => console.log('getOrders err',err));


}