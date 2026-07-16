// src/components/hod/ClassroomsTab.jsx
import React from 'react';

const ClassroomsTab = ({ classrooms }) => (
  <div>
    <div style={{ marginBottom: '1.5rem' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Classroom Assignments</h2>
    </div>

    <div className="data-table">
      <table>
        <thead>
          <tr>
            <th>Semester</th>
            <th>Section</th>
            <th>Room</th>
            <th>Capacity</th>
            <th style={{ textAlign: 'center' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {classrooms.map(classroom => (
            <tr key={classroom.assignmentId}>
              <td style={{ fontWeight: '500' }}>Semester {classroom.semesterId}</td>
              <td>Section {classroom.sectionId}</td>
              <td style={{ fontWeight: '500' }}>{classroom.roomCode}</td>
              <td>{classroom.capacity}</td>
              <td style={{ textAlign: 'center' }}>
                <button className="btn btn-warning" style={{ fontSize: '0.75rem', padding: '0.4rem 0.6rem' }}>
                  Modify
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default ClassroomsTab;