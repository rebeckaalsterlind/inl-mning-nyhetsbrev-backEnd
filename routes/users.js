var express = require('express');
var router = express.Router();
const fs = require("fs");
const cors = require("cors");
router.use(cors());
const rand = require("random-key");
var CryptoJS = require("crypto-js");

const randomKey = rand.generate(7);

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
    let originalPass = CryptoJS.AES.decrypt(foundUser.username, randomKey).toString(CryptoJS.encrypt.toString());

    const currentUser = {username: foundUser.username, id: foundUser.id};
    console.log('currentUser', currentUser);
    if(foundUser) {
      if(originalPass == req.body.password) {
        res.json(currentUser);
      };
    } else {
      res.json("användare eller lösen stämmer inte")
    };

  });

});

//CREATE NEW USER
router.post("/createAccount", (req, res) => {
  
  let randomId = rand.generateDigits(5);
  
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

    let cryptPass = CryptoJS.AES.encrypt(req.body.password, randomKey).toString();

    let user = {
      username: req.body.username,
      firstname: req.body.firstname, 
      lastname: req.body.lastname, 
      email: req.body.email,
      password: cryptPass,
      id: randomId
    };
  
    users.push(user);

    fs.writeFile("users.json", JSON.stringify(users, null, 2), (err) => {
      if(err) console.log(err);
    });
  
 
  });
  let currentUser = {username: req.body.username, id: randomId}
  res.json(currentUser);

});




module.exports = router;

