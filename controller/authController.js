import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../models/user.js";

// register user
export const registerUser = async (req, res) => {
    try {
        const { username, useremail, password } = req.body;
        // validation
        if (!username || !useremail || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const existingUser = await userModel.findOne({ username });
        const existingEmail = await userModel.findOne({ useremail });
        if (existingEmail) {
            return res.status(400).json({ message: "Email already exists" });
        }

        if (existingUser) {
            return res.status(400).json({ message: "Username already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new userModel({
            username,
            useremail,
            password: hashedPassword
        });
        await newUser.save();
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message })
    }
}

// login user
export const loginUser = async (req, res) => {
    try {
        const { useremail, password } = req.body;

        // validation
        if (!useremail || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        // find user by email only
        const user = await userModel.findOne({ useremail });

        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // compare password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // generate JWT token
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                username: user.username,
                useremail: user.useremail
            }
        });

    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
};


export const logOutUser = async (req, res) => {
    try {
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!req.user || !req.user._id) {
            return res.status(401).json({ message: "User not authenticated" });
        }

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: "Current password and new password are required" });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ message: "New password must be at least 6 characters long" });
        }

        const user = await userModel.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);

        if (!isCurrentPasswordValid) {
            return res.status(400).json({ message: "Current password is incorrect" });
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedNewPassword;
        await user.save();

        res.status(200).json({ message: "Password reset successful" });
    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
};

export const forgotPassword = async (req, res) => {
    try {
        const { useremail, newPassword, confirmPassword } = req.body;

        if (!useremail || !newPassword || !confirmPassword) {
            return res.status(400).json({ message: "Email, new password and confirm password are required" });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ message: "New password must be at least 6 characters long" });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({ message: "New password and confirm password do not match" });
        }

        const user = await userModel.findOne({ useremail });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
};
