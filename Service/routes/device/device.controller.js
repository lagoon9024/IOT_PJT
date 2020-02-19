const mysql = require('mysql');
const dbconfig = require('../../config/database.js');
const connection = mysql.createConnection(dbconfig);

const jwt = require('jsonwebtoken');
const secretKey = require("../../config/jwt");

// . : 현재 폴더 경로, .. : 상위 폴더
const mybatisMapper = require('mybatis-mapper');
mybatisMapper.createMapper(['./mapper/device.xml']);
mybatisMapper.createMapper(['./mapper/logdata.xml']);
let format = {language: 'sql', indent: ' '};

var ini_device = {
    d_No: 0,
    u_No: 0,    
    d_Name: 'd_Name',
    d_Age: 'd_Age',
    d_Bday: '0000-00-00',
    d_Species: 'd_Species',
    d_Weight: 'd_Weight',
    SerialNo: 'SerialNo',
    UUID: 'UUID',
    d_Ip: 'd_Ip'
};

var result = {
    validation: false,
    message: '',
    data: []
};

const selectAll = function (req, res) {
    if(checkToken(req.headers.authorization)) {
        device = ini_device;
        device.u_No = req.params.no;
        let query = mybatisMapper.getStatement('device', 'selectAll', device, format);
        connection.query(query, function(err, rows) {
            if(err) {
                console.log(err);
                result.validation = false;
                result.message = '해당 유저의 전체 Device 데이터를 불러오는 데 오류가 발생하였습니다';
                result.data = [];
                res.json(result);
                return;
            }
            console.log('device selectAll ok: ' + device.u_No);
            result.validation = true;
            result.message = '해당 유저의 전체 Device 호출 성공';
            result.data = rows;
            res.json(result);
        });
    }
    else res.json(result);
};

const selectOne = function (req, res) {
    if(checkToken(req.headers.authorization)) {
        device = ini_device;
        device.d_No = req.params.no;
        let query = mybatisMapper.getStatement('device', 'selectOne', device, format);
        connection.query(query, function(err, rows) {
            if(err) {
                console.log(err);
                result.validation = false;
                result.message = '해당 Device 데이터를 불러오는 데 오류가 발생하였습니다';
                result.data = [];
                res.json(result);
                return;
            }            
            console.log('device selectOne ok: ' + device.d_No);
            result.validation = true;
            result.message = '해당 Device 정보 호출 성공';
            result.data = rows[0];
            res.json(result);
        });
    }
    else res.json(result);
};

const checkSerial = function (req, res) {
    if(checkToken(req.headers.authorization)) {
        device = ini_device;
        device.SerialNo = req.params.no;
        let query = mybatisMapper.getStatement('device', 'checkSerial', device, format);
        connection.query(query, function(err, rows) {
            if(err) {
                console.log(err);
                result.validation = false;
                result.message = '해당 시리얼 번호를 확인 오류가 발생하였습니다';
                result.data = [];
                res.json(result);
                return;
            }
            if(rows[0]){
                console.log('device checkSerial ok: ' + device.SerialNo);
                result.validation = true;
                result.message = '해당 시리얼 번호와 일치하는 UUID 확인 완료'
                result.data = [];
                res.json(result);                
            }
            else{
                console.log('device checkSerial fail: ' + device.SerialNo);
                result.validation = false;
                result.message = '해당 시리얼 번호와 일치하는 UUID가 존재하지 않습니다'
                result.data = [];
                res.json(result);                
            }
        });
    }
    else res.json(result);
};

const add = function (req, res) {
    if(checkToken(req.headers.authorization)) { 
        device = ini_device;
        device = {...device , ...req.body}; //u_No, d_Name, d_Age, (d_Bday) d_Species, d_Weight, SerialNo
        if(device.d_Bday == '') device.d_Bday = null;
        let check_query = mybatisMapper.getStatement('device', 'deviceCheck', device, format);
        connection.query(check_query, function(check_err, check_rows){
            if(check_err) {
                console.log(check_err);
                result.validation = false;
                result.message = '해당 기기 등록 여부를 확인하던 중 오류가 발생하였습니다';
                result.data = [];
                res.json(result);
                return;
            }
            if(check_rows[0]){
                console.log('Device add fail: ' + device.d_Name);
                result.validation = false;
                result.message = '해당 기기는 이미 등록되어 있습니다';
                result.data = [];
                res.json(result);
            }
            else{
                let query = mybatisMapper.getStatement('device', 'addDevice', device, format);
                connection.query(query, function(err, rows){
                    if(err) {
                        console.log(err);
                        result.validation = false;
                        result.message = '기기 등록 중 오류가 발생하였습니다';
                        result.data = [];
                        res.json(result);
                        return;
                    }
                    let get_query = mybatisMapper.getStatement('device', 'getDevice', device, format);
                    connection.query(get_query, function(get_err, get_rows){
                        if(get_err) {
                            console.log(get_err);
                            result.validation = false;
                            result.message = '기기를 등록 후 기기 번호를 가져오던 중 오류가 발생하였습니다';
                            result.data = [];
                            res.json(result);
                            return;
                        }
                        device.d_No = get_rows[0].d_No;
                        let change_query = mybatisMapper.getStatement('device', 'changeLast', device, format);
                        connection.query(change_query, function(change_err, change_rows){
                            if(change_err) {
                                console.log(change_err);
                                result.validation = false;
                                result.message = '유저의 최신 기기 번호를 갱신하던 중 오류가 발생하였습니다';
                                result.data = [];
                                res.json(result);
                                return;
                            }
                            if(change_rows.changedRows>0) {
                                console.log('Device add ok: ' + device.d_Name);
                                result.validation = true;
                                result.message = '기기 등록 후 유저의 최신 기기 번호 갱신 성공'
                                result.data = {d_No: device.d_No};
                                res.json(result);
                                ini_logdata_add(device.d_No);
                            }
                            else {
                                result.validation = false;
                                result.message = '유저의 최신 기기 번호를 갱신하는 데 실패하였습니다';
                                result.data = [];
                                res.json(result);                                    
                            }
                        });                        
                    });
                });            
            }
        });               
    }
    else res.json(result);
};

const update = function (req, res) {
    if(checkToken(req.headers.authorization)) {
        device = ini_device;
        device = {...device , ...req.body}; //d_No, d_Name, d_Age, #{d_Bday}, d_Species, d_Weight
        if(device.d_Bday == '') device.d_Bday = null;
        let query = mybatisMapper.getStatement('device', 'updateDevice', device, format);
        connection.query(query, function(err, rows) {
            if(err) {
                console.log(err);
                result.validation = false;
                result.message = '기기 정보를 수정하던 중 오류가 발생하였습니다';
                result.data = [];
                res.json(result);
                return;
            }
            console.log('device update ok: ' + device.d_No);
            result.validation = true;
            result.message = '기기 수정 성공';
            result.data = [];
            res.json(result);
        });
    }
    else res.json(result);
};

var del_temp = {no: 0};

const del = function (req, res) {
    if(checkToken_del(req.headers.authorization)) {
        device = ini_device;
        device.d_No = req.params.no;
        device.u_No = del_temp.no;
        let query = mybatisMapper.getStatement('device', 'deleteDevice', device, format);
        connection.query(query, function(err, rows) {
            if(err) {
                console.log(err);
                result.validation = false;
                result.message = '기기 정보를 삭제하던 중 오류가 발생하였습니다';
                result.data = [];
                res.json(result);
                return;
            }
            console.log('device delete ok: ' + device.d_No);
            let del_query = mybatisMapper.getStatement('device', 'deleteLast', device, format);
            connection.query(del_query, function(del_err, del_rows){
                if(del_err) {
                    console.log(del_err);
                    result.validation = false;
                    result.message = '유저의 최신 기기 번호를 삭제하던 중 오류가 발생하였습니다';
                    result.data = [];
                    res.json(result);
                    return;
                }                
                let get_query = mybatisMapper.getStatement('device', 'getLast', device, format);
                connection.query(get_query, function(get_err, get_rows){
                    if(get_err) {
                        console.log(get_err);
                        result.validation = false;
                        result.message = '유저의 최신 기기 번호를 갱신하던 중 오류가 발생하였습니다';
                        result.data = [];
                        res.json(result);
                        return;
                    }
                    result.validation = true;
                    result.message = '기기 정보 삭제 후 유저의 최신 기기 번호 갱신 성공';
                    result.data = get_rows[0];
                    res.json(result);
                    del_temp.no = 0;
                });                
            });
        });
    }
    else res.json(result);
};

function ini_logdata_add(no){
    log_temp = {d_No: no};
    let query = mybatisMapper.getStatement('logdata', 'deviceAdd', log_temp, format);
    connection.query(query, function(err, rows) {
        if(err) {
            console.log(err);
            return;
        }
        console.log('logdata deviceAdd ok: ' + no);
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

function checkToken_del(token){
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
            del_temp.no = decoded.u_No;
            tempToken = true;
        }
    });
    return tempToken;
}

module.exports = {
    selectAll: selectAll,
    selectOne: selectOne,
    checkSerial: checkSerial,
    add: add,
    update: update,
    del: del
};