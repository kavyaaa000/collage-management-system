import React from 'react';
import {
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type{ SemesterTrend } from '@/types/enhanced';

interface TrendChartProps {
  data: SemesterTrend[];
}

const TrendChart: React.FC<TrendChartProps> = ({ data }) => {
  const chartData = data.map((trend) => ({
    semester: `Sem ${trend.semesterNo}`,
    attendance: trend.attendance,
    marks: trend.marks,
    sgpa: trend.sgpa * 10, // Scale for visibility
  }));

  return (
    <ResponsiveContainer width="100%" height={400}>
      <ComposedChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="semester" />
        <YAxis yAxisId="left" />
        <YAxis yAxisId="right" orientation="right" domain={[0, 10]} />
        <Tooltip />
        <Legend />
        
        {/* Areas for visual appeal */}
        <Area
          yAxisId="left"
          type="monotone"
          dataKey="attendance"
          fill="#3b82f6"
          fillOpacity={0.2}
          stroke="none"
        />
        <Area
          yAxisId="left"
          type="monotone"
          dataKey="marks"
          fill="#10b981"
          fillOpacity={0.2}
          stroke="none"
        />
        
        {/* Lines for actual data */}
        <Line
          yAxisId="left"
          type="monotone"
          dataKey="attendance"
          stroke="#3b82f6"
          strokeWidth={3}
          name="Attendance %"
          dot={{ r: 6 }}
        />
        <Line
          yAxisId="left"
          type="monotone"
          dataKey="marks"
          stroke="#10b981"
          strokeWidth={3}
          name="Marks %"
          dot={{ r: 6 }}
        />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="sgpa"
          stroke="#8b5cf6"
          strokeWidth={3}
          name="SGPA (scaled)"
          dot={{ r: 6 }}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
};

export default TrendChart;