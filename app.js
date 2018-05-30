//const MongoClient = require('mongodb').MongoClient;
const express = require('express');
const bodyParser = require('body-parser');
const hbs = require('hbs');
const {MongoClient, ObjectID} = require('mongodb');

var app = express();

app.use(bodyParser.urlencoded({extended: true}) );
app.use(bodyParser.json());
app.set('view engine', 'hbs');
app.use(express.static(__dirname + '/views')); //__dirname is the path to root folder of this directory

MongoClient.connect('mongodb://localhost:27017/fx', (err, client) => {
    const db = client.db('fx');
    if (err) {
        return console.log('Unable to connect to MongoDB server');
    }
    console.log('successfully connect to MongoDB');

    //list all records
    app.get('/trade', (req, res) => {
        db.collection('trades').find({}).toArray().then((docs) => {
            res.render('trade.hbs', {
                monthlyResult: docs
            });
        }, (err) => {
            console.log('unable to fetch trades', err);
        });
    });

    //create new record
    app.post('/trade/create', (req, res) => {
        const myNewTrade = req.body;
        db.collection('trades').insertOne(myNewTrade, (err, result) => {
            if (err) {
                return console.log('Unable to insert new trade record', err);
            }
            console.log(result.ops);
        });
    }, (err) => {
        console.log('unable to log data from client side', err);
    });

    //delete specific record
    app.post('/trade/delete', (req, res) => {
        var objectIdString = req.body._id;
        console.log(req.body);
        var objectId = new ObjectID(objectIdString);
        //console.log(objectId);
        db.collection('trades').findOneAndDelete({'_id': '5b0e3ff5d9295632140961f6'}, (err, result) => {
            if (err) {
                return console.log('Unable to delete trade record', err);
            }
            console.log(result);
        });
    }, (err) => {
        console.log('unable to log data from client side', err);
    });

    var server = app.listen(3000, () => {
        var port = server.address().port;
        console.log('Express server listening on port %s.', port);
    });
    //client.close();
});
