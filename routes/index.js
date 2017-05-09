var express = require('express');
var router = express.Router();


var index=require('../controller/index')


router.get('/', function (req, res, next) {
    res.redirect('/index.html');
});

module.exports = router;
