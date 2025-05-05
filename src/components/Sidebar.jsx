// src/components/Sidebar.jsx
import { NavLink } from 'react-router-dom';
import { Home, UserPlus, Terminal } from 'lucide-react';
import { Calendar as CalendarIcon } from 'lucide-react';


const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: Home },
  { to: '/register',  label: 'Register',  icon: UserPlus },
  { to: '/sql',       label: 'SQL Runner', icon: Terminal },
  { to: '/calendar',  label: 'Calendar',   icon: CalendarIcon },
];

const Sidebar = () => (
  <aside className="w-64 bg-gray-800 text-gray-100 flex flex-col">
    <div className="px-6 py-4 text-2xl font-bold">PatientApp</div>
    <nav className="flex-1 px-2 space-y-1">
      {navItems.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2 rounded-lg ${
              isActive
                ? 'bg-gray-700 text-white'
                : 'hover:bg-gray-700 hover:text-white'
            }`
          }
        >
          <Icon className="h-5 w-5" />
          <span className="font-medium">{label}</span>
        </NavLink>
      ))}
    </nav>
  </aside>
);

export default Sidebar;
