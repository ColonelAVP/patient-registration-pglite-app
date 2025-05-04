import { PGlite } from '@electric-sql/pglite';

let db;

export async function initDB() {
  if (!db) {
    db = new PGlite('idb://patient-db-main');

    await db.exec(`
      CREATE TABLE IF NOT EXISTS patients (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        age INTEGER,
        gender TEXT,
        phone TEXT NOT NULL,
        address TEXT,
        consent BOOLEAN NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
  }
  return db;
}

export async function execSQL(query, values = []) {
  const db = await initDB();
  return db.exec({ text: query, values });
}

export async function querySQL(query, values = []) {
  const db = await initDB();
  return db.query({ text: query, values });
}
