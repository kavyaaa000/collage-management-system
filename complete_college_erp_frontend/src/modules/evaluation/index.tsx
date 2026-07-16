import { Routes, Route } from 'react-router-dom';
import App from './App';


export default function EvaluationModule() {
  return (
    <div className="evaluation-module-wrapper"> {/* ✅ Add wrapper */}
      <Routes>
        <Route path="/*" element={<App />} />
      </Routes>
    </div>
  );
}