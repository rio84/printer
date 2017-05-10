var express = require('express');
var router = express.Router();


var index=require('../controller/index')
var ajax=require('../controller/ajax')
router.post('/addtask', index.addtask);

router.get('/ajax/:action', function(req, res, next) {
    var params=req.params,
        action=params.action;
    if(action in ajax){
        ajax[action](req,res);
    }else{
        res.send({code:1,error:'no api'})
    }



});

router.get('/', function (req, res, next) {
    res.redirect('/index.html');
});

module.exports = router;
