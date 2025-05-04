import { useState, useEffect } from "react";
import { insertPatient, runQuery } from "../db/database";

const RegisterPatientForm = () => {
  const [form, setForm] = useState({
    name: "",
    age: "",
    gender: "",
    phone: "",
    address: "",
    consent: false,
  });
  const [patients, setPatients] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPatients();
  
    window.addEventListener("storage", (e) => {
      if (e.key === "patient-db-update") {
        fetchPatients();
      }
    });
  
    return () => {
      window.removeEventListener("storage", fetchPatients);
    };
  }, []);

  const fetchPatients = async () => {
    try {
      const res = await runQuery("SELECT * FROM patients ORDER BY created_at DESC;");
      const columns = res.columns || [];
      const rows = res.values || [];
      const data = rows.map((row) =>
        Object.fromEntries(columns.map((col, i) => [col, row[i]]))
      );
      setPatients(data);
      setError("");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await insertPatient(form);
      setForm({
        name: "",
        age: "",
        gender: "",
        phone: "",
        address: "",
        consent: false,
      });
      fetchPatients();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 space-y-10">
      <div className="bg-white rounded-xl shadow p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          🩺 Register New Patient
        </h1>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" name="name" placeholder="Full Name" required value={form.name} onChange={handleChange} className="input" />
          <input type="number" name="age" placeholder="Age" required value={form.age} onChange={handleChange} className="input" />
          <select name="gender" required value={form.gender} onChange={handleChange} className="input">
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          <input type="text" name="phone" placeholder="Phone Number" required value={form.phone} onChange={handleChange} className="input" />
          <textarea name="address" placeholder="Address" rows="2" value={form.address} onChange={handleChange} className="input md:col-span-2" />
          <label className="md:col-span-2 flex items-center gap-2 text-sm text-gray-600">
            <input type="checkbox" name="consent" checked={form.consent} onChange={handleChange} />
            I consent to store my information
          </label>
          <div className="md:col-span-2 flex justify-end">
            <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition">
              Register Patient
            </button>
          </div>
        </form>
        {error && <p className="text-red-500 mt-3">❌ {error}</p>}
      </div>

      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">📋 Registered Patients</h2>
        {patients.length === 0 ? (
          <p className="text-sm text-gray-500">No patients found.</p>
        ) : (
          <ul className="divide-y text-sm text-gray-800">
            {patients.map((p) => (
              <li key={p.id} className="py-2">
                <strong>{p.name}</strong> ({p.age} • {p.gender}) — {p.phone}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default RegisterPatientForm;
