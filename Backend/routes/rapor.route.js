const express = require('express');
const router = express.Router();
const raporController = require('../controllers/rapor.controller');
const {authorization} = require(`../controllers/auth.controller`)

router.get('/raporCount/:executor', authorization(["Admin", "User", "Engineer"]), raporController.countExecutorPDS);
router.get('/raporMTTR/:executor', authorization(["Admin", "User", "Engineer"]), raporController.avgMTTRExecutor);
router.get('/raporAch/:executor', authorization(["Admin", "User", "Engineer"]), raporController.getAchievementExecutor);

module.exports = router;
