var express = require('express');
var router = express.Router();
const fs = require("fs");
const cors = require("cors");
router.use(cors());
const rand = require("random-key");
var CryptoJS = require("crypto-js");

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


//CHECK INCOMING LOGIN 
router.post("/login", (req, res) => {

  fs.readFile("users.json", (err, data) => {
    if(err) console.log(err);
    
    let users = JSON.parse(data);
    let foundUser = users.find(({username}) => username == req.body.username);
    let originalPass = CryptoJS.AES.decrypt(foundUser.password, "nyckel").toString(CryptoJS.enc.Utf8);
    console.log('originalpass', originalPass);
    const currentUser = {username: foundUser.username, id: foundUser.id};
    if(foundUser){
       if(originalPass == req.body.password) {
      res.json(currentUser);
    }
   
    }else {
      console.log("else")
     // res.json("användare eller lösen stämmer inte");
    };

  });

});

//CREATE NEW USER
router.post("/createAccount", (req, res) => {
  
  let randomId = rand.generateDigits(8);
  
  if(req.body.subscribe) {
    fs.readFile("newsletter.json", (err, data) => {
      if(err) console.log(err);
      
      let newsletter = JSON.parse(data); 
      
      newsletter.push(req.body.email);

      fs.writeFile("newsletter.json", JSON.stringify(newsletter, null, 2), (err) => {
        if(err) console.log(err);
      });
  
    });
  }

  fs.readFile("users.json", (err, data) => {
    if(err) console.log(err);
    let users = JSON.parse(data);

    let cryptPass = CryptoJS.AES.encrypt(req.body.password, "nyckel").toString();

    let user = {
      username: req.body.username,
      firstname: req.body.firstname, 
      lastname: req.body.lastname, 
      email: req.body.email,
      password: cryptPass,
      id: randomId,
      subscribe: req.body.subscribe
    };
  
    users.push(user);

    fs.writeFile("users.json", JSON.stringify(users, null, 2), (err) => {
      if(err) console.log(err);
    });
  
 
  });
  let currentUser = {username: req.body.username, id: randomId}
  res.json(currentUser);

});


//SEND USERS DETAILS FOR PRINT
router.post('/myAccount/', function(req, res, next) {

  fs.readFile("users.json", (err, data) => {
    if(err) console.log(err);
    let users = JSON.parse(data);

    let foundUser = users.find(({id}) => id == req.body.id);
 
    let user = {
      "username": foundUser.username,
      "firstname":foundUser.firstname, 
      "lastname": foundUser.lastname, 
      "email": foundUser.email,
      "subscribe": foundUser.subscribe
     };

    res.json(user);  
  });
});



//UPDATE SUBSCRIPTION
router.post('/newsletter', function(req, res, next) {
  console.log('req.body', req.body);
  fs.readFile("users.json", (err, data) => {
    if(err) console.log(err);
    let users = JSON.parse(data);

    let foundUser = users.find(({id}) => id == req.body.id);
    
    if(foundUser.subscribe != req.body.subscribe) {
      foundUser.subscribe = req.body.subscribe;

      fs.readFile("newsletter.json", (err, data) => {
        if(err) console.log(err);
         
        let newsletter = JSON.parse(data); 
          
          if(foundUser.subscribe) {
            newsletter.push(foundUser.email);
            console.log("newsletter before push", newsletter)
          } else {
            let foundEmail = newsletter.find((newsletter) => newsletter == foundUser.email);
            for( let email in newsletter) {
              if (newsletter[email] === foundEmail) newsletter.splice(email, 1); 
            }
          }    
          fs.writeFile("newsletter.json", JSON.stringify(newsletter, null, 2), (err) => {
            if(err) console.log(err);
          });
      });
     
    }

    fs.writeFile("users.json", JSON.stringify(users, null, 2), (err) => {
      if(err) console.log(err);
    });

    res.json(foundUser.subscribe);  
  });
});

module.exports = router;

