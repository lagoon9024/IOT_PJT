const express = require('express');
const router = express.Router();

const controller = require('./feed.controller');

router.get('/', controller.selectAll);

router.get('/basic/:no', controller.basic);

router.get('/nutrient/:no', controller.nutrient);

router.get('/ingredient/:no', controller.ingredient);

router.get('/analysis/:dno/:fno', controller.analysis);

router.post('/cal/num', controller.calNum);

router.post('/cal/direct', controller.calDirect);

router.post('/cal/calory', controller.calCalory);

module.exports = router;