const { body, validationResult } = require('express-validator');

const validate = (validations) => {
    return async (req, res, next) => {
        for (let validation of validations) {
            await validation.run(req);
        }

        const errors = validationResult(req);
        if (errors.isEmpty()) {
            return next();
        }

        return res.status(400).json({ errors: errors.array() });
    };
};

// Auth Validations
exports.registerValidation = validate([
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
]);

exports.loginValidation = validate([
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').notEmpty().withMessage('Password is required')
]);

// Payment Validations
exports.initiatePaymentValidation = validate([
    body('receiverId').notEmpty().withMessage('Receiver ID is required'),
    body('amount').isFloat({ min: 1 }).withMessage('Amount must be at least ₹1'),
    body('note').optional().trim().isLength({ max: 100 }).withMessage('Note cannot exceed 100 characters')
]);

// Wallet Validations
exports.topUpValidation = validate([
    body('amount').isFloat({ min: 10 }).withMessage('Top-up amount must be at least ₹10'),
    body('paymentMethod').notEmpty().withMessage('Payment method is required')
]);

// Request Money Validation
exports.requestMoneyValidation = validate([
    body('senderId').notEmpty().withMessage('Sender ID (from whom you are requesting) is required'),
    body('amount').isFloat({ min: 1 }).withMessage('Amount must be at least ₹1'),
    body('note').optional().trim()
]);
