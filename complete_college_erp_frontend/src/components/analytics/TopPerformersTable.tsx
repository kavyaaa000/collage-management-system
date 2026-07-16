import React from 'react';
import { Trophy, Medal, Award } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type{ TopStudentSummary } from '@/types/enhanced';

interface TopPerformersTableProps {
  students: TopStudentSummary[];
}

const TopPerformersTable: React.FC<TopPerformersTableProps> = ({ students }) => {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Award className="h-5 w-5 text-orange-500" />;
      default:
        return <span className="font-semibold text-gray-600">{rank}</span>;
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-16">Rank</TableHead>
          <TableHead>Student Name</TableHead>
          <TableHead>Register Number</TableHead>
          <TableHead className="text-right">Overall %</TableHead>
          <TableHead className="text-right">Attendance %</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {students.map((student) => (
          <TableRow key={student.studentId}>
            <TableCell className="font-medium">
              {getRankIcon(student.rank || 0)}
            </TableCell>
            <TableCell className="font-medium">{student.studentName}</TableCell>
            <TableCell>{student.registerNumber}</TableCell>
            <TableCell className="text-right">
              <span className="font-semibold text-green-600">
                {student.overallPercentage.toFixed(1)}%
              </span>
            </TableCell>
            <TableCell className="text-right">
              <span className="font-semibold text-blue-600">
                {student.attendancePercentage.toFixed(1)}%
              </span>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default TopPerformersTable;