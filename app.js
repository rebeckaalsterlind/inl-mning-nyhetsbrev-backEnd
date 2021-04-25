var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var adminRouter = require('./routes/admin');
var app = express();

const MongoClient = require("mongodb").MongoClient;

MongoClient.connect("mongodb+srv://alsterlind:8504143201@cluster0.bbnsj.mongodb.net/newsletter?retryWrites=true&w=majority", {
    useUnifiedTopology: true
})
.then(client => {
    console.log("We are connected to the database!");
    const db = client.db("newsletter");
    app.locals.db = db; 
});

// MongoClient.connect("mongodb:127.0.0.1:27017", {
//     useUnifiedTopology: true
// })
// .then(client => {
//     console.log("We are connected to the database!");
//     const db = client.db("newsletter");
//     app.locals.db = db; 
// });

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/admin', adminRouter);


module.exports = app;
