# 🩺 Patient Registration App (SQLite Version)

This branch (`sqljs`) provides a stable, frontend-only patient registration app using [`sql.js`](https://github.com/sql-js/sql.js) for browser-based SQLite storage.

---

## ✅ Features (SQLite Branch)

* **Patient Registration**: Create and list patient records with first/last name, age, gender, phone, address, and consent.
* **SQL Runner**: Run raw SQL queries against the SQLite database with history, pagination, and CSV export.
* **Analytics Dashboard**: Real-time KPIs and visualizations for age distribution, gender split, and registration trends using Recharts.
* **Appointment Scheduler**: Interactive calendar (react-big-calendar) linked to patient records for follow-up bookings.
* **Data Persistence**: Database stored in IndexedDB via `localForage`, survives page reloads and supports multi-tab sync.
* **PDF Export**: Generate patient summary PDFs using jsPDF + html2canvas.
* **CSV & FHIR JSON Export**: Export patient data as CSV or interoperable FHIR JSON bundles.
* **Dark Mode**: Toggleable light/dark theme with cross-tab preference sync.
* **PWA Support**: Offline-first caching and installable as a Progressive Web App.

---

## 🚀 Setup Instructions

1. **Clone the repository**:

   ```bash
   git clone https://github.com/<your-username>/patient-registration-pglite-app.git
   cd patient-registration-pglite-app
   ```
2. **Switch to the `sqljs` branch**:

   ```bash
   git checkout sqljs
   ```
3. **Install dependencies**:

   ```bash
   npm install
   ```
4. **Run the development server**:

   ```bash
   npm run dev
   ```
5. **Open in browser** at [http://localhost:5173](http://localhost:5173)

---

## 📂 Branches

| Branch   | Description                                              |
| -------- | -------------------------------------------------------- |
| `pglite` | Uses `@electric-sql/pglite` (WASM-based SQLite)          |
| `sqljs`  | Uses `sql.js` (Emscripten-compiled SQLite) for stability |

---

## ⚙️ Switching Between Branches

If you encounter issues with PGlite (missing prepared-statement bug), use the SQLite branch:

```bash
git checkout sqljs
npm install
npm run dev
```

---

## 🛠 Tech Stack

* React + Vite
* Tailwind CSS
* sql.js for browser SQLite
* localForage (IndexedDB) for persistence
* React Router for navigation
* Recharts for analytics
* jsPDF + html2canvas for PDF exports
* react-big-calendar for scheduling

---

## 🔗 Contact

Questions or feedback? Contact Atherv at `athervpatil05@gmail.com`.

**Author:** Atherv
**Date:** May 2025
