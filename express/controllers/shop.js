const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getProducts = (req, res, next) => {
  Product.fetchAll()
    .then(([rows, fieldData]) => {
      res.render('shop/product-list', {
        prods: rows,
        pageTitle: 'All products',
        path: '/products',
      });
    })
    .catch(err => console.log('getIndex err',err));
}

exports.getProduct = (req, res, next) => {
  const productId = req.params.productId;

  Product.findById(productId)
    .then(([product]) => {
      console.log('product',product);

      res.render('shop/product-detail', {
        product: product[0],
        pageTitle: 'Product',
        path: '/products/' + product[0].id,
      })
    })
    .catch(err => console.log('getProduct err',err));
}

exports.getIndex = (req, res, next) => {
  Product.fetchAll()
    .then(([rows, fieldData]) => {
      res.render('shop/index', {
        prods: rows,
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