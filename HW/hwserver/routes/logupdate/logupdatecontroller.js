const mysql = require('mysql');
const localmapper = require('mybatis-mapper');
const backendmapper = require('mybatis-mapper');

const backendconn = require('../../config/backend_db.js');
const localconn = require('../../config/local_db.js');
const backendcon = mysql.createConnection(backendconn);
const localcon = mysql.createConnection(localconn);


let format = {language: 'sql', indent: ' '};

var datas = { 
    d_No : 1,
    l_Time : '000000000000',
    l_Empty : 0,
    l_Amount : 0,
    l_Remain : 0,
    l_Eat : 0
};

const selectAll = function (req, res) {
    localmapper.createMapper(['./mapper/feeding.xml']);
    var query = localmapper.getStatement('local_feeding_log', 'selectAll', format);
    localcon.query(query, function(err, rows) {
        if(err) throw err;
        console.log("read success");
        if(rows.length){
            updatevar(rows);
        }
        if(req && rows.length) res.json("update "+ rows.length +" data");
        else if(req) res.json("nothing to update");
    });  
};

module.exports = {
    selectAll: selectAll,
};

function insertvar(rows){
    localmapper.createMapper(['./mapper/feeding.xml']);
    var param={
        start : rows[0]._datetime,
        end : rows[rows.length-1]._datetime
    };
    let uquery = localmapper.getStatement('local_feeding_log','updateflag',param,format);
    localcon.query(uquery, function(err, vars){
        if(err) throw err;
    })
}

function updatevar(rows){
    backendmapper.createMapper(['./mapper/backend_logdata.xml']);
    for(var i=0;i<rows.length; ++i){
        datas.l_Time = rows[i]._datetime;
        datas.l_Empty =  rows[i].empty;
        datas.l_Amount = rows[i].amount;
        datas.l_Remain = rows[i].remain;
        datas.l_Eat = rows[i].eaten;
        let iquery = backendmapper.getStatement('LogData', 'logUpdate', datas, format );
        backendcon.query(iquery, function(err, vars){
           if(err) throw err;
           insertvar(rows);
        })
    }
    console.log("input && update "+rows.length+" data success");
}


