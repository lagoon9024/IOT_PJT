//join.js: 테이블 Join 관련 요청 수행

const express = require('express');
const router = express.Router(); //router: express의 Router 인스턴스(=완전한 미들웨어, 라우팅 시스템, mini-app)

const controller = require('./join.controller');

router.get('/main/:no', controller.selectMain);

router.put('/main', controller.changeLast);

module.exports = router;