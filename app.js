//const MongoClient = require('mongodb').MongoClient;
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;

app.use(bodyParser.urlencoded({extended: true}) );
app.use(bodyParser.json());
app.use('/html', express.static('html'));

MongoClient.connect('mongodb://localhost:27017/fx', function(err, client) {
    if (err) {
        return console.log('Unable to connect to MongoDB server');
    }
    console.log('successfully connect to server');
    app.get('/trade', (req, res) => {
        res.send(`<h1>Hello world</h1>`);
        const db = client.db('fx');
        db.collection('trades').find({}).toArray().then((docs) => {
            console.log(JSON.stringify(docs, undefined, 2));
        }, (err) => {
            console.log('unable to fetch trades', err);
        });
        var server = app.listen(3000, function() {
            var port = server.address().port;
            console.log('Express server listening on port %s.', port);
        });
    })
    //client.close();
});
