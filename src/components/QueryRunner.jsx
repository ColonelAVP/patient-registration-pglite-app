import { useState } from "react";
import { execSQL, querySQL } from "../lib/db";

export default function QueryRunner() {
  const [query, setQuery] = useState("SELECT * FROM patients;");
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");

  const handleRun = async () => {
    try {
      setError("");
      const result = await querySQL(query);
      console.log("✅ Patient inserted");
      setResults(result.rows || []);
    } catch (err) {
      setResults([]);
      setError(`❌ ${err}`);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-4 bg-white rounded shadow">
      <h2 className="text-lg font-semibold mb-2">SQL Query Runner</h2>

      <textarea
        className="w-full border p-2 rounded mb-2 font-mono text-sm"
        rows="4"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <button
        onClick={handleRun}
        className="mb-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Run Query
      </button>

      {error && <div className="text-red-600 text-sm mb-2">{error}</div>}

      {results.length > 0 && (
        <table className="w-full text-sm border">
          <thead>
            <tr className="bg-gray-200">
              {Object.keys(results[0]).map((key) => (
                <th key={key} className="px-2 py-1 border">{key}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {results.map((row, idx) => (
              <tr key={idx}>
                {Object.values(row).map((val, i) => (
                  <td key={i} className="px-2 py-1 border">
                    {val?.toString()}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
