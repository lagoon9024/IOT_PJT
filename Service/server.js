//server.js: Express 서버 생성 및 구동

const express = require('express'); //require: Node.js의 모듈 로딩 시스템
const app = express(); //app: express의 인스턴스
const port = 3000;

//서버 시작
app.listen(port, () => console.log('Express server has started on port 3000'));

//CORS 처리
const CORS = require('cors')();
app.use(CORS);

//모든 호출에 대해 Main Router로 이동
app.use('/', require('./routes/main.js'));