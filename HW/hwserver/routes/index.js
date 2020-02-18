const express= require('express');
const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.use('/log', require('./logupdate/logupdate.js'));
app.use('/timeset', require('./timeset/timeset.js'));
app.use('/motor', require('./mobilecontroll/motor.js'));

module.exports=app;
