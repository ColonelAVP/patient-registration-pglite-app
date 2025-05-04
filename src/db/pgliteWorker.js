import { PGlite } from '@electric-sql/pglite';

let db;

async function setupDB() {
  db = new PGlite('idb://patient-db');

  await db.exec(`
    CREATE TABLE IF NOT EXISTS patients (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      age INTEGER,
      gender TEXT,
      phone TEXT NOT NULL,
      address TEXT,
      consent BOOLEAN NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  postMessage({ type: 'ready' });
}

setupDB();

// 🎯 Listen for SQL messages from main thread
self.onmessage = async (event) => {
  const { id, type, query, values } = event.data;

  try {
    if (type === 'exec') {
      await db.exec({ text: query, values });
      postMessage({ id, success: true });
    } else if (type === 'query') {
      const result = await db.query({ text: query, values });
      postMessage({ id, result });
    }
  } catch (err) {
    postMessage({ id, error: err.message });
  }
};
