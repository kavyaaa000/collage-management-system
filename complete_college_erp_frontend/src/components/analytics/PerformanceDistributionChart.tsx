import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import type { PerformanceDistribution } from '@/types/enhanced';

interface PerformanceDistributionChartProps {
  data: PerformanceDistribution[];
}

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'];

const PerformanceDistributionChart: React.FC<PerformanceDistributionChartProps> = ({ data }) => {
  const chartData = data.map((item) => ({
    name: item.category,
    value: item.count,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default PerformanceDistributionChart;