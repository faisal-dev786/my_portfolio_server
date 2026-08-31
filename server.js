import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
dotenv.config();

const app = express();

const port = process.env.PORT || 4000;
const configuredOrigins = process.env.FRONTEND_URL
    ? process.env.FRONTEND_URL.split(',')
    : [];
const allowedOrigins = [
    'https://faisalgraphix.netlify.app',
    'https://faisalvisuals1.netlify.app',
    'https://alfaisalquranacademy.netlify.app',
    'http://localhost:3000',
    'http://localhost:5173',
    'http://localhost:5500',
    'http://127.0.0.1:5501',
    'http://127.0.0.1:5500',
    ...configuredOrigins
]
    .map((origin) => origin.trim().replace(/\/$/, ''))
    .filter(Boolean);

app.use(cors({
    origin(origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        return callback(new Error('Origin is not allowed by CORS'));
    },
    credentials: true
}));

// connect to databse

import { connectDB } from './config/db.js';
connectDB();


// middleware
app.use(express.json());

// routes

import authRouter from './routes/authRoutes.js';

app.use('/api/auth', authRouter);

app.listen(port, () => {
    console.log(`server is runnig on port ${port}`);
});