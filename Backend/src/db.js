import pg from 'pg';
import { dbConfig } from './config/appConfig.js';

const { Pool } = pg;

const pool = new Pool({
  connectionString: dbConfig.connectionString,
  ssl: dbConfig.ssl,
});

export default pool;
