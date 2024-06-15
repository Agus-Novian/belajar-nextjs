import sql, { ConnectionPool, config } from "mssql";

const sqlConfig: config = {
  user: process.env.DB_USER,
  password: process.env.DB_PWD,
  database: process.env.DB_NAME,
  server: process.env.DB_SERVER || "",
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
  options: {
    encrypt: false, // for Azure
    trustServerCertificate: false, // change to true for local dev / self-signed certs
  },
};

let pool: ConnectionPool | null = null;

export async function connect() {
  try {
    if (!pool || pool.connected === false) {
      pool = await new ConnectionPool(sqlConfig).connect();
      console.log("Database connected successfully!");
    }
    return pool;
  } catch (error) {
    console.error("Error connecting to database:", error);
    throw error;
  }
}

export async function close() {
  try {
    if (pool && pool.connected) {
      await pool.close();
      console.log("Database connection closed.");
    }
  } catch (error) {
    console.error("Error closing database connection:", error);
    throw error;
  }
}
