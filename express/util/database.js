const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

const mongoConnect = callback => {
  MongoClient.connect(
    'mongodb+srv://node-mastery:6PhOFs2ibmjj6h99@cluster0.ojxdn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
    (err, db) => {
      console.log('db err',err)
    })
    .then(result => {
      console.log('Connected!', );
    })
    .catch(err => console.log('Mongo err', err));
}

module.exports = mongoConnect;