const express = require('express');
const router = express.Router();
const kpiController = require('../controllers/kpi.controller');

router.get('/kpi', kpiController.hitungRataRata);

module.exports = router;