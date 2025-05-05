import React, { useEffect, useState } from 'react';
import { runQuery } from '../db/database';
import Card from './Card';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
} from 'recharts';

const Dashboard = () => {
  const [totalPatients, setTotalPatients] = useState(0);
  const [registrationsToday, setRegistrationsToday] = useState(0);
  const [averageAge, setAverageAge] = useState(0);
  const [ageDist, setAgeDist] = useState([]);
  const [genderSplit, setGenderSplit] = useState([]);
  const [regOverTime, setRegOverTime] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await runQuery('SELECT age, gender, created_at FROM patients;');
        const cols = res.columns || [];
        const rows = res.values || [];
        const patients = rows.map(r => {
          const obj = {};
          cols.forEach((c, i) => (obj[c] = r[i]));
          return obj;
        });

        // KPIs
        setTotalPatients(patients.length);
        const today = new Date().toISOString().slice(0, 10);
        const todayCount = patients.filter(p => p.created_at.startsWith(today)).length;
        setRegistrationsToday(todayCount);
        const avgAge = patients.reduce((sum, p) => sum + (Number(p.age) || 0), 0) / (patients.length || 1);
        setAverageAge(avgAge);

        // Age distribution buckets
        const buckets = { '0-18': 0, '19-35': 0, '36-60': 0, '60+': 0 };
        patients.forEach(p => {
          const age = Number(p.age) || 0;
          if (age <= 18) buckets['0-18']++;
          else if (age <= 35) buckets['19-35']++;
          else if (age <= 60) buckets['36-60']++;
          else buckets['60+']++;
        });
        setAgeDist(Object.entries(buckets).map(([name, count]) => ({ name, count })));

        // Gender split
        const genders = patients.reduce((acc, p) => {
          const g = p.gender || 'Other';
          acc[g] = (acc[g] || 0) + 1;
          return acc;
        }, {});
        setGenderSplit(Object.entries(genders).map(([name, value]) => ({ name, value })));

        // Registrations over time
        const dateMap = {};
        patients.forEach(p => {
          const date = p.created_at.slice(0, 10);
          dateMap[date] = (dateMap[date] || 0) + 1;
        });
        const overtime = Object.entries(dateMap)
          .map(([date, count]) => ({ date, count }))
          .sort((a, b) => new Date(a.date) - new Date(b.date));
        setRegOverTime(overtime);

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#d0ed57'];

  if (loading) return <p className="p-6 text-center">Loading dashboard...</p>;
  if (error) return <p className="p-6 text-center text-red-500">Error: {error}</p>;

  return (
    <div className="space-y-8 p-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <h3 className="text-lg font-medium">Total Patients</h3>
          <p className="text-3xl font-bold">{totalPatients}</p>
        </Card>
        <Card>
          <h3 className="text-lg font-medium">Registrations Today</h3>
          <p className="text-3xl font-bold">{registrationsToday}</p>
        </Card>
        <Card>
          <h3 className="text-lg font-medium">Average Age</h3>
          <p className="text-3xl font-bold">{averageAge.toFixed(1)}</p>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-medium mb-4">Age Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={ageDist}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card>
          <h3 className="text-lg font-medium mb-4">Gender Split</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={genderSplit}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {genderSplit.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Line Chart */}
      <Card>
        <h3 className="text-lg font-medium mb-4">Registrations Over Time</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={regOverTime}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="count" stroke="#82ca9d" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
};

export default Dashboard;
