import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();
const pool = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "prashant",
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || "personal_portfolio",
    port: process.env.DB_PORT || 3307,
    ssl: process.env.NODE_ENV === 'production' ? {
        rejectUnauthorized: false
    } : false,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

const dbConnection = pool.promise();

export default dbConnection;