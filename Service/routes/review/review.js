const express = require('express');
const router = express.Router();

const controller = require('./review.controller');

router.get('/basic/:no/:uno', controller.selectBasic);

router.get('/best/:no/:uno', controller.selectBest);

router.get('/new/:no/:uno', controller.selectNew);

router.get('/get/:no', controller.selectOne);

router.post('/', controller.add);

router.post('/good', controller.updateGood);

router.put('/', controller.update);

router.delete('/:no', controller.del);

module.exports = router;