// lib/db.js
import pkg from 'pg';
import dotenv from 'dotenv';
dotenv.config();
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, // required for Neon / serverless Postgres
  max: 5,            // small pool is safer on serverless platforms
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

export default {
  query: (text, params) => pool.query(text, params),
  getClient: () => pool.connect(),
};
