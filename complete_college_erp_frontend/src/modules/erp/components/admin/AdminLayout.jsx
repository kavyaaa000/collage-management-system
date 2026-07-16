import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import authService from '../../services/authService';

const AdminLayout = () => {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();

  const handleLogout = () => {
    authService.logout();
    // ✅ FIXED: Navigate to /erp/login instead of /login
    navigate('/erp/login');
  };

  return (
    <div className="admin-layout">
      <nav className="navbar">
        <h1>College ERP - Admin Panel</h1>
        <div className="user-info">
          <span>Welcome, {user?.username}</span>
          <button onClick={handleLogout} className="btn-logout">
            Logout
          </button>
        </div>
      </nav>

      <div className="admin-container">
        <aside className="sidebar">
          <ul className="nav-menu">
            <li>
              {/* ✅ FIXED: All NavLinks now use /erp prefix */}
              <NavLink to="/erp/admin" end>Dashboard</NavLink>
            </li>
            
            <li className="dropdown">
              <span className="menu-title">Master Data</span>
              <ul className="dropdown-content">
                <li><NavLink to="/erp/admin/colleges">Colleges</NavLink></li>
                <li><NavLink to="/erp/admin/departments">Departments</NavLink></li>
                <li><NavLink to="/erp/admin/programs">Programs</NavLink></li>
                <li><NavLink to="/erp/admin/regulations">Regulations</NavLink></li>
                <li><NavLink to="/erp/admin/sections">Sections</NavLink></li>
              </ul>
            </li>

            <li className="dropdown">
              <span className="menu-title">Academic Data</span>
              <ul className="dropdown-content">
                <li><NavLink to="/erp/admin/students">Students</NavLink></li>
                <li><NavLink to="/erp/admin/staff">Staff</NavLink></li>
                <li><NavLink to="/erp/admin/subjects">Subjects</NavLink></li>
              </ul>
            </li>

            <li>
              <NavLink to="/erp/admin/infrastructure">Infrastructure</NavLink>
            </li>

            <li className="dropdown">
              <span className="menu-title">Operations</span>
              <ul className="dropdown-content">
                <li><NavLink to="/erp/admin/attendance">Attendance</NavLink></li>
                <li><NavLink to="/erp/admin/exams">Exams</NavLink></li>
                <li><NavLink to="/erp/admin/marks-entry">Marks Entry</NavLink></li>
                <li><NavLink to="/erp/admin/student-marks">Student Marks</NavLink></li>
                <li><NavLink to="/erp/admin/journey">Student Journey</NavLink></li>
              </ul>
            </li>
          </ul>
        </aside>

        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;