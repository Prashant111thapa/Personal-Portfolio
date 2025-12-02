import AuthService from "../services/AuthService.js";


export const validateToken = (req, res, next) => {
    try{
        const token = req.cookies.authToken;

        if(!token) {
            return res.status(401).json({ success: false, message: "Access token required"});
        }

        const decoded = AuthService.verifyToken(token);
        if(!decoded) {
            return res.status(401).json({ success: false, message: "Invalid or expired token"});
        }

        req.user = {
            id: decoded.id,
            email: decoded.email
        }

        next();
    } catch(err) {
        console.log("Failed to validate Token", err);
        return res.status(500).json({ success: false, message: "Internal Server Error"});
    }
}

