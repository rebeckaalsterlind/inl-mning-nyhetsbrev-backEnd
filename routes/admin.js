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



// //SPARA I DB
// router.post("/add", function(req, res) {
//     req.app.locals.db.collection("users").insertOne(req.body)
//     .then(result => {
//         console.log(result)
//         res.redirect("/show");
//     })
// })


//HÄMTA FRÅN DB
//let findUser = req.body.username ?? 

    
router.post("/", (req, res) => {
    console.log('rew.boydy', req.body)
    
    req.app.locals.db.collection("admin").find({"username": req.body.username}).toArray()
    .then(result => {
        if(result[0].password === req.body.password){
           req.app.locals.db.collection("users").find().toArray()
           .then( users => {
            let printLists = `<div><h2>All Members</h2>`
            for (let user in users)
                printLists += `
                <div>
                <p>Username: ${users[user].username}</p> 
                <p>Name: ${users[user].firstname} ${users[user].lastname}</p> 
                <p>Email: ${users[user].email}</p> 
                <p>Newsletter: ${(users[user].subscribe) ? "subscribing" : "not subscribing"}</p> 
                
                </div><br /><br />`;

                printLists += `</div>`;

                req.app.locals.db.collection("newsletter").find().toArray()
                .then( subscribers => {
                    
                    printLists += `<div><h2>Subscribers</h2>`

                    for (let subscriber in subscribers) {
                    printLists += `<p>${subscribers[subscriber].email}</p>`    
                    }

                    printLists += `</div>`;

                    res.send(printLists)
                });
           });

        } else {
            res.send("username or password is invalid")
        }
 
    })

    // fs.readFile("admin.json", (err, data) => {
    // if(err) console.log(err);
    // let admin = JSON.parse(data);
  
    // let foundAdmin = admin.find(({username}) => username == req.body.username);

    // if(foundAdmin.password === req.body.password) {
        
    //     fs.readFile("users.json", (err, data) => {

            // let printUsers = `<div><h2>All members</h2>`
            // if(err) console.log(err);
            // let users = JSON.parse(data);
           
            // for (let user in users) {
            //     printUsers += `
            //     <div>
            //     <p>Username: ${users[user].username}</p> 
            //     <p>Name: ${users[user].firstname} ${users[user].lastname}</p> 
            //     <p>Email: ${users[user].email}</p> 
            //     <p>Newsletter: ${(users[user].subscribe) ? "subscribing" : "not subscribing"}</p> 
                
            //     </div><br /><br />`;
            // };    
            
    //         fs.readFile("newsletter.json", (err, data) => {
    //         if(err) console.log(err);
    //         let subscribers = JSON.parse(data);
    //         printUsers += `<div>Subscribers</div>`;
           
    //         for (subscriber in subscribers) {
    //             printUsers += `
    //             <div>${subscribers[subscriber]}</div>`;
    //         };
    //         printUsers += `</div>`;
    //         res.send(printUsers)  
    //     });         
    //     });
    // } else {
    //     res.redirect("/admin/noAccess")
    // }
    // });

});


router.get('/noAccess', function(req, res, next) {
    res.send('Username or password is not valid');
  });
  

module.exports = router;
