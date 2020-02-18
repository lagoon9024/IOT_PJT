const express = require('express');
const router = express.Router();

const controller = require('./device.controller');

//u_No에 맞는 전체 Device 데이터 호출
router.get('/:no', controller.selectAll);

//d_No에 맞는 데이터 호출
router.get('/get/:no', controller.selectOne);

//Device SerialNo 중복 확인
router.get('/check/:no', controller.checkSerial);

//Device 등록
router.post('/', controller.add);

//Device 수정
router.put('/', controller.update);

//Device 삭제
router.delete('/:no', controller.del);

module.exports = router;