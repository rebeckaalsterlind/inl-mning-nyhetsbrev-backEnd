var express = require('express');
var router = express.Router();
const fs = require("fs");
const cors = require("cors");
const { ESRCH } = require('constants');
router.use(cors());
// const rand = require("random-key");
// var CryptoJS = require("crypto-js");

const headstyle = `<link rel="stylesheet" href="/stylesheets/style.css">`;
const header = `
<header>
    <section>
        <h1 id="logo">Administration</h1>
       
    </section> 
    <aside>
        <div>
            <button id="logOut">Log Out</button>
        </div>
        <a href="/admin/subscribers/">Show subscribers</a>
        <a href="/admin/members/">Show members</a>
    </aside>
</header>`;
const footer = `<footer><h6>Rebecka Alsterlind</h6></footer>`;
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
            </script>` + footer;
                
            res.send(adminData)
        } else {
             let error = `
            <script>
               alert("Username or password invalid")
               window.location.replace("/")
            </script>`;
            res.send(error)
        }
    } else {
        let error = `
        <script>
           window.location.replace("/")
        </script>`;
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
        <section class="list-wrapper"><h3>All Members</h3><br />`;
      
        for (let user in users) {
            printMembers += `
            <div>
                <h5>Member</h5>
                <p>Username: ${users[user].username}</p> 
                <p>Name: ${users[user].firstname} ${users[user].lastname}</p> 
                <p>Email: ${users[user].email}</p> 
                <p>Newsletter: ${(users[user].subscribe) ? "subscribing" : "not subscribing"}</p> 
            </div><br /><br />`;
        };
        
        printMembers += `</section>` + footer;

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
    <section class="list-wrapper"><h3>All subscribers</h3><br />`;
    
    for (let subs in subscribers) {
        printSubs += `<p>${subscribers[subs].email}</p>`;
    };
    
    printSubs += `</section>` + footer;

    res.send(printSubs)
    });
});



module.exports = router;
