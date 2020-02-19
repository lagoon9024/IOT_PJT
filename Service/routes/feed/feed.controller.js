const mysql = require('mysql');
const dbconfig = require('../../config/database.js');
const connection = mysql.createConnection(dbconfig);

const jwt = require('jsonwebtoken');
const secretKey = require("../../config/jwt");

// . : 현재 폴더 경로, .. : 상위 폴더
const mybatisMapper = require('mybatis-mapper');
mybatisMapper.createMapper(['./mapper/feed.xml']);
mybatisMapper.createMapper(['./mapper/ingredient.xml']);
let format = {language: 'sql', indent: ' '};

var ini_feed = {
    f_No: 0,
    f_Name: 'f_Name',
    f_Species: 'f_Species',
    f_Manufacturer: 'f_Manufacturer',
    f_Protein: 11.11,
    f_Fat: 11.11,
    f_Calcium: 11.11,
    f_Phosphorus: 11.11,
    f_Fiber: 11.11,
    f_Ash: 11.11,
    f_Moisture: 11.11
};

var result = {
    validation: false,
    message: '',
    data: []
};

const selectAll = function (req, res) {
    if(checkToken(req.headers.authorization)) {
        let query = mybatisMapper.getStatement('feed', 'selectAll', format);
        connection.query(query, function(err, rows) {
            if(err) {
                console.log(err);
                result.validation = false;
                result.message = '전체 Feed 데이터를 불러오는 데 오류가 발생하였습니다';
                result.data = [];
                res.json(result);
                return;
            }            
            console.log('Feed selectAll ok');
            result.validation = true;
            result.message = '전체 Feed 데이터 호출 성공';
            result.data = rows;
            res.json(result);
        });
    }
    else res.json(result);
};

const basic = function (req, res) {
    if(checkToken(req.headers.authorization)) {
        feed = ini_feed;
        feed.f_No = req.params.no;
        let query = mybatisMapper.getStatement('feed', 'selectBasic', feed, format);
        connection.query(query, function(err, rows) {
            if(err) {
                console.log(err);
                result.validation = false;
                result.message = '해당 Feed의 Basic 데이터를 불러오는 데 오류가 발생하였습니다';
                result.data = [];
                res.json(result);
                return;
            } 
            console.log('Feed selectBasic ok: ' + feed.f_No);
            result.validation = true;
            result.message = '해당 Feed의 Basic 데이터 호출 성공';
            result.data = rows[0];
            res.json(result);
        });
    }
    else res.json(result);
};

const nutrient = function (req, res) {
    if(checkToken(req.headers.authorization)) {
        feed = ini_feed;
        feed.f_No = req.params.no;
        let query = mybatisMapper.getStatement('feed', 'selectNutrient', feed, format);
        connection.query(query, function(err, rows) {
            if(err) {
                console.log(err);
                result.validation = false;
                result.message = '해당 Feed의 Nutrient 데이터를 불러오는 데 오류가 발생하였습니다';
                result.data = [];
                res.json(result);
                return;
            } 
            console.log('Feed selectNutrient ok: ' + feed.f_No);
            result.validation = true;
            result.message = '해당 Feed의 Nutrient 데이터 호출 성공';
            result.data = rows[0];
            res.json(result);
        });
    }
    else res.json(result);
};

const ingredient = function (req, res) {
    if(checkToken(req.headers.authorization)) {
        inputData = {f_No: 0};        
        inputData.f_No = req.params.no;
        returnData = {
            doubt: {
                count: 0,
                data: []
            },
            warning: {
                count: 0,
                data: []
            },
            basic: {
                count: 0,
                data: []
            }
        };
        let query1 = mybatisMapper.getStatement('ingredient', 'selectDoubt', inputData, format);
        connection.query(query1, function(err1, rows1){
            if(err1){
                console.log(err1);
                result.validation = false;
                result.message = '해당 사료의 의심 성분을 가져오는 데 오류가 발생하였습니다';
                result.data = [];
                res.json(result);
                return;
            }
            if(rows1[0]){
                returnData.doubt.count = rows1.length;
                returnData.doubt.data = rows1;
            }
            let query2 = mybatisMapper.getStatement('ingredient', 'selectWarning', inputData, format);
            connection.query(query2, function(err2, rows2){
                if(err2){
                    console.log(err2);
                    result.validation = false;
                    result.message = '해당 사료의 위험 성분을 가져오는 데 오류가 발생하였습니다';
                    result.data = [];
                    res.json(result);
                    return;
                }
                if(rows2[0]){
                    returnData.warning.count = rows2.length;
                    returnData.warning.data = rows2;
                }
                let query3 = mybatisMapper.getStatement('ingredient', 'selectBasic', inputData, format);
                connection.query(query3, function(err3, rows3){
                    if(err3){
                        console.log(err3);
                        result.validation = false;
                        result.message = '해당 사료의 기본 성분을 가져오는 데 오류가 발생하였습니다';
                        result.data = [];
                        res.json(result);
                        return;
                    }
                    if(rows3[0]){
                        returnData.basic.count = rows3.length;
                        returnData.basic.data = rows3;
                    }
                    console.log('Ingredient select OK');
                    result.validation = true;
                    result.message = '사료 재료 성분 데이터 호출 성공';
                    result.data = returnData;
                    res.json(result);
                });
            });
        });
    }
    else res.json(result);
};

const analysis = function (req, res) {
    if(checkToken(req.headers.authorization)) { 
        var inputData = {
            d_No: req.params.dno,
            f_No: req.params.fno
        };
        var getData = {
            d_Age: '중년기',
            d_Species: '강아지',
            f_Protein: 11.11,
            f_Fat: 11.11,
            f_Calcium: 1.11,
            f_Phosphorus: 1.11,
            f_Fiber: 1.11,
            f_Ash: 7.50,
            f_Moisture: 10.00            
        };
        var returnData = {
            f_Protein: 11.11,
            f_Fat: 11.11,
            f_Calcium: 1.11,
            f_Phosphorus: 1.11,      
            f_Ash: 7.50,            
            re_Protein: '적당',
            re_Fat: '적당',
            re_Calcium: '적당',
            re_Phosphorus: '적당',
            re_Ash: '적당'
        }        
        let query = mybatisMapper.getStatement('feed', 'getAnalysis', inputData, format);
        connection.query(query, function(err, rows) {
            if(err) {
                console.log(err);
                result.validation = false;
                result.message = '해당 Feed의 Analysis 데이터를 불러오는 데 오류가 발생하였습니다';
                result.data = [];
                res.json(result);
                return;
            } 
            console.log('Feed getAnalysis ok ');
            getData = {...getData, ...rows[0]};
            var temp = {value: 100.0 - getData.f_Moisture};
            returnData.f_Protein = (getData.f_Protein / temp.value * 100.0).toFixed(2);
            returnData.f_Fat = (getData.f_Fat / temp.value * 100.0).toFixed(2);
            returnData.f_Calcium = (getData.f_Calcium / temp.value * 100.0).toFixed(2);
            returnData.f_Phosphorus = (getData.f_Phosphorus / temp.value * 100.0).toFixed(2);
            returnData.f_Ash = (getData.f_Ash / temp.value * 100.0).toFixed(2);
            if(returnData.f_Ash < 6.0) returnData.re_Ash = '부족';
            else if(returnData.re_Ash > 10.0) returnData.re_Ash = '과다';
            if(getData.d_Age == '유아기' || getData.d_Age == '성장기'){
                if(getData.d_Species == '강아지'){
                    if(returnData.f_Protein < 22.5) returnData.re_Protein = '부족';                    
                    if(returnData.f_Fat < 8.5) returnData.re_Fat = '부족';
                    if(returnData.f_Calcium < 1.2) returnData.re_Calcium = '부족';
                    else if(returnData.f_Calcium > 2.5) returnData.re_Calcium = '과다'
                    if(returnData.f_Phosphorus < 1.0) returnData.re_Phosphorus = '부족';
                    else if(returnData.f_Phosphorus > 1.6) returnData.re_Phosphorus = '과다';
                }
                else if(getData.d_Species == '고양이'){
                    if(returnData.f_Protein < 30.0) returnData.re_Protein = '부족';                    
                    if(returnData.f_Fat < 9.0) returnData.re_Fat = '부족';
                    if(returnData.f_Calcium < 1.0) returnData.re_Calcium = '부족';                    
                    if(returnData.f_Phosphorus < 0.8) returnData.re_Phosphorus = '부족';                    
                }
            }
            else if(getData.d_Age == '중년기' || getData.d_Age == '노년기'){
                if(getData.d_Species == '강아지'){
                    if(returnData.f_Protein < 18.0) returnData.re_Protein = '부족';                    
                    if(returnData.f_Fat < 5.5) returnData.re_Fat = '부족';
                    if(returnData.f_Calcium < 0.5) returnData.re_Calcium = '부족';
                    else if(returnData.f_Calcium > 2.5) returnData.re_Calcium = '과다'
                    if(returnData.f_Phosphorus < 0.4) returnData.re_Phosphorus = '부족';
                    else if(returnData.f_Phosphorus > 1.6) returnData.re_Phosphorus = '과다';
                }
                else if(getData.d_Species == '고양이'){
                    if(returnData.f_Protein < 26.0) returnData.re_Protein = '부족';                    
                    if(returnData.f_Fat < 9.0) returnData.re_Fat = '부족';
                    if(returnData.f_Calcium < 0.6) returnData.re_Calcium = '부족';                    
                    if(returnData.f_Phosphorus < 0.5) returnData.re_Phosphorus = '부족';
                }
            }
            result.validation = true;
            result.message = '해당 Feed의 Analysis 데이터 호출 성공';
            result.data = returnData;
            res.json(result);
        });
    }
    else res.json(result);
};

const calNum = function (req, res) {
    if(checkToken(req.headers.authorization)) {
        var inputData = {
            f_No: 0,
            d_No: 0
        };
        var getData = {
            d_Age: '',
            d_Weight: 1.1,
            f_Protein: 11.11,
            f_Fat: 11.11,
            f_Calcium: 1.11,
            f_Phosphorus: 1.11,
            f_Fiber: 1.11,
            f_Ash: 7.50,
            f_Moisture: 10.00
        };
        var returnData = {
            dayCalory: 2,
            dayAmount: 1
        }
        inputData = {...inputData , ...req.body}; 
        let get_query = mybatisMapper.getStatement('feed', 'getData', inputData, format);
        connection.query(get_query, function(err, rows) {
            if(err) {
                console.log(err);
                result.validation = false;
                result.message = '해당 Device와 Feed 데이터를 불러오는 데 오류가 발생하였습니다';
                result.data = [];
                res.json(result);
                return;
            } 
            console.log('Device&Feed Data getData ok: ' + inputData.d_No);
            //d_Age, d_Species, d_Weight, f_Protein, f_Fat, f_Calcium, f_Phosphorus, f_Fiber, f_Ash, f_Moisture
            getData = {...getData , ...rows[0]}; 
            var RER = { value: 1.1 };
            if(getData.d_Weight<2.0) RER.value = 70 * Math.pow(getData.d_Weight, 0.75);                
            else RER.value = (30 * getData.d_Weight) + 70;
            var NFE = 100 - getData.f_Protein - getData.f_Fat - getData.f_Fiber - getData.f_Moisture - getData.f_Ash;
            var ME = 10*((4.0*getData.f_Protein)+(9.0*getData.f_Fat)+(4*NFE));                
            var MER = { value: 1.1 };
            if(getData.d_Age == '유아기') MER.value = 2.75 * RER.value;
            else if(getData.d_Age == '성장기') MER.value = 2.0 * RER.value;
            else if(getData.d_Age == '중년기') MER.value = 1.4 * RER.value;
            else if(getData.d_Age == '노년기') MER.value = 0.7 * RER.value;
            returnData.dayCalory = Math.round(MER.value, 0);
            returnData.dayAmount = Math.round(MER.value * 1000.0 / ME, 0);
            result.validation = true;
            result.message = '일일 권장량 계산 성공';
            result.data = returnData;
            res.json(result);
        });
    }
    else res.json(result);
};

const calDirect = function (req, res) {
    if(checkToken(req.headers.authorization)) {
        var inputData = {d_No: 0};
        var getData = {
            d_Age: '',
            d_Weight: 1.1,
            f_Protein: 11.11,
            f_Fat: 11.11,
            f_Calcium: 1.11,
            f_Phosphorus: 1.11,
            f_Fiber: 1.11,
            f_Ash: 7.50,
            f_Moisture: 10.00
        };
        var returnData = {
            dayCalory: 2,
            dayAmount: 1
        };
        //d_No / f_Protein, f_Fat, f_Calcium, f_Phosphorus, f_Fiber, f_Ash, f_Moisture
        inputData = {...inputData, ...req.body};
        getData = {...getData , ...req.body};
        let get_query = mybatisMapper.getStatement('feed', 'getDevice', inputData, format);
        connection.query(get_query, function(err, rows) {
            if(err) {
                console.log(err);
                result.validation = false;
                result.message = '해당 Device와 Feed 데이터를 불러오는 데 오류가 발생하였습니다';
                result.data = [];
                res.json(result);
                return;
            } 
            console.log('Device&Feed Data getData ok: ' + inputData.d_No);
            //d_Age, d_Weight, 
            getData = {...getData , ...rows[0]};
            var RER = { value: 1.1 };
            if(getData.d_Weight<2.0) RER.value = 70 * Math.pow(getData.d_Weight, 0.75);                
            else RER.value = (30 * getData.d_Weight) + 70;
            var NFE = 100 - getData.f_Protein - getData.f_Fat - getData.f_Fiber - getData.f_Moisture - getData.f_Ash;
            var ME = 10*((4.0*getData.f_Protein)+(9.0*getData.f_Fat)+(4*NFE));                
            var MER = { value: 1.1 };
            if(getData.d_Age == '유아기') MER.value = 2.75 * RER.value;
            else if(getData.d_Age == '성장기') MER.value = 2.0 * RER.value;
            else if(getData.d_Age == '중년기') MER.value = 1.4 * RER.value;
            else if(getData.d_Age == '노년기') MER.value = 0.7 * RER.value;
            returnData.dayCalory = Math.round(MER.value, 0);
            returnData.dayAmount = Math.round(MER.value * 1000.0 / ME, 0);
            result.validation = true;
            result.message = '일일 권장량 계산 성공';
            result.data = returnData;
            res.json(result);
        });
    }
    else res.json(result);
};

const calCalory = function (req, res) {
    if(checkToken(req.headers.authorization)) {
        var inputData = {
            d_No: 0,
            ME: 1.1
        };
        var getData = {
            d_Age: '',
            d_Weight: 1.1,
            f_Protein: 11.11,
            f_Fat: 11.11,
            f_Calcium: 1.11,
            f_Phosphorus: 1.11,
            f_Fiber: 1.11,
            f_Ash: 7.50,
            f_Moisture: 10.00
        };
        var returnData = {
            dayCalory: 2,
            dayAmount: 1
        }
        //d_No, ME
        inputData = {...inputData, ...req.body};
        let get_query = mybatisMapper.getStatement('feed', 'getDevice', inputData, format);
        connection.query(get_query, function(err, rows) {
            if(err) {
                console.log(err);
                result.validation = false;
                result.message = '해당 Device와 Feed 데이터를 불러오는 데 오류가 발생하였습니다';
                result.data = [];
                res.json(result);
                return;
            } 
            console.log('Device&Feed Data getData ok: ' + inputData.d_No);
            //d_Age, d_Weight, 
            getData = {...getData , ...rows[0]};
            var RER = { value: 1.1 };
            if(getData.d_Weight<2.0) RER.value = 70 * Math.pow(getData.d_Weight, 0.75);                
            else RER.value = (30 * getData.d_Weight) + 70;
            var MER = { value: 1.1 };
            if(getData.d_Age == '유아기') MER.value = 2.75 * RER.value;
            else if(getData.d_Age == '성장기') MER.value = 2.0 * RER.value;
            else if(getData.d_Age == '중년기') MER.value = 1.4 * RER.value;
            else if(getData.d_Age == '노년기') MER.value = 0.7 * RER.value;
            returnData.dayCalory = Math.round(MER.value, 0);
            returnData.dayAmount = Math.round(MER.value * 1000.0 / inputData.ME, 0);
            result.validation = true;
            result.message = '일일 권장량 계산 성공';
            result.data = returnData;
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
    selectAll: selectAll,
    basic: basic,
    nutrient: nutrient,
    ingredient: ingredient,
    analysis: analysis,
    calNum: calNum,
    calDirect: calDirect,
    calCalory: calCalory
};