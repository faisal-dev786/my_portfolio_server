import express from 'express';
import { loginUser, registerUser, logOutUser, resetPassword, forgotPassword } from '../controller/authController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const authRouter = express.Router();

authRouter.post('/register', registerUser);
authRouter.post('/login', loginUser);
authRouter.post('/logout', logOutUser);
authRouter.post('/reset-password', authMiddleware, resetPassword);
authRouter.post('/forgot-password', forgotPassword);

export default authRouter;