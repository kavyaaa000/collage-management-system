// import { Routes, Route, Link } from 'react-router-dom';
// import { FaHome, FaKey, FaFileAlt, FaCheckCircle, FaChartBar, FaUserShield } from 'react-icons/fa';
// import AdminDashboard from './pages/AdminDashboard';
// import AnswerKeyManagement from './pages/AnswerKeyManagement';
// import EvaluationPage from './pages/EvaluationPage';
// import ReviewConfirmation from './pages/ReviewConfirmation';
// import StatsPage from './pages/StatsPage';

// function App() {
//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Navigation - ✅ FIXED: All links now use /evaluation prefix */}
//       <nav className="bg-white shadow-lg">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between h-16">
//             <div className="flex items-center">
//               <FaFileAlt className="text-primary text-3xl mr-3" />
//               <span className="text-2xl font-bold text-gray-800">
//                 AI Answer Sheet Evaluation
//               </span>
//             </div>
//             <div className="flex items-center space-x-4">
//               <Link
//                 to="/evaluation"
//                 className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 transition"
//               >
//                 <FaHome className="mr-2" />
//                 Home
//               </Link>
//               <Link
//                 to="/evaluation/admin"
//                 className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 transition"
//               >
//                 <FaUserShield className="mr-2" />
//                 Admin
//               </Link>
//               <Link
//                 to="/evaluation/answer-keys"
//                 className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 transition"
//               >
//                 <FaKey className="mr-2" />
//                 Answer Keys
//               </Link>
//               <Link
//                 to="/evaluation/evaluate"
//                 className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 transition"
//               >
//                 <FaFileAlt className="mr-2" />
//                 Evaluation
//               </Link>
//               <Link
//                 to="/evaluation/stats"
//                 className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 transition"
//               >
//                 <FaChartBar className="mr-2" />
//                 Statistics
//               </Link>
//             </div>
//           </div>
//         </div>
//       </nav>

//       {/* Main Content */}
//       <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
//         <Routes>
//           {/* ✅ FIXED: All routes are relative (no leading slash) */}
//           {/* They work within the /evaluation/* context */}
//           <Route path="/" element={<HomePage />} />
//           <Route path="/admin" element={<AdminDashboard />} />
//           <Route path="/answer-keys" element={<AnswerKeyManagement />} />
//           <Route path="/evaluate" element={<EvaluationPage />} />
//           <Route path="/review/:sheetId" element={<ReviewConfirmation />} />
//           <Route path="/stats" element={<StatsPage />} />
//         </Routes>
//       </main>

//       {/* Footer */}
//       <footer className="bg-white mt-12 border-t">
//         <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
//           <p className="text-center text-gray-500 text-sm">
//             © 2026 AI Answer Sheet Evaluation System. All rights reserved.
//           </p>
//         </div>
//       </footer>
//     </div>
//   );
// }

// function HomePage() {
//   return (
//     <div className="px-4 py-12">
//       <div className="text-center">
//         <h1 className="text-4xl font-bold text-gray-900 mb-4">
//           Welcome to AI-Assisted Answer Sheet Evaluation
//         </h1>
//         <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
//           An intelligent system that combines OCR technology with keyword-based scoring
//           to assist faculty in evaluating descriptive answers accurately and efficiently.
//         </p>
        
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
//           <div className="bg-white p-6 rounded-lg shadow-md">
//             <div className="text-primary text-4xl mb-4 flex justify-center">
//               <FaKey />
//             </div>
//             <h3 className="text-xl font-semibold mb-2">Define Answer Keys</h3>
//             <p className="text-gray-600">
//               Create comprehensive answer keys with keywords, synonyms, and weights
//             </p>
//           </div>
          
//           <div className="bg-white p-6 rounded-lg shadow-md">
//             <div className="text-secondary text-4xl mb-4 flex justify-center">
//               <FaFileAlt />
//             </div>
//             <h3 className="text-xl font-semibold mb-2">AI Evaluation</h3>
//             <p className="text-gray-600">
//               Upload answer sheets and let AI suggest marks with full transparency
//             </p>
//           </div>
          
//           <div className="bg-white p-6 rounded-lg shadow-md">
//             <div className="text-warning text-4xl mb-4 flex justify-center">
//               <FaCheckCircle />
//             </div>
//             <h3 className="text-xl font-semibold mb-2">Staff Review</h3>
//             <p className="text-gray-600">
//               Review AI suggestions, adjust marks within limits, and lock permanently
//             </p>
//           </div>
//         </div>

//         <div className="mt-12 bg-blue-50 border-l-4 border-blue-500 p-6 rounded-md max-w-3xl mx-auto">
//           <div className="flex items-start">
//             <div className="flex-shrink-0">
//               <svg className="h-6 w-6 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
//                 <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
//               </svg>
//             </div>
//             <div className="ml-3">
//               <h3 className="text-sm font-medium text-blue-800">System Philosophy</h3>
//               <div className="mt-2 text-sm text-blue-700">
//                 <ul className="list-disc list-inside space-y-1">
//                   <li>AI NEVER finalizes marks - only suggests</li>
//                   <li>Full transparency in scoring with keyword matching</li>
//                   <li>Staff has final authority with ±10% adjustment limit</li>
//                   <li>Once locked, marks cannot be changed by anyone</li>
//                   <li>Complete audit trail for accountability</li>
//                 </ul>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default App;


import { Routes, Route, Link } from 'react-router-dom';
import { FaHome, FaKey, FaFileAlt, FaCheckCircle, FaChartBar, FaUserShield } from 'react-icons/fa';
import AdminDashboard from './pages/AdminDashboard';
import AnswerKeyManagement from './pages/AnswerKeyManagement';
import EvaluationPage from './pages/EvaluationPage';
import ReviewConfirmation from './pages/ReviewConfirmation';
import StatsPage from './pages/StatsPage';
import TestPage from './pages/TestPage'; // ✅ Add this

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <FaFileAlt className="text-primary text-3xl mr-3" />
              <span className="text-2xl font-bold text-gray-800">
                AI Answer Sheet Evaluation
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/evaluation" className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 transition">
                <FaHome className="mr-2" />
                Home
              </Link>
              {/* ✅ Add Test Link */}
              <Link to="/evaluation/test" className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-red-700 hover:bg-red-100 transition border-2 border-red-500">
                🧪 TEST
              </Link>
              <Link to="/evaluation/admin" className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 transition">
                <FaUserShield className="mr-2" />
                Admin
              </Link>
              <Link to="/evaluation/answer-keys" className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 transition">
                <FaKey className="mr-2" />
                Answer Keys
              </Link>
              <Link to="/evaluation/evaluate" className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 transition">
                <FaFileAlt className="mr-2" />
                Evaluation
              </Link>
              <Link to="/evaluation/stats" className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 transition">
                <FaChartBar className="mr-2" />
                Statistics
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/test" element={<TestPage />} /> {/* ✅ Add this */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/answer-keys" element={<AnswerKeyManagement />} />
          <Route path="/evaluate" element={<EvaluationPage />} />
          <Route path="/review/:sheetId" element={<ReviewConfirmation />} />
          <Route path="/stats" element={<StatsPage />} />
        </Routes>
      </main>

      {/* Footer */}
      <footer className="bg-white mt-12 border-t">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 text-sm">
            © 2026 AI Answer Sheet Evaluation System. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

function HomePage() {
  return (
    <div className="px-4 py-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to AI-Assisted Answer Sheet Evaluation
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          An intelligent system that combines OCR technology with keyword-based scoring
          to assist faculty in evaluating descriptive answers accurately and efficiently.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-primary text-4xl mb-4 flex justify-center">
              <FaKey />
            </div>
            <h3 className="text-xl font-semibold mb-2">Define Answer Keys</h3>
            <p className="text-gray-600">
              Create comprehensive answer keys with keywords, synonyms, and weights
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-secondary text-4xl mb-4 flex justify-center">
              <FaFileAlt />
            </div>
            <h3 className="text-xl font-semibold mb-2">AI Evaluation</h3>
            <p className="text-gray-600">
              Upload answer sheets and let AI suggest marks with full transparency
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-warning text-4xl mb-4 flex justify-center">
              <FaCheckCircle />
            </div>
            <h3 className="text-xl font-semibold mb-2">Staff Review</h3>
            <p className="text-gray-600">
              Review AI suggestions, adjust marks within limits, and lock permanently
            </p>
          </div>
        </div>

        <div className="mt-12 bg-blue-50 border-l-4 border-blue-500 p-6 rounded-md max-w-3xl mx-auto">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">System Philosophy</h3>
              <div className="mt-2 text-sm text-blue-700">
                <ul className="list-disc list-inside space-y-1">
                  <li>AI NEVER finalizes marks - only suggests</li>
                  <li>Full transparency in scoring with keyword matching</li>
                  <li>Staff has final authority with ±10% adjustment limit</li>
                  <li>Once locked, marks cannot be changed by anyone</li>
                  <li>Complete audit trail for accountability</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
