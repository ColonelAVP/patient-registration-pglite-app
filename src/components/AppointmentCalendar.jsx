import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { runQuery, insertAppointment } from '../db/database';

const localizer = momentLocalizer(moment);

export default function AppointmentCalendar() {
  const [appointments, setAppointments] = useState([]);
  const [patientsMap, setPatientsMap] = useState({});

  // Load patients and appointments
  useEffect(() => {
    const loadData = async () => {
      // Fetch patients
      const pres = await runQuery('SELECT id, name FROM patients;');
      const pMap = {};
      (pres.values || []).forEach(r => {
        pMap[r[0]] = r[1];
      });
      setPatientsMap(pMap);

      // Fetch appointments
      const res = await runQuery('SELECT id, patient_id, start, end, title FROM appointments;');
      const cols = res.columns || [];
      const rows = res.values || [];
      const events = rows.map(r => {
        const obj = Object.fromEntries(cols.map((c, i) => [c, r[i]]));
        const patientName = pMap[obj.patient_id] || 'Unknown Patient';
        return {
          id: obj.id,
          title: `${patientName} - ${obj.title || ''}`,
          start: new Date(obj.start),
          end: new Date(obj.end),
        };
      });
      setAppointments(events);
    };
    loadData();
  }, []);

  const handleSelectSlot = async ({ start, end }) => {
    // Prompt user to pick a patient by ID
    const list = Object.entries(patientsMap)
      .map(([id, name]) => `${id}: ${name}`)
      .join('\n');
    const pid = window.prompt(`Enter patient ID for appointment:\n${list}`);
    if (!pid || !patientsMap[pid]) return;
    const title = window.prompt('Enter appointment title:');
    if (title == null) return;

    await insertAppointment({
      patient_id: Number(pid),
      start: start.toISOString(),
      end: end.toISOString(),
      title,
    });

    // Refresh events
    const res = await runQuery('SELECT id, patient_id, start, end, title FROM appointments;');
    const cols = res.columns || [];
    const rows = res.values || [];
    const events = rows.map(r => {
      const obj = Object.fromEntries(cols.map((c, i) => [c, r[i]]));
      const patientName = patientsMap[obj.patient_id] || 'Unknown Patient';
      return {
        id: obj.id,
        title: `${patientName} - ${obj.title || ''}`,
        start: new Date(obj.start),
        end: new Date(obj.end),
      };
    });
    setAppointments(events);
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
        Appointment Scheduler
      </h2>
      <Calendar
        localizer={localizer}
        events={appointments}
        startAccessor="start"
        endAccessor="end"
        selectable
        onSelectSlot={handleSelectSlot}
        style={{ height: 600 }}
        views={["month", "week", "day"]}
      />
    </div>
  );
}
