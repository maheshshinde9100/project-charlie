const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const auth = require('../middlewares/auth');

router.post('/initiate', auth, paymentController.initiatePayment);
router.get('/history', auth, paymentController.getHistory);
router.get('/intents', auth, paymentController.getIntents);
router.get('/intents/:id', auth, paymentController.getIntentDetails);

module.exports = router;
