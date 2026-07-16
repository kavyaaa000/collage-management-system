import React, { useState, useEffect } from 'react';
import { getAll } from '../../services/api';

function Dashboard() {
  const [stats, setStats] = useState({
    colleges: 0,
    departments: 0,
    students: 0,
    staff: 0,
    subjects: 0,
    sessions: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [colleges, departments, students, staff, subjects, sessions] = await Promise.all([
        getAll('colleges'),
        getAll('departments'),
        getAll('students'),
        getAll('staff'),
        getAll('subjects'),
        getAll('sessions'),
      ]);

      setStats({
        colleges: colleges.data.length,
        departments: departments.data.length,
        students: students.data.length,
        staff: staff.data.length,
        subjects: subjects.data.length,
        sessions: sessions.data.length,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading Dashboard...</div>;

  return (
    <div>
      <h2 className="page-title">Admin Dashboard</h2>
      
      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Total Colleges</h3>
          <div className="number">{stats.colleges}</div>
        </div>
        
        <div className="stat-card">
          <h3>Total Departments</h3>
          <div className="number">{stats.departments}</div>
        </div>
        
        <div className="stat-card">
          <h3>Total Students</h3>
          <div className="number">{stats.students}</div>
        </div>
        
        <div className="stat-card">
          <h3>Total Staff</h3>
          <div className="number">{stats.staff}</div>
        </div>
        
        <div className="stat-card">
          <h3>Total Subjects</h3>
          <div className="number">{stats.subjects}</div>
        </div>
        
        <div className="stat-card">
          <h3>Academic Sessions</h3>
          <div className="number">{stats.sessions}</div>
        </div>
      </div>

      <div style={{ marginTop: '2rem', padding: '1.5rem', backgroundColor: 'white', borderRadius: '8px' }}>
        <h3>Quick Actions</h3>
        <p style={{ marginTop: '1rem', color: '#7f8c8d' }}>
          Welcome to College ERP Admin Control System. You have full access to all modules.
        </p>
        <ul style={{ marginTop: '1rem', lineHeight: '2' }}>
          <li>✓ Manage Master Data (Colleges, Departments)</li>
          <li>✓ Control Academic Data (Students, Staff, Subjects)</li>
          <li>✓ Monitor Attendance & Exams</li>
          <li>✓ View Student Academic Journey</li>
          <li>✓ Lock/Unlock Academic Sessions</li>
        </ul>
      </div>
    </div>
  );
}

export default Dashboard;