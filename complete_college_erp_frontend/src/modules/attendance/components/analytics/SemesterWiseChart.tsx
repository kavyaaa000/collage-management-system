import React from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type{ SemesterAnalyticsDetail } from '../../types/enhanced';

interface SemesterWiseChartProps {
  data: SemesterAnalyticsDetail[];
}

const SemesterWiseChart: React.FC<SemesterWiseChartProps> = ({ data }) => {
  const chartData = data.map((semester) => ({
    name: `Sem ${semester.semesterNo}`,
    attendance: semester.attendancePercentage,
    marks: semester.averageMarks,
    sgpa: semester.sgpa * 10, // Scale for better visibility
    rank: semester.classRank,
  }));

  return (
    <div className="space-y-6">
      {/* Combined Line Chart */}
      <div>
        <h4 className="font-semibold mb-4">Attendance & Performance Trend</h4>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="attendance"
              stroke="#3b82f6"
              strokeWidth={3}
              name="Attendance %"
              dot={{ r: 5 }}
            />
            <Line
              type="monotone"
              dataKey="marks"
              stroke="#10b981"
              strokeWidth={3}
              name="Average Marks %"
              dot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* SGPA Bar Chart */}
      <div>
        <h4 className="font-semibold mb-4">SGPA Progression</h4>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis domain={[0, 10]} />
            <Tooltip formatter={(value: number) => (value / 10).toFixed(2)} />
            <Legend />
            <Bar dataKey="sgpa" fill="#8b5cf6" name="SGPA (scaled)" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SemesterWiseChart;