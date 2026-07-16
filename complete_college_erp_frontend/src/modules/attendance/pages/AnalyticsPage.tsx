import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AttendanceChart from '@/components/analytics/AttendanceChart';
import PerformanceChart from '@/components/analytics/PerformanceChart';
import AtRiskStudents from '@/components/analytics/AtRiskStudents';
import LeaderboardTable from '@/components/analytics/LeaderboardTable';

interface AnalyticsPageProps {
  semesterId: number;
  academicSessionId: number;
}

const AnalyticsPage: React.FC<AnalyticsPageProps> = ({
  semesterId,
  academicSessionId,
}) => {
  // Mock data - replace with real API calls
  const attendanceData = [
    { date: '2025-01-01', attendance: 85 },
    { date: '2025-01-08', attendance: 87 },
    { date: '2025-01-15', attendance: 83 },
    { date: '2025-01-22', attendance: 89 },
    { date: '2025-01-29', attendance: 86 },
  ];

  const performanceData = [
    { subject: 'English', internal1: 85, internal2: 88, internal3: 87 },
    { subject: 'Maths', internal1: 78, internal2: 82, internal3: 85 },
    { subject: 'Physics', internal1: 80, internal2: 83, internal3: 84 },
  ];

  const leaderboard = [
    { rank: 1, studentName: 'Aarav Krishnan', registerNumber: '2024CSE001', averageMarks: 85, attendance: 95 },
    { rank: 2, studentName: 'Kavya Pillai', registerNumber: '2024CSE013', averageMarks: 84, attendance: 93 },
    { rank: 3, studentName: 'Harish Kumar', registerNumber: '2024CSE010', averageMarks: 83, attendance: 91 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Analytics & Reports</h1>
        <p className="text-gray-500 mt-1">Comprehensive performance insights</p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="at-risk">At-Risk Students</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AttendanceChart data={attendanceData} />
            <PerformanceChart data={performanceData} />
          </div>
          <LeaderboardTable students={leaderboard} />
        </TabsContent>

        <TabsContent value="attendance">
          <AttendanceChart data={attendanceData} />
        </TabsContent>

        <TabsContent value="performance">
          <PerformanceChart data={performanceData} />
        </TabsContent>

        <TabsContent value="at-risk">
          <AtRiskStudents
            semesterId={semesterId}
            academicSessionId={academicSessionId}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsPage;