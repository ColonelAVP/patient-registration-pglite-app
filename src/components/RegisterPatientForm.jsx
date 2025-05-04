import { useEffect, useState } from "react";
import { execSQL, querySQL } from "../lib/db";

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

  const fetchPatients = async () => {
    try {
      const result = await querySQL("SELECT * FROM patients ORDER BY created_at DESC;");
      setPatients(result?.rows || []);
      setError("");
    } catch (err) {
      setError(err.message);
      setPatients([]);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

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
      await execSQL(
        `INSERT INTO patients (name, age, gender, phone, address, consent) VALUES (?, ?, ?, ?, ?, ?)`,
        [form.name, Number(form.age), form.gender, form.phone, form.address, form.consent]
      );
      setForm({
        name: "",
        age: "",
        gender: "",
        phone: "",
        address: "",
        consent: false,
      });
      await fetchPatients();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">🩺 Register Patient</h1>
      <form onSubmit={handleSubmit} className="space-y-2">
        <input name="name" placeholder="Full Name" value={form.name} onChange={handleChange} className="w-full p-2 border rounded" required />
        <input name="age" placeholder="Age" value={form.age} onChange={handleChange} className="w-full p-2 border rounded" required />
        <select name="gender" value={form.gender} onChange={handleChange} className="w-full p-2 border rounded" required>
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
        <input name="phone" placeholder="Phone Number" value={form.phone} onChange={handleChange} className="w-full p-2 border rounded" required />
        <input name="address" placeholder="Address" value={form.address} onChange={handleChange} className="w-full p-2 border rounded" />
        <label className="flex items-center gap-2">
          <input type="checkbox" name="consent" checked={form.consent} onChange={handleChange} />
          <span>I consent to store my information</span>
        </label>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Register Patient
        </button>
      </form>

      {error && <p className="text-red-500 mt-4">❌ {error}</p>}

      <h2 className="text-xl font-semibold mt-6 mb-2">📋 Registered Patients</h2>
      <ul className="space-y-1">
        {patients.map((p) => (
          <li key={p.id} className="border p-2 rounded bg-white">
            {p.name} • {p.age} • {p.gender}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RegisterPatientForm;
