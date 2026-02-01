# API Documentation - Auto-Triggered Payment Service

i created this api documentation for the API endpoints required for my current frontend and also for the Auto-Triggered Payment Service.

## Base URL
`https://api.autotrigger.com/v1`

---

## 1. Authentication

### Login
- **Route:** `POST /auth/login`
- **Request Body:**
  ```json
  {
    "email": "mahesh.shinde@admin.com",
    "password": "mahi@123"
  }
  ```
- **Response:** `200 OK` with JWT Token and User Profile.

### Register
- **Route:** `POST /auth/register`
- **Request Body:**
  ```json
  {
    "name": "Mahesh Shinde",
    "email": "mahesh.shinde@admin.com",
    "password": "mahi@123"
  }
  ```

---

## 2. Wallet Management

### Get Wallet Balance
- **Route:** `GET /wallet/balance`
- **Auth Required:** Yes
- **Response:**
  ```json
  {
    "balance": 12450.00,
    "currency": "INR",
    "pendingSettlements": 2500.00
  }
  ```

### Top Up Wallet
- **Route:** `POST /wallet/topup`
- **Auth Required:** Yes
- **Request Body:**
  ```json
  {
    "amount": 5000,
    "paymentMethod": "upi",
    "transactionId": "TXN_987654321"
  }
  ```
---

## 3. Payments & Intents

### Initiate Payment
- **Route:** `POST /payments/initiate`
- **Auth Required:** Yes
- **Request Body:**
  ```json
  {
    "receiverId": "USER_ID_OR_VPA",
    "amount": 5000,
    "note": "Rent Payment"
  }
  ```
- **Logic i used here :**
  - If bal >= amount: Process full payment immediately.
  - If bal < amount: Create a `PaymentIntent` with status `Pending` or `Partial`.

### Get Payment History
- **Route:** `GET /payments/history`
- **Auth Required:** Yes
- **Response:** Array of transaction objects -completed full/partial transferss

### Get Active Intents (Queue)
- **Route:** `GET /payments/intents`
- **Auth Required:** Yes
- **Response:**
  ```json
  [
    {
      "id": "INTENT_123",
      "receiverName": "Mahesh Shinde",
      "totalAmount": 5000,
      "settledAmount": 2000,
      "remainingAmount": 3000,
      "status": "Partial",
      "createdAt": "2026-02-01T10:00:00Z"
    }
  ]
  ```

### Get Intent Details
- **Route:** `GET /payments/intents/:id`
- **Auth Required:** Yes
- **Response:** Detailed view of the intent including the ledger of partial payments made so far.

### Get Transaction Details
- **Route:** `GET /payments/transaction/:id`
- **Auth Required:** Yes
- **Response:**
  ```json
  {
    "id": "TXN_123",
    "receiver": "Mahesh Shindde",
    "amount": 500.00,
    "status": "Success",
    "date": "2026-02-01T10:30:00Z",
    "paymentMethod": "Wallet Balance",
    "transactionId": "",
    "vpa": "mahesh@okaxis"
  }
  ```

---

## 4. Notifications (Webhooks/Sockets)

### Get User Notifications
- **Route:** `GET /notifications`
- **Auth Required:** Yes
- **Response:**
  ```json
  [
    {
      "id": "1",
      "type": "AUTO_SETTLE",
      "title": "Auto-Settlement Successful",
      "message": "₹1,500 was automatically transferred...",
      "time": "2026-02-01T12:00:00Z",
      "isNew": true
    }
  ]
  ```

### Payment Notification (Socket/Push)
- **Type:** Push/Socket
- **Payload:**
  ```json
  {
    "type": "AUTO_SETTLEMENT_TRIGGERED",
    "intentId": "INTENT_123",
    "amountSettled": 1000,
    "remaining": 2000,
    "status": "Partial"
  }
  ```
