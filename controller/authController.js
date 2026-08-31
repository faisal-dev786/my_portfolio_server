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
}