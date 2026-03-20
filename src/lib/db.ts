import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

const DB_PATH = process.env.DB_PATH ?? "./data/weching.db";

// Ensure the directory exists
const dir = path.dirname(DB_PATH);
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

const db = new Database(DB_PATH);

db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS readings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    inquiry TEXT,
    lines TEXT NOT NULL,
    changing_line INTEGER,
    date TEXT NOT NULL,
    label TEXT,
    durations TEXT,
    created_at INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS circles (
    id           TEXT    PRIMARY KEY,
    created_at   INTEGER NOT NULL,
    method       TEXT    NOT NULL DEFAULT 'timing',
    parent_ids   TEXT    NOT NULL DEFAULT '[]',
    inquiry      TEXT,
    fragments    TEXT    NOT NULL DEFAULT '[]',
    participants TEXT    NOT NULL DEFAULT '[]'
  );
`);

// Migrations: add columns added after initial schema
const cols = db.pragma("table_info(circles)") as { name: string }[];
if (!cols.some((c) => c.name === "method")) {
  db.exec("ALTER TABLE circles ADD COLUMN method TEXT NOT NULL DEFAULT 'timing'");
}
if (!cols.some((c) => c.name === "parent_ids")) {
  db.exec("ALTER TABLE circles ADD COLUMN parent_ids TEXT NOT NULL DEFAULT '[]'");
}

export default db;
