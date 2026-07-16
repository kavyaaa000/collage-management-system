// // import { Navigate } from 'react-router-dom';
// // import { useAuth } from './hooks/useAuth';

// // const PlatformModule: React.FC = () => {
// //   const { user, isLoading } = useAuth();

// //   if (isLoading) {
// //     return <div>Loading...</div>;
// //   }

// //   if (!user) {
// //     return <Navigate to="/login" replace />;
// //   }

// //   return (
// //     <div>
// //       <h1>Platform Module Loaded</h1>
// //     </div>
// //   );
// // };

// // export default PlatformModule;




// import { Navigate } from 'react-router-dom';
// import { useAuth } from './hooks/UseAuth';
// import { AuthProvider } from './context/AuthContext';

// const PlatformContent: React.FC = () => {
//   const { user, isLoading } = useAuth();

//   if (isLoading) {
//     return <div>Loading...</div>;
//   }

//   if (!user) {
//     return <Navigate to="/platform/login" replace />;
//   }

//   return (
//     <div>
//       <h1>Platform Module Loaded</h1>
//     </div>
//   );
// };

// const PlatformModule: React.FC = () => {
//   return (
//     <AuthProvider>
//       <PlatformContent />
//     </AuthProvider>
//   );
// };

// export default PlatformModule;



import App from './App';
import { AuthProvider } from './context/AuthContext';

const PlatformModule = () => {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
};

export default PlatformModule;