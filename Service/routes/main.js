//main.js: 사용자의 요청에 응답하는 Main Router

const express = require('express'); 
const app = express(); 

//body-parser를 이용하여 입력 Data을 json 형식으로 변환
const bodyParser = require('body-parser');
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true }));

//사용자의 요청 주소에 맞게 각각의 Router를 사용
app.use('/user', require('./user/user.js'));
app.use('/device', require('./device/device.js'));
app.use('/setting', require('./setting/setting.js'));
app.use('/logdata', require('./logdata/logdata.js'));
app.use('/feed', require('./feed/feed.js'));
app.use('/join', require('./join/join.js'));
app.use('/review', require('./review/review.js'));
app.use('/hw', require('./hw/hw.js'));

//module: 관련된 코드들을 하나의 코드 단위로 캡슐화
module.exports = app; //app과 관련된 코드들을 module로 캡슐화(다른 파일에서 module을 사용하기 위해서 필요)