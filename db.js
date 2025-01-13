const mysql = require('mysql2/promise');

// Configuration de la connexion
const pool = mysql.createPool({
    host: 'localhost',     
    user: 'root',         
    password: 'touta2004',          
    database: 'magasin_plantes', 
    waitForConnections: true,
    connectionLimit: 10,   
    queueLimit: 0
});

module.exports = pool;