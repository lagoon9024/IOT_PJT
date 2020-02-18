//user.js: User 테이블 관련 요청 수행

const express = require('express');
const router = express.Router(); //router: express의 Router 인스턴스(=완전한 미들웨어, 라우팅 시스템, mini-app)

const controller = require('./user.controller');

//전체 User 데이터 호출
router.get('/', controller.selectAll);

//U_No에 맞는 데이터 호출
router.get('/:no', controller.selectOne);

//새로고침 후 u_No, u_Last 호출
router.get('/main/:token', controller.userMain);

//id 중복 확인
router.get('/idCheck/:id', controller.idCheck);

//회원가입
router.post('/', controller.add);

//로그인
router.post('/login', controller.login);

//회원 정보 수정
router.put('/', controller.update);

//비밀번호 수정
router.put('/pass', controller.updatePass);

//회원 정보 삭제
router.delete('/:no', controller.del);

module.exports = router;