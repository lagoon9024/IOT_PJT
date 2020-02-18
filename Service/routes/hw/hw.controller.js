const mysql = require('mysql');
const dbconfig = require('../../config/database.js');
const connection = mysql.createConnection(dbconfig);

// const jwt = require('jsonwebtoken');
// const secretKey = require("../../config/jwt");

// . : 현재 폴더 경로, .. : 상위 폴더
const mybatisMapper = require('mybatis-mapper');
mybatisMapper.createMapper(['./mapper/hw.xml']);
let format = {language: 'sql', indent: ' '};

const updateIP = function (req, res) {
    var params = {
        UUID: req.body.uuid,
        d_Ip: 'http://'+req.body.ngrok_url
    }
    console.log(params);
    let query = mybatisMapper.getStatement('hw', 'updateIP', params, format);
    connection.query(query, function(err, rows) {
        if(err) {            
            console.log('Device update IP fail');
            console.log(err);
        }
        console.log(rows);
        console.log("device ip updated ok");
        res.send(true);
    });    
};

module.exports = {
    updateIP: updateIP
};