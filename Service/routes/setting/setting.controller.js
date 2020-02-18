const mysql = require('mysql');
const dbconfig = require('../../config/database.js');
const connection = mysql.createConnection(dbconfig);

const jwt = require('jsonwebtoken');
const secretKey = require("../../config/jwt");

// . : 현재 폴더 경로, .. : 상위 폴더
const mybatisMapper = require('mybatis-mapper');
mybatisMapper.createMapper(['./mapper/setting.xml']);
mybatisMapper.createMapper(['./mapper/hw.xml']);
let format = {language: 'sql', indent: ' '};

var ini_setting = {
    s_No: 0,
    d_No: 0,
    s_Time: 's_Time',
    s_Amount: 0
};

var result = {
    validation: false,
    message: '',
    data: []
};

const selectAll = function (req, res) {
    if(checkToken(req.headers.authorization)) {
        let query = mybatisMapper.getStatement('setting', 'selectAll', format);
        connection.query(query, function(err, rows) {
            if(err) {
                console.log(err);
                result.validation = false;
                result.message = '전체 Setting 데이터를 불러오는 데 오류가 발생하였습니다';
                result.data = [];
                res.json(result);
                return;
            }
            console.log('Setting selectAll ok');
            result.validation = true;
            result.message = '전체 Setting 데이터 호출 성공';
            result.data = rows;
            res.json(result);
        });
    }
    else res.json(result);
};

const selectOne = function (req, res) {
    if(checkToken(req.headers.authorization)) {
        setting = ini_setting;
        setting.d_No = req.params.no;
        let query = mybatisMapper.getStatement('setting', 'selectOne', setting, format);
        connection.query(query, function(err, rows) {
            if(err) {
                console.log(err);
                result.validation = false;
                result.message = '해당 기기의 Setting 데이터를 불러오는 데 오류가 발생하였습니다';
                result.data = [];
                res.json(result);
                return;
            }
            console.log('Setting selectOne ok: ' + setting.d_No);
            result.validation = true;
            result.message = '해당 기기의 Setting 데이터 호출 성공';
            result.data = rows;            
            res.json(result);
        });
    }
    else res.json(result);
};

const add = function (req, res) {
    if(checkToken(req.headers.authorization)) {
        setting = ini_setting;
        setting = {...setting , ...req.body}; //d_No, s_Time, s_Amount
        let check_query = mybatisMapper.getStatement('setting', 'settingCheck', setting, format);
        connection.query(check_query, function(check_err, check_rows){
            if(check_err) {
                console.log(check_err);
                result.validation = false;
                result.message = '해당 Setting 시간을 중복 확인하는 데 오류가 발생하였습니다';
                result.data = [];
                res.json(result);
                return;
            }
            if(check_rows[0]){
                console.log('Setting add fail: ' + setting.s_Time);
                result.validation = false;
                result.message = '해당 Setting 시간이 이미 존재합니다';
                result.data = [];
                res.json(result);
            }
            else{
                let query = mybatisMapper.getStatement('setting', 'addSetting', setting, format);
                connection.query(query, function(err, rows) {
                    if(err) {
                        console.log(err);
                        result.validation = false;
                        result.message = '해당 Setting 데이터를 등록하는 데 오류가 발생하였습니다';
                        result.data = [];
                        res.json(result);
                        return;
                    }
                    console.log('Setting add ok: ' + setting.s_Time);
                    res.validation = true;
                    result.message = 'Setting 데이터 등록 성공';
                    result.data = [];
                    res.json(result);
                    update_hw_setting(setting.d_No);
                });                
            }
        });    
    }
    else res.json(result);
};

const update = function (req, res) {
    if(checkToken(req.headers.authorization)) {
        setting = ini_setting;
        setting = {...setting , ...req.body}; //s_No, s_Time, s_Amount
        let check_query = mybatisMapper.getStatement('setting', 'settingCheck2', setting, format);
        connection.query(check_query, function(check_err, check_rows){
            if(check_err) {
                console.log(check_err);
                result.validation = false;
                result.message = '해당 Setting 시간을 중복 확인하는 데 오류가 발생하였습니다';
                result.data = [];
                res.json(result);
                return;
            }
            if(check_rows[0]){
                console.log('Setting add fail: ' + setting.s_Time);
                result.validation = false;
                result.message = '해당 Setting 시간이 이미 존재합니다';
                result.data = [];
                res.json(result);
            }
            else{
                let query = mybatisMapper.getStatement('setting', 'updateSetting', setting, format);
                connection.query(query, function(err, rows) {
                    if(err) {
                        console.log(err);
                        result.validation = false;
                        result.message = '해당 Setting 데이터를 수정하는 데 오류가 발생하였습니다';
                        result.data = [];
                        res.json(result);
                        return;
                    }
                    console.log('Setting update ok: ' + setting.s_No);
                    result.validation = true;
                    result.message = 'Setting 데이터 수정 성공';
                    result.data = [];
                    res.json(result);
                    let get_query = mybatisMapper.getStatement('setting', 'getDeviceNo', setting, format);
                    connection.query(get_query, function(get_err, get_rows){
                        if(get_err) console.log(get_err);
                        update_hw_setting(get_rows[0].d_No);
                    });
                });
            }
        });        
    }
    else res.json(result);
};

const del = function (req, res) {
    if(checkToken(req.headers.authorization)) {
        setting = ini_setting;
        setting.s_No = req.params.no;
        let get_query = mybatisMapper.getStatement('setting', 'getDeviceNo', setting, format);
        connection.query(get_query, function(get_err, get_rows){
            if(get_err) {
                console.log(get_err);
                result.validation = false;
                result.message = '해당 Setting 데이터의 Device 번호를 호출하는 데 오류가 발생하였습니다';
                result.data = [];
                res.json(result);
                return;
            }
            setting.d_No = get_rows[0].d_No;            
        });
        let query = mybatisMapper.getStatement('setting', 'deleteSetting', setting, format);
        connection.query(query, function(err, rows) {
            if(err) {
                console.log(err);
                result.validation = false;
                result.message = '해당 Setting 데이터를 삭제하는 데 오류가 발생하였습니다';
                result.data = [];
                res.json(result);
                return;
            }            
            if(rows.affectedRows>0){
                console.log('Setting delete ok: ' + setting.s_No);
                result.validation = true;
                result.message = 'Setting 데이터 삭제 성공';
                result.data = [];
                res.json(result);
                update_hw_setting(setting.d_No);
            }
            else{
                console.log('Setting delete fail: ' + setting.s_No);
                result.validation = false;
                result.message = '삭제할 해당 Setting 데이터가 존재하지 않습니다';
                result.data = [];
                res.json(result);
            }
        });
    }
    else res.json(result);
};

function update_hw_setting(no) { //setting 정보 수정 시 hw에 전송, 삭제, 등록
    setting = ini_setting;
    setting.d_No = no;
    hw_temp = {ip: ''};
    //device IP 받기
    let get_query = mybatisMapper.getStatement('hw', 'getIP', setting, format);
    connection.query(get_query, function(get_err, get_rows){
        if(get_err) console.log(get_err);
        hw_temp.ip = get_rows[0].d_Ip;
    });
    //hw update 요청 보내기
    let query = mybatisMapper.getStatement('hw', 'updateHWsetting', setting, format);
    connection.query(query, function(err, rows) {
        if(err) console.log(err);
        console.log('Setting update_hw ok: ' + setting.d_No);
        const request = require('request');
        const res= request.post(
            {
                headers: {'content-type': 'application/json'},
                url: hw_temp.ip + '/timeset/update', 
                body: rows,
                json: true
            }, 
            function(error, response, body){
                if(error) console.log(error);
                console.log(body);
        });
        console.log("response success : " + {...res});      
        console.log("Setting update_hw completed");
    });
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
    selectAll: selectAll,
    selectOne: selectOne,
    add: add,
    update: update,
    del: del
};