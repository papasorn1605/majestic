import { createPool } from "mysql2";

// Create a pool of connections
export const connection = createPool({
  host: "127.0.0.1",
  port: 3306,
  user: "root",
  password: "admin",
  database: "product_db",
  // `connectionLimit` is optional but a good idea to define
  connectionLimit: 10,
});

// Wrap the pool in a promise-based API if needed
export const promisePool = connection.promise();
