import transporter from "../config/mailer.js";
import ResetPasswordModel from "../models/ResetPasswordModel.js";
import UserModel from "../models/UserModel.js";
import AuthService from "../services/AuthService.js";
import { generateResetCode, getExpirationTime } from "../utils/generateCode.js";

class ResetPasswordController {

    static async requestPasswordReset(req, res) {
        try {
            const { email } = req.body;

            const validateEmail = AuthService.validateEmail(email);
            if(!validateEmail){
                return res.status(400).json({
                    success: false,
                    message: "Please enter a valid email"
                });
            }

            const user = await UserModel.getUserByEmail(email);
            if(!user) {
                return res.status(404).json({
                    success: false,
                    message: "User not found"
                });
            }

            await ResetPasswordModel.invalidateExistingCodes(user.id);

            const resetCode = generateResetCode();
            const expiresAt = getExpirationTime();

            const createResetCode = await ResetPasswordModel.createResetCode(user.id, resetCode, expiresAt);
            if(!createResetCode) {
                return res.status(400).json({
                    success: false,
                    message: "Failed to create reset code"
                });
            }

            const emailData = {
                to: user.email,
                subject: "Password Reset Request (Personal Portfolio)",
                html: `
                    <h2>Password Reset </h2>
                    <p>Password Reset Code</p>
                    <p>${resetCode} </p>
                    <p> This code will expires in ${expiresAt}.</p>
                `
            }

            transporter.sendMail(emailData);

            return res.status(200).json({
                success: true,
                message: "Reset code sent to your email"
            });

        } catch(err) {
            console.error("Error requesting password rest", err);
            return res.status(500).json({
                success: false,
                message: "Internal Server Error"
            });
        }
    } 

    static async resetPassword(req, res) {
        try {
            const { code, newPassword } = req.body;

            if(!code){
                return res.status(400).json({ success: false, message: "Reset Code is required."});
            }
            if(!newPassword){
                return res.status(400).json({ success: false, message: "Please provide new password."});
            }

            const resetRecord = await ResetPasswordModel.findValidCode(code);
            if(!resetRecord){
                return res.status(400).json({
                    success: false,
                    message: "Invalid or expired code"
                });
            }

            const validatePassword = AuthService.validatePassword(newPassword);
            if(!validatePassword){
                return res.status(400).json({
                    success: false,
                    message: validatePassword.message || "Password must be 6 characters long and have atleast one lowercase and one uppercase letter"
                });
            }

            const hashedPassword = await AuthService.hashPassword(newPassword);

            await UserModel.updateUserPassword(parseInt(resetRecord.user_id), hashedPassword);
            await ResetPasswordModel.markCodeAsUsed(code);

            return res.status(200).json({
                success: true,
                message: "Password reset successfully"
            });
        } catch(err) {
            console.error("Error reseetting password", err);
            return res.status(500).json({
                success: false,
                message: "Internal Server Error"
            });
        }
    }

    static async verifyResetCode (req, res) {
        try{
            const { code } = req.params;
            const resetRecord = await ResetPasswordModel.findValidCode(code);
            if(!resetRecord){
                return res.status(400).json({
                    success: false,
                    message: "Invalid or expired code"
                });
            }

            return res.status(200).json({
                success: true,
                message: "Valid code",
                data: { 
                    email: resetRecord.email
                }
            });

        } catch(err) {
            console.error("Error verifying code", err);
            return res.status(500).json({
                success: false,
                message: "Internal Server Error"
            });
        }
    }    

}

export default ResetPasswordController;