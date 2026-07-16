import React from 'react';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import type{ SubjectComparison } from '@/types/enhanced';

interface SubjectComparisonChartProps {
  data: SubjectComparison[];
}

const SubjectComparisonChart: React.FC<SubjectComparisonChartProps> = ({ data }) => {
  // Take only first 6 subjects for better visibility
  const chartData = data.slice(0, 6).map((subject) => ({
    subject: subject.subjectCode,
    yourMarks: subject.studentMarks,
    classAvg: subject.classAvgMarks,
    yourAttendance: subject.studentAttendance,
    classAvgAttendance: subject.classAvgAttendance,
  }));

  return (
    <div className="space-y-6">
      {/* Radar Chart for Marks Comparison */}
      <div>
        <h4 className="font-semibold mb-4">Marks Comparison (You vs Class Average)</h4>
        <ResponsiveContainer width="100%" height={400}>
          <RadarChart data={chartData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="subject" />
            <PolarRadiusAxis angle={90} domain={[0, 100]} />
            <Radar
              name="Your Marks"
              dataKey="yourMarks"
              stroke="#3b82f6"
              fill="#3b82f6"
              fillOpacity={0.6}
            />
            <Radar
              name="Class Average"
              dataKey="classAvg"
              stroke="#ef4444"
              fill="#ef4444"
              fillOpacity={0.3}
            />
            <Legend />
            <Tooltip />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Radar Chart for Attendance Comparison */}
      <div>
        <h4 className="font-semibold mb-4">Attendance Comparison</h4>
        <ResponsiveContainer width="100%" height={400}>
          <RadarChart data={chartData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="subject" />
            <PolarRadiusAxis angle={90} domain={[0, 100]} />
            <Radar
              name="Your Attendance"
              dataKey="yourAttendance"
              stroke="#10b981"
              fill="#10b981"
              fillOpacity={0.6}
            />
            <Radar
              name="Class Avg Attendance"
              dataKey="classAvgAttendance"
              stroke="#f59e0b"
              fill="#f59e0b"
              fillOpacity={0.3}
            />
            <Legend />
            <Tooltip />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SubjectComparisonChart;