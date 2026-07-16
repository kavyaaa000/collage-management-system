import React from 'react';
import { Trophy, Medal, Award } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';

interface LeaderboardEntry {
  rank: number;
  studentName: string;
  registerNumber: string;
  averageMarks: number;
  attendance: number;
}

interface LeaderboardTableProps {
  students: LeaderboardEntry[];
}

const LeaderboardTable: React.FC<LeaderboardTableProps> = ({ students }) => {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Award className="h-5 w-5 text-orange-500" />;
      default:
        return <span className="text-gray-500 font-semibold">{rank}</span>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          Top Performers
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">Rank</TableHead>
              <TableHead>Student Name</TableHead>
              <TableHead>Register Number</TableHead>
              <TableHead className="text-right">Average Marks</TableHead>
              <TableHead className="text-right">Attendance</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.map((student) => (
              <TableRow key={student.registerNumber}>
                <TableCell className="font-medium">
                  {getRankIcon(student.rank)}
                </TableCell>
                <TableCell className="font-medium">{student.studentName}</TableCell>
                <TableCell>{student.registerNumber}</TableCell>
                <TableCell className="text-right">
                  <span className="font-semibold text-green-600">
                    {student.averageMarks.toFixed(1)}%
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <span className="font-semibold text-blue-600">
                    {student.attendance.toFixed(1)}%
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default LeaderboardTable;