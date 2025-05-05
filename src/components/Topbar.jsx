// // src/components/Topbar.jsx
// import React from 'react';
// import { Search, Bell, User, Sun, Moon } from 'lucide-react';
// import { useDarkMode } from '../hooks/useDarkMode';

// const Topbar = () => {
//   const [isDark, setIsDark] = useDarkMode();

//   return (
//     <header className="flex items-center justify-between bg-white dark:bg-gray-800 border-b px-6 py-3 shadow-sm">
//       <div className="relative w-1/3">
//         <Search className="absolute top-2 left-3 text-gray-400 dark:text-gray-500" />
//         <input
//           type="text"
//           placeholder="Search..."
//           className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
//         />
//       </div>
//       <div className="flex items-center gap-4">
//         <button
//           onClick={() => setIsDark(!isDark)}
//           className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
//         >
//           {isDark ? <Sun className="h-6 w-6 text-yellow-400" /> : <Moon className="h-6 w-6 text-gray-600" />}
//         </button>
//         <Bell className="h-6 w-6 cursor-pointer text-gray-600 dark:text-gray-300" />
//         <User className="h-6 w-6 cursor-pointer text-gray-600 dark:text-gray-300" />
//       </div>
//     </header>
//   );
// };

// export default Topbar;


import React from 'react';
import { Bell, User, Sun, Moon } from 'lucide-react';
import { useDarkMode } from '../hooks/useDarkMode';

const Topbar = () => {
  const [isDark, setIsDark] = useDarkMode();

  return (
    <header className="flex items-center justify-end bg-white dark:bg-gray-800 border-b px-6 py-3 shadow-sm">
      <div className="flex items-center gap-4">
        <button
          onClick={() => setIsDark(!isDark)}
          className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          {isDark ? (
            <Sun className="h-6 w-6 text-yellow-400" />
          ) : (
            <Moon className="h-6 w-6 text-gray-600" />
          )}
        </button>
        <Bell className="h-6 w-6 cursor-pointer text-gray-600 dark:text-gray-300" />
        <User className="h-6 w-6 cursor-pointer text-gray-600 dark:text-gray-300" />
      </div>
    </header>
  );
};

export default Topbar;
