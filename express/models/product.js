const getDb = require('../util/database').getDb;
const mongodb = require('mongodb');

class Product {
  constructor({title, price, description, imageUrl, id, userId}) {
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
    this.userId = userId;
    this._id = id ? new mongodb.ObjectId(id) : null;
  }

  save() {
    const db = getDb();
    let dbOp;

    if (this._id) {
      dbOp = db.collection('products').updateOne(
        { _id: this._id },
        { $set: this }
      );
    } else {
      dbOp = db.collection('products').insertOne(this);
    }

    return dbOp.then(result => {
      console.log('save', result);
      return result;
    })
      .catch(err => console.log(err));
  }

  static fetchAll() {
    const db = getDb();
    return db.collection('products')
      .find()
      .toArray()
      .then(products => {
        console.log('products', products);
        return products;
      })
      .catch(err => console.log(err));
  }

  static findById(prodId) {
    const db = getDb();
    return db.collection('products')
      .find({_id: prodId})
      .next()
      .then(product => {
        console.log('product', product);
        return product;
      })
      .catch(err => console.log(err));
  }

  static deleteById(prodId) {

    const db = getDb();
    return db.collection('products').deleteOne({_id: new mongodb.ObjectId(prodId)})
      .then(result => {
        console.log('Deleted!',result);
      })
      .catch(err => console.log(err));
  }
}

module.exports = Product;
