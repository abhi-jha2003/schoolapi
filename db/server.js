// server.js (Inside the /db folder)
const mysql = require('mysql2/promise'); // Use the promise version of mysql2

async function connectToDatabase() {
    try {
        // Create a connection to the database
        const connection = await mysql.createConnection({
            host: 'sql12.freesqldatabase.com',
            user: 'sql12747810',
            database: 'sql12747810',
            password: 'MSK5qzasVK'
        });

        console.log('Connected to MySQL Server');
        return connection; // Return the connection to use later
    } catch (err) {
        console.error('Error connecting to MySQL Server:', err);
        throw err; // Rethrow the error to be handled by the caller
    }
}

module.exports = connectToDatabase;
