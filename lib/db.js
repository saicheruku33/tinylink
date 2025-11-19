// lib/db.js
import pkg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Pool } = pkg;
const connectionString = process.env.DATABASE_URL;

const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false },   // Always SSL for Neon
});

export default {
  query: (text, params) => pool.query(text, params),
  getClient: () => pool.connect(),
};
