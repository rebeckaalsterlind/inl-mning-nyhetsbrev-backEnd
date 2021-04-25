var express = require('express');
var router = express.Router();
const fs = require("fs");
const cors = require("cors");
router.use(cors());
const CryptoJS = require("crypto-js");



//CHECK INCOMING LOGIN 
router.post("/login", (req, res) => {

  //RUN INCOMING USERNAME WITH STORED USERS
  req.app.locals.db.collection("users").find({"username": req.body.username}).toArray()
  .then(result => {
    
    //IF RESULT IS NOT EMPTY
    if(result[0]){
      let originalPass = CryptoJS.AES.decrypt(result[0].password, "nyckel").toString(CryptoJS.enc.Utf8);
      
      //IF FOUND USERS USERNAME AND PASSWORD MATCHES
      if(originalPass == req.body.password) { 
        const currentUser = {username: result[0].username, id: result[0]._id};
        res.json(currentUser);
      }

    }else {
      res.json("Invalid");
    };

  });

});



//CREATE NEW USER
router.post("/createAccount", (req, res) => {
  
//CHECK IF USERNAME ALLREADY EXISTS
  req.app.locals.db.collection("users").find({"username": req.body.username}).toArray()
  .then(result => {

    if(result[0] == undefined || result[0].username == undefined){
     //IF DOES NOT EXIST => CHECK IF EMAIL DOES
      req.app.locals.db.collection("users").find({"email": req.body.email}).toArray()
      .then(result => {
       
        if(result[0] == undefined || result[0].email == undefined){
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
          req.app.locals.db.collection("users").insertOne(user);

          // GET USER ID AND SENT TO CLIENT
          req.app.locals.db.collection("users").find({"username": req.body.username}).toArray()
          .then(getId => {
            let currentUser = {username: req.body.username, id: getId[0]._id}
            res.json(currentUser);
          });

        }else {
          res.send("Email");
        };  
      });
    }else {
      res.send("Username");
    };  
  });
});


//SEND USERS DETAILS FOR PRINT
router.post('/myAccount/', function(req, res, next) {
  req.app.locals.db.collection("users").find({"_id": req.body.id}).toArray()
  console.log("id", req.body.id)
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
  
  let foundUser = req.body;
  
  //FIND USER BY ID
  req.app.locals.db.collection("users").find({"_id": foundUser.id}).toArray()  
  .then(result => {
    //IF IS NOT WHAT IS ALLREADY STORED
    if(result[0].subscribe != foundUser.subscribe){
       //IF SUBSCRIPTION IS TRUE SEND TO DB
       if(foundUser.subscribe) {
        req.app.locals.db.collection("newsletter").insertOne({"email": result[0].email})
      //IF IS FALSE FIND USER IN SUB LIST BY EMAIL AND DELETE
      } else {
        req.app.locals.db.collection("newsletter").find({"email": result[0].email}).toArray()  
        .then(subscriber => {  
          req.app.locals.db.collection("newsletter").findOneAndDelete({"_id": subscriber[0]._id})
        });
      };
      //UPPDATE USERLIST TO SUBSCRIBE TRUE/FALSE
      req.app.locals.db.collection("users").updateOne({"id": foundUser.id}, {$set:{"subscribe": foundUser.subscribe}})

    };
    res.json(foundUser.subscribe);  
  });
});

module.exports = router;

