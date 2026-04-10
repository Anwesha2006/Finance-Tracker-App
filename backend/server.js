require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./db/config');

connectDB();

const app = express();

app.use(cors({
  origin: ['http://localhost:3000', 'http://192.168.1.41:3000'],
  credentials: true
}));
app.use(express.json());

app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/users', require('./routes/user.routes'));
app.use('/api', require('./routes/transaction.routes'));
app.use('/uploads', express.static('uploads'));
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});