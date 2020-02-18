var request = require('request');
var exec = require('child_process').exec;

const servertime = async function(){
    request.get("https://aws.amazon.com" ,function (err, res, body){
        if(err) console.log(err);
        console.log(res.headers.date);
        var nowdate = Date.parse(res.headers.date);
        exec("sudo date -s @"+(nowdate/1000));
        console.log("TIME SETTING SUCCESS");
    });
}

module.exports = {
    servertime: servertime
}