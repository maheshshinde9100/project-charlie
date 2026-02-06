const pool = require('../config/db');

exports.initiatePayment = async (req, res) => {
    const { receiverId, amount, note } = req.body; // receiverId could be id or name/VPA as per doc
    const userId = req.user.id;
    const payAmount = parseFloat(amount);

    try {
        await pool.query('BEGIN');

        // Check balance
        const userRes = await pool.query('SELECT balance FROM users WHERE id = $1', [userId]);
        const balance = parseFloat(userRes.rows[0].balance);

        if (balance >= payAmount) {
            // Process full payment
            await pool.query('UPDATE users SET balance = balance - $1 WHERE id = $2', [payAmount, userId]);

            const newTx = await pool.query(
                "INSERT INTO transactions (user_id, receiver, amount, type, status, created_at) VALUES ($1, $2, $3, 'debit', 'Success', NOW()) RETURNING *",
                [userId, receiverId, payAmount]
            );

            // Create notification for full payment
            await pool.query(
                "INSERT INTO notifications (user_id, type, title, message) VALUES ($1, 'PAYMENT', 'Payment Successful', $2)",
                [userId, `₹${payAmount} was sent to ${receiverId}.`]
            );

            await pool.query('COMMIT');
            return res.json({ message: 'Payment successful', transaction: newTx.rows[0] });

        } else {
            // Create Payment Intent (Queue)
            // If user has some balance, do we pay partially now? Doc says:
            // "Once you top up your wallet... processes these payments partial or full!"
            // But for initiating, if bal < amount, we usually just queue the whole thing or queue the remainder?
            // Doc logic: "If bal < amount: Create a PaymentIntent with status Pending or Partial."
            // I'll assume we take whatever is available now and queue the rest, OR simply queue the whole thing to keep it atomic.
            // Usually "insufficient funds" means transaction fails or goes to queue. Given "Auto-Trigger", likely it queues the FULL amount if it can't pay fully, OR pays what it can. 
            // Let's implement: Pay what you can, queue the rest.

            let settled = 0;
            let remaining = payAmount;
            let status = 'Pending';

            if (balance > 0) {
                // Partial payment now
                settled = balance;
                remaining = payAmount - balance;
                status = 'Partial';

                await pool.query('UPDATE users SET balance = 0 WHERE id = $1', [userId]);

                // Record partial transaction
                await pool.query(
                    "INSERT INTO transactions (user_id, receiver, amount, type, status, note, created_at) VALUES ($1, $2, $3, 'debit', 'Success', 'Partial Payment', NOW())",
                    [userId, receiverId, settled]
                );
            }

            // Create Intent for the REST (or total? The schema suggests track total and settled)
            // We will track the abstract Intent of the FULL amount.
            const newIntent = await pool.query(
                "INSERT INTO payment_intents (user_id, receiver, total_amount, settled_amount, remaining_amount, status, created_at) VALUES ($1, $2, $3, $4, $5, $6, NOW()) RETURNING *",
                [userId, receiverId, payAmount, settled, remaining, status]
            );

            // Create notification for intent
            await pool.query(
                "INSERT INTO notifications (user_id, type, title, message) VALUES ($1, 'INTENT_CREATED', 'Payment Intent Queued', $2)",
                [userId, `You initiated a payment of ₹${payAmount} to ${receiverId}. Due to insufficient balance, it has been queued for auto-settlement.`]
            );

            await pool.query('COMMIT');
            return res.json({
                message: 'Insufficient balance. Payment Intent created.',
                intent: newIntent.rows[0]
            });
        }

    } catch (err) {
        await pool.query('ROLLBACK');
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getHistory = async (req, res) => {
    try {
        const userId = req.user.id;
        const result = await pool.query('SELECT * FROM transactions WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getIntents = async (req, res) => {
    try {
        const userId = req.user.id;
        const result = await pool.query("SELECT * FROM payment_intents WHERE user_id = $1 AND status != 'Completed' ORDER BY created_at DESC", [userId]);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getIntentDetails = async (req, res) => {
    try {
        const userId = req.user.id;
        const intentId = req.params.id;

        const intentRes = await pool.query('SELECT * FROM payment_intents WHERE id = $1 AND user_id = $2', [intentId, userId]);
        if (intentRes.rows.length === 0) return res.status(404).json({ message: 'Intent not found' });

        const historyRes = await pool.query('SELECT * FROM transactions WHERE intent_id = $1 ORDER BY created_at DESC', [intentId]);

        const intent = intentRes.rows[0];
        intent.history = historyRes.rows;

        res.json(intent);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getTransactionDetails = async (req, res) => {
    try {
        const userId = req.user.id;
        const txId = req.params.id;
        const result = await pool.query('SELECT * FROM transactions WHERE id = $1 AND user_id = $2', [txId, userId]);

        if (result.rows.length === 0) return res.status(404).json({ message: 'Transaction not found' });
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.requestMoney = async (req, res) => {
    const { senderId, amount, note } = req.body;
    const requesterId = req.user.id; // Me
    const reqAmount = parseFloat(amount);

    try {
        // Validate sender exists
        const senderCheck = await pool.query('SELECT id, name FROM users WHERE id = $1', [senderId]);
        if (senderCheck.rows.length === 0) {
            return res.status(404).json({ message: 'Sender (payer) not found' });
        }
        const senderName = senderCheck.rows[0].name;

        await pool.query('BEGIN');

        // Create Request
        const newReq = await pool.query(
            "INSERT INTO payment_requests (requester_id, sender_id, amount, note, status, created_at) VALUES ($1, $2, $3, $4, 'PENDING', NOW()) RETURNING *",
            [requesterId, senderId, reqAmount, note]
        );

        // Notify Sender (The person who owes money)
        await pool.query(
            "INSERT INTO notifications (user_id, type, title, message) VALUES ($1, 'REQUEST_RECEIVED', 'Payment Requested', $2)",
            [senderId, `User ID ${requesterId} has requested ₹${reqAmount} from you.${note ? ' Note: ' + note : ''}`]
        );

        await pool.query('COMMIT');
        res.json({ message: 'Request sent successfully', request: newReq.rows[0] });

    } catch (err) {
        await pool.query('ROLLBACK');
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getRequests = async (req, res) => {
    try {
        const userId = req.user.id;

        // Requests I received (I need to pay)
        const received = await pool.query(`
            SELECT pr.*, u.name as requester_name, u.email as requester_email 
            FROM payment_requests pr 
            JOIN users u ON pr.requester_id = u.id 
            WHERE pr.sender_id = $1 AND pr.status = 'PENDING'
            ORDER BY pr.created_at DESC
        `, [userId]);

        // Requests I sent (I am waiting for money)
        const sent = await pool.query(`
            SELECT pr.*, u.name as sender_name 
            FROM payment_requests pr 
            JOIN users u ON pr.sender_id = u.id 
            WHERE pr.requester_id = $1 
            ORDER BY pr.created_at DESC
        `, [userId]);

        res.json({ received: received.rows, sent: sent.rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};
