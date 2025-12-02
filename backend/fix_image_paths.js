import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3308,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'portfolio'
};

async function fixImagePaths() {
    let connection;
    
    try {
        console.log('Connecting to database...');
        connection = await mysql.createConnection(dbConfig);
        
        // First, let's see what records exist
        const [rows] = await connection.execute(
            'SELECT id, title, image_url FROM projects WHERE image_url IS NOT NULL'
        );
        
        console.log('Current records:');
        rows.forEach(row => {
            console.log(`ID: ${row.id}, Title: ${row.title}, Current Path: ${row.image_url}`);
        });
        
        // Update all records that have the wrong path
        const [result] = await connection.execute(
            `UPDATE projects 
             SET image_url = REPLACE(image_url, '/uploads/projects/', '/uploads/project/') 
             WHERE image_url LIKE '/uploads/projects/%'`
        );
        
        console.log(`\nUpdated ${result.affectedRows} records`);
        
        // Show the updated records
        const [updatedRows] = await connection.execute(
            'SELECT id, title, image_url FROM projects WHERE image_url IS NOT NULL'
        );
        
        console.log('\nUpdated records:');
        updatedRows.forEach(row => {
            console.log(`ID: ${row.id}, Title: ${row.title}, New Path: ${row.image_url}`);
        });
        
    } catch (error) {
        console.error('Error fixing image paths:', error);
    } finally {
        if (connection) {
            await connection.end();
            console.log('\nDatabase connection closed');
        }
    }
}

fixImagePaths();