const express = require('express');
const router = express.Router();
const pdController = require('../controllers/pd.controller');
const {authorization} = require(`../controllers/auth.controller`)

router.get('/pd', authorization(["Admin", "User", "Engineer"]), pdController.getPd);
router.post('/pd', authorization(["Admin", "User", "Engineer"]), pdController.addPd);
router.put('/pd/:id', authorization(["Admin", "User", "Engineer"]), pdController.updatePd);
router.delete('/pd/:id', authorization(["Admin", "User", "Engineer"]), pdController.deletePd);

module.exports = router;