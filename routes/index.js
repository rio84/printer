var express = require('express');
var router = express.Router();


var index=require('../controller/index')
router.post('/addtask', index.addtask);

router.get('/', function (req, res, next) {
    res.redirect('/index.html');
});

module.exports = router;
