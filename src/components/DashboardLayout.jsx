import React from 'react';

const DashboardLayout = ({ children }) => (
  <div className="min-h-screen bg-gradient-to-br from-purple-900 to-purple-700 text-gray-100">
    <header className="bg-purple-800 py-4 px-6 shadow-md">
      <h1 className="text-2xl font-bold">🏥 Patient Management Dashboard</h1>
    </header>
    <main className="p-6 space-y-10">
      {children}
    </main>
  </div>
);

export default DashboardLayout;