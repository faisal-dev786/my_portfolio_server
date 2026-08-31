import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import { connectDB } from './config/db.js';
import authRouter from './routes/authRoutes.js';
import graphixContactRouter from './routes/graphixContactRoutes.js';
dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

const allowedOrigins = [
    'https://faisalgraphix.netlify.app',
    'https://faisalvisuals1.netlify.app',
    'https://alfaisalquranacademy.netlify.app',
    'http://localhost:3000',
    'http://localhost:5173',
    'http://localhost:5500',
    'http://127.0.0.1:5500',
    'http://127.0.0.1:5501'
];

app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.includes(origin)) {
                return callback(null, true);
            }

            return callback(new Error('Origin is not allowed by CORS'));
        },
        credentials: true
    })
);

app.use(express.json());
// connect to databse
connectDB();
// middleware
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/graphixcontacts', graphixContactRouter);

app.get('/', (req, res) => {
    res.status(200).json({
        message: 'API is running successfully'
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});