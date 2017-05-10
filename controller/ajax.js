var fs=require('fs')
var path=require('path');
var printer=require('../lib/printer')
var readdir=function(parent,nosub){
    var arr=[],r=null;
    try {
        r = fs.readdirSync(parent)
    }catch(e){

    }
    if(r && r.length) {
        for (var i = 0; i < r.length; i++) {
            var f=r[i],
                fpath=path.join(parent,f);
            if(!f.startsWith('.')){

                var obj={
                    text:f,
                    id:fpath
                }
                if(fs.statSync(fpath).isDirectory()){

                    if(!nosub) {
                        obj.hasChildren = readdir(fpath, true).length;
                    }
                    arr.push(obj)
                }


            }

        }
    }
    return arr;

}
module.exports.readdir = function(req, res, next) {

    res.send({
        code:0,
        data:readdir(req.query.root||'/')
    })


};

module.exports.printdir = function(req, res, next) {
    var dir=req.query.dir;
    if(fs.existsSync(dir)){
        var files=[];
        fs.readdir(dir,function(e,r){


            for(var i= 0,f;f= r[i++];){
                var fpath=path.join(dir,f);
               // console.log(fpath);
                files.push(fpath)
            }

            res.send({
                code:0,
                data:files
            })
        });

    }else{
        res.send({
            code:1,
            error:'dir not exists'
        })
    }


};
