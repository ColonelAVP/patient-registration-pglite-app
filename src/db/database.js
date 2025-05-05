import initSqlJs from "sql.js";
import localforage from "localforage";

let dbInstance;

export async function initDB() {
  if (dbInstance) return dbInstance;

  const SQL = await initSqlJs({
    locateFile: file => `https://sql.js.org/dist/${file}`,
  });

  const saved = await localforage.getItem("patient-db");
  dbInstance = saved ? new SQL.Database(saved) : new SQL.Database();

  // Create patients table
  dbInstance.run(`
    CREATE TABLE IF NOT EXISTS patients (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      age INTEGER,
      gender TEXT,
      phone TEXT,
      address TEXT,
      consent INTEGER,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Create appointments table
  dbInstance.run(`
    CREATE TABLE IF NOT EXISTS appointments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      patient_id INTEGER,
      start TEXT NOT NULL,
      end TEXT NOT NULL,
      title TEXT,
      FOREIGN KEY(patient_id) REFERENCES patients(id)
    );
  `);

  // Sync across tabs
  window.addEventListener("storage", async event => {
    if (event.key === "patient-db-update") {
      const data = await localforage.getItem("patient-db");
      if (data) dbInstance = new SQL.Database(data);
    }
  });

  return dbInstance;
}

/**
 * Inserts a new patient record
 */
export async function insertPatient({ name, age, gender, phone, address, consent }) {
  const db = await initDB();
  const stmt = db.prepare(
    `INSERT INTO patients (name, age, gender, phone, address, consent)
     VALUES (?, ?, ?, ?, ?, ?);`
  );
  stmt.run([name, Number(age), gender, phone, address, consent ? 1 : 0]);
  stmt.free();
  const data = db.export();
  await localforage.setItem("patient-db", data);
  localStorage.setItem("patient-db-update", Date.now());
  return;
}

/**
 * Inserts a new appointment record
 */
export async function insertAppointment({ patient_id, start, end, title }) {
  const db = await initDB();
  const stmt = db.prepare(
    `INSERT INTO appointments (patient_id, start, end, title)
     VALUES (?, ?, ?, ?);`
  );
  stmt.run([
    patient_id != null ? Number(patient_id) : null,
    start,
    end,
    title || null,
  ]);
  stmt.free();
  const data = db.export();
  await localforage.setItem("patient-db", data);
  localStorage.setItem("patient-db-update", Date.now());
  return;
}

/**
 * Executes a read query and returns { columns, values }
 */
export async function runQuery(sql) {
  const db = await initDB();
  const res = db.exec(sql)[0];
  return res || { columns: [], values: [] };
}
