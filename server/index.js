require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const authRoutes = require('./routes/authRoutes');
const walletRoutes = require('./routes/walletRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const pool = require('./config/db'); //db connection is okk

const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());

// Rate Limiter
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minute
    max: 50, //limit each IP to 50 requests per windowMs
    message: 'Too many requests from this IP, please try again after 15 minutes'

});

app.use(limiter);

// Routes
app.use('/auth', authRoutes);
app.use('/wallet', walletRoutes);
app.use('/payments', paymentRoutes);

app.get('/', (req, res) => {
    res.send('Auto-Triggered Payment Service API is running');
});

//Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broken bro!');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
