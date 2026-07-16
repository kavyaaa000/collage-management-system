import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type{ SubjectAnalytics } from '../../types/enhanced';

interface SubjectAnalyticsChartProps {
  data: SubjectAnalytics[];
}

const SubjectAnalyticsChart: React.FC<SubjectAnalyticsChartProps> = ({ data }) => {
  const chartData = data.map((subject) => ({
    name: subject.subjectCode,
    attendance: subject.avgAttendance,
    marks: subject.avgMarks,
    passing: subject.passingStudents,
    failing: subject.failingStudents,
  }));

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="attendance" fill="#3b82f6" name="Avg Attendance %" />
        <Bar dataKey="marks" fill="#10b981" name="Avg Marks %" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default SubjectAnalyticsChart;