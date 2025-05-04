# 🩺 Patient Registration App (PGlite Version)

This is a frontend-only patient registration app that uses [`@electric-sql/pglite`](https://github.com/electric-sql/pglite) for browser-based data storage.

---

## ✅ Features

- Register new patients via form
- Query patient records using raw SQL
- Data persists across page refreshes (via IndexedDB)
- Supports multiple open browser tabs

---

## 🚀 Setup Instructions

1. Clone the repo:

   ```bash
   git clone https://github.com/<your-username>/patient-registration-pglite-app.git
   cd patient-registration-pglite-app
   ```

2. Checkout the pglite branch:

    ```bash
    git checkout pglite
    ```

3. Install dependencies:

    ```bash
    npm install
    ```

4. Run the development server:

    ```bash
    npm run dev

    ```

5. Open the app at http://localhost:5173


🧪 Components
RegisterPatientForm.jsx — Handles patient registration and listing.

QueryRunner.jsx — Allows manual SQL queries with result table rendering.

lib/db.js — Singleton wrapper around PGlite (non-WebWorker).

⚠️ Known Issue with PGlite
❌ unnamed prepared statement does not exist

This error arises due to a regression in PGlite's internal prepared statement caching logic.

⚠️ Details:
Happens during repeated SQL query attempts (especially after page reload).

Even if the schema is correct, PGlite’s auto-prepared statements become stale.

Root cause: stale reference to internal WASM memory after IndexedDB reload.

🔁 Workarounds Tried:
Switching to main-thread DB execution

Changing DB instance names

Clearing IndexedDB

Downgrading PGlite (older versions not published on npm)

💡 Resolution:
This version is left intentionally to fulfill assignment requirements using PGlite.
A separate sqljs branch contains the same app using sql.js for full stability.

🛠 Tech Stack
React + Vite

Tailwind CSS

PGlite (@electric-sql/pglite)

IndexedDB (via idb:// protocol)

📂 Branches
Branch	Description
pglite	As per assignment, built using @electric-sql/pglite
sqljs	Stable fallback using sql.js with same UI/UX

📧 Contact
If you need clarification on any part of the implementation or the bug, feel free to reach out.