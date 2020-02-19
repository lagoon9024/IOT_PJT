const express = require('express');
const router = express.Router();

const controller = require('./logdata.controller');

router.get('/:no', controller.selectBasic);

router.get('/new/:no', controller.selectNew);

//d_No에 맞는 데이터들 중 날짜, 섭취량
router.get('/chart/:no', controller.selectChart);

module.exports = router;