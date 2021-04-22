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


// router.get("/", (req, res) => {
  
//     let printLinks = headstyle + `
  
//     <div><a href="/admin/subscribers/">Show subscribers</a></div>
//     <div><a href="/admin/members/">Show members</a></div>`;

//     res.send(printLinks);

// });


router.post("/", (req, res) => {
    
    req.app.locals.db.collection("admin").find({"username": req.body.username}).toArray()
    .then(result => {
    
        if(result[0].password === req.body.password){
            console.log('here');
            let adminData = headstyle + `${header}
            <script>
            localStorage.setItem('AdminId', JSON.stringify("${result[0]._id}"))
            ${logOut}
            </script>
            
            <div><a href="/admin/subscribers/">Show subscribers</a></div>
            <div><a href="/admin/members/">Show members</a></div>
           `;
        
        
            res.send(adminData)

        } else {
            let error = `<div>fel inlogg eller lösen</div>`;
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




// router.post("/members", (req, res) => {
//     console.log('con daftest');
//     res.send("print members")

// });
// router.post("/subscribers", (req, res) => {
  
//     res.send("print subscribers")

// });

router.get('/login', function(req, res, next) {
    res.send('Username or password is not valid');
});

router.get('/noAccess', function(req, res, next) {
    res.send('Username or password is not valid');
});
  


















// router.post("/", (req, res) => {
//     console.log('rew.boydy', req.body)
    
//     req.app.locals.db.collection("admin").find({"username": req.body.username}).toArray()
//     .then(result => {
//         if(result[0].password === req.body.password){
//            req.app.locals.db.collection("users").find().toArray()
//            .then( users => {
//             let printLists = `<div><h2>All Members</h2>`
//             for (let user in users)
//                 printLists += `
//                 <div>
//                 <p>Username: ${users[user].username}</p> 
//                 <p>Name: ${users[user].firstname} ${users[user].lastname}</p> 
//                 <p>Email: ${users[user].email}</p> 
//                 <p>Newsletter: ${(users[user].subscribe) ? "subscribing" : "not subscribing"}</p> 
                
//                 </div><br /><br />`;

//                 printLists += `</div>`;

//                 req.app.locals.db.collection("newsletter").find().toArray()
//                 .then( subscribers => {
                    
//                     printLists += `<div><h2>Subscribers</h2>`

//                     for (let subscriber in subscribers) {
//                     printLists += `<p>${subscribers[subscriber].email}</p>`    
//                     }

//                     printLists += `</div>`;

//                     res.send(printLists)
//                 });
//            });

//         } else {
//             res.send("username or password is invalid")
//         }
 
//     })

// });


// router.get('/noAccess', function(req, res, next) {
//     res.send('Username or password is not valid');
//   });
  

module.exports = router;
