import { useState } from "react";
import { querySQL } from "../lib/db";

const QueryRunner = () => {
  const [query, setQuery] = useState("SELECT * FROM patients;");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const runQuery = async () => {
    try {
      const res = await querySQL(query);
      setResult(res);
      setError("");
    } catch (err) {
      setResult(null);
      setError(err.message);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-4 border-t pt-6">
      <h2 className="text-xl font-bold mb-2">🧪 SQL Query Runner</h2>
      <textarea
        rows="3"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full border p-2 rounded mb-2"
      />
      <button onClick={runQuery} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
        Run Query
      </button>

      {error && <p className="text-red-500 mt-3">❌ {error}</p>}

      {result && result.rows?.length > 0 && (
        <div className="mt-4 overflow-x-auto">
          <table className="table-auto w-full border">
            <thead>
              <tr className="bg-gray-100">
                {Object.keys(result.rows[0]).map((key) => (
                  <th key={key} className="border px-2 py-1 text-left">{key}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {result.rows.map((row, idx) => (
                <tr key={idx} className="odd:bg-white even:bg-gray-50">
                  {Object.values(row).map((val, i) => (
                    <td key={i} className="border px-2 py-1">{String(val)}</td>
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
