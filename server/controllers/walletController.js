const pool = require('../config/db');

exports.getBalance = async (req, res) => {
    try {
        const userId = req.user.id;
        // Get user balance
        const userRes = await pool.query('SELECT balance FROM users WHERE id = $1', [userId]);
        const balance = parseFloat(userRes.rows[0].balance);

        // Get pending settlements sum
        const intentsRes = await pool.query(
            "SELECT SUM(remaining_amount) as pending FROM payment_intents WHERE user_id = $1 AND status != 'Completed'",
            [userId]
        );
        const pendingSettlements = parseFloat(intentsRes.rows[0].pending || 0);

        res.json({
            balance,
            currency: "INR",
            pendingSettlements
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.topUp = async (req, res) => {
    const { amount, paymentMethod, transactionId } = req.body;
    const userId = req.user.id;

    try {
        await pool.query('BEGIN');

        // 1. Add funds to wallet
        await pool.query('UPDATE users SET balance = balance + $1 WHERE id = $2', [amount, userId]);

        // Create notification for top-up
        await pool.query(
            "INSERT INTO notifications (user_id, type, title, message) VALUES ($1, 'TOPUP', 'Wallet Top-up Successful', $2)",
            [userId, `₹${amount} was added to your wallet via ${paymentMethod}.`]
        );

        // 2. Fetch active/pending intents (oldest first or by priority?)
        // Doc says: "Adding funds will automatically trigger these transfers"
        const intentsRes = await pool.query(
            "SELECT * FROM payment_intents WHERE user_id = $1 AND status != 'Completed' ORDER BY created_at ASC",
            [userId]
        );

        let currentBalanceRes = await pool.query('SELECT balance FROM users WHERE id = $1', [userId]);
        let currentBalance = parseFloat(currentBalanceRes.rows[0].balance);

        // 3. Process intents with available balance
        for (let intent of intentsRes.rows) {
            if (currentBalance >= parseFloat(intent.remaining_amount)) {
                // Full settlement
                const payAmount = parseFloat(intent.remaining_amount);

                // Deduct from wallet
                await pool.query('UPDATE users SET balance = balance - $1 WHERE id = $2', [payAmount, userId]);
                currentBalance -= payAmount;

                // Update Intent
                await pool.query(
                    "UPDATE payment_intents SET settled_amount = settled_amount + $1, remaining_amount = 0, status = 'Completed' WHERE id = $2",
                    [payAmount, intent.id]
                );

                // Create transaction record
                await pool.query(
                    "INSERT INTO transactions (user_id, receiver, amount, type, status, intent_id, created_at) VALUES ($1, $2, $3, 'debit', 'Success', $4, NOW())",
                    [userId, intent.receiver, payAmount, intent.id]
                );

                // Create notification for auto-settlement
                await pool.query(
                    "INSERT INTO notifications (user_id, type, title, message) VALUES ($1, 'AUTO_SETTLE', 'Auto-Settlement Successful', $2)",
                    [userId, `₹${payAmount} was automatically settled for your payment to ${intent.receiver}. status: COMPLETED`]
                );

            } else if (currentBalance > 0) {
                // Partial settlement
                const payAmount = currentBalance;

                // Deduct all from wallet
                await pool.query('UPDATE users SET balance = 0 WHERE id = $1', [userId]);
                currentBalance = 0;

                // Update Intent
                await pool.query(
                    "UPDATE payment_intents SET settled_amount = settled_amount + $1, remaining_amount = remaining_amount - $1, status = 'Partial' WHERE id = $2",
                    [payAmount, intent.id]
                );

                // Create transaction record
                await pool.query(
                    "INSERT INTO transactions (user_id, receiver, amount, type, status, intent_id, created_at) VALUES ($1, $2, $3, 'debit', 'Success', $4, NOW())",
                    [userId, intent.receiver, payAmount, intent.id]
                );

                // Create notification for partial auto-settlement
                await pool.query(
                    "INSERT INTO notifications (user_id, type, title, message) VALUES ($1, 'AUTO_SETTLE', 'Partial Auto-Settlement', $2)",
                    [userId, `₹${payAmount} was partially settled for your payment to ${intent.receiver}. status: PARTIAL`]
                );
            }
        }

        await pool.query('COMMIT');

        res.json({ message: 'Wallet topped up and pending settlements processed successfully' });
    } catch (err) {
        await pool.query('ROLLBACK');
        console.error(err);
        res.status(500).json({ message: 'Server error during topup' });
    }
};
