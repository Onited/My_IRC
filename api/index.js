const express = require('express');
const dotenv = require('dotenv')
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const cors = require('cors');

dotenv.config();

mongoose.connect(process.env.MONGO_URL);

const app = express();
app.use(express.json());

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

app.get('/profile', (req, res) => {
    const {token} = req.cookies
});

app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json('Username is already taken');
        }

        const createdUser = await User.create({ username, password });
        jwt.sign({ userId: createdUser._id }, process.env.JWT_SECRET, {}, (err, token) => {
            if (err) throw err;
            res.cookie('token', token, { httpOnly: true }).status(201).json({
                id: createdUser._id,
            });
        });
    } catch (err) {
        console.error(err);
        if (err.code === 11000) { // Duplicate key error code
            return res.status(400).json('Username is already taken');
        }
        res.status(500).json('Internal Server Error');
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});