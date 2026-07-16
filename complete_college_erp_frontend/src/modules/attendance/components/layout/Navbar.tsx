// // import React from 'react';
// // import { Menu, LogOut, User } from 'lucide-react';
// // import { Button } from '../ui/button';
// // import { useAuthStore } from '../../store/authStore';
// // import { useNavigate } from 'react-router-dom';
// // import NotificationBell from '../notifications/NotificationBell';
// // import { toast } from 'sonner';

// // interface NavbarProps {
// //   onMenuClick: () => void;
// // }

// // const Navbar: React.FC<NavbarProps> = ({ onMenuClick }) => {
// //   const { user, logout } = useAuthStore();
// //   const navigate = useNavigate();

// //   const handleLogout = () => {
// //     logout();
// //     toast.success('Logged out successfully');
// //     navigate('/login');
// //   };

// //   if (!user) return null;

// //   return (
// //     <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
// //       <div className="flex items-center justify-between px-4 py-3">
// //         <div className="flex items-center gap-4">
// //           <Button
// //             variant="ghost"
// //             size="icon"
// //             onClick={onMenuClick}
// //             className="lg:hidden"
// //           >
// //             <Menu className="h-6 w-6" />
// //           </Button>
          
// //           <div className="flex items-center gap-2">
// //             <div className="bg-primary text-white p-2 rounded-lg">
// //               <span className="font-bold text-xl">AU</span>
// //             </div>
// //             <div>
// //               <h1 className="text-xl font-bold text-gray-900">Anna University</h1>
// //               <p className="text-xs text-gray-500">Attendance & Performance System</p>
// //             </div>
// //           </div>
// //         </div>

// //         <div className="flex items-center gap-2">
// //           {/* Notification Bell for Students */}
// //           <NotificationBell />
          
// //           <div className="flex items-center gap-2 ml-4">
// //             <div className="text-right hidden sm:block">
// //               <p className="text-sm font-medium text-gray-900">{user.name}</p>
// //               <p className="text-xs text-gray-500 capitalize">{user.userType.toLowerCase()}</p>
// //             </div>
// //             <Button variant="ghost" size="icon">
// //               <User className="h-5 w-5" />
// //             </Button>
// //             <Button variant="ghost" size="icon" onClick={handleLogout} title="Logout">
// //               <LogOut className="h-5 w-5" />
// //             </Button>
// //           </div>
// //         </div>
// //       </div>
// //     </header>
// //   );
// // };

// // export default Navbar;


// import React from 'react';
// import { Menu, LogOut, User } from 'lucide-react';
// import { Button } from '../ui/button';
// import { useAuthStore } from '../../store/authStore';
// import { useNavigate } from 'react-router-dom';
// import NotificationBell from '../notifications/NotificationBell';
// import { toast } from 'sonner';

// interface NavbarProps {
//   onMenuClick: () => void;
// }

// const Navbar: React.FC<NavbarProps> = ({ onMenuClick }) => {
//   const { user, logout } = useAuthStore();
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     logout();
//     toast.success('Logged out successfully');
//     navigate('/attendance/login'); // ✅ Fixed - navigate to attendance module login
//   };

//   if (!user) return null;

//   return (
//     <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
//       <div className="flex items-center justify-between px-4 py-3">
//         <div className="flex items-center gap-4">
//           <Button
//             variant="ghost"
//             size="icon"
//             onClick={onMenuClick}
//             className="lg:hidden"
//           >
//             <Menu className="h-6 w-6" />
//           </Button>
          
//           <div className="flex items-center gap-2">
//             <div className="bg-primary text-white p-2 rounded-lg">
//               <span className="font-bold text-xl">AU</span>
//             </div>
//             <div>
//               <h1 className="text-xl font-bold text-gray-900">Anna University</h1>
//               <p className="text-xs text-gray-500">Attendance & Performance System</p>
//             </div>
//           </div>
//         </div>

//         <div className="flex items-center gap-2">
//           {/* Notification Bell for Students */}
//           <NotificationBell />
          
//           <div className="flex items-center gap-2 ml-4">
//             <div className="text-right hidden sm:block">
//               <p className="text-sm font-medium text-gray-900">{user.name}</p>
//               <p className="text-xs text-gray-500 capitalize">{user.userType.toLowerCase()}</p>
//             </div>
//             <Button variant="ghost" size="icon">
//               <User className="h-5 w-5" />
//             </Button>
//             <Button variant="ghost" size="icon" onClick={handleLogout} title="Logout">
//               <LogOut className="h-5 w-5" />
//             </Button>
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Navbar;

import React, { useState, useRef, useEffect } from "react";
import { Menu, GraduationCap, User, LogOut, ChevronDown } from "lucide-react";

interface NavbarProps {
  onMenuClick: () => void;
  userType?: "staff" | "student" | "admin";
  userName?: string;
  onLogout?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({
  onMenuClick,
  userType = "staff",
  userName = "Dr. Rajesh Kumar",
  onLogout,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const roleLabel =
    userType === "staff"
      ? "Staff"
      : userType === "student"
      ? "Student"
      : "Admin";

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-white border-b border-gray-200 flex items-center px-4 md:px-6">
      {/* Mobile menu toggle */}
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 rounded-md text-gray-500 hover:bg-gray-100 mr-3"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Brand */}
      <div className="flex items-center gap-2">
        <GraduationCap className="h-6 w-6 text-blue-600" />
        <span className="font-semibold text-gray-900 text-sm hidden sm:block">
          College ERP
        </span>
      </div>

      <div className="flex-1" />

      {/* User dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen((prev) => !prev)}
          className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
        >
          {/* Avatar circle */}
          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-xs font-semibold">
            {initials}
          </div>
          <div className="hidden md:block text-left">
            <p className="text-sm font-medium text-gray-900 leading-none">
              {userName}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">{roleLabel}</p>
          </div>
          <ChevronDown className="h-4 w-4 text-gray-400 hidden md:block" />
        </button>

        {/* Dropdown panel */}
        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50">
            {/* User info header */}
            <div className="px-3 py-2 border-b border-gray-100">
              <p className="text-sm font-medium text-gray-900">{userName}</p>
              <p className="text-xs text-gray-500">{roleLabel}</p>
            </div>

            {/* Profile item */}
            <button
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              onClick={() => setDropdownOpen(false)}
            >
              <User className="h-4 w-4" />
              Profile
            </button>

            <div className="border-t border-gray-100 my-1" />

            {/* Logout item */}
            <button
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
              onClick={() => {
                setDropdownOpen(false);
                onLogout?.();
              }}
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;