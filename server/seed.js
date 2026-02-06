const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

const createTables = async () => {
    try {
        await pool.query('DROP TABLE IF EXISTS payment_requests CASCADE');
        await pool.query('DROP TABLE IF EXISTS notifications CASCADE');
        await pool.query('DROP TABLE IF EXISTS transactions CASCADE');
        await pool.query('DROP TABLE IF EXISTS payment_intents CASCADE');
        await pool.query('DROP TABLE IF EXISTS users CASCADE');
        console.log("Old tables dropped.");

        const usersTable = `
        CREATE TABLE users (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            balance DECIMAL(15, 2) DEFAULT 0.00,
            avatar VARCHAR(500),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );`;

        const intentsTable = `
        CREATE TABLE payment_intents (
            id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(id),
            receiver VARCHAR(255) NOT NULL,
            total_amount DECIMAL(15, 2) NOT NULL,
            settled_amount DECIMAL(15, 2) DEFAULT 0.00,
            remaining_amount DECIMAL(15, 2) NOT NULL,
            status VARCHAR(50) DEFAULT 'Pending',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );`;

        const transactionsTable = `
        CREATE TABLE transactions (
            id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(id),
            receiver VARCHAR(255) NOT NULL,
            amount DECIMAL(15, 2) NOT NULL,
            type VARCHAR(50) NOT NULL,
            status VARCHAR(50) DEFAULT 'Success',
            intent_id INTEGER REFERENCES payment_intents(id),
            note TEXT,
            transaction_ref VARCHAR(255),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );`;

        const notificationsTable = `
        CREATE TABLE notifications (
            id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(id),
            type VARCHAR(50) NOT NULL,
            title VARCHAR(255) NOT NULL,
            message TEXT NOT NULL,
            is_new BOOLEAN DEFAULT TRUE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );`;

        const requestsTable = `
        CREATE TABLE payment_requests (
            id SERIAL PRIMARY KEY,
            requester_id INTEGER REFERENCES users(id),
            sender_id INTEGER REFERENCES users(id),
            amount DECIMAL(15, 2) NOT NULL,
            note VARCHAR(255),
            status VARCHAR(20) DEFAULT 'PENDING',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );`;

        await pool.query(usersTable);
        await pool.query(intentsTable);
        await pool.query(transactionsTable);
        await pool.query(notificationsTable);
        await pool.query(requestsTable);
        console.log("Tables created successfully.");
    } catch (err) {
        console.error("Error in createTables:", err);
        throw err;
    }
};

const seedUsers = async () => {
    try {
        const salt = await bcrypt.genSalt(10);

        // Temp User
        const tempPass = await bcrypt.hash('Temp123', salt);
        await pool.query(
            "INSERT INTO users (name, email, password, balance) VALUES ($1, $2, $3, $4)",
            ['Temp User', 'temp@gmail.com', tempPass, 1000.00]
        );
        console.log("Temp user created.");

        // Mahesh Admin
        const adminPass = await bcrypt.hash('Admin123', salt);
        await pool.query(
            "INSERT INTO users (name, email, password, balance, avatar) VALUES ($1, $2, $3, $4, $5)",
            ['Mahesh Shinde', 'mahesh@admin.com', adminPass, 12450.00, 'https://avatars.githubusercontent.com/u/120265441']
        );
        console.log("Admin user created.");
    } catch (err) {
        console.error("Error seeding users:", err);
        throw err;
    }
};

const run = async () => {
    try {
        await createTables();
        await seedUsers();
        console.log("Seeding completed successfully.");
    } catch (err) {
        console.error("Seeding failed:", err);
    } finally {
        await pool.end();
    }
};

run();
