// src/components/hod/DashboardTab.jsx
import React from 'react';

const StatCard = ({ title, value, color }) => (
  <div className={`stat-card stat-card-${color}`}>
    <div className="stat-card-content">
      <div className="stat-text">
        <p>{title}</p>
        <p className="stat-number">{value}</p>
      </div>
    </div>
  </div>
);

const DashboardTab = ({ stats, staffWorkload }) => (
  <div>
    {/* Stats Cards */}
    <div className="stats-grid">
      <StatCard 
        title="Total Staff" 
        value={stats?.totalStaff || 0} 
        color="blue" 
      />
      <StatCard 
        title="Mapped Subjects" 
        value={`${stats?.mappedSubjects || 0}/${stats?.totalSubjects || 0}`} 
        color="green" 
      />
      <StatCard 
        title="Assigned Classrooms" 
        value={`${stats?.assignedClassrooms || 0}/${stats?.totalClassrooms || 0}`} 
        color="purple" 
      />
      <StatCard 
        title="Active Timetables" 
        value={stats?.activeTimetables || 0} 
        color="orange" 
      />
    </div>

    {/* Staff Workload Chart */}
    <div className="card">
      <h3>Staff Workload Distribution</h3>
      <div>
        {staffWorkload.slice(0, 10).map(staff => (
          <div key={staff.staffId} className="workload-item">
            <div className="workload-name">
              {staff.staffName}
              <div className="workload-name-sub">{staff.employeeId}</div>
            </div>
            <div className="workload-bar-container">
              <div className="workload-bar">
                <div 
                  className={`workload-bar-fill ${
                    staff.workloadPercentage > 100 ? 'high' :
                    staff.workloadPercentage > 80 ? 'medium' : 'low'
                  }`}
                  style={{ width: `${Math.min(staff.workloadPercentage, 100)}%` }}
                />
              </div>
            </div>
            <div className="workload-hours">
              {staff.assignedHours}/{staff.maxHours} hrs
            </div>
            <div className={`workload-percentage ${
              staff.workloadPercentage > 100 ? 'high' :
              staff.workloadPercentage > 80 ? 'medium' : 'low'
            }`}>
              {staff.workloadPercentage.toFixed(0)}%
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default DashboardTab;