import initSqlJs from "sql.js";
import localforage from "localforage";

let dbInstance;

export async function initDB() {
  if (dbInstance) return dbInstance;

  const SQL = await initSqlJs({
    locateFile: (file) => `https://sql.js.org/dist/${file}`,
  });

  const savedDb = await localforage.getItem("patient-db");

  dbInstance = savedDb ? new SQL.Database(savedDb) : new SQL.Database();

  // Create patients table if not exists
  dbInstance.run(`
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
  `);

  // Sync if another tab updated the DB
  window.addEventListener("storage", async (event) => {
    if (event.key === "patient-db-update") {
      const updated = await localforage.getItem("patient-db");
      if (updated) {
        dbInstance = new SQL.Database(updated);
      }
    }
  });

  return dbInstance;
}

export async function insertPatient(patient) {
  const db = await initDB();
  const stmt = db.prepare(`
    INSERT INTO patients (name, age, gender, phone, address, consent)
    VALUES (?, ?, ?, ?, ?, ?);
  `);
  stmt.run([
    patient.name,
    Number(patient.age),
    patient.gender,
    patient.phone,
    patient.address,
    patient.consent ? 1 : 0,
  ]);
  stmt.free();

  await localforage.setItem("patient-db", db.export());
  localStorage.setItem("patient-db-update", Date.now()); // Sync other tabs
}

export async function runQuery(sql) {
  const db = await initDB();
  return db.exec(sql)[0] || { columns: [], values: [] };
}
