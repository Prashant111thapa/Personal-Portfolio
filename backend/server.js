
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import cookieParser from 'cookie-parser';
import { fileURLToPath } from 'url';
import authRoutes from './src/routes/authRoutes.js';
import skillsRoutes from './src/routes/skillsRoutes.js';
import projectRoutes from './src/routes/projectRoutes.js';
import contactRoutes from './src/routes/contactRoutes.js';
import { testCloudinaryConnection } from './src/config/cloudinary.config.js';

dotenv.config();
const app = express();
app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or Postman)
        if (!origin) return callback(null, true);
        
        // Allow all Vercel preview deployments and production
        if (origin.includes('vercel.app') || origin.includes('localhost')) {
            return callback(null, true);
        }
        
        // Check if origin matches environment variable
        const allowedOrigins = process.env.FRONTEND_URL ? process.env.FRONTEND_URL.split(',') : [];
        if (allowedOrigins.some(allowedOrigin => allowedOrigin.trim() === origin)) {
            return callback(null, true);
        }
        
        return callback(new Error('Not allowed by CORS'), false);
    },
    credentials: true
}));

// Serve uploaded files statically
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// app.use('/uploads', express.static(path.join(__dirname, 'src', 'uploads')));


app.get('/health', (_req, res) => {
    console.log("Server is running.");
    res.status(200).json({ success: true, message: "Server is running..." });
});

    try {
        await testCloudinaryConnection();
    } catch (err) {
        console.error("Error connecting to clodinary", err);
    }

app.use('/api/auth', authRoutes);
app.use('/api/skill', skillsRoutes);
app.use('/api/project', projectRoutes);
app.use('/api/contact', contactRoutes);

app.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}`);
});