const { getDb } = require("../util/database");
const mongodb = require("mongodb");

const ObjectId = mongodb.ObjectId;

class User {
  constructor({name, email, _id, cart}) {
    this.name = name;
    this.email = email;
    this.cart = cart;
    this._id = _id;
    // this._id = _id ? ObjectId(_id) : null;
  }

  save() {
    const db = getDb();
    let dbOp;

    if (this.id) {
      dbOp = db.collection('users').updateOne(
        { _id: this._id },
        { $set: this }
      );
    } else {
      dbOp = db.collection('users').insertOne(this);
    }

    return dbOp
      .then(result => {
        console.log('save user', result);
        return result;
      })
      .catch(err => console.log(err));
  }

  addToCart(product) {
    // const cartProduct = this.cart.items.findIndex(cp => {
    //   return cp._id === product._id;
    // });

    const updatedCart = {
      items: [{...product, quantity: 1}],
    }
    const db = getDb();

    return db.collection('users')
      .updateOne(
        {_id: new ObjectId(this._id)},
        {$set: {cart: updatedCart}}
      );
  }

  static findById(userId) {
    const db = getDb();
    return db.collection('users')
      .findOne({_id: new ObjectId(userId)})
      .then(user => {
        console.log('user', user);
        return user;
      })
      .catch(err => console.log(err));
  }
}

module.exports = User;
