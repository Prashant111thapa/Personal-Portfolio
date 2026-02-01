import dotenv from 'dotenv';
import mysql from 'mysql2/promise';
import path from 'path';
import { fileURLToPath } from 'url';

// __dirname is not defined in ESM; derive it from import.meta.url
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const DB_CONFIG = {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '3306'),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
};

async function cleanup() {
    console.log('🔌 Connecting to database...');
    let connection;
    try {
        connection = await mysql.createConnection(DB_CONFIG);
        console.log('✅ Connected!');

        // const [assiginemnts] = await connection.query('SELECT * FROM assignments');
        // console.table(assiginemnts);

        
        // const [profile] = await connection.query('SELECT name, avatar_url, resume_url, avatar_public_id, avatar_file_name,avatar_file_size, resume_public_id, resume_file_name, resume_file_size  FROM profile');
        // console.table(profile);

        // await connection.execute('ALTER TABLE projects DROP COLUMN image_url');

        const [projects] = await connection.query('SELECT id, title, file_url, file_public_id FROM projects');
        console.table(projects);
        

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        if (connection) {
          await connection.end(); 
          console.log("Closed db") 
        };
    }
}

cleanup();
