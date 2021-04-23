var express = require('express');
var router = express.Router();
const fs = require("fs");
const cors = require("cors");
router.use(cors());
// const rand = require("random-key");
// var CryptoJS = require("crypto-js");

const headstyle = `<link rel="stylesheet" href="/stylesheets/style.css">`;
const header = `
<header>
    <section>
        <h1 id="logo">Administration</h1>
        <button id="logOut">Log Out</button>
    </section>
    <div><a href="/admin/subscribers/">Show subscribers</a></div>
    <div><a href="/admin/members/">Show members</a></div>
</header>`;

const checkLS = `if(!localStorage.getItem("AdminId")) {
    window.location.replace("/admin/noAccess")
};`;

const logOut = `document.getElementById("logOut").addEventListener("click", () => {
    localStorage.clear();
    window.location.replace("/")
});`

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond from admin');
});


//
router.post("/", (req, res) => {
    
    req.app.locals.db.collection("admin").find({"username": req.body.username}).toArray()
    .then(result => {
        console.log('RESULT', result);
    if(result != "") {
        if(result[0].password === req.body.password){
            console.log('here');
            let adminData = headstyle + header + `
            <script>
                localStorage.setItem('AdminId', JSON.stringify("${result[0]._id}"));
                ${logOut}
            </script>`;
                
            res.send(adminData)
        }
    } else {
            let error = `
            <script>
                window.location.replace("/")  
                document.querySelectorAll("input").style.border = "1px solid red";
            </script>`;p
            res.send(error)
        }
       
      

    });

});


router.get("/members", (req, res) => {
   
    req.app.locals.db.collection("users").find().toArray()
    .then( users => {
        
        let printMembers = headstyle + header + `
        <script>
            ${checkLS}${logOut}
        </script>
        <div><h2>All Members</h2>`;
      
        for (let user in users) {
            printMembers += `
            <div>
            <p>Username: ${users[user].username}</p> 
            <p>Name: ${users[user].firstname} ${users[user].lastname}</p> 
            <p>Email: ${users[user].email}</p> 
            <p>Newsletter: ${(users[user].subscribe) ? "subscribing" : "not subscribing"}</p> 
            </div><br /><br />`;
        };
        
        printMembers += `</div>`;

    res.send(printMembers)
    });
});


router.get("/subscribers", (req, res) => {
   
    req.app.locals.db.collection("newsletter").find().toArray()
    .then( subscribers => {
        console.log('subscribers', subscribers);
    let printSubs = headstyle + header + `
    <script>
    ${checkLS}${logOut}
    </script>
    <div><h2>All subscribers</h2>`;
    
    for (let subs in subscribers) {
        printSubs += `
        <div>
        <p>${subscribers[subs].email}</p> 
        </div><br /><br />`;
    };
    
    printSubs += `</div>`;

    res.send(printSubs)
    });
});



module.exports = router;
