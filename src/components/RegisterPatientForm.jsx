import { useEffect, useState } from "react";
import { execSQL, querySQL } from "../db/dbClient";

const initialForm = {
  name: "",
  age: "",
  gender: "",
  phone: "",
  address: "",
  consent: false,
};

export default function RegisterPatientForm() {
  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState("");
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    fetchPatients();
  }, []);

  async function fetchPatients() {
    const result = await querySQL("SELECT * FROM patients ORDER BY created_at DESC;");
    setPatients(result.rows || []);
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const { name, phone, consent } = form;
    if (!name || !phone || !consent) {
      setMessage("❗ Name, phone and consent are required.");
      return;
    }

    try {
      await execSQL(
        `INSERT INTO patients (name, age, gender, phone, address, consent) VALUES (?, ?, ?, ?, ?, ?)`,
        [
          form.name,
          parseInt(form.age) || null,
          form.gender || null,
          form.phone,
          form.address || null,
          form.consent,
        ]
      );

      setMessage("✅ Patient registered!");
      setForm(initialForm);
      fetchPatients();
    } catch (err) {
      console.error(err);
      setMessage("❌ Something went wrong.");
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-8 p-6 bg-white rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Register New Patient</h2>

      {message && <div className="mb-2 text-sm text-red-600">{message}</div>}

      <form className="space-y-4" onSubmit={handleSubmit}>
        <input
          className="w-full border p-2 rounded"
          name="name"
          value={form.name}
          placeholder="Full Name"
          onChange={handleChange}
        />
        <input
          className="w-full border p-2 rounded"
          name="age"
          type="number"
          value={form.age}
          placeholder="Age"
          onChange={handleChange}
        />
        <select
          className="w-full border p-2 rounded"
          name="gender"
          value={form.gender}
          onChange={handleChange}
        >
          <option value="">Select Gender</option>
          <option>Male</option>
          <option>Female</option>
          <option>Other</option>
        </select>
        <input
          className="w-full border p-2 rounded"
          name="phone"
          value={form.phone}
          placeholder="Phone Number"
          onChange={handleChange}
        />
        <textarea
          className="w-full border p-2 rounded"
          name="address"
          value={form.address}
          placeholder="Address"
          onChange={handleChange}
        />
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="consent"
            checked={form.consent}
            onChange={handleChange}
          />
          <span>I consent to store my information</span>
        </label>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Register Patient
        </button>
      </form>

      {patients.length > 0 && (
        <div className="mt-6">
          <h3 className="font-medium mb-2">Registered Patients:</h3>
          <ul className="space-y-1 text-sm">
            {patients.map((p) => (
              <li key={p.id} className="p-2 bg-gray-100 rounded">
                <strong>{p.name}</strong> ({p.phone}) – {p.gender || "N/A"},{" "}
                {p.age || "?"} yrs
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
