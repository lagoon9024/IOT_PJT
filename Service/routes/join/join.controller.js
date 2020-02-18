const mysql = require('mysql'); //mysql 사용
const dbconfig = require('../../config/database.js'); //dbconfig: 데이터베이스 접속 환경 설정
const connection = mysql.createConnection(dbconfig); //connection: mysql 연결

const jwt = require('jsonwebtoken');
const secretKey = require("../../config/jwt");

// . : 현재 폴더 경로, .. : 상위 폴더
const mybatisMapper = require('mybatis-mapper'); //mybatis-mapper 사용
mybatisMapper.createMapper(['./mapper/join.xml']); //createMapper: 작성된 Mapper Load
let format = {language: 'sql', indent: ' '};

var ini_Main_data = {
    u_No: 0,
    u_Name: 'u_Name',
    u_Last: 0,
    device : []
};

var result = {
    validation: false,
    message: '',
    data: []
};

const selectMain = function (req, res) {
    if(checkToken(req.headers.authorization)) {
        Main_data = ini_Main_data;
        Main_data.u_No = req.params.no;
        let query = mybatisMapper.getStatement('join', 'selectUser', Main_data, format);
        connection.query(query, function(err, rows) {            
            if(err){
                result.validation = false;
                result.message = 'Join Controller에서 u_Name, u_Last를 호출하는 데 오류가 발생하였습니다';
                result.data = [];
                res.json(result);
                return;
            }            
            console.log('Main_data selectUser ok');
            Main_data.u_Name = rows[0].u_Name;
            Main_data.u_Last = rows[0].u_Last;
            let query2 = mybatisMapper.getStatement('join', 'selectDevice', Main_data, format);
            connection.query(query2, function(err2, rows2) {
                if(err2){
                    result.validation = false;
                    result.message = 'Join Controller에서 d_No, d_Name을 호출하는 데 오류가 발생하였습니다';
                    result.data = [];
                    res.json(result);
                    return;
                }
                if(!rows2[0]){
                    console.log('Main_data selectDevice fail');
                    result.validation = false;
                    result.message = 'Join Controller: u_No 유저가 가진 Device 정보가 존재하지 않습니다';                        
                    result.data = [];
                    res.json(result);
                }
                else{
                    console.log('Main_data selectDevice ok');
                    for(var i = 0; i<rows2.length; i++){
                        var device_temp = {
                            d_No : 0,
                            d_Name : 'd_Name'
                        }
                        device_temp = rows2[i];
                        Main_data.device.push(device_temp);
                    }
                    result.validation = true;
                    result.message = 'Join Controller: u_No 유저가 가진 Device 데이터 호출 성공';
                    result.data = Main_data;
                    res.json(result);
                    Main_data.device = [];
                }
            });            
        });
    }
    else res.json(result);
};

const changeLast = function (req, res) {
    if(checkToken(req.headers.authorization)) {
        var change_temp = {
            u_No: 0,
            d_No: 0
        }
        change_temp = {...change_temp , ...req.body};
        let query = mybatisMapper.getStatement('join', 'changeLast', change_temp, format);
        connection.query(query, function(err, rows) {
            if(err){
                result.validation = false;
                result.message = 'Join Controller에서 u_Last 갱신하는 데 오류가 발생하였습니다';
                result.data = [];
                res.json(result);
                return;
            }
            console.log('u_Last update ok: ' + change_temp.u_No);
            result.validation = true;
            result.message = 'Join Controller에서 u_Last 갱신 성공';
            result.data = [];
            res.json(result);
        });
    }
    else res.json(result);
};

function checkToken(token){
    var tempToken = false;
    jwt.verify(token, secretKey.secret, (err, decoded) => {
        if(err) {
            console.log('토큰 에러 발생!');
            console.log(err);
            result.validation = false;
            result.message = '다시 로그인 해주세요!';
            result.data = [];
            tempToken = false;
        }
        else {
            tempToken = true;
        }
    });
    return tempToken;
}

module.exports = {
    selectMain: selectMain,
    changeLast: changeLast
};