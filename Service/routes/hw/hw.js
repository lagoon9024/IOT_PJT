const express = require('express');
const router = express.Router();

const controller = require('./hw.controller');

router.put('/ip', controller.updateIP);

module.exports = router;