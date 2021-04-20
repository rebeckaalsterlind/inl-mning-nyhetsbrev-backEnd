var express = require('express');
var router = express.Router();
const fs = require("fs");
const cors = require("cors");
router.use(cors());
// const rand = require("random-key");
// var CryptoJS = require("crypto-js");

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond from admin');
});


    
router.post("/", (req, res) => {
    console.log('rew.boydy', req.body)
    
    fs.readFile("admin.json", (err, data) => {
    if(err) console.log(err);
    let admin = JSON.parse(data);
  
    let foundAdmin = admin.find(({username}) => username == req.body.username);

    if(foundAdmin.password === req.body.password) {
        
        
        fs.readFile("users.json", (err, data) => {
            let printUsers = `<div><h2>All members</h2>`
            if(err) console.log(err);
            let users = JSON.parse(data);
           
            for (let user in users) {
                printUsers += `
                <div>
                <p>Name: ${users[user].firstname} ${users[user].lastname}</p> 
                <p>Account number: ${users[user].username}</p> 
                <p>Email: ${users[user].email}</p> 
                <p>subscribing: ${users[user].subscribe}</p> 
                </div><br /><br />`;
            };    
            
            fs.readFile("newsletter.json", (err, data) => {
            if(err) console.log(err);
            let subscribers = JSON.parse(data);
            printUsers += `<div>Subscribers</div>`;
           
            for (subscriber in subscribers) {
                printUsers += `
                <div>${subscribers[subscriber]}</div>`;
            };
            printUsers += `</div>`;
            res.send(printUsers)  
        });         
        });
    } else {
        res.redirect("/admin/noAccess")
    }
    });

});


router.get('/noAccess', function(req, res, next) {
    res.send('Username or password is not valid');
  });
  

module.exports = router;
