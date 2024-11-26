const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getProducts = (req, res, next) => {
  Product
    .findAll()
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

  Product.findAll({
    where: {
      id: productId,
    }
  })
    .then(products => {
      console.log('product',products);

      res.render('shop/product-detail', {
        product: products[0],
        pageTitle: 'Product',
        path: '/products/' + productId,
      })
    })
    .catch(err => console.log('getProduct err',err));

  // Product.findByPk(productId)
  //   .then(product => {
  //     console.log('product',product);
  //
  //     res.render('shop/product-detail', {
  //       product: product,
  //       pageTitle: 'Product',
  //       path: '/products/' + productId,
  //     })
  //   })
  //   .catch(err => console.log('getProduct err',err));
}

exports.getIndex = (req, res, next) => {
  Product
    .findAll()
    .then(products => {
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/',
      })
    })
    .catch(err => console.log('getIndex err',err));
}

exports.getCart = (req, res, next) => {
  Cart.getCart(cart => {
    Product.fetchAll((products) => {

      const cartProducts = products.reduce((acc, product) => {
        const cartProduct = cart.products.find((carProd) => carProd.id === product.id);
        if (cartProduct) {
          acc.push({productData: product, qty: cartProduct.qty});
        }

        return acc;
      }, []);

      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Shop',
        products: cartProducts,
      });
    })
  })
}

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  console.log('prodId',prodId);
  Product.findById(prodId, (product) => {
    Cart.addProduct(prodId, product.price);
  });
  res.redirect(`/cart`);
}

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;

  Product.findById(prodId, (product) => {
    const productPrice = product.price;
    Cart.deleteProduct(prodId, productPrice);
  });
  res.redirect(`/cart`);
}

exports.getOrders = (req, res, next) => {
  res.render('shop/orders', {
    path: '/orders',
    pageTitle: 'Your Orders',
  });
}

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout',
  });
}