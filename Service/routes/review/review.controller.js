const mysql = require('mysql');
const dbconfig = require('../../config/database.js');
const connection = mysql.createConnection(dbconfig);

const jwt = require('jsonwebtoken');
const secretKey = require("../../config/jwt");

// . : 현재 폴더 경로, .. : 상위 폴더
const mybatisMapper = require('mybatis-mapper');
mybatisMapper.createMapper(['./mapper/review.xml']);
let format = {language: 'sql', indent: ' '};

var ini_review = { //type 모두 String으로 변환하고 Test
    r_No: 0,
    u_No: 0,
    f_No: 0,    
    r_Rank: 1.1,
    r_Date: 'r_Date',
    r_Positive: 'r_Positive',
    r_Negative: 'r_Negative'
};

var result = {
    validation: false,
    message: '',
    data: []    
};

const selectBasic = function (req, res) {
    if(checkToken(req.headers.authorization)) {
        review = ini_review;
        review.u_No = req.params.uno;
        review.f_No = req.params.no;
        var getData = {
            rank: 1.1,
            list: []
        };
        let get_query = mybatisMapper.getStatement('review', 'getRank', review, format);
        connection.query(get_query, function(get_err, get_rows){
            if(get_err){
                result.validation = false;
                result.message = '해당 사료의 평균 별점을 호출하는데 오류가 발생하였습니다';
                result.data = [];
                res.json(result);
                return;
            }
            getData.rank = get_rows[0];
            let query = mybatisMapper.getStatement('review', 'selectBasic', review, format);
            connection.query(query, function(err, rows) {
                if(err){
                    result.validation = false;
                    result.message = '해당 사료의 모든 리뷰를 호출하는데 오류가 발생하였습니다';
                    result.data = [];
                    res.json(result);
                    return;
                }
                console.log('review selectBasic ok: ' + review.f_No);
                result.validation = true;
                result.message = '해당 사료의 모든 리뷰 호출 성공';
                getData.list = rows;
                result.data = getData;
                res.json(result);
            });
        });        
    }
    else res.json(result);
};

const selectBest = function (req, res) {
    if(checkToken(req.headers.authorization)) {
        review = ini_review;
        review.u_No = req.params.uno;
        review.f_No = req.params.no;
        var getData = {
            rank: 1.1,
            list: []
        };
        let get_query = mybatisMapper.getStatement('review', 'getRank', review, format);
        connection.query(get_query, function(get_err, get_rows){
            if(get_err){
                result.validation = false;
                result.message = '해당 사료의 평균 별점을 호출하는데 오류가 발생하였습니다';
                result.data = [];
                res.json(result);
                return;
            }
            getData.rank = get_rows[0];
            let query = mybatisMapper.getStatement('review', 'selectBest', review, format);
            connection.query(query, function(err, rows) {
                if(err){
                    result.validation = false;
                    result.message = '해당 사료의 모든 리뷰를 호출하는데 오류가 발생하였습니다';
                    result.data = [];
                    res.json(result);
                    return;
                }
                console.log('review selectBest ok: ' + review.f_No);
                result.validation = true;
                result.message = '해당 사료의 모든 리뷰 호출 성공';
                getData.list = rows;
                result.data = getData;
                res.json(result);
            });
        });        
    }
    else res.json(result);
};

const selectNew = function (req, res) {
    if(checkToken(req.headers.authorization)) {
        review = ini_review;
        review.u_No = req.params.uno;
        review.f_No = req.params.no;
        var getData = {
            rank: 1.1,
            list: []
        };
        let get_query = mybatisMapper.getStatement('review', 'getRank', review, format);
        connection.query(get_query, function(get_err, get_rows){
            if(get_err){
                result.validation = false;
                result.message = '해당 사료의 평균 별점을 호출하는데 오류가 발생하였습니다';
                result.data = [];
                res.json(result);
                return;
            }
            getData.rank = get_rows[0];
            let query = mybatisMapper.getStatement('review', 'selectNew', review, format);
            connection.query(query, function(err, rows) {
                if(err){
                    result.validation = false;
                    result.message = '해당 사료의 모든 리뷰를 호출하는데 오류가 발생하였습니다';
                    result.data = [];
                    res.json(result);
                    return;
                }
                console.log('review selectNew ok: ' + review.f_No);
                result.validation = true;
                result.message = '해당 사료의 모든 리뷰 호출 성공';
                getData.list = rows;
                result.data = getData;
                res.json(result);
            });
        });        
    }
    else res.json(result);
};

const selectOne = function (req, res) {
    if(checkToken(req.headers.authorization)) {
        review = ini_review;
        review.r_No = req.params.no;
        let query = mybatisMapper.getStatement('review', 'selectOne', review, format);
        connection.query(query, function(err, rows) {
            if(err){
                console.log(err);
                result.validation = false;
                result.message = '해당 리뷰를 호출하는데 오류가 발생하였습니다';
                result.data = [];
                res.json(result);
                return;
            }
            console.log('review selectOne ok: ' + review.r_No);
            result.validation = true;
            result.message = '해당 리뷰 호출 성공';
            result.data = rows[0];
            res.json(result);
        });
    }
    else res.json(result);
};

const add = function (req, res) {
    if(checkToken(req.headers.authorization)) {
        review = ini_review;
        review = {...review , ...req.body}; //u_No, f_No, r_Rank, r_Positive, r_Negative 
        let query = mybatisMapper.getStatement('review', 'addReview', review, format);
        connection.query(query, function(err, rows){
            if(err){
                console.log(err);
                result.validation = false;
                result.message = '해당 리뷰를 등록하는데 오류가 발생하였습니다';
                result.data = [];
                res.json(result);
                return;
            }
            result.validation = true;
            result.message = '리뷰 등록 성공';
            result.data = [];
            res.json(result);
        });
    }
    else res.json(result);
};

const updateGood = function (req, res) {
    if(checkToken(req.headers.authorization)) {
        var good = {
            g_No: 0,
            u_No: 0,
            r_No: 0
        }
        good = {...good, ...req.body}; //u_No, r_No
        let get_query = mybatisMapper.getStatement('review', 'checkGood', good, format);
        connection.query(get_query, function(get_err, get_rows){
            if(get_err){
                console.log(get_err);
                result.validation = false;
                result.message = '해당 리뷰의 추천 정보를 확인하는데 오류가 발생하였습니다';
                result.data = [];
                res.json(result);
                return;
            }
            if(get_rows[0]){
                good.g_No = get_rows[0].g_No;
                let del_query = mybatisMapper.getStatement('review', 'delGood', good, format);
                connection.query(del_query, function(del_err, del_rows){
                    if(del_err){
                        console.log(del_err);
                        result.validation = false;
                        result.message = '해당 리뷰의 추천 정보를 삭제하는데 오류가 발생하였습니다';
                        result.data = [];
                        res.json(result);
                        return;
                    }
                    console.log('Good delete OK');
                    result.validation = true;
                    result.message = '해당 리뷰 추천을 취소하였습니다';
                    result.data = [];
                    res.json(result);
                });
            }
            else{
                let add_query = mybatisMapper.getStatement('review', 'addGood', good, format);
                connection.query(add_query, function(add_err, add_rows){
                    if(add_err){
                        console.log(add_err);
                        result.validation = false;
                        result.message = '해당 리뷰의 추천 정보를 추가하는데 오류가 발생하였습니다';
                        result.data = [];
                        res.json(result);
                        return;
                    }
                    console.log('Good add OK');
                    result.validation = true;
                    result.message = '해당 리뷰를 추천하였습니다';
                    result.data = [];
                    res.json(result);
                });
            }
        });
    }
    else res.json(result);
};

const update = function (req, res) {
    if(checkToken(req.headers.authorization)) {
        review = ini_review;
        review = {...review, ...req.body}; //r_Rank, r_Positive, r_Negative, r_No
        let query = mybatisMapper.getStatement('review', 'updateReview', review, format);
        connection.query(query, function(err, rows) {
            if(err){
                console.log(err);
                result.validation = false;
                result.message = '해당 리뷰를 수정하는데 오류가 발생하였습니다';
                result.data = [];
                res.json(result);
                return;
            }
            console.log('review update ok: ' + review.r_No);
            result.validation = true;
            result.message = '해당 리뷰 수정 성공';
            result.data = [];
            res.json(result);
        });
    }
    else res.json(result);
};

const del = function (req, res) {
    if(checkToken(req.headers.authorization)) {
        review = ini_review;
        review.r_No = req.params.no;
        let query = mybatisMapper.getStatement('review', 'deleteReview', review, format);
        connection.query(query, function(err, rows) {
            if(err){
                console.log(err);
                result.validation = false;
                result.message = '해당 리뷰를 삭제하는데 오류가 발생하였습니다';
                result.data = [];
                res.json(result);
                return;
            }            
            console.log('review delete ok: ' + review.r_No);
            result.validation = true;
            result.message = '해당 리뷰 삭제 성공';
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
    selectBasic: selectBasic,
    selectBest: selectBest,
    selectNew: selectNew,
    selectOne: selectOne,
    add: add,
    updateGood: updateGood,
    update: update,
    del: del    
};