var exec = require('child_process').exec;
const ngrok = require('ngrok');
var fs = require('fs');
var request = require('request');
var uuid_path = __dirname + '/uuid';

const ngrok_info = async function() {    
    //uuid 파일을 불러와서 string에 저장
    //없을 경우에만 child_process 로 생성
    var uuid;
    try {
        uuid = fs.readFileSync(uuid_path);
    } catch (err) {
        if (err.code === 'ENOENT') {
            exec("blkid -s UUID -o value /dev/mmcblk0p2 > "+ uuid_path, 
            function(err,stdout,stderr) {
                if(stderr) console.log(stderr);
                else uuid.fs.readFileSync(uuid_path);        
            })
        }
        else {
            console.log("uuid parshing complete :: ");
        }
    }    
    const url = await ngrok.connect(3000);
    const api = ngrok.getApi();
    const tunnels = await api.get('api/tunnels');
    var ngrok_url = JSON.parse(tunnels).tunnels[0].public_url;
    var ngrok_i = ngrok_url.split("//");
    ngrok_url = ngrok_i[1];
    
    console.log(ngrok_url);

    var uuid_string = uuid.toString();
    request.put("http://52.78.235.226:3000/hw/ip", //send to server
    {
        form:{
            ngrok_url:ngrok_url,
            uuid:uuid_string.substring(0,uuid_string.length-1)
        }
    }, function (err, httpResponse, body) {
        if(err) console.log(err);                           
    });
    
}

module.exports = {
    ngrok_info:ngrok_info
}