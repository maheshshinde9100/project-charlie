const express = require('express');
const router = express.Router();
const walletController = require('../controllers/walletController');
const auth = require('../middlewares/auth');

const { topUpValidation } = require('../middlewares/validation');

router.get('/balance', auth, walletController.getBalance);
router.post('/topup', auth, topUpValidation, walletController.topUp);

module.exports = router;
