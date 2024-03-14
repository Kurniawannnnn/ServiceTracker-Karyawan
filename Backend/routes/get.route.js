const express = require('express');
const router = express.Router();
const executorController = require('../controllers/get.controller');
const {authorization} = require(`../controllers/auth.controller`)

router.get('/rapor', authorization(["Admin", "User", "Engineer"]), executorController.getAllExecutor);

module.exports = router;