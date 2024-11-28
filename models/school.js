const connectToDatabase=require('../db/server.js')

async function createSchoolTable() {
    let connection;
    try {
        connection = await connectToDatabase(); // Get database connection

        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS schools (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                address VARCHAR(255) NOT NULL,
                latitude FLOAT NOT NULL,
                longitude FLOAT NOT NULL
            );
        `;

        // Execute the query to create the table
        await connection.execute(createTableQuery);
        console.log("School table created successfully.");
    } catch (error) {
        console.error("Error creating school table:", error);
    } finally {
      
            await connection.end(); // Close the connection when done
            }
}

module.exports = createSchoolTable;
