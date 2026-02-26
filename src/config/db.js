const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",          // pgAdmin username
  host: "localhost",
  database: "skillconnect",  // your database name
  password: "pinki", // postgres password
  port: 5432,
});

pool.on("connect", () => {
  console.log("PostgreSQL connected successfully ✅");
});

module.exports = pool;
