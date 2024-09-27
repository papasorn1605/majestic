"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.promisePool = exports.connection = void 0;
const mysql2_1 = require("mysql2");
// Create a pool of connections
exports.connection = (0, mysql2_1.createPool)({
    host: "127.0.0.1",
    port: 3306,
    user: "root",
    password: "admin",
    database: "product_db",
    // `connectionLimit` is optional but a good idea to define
    connectionLimit: 10,
});
// Wrap the pool in a promise-based API if needed
exports.promisePool = exports.connection.promise();
