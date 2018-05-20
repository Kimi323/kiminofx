//const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

// var obj = new ObjectID();
// console.log(obj);

MongoClient.connect('mongodb://localhost:27017/fx', function(err, client) {
    if (err) {
      return console.log('Unable to connect to MongoDB server');
    }
    console.log('successfully connect to server');
    const db = client.db('fx');
    //find data matches query which should be passed from client side
    let query = {"success": false}
    db.collection('trades').find(query).toArray().then((docs) => {
        console.log(JSON.stringify(docs, undefined, 2));
    }, (err) => {
        console.log('unable to fetch trades', err);
    });
    client.close();
});
