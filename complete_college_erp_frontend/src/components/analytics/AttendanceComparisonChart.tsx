import React from 'react';
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { SubjectAnalytics } from '@/types/enhanced';

interface AttendanceComparisonChartProps {
  data: SubjectAnalytics[];
}

const AttendanceComparisonChart: React.FC<AttendanceComparisonChartProps> = ({ data }) => {
  const chartData = data.map((subject) => ({
    name: subject.subjectCode,
    attendance: subject.avgAttendance,
    marks: subject.avgMarks,
    students: subject.totalStudents,
  }));

  return (
    <ResponsiveContainer width="100%" height={400}>
      <ComposedChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="students" fill="#8884d8" name="Total Students" />
        <Line type="monotone" dataKey="attendance" stroke="#3b82f6" strokeWidth={2} name="Attendance %" />
        <Line type="monotone" dataKey="marks" stroke="#10b981" strokeWidth={2} name="Marks %" />
      </ComposedChart>
    </ResponsiveContainer>
  );
};

export default AttendanceComparisonChart;