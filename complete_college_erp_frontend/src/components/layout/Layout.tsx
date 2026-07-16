import React, { useState } from 'react';
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
  userName = 'Dr. Rajesh Kumar'
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        onMenuClick={() => setSidebarOpen(true)}
        userType={userType}
        userName={userName}
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