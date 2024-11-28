const Product = require('../models/product');
const {logger} = require("sequelize/lib/utils/logger");

exports.getProducts = (req, res, next) => {
  Product
    .fetchAll()
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
    .fetchAll()
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
  req.user.getCart()
    .then((cart) => {
      return cart.getProducts();
    })
    .then(products => {
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
      return result;
    })

  // let fetchedCart;
  // let newQuantity = 1;
  //
  // req.user.getCart()
  //   .then(cart => {
  //     fetchedCart = cart;
  //     return cart.getProducts({where: {id: prodId}});
  //   })
  //   .then(products => {
  //     let product;
  //     if (products.length > 0) {
  //       product = products[0];
  //     }
  //     if (product) {
  //       const oldQty = product.cartItem.quantity;
  //       newQuantity = oldQty + 1;
  //       return product;
  //     }
  //
  //     return Product.findByPk(prodId)
  //       .catch(err => console.log('getIndex err',err));
  //   })
  //   .then(product => {
  //     return fetchedCart.addProduct(product, {through: { quantity: newQuantity }});
  //   })
  //   .then(result => {
  //     res.redirect(`/cart`);
  //   })
  //   .catch(err => console.log('postCart',err));
}

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user.getCart()
    .then(cart => {
      return cart.getProducts({where: {id: prodId}});
    })
    .then(products => {
      const product = products[0];
      product.cartItem.destroy();
    })
    .then(result => {
      res.redirect(`/cart`);
    });
}

exports.postOrder = (req, res, next) => {
  let fetchedCart;
  req.user.getCart()
    .then((cart) => {
      fetchedCart = cart;
      return cart.getProducts();
    })
    .then(products => {
      return req.user
        .createOrder()
        .then(order => {
          return order.addProducts(products.map(product => {
            product.orderItem = { quantity: product.cartItem.quantity}
            return product;
          }))
        });
    })
    .then(result => {
      return fetchedCart.setProducts(null);
    })
    .then(result => {
      res.redirect(`/orders`);
    })
    .catch(err => console.log('postOrder',err));
}

exports.getOrders = (req, res, next) => {
  req.user.getOrders({include: ['products']})
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