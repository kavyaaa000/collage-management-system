// import React, { useState, useEffect } from 'react';
// import { getAll, create, update, remove } from '../../services/api';

// function StudentManagement() {
//   const [students, setStudents] = useState([]);
//   const [departments, setDepartments] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showModal, setShowModal] = useState(false);
//   const [editMode, setEditMode] = useState(false);
//   const [currentStudent, setCurrentStudent] = useState({
//     registerNumber: '',
//     batchNumber: '',
//     studentName: '',
//     deptId: '',
//     programId: 1,
//     regulationId: 1,
//     currentSemesterId: 1,
//     sectionId: 1,
//     admissionYear: 2024,
//     status: 'ACTIVE',
//   });
//   const [error, setError] = useState('');
//   const [filterDept, setFilterDept] = useState('');

//   useEffect(() => {
//     loadData();
//   }, []);

//   const loadData = async () => {
//     try {
//       const [studentResponse, deptResponse] = await Promise.all([
//         getAll('students'),
//         getAll('departments'),
//       ]);
//       setStudents(studentResponse.data);
//       setDepartments(deptResponse.data);
//     } catch (err) {
//       setError('Failed to load data');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleOpenModal = (student = null) => {
//     if (student) {
//       setCurrentStudent(student);
//       setEditMode(true);
//     } else {
//       setCurrentStudent({
//         registerNumber: '',
//         batchNumber: '',
//         studentName: '',
//         deptId: departments.length > 0 ? departments[0].deptId : '',
//         programId: 1,
//         regulationId: 1,
//         currentSemesterId: 1,
//         sectionId: 1,
//         admissionYear: 2024,
//         status: 'ACTIVE',
//       });
//       setEditMode(false);
//     }
//     setShowModal(true);
//     setError('');
//   };

//   const handleCloseModal = () => {
//     setShowModal(false);
//     setError('');
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setCurrentStudent({ ...currentStudent, [name]: value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       if (editMode) {
//         await update('students', currentStudent.studentId, currentStudent);
//       } else {
//         await create('students', currentStudent);
//       }
//       loadData();
//       handleCloseModal();
//     } catch (err) {
//       setError(err.response?.data?.message || 'Operation failed');
//     }
//   };

//   const handleDelete = async (id) => {
//     if (window.confirm('Are you sure you want to delete this student?')) {
//       try {
//         await remove('students', id);
//         loadData();
//       } catch (err) {
//         alert(err.response?.data?.message || 'Delete failed');
//       }
//     }
//   };

//   const getDeptName = (deptId) => {
//     const dept = departments.find(d => d.deptId === deptId);
//     return dept ? dept.deptName : 'N/A';
//   };

//   const filteredStudents = filterDept 
//     ? students.filter(s => s.deptId === parseInt(filterDept))
//     : students;

//   if (loading) return <div className="loading">Loading...</div>;

//   return (
//     <div>
//       <h2 className="page-title">Student Management</h2>
      
//       <div className="actions">
//         <button className="btn-primary" onClick={() => handleOpenModal()}>
//           Add New Student
//         </button>
        
//         <select 
//           value={filterDept} 
//           onChange={(e) => setFilterDept(e.target.value)}
//           style={{ marginLeft: '1rem', padding: '0.6rem' }}
//         >
//           <option value="">All Departments</option>
//           {departments.map(dept => (
//             <option key={dept.deptId} value={dept.deptId}>
//               {dept.deptName}
//             </option>
//           ))}
//         </select>
//       </div>

//       <table>
//         <thead>
//           <tr>
//             <th>ID</th>
//             <th>Register No</th>
//             <th>Batch No</th>
//             <th>Name</th>
//             <th>Department</th>
//             <th>Semester</th>
//             <th>Year</th>
//             <th>Status</th>
//             <th>Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {filteredStudents.map((student) => (
//             <tr key={student.studentId}>
//               <td>{student.studentId}</td>
//               <td>{student.registerNumber}</td>
//               <td>{student.batchNumber}</td>
//               <td>{student.studentName}</td>
//               <td>{getDeptName(student.deptId)}</td>
//               <td>{student.currentSemesterId}</td>
//               <td>{student.admissionYear}</td>
//               <td>{student.status}</td>
//               <td>
//                 <button className="btn-warning" onClick={() => handleOpenModal(student)}>Edit</button>
//                 <button className="btn-danger" onClick={() => handleDelete(student.studentId)}>Delete</button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       {showModal && (
//         <div className="modal">
//           <div className="modal-content">
//             <h3>{editMode ? 'Edit Student' : 'Add New Student'}</h3>
//             {error && <div className="error">{error}</div>}
            
//             <form onSubmit={handleSubmit}>
//               <div className="form-group">
//                 <label>Register Number *</label>
//                 <input
//                   type="text"
//                   name="registerNumber"
//                   value={currentStudent.registerNumber}
//                   onChange={handleChange}
//                   required
//                 />
//               </div>

//               <div className="form-group">
//                 <label>Batch Number *</label>
//                 <input
//                   type="text"
//                   name="batchNumber"
//                   value={currentStudent.batchNumber}
//                   onChange={handleChange}
//                   required
//                 />
//               </div>

//               <div className="form-group">
//                 <label>Student Name *</label>
//                 <input
//                   type="text"
//                   name="studentName"
//                   value={currentStudent.studentName}
//                   onChange={handleChange}
//                   required
//                 />
//               </div>

//               <div className="form-group">
//                 <label>Department *</label>
//                 <select
//                   name="deptId"
//                   value={currentStudent.deptId}
//                   onChange={handleChange}
//                   required
//                 >
//                   <option value="">Select Department</option>
//                   {departments.map(dept => (
//                     <option key={dept.deptId} value={dept.deptId}>
//                       {dept.deptName}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <div className="form-group">
//                 <label>Current Semester</label>
//                 <input
//                   type="number"
//                   name="currentSemesterId"
//                   value={currentStudent.currentSemesterId}
//                   onChange={handleChange}
//                   min="1"
//                   max="8"
//                 />
//               </div>

//               <div className="form-group">
//                 <label>Admission Year *</label>
//                 <input
//                   type="number"
//                   name="admissionYear"
//                   value={currentStudent.admissionYear}
//                   onChange={handleChange}
//                   required
//                 />
//               </div>

//               <div className="form-group">
//                 <label>Status</label>
//                 <select
//                   name="status"
//                   value={currentStudent.status}
//                   onChange={handleChange}
//                 >
//                   <option value="ACTIVE">ACTIVE</option>
//                   <option value="PASSED">PASSED</option>
//                   <option value="INACTIVE">INACTIVE</option>
//                 </select>
//               </div>

//               <div style={{ marginTop: '1.5rem' }}>
//                 <button type="submit" className="btn-success">
//                   {editMode ? 'Update' : 'Create'}
//                 </button>
//                 <button type="button" className="btn-danger" onClick={handleCloseModal}>
//                   Cancel
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default StudentManagement;




import React, { useState, useEffect } from 'react';
import { getAll, getById, create, update, remove } from '../../../services/api';
import { useNavigate } from 'react-router-dom';

function StudentManagement() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [allStudents, setAllStudents] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentStudent, setCurrentStudent] = useState({
    registerNumber: '',
    batchNumber: '',
    studentName: '',
    deptId: '',
    programId: 1,
    regulationId: 1,
    currentSemesterId: 1,
    sectionId: 1,
    admissionYear: 2024,
    status: 'ACTIVE',
  });
  const [error, setError] = useState('');
  
  // Filters
  const [filterDept, setFilterDept] = useState('');
  const [filterSemester, setFilterSemester] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterYear, setFilterYear] = useState('');
  const [searchText, setSearchText] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filterDept, filterSemester, filterStatus, filterYear, searchText, allStudents]);

  const loadData = async () => {
    try {
      const [studentResponse, deptResponse] = await Promise.all([
        getAll('students'),
        getAll('departments'),
      ]);
      setAllStudents(studentResponse.data);
      setStudents(studentResponse.data);
      setDepartments(deptResponse.data);
    } catch (err) {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...allStudents];

    // Department filter
    if (filterDept) {
      filtered = filtered.filter(s => s.deptId === parseInt(filterDept));
    }

    // Semester filter
    if (filterSemester) {
      filtered = filtered.filter(s => s.currentSemesterId === parseInt(filterSemester));
    }

    // Status filter
    if (filterStatus) {
      filtered = filtered.filter(s => s.status === filterStatus);
    }

    // Year filter
    if (filterYear) {
      filtered = filtered.filter(s => s.admissionYear === parseInt(filterYear));
    }

    // Search filter
    if (searchText) {
      const search = searchText.toLowerCase();
      filtered = filtered.filter(s => 
        s.studentName.toLowerCase().includes(search) ||
        s.registerNumber.toLowerCase().includes(search) ||
        s.batchNumber.toLowerCase().includes(search)
      );
    }

    setStudents(filtered);
  };

  const clearFilters = () => {
    setFilterDept('');
    setFilterSemester('');
    setFilterStatus('');
    setFilterYear('');
    setSearchText('');
  };

  const handleOpenModal = (student = null) => {
    if (student) {
      setCurrentStudent(student);
      setEditMode(true);
    } else {
      setCurrentStudent({
        registerNumber: '',
        batchNumber: '',
        studentName: '',
        deptId: departments.length > 0 ? departments[0].deptId : '',
        programId: 1,
        regulationId: 1,
        currentSemesterId: 1,
        sectionId: 1,
        admissionYear: 2024,
        status: 'ACTIVE',
      });
      setEditMode(false);
    }
    setShowModal(true);
    setError('');
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setError('');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentStudent({ ...currentStudent, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        await update('students', currentStudent.studentId, currentStudent);
      } else {
        await create('students', currentStudent);
      }
      loadData();
      handleCloseModal();
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await remove('students', id);
        loadData();
      } catch (err) {
        alert(err.response?.data?.message || 'Delete failed');
      }
    }
  };

  const handleViewMarks = (student) => {
  navigate('/admin/student-marks', { 
  state: { 
    preselectedStudent: student.studentId,
    studentName: student.studentName,
    registerNumber: student.registerNumber
  } 
});

  };

  const handleViewJourney = (student) => {
    navigate('/admin/journey', { 
  state: { 
    preselectedStudent: student.studentId,
    studentName: student.studentName
  } 
});

  };

  const getDeptName = (deptId) => {
    const dept = departments.find(d => d.deptId === deptId);
    return dept ? dept.deptName : 'N/A';
  };

  const getUniqueYears = () => {
    const years = [...new Set(allStudents.map(s => s.admissionYear))];
    return years.sort((a, b) => b - a);
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div>
      <h2 className="page-title">Student Management</h2>
      
      {/* Action Buttons */}
      <div className="actions" style={{ marginBottom: '1rem' }}>
        <button className="btn-primary" onClick={() => handleOpenModal()}>
          Add New Student
        </button>
        <button 
          className="btn-success" 
          onClick={() => setShowFilters(!showFilters)}
          style={{ marginLeft: '0.5rem' }}
        >
          {showFilters ? 'Hide Filters ▲' : 'Show Filters ▼'}
        </button>
        {(filterDept || filterSemester || filterStatus || filterYear || searchText) && (
          <button className="btn-warning" onClick={clearFilters} style={{ marginLeft: '0.5rem' }}>
            Clear All Filters
          </button>
        )}
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '8px',
          marginBottom: '1.5rem',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ marginBottom: '1rem' }}>Filter Students</h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem'
          }}>
            <div className="form-group">
              <label>Department</label>
              <select 
                value={filterDept} 
                onChange={(e) => setFilterDept(e.target.value)}
                style={{ padding: '0.6rem' }}
              >
                <option value="">All Departments</option>
                {departments.map(dept => (
                  <option key={dept.deptId} value={dept.deptId}>
                    {dept.deptName}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Semester</label>
              <select 
                value={filterSemester} 
                onChange={(e) => setFilterSemester(e.target.value)}
                style={{ padding: '0.6rem' }}
              >
                <option value="">All Semesters</option>
                {[1,2,3,4,5,6,7,8].map(sem => (
                  <option key={sem} value={sem}>Semester {sem}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Status</label>
              <select 
                value={filterStatus} 
                onChange={(e) => setFilterStatus(e.target.value)}
                style={{ padding: '0.6rem' }}
              >
                <option value="">All Status</option>
                <option value="ACTIVE">ACTIVE</option>
                <option value="PASSED">PASSED</option>
                <option value="INACTIVE">INACTIVE</option>
              </select>
            </div>

            <div className="form-group">
              <label>Admission Year</label>
              <select 
                value={filterYear} 
                onChange={(e) => setFilterYear(e.target.value)}
                style={{ padding: '0.6rem' }}
              >
                <option value="">All Years</option>
                {getUniqueYears().map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Search</label>
              <input
                type="text"
                placeholder="Name, Register No, Batch No..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                style={{ padding: '0.6rem' }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Results Count */}
      <div style={{ marginBottom: '1rem', fontSize: '14px', color: '#666' }}>
        Showing <strong>{students.length}</strong> of <strong>{allStudents.length}</strong> students
      </div>

      {/* Students Table */}
      <div style={{ overflowX: 'auto' }}>
        <table>
          <thead>
            <tr>
              <th>S.No</th>
              <th>Register No</th>
              <th>Batch No</th>
              <th>Name</th>
              <th>Department</th>
              <th>Semester</th>
              <th>Year</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.length === 0 ? (
              <tr>
                <td colSpan="9" style={{ textAlign: 'center', padding: '2rem', color: '#999' }}>
                  No students found. Try adjusting your filters.
                </td>
              </tr>
            ) : (
              students.map((student, index) => (
                <tr key={student.studentId}>
                  <td>{index + 1}</td>
                  <td><strong>{student.registerNumber}</strong></td>
                  <td>{student.batchNumber}</td>
                  <td>{student.studentName}</td>
                  <td>{getDeptName(student.deptId)}</td>
                  <td>{student.currentSemesterId}</td>
                  <td>{student.admissionYear}</td>
                  <td>
                    <span style={{
                      padding: '0.3rem 0.6rem',
                      borderRadius: '4px',
                      backgroundColor: student.status === 'ACTIVE' ? '#d4edda' : 
                                       student.status === 'PASSED' ? '#cce5ff' : '#f8d7da',
                      color: student.status === 'ACTIVE' ? '#155724' : 
                             student.status === 'PASSED' ? '#004085' : '#721c24',
                      fontSize: '12px'
                    }}>
                      {student.status}
                    </span>
                  </td>
                  <td>
                    <button 
                      className="btn-primary" 
                      onClick={() => handleViewMarks(student)}
                      title="View Marks History"
                      style={{ fontSize: '12px', padding: '0.4rem 0.6rem' }}
                    >
                      📊 Marks
                    </button>
                    <button 
                      className="btn-success" 
                      onClick={() => handleViewJourney(student)}
                      title="View Academic Journey"
                      style={{ fontSize: '12px', padding: '0.4rem 0.6rem' }}
                    >
                      🎓 Journey
                    </button>
                    <button 
                      className="btn-warning" 
                      onClick={() => handleOpenModal(student)}
                      style={{ fontSize: '12px', padding: '0.4rem 0.6rem' }}
                    >
                      Edit
                    </button>
                    <button 
                      className="btn-danger" 
                      onClick={() => handleDelete(student.studentId)}
                      style={{ fontSize: '12px', padding: '0.4rem 0.6rem' }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal remains same as before */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>{editMode ? 'Edit Student' : 'Add New Student'}</h3>
            {error && <div className="error">{error}</div>}
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Register Number *</label>
                <input
                  type="text"
                  name="registerNumber"
                  value={currentStudent.registerNumber}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Batch Number *</label>
                <input
                  type="text"
                  name="batchNumber"
                  value={currentStudent.batchNumber}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Student Name *</label>
                <input
                  type="text"
                  name="studentName"
                  value={currentStudent.studentName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Department *</label>
                <select
                  name="deptId"
                  value={currentStudent.deptId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Department</option>
                  {departments.map(dept => (
                    <option key={dept.deptId} value={dept.deptId}>
                      {dept.deptName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Current Semester</label>
                <input
                  type="number"
                  name="currentSemesterId"
                  value={currentStudent.currentSemesterId}
                  onChange={handleChange}
                  min="1"
                  max="8"
                />
              </div>

              <div className="form-group">
                <label>Admission Year *</label>
                <input
                  type="number"
                  name="admissionYear"
                  value={currentStudent.admissionYear}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Status</label>
                <select
                  name="status"
                  value={currentStudent.status}
                  onChange={handleChange}
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="PASSED">PASSED</option>
                  <option value="INACTIVE">INACTIVE</option>
                </select>
              </div>

              <div style={{ marginTop: '1.5rem' }}>
                <button type="submit" className="btn-success">
                  {editMode ? 'Update' : 'Create'}
                </button>
                <button type="button" className="btn-danger" onClick={handleCloseModal}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default StudentManagement;