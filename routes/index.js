var express = require('express');
var router = express.Router();
const fs = require("fs");
const cors = require("cors");
router.use(cors());
// const rand = require("random-key");
// var CryptoJS = require("crypto-js");


/* GET home page. */
router.get('/', function(req, res, next) {
 res.render('index', { title: 'Express' });
  
});

module.exports = router;
