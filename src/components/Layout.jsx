// src/components/Layout.jsx
import React from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const Layout = ({ children }) => (
  <div className="flex h-screen overflow-hidden bg-gray-100 dark:bg-gray-900">
    <Sidebar />
    <div className="flex flex-col flex-1 overflow-auto">
      <Topbar />
      <main className="p-6 space-y-6">{children}</main>
    </div>
  </div>
);

export default Layout;