import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import dotenv from "dotenv";

dotenv.config();
const db_path = process.env.DATABASE_PATH || "sqlite.db";
const sqlite = new Database(db_path);
const db = drizzle(sqlite);
export default db;
