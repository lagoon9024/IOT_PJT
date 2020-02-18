const express = require('express');
const router = express.Router();

const controller = require('./setting.controller');

//전체 Setting 데이터 호출
router.get('/', controller.selectAll);

//d_No에 맞는 데이터 호출
router.get('/:no', controller.selectOne);

//Setting 등록
router.post('/', controller.add);

//Setting 수정
router.put('/', controller.update);

//Setting 삭제
router.delete('/:no', controller.del);

module.exports = router;