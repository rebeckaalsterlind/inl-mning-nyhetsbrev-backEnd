var express = require('express');
var router = express.Router();
const fs = require("fs");
const cors = require("cors");
router.use(cors());
const rand = require("random-key");
const CryptoJS = require("crypto-js");
//const ObjectID = require('mongodb').ObjectID;



/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});





//CHECK INCOMING LOGIN 
router.post("/login", (req, res) => {
  let foundUser = req.body.username;
console.log('foundUser', foundUser);
  req.app.locals.db.collection("users").find({"username": foundUser}).toArray()
  .then(result => {
    console.log('[0', result[0].username);
    
    if(result[0]){
      let originalPass = CryptoJS.AES.decrypt(result[0].password, "nyckel").toString(CryptoJS.enc.Utf8);
     
      if(originalPass == req.body.password) { 
        const currentUser = {username: result[0].username, id: result[0]._id};
        res.json(currentUser);
      }

    }else {
      res.json("användare eller lösen stämmer inte");
    };

  });

});



//CREATE NEW USER
router.post("/createAccount", (req, res) => {
  
  let randomId = rand.generateDigits(8);
  let findUser = req.body.username;
//CHECK IF USERNAME ALLREADY EXISTS
  req.app.locals.db.collection("users").find({"username": findUser}).toArray()
  .then(result => {

    if(result[0] == undefined || result[0].username == undefined){
//IF DOES NOT EXIST => CHECK IF EMAIL ALLREADY EXISTS
      req.app.locals.db.collection("users").find({"email": req.body.email}).toArray()
      .then(result => {
       
        if(result[0] == undefined || result[0].email == undefined){
        console.log("sub", result[0])
           //IF DOES NOT EXIST => CHECK IF USER WANTS TO SUBSCRIBE
          if(req.body.subscribe) {
            req.app.locals.db.collection("newsletter").insertOne({"email": req.body.email})
          }

          let cryptPass = CryptoJS.AES.encrypt(req.body.password, "nyckel").toString();

          let user = {
            "username": req.body.username,
            "firstname": req.body.firstname, 
            "lastname": req.body.lastname, 
            "email": req.body.email,
            "password": cryptPass,
            "subscribe": req.body.subscribe
          };
          // ADD USER TO REGISTER
          req.app.locals.db.collection("users").insertOne(user)
          // GET USER ID AND SENT TO CLIENT
          req.app.locals.db.collection("users").find({"username": req.body.username}).toArray()
          .then(getId => {
            console.log("i", getId[0]._id)
            let currentUser = {username: req.body.username, id: getId[0]._id}
            res.json(currentUser);
          });

        }else {
          console.log("undefined email")
          res.json("Email");
        }  
    });
        
     
    }else {
      console.log("undefined username")
   
      res.json("Username");
    }  
  });
});



//SEND USERS DETAILS FOR PRINT
router.post('/myAccount/', function(req, res, next) {

  let foundUser = req.body._id;

  req.app.locals.db.collection("users").find({"id": foundUser}).toArray()
  .then(result => {

    let user = {
      "username": result[0].username,
      "firstname":result[0].firstname, 
      "lastname": result[0].lastname, 
      "email": result[0].email,
      "subscribe": result[0].subscribe,
    };

    res.json(user);  

  });

});



//UPDATE SUBSCRIPTION
router.post('/newsletter', function(req, res, next) {
  console.log('req.body', req.body.subscribe);
  let foundUser = req.body;
  
  req.app.locals.db.collection("users").find({"id": foundUser._id}).toArray()  
  .then(result => {
    console.log('result true?', result[0].subscribe);
    if(result[0].subscribe != foundUser.subscribe){
      console.log('so far');
       if(foundUser.subscribe) {
        console.log('should be true');
        req.app.locals.db.collection("newsletter").insertOne({"email": result[0].email})
       
      } else {
        console.log('should be false');
        req.app.locals.db.collection("newsletter").find({"email": result[0].email}).toArray()  
        .then(subscriber => {  
          console.log("subscriber", subscriber[0]._id)
        req.app.locals.db.collection("newsletter").findOneAndDelete({"_id": subscriber[0]._id})
        });

      }
      //uppdate user list to subscribe.true
      req.app.locals.db.collection("users").updateOne({"id": foundUser._id}, {$set:{"subscribe": foundUser.subscribe}})

    };
    res.json(foundUser.subscribe);  
  });

  
  
});

module.exports = router;

