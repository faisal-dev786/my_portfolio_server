import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import { connectDB } from './config/db.js';
import authRouter from './routes/authRoutes.js';
import graphixContactRouter from './routes/graphixContactRoutes.js';
import quranAcademyContactRouter from './routes/quranAcademyContactRoutes.js';
import visualsContactRouter from './routes/visualsContactRoutes.js';
import fullstackContactRouter from './routes/fullstackContactRoutes.js';
import dashboardRouter from './routes/dashboardRoutes.js';
dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

const allowedOrigins = [
    'https://faisal-graphix.vercel.app',
    'https://faisal-uiux.vercel.app',
    'https://alfaisalquranacademy.vercel.app',
    'https://faisal-project-dashboard.vercel.app',
    'https://faisal-visuals.vercel.app',
    'https://faisal-dev-nu.vercel.app',
    'http://localhost:3000',
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
    'http://127.0.0.1:5500/'
];
app.get("/api/health", (req, res) => {
    res.status(200).json({ message: "API is running" });
});

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
app.use('/api/graphix', graphixContactRouter);
app.use('/api/quran-academy', quranAcademyContactRouter);
app.use('/api/uiux', visualsContactRouter);
app.use('/api/visuals', visualsContactRouter);
app.use('/api/fullstack', fullstackContactRouter);
app.use('/api/dashboard', dashboardRouter);
app.get('/', (req, res) => {
    res.status(200).json({
        message: 'API is running successfully'
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});