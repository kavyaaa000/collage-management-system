import React from 'react'; // ✅ Add this line
import { Routes, Route } from 'react-router-dom';
import App from './App';

export default function ERPModule() {
  return (
    <Routes>
      <Route path="/*" element={<App />} />
    </Routes>
  );
}