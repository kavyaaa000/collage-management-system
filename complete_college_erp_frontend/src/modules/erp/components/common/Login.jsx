// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import authService from '../../services/authService';

// const Login = () => {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     setLoading(true);

//     try {
//       const data = await authService.login(username, password);
      
//       // Navigate based on role
//       if (data.role === 'ADMIN') {
//         navigate('/admin');
//       } else if (data.role === 'HOD') {
//         navigate('/hod');
//       } else {
//         setError('Invalid user role');
//       }
//     } catch (err) {
//       setError('Invalid username or password');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div style={{
//       minHeight: '100vh',
//       display: 'flex',
//       alignItems: 'center',
//       justifyContent: 'center',
//       background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
//     }}>
//       <div style={{
//         backgroundColor: 'white',
//         padding: '3rem',
//         borderRadius: '16px',
//         boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
//         width: '100%',
//         maxWidth: '400px'
//       }}>
//         <h2 style={{
//           textAlign: 'center',
//           color: '#333',
//           marginBottom: '2rem',
//           fontSize: '28px'
//         }}>
//           College ERP System
//         </h2>

//         <form onSubmit={handleSubmit}>
//           {error && (
//             <div style={{
//               backgroundColor: '#fee',
//               color: '#c33',
//               padding: '0.75rem',
//               borderRadius: '8px',
//               marginBottom: '1rem',
//               textAlign: 'center'
//             }}>
//               {error}
//             </div>
//           )}

//           <div style={{ marginBottom: '1.5rem' }}>
//             <label style={{
//               display: 'block',
//               marginBottom: '0.5rem',
//               color: '#555',
//               fontWeight: '500'
//             }}>
//               Username
//             </label>
//             <input
//               type="text"
//               value={username}
//               onChange={(e) => setUsername(e.target.value)}
//               placeholder="Enter username"
//               required
//               style={{
//                 width: '100%',
//                 padding: '0.75rem',
//                 border: '2px solid #e0e0e0',
//                 borderRadius: '8px',
//                 fontSize: '16px'
//               }}
//             />
//           </div>

//           <div style={{ marginBottom: '2rem' }}>
//             <label style={{
//               display: 'block',
//               marginBottom: '0.5rem',
//               color: '#555',
//               fontWeight: '500'
//             }}>
//               Password
//             </label>
//             <input
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               placeholder="Enter password"
//               required
//               style={{
//                 width: '100%',
//                 padding: '0.75rem',
//                 border: '2px solid #e0e0e0',
//                 borderRadius: '8px',
//                 fontSize: '16px'
//               }}
//             />
//           </div>

//           <button
//             type="submit"
//             disabled={loading}
//             style={{
//               width: '100%',
//               padding: '0.875rem',
//               backgroundColor: loading ? '#ccc' : '#667eea',
//               color: 'white',
//               border: 'none',
//               borderRadius: '8px',
//               fontSize: '16px',
//               fontWeight: '600',
//               cursor: loading ? 'not-allowed' : 'pointer'
//             }}
//           >
//             {loading ? 'Logging in...' : 'Login'}
//           </button>
//         </form>

//         <div style={{
//           marginTop: '2rem',
//           padding: '1rem',
//           backgroundColor: '#f5f5f5',
//           borderRadius: '8px'
//         }}>
//           <p style={{
//             fontSize: '12px',
//             color: '#666',
//             marginBottom: '0.5rem',
//             fontWeight: '600'
//           }}>
//             Demo Credentials:
//           </p>
//           <p style={{ fontSize: '12px', color: '#666', margin: '0.25rem 0' }}>
//             <strong>Admin:</strong> admin / admin123
//           </p>
//           <p style={{ fontSize: '12px', color: '#666', margin: '0.25rem 0' }}>
//             <strong>HOD:</strong> hod_cse / hod123
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;




import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/authService';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await authService.login(username, password);
      
      // Navigate based on role - ADD /erp prefix
      if (data.role === 'ADMIN') {
        navigate('/erp/admin');  // ✅ Changed from '/admin'
      } else if (data.role === 'HOD') {
        navigate('/erp/hod');    // ✅ Changed from '/hod'
      } else {
        setError('Invalid user role');
      }
    } catch (err) {
      setError('Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '3rem',
        borderRadius: '16px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
        width: '100%',
        maxWidth: '400px'
      }}>
        <h2 style={{
          textAlign: 'center',
          color: '#333',
          marginBottom: '2rem',
          fontSize: '28px'
        }}>
          College ERP System
        </h2>

        <form onSubmit={handleSubmit}>
          {error && (
            <div style={{
              backgroundColor: '#fee',
              color: '#c33',
              padding: '0.75rem',
              borderRadius: '8px',
              marginBottom: '1rem',
              textAlign: 'center'
            }}>
              {error}
            </div>
          )}

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              color: '#555',
              fontWeight: '500'
            }}>
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px solid #e0e0e0',
                borderRadius: '8px',
                fontSize: '16px'
              }}
            />
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              color: '#555',
              fontWeight: '500'
            }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px solid #e0e0e0',
                borderRadius: '8px',
                fontSize: '16px'
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '0.875rem',
              backgroundColor: loading ? '#ccc' : '#667eea',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div style={{
          marginTop: '2rem',
          padding: '1rem',
          backgroundColor: '#f5f5f5',
          borderRadius: '8px'
        }}>
          <p style={{
            fontSize: '12px',
            color: '#666',
            marginBottom: '0.5rem',
            fontWeight: '600'
          }}>
            Demo Credentials:
          </p>
          <p style={{ fontSize: '12px', color: '#666', margin: '0.25rem 0' }}>
            <strong>Admin:</strong> admin / admin123
          </p>
          <p style={{ fontSize: '12px', color: '#666', margin: '0.25rem 0' }}>
            <strong>HOD:</strong> hod_cse / hod123
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;