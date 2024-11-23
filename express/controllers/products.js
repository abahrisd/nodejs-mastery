const products = [];

exports.getAddProduct = (req, res, next) => {
  res.render('add-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    activeAddProduct: true,
    formsCSS: true,
    productCSS: true,
  });
}

exports.postAddProduct = (req, res, next) => {
  console.log('req.body',req.body);
  products.push({
    title: req.body.title,
  });
  res.redirect('/');
}

exports.getProducts = (req, res, next) => {
  console.log('prods', products);
  res.render('shop', {
    prods: products,
    hasProds: products.length > 0,
    docTitle: 'Shop',
    activeShop: true,
    pageTitle: 'Shop',
    path: '/',
    productCSS: true,
    formsCSS: true,
  });
}