const express = require('express');
const router = express.Router();
const pnController = require('../controllers/pn.controller');
const {authorization} = require(`../controllers/auth.controller`)

router.get('/pn', authorization(["Admin", "User", "Engineer"]), pnController.getPn);
router.post('/pn', authorization(["Admin", "User", "Engineer"]), pnController.addPn);
router.put('/pn/:id', authorization(["Admin", "User", "Engineer"]), pnController.updatePn);
router.delete('/pn/:id', authorization(["Admin", "User", "Engineer"]), pnController.deletePn);

module.exports = router;