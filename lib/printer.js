/**
 * Created by wurui on 08/05/2017.
 */
var ipp = require('ipp');
var fs=require('fs');

var uri='http://lenovoa1fc6d.local.:631/ipp/printer'
var getAttr=function() {
    var data = ipp.serialize({
        "operation": "Get-Printer-Attributes",
        "operation-attributes-tag": {
            "attributes-charset": "utf-8",
            "attributes-natural-language": "en",
            "printer-uri": uri
        }
    });

    ipp.request(uri, data, function (err, res) {
        if (err) {
            return console.log(err);
        }
        console.log(JSON.stringify(res, null, 2));
    })
};

var printer = ipp.Printer(uri);


var batchPrint=function(arr){

    var sendcount=0;
    var start=function(e,r) {
        for(var k in r){
            if(r.hasOwnProperty(k))
                console.log(k)
        }
        //console.log(typeof r,r)
        var data=r['job-attributes-tag'];
        if(!data){
            return console.log('ERROR',r['operation-attributes-tag']['status-message'])
        }

        var joburl=data['job-uri'],
            jobid=data['job-id'];

        for (var i = 0, n; n = arr[i++];) {
            fs.readFile(n, function (e, r) {
                sendcount++;

                if (e) {
                    return console.log('error')
                }

                var msg = {
                    "operation-attributes-tag": {
                        "requesting-user-name": "Rio",
                        "job-name": "My Test Job",
                        "document-format": "application/octet-stream",

                        "job-id":jobid,
                        "last-document": sendcount.length == arr.length
                    },
                    data: r
                };
                printer.execute("Send-Document", msg, function (err, res) {
                    console.log(res);
                });
            });
        }
    }
    printer.execute("Create-Job", {
        "operation-attributes-tag": {
        }
    },start);
};

var cancelJobs=function(fn){
    printer.execute("Get-Jobs", {
        "operation-attributes-tag": {
        }
    },function(e,r){

        var data=r['job-attributes-tag'];
console.log('cancel,r',r)
        if(!data){
            return fn(null)
        }console.log('cancel a job',data['job-id'])
        printer.execute("Cancel-Job", {
            "operation-attributes-tag": {
                "job-id":data['job-id'],
                "message":'abort it!'
            }
        },fn);
    });

};
/*
fs.readFile('./2.jpg',function(e,r){
    if(e){
        return console.log('error')
    }
    var msg = {
        "operation-attributes-tag": {
            "requesting-user-name": "Rio",
            "job-name": "My Test Job",
            "document-format": "application/octet-stream"
        },
        data: r
    };
    printer.execute("Print-Job", msg, function(err, res){
        console.log(res);
        console.log('333')
        fs.readFile('./3.jpg',function(e,r){
            if(e){
                return console.log('error')
            }
            var msg = {
                "operation-attributes-tag": {
                    "requesting-user-name": "Rio",
                    "job-name": "My Test Job",
                    "document-format": "application/octet-stream"
                },
                data: r
            };
            printer.execute("Print-Job", msg, function(err, res){
                console.log(res);
            });
        });
    });
});
*/
//batchPrint(['./2.jpg','./3.jpg'])
/*
cancelJobs(function(e,r){
    console.log('cancel',r);//不支持多文档,还是一个任务一个任务加吧
    queuePrint(['./2.jpg','./3.jpg'])
});
*/

var queuePrint=function(queue,fn){
    var msg = {
        "operation-attributes-tag": {
            "requesting-user-name": "Rio",
            "job-name": "NodeJS Job",
            "document-format": "application/octet-stream"
        },
        data: null
    };
    var execjob=function(){
        var filepath=queue.shift();
        if(!filepath){
            if(typeof fn=='function')fn(null);
            return console.log('end')
        }
        fs.readFile(filepath,function(e,r){
            if(!e){
                msg.data=r;
                printer.execute("Print-Job", msg, execjob);
            }else{
                execjob();
            }
        })

    }
    execjob();

};
module.exports.queuePrint=queuePrint;

