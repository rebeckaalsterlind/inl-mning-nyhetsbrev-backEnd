var express = require('express');
var router = express.Router();
const fs = require("fs");
const cors = require("cors");
router.use(cors());


router.get('/noAccess', function(req, res, next) {
   
    let error = `<h3>Log in to access to this page!</h3>`;

    res.send(error)
});



module.exports = router;
