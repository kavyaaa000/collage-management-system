// import React, { useState } from 'react';
// import Navbar from './Navbar';
// import Sidebar from './Sidebar';

// interface LayoutProps {
//   children: React.ReactNode;
//   userType?: 'staff' | 'student' | 'admin';
//   userName?: string;
// }

// const Layout: React.FC<LayoutProps> = ({ 
//   children, 
//   userType = 'staff',
//   userName = 'Dr. Rajesh Kumar'
// }) => {
//   const [sidebarOpen, setSidebarOpen] = useState(false);

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <Navbar
//         onMenuClick={() => setSidebarOpen(true)}
//         userType={userType}
//         userName={userName}
//       />
      
//       <Sidebar
//         isOpen={sidebarOpen}
//         onClose={() => setSidebarOpen(false)}
//         userType={userType}
//       />

//       <main className="lg:ml-64 min-h-[calc(100vh-64px)]">
//         <div className="p-4 md:p-6 lg:p-8">
//           {children}
//         </div>
//       </main>
//     </div>
//   );
// };

// export default Layout;









import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
  userType?: 'staff' | 'student' | 'admin';
  userName?: string;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  userType = 'staff',
  userName = 'Dr. Rajesh Kumar',
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  // ← matches your AdminLayout pattern exactly
  const handleLogout = () => {
    // Clear whatever auth tokens your attendance module uses
    localStorage.removeItem('attendance_token');   // adjust key to match your app
    localStorage.removeItem('attendance_user');
    navigate('/attendance/login');                 // adjust path to your login route
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        onMenuClick={() => setSidebarOpen(true)}
        userType={userType}
        userName={userName}
        onLogout={handleLogout}   // ← wired here
      />

      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        userType={userType}
      />

      <main className="lg:ml-64 min-h-[calc(100vh-64px)]">
        <div className="p-4 md:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;