# 🩺 Patient Registration App (PGlite Version)

This is a frontend-only patient registration app that uses [`@electric-sql/pglite`](https://github.com/electric-sql/pglite) for browser-based data storage.

---

## ✅ Features

* Register new patients via a form
* View and query patient records using raw SQL
* Export patient data as CSV or FHIR JSON bundle
* Generate individual patient summary PDFs
* Real-time analytics dashboard with age distribution, gender split, and registration trends
* Interactive appointment scheduler linked to patient records
* Data persists across page refreshes (IndexedDB via localForage)
* Multi-tab synchronization
* Progressive Web App: offline support, installable, with service worker caching

---

## 🚀 Setup Instructions

1. Clone the repo:

   ```bash
   git clone https://github.com/<your-username>/patient-registration-pglite-app.git
   cd patient-registration-pglite-app
   ```
2. Checkout the `pglite` branch:

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
5. Open the app at [http://localhost:5173](http://localhost:5173)

---

## ⚠️ Known Issue with PGlite

**`Unnamed prepared statement does not exist`**

This error arises due to a regression in PGlite's internal prepared-statement caching logic. Symptoms include failures on repeated query executions, especially after page reload. The root cause is stale references to internal WASM memory after IndexedDB reload.

### Workarounds Tried

* Switching to main-thread database execution
* Clearing IndexedDB
* Downgrading PGlite (older versions unpublished on npm)

> **Resolution:** This branch is left intentionally using PGlite for assignment requirements. A `sqljs` branch uses `sql.js` for full stability.

---

## 🛠 Tech Stack

* React + Vite
* Tailwind CSS
* PGlite (`@electric-sql/pglite`)
* IndexedDB via `localforage`
* React Router
* Recharts for charts
* jsPDF + html2canvas for PDF export
* react-big-calendar for scheduling

---

## 📂 Branches

| Branch | Description                                         |
| ------ | --------------------------------------------------- |
| pglite | Assignment version using PGlite                     |
| sqljs  | Stable fallback using `sql.js` with identical UI/UX |

---

## 🔗 Contact

For questions or clarifications about implementation or the PGlite issue, reach out to Atherv at `athervpatil05@gmail.com`.

**Author:** Atherv
**Date:** May 2025
