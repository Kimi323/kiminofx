//const MongoClient = require('mongodb').MongoClient;
const express = require('express');
const bodyParser = require('body-parser');
const hbs = require('hbs');
const MongoClient = require('mongodb').MongoClient;

var app = express();

app.use(bodyParser.urlencoded({extended: true}) );
app.use(bodyParser.json());
app.set('view engine', 'hbs');
app.use(express.static(__dirname + '/views')); //__dirname is the path to root folder of this directory

MongoClient.connect('mongodb://localhost:27017/fx', (err, client) => {
    if (err) {
        return console.log('Unable to connect to MongoDB server');
    }
    console.log('successfully connect to MongoDB');

    app.get('/trade', (req, res) => {
        const db = client.db('fx');
        db.collection('trades').find({}).toArray().then((docs) => {
            //res.send(`<h1>${docs.amount}</h1>`);
            res.render('trade.hbs', {
                monthlyResult: docs
            });
        }, (err) => {
            console.log('unable to fetch trades', err);
        });
    });

    var server = app.listen(3000, () => {
        var port = server.address().port;
        console.log('Express server listening on port %s.', port);
    });
    //client.close();
});
