const Product = require("../models/product");

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
      console.log('result', product);
      res.redirect('/');
  }).catch(err => console.log('save error', err));
}

exports.getProducts = (req, res, next) => {
  Product
    .find()
    .select('title price -_id')
    .populate('userId', 'name')
    .then(products => {
      console.log('products',products);
      res.render('admin/products', {
        prods: products,
        pageTitle: 'Admin Products',
        path: '/admin/products',
      });
    })
    .catch(err => console.log('getProducts admin err',err));
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

      res.render('admin/edit-product', {
        product,
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: editMode === 'true',
      });
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
      product.title = updatedTitle;
      product.imageUrl = updatedImageUrl;
      product.description = updatedDesc;
      product.price = updatedPrice;

      return product.save();
    })
    .then(result => {
      res.redirect('/admin/products');
    })
    .catch(err => console.log('postEditProduct err', err));
}

exports.postDeleteProduct = (req, res, next) => {
  Product.findByIdAndDelete(req.body.productId)
    .then(result => {
      res.redirect('/admin/products');
    })
    .catch(err => console.log(err));
}