const mysql = require('mysql');
const dbconfig = require('../../config/database.js');
const connection = mysql.createConnection(dbconfig);

const jwt = require('jsonwebtoken');
const secretKey = require("../../config/jwt");

// . : 현재 폴더 경로, .. : 상위 폴더
const mybatisMapper = require('mybatis-mapper');
mybatisMapper.createMapper(['./mapper/logdata.xml']);
mybatisMapper.createMapper(['./mapper/hw.xml']);
let format = {language: 'sql', indent: ' '};

var ini_logdata = {
    l_No: 0,
    d_No: 0,
    l_Time: 'l_Time',
    l_Remain: 0,
    l_Empty: false,
    l_Amount: 0,
    l_Eat: 0
};

var result = {
    validation: false,
    message: '',
    data: []
};

const selectBasic = function (req, res) {
    if(checkToken(req.headers.authorization)) {
        logdata = ini_logdata;
        logdata.d_No = req.params.no;
        let query = mybatisMapper.getStatement('logdata', 'selectBasic', logdata, format);
        connection.query(query, function(err, rows){
            if(err){
                console.log(err);
                result.validation = false;
                result.message = '저장된 남은 사료양과 사료통 정보를 가져오는데 오류가 발생하였습니다';
                result.data = [];
                res.json(result);
                return;
            }


            result.validation = true;
            result.message = '저장된 남은 사료양과 사료통 정보 호출 성공';
            result.data = rows[0];
            res.json(result);
        });

        
    }
    else res.json(result);
};

const selectNew = function(req, res){
    if(checkToken(req.headers.authorization)) {
        logdata = ini_logdata;
        logdata.d_No = req.params.no;
        let get_query = mybatisMapper.getStatement('hw', 'getIP', logdata, format);
        connection.query(get_query, function(get_err, get_rows){
            if(get_err){
                console.log(get_err);
                result.validation = false;
                result.message = '현재 디바이스의 IP 정보를 가져오는 데 실패하였습니다';
                result.data = [];
                res.json(result);
                return;
            }
            device_IP = {value: get_rows[0].d_Ip+'/log'};
            const request = require('request');
            request.get(                
                {
                    url: device_IP.value
                },                 
                function(error, response, body){
                    if(error) {
                        console.log(error);
                        result.validation = false;
                        result.message = '현재 디바이스의 사료 남은양과 사료통 정보를 갱신하는데 실패하였습니다';
                        result.data = [];
                        res.json(result);
                        return;
                    }
                    if(body.includes('update')){
                        console.log('logdata renewal ok');
                        result.validation = true;
                        result.message = '현재 디바이스의 사료 남은양과 사료통 정보를 갱신하였습니다';
                        result.data = [];    
                        res.json(result);                             
                    }
                    else{
                        console.log('logdata renewal fail');
                        result.validation = false;
                        result.message = '현재 디바이스의 사료 남은양과 사료통 정보를 갱신하는데 실패하였습니다';
                        result.data = [];
                        res.json(result);
                    }
                    
            });
        });
    }
    else res.json(result);
};

var bars = [];

const selectChart = function (req, res) {
    if(checkToken(req.headers.authorization)) {
        let temp = {d_No: 0};
        temp.d_No = req.params.no;
        let query = mybatisMapper.getStatement('logdata', 'selectChart', temp, format);
        connection.query(query, function(err, rows) {
            if(err){
                result.validation = false;
                result.message = '로그 데이터를 호출하는데 오류가 발생하였습니다';
                result.data = [];
                res.json(result);
            }
            if(!rows[0]){
                console.log("selectChart fail");
                result.validation = false;
                result.message = '로그 데이터가 존재하지 않습니다';
                result.data = [];
                res.json(result);
            }
            else{
                for(var i = rows.length-1; i>=0; i--){
                    var bars_type = {
                        label : '00-00',
                        items : [
                            {
                                value: 0,
                                
                            }
                        ],
                        l_Amount: 0
                    }
                    bars_type.label = rows[i].l_Time2;
                    bars_type.items[0].value = rows[i].l_Eat;
                    bars_type.l_Amount = rows[i].l_Amount;
                    bars.push(bars_type);
                }
                result.validation = true;
                result.message = '해당 기기의 로그 데이터 호출 성공';
                result.data = bars;
                res.json(result);
                bars = [];
            }        
        });
    }
    else res.json(result);
}

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
    selectBasic: selectBasic,
    selectChart: selectChart,
    selectNew: selectNew
};