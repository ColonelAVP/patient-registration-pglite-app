// // src/App.jsx
// import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
// import Layout from './components/Layout';
// import RegisterPatientForm from './components/RegisterPatientForm';
// import QueryRunner from './components/QueryRunner';

// const App = () => (
//   <BrowserRouter>
//     <Layout>
//       <Routes>
//         <Route path="/" element={<Navigate to="/register" replace />} />
//         <Route path="/register" element={<RegisterPatientForm />} />
//         <Route path="/sql"      element={<QueryRunner />} />
//         {/* future: <Route path="/dashboard" ... /> */}
//       </Routes>
//     </Layout>
//   </BrowserRouter>
// );

// export default App;

// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import RegisterPatientForm from './components/RegisterPatientForm';
import Layout from './components/Layout';
import AppointmentCalendar from './components/AppointmentCalendar';


// import QueryRunner from './components/QueryRunner';
// import RegisterPatientForm from './components/RegisterPatientForm';
import QueryRunner from './components/QueryRunner';
import Dashboard from './components/Dashboard';

const App = () => (
  <BrowserRouter>
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/register" element={<RegisterPatientForm />} />
        <Route path="/sql"      element={<QueryRunner />} />
        <Route path="/calendar" element={<AppointmentCalendar />} />
      </Routes>
    </Layout>
  </BrowserRouter>
);

export default App;
