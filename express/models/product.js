const fs = require('fs');
const path = require('path');
const p = path.join(
  path.dirname(process.mainModule.filename),
  'data',
  'products.json',
);

const getProductsFromFile = (cb) => {
  fs.readFile(p, (err, fileContent) => {
    if (err) {
      return cb([]);
    }

    cb(JSON.parse(fileContent));
  });
}

module.exports = class Product {
  constructor(title, imageUrl, description, price) {
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    this.id = Math.random().toString();
    getProductsFromFile(products => {
      fs.readFile(p, (err, fileContent) => {
        products.push(this);

        fs.writeFile(p, JSON.stringify(products), (err) => {
          console.log('err',err);
        });
      })
    });
  }

  static fetchAll(cb) {
    getProductsFromFile(cb);
  }

  static findById(id, cb) {
    getProductsFromFile(products => {
      const prod = products.find(product => product.id === id);
      return cb(prod);
    });
  }
}