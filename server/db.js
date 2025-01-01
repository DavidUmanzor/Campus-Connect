const { Pool } = require("pg");
require("dotenv").config();

console.log("Connecting to:", process.env.DATABASE_URL);

const pool = new Pool({
	connectionString:
		process.env.DATABASE_URL ||
		`postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
	ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false,
});

module.exports = pool;
