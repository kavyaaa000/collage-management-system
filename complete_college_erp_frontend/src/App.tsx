import { Routes, Route } from 'react-router-dom';
import Dashboard from './Dashboard';
import AttendanceModule from './modules/attendance';
// Import all modules
import AdmissionsModule from './modules/admissions';
import PlatformModule from './modules/platform';
import ERPModule from './modules/erp/Index';
import EvaluationModule from './modules/evaluation';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/admissions/*" element={<AdmissionsModule />} />
      <Route path="/platform/*" element={<PlatformModule />} />
      <Route path="/erp/*" element={<ERPModule />} />
      <Route path="/evaluation/*" element={<EvaluationModule />} />
       <Route path="/attendance/*" element={<AttendanceModule />} />
    </Routes>
  );
}

