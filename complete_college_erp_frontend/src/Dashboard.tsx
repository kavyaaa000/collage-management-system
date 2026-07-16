// import { useNavigate } from 'react-router-dom';

// export default function Dashboard() {
//   const navigate = useNavigate();

//   return (


//  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
//       <div className="text-center max-w-6xl px-4">
//         {/* Your dashboard content */}
//          <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
//       <div className="text-center max-w-6xl px-4">
//         <h1 className="text-5xl font-bold mb-4 text-gray-800 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
//           College Management System
//         </h1>
//         <p className="text-gray-600 mb-12 text-lg">Select a module to continue</p>
        
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//           {/* Admissions Module */}
//           <button
//             className="group p-8 bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all transform hover:scale-105 hover:-translate-y-1 border-2 border-transparent hover:border-blue-500"
//             onClick={() => navigate('/admissions')}
//           >
//             <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">🎓</div>
//             <div className="font-bold text-xl mb-2 text-gray-800">Admissions</div>
//             <div className="text-sm text-gray-600">Student Enrollment & Management</div>
//             <div className="mt-4 text-xs text-blue-600 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
//               Click to Enter →
//             </div>
//           </button>

//           {/* Platform Module */}
//           <button
//             className="group p-8 bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all transform hover:scale-105 hover:-translate-y-1 border-2 border-transparent hover:border-green-500"
//             onClick={() => navigate('/platform')}
//           >
//             <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">🏆</div>
//             <div className="font-bold text-xl mb-2 text-gray-800">Platform</div>
//             <div className="text-sm text-gray-600">Contests & Events</div>
//             <div className="mt-4 text-xs text-green-600 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
//               Click to Enter →
//             </div>
//           </button>

//           {/* ERP Module */}
//           <button
//             className="group p-8 bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all transform hover:scale-105 hover:-translate-y-1 border-2 border-transparent hover:border-purple-500"
//             onClick={() => navigate('/erp')}
//           >
//             <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">📊</div>
//             <div className="font-bold text-xl mb-2 text-gray-800">ERP System</div>
//             <div className="text-sm text-gray-600">Academic Management</div>
//             <div className="mt-4 text-xs text-purple-600 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
//               Click to Enter →
//             </div>
//           </button>

//           {/* Evaluation Module - NEW */}
//           <button
//             className="group p-8 bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all transform hover:scale-105 hover:-translate-y-1 border-2 border-transparent hover:border-orange-500"
//             onClick={() => navigate('/evaluation')}
//           >
//             <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">✍️</div>
//             <div className="font-bold text-xl mb-2 text-gray-800">Evaluation</div>
//             <div className="text-sm text-gray-600">AI Answer Sheet Grading</div>
//             <div className="mt-4 text-xs text-orange-600 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
//               Click to Enter →
//             </div>
//           </button>
//         </div>

//         {/* Info Section */}
//         <div className="mt-12 bg-white rounded-lg shadow-md p-6 max-w-3xl mx-auto">
//           <h2 className="text-2xl font-semibold mb-4 text-gray-800">Quick Info</h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
//             <div className="flex items-start">
//               <span className="text-2xl mr-3">🎓</span>
//               <div>
//                 <div className="font-semibold text-gray-700">Admissions</div>
//                 <div className="text-sm text-gray-600">Manage student enrollment, verification, and admission processes</div>
//               </div>
//             </div>
//             <div className="flex items-start">
//               <span className="text-2xl mr-3">🏆</span>
//               <div>
//                 <div className="font-semibold text-gray-700">Platform</div>
//                 <div className="text-sm text-gray-600">Organize contests, track leaderboards, and manage rewards</div>
//               </div>
//             </div>
//             <div className="flex items-start">
//               <span className="text-2xl mr-3">📊</span>
//               <div>
//                 <div className="font-semibold text-gray-700">ERP System</div>
//                 <div className="text-sm text-gray-600">Complete academic management with timetables and staff allocation</div>
//               </div>
//             </div>
//             <div className="flex items-start">
//               <span className="text-2xl mr-3">✍️</span>
//               <div>
//                 <div className="font-semibold text-gray-700">Evaluation</div>
//                 <div className="text-sm text-gray-600">AI-powered answer sheet evaluation with keyword matching</div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Footer */}
//         <div className="mt-8 text-gray-500 text-sm">
//           <p>© 2026 College Management System. All rights reserved.</p>
//         </div>
//       </div>
      



//   <button
//     className="group p-8 bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all transform hover:scale-105 hover:-translate-y-1 border-2 border-transparent hover:border-indigo-500"
//     onClick={() => navigate('/attendance')}
//   >
//     <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">📊</div>
//     <div className="font-bold text-xl mb-2 text-gray-800">Attendance</div>
//     <div className="text-sm text-gray-600">Performance Analytics</div>
//     <div className="mt-4 text-xs text-indigo-600 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
//       Click to Enter →
//     </div>
//   </button>

//       <div className="bg-red-500 text-white p-10">
//   TAILWIND TEST
// </div>

//     </div>
//       </div>
//     </div>




   
//   );
// }







import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="text-center max-w-6xl px-4">
        <h1 className="text-5xl font-bold mb-4 text-gray-800 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
          College Management System
        </h1>
        <p className="text-gray-600 mb-12 text-lg">Select a module to continue</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {/* Admissions Module */}
          <button
            className="group p-8 bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all transform hover:scale-105 hover:-translate-y-1 border-2 border-transparent hover:border-blue-500"
            onClick={() => navigate('/admissions')}
          >
            <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">🎓</div>
            <div className="font-bold text-xl mb-2 text-gray-800">Admissions</div>
            <div className="text-sm text-gray-600">Student Enrollment</div>
            <div className="mt-4 text-xs text-blue-600 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
              Click to Enter →
            </div>
          </button>

          {/* Platform Module */}
          <button
            className="group p-8 bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all transform hover:scale-105 hover:-translate-y-1 border-2 border-transparent hover:border-green-500"
            onClick={() => navigate('/platform')}
          >
            <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">🏆</div>
            <div className="font-bold text-xl mb-2 text-gray-800">Platform</div>
            <div className="text-sm text-gray-600">Contests & Events</div>
            <div className="mt-4 text-xs text-green-600 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
              Click to Enter →
            </div>
          </button>

          {/* ERP Module */}
          <button
            className="group p-8 bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all transform hover:scale-105 hover:-translate-y-1 border-2 border-transparent hover:border-purple-500"
            onClick={() => navigate('/erp')}
          >
            <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">📚</div>
            <div className="font-bold text-xl mb-2 text-gray-800">ERP System</div>
            <div className="text-sm text-gray-600">Academic Mgmt</div>
            <div className="mt-4 text-xs text-purple-600 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
              Click to Enter →
            </div>
          </button>

          {/* Evaluation Module */}
          <button
            className="group p-8 bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all transform hover:scale-105 hover:-translate-y-1 border-2 border-transparent hover:border-orange-500"
            onClick={() => navigate('/evaluation')}
          >
            <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">✍️</div>
            <div className="font-bold text-xl mb-2 text-gray-800">Evaluation</div>
            <div className="text-sm text-gray-600">AI Answer Grading</div>
            <div className="mt-4 text-xs text-orange-600 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
              Click to Enter →
            </div>
          </button>

          {/* Attendance Module */}
          <button
            className="group p-8 bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all transform hover:scale-105 hover:-translate-y-1 border-2 border-transparent hover:border-indigo-500"
            onClick={() => navigate('/attendance')}
          >
            <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">📊</div>
            <div className="font-bold text-xl mb-2 text-gray-800">Attendance</div>
            <div className="text-sm text-gray-600">Performance Analytics</div>
            <div className="mt-4 text-xs text-indigo-600 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
              Click to Enter →
            </div>
          </button>
        </div>

        {/* Footer */}
        <div className="mt-12 text-gray-500 text-sm">
          <p>© 2026 College Management System. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}