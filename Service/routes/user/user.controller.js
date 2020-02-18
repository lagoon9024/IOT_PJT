const mysql = require('mysql'); //mysql 사용
const dbconfig = require('../../config/database.js'); //dbconfig: 데이터베이스 접속 환경 설정
const connection = mysql.createConnection(dbconfig); //connection: mysql 연결

const jwt = require('jsonwebtoken');
const secretKey = require("../../config/jwt");

// . : 현재 폴더 경로, .. : 상위 폴더
const mybatisMapper = require('mybatis-mapper'); //mybatis-mapper 사용
mybatisMapper.createMapper(['./mapper/user.xml']); //createMapper: 작성된 Mapper Load
let format = {language: 'sql', indent: ' '};

var ini_user = {
    u_No: 0,
    u_Id: 'u_Id',
    u_Pw: 'u_Pw',
    u_Name: 'u_Name',
    u_Email: 'u_Email',
    u_Last: 0
};

var refresh = {no: 0};

var result = {
    validation: false,
    message: '',
    data: []
};

//전체 User 데이터 호출
const selectAll = function (req, res) {
    //getStatement('Namespace 이름', 'Sql ID', 'Prameters', 'format')
    let query = mybatisMapper.getStatement('user', 'selectAll', format);
    connection.query(query, function(err, rows) {
        if(err) { //throw err;
            console.log(err);
            result.validation = false;
            result.message = '전체 User 데이터를 불러오던 중 오류가 발생하였습니다';
            result.data = [];            
            res.json(result);
            return;
        }
        console.log('User selectAll ok');
        result.validation = true;
        result.message = '전체 User 데이터 호출 성공';
        result.data = rows;
        res.json(result);
    });    
};

//U_No에 맞는 데이터 호출
const selectOne = function (req, res) {
    if(checkToken(req.headers.authorization, req.params.no)) {
        user = ini_user;
        user.u_No = req.params.no;
        let query = mybatisMapper.getStatement('user', 'selectOne', user, format);
        connection.query(query, function(err, rows) {
            if(err) {      
                console.log(err);
                result.validation = false;
                result.message = '해당 User 데이터를 불러오던 중 오류가 발생하였습니다';
                result.data = [];                
                res.json(result);
                return;
            }
            if(rows[0]){       
                console.log('User selectOne ok: ' + user.u_No);
                result.validation = true;
                result.message = '해당 User 데이터 호출 성공';
                result.data = rows[0];
                res.json(result);
            }
            else{
                console.log('User selectOne fail: ' + user.u_No);
                result.validation = false;
                result.message = '해당 User 데이터가 존재하지 않습니다';
                res.data = [];
                res.json(result);
            }            
        });
    }
    else res.json(result);
};

//새로고침 후 u_No, u_Last 호출
const userMain = function (req, res) {
    if(checkMain(req.params.token)) {
        user = ini_user;
        user.u_No = refresh.no;
        let query = mybatisMapper.getStatement('user', 'userMain', user, format);
        connection.query(query, function(err, rows) {
            if(err) {      
                console.log(err);
                result.validation = false;
                result.message = '새로고침 후 User 데이터를 불러오던 중 오류가 발생하였습니다';
                result.data = [];
                res.json(result);
                return;
            }
            if(rows[0]){
                console.log('User selectOne ok: ' + user.u_No);
                result.validation = true;
                result.message = '새로고침 후 User 데이터 호출 성공';
                result.data = rows[0];
                res.json(result);
                refresh.no = 0;
            }
            else{
                console.log('User selectOne fail: ' + user.u_No);
                result.validation = false;
                result.message = '해당 User 데이터가 존재하지 않습니다';
                res.data = [];
                res.json(result);
            }            
        });
    }
    else res.json(result);
};

//id 중복 확인
const idCheck = function (req, res) {
    user = ini_user;
    user.u_Id = req.params.id;
    let query = mybatisMapper.getStatement('user', 'idCheck', user, format);
    connection.query(query, function(err, rows) {
        if(err) {      
            console.log(err);
            result.validation = false;            
            result.message = 'ID 중복 확인하는 중 오류가 발생하였습니다';
            result.data = [];
            res.json(result);
            return;            
        }
        if(rows[0]){
            console.log('User idCheck fail: ' + user.u_Id);
            result.validation = false;
            result.message = '해당 ID는 이미 사용 중입니다.';
        }
        else{
            console.log('User idCheck ok: ' + user.u_Id);
            result.validation = true;
            result.message = '사용 가능한 ID입니다.';
            result.data = [];
            res.json(result);
        }
        result.data = [];
        res.json(result);    
    });
};

//회원가입
const add = function (req, res) {
    user = ini_user;
    user = {...user , ...req.body}; //u_Id, u_Pw, u_Name, u_Email
    let query = mybatisMapper.getStatement('user', 'addUser', user, format);
    connection.query(query, function(err, rows) {
        if(err) {      
            result.validation = false;            
            result.message = '회원 가입 중 오류가 발생하였습니다';
            result.data = [];
            res.json(result);
            return;            
        }
        console.log('User add ok: ' + user.u_Id);
        result.validation = true;
        result.message = '회원 가입 성공';
        result.data = [];
        res.json(result);
    });
};

//로그인
const login = function (req, res) {
    user = ini_user;
    user = {...user , ...req.body}; //u_Id, u_Pw
    let query = mybatisMapper.getStatement('user', 'loginUser', user, format);
    connection.query(query, function(err, rows) {
        if(err) {      
            console.log(err);
            result.validation = false;
            result.message = '로그인 중 오류가 발생하였습니다';
            result.data = [];            
            res.json(result);
            return;            
        }
        if(rows[0]){
            console.log('User login check ok: ' + user.u_Id);
            user.u_No = rows[0].u_No;
            var payload = {u_No: user.u_No};
            var options = {expiresIn: '59m'}; //만료 시간
            jwt.sign(payload, secretKey.secret, options, function(err, token){
                if(err) {
                    console.log(err);
                    result.validation = false;
                    result.message = '토큰 발급 중 오류가 발생하였습니다';
                    result.data = [];            
                    res.json(result);
                    return;
                }
                var login_data = {
                    u_No: rows[0].u_No,
                    u_Last: rows[0].u_Last,
                    Token: token
                };
                console.log('send login token ok');
                result.validation = true;
                result.message = '토큰 발급 성공';
                result.data = login_data;
                res.json(result);
            });
        }
        else{
            console.log('User login fail: ' + user.u_Id);
            result.validation = false;
            result.message = '아이디와 패스워드를 다시 확인해주세요!';
            result.data = [];            
            res.json(result);
        }
    });    
};

//회원 정보 수정
const update = function (req, res) {
    if(checkToken(req.headers.authorization, req.body.u_No)) {
        user = ini_user;
        user = {...user, ...req.body}; //u_No, u_Name, u_Email
        let query = mybatisMapper.getStatement('user', 'updateUser', user, format);
        connection.query(query, function(err, rows) {
            if(err) {      
                console.log(err);
                result.validation = false;
                result.message = '회원 정보 수정 중 오류가 발생하였습니다';
                result.data = [];                
                res.json(result);
                return;            
            }
            console.log('User update ok: ' + user.u_Id);
            result.validation = true;
            result.message = '회원 정보 수정 성공';
            result.data = [];
            res.json(result);          
        });        
    }
    else res.json(result);
};

//비밀번호 수정
const updatePass = function (req, res) {
    if(checkToken(req.headers.authorization, req.body.u_No)) {
        user = ini_user;
        user = {...user, ...req.body};
        let query = mybatisMapper.getStatement('user', 'updatePass', user, format);
        connection.query(query, function(err, rows) {
            if(err) {      
                console.log(err);
                result.validation = false;
                result.message = '비밀번호 수정 중 오류가 발생하였습니다';
                result.data = [];                
                res.json(result);
                return;            
            }
            console.log('User password update ok: ' + user.u_No);
            result.validation = true;
            result.message = '비밀번호 변경 성공';
            result.data = [];
            res.json(result);
        });
    }
    else res.json(result);
};

//회원 정보 삭제
const del = function (req, res) {
    if(checkToken(req.headers.authorization, req.params.no)) {
        user = ini_user;
        user.u_No = req.params.no;
        let query = mybatisMapper.getStatement('user', 'deleteUser', user, format);
        connection.query(query, function(err, rows) {
            if(err) {      
                console.log(err);
                result.validation = false;
                result.message = '회원 정보 삭제 중 오류가 발생하였습니다';
                result.data = [];                
                res.json(result);
                return;            
            }
            if(rows.affectedRows>0){
                console.log('User delete ok: ' + user.u_No);
                result.validation = true;
                result.message = '회원 정보 삭제 성공';
                result.data = [];
                res.json(result);
            }
            else{
                console.log('User delete fail: ' + user.u_No);
                result.validation = false;
                result.message = '삭제할 회원 정보가 존재하지 않습니다';
                result.data = [];
                res.json(result);
            }
        });
    }
    else res.json(result);
};

function checkToken(token, no) {
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
            if(decoded.u_No == no) {
                tempToken = true;
            }
            else{
                console.log('토큰에 권한이 없습니다.');
                result.validation = false;
                result.message = '권한이 없습니다!';
                result.data = [];
                tempToken = false;
            }
        }
    });
    return tempToken;
}

function checkMain(token) {
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
            refresh.no = decoded.u_No;
            tempToken = true;
        }
    });
    return tempToken;
}

module.exports = {
    selectAll: selectAll,
    selectOne: selectOne,
    userMain: userMain,
    idCheck: idCheck,
    add: add,
    login: login,
    update: update,
    updatePass: updatePass,
    del: del
};