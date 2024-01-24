const Pool = require("pg").Pool;

const pool = new Pool({
    user: "postgres",
    password: "Password",
    host: "localhost",
    port: 5432,
    database: "campusconnectdb"
});

module.exports = pool;