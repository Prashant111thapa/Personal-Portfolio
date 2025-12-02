import mysql from 'mysql2/promise';

const config = {
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'portfolio'
};

async function checkAndFixPaths() {
  try {
    const connection = await mysql.createConnection(config);
    
    // Check current paths
    const [rows] = await connection.execute('SELECT id, title, image_url FROM projects');
    console.log('Current database paths:');
    rows.forEach(row => {
      console.log(`ID: ${row.id}, Title: ${row.title}, Path: ${row.image_url}`);
    });

    // Fix paths that have '/uploads/projects/' to '/uploads/project/'
    const [result] = await connection.execute(
      "UPDATE projects SET image_url = REPLACE(image_url, '/uploads/projects/', '/uploads/project/') WHERE image_url LIKE '%/uploads/projects/%'"
    );
    
    console.log(`\nUpdated ${result.affectedRows} rows`);
    
    // Check updated paths
    const [updatedRows] = await connection.execute('SELECT id, title, image_url FROM projects');
    console.log('\nUpdated database paths:');
    updatedRows.forEach(row => {
      console.log(`ID: ${row.id}, Title: ${row.title}, Path: ${row.image_url}`);
    });

    await connection.end();
  } catch (error) {
    console.error('Database operation failed:', error.message);
  }
}

checkAndFixPaths();