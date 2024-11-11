import pg from "pg";
import dotenv from 'dotenv';

dotenv.config();

const config = {
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
};

console.log(config);
const db = new pg.Client(config);
db.connect();

export default db;