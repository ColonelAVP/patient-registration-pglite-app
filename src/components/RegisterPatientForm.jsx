

import React, { useState, useEffect, useRef } from 'react';
import { insertPatient, runQuery } from '../db/database';
import { UserPlus, ClipboardList, Download as DownloadIcon } from 'lucide-react';

const RegisterPatientForm = () => {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    age: '',
    gender: '',
    phone: '',
    address: '',
    consent: false,
  });
  const [patients, setPatients] = useState([]);
  const [error, setError] = useState('');
  const channel = useRef(null);

  useEffect(() => {
    channel.current = new BroadcastChannel('patient-sync');
    channel.current.onmessage = msg => {
      if (msg.data === 'updated') fetchPatients();
    };
    fetchPatients();
    return () => channel.current.close();
  }, []);

  const fetchPatients = async () => {
    try {
      const res = await runQuery('SELECT * FROM patients ORDER BY created_at DESC;');
      const cols = res.columns || [];
      const rows = res.values || [];
      const mapped = rows.map(r => {
        const obj = Object.fromEntries(cols.map((c, i) => [c, r[i]]));
        const [firstName, ...lastParts] = (obj.name || '').split(' ');
        return { ...obj, firstName, lastName: lastParts.join(' ') };
      });
      setPatients(mapped);
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleChange = ({ target }) => {
    const { name, value, type, checked } = target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const fullName = `${form.firstName} ${form.lastName}`.trim();
      await insertPatient({
        name: fullName,
        age: form.age,
        gender: form.gender,
        phone: form.phone,
        address: form.address,
        consent: form.consent,
      });
      channel.current.postMessage('updated');
      setForm({ firstName: '', lastName: '', age: '', gender: '', phone: '', address: '', consent: false });
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  const exportCSV = () => {
    if (!patients.length) return;
    const headers = ['firstName','lastName','age','gender','phone','address','consent','created_at'];
    const rows = patients.map(p => headers.map(h => (p[h] != null ? p[h] : '')));
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'patients.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportFHIR = () => {
    if (!patients.length) return;
    const bundle = {
      resourceType: 'Bundle',
      type: 'collection',
      entry: patients.map(p => ({
        resource: {
          resourceType: 'Patient',
          id: String(p.id),
          name: [{ given: [p.firstName], family: p.lastName }],
          gender: (p.gender || '').toLowerCase(),
          telecom: [{ system: 'phone', value: p.phone }],
          address: [{ text: p.address }],
          extension: [{
            url: 'http://example.com/fhir/StructureDefinition/consent',
            valueBoolean: Boolean(p.consent)
          }]
        }
      }))
    };
    const json = JSON.stringify(bundle, null, 2);
    const blob = new Blob([json], { type: 'application/fhir+json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'patients.fhir.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Registration Card */}
      <div className="bg-white rounded-2xl shadow p-6 dark:bg-gray-800">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
          <UserPlus className="text-purple-600" /> Register Patient
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-4">
            <input name="firstName" type="text" placeholder="First Name" required value={form.firstName} onChange={handleChange}
              className="flex-1 w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:border-gray-600" />
            <input name="lastName" type="text" placeholder="Last Name" required value={form.lastName} onChange={handleChange}
              className="flex-1 w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:border-gray-600" />
          </div>
          <div className="flex gap-4">
            <input name="age" type="number" placeholder="Age" required value={form.age} onChange={handleChange}
              className="flex-1 w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:border-gray-600" />
            <select name="gender" required value={form.gender} onChange={handleChange}
              className="flex-1 w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:border-gray-600">
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <input name="phone" type="text" placeholder="Phone Number" required value={form.phone} onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:border-gray-600" />
          <textarea name="address" rows="3" placeholder="Address" value={form.address} onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:border-gray-600" />
          <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <input name="consent" type="checkbox" checked={form.consent} onChange={handleChange}
              className="h-5 w-5 text-purple-600" /> I consent to store my information
          </label>
          <div className="flex justify-end gap-4">
            <button type="submit"
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-medium transition">
              Register
            </button>
          </div>
        </form>
        {error && <p className="text-red-500 mt-3">❌ {error}</p>}
      </div>

      {/* Patient List & Export */}
      <div className="bg-white rounded-2xl shadow p-6 dark:bg-gray-800">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2">
            <ClipboardList className="text-purple-600" /> Registered Patients
          </h2>
          <div className="flex gap-2">
            <button onClick={exportCSV}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-1">
              <DownloadIcon className="h-5 w-5" /> Export CSV
            </button>
            <button onClick={exportFHIR}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-1">
              <DownloadIcon className="h-5 w-5" /> FHIR JSON
            </button>
          </div>
        </div>
        <ul className="divide-y dark:divide-gray-700">
          {patients.map(p => (
            <li key={p.id} className="py-2 flex justify-between items-center">
              <div>
                <span className="font-medium text-gray-800 dark:text-gray-100">{p.firstName} {p.lastName}</span>
                <span className="ml-2 text-gray-500 dark:text-gray-400">({p.age} • {p.gender})</span>
              </div>
              <span className="text-gray-600 dark:text-gray-300">{p.phone}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default RegisterPatientForm;
