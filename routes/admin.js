var express = require('express');
var router = express.Router();
const fs = require("fs");
const cors = require("cors");
const { ESRCH } = require('constants');
router.use(cors());

//TEMPLATES
const headstyle = `<link rel="stylesheet" href="/stylesheets/style.css">`;

const header = `
<header>
    <section>
        <a href="/admin"><h1 id="logo">Administration</h1></a>
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
    window.location.replace("/noAccess")
};`;

const logOut = `document.getElementById("logOut").addEventListener("click", () => {
    localStorage.clear();
    window.location.replace("/")
});`



//CHECK LOGIN
router.post("/", (req, res) => {
    //FIND USERNAME 
    req.app.locals.db.collection("admin").find({"username": req.body.username}).toArray()
    .then(result => {
        //IF RESULT IS NOT EMPTY
        if(result != "") {
            //IF INCOMIN PASSWORD IS REG PASSWORD
            if(result[0].password === req.body.password){
                
                let adminData = headstyle + header + `
                <script>
                    localStorage.setItem('AdminId', JSON.stringify("${result[0]._id}"));
                    ${logOut}
                </script>` + footer;
                    
                res.send(adminData)
            //DETAILS ARE INVALID
            } else {
                res.redirect("/")
            };
        //INPUT FIELDS ARE EMPTY    
        } else {
            res.redirect("/")
        };

    });

});


//GET LOGGED IN PAGE
router.get('/', function(req, res, next) {
   
    let printSubs = headstyle + header + `
    <script>
        ${checkLS}
        ${logOut}
    </script>
    <main class="flex">
        <h3>Welcome</h3>
    </main>` + footer;

    res.send(printSubs)
});



//PRINT USERS
router.get("/members", (req, res) => {
   
    req.app.locals.db.collection("users").find().toArray()
    .then( users => {
        
        let printMembers = headstyle + header + `
        <script>
            ${checkLS}${logOut}
        </script>
        <section class="list-wrapper"><h3>Members.</h3><br />`;
      
        for (let user in users) {
            printMembers += `
            <div>
                <h4>Member</h4>
                <p><span class="fontStyle" >Username:  </span>${users[user].username}</p> 
                <p><span class="fontStyle" >Name: </span>${users[user].firstname} ${users[user].lastname}</p> 
                <p><span class="fontStyle" >Email: </span>${users[user].email}</p> 
                <p><span class="fontStyle" >Subscribing to newsletter: </span>${(users[user].subscribe) ? "Yes" : "No"}</p> 
            </div><br /><br />`;
        };
        
        printMembers += `</section>` + footer;

    res.send(printMembers)
    });
});

//PRINT SUBSCRIBERS
router.get("/subscribers", (req, res) => {
   
    req.app.locals.db.collection("newsletter").find().toArray()
    .then( subscribers => {
        
        let printSubs = headstyle + header + `
        <script>
            ${checkLS}${logOut}
        </script>
        <section class="list-wrapper"><h3>Subscribers.</h3><br />`;
        
        for (let subs in subscribers) {
            printSubs += `<p>${subscribers[subs].email}</p>`;
        };
        
        printSubs += `</section>` + footer;

        res.send(printSubs)
    });
});

router.get('/noAccess', function(req, res, next) {
   
    let error = `
    <main class="flex">
        <h3>You do not have access</h3>
    </main>`;

    res.send(error)
});


module.exports = router;
