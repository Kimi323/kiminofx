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
        db.collection('trades').find({}).sort( { entryDate: 1 } ).toArray().then((docs) => {
            res.render('trade.hbs', {
                monthlyResult: docs
            })
        }, (err) => {
            console.log('unable to fetch trades', err);
        });
    });

    //show detail of specific record
    app.post('/trade/detail', (req, res) => {
        const tradeToShow = {
            insertedTime: req.body.insertedTime
        }
        db.collection('trades').find(tradeToShow).toArray().then((docs) => {
            if (err) {
                return console.log('Unable to find the trade you clicked', err);
            }
            console.log('successfully find specific trade detail');
            //console.log(docs);
            res.send(docs);
        });
    }, (err) => {
        console.log('unable to post on server', err);
    });

    //update specific record
    app.post('/trade/update', (req, res) => {
        const insertedTime = req.body.insertedTime;
        const tradeToUpdate = {
            currencyPair: req.body.currencyPair,
            amount: req.body.amount,
            buyOrSell: req.body.buyOrSell,
            entryPrice: req.body.entryPrice,
            exitPrice: req.body.exitPrice,
            entryDate: req.body.entryDate,
            exitDate: req.body.exitDate,
            successOrNot: req.body.successOrNot,
            profit: req.body.profit
        }
        //console.log(insertedTime);
        console.log(tradeToUpdate);
        db.collection('trades').findOneAndUpdate({
            insertedTime: insertedTime
        }, {
            $set: tradeToUpdate
        }, {
            returnOriginal: false
        }).then((result) => {
            res.send(result);
            //console.log(result);
        });
    }, (err) => {
        console.log('unable to post on server', err);
    });

    //create new record
    app.post('/trade/create', (req, res) => {
        const myNewTrade = req.body;
        db.collection('trades').insertOne(myNewTrade, (err, result) => {
            if (err) {
                return console.log('Unable to insert new trade record', err);
            }
            res.send(result);
        });
    }, (err) => {
        console.log('unable to log data from client side', err);
    });

    //delete specific record
    app.post('/trade/delete', (req, res) => {
        const tradeToDelete = {
            insertedTime: req.body.insertedTime
        }
        //console.log(tradeToDelete);
        db.collection('trades').findOneAndDelete(tradeToDelete, (err, result) => {
            if (err) {
                return console.log('Unable to delete trade record', err);
            }
            console.log(result);
            res.send(result);
        });
    }, (err) => {
        console.log('unable to post on server', err);
    });

    app.post('/trade/search', (req, res) => {
        const tradeToSearch = {
            currencyPair: req.body.currencyPair,
            entryDateFrom: req.body.entryDateFrom,
            entryDateTo: req.body.entryDateTo,
            exitDateFrom: req.body.exitDateFrom,
            exitDateTo: req.body.exitDateTo
        }
        console.log(tradeToSearch);
        const query = {
            $and: [
                // { entryDate: {$gte: tradeToSearch.entryDateFrom, $lte: tradeToSearch.entryDateTo} },
                { exitDate: {$gte: tradeToSearch.exitDateFrom, $lte: tradeToSearch.exitDateTo} },
                { currencyPair: tradeToSearch.currencyPair } ]
        }
        db.collection('trades').find(query).toArray().then((docs) => {
            console.log(docs);
            // res.render('trade.hbs', {
            //     monthlyResult: docs
            // });
            res.send(docs);
        }, (err) => {
            console.log('unable to fetch trades', err);
        });
    })

    const server = app.listen(3000, () => {
        const port = server.address().port;
        console.log('Express server listening on port %s.', port);
    });
    //client.close();
});
