const Product = require("../models/product");

exports.getAddProduct = (req, res, next) => {
  res.render('admin/add-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    activeAddProduct: true,
    formsCSS: true,
    productCSS: true,
  });
}

exports.postAddProduct = (req, res, next) => {
  console.log('req.body',req.body);
  const body = req.body;
  const title = body.title;
  const imageUrl = body.imageUrl;
  const description = body.description;
  const price = body.price;
  const product = new Product(
    title,
    imageUrl,
    description,
    price,
  );
  product.save();
  res.redirect('/admin/products');
}

exports.getProducts = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products',
    });
  });
}