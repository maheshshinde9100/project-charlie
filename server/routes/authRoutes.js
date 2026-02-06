const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

const { loginValidation, registerValidation } = require('../middlewares/validation');

router.post('/login', loginValidation, authController.login);
router.post('/register', registerValidation, authController.register);

module.exports = router;
