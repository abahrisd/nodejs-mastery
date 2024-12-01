const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  cart: {
    items: [{
      productId: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      }
    }],
  },
})

module.exports = mongoose.model('User', userSchema);

// const {getDb} = require("../util/database");
// const mongodb = require("mongodb");
//
// const ObjectId = mongodb.ObjectId;
//
// class User {
//   constructor({name, email, _id, cart}) {
//     this.name = name;
//     this.email = email;
//     this.cart = cart;
//     this._id = _id;
//     // this._id = _id ? ObjectId(_id) : null;
//   }
//
//   save() {
//     const db = getDb();
//     let dbOp;
//
//     if (this.id) {
//       dbOp = db.collection('users').updateOne(
//         {_id: this._id},
//         {$set: this}
//       );
//     } else {
//       dbOp = db.collection('users').insertOne(this);
//     }
//
//     return dbOp
//       .then(result => {
//         console.log('save user', result);
//         return result;
//       })
//       .catch(err => console.log(err));
//   }
//
//   addToCart(product) {
//     const cartProductIndex = this.cart.items.findIndex(cp => {
//       return cp.productId.toString() === product._id.toString();
//     });
//     let newQuantity = 1;
//     const updatedCartItems = [...this.cart.items];
//
//     if (cartProductIndex >= 0) {
//       newQuantity = this.cart.items[cartProductIndex].quantity + 1;
//       updatedCartItems[cartProductIndex].quantity = newQuantity;
//     } else {
//       updatedCartItems.push({productId: new ObjectId(product._id), quantity: newQuantity});
//     }
//
//     const db = getDb();
//     const updatedCart = {
//       items: updatedCartItems,
//     };
//
//     return db.collection('users')
//       .updateOne(
//         {_id: new ObjectId(this._id)},
//         {$set: {cart: updatedCart}}
//       );
//   }
//
//   deleteProductFromCart(productId) {
//     let updatedCartItems = this.cart.items.filter(cartItem => cartItem.productId.toString() !== productId.toString());
//
//     const db = getDb();
//
//     return db.collection('users')
//       .updateOne(
//         {_id: new ObjectId(this._id)},
//         {$set: {cart: {items: updatedCartItems}}}
//       );
//   }
//
//   getCart() {
//     const db = getDb();
//     const productIds = this.cart.items.map(({productId}) => productId);
//
//     return db.collection('products').find({
//       _id: {$in: productIds}
//     })
//       .toArray()
//       .then(products => {
//         return products.map(product => ({
//           ...product,
//           quantity: this.cart.items.find(item => item.productId.toString() === product._id.toString()).quantity,
//         }))
//       })
//   }
//
//   addOrder() {
//     const db = getDb();
//
//     return this.getCart()
//       .then(products => {
//         const order = {
//           items: products,
//           user: {
//             _id: new ObjectId(this._id),
//             name: this.name,
//           }
//         };
//
//         return db.collection('orders').insertOne(order);
//       })
//       .then(result => {
//         this.cart = {items: []};
//
//         return db.collection('users')
//           .updateOne(
//             {_id: new ObjectId(this._id)},
//             {$set: {cart: {items: []}}}
//           );
//       })
//   }
//
//   getOrders() {
//     const db = getDb();
//
//     return db.collection('orders')
//       .find({'user._id': new ObjectId(this._id)})
//       .toArray();
//   }
//
//   static findById(userId) {
//     const db = getDb();
//     return db.collection('users')
//       .findOne({_id: new ObjectId(userId)})
//       .then(user => {
//         console.log('user', user);
//         return user;
//       })
//       .catch(err => console.log(err));
//   }
//
//
// }
//
// module.exports = User;
