import React, { useState, useEffect } from 'react';
import hodService from '../../services/hodService';
import DashboardTab from './DashboardTab';
import MappingTab from './MappingTab';
import TimetableTab from './TimetableTab';
import ClassroomsTab from './ClassroomsTab';
import EditMappingModal from './EditMappingModal';
import NewMappingModal from './NewMappingModal';


const HODDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [deptId] = useState(1);
  const [sessionId] = useState(25);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);
  const [offerings, setOfferings] = useState([]);
  const [staffWorkload, setStaffWorkload] = useState([]);
  const [timetables, setTimetables] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [availableRooms, setAvailableRooms] = useState([]);
  const [allStaff, setAllStaff] = useState([]);
  const [selectedOffering, setSelectedOffering] = useState(null);
  const [showMappingModal, setShowMappingModal] = useState(false);
  const [showNewMappingModal, setShowNewMappingModal] = useState(false);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, [activeTab]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'dashboard') {
        await loadStats();
        await loadStaffWorkload();
      } else if (activeTab === 'mapping') {
        await loadOfferings();
        await loadStaffWorkload();
        await loadAllStaff();
      } else if (activeTab === 'timetable') {
        await loadTimetables();
      } else if (activeTab === 'classrooms') {
        await loadClassrooms();
        await loadAvailableRooms();
      }
    } catch (error) {
      showNotification('Error loading data: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const loadStats = async () => {
    const data = await hodService.getDashboardStats(deptId, sessionId);
    setStats(data);
  };

  const loadOfferings = async () => {
    const data = await hodService.getSubjectOfferings(deptId, sessionId);
    setOfferings(data);
  };

  const loadStaffWorkload = async () => {
    const data = await hodService.getStaffWorkload(deptId, sessionId);
    setStaffWorkload(data);
  };

  const loadAllStaff = async () => {
    const data = await hodService.getAvailableStaff(deptId);
    setAllStaff(data);
  };

  const loadTimetables = async () => {
    const data = await hodService.getTimetables(deptId, sessionId);
    setTimetables(data);
  };

  const loadClassrooms = async () => {
    const data = await hodService.getClassroomAssignments(sessionId, deptId);
    setClassrooms(data);
  };

  const loadAvailableRooms = async () => {
    const data = await hodService.getAvailableRooms(deptId);
    setAvailableRooms(data);
  };

  const generateTimetable = async () => {
    if (!window.confirm('Generate new timetable? This may take 5-10 minutes.')) return;
    
    setLoading(true);
    showNotification('Timetable generation started... Please wait.', 'info');
    
    try {
      const response = await hodService.generateTimetable({
        sessionId,
        deptId,
        generatedBy: 1
      });
      
      if (response.status === 'SUCCESS') {
        showNotification('✅ Timetable generated successfully!', 'success');
        await loadTimetables();
        setActiveTab('timetable');
      } else {
        showNotification('❌ ' + response.message, 'error');
      }
    } catch (error) {
      showNotification('Error generating timetable: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const downloadTimetable = async (timetableId, format) => {
    try {
      await hodService.downloadTimetable(timetableId, format);
      showNotification('✅ Download started', 'success');
    } catch (error) {
      if (error.response?.status === 404) {
        showNotification(`⚠️ ${format.toUpperCase()} file not available yet.`, 'error');
      } else {
        showNotification('❌ Download failed: ' + error.message, 'error');
      }
    }
  };

  const saveStaffMapping = async (mapping) => {
    try {
      await hodService.saveSubjectStaffMapping({
        ...mapping,
        createdBy: 1
      });
      
      showNotification('✅ Mapping saved successfully', 'success');
      await loadOfferings();
      await loadStaffWorkload();
      setShowMappingModal(false);
      setShowNewMappingModal(false);
    } catch (error) {
      showNotification('Error saving mapping: ' + error.message, 'error');
    }
  };

  const deleteMapping = async (configId) => {
    if (!window.confirm('Are you sure you want to remove this staff mapping?')) return;
    
    try {
      await hodService.deleteSubjectStaffMapping(configId);
      showNotification('✅ Mapping removed successfully', 'success');
      await loadOfferings();
      await loadStaffWorkload();
    } catch (error) {
      showNotification('Error deleting mapping: ' + error.message, 'error');
    }
  };

  const updateTimetableStatus = async (timetableId, newStatus) => {
    try {
      await hodService.updateTimetableStatus(timetableId, newStatus);
      showNotification(`✅ Timetable status updated to ${newStatus}`, 'success');
      await loadTimetables();
    } catch (error) {
      showNotification('Error updating status: ' + error.message, 'error');
    }
  };

  return (
    <div className="hod-container">
      {/* Notification */}
      {notification && (
        <div className={`notification notification-${notification.type}`}>
          <span>{notification.message}</span>
          <button onClick={() => setNotification(null)}>×</button>
        </div>
      )}

      {/* Header */}
      <div className="hod-header">
        <div className="header-content">
          <div>
            <h1>HOD Dashboard</h1>
            <p>Department of Computer Science & Engineering</p>
          </div>
          <div className="header-info">
            <div className="info-label">Academic Year</div>
            <div className="info-value">2024-2025 (ODD)</div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="hod-tabs">
        <div className="tabs-container">
          {[
            { id: 'dashboard', label: 'Dashboard' },
            { id: 'mapping', label: 'Staff Mapping' },
            { id: 'timetable', label: 'Timetable' },
            { id: 'classrooms', label: 'Classrooms' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="hod-content">
        {loading && (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading...</p>
          </div>
        )}

        {!loading && activeTab === 'dashboard' && (
          <DashboardTab stats={stats} staffWorkload={staffWorkload} />
        )}

        {!loading && activeTab === 'mapping' && (
          <MappingTab 
            offerings={offerings}
            staffWorkload={staffWorkload}
            allStaff={allStaff}
            onEdit={(offering) => {
              setSelectedOffering(offering);
              setShowMappingModal(true);
            }}
            onDelete={deleteMapping}
            onAddNew={(offering) => {
              setSelectedOffering(offering);
              setShowNewMappingModal(true);
            }}
          />
        )}

        {!loading && activeTab === 'timetable' && (
          <TimetableTab 
            timetables={timetables}
            onGenerate={generateTimetable}
            onDownload={downloadTimetable}
            onUpdateStatus={updateTimetableStatus}
          />
        )}

        {!loading && activeTab === 'classrooms' && (
          <ClassroomsTab 
            classrooms={classrooms}
            availableRooms={availableRooms}
          />
        )}

        {/* Edit Mapping Modal */}
        {showMappingModal && selectedOffering && (
          <EditMappingModal
            offering={selectedOffering}
            onSave={saveStaffMapping}
            onClose={() => setShowMappingModal(false)}
          />
        )}

        {/* New Mapping Modal */}
        {showNewMappingModal && selectedOffering && (
          <NewMappingModal
            offering={selectedOffering}
            allStaff={allStaff}
            onSave={saveStaffMapping}
            onClose={() => setShowNewMappingModal(false)}
          />
        )}
      </div>
    </div>
  );
};

export default HODDashboard;