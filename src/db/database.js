import initSqlJs from 'sql.js';

let db;

const SCHEMA = `
  CREATE TABLE IF NOT EXISTS patients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    age INTEGER,
    gender TEXT,
    phone TEXT,
    address TEXT,
    consent INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`;

export async function initDB() {
  if (db) return db;

  const SQL = await initSqlJs({ locateFile: file => `https://sql.js.org/dist/${file}` });
  const saved = localStorage.getItem('patient-db');

  db = saved ? new SQL.Database(Uint8Array.from(atob(saved), c => c.charCodeAt(0))) : new SQL.Database();
  db.run(SCHEMA);

  return db;
}

export async function insertPatient(data) {
  const db = await initDB();
  const stmt = db.prepare(`
    INSERT INTO patients (name, age, gender, phone, address, consent)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  stmt.run([
    data.name,
    parseInt(data.age),
    data.gender,
    data.phone,
    data.address,
    data.consent ? 1 : 0,
  ]);
  stmt.free();
  persistDB();
}

export async function runQuery(query) {
  const db = await initDB();
  try {
    const result = db.exec(query);
    return result[0] || { columns: [], values: [] };
  } catch (err) {
    throw new Error(err.message);
  }
}

function persistDB() {
  const data = db.export();
  const base64 = btoa(String.fromCharCode(...data));
  localStorage.setItem('patient-db', base64);
}
