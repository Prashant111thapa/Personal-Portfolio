import { validationResult } from "express-validator";
import UserModel from "../models/UserModel.js";
import AuthService from "../services/AuthService.js";


class UserController {

    static async login(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ success: false, errors: errors.array() });
            }

            const { email, password } = req.body;

            const user = await UserModel.getUserByEmail(email);
            if (!user) {
                return res.status(404).json({ success: false, message: "User not found!" });
            }

            const checkUser = await AuthService.comparePassword(password, user.password);
            if (!checkUser) {
                return res.status(400).json({ success: false, message: "Invalid credentials" });
            }

            const userWithoutPassword = {
                id: user.id,
                email: email,
            };

            const token = AuthService.generateToken(userWithoutPassword);
            if (!token) {
                return res.status(500).json({ success: false, message: "Internal Server Error" });
            }

            console.log('Cookie settings:', {
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
        });

            res.cookie('authToken', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });

            return res.status(200).json({
                success: true,
                message: "Login successfull",
                data: {
                    user: userWithoutPassword,
                }
            });
        } catch (err) {
            res.status(500).json({ success: false, message: "Internal Server Error" });
            return;
        }
    }

    static async updateUser(req, res) {
        try {
            const { password } = req.body;
            const { id } = req.params;

            if(!id || isNaN(id) || id < 0) {
                return res.status(400).json({ success: false, message: "Valid user id is required."});
            }

            const validatePassword = AuthService.validatePassword(password);
            if(!validatePassword.success) {
                return res.status(400).json({ success: false, message: validatePassword.message });
            }

            const hashedPassword = await AuthService.hashPassword(password);
            
            const updatedUser = await UserModel.updateUserPassword(id, hashedPassword);
            if(!updatedUser) {
                return res.status(400).json({ success: false, message: "Failed to update password"})
            }

            return res.status(200).json({ success: true, message: "Password updated successfully." });
        } catch(err) {
            console.error("Error updating user. ", err);
            return res.status(500).json({ success: false, message: "Internal Server Error"});
        }
    }

    static async getUserByEmail (req, res) {
        try {
            const { email } = req.body;

            if(!email) {
                return res.status(400).json({
                    success: false,
                    message: "Email is required"
                });
            }

            const user = await UserModel.getUserByEmail(email);
            if(!user) {
                return res.status(404).json({
                    success: false,
                    message: "User not found"
                });
            }

            return res.status(200).json({
                success: true,
                message:"User retrieved successfully.",
                data: user
            });
        } catch(err){
            console.error("Error finding user by email", err);
            return res.status(500).json({
                success: false,
                message: "Internal Server Error"
            });
        }    
    }

    static async getCurrentUser (req, res) {
        try {
            const user = await UserModel.getUserByEmail(req.user.email);
            if (!user) {
                return res.status(404).json({ success: false, message: "User not found" });
            }

            const { password, ...userWithoutPassword } = user;
            return res.status(200).json({
                success: true,
                message: "User retrieved successfully",
                data: { user: userWithoutPassword }
            });
        } catch (err) {
            console.log("Error getting current user:", err);
            return res.status(500).json({ success: false, message: "Internal Server Error" });
        }
    }
    
}

export default UserController;