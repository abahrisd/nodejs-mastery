const Product = require("../models/product");
const {error500next} = require("../util/errors");
const {logger} = require("sequelize/lib/utils/logger");


exports.getAddProduct = (req, res, next) => {
  const message = req.flash('error');
  const errorMessage = message.length > 0 ? message[0] : null;

  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
    errorMessage,
  });
}

exports.postAddProduct = (req, res, next) => {
  console.log('req',req);
  const body = req.body;
  const title = body.title;
  const image = req.file;
  const description = body.description;
  const price = body.price;

  if (!image) {
    return res.status(422).render('admin/edit-product', {
      path: '/admin/add-product',
      pageTitle: 'Add Product',
      editing: false,
      product: {
        title,
        price,
        description,
      },
      errorMessage: 'Attached file is not an image',
      validationErrors: [],
    });
  }

  const product = new Product({
    title,
    imageUrl: image.path,
    description,
    price,
    userId: req.user,
  });

  product
    .save()
    .then((product) => {
      res.redirect('/');
  }).catch(err => {
    return error500next(err, next);
  });
}

exports.getProducts = (req, res, next) => {
  Product
    // .find()
    .find({userId: req.user._id})
    .select('title price')
    .populate('userId', 'name')
    .then(products => {
      console.log('products',products);
      res.render('admin/products', {
        prods: products,
        pageTitle: 'Admin Products',
        path: '/admin/products',
        errorMessage: null,
      });
    })
    .catch(err => {
      return error500next(err, next);
    });
}

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;

  if (!editMode) {
    return res.redirect('/');
  }

  const productId = req.params.productId;

  Product.findById(productId)
    .then(product => {
      if (!product) {
        return res.redirect('/');
      }
      console.log('productId',productId);

      res.render('admin/edit-product', {
        product,
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: editMode === 'true',
        errorMessage: null,
      });
    })
    .catch(err => {
      return error500next(err, next);
    });
}

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedDesc = req.body.description;
  const image = req.file;

  Product.findById(prodId)
    .then(product => {
      if (product.userId.toString() !== req.user._id.toString()) {
        return res.redirect('/');
      }
      product.title = updatedTitle;

      if (image) {
        product.imageUrl = image.path;
      }

      product.description = updatedDesc;
      product.price = updatedPrice;

      return product.save()
        .then(result => {
          res.redirect('/admin/products');
        });
    })

    .catch(err => {
      return error500next(err, next);
    });
}

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;

  Product.deleteOne({_id: prodId, userId: req.user._id})
    .then(result => {
      res.redirect('/admin/products');
    })
    .catch(err => {
      return error500next(err, next);
    });
}