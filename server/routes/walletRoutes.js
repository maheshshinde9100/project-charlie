const express = require('express');
const router = express.Router();
const walletController = require('../controllers/walletController');
const auth = require('../middlewares/auth');

router.get('/balance', auth, walletController.getBalance);
router.post('/topup', auth, walletController.topUp);

module.exports = router;
