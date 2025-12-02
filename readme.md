# Order Processing API

A scalable Order Processing API for an e-commerce platform, built with **Node.js**, **Express**, and **MongoDB**.  
Supports JWT-based authentication, role-based access control, order management.

---

## Features

- User registration and login with JWT authentication
- Role-based access control (Admin/User)
- CRUD operations for Orders and Items
- Pagination and filtering for orders
- Input validation using **Joi**
- Centralized error handling
- Indexing for optimized database queries

---

## Tech Stack

- **Backend:** Node.js, Express
- **Database:** MongoDB (Mongoose ODM)
- **Authentication:** JWT
- **Validation:** Joi
- **Dev Tools:** Nodemon

---

## Installation

1. Clone the repository:

```bash
git clone https://github.com/NaimShk07/ecommerce-task
```

2. Install dependencies:

```bash
npm install
```

3. Configure environment variables:

Create a .env file based on .env.example:

```bash
cp .env.example .env
```

Add values:

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=thisissecretkey
JWT_EXPIRE=7d


SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=naim@gmail.com
SMTP_PASS=naim@123
```

4. Start the server:

```bash
npm run dev
```

Server will run at: http://localhost:5000
