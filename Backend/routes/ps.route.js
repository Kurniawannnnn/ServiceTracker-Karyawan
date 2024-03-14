const express = require('express');
const router = express.Router();
const psController = require('../controllers/ps.controller');
const {authorization} = require(`../controllers/auth.controller`)

router.get('/ps', authorization(["Admin", "User", "Engineer"]), psController.getPs);
router.post('/ps', authorization(["Admin", "User", "Engineer"]), psController.addPs);
router.put('/ps/:id', authorization(["Admin", "User", "Engineer"]), psController.updatePs);
router.delete('/ps/:id', authorization(["Admin", "User", "Engineer"]), psController.deletePs);

module.exports = router;