import { useState } from "react";
import { runQuery } from "../db/database";

const QueryRunner = () => {
  const [query, setQuery] = useState("SELECT * FROM patients;");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleQuery = async () => {
    try {
      const res = await runQuery(query);
      setResult(res);
      setError("");
    } catch (err) {
      setResult(null);
      setError(err.message);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-6 mt-10">
      <h2 className="text-xl font-bold text-gray-800 mb-4">🧪 SQL Query Runner</h2>
      <textarea
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        rows="4"
        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <button
        onClick={handleQuery}
        className="mt-3 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
      >
        Run Query
      </button>

      {error && <p className="text-red-500 mt-4">❌ {error}</p>}

      {result && result.columns?.length > 0 && (
        <div className="overflow-x-auto mt-6">
          <table className="table-auto w-full border">
            <thead className="bg-gray-100">
              <tr>
                {result.columns.map((col) => (
                  <th key={col} className="border px-3 py-2 text-left">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {result.values.map((row, idx) => (
                <tr key={idx} className="odd:bg-white even:bg-gray-50">
                  {row.map((cell, i) => (
                    <td key={i} className="border px-3 py-2">
                      {String(cell)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default QueryRunner;
