import React, { useState, useEffect } from 'react';
import { getAll, create, update, remove } from '../../../services/api';

function InfrastructureManagement() {
  const [activeTab, setActiveTab] = useState('blocks');
  const [colleges, setColleges] = useState([]);
  const [blocks, setBlocks] = useState([]);
  const [floors, setFloors] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentItem, setCurrentItem] = useState({});
  const [error, setError] = useState('');

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      const [collegesRes, blocksRes, floorsRes, roomsRes, roomTypesRes] = await Promise.all([
        getAll('colleges'),
        getAll('blocks'),
        getAll('floors'),
        getAll('rooms'),
        getAll('roomtypes'),
      ]);
      setColleges(collegesRes.data);
      setBlocks(blocksRes.data);
      setFloors(floorsRes.data);
      setRooms(roomsRes.data);
      setRoomTypes(roomTypesRes.data);
    } catch (err) {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (item = null) => {
    if (item) {
      setCurrentItem(item);
      setEditMode(true);
    } else {
      // Set defaults based on active tab
      if (activeTab === 'blocks') {
        setCurrentItem({
          blockCode: '',
          blockName: '',
          collegeId: colleges.length > 0 ? colleges[0].collegeId : '',
        });
      } else if (activeTab === 'floors') {
        setCurrentItem({
          blockId: blocks.length > 0 ? blocks[0].blockId : '',
          floorNumber: 1,
        });
      } else if (activeTab === 'rooms') {
        setCurrentItem({
          floorId: floors.length > 0 ? floors[0].floorId : '',
          roomNumber: '',
          roomCode: '',
          roomTypeId: roomTypes.length > 0 ? roomTypes[0].roomTypeId : '',
          capacity: 0,
        });
      } else if (activeTab === 'roomtypes') {
        setCurrentItem({ roomTypeName: '' });
      }
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
    setCurrentItem({ ...currentItem, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let endpoint = activeTab;
      let idField = `${activeTab.slice(0, -1)}Id`;
      
      if (activeTab === 'roomtypes') {
        idField = 'roomTypeId';
      }

      if (editMode) {
        await update(endpoint, currentItem[idField], currentItem);
      } else {
        await create(endpoint, currentItem);
      }
      loadAllData();
      handleCloseModal();
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await remove(activeTab, id);
        loadAllData();
      } catch (err) {
        alert(err.response?.data?.message || 'Delete failed');
      }
    }
  };

  const getCollegeName = (collegeId) => {
    const college = colleges.find(c => c.collegeId === collegeId);
    return college ? college.collegeName : 'N/A';
  };

  const getBlockName = (blockId) => {
    const block = blocks.find(b => b.blockId === blockId);
    return block ? `${block.blockCode} - ${block.blockName}` : 'N/A';
  };

  const getFloorName = (floorId) => {
    const floor = floors.find(f => f.floorId === floorId);
    if (!floor) return 'N/A';
    const block = blocks.find(b => b.blockId === floor.blockId);
    return block ? `${block.blockCode} - Floor ${floor.floorNumber}` : `Floor ${floor.floorNumber}`;
  };

  const getRoomTypeName = (roomTypeId) => {
    const roomType = roomTypes.find(rt => rt.roomTypeId === roomTypeId);
    return roomType ? roomType.roomTypeName : 'N/A';
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div>
      <h2 className="page-title">Infrastructure Management</h2>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        marginBottom: '2rem',
        borderBottom: '2px solid #ddd'
      }}>
        {['blocks', 'floors', 'rooms', 'roomtypes'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '0.8rem 1.5rem',
              border: 'none',
              background: activeTab === tab ? '#3498db' : 'transparent',
              color: activeTab === tab ? 'white' : '#333',
              cursor: 'pointer',
              borderRadius: '4px 4px 0 0',
              fontWeight: activeTab === tab ? 'bold' : 'normal',
              transition: 'all 0.3s'
            }}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div className="actions">
        <button className="btn-primary" onClick={() => handleOpenModal()}>
          Add New {activeTab.charAt(0).toUpperCase() + activeTab.slice(1, -1)}
        </button>
      </div>

      {/* Blocks Table */}
      {activeTab === 'blocks' && (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Block Code</th>
              <th>Block Name</th>
              <th>College</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {blocks.map((block) => (
              <tr key={block.blockId}>
                <td>{block.blockId}</td>
                <td><strong>{block.blockCode}</strong></td>
                <td>{block.blockName}</td>
                <td>{getCollegeName(block.collegeId)}</td>
                <td>
                  <button className="btn-warning" onClick={() => handleOpenModal(block)}>Edit</button>
                  <button className="btn-danger" onClick={() => handleDelete(block.blockId)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Floors Table */}
      {activeTab === 'floors' && (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Block</th>
              <th>Floor Number</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {floors.map((floor) => (
              <tr key={floor.floorId}>
                <td>{floor.floorId}</td>
                <td>{getBlockName(floor.blockId)}</td>
                <td><strong>Floor {floor.floorNumber}</strong></td>
                <td>
                  <button className="btn-warning" onClick={() => handleOpenModal(floor)}>Edit</button>
                  <button className="btn-danger" onClick={() => handleDelete(floor.floorId)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Rooms Table */}
      {activeTab === 'rooms' && (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Room Code</th>
              <th>Room Number</th>
              <th>Floor</th>
              <th>Type</th>
              <th>Capacity</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rooms.map((room) => (
              <tr key={room.roomId}>
                <td>{room.roomId}</td>
                <td><strong>{room.roomCode}</strong></td>
                <td>{room.roomNumber}</td>
                <td>{getFloorName(room.floorId)}</td>
                <td>{getRoomTypeName(room.roomTypeId)}</td>
                <td>{room.capacity}</td>
                <td>
                  <button className="btn-warning" onClick={() => handleOpenModal(room)}>Edit</button>
                  <button className="btn-danger" onClick={() => handleDelete(room.roomId)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Room Types Table */}
      {activeTab === 'roomtypes' && (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Room Type Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {roomTypes.map((roomType) => (
              <tr key={roomType.roomTypeId}>
                <td>{roomType.roomTypeId}</td>
                <td><strong>{roomType.roomTypeName}</strong></td>
                <td>
                  <button className="btn-warning" onClick={() => handleOpenModal(roomType)}>Edit</button>
                  <button className="btn-danger" onClick={() => handleDelete(roomType.roomTypeId)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modal for Add/Edit */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>{editMode ? `Edit ${activeTab}` : `Add New ${activeTab}`}</h3>
            {error && <div className="error">{error}</div>}
            
            <form onSubmit={handleSubmit}>
              {/* Block Form */}
              {activeTab === 'blocks' && (
                <>
                  <div className="form-group">
                    <label>Block Code *</label>
                    <input
                      type="text"
                      name="blockCode"
                      value={currentItem.blockCode || ''}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Block Name *</label>
                    <input
                      type="text"
                      name="blockName"
                      value={currentItem.blockName || ''}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>College *</label>
                    <select
                      name="collegeId"
                      value={currentItem.collegeId || ''}
                      onChange={handleChange}
                      required
                    >
                      {colleges.map(college => (
                        <option key={college.collegeId} value={college.collegeId}>
                          {college.collegeName}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              )}

              {/* Floor Form */}
              {activeTab === 'floors' && (
                <>
                  <div className="form-group">
                    <label>Block *</label>
                    <select
                      name="blockId"
                      value={currentItem.blockId || ''}
                      onChange={handleChange}
                      required
                    >
                      {blocks.map(block => (
                        <option key={block.blockId} value={block.blockId}>
                          {block.blockCode} - {block.blockName}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Floor Number *</label>
                    <input
                      type="number"
                      name="floorNumber"
                      value={currentItem.floorNumber || ''}
                      onChange={handleChange}
                      min="0"
                      max="50"
                      required
                    />
                  </div>
                </>
              )}

              {/* Room Form */}
              {activeTab === 'rooms' && (
                <>
                  <div className="form-group">
                    <label>Floor *</label>
                    <select
                      name="floorId"
                      value={currentItem.floorId || ''}
                      onChange={handleChange}
                      required
                    >
                      {floors.map(floor => (
                        <option key={floor.floorId} value={floor.floorId}>
                          {getFloorName(floor.floorId)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Room Number *</label>
                    <input
                      type="text"
                      name="roomNumber"
                      value={currentItem.roomNumber || ''}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Room Code *</label>
                    <input
                      type="text"
                      name="roomCode"
                      value={currentItem.roomCode || ''}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Room Type *</label>
                    <select
                      name="roomTypeId"
value={currentItem.roomTypeId || ''}
onChange={handleChange}
required
>
{roomTypes.map(rt => (
<option key={rt.roomTypeId} value={rt.roomTypeId}>
{rt.roomTypeName}
</option>
))}
</select>
</div>
<div className="form-group">
<label>Capacity</label>
<input
type="number"
name="capacity"
value={currentItem.capacity || 0}
onChange={handleChange}
min="0"
/>
</div>
</>
)}
          {/* Room Type Form */}
          {activeTab === 'roomtypes' && (
            <div className="form-group">
              <label>Room Type Name *</label>
              <input
                type="text"
                name="roomTypeName"
                value={currentItem.roomTypeName || ''}
                onChange={handleChange}
                required
              />
            </div>
          )}

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
export default InfrastructureManagement;