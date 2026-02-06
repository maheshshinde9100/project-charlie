const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const auth = require('../middlewares/auth');

const { initiatePaymentValidation } = require('../middlewares/validation');

router.post('/initiate', auth, initiatePaymentValidation, paymentController.initiatePayment);

router.get('/history', auth, paymentController.getHistory);
router.get('/intents', auth, paymentController.getIntents);
router.get('/intents/:id', auth, paymentController.getIntentDetails);
router.get('/transaction/:id', auth, paymentController.getTransactionDetails);

const { requestMoneyValidation } = require('../middlewares/validation');
router.post('/request', auth, requestMoneyValidation, paymentController.requestMoney);
router.get('/requests', auth, paymentController.getRequests);

module.exports = router;
