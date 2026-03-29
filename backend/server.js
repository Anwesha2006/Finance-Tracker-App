require('dotenv').config();
const express = require('express');
const cors=require('cors');
const connectDB=require('./config/db');

const app=express();

// Connect to database
connectDB();

// Middleware
app.use(express.json());
app.use(cors({
    origin:'http://localhost:3000',
    credentials:true
}));

// Test route
app.get('/api/test', (req, res) => {
    res.json({ message: 'Backend server is running!' });
});

// Routes
app.use('/api/auth',require('./routes/auth.routes'));

const PORT=process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Test the server at: http://localhost:${PORT}/api/test`);
});
