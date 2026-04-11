require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./db/config');

connectDB();

const app = express();

const allowedOrigins = [
  'http://localhost:3000',
  'http://192.168.1.41:3000',
  'https://finance-tracker-app-p78e.vercel.app',
  'https://r4rupee.onrender.com',
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin like mobile apps or curl
    if (!origin) return callback(null, true)
    if (allowedOrigins.includes(origin)) return callback(null, true)
    callback(new Error(`CORS policy does not allow access from origin ${origin}`))
  },
  credentials: true,
}))
app.use(express.json());

app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/users', require('./routes/user.routes'));
app.use('/api', require('./routes/transaction.routes'));
app.use('/uploads', express.static('uploads'));
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});