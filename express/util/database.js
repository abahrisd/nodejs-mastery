const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = callback => {
  MongoClient.connect(
    'mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000',
    (err, db) => {
      console.log('db err',err)
    })
    .then(client => {
      console.log('Connected!', );
      _db = client.db();
      callback()
    })
    .catch(err => {
      console.log('Mongo err', err)
      throw err;
    });
}

const getDb = () => {
  if (_db) {
    return _db;
  }
  throw 'No database fround';
}

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;