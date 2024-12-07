const Product = require("../models/product");
const {error500next} = require("../util/errors");


exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
  });
}

exports.postAddProduct = (req, res, next) => {
  const body = req.body;
  const title = body.title;
  const imageUrl = body.imageUrl;
  const description = body.description;
  const price = body.price;

  const product = new Product({
    title,
    imageUrl,
    description,
    price,
    userId: req.user,
  });

  product
    .save()
    .then((product) => {
      throw Erorr('woops');
      console.log('result', product);
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
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;

  Product.findById(prodId)
    .then(product => {
      if (product.userId.toString() !== req.user._id.toString()) {
        return res.redirect('/');
      }
      product.title = updatedTitle;
      product.imageUrl = updatedImageUrl;
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