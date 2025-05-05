import React, { useState, useEffect } from 'react';
import { runQuery } from '../db/database';
import { Terminal, Download, Trash2 } from 'lucide-react';

const QueryRunner = () => {
  const [query, setQuery] = useState('SELECT * FROM patients;');
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [page, setPage] = useState(1);
  const pageSize = 20;

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('queryHistory') || '[]');
    setHistory(stored);
  }, []);

  const saveToHistory = (q) => {
    let newHist = [q, ...history.filter(item => item !== q)];
    if (newHist.length > 10) newHist = newHist.slice(0, 10);
    setHistory(newHist);
    localStorage.setItem('queryHistory', JSON.stringify(newHist));
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('queryHistory');
  };

  const execute = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await runQuery(query);
      setColumns(res.columns || []);
      setRows(res.values || []);
      saveToHistory(query);
      setPage(1);
    } catch (err) {
      setError(err.message);
      setColumns([]);
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  const exportCSV = () => {
    if (!columns.length || !rows.length) return;
    const csvLines = [];
    csvLines.push(columns.join(','));
    rows.forEach(r => {
      const line = r.map(c => c != null ? `"${c}"` : '').join(',');
      csvLines.push(line);
    });
    const blob = new Blob([csvLines.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'query_results.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
  const paginatedRows = rows.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="mt-10">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6 max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
          <Terminal className="text-purple-600" /> SQL Query Runner
        </h2>

        {/* Query History */}
        <div className="flex items-center gap-2 mb-4">
          <select
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="flex-1 px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
          >
            <option value="">-- Select from history --</option>
            {history.map((h, i) => (
              <option key={i} value={h}>{h.substring(0, 30) + (h.length>30?'...':'')}</option>
            ))}
          </select>
          <button onClick={clearHistory} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded">
            <Trash2 className="h-5 w-5 text-red-500" />
          </button>
        </div>

        <textarea
          rows={4}
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:border-gray-600 font-mono"
        />

        <div className="mt-4 flex items-center gap-4">
          <button
            onClick={execute}
            disabled={loading}
            className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white px-5 py-2 rounded-lg font-medium transition"
          >
            {loading ? 'Running…' : 'Run Query'}
          </button>
          <button
            onClick={exportCSV}
            disabled={!columns.length || !rows.length}
            className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg flex items-center gap-1"
          >
            <Download className="h-5 w-5" /> Export CSV
          </button>
          {error && <p className="text-red-500">❌ {error}</p>}
        </div>

        {/* Results Table */}
        {columns.length > 0 && (
          <div className="mt-6 overflow-auto">
            <table className="min-w-full table-auto border-collapse">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-700">
                  {columns.map(col => (
                    <th
                      key={col}
                      className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginatedRows.map((row, i) => (
                  <tr
                    key={i}
                    className={i % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-700'}
                  >
                    {row.map((cell, j) => (
                      <td
                        key={j}
                        className="px-4 py-2 text-sm text-gray-800 dark:text-gray-200"
                      >
                        {`${cell}`}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="mt-4 flex justify-center items-center gap-4">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50"
              >Prev</button>
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50"
              >Next</button>
            </div>
          </div>
        )}

        {!loading && !error && columns.length === 0 && (
          <p className="mt-6 text-gray-500 dark:text-gray-400">No results. Try running a query.</p>
        )}
      </div>
    </div>
  );
};

export default QueryRunner;