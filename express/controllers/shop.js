const Product = require('../models/product');
const Order = require('../models/order');
const path = require('path');
const fs = require('fs');
const PDFDocument = require('pdfkit');
const stripe = require('stripe')('sk_test_51QUEIGHJd0rBwEEOpl03OApqRMiW7J75nhdczj7RTcnhsitRLIHBIkMsPkdPo4MLHekAOsx62wZqEUErXSAPsv0A00xlJp2taN');

const {error500next} = require("../util/errors");

const ITEMS_PER_PAGE = 1;

exports.getProducts = (req, res, next) => {
  const page = +req.query.page || 1;
  let totalItems;

  // TODO refactor with getIndex
  Product.find().countDocuments().then(numProducts => {
    totalItems = numProducts;
    return Product
      .find()
      .skip((page - 1) * ITEMS_PER_PAGE)
      .limit(ITEMS_PER_PAGE)
  })
    .then(products => {
      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'All products',
        path: '/products',
        currentPage: page,
        hasNextPage: ITEMS_PER_PAGE * page < totalItems,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
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
  const page = +req.query.page || 1;
  let totalItems;

  // TODO refactor with getProducts
  Product.find().countDocuments().then(numProducts => {
    totalItems = numProducts;
    return Product
      .find()
      .skip((page - 1) * ITEMS_PER_PAGE)
      .limit(ITEMS_PER_PAGE)
  })
    .then(products => {
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/',
        currentPage: page,
        hasNextPage: ITEMS_PER_PAGE * page < totalItems,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
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

exports.getCheckout = (req, res, next) => {

  let products;
  let totalSum = 0;

  req.user
    .populate('cart.items.productId')
    // .execPopulate()
    .then(user => {
      products = user.cart.items;
      totalSum = 0;
      products.forEach((product) => {
        totalSum += product.quantity * product.productId.price;
      });

      return stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'payment',
        line_items: products.map(p => ({
          quantity: p.quantity,
          price_data: {
            currency: 'usd',
            unit_amount: p.productId.price * 100,
            product_data: {
              name: p.productId.title,
              description: p.productId.description,
            }
          }
        })),
        success_url: req.protocol + '://' + req.get('host') + '/checkout/success',
        cancel_url: req.protocol + '://' + req.get('host') + '/checkout/cancel',
      })
    })
    .then(session => {
      res.render('shop/checkout', {
        pageTitle: 'Checkout',
        path: '/checkout',
        products,
        totalSum,
        sessionId: session.id,
      })
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

exports.getCheckoutSuccess = (req, res, next) => {
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

  Order.findById(orderId)
    .then(order => {
      if (!order) {
        return next(new Error('No order Found'));
      }

      if (order.user.userId.toString() !== req.user._id.toString()) {
        return next(new Error('Unauthorized'));
      }

      const invoiceName = `invoice-${orderId}.pdf`;
      const invoicePath = path.join('express', 'data', 'invoices', invoiceName);

      const pdfDoc = new PDFDocument();
      pdfDoc.pipe(fs.createWriteStream(invoicePath));
      pdfDoc.pipe(res);

      pdfDoc.fontSize(26).text('Invoice', {
        underline: true,
      });
      pdfDoc.text('__________________');

      let totalPrice = 0;
      order.products.forEach(prod => {
        totalPrice += prod.quantity*prod.product.price;
        pdfDoc.fontSize(14).text(`${prod.product.title} - ${prod.quantity} x $${prod.product.price}`);
      });

      pdfDoc.text('__________________');
      pdfDoc.fontSize(20).text(`Total price: $${totalPrice}`)

      pdfDoc.end();

      // variant 1
      // fs.readFile(invoicePath, (err, data) => {
      //   if (err) {
      //     return next(err);
      //   }
      //
      //   res.setHeader('Content-Type', 'application/pdf');
      //   res.setHeader('Content-Disposition', 'inline; filename="'+invoiceName+'"');
      //   res.send(data);
      // });

      // variant 2
      // const file = fs.createReadStream(invoicePath);
      // res.setHeader('Content-Type', 'application/pdf');
      // res.setHeader('Content-Disposition', 'inline; filename="'+invoiceName+'"');
      // file.pipe(res);

    })
    .catch(err => {
      return error500next(err, next);
    });
}

