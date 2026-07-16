// import React, { useEffect, useState } from 'react';
// import { 
//   BookOpen, 
//   TrendingUp, 
//   AlertCircle,
//   Award,
//   Calendar
// } from 'lucide-react';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Badge } from '@/components/ui/badge';
// import type { DashboardStatsResponse, StudentAttendanceResponse } from '@/types';
// import analyticsService from '@/services/analyticsService';
// import attendanceService from '@/services/attendanceService';
// import { getAttendanceColor } from '@/lib/utils';

// interface StudentDashboardProps {
//   studentId: number;
//   semesterId: number;
//   academicSessionId: number;
// }

// const StudentDashboard: React.FC<StudentDashboardProps> = ({
//   studentId,
//   semesterId,
//   academicSessionId,
// }) => {
//   const [stats, setStats] = useState<DashboardStatsResponse | null>(null);
//   const [attendance, setAttendance] = useState<StudentAttendanceResponse | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     loadDashboard();
//   }, [studentId]);

//   const loadDashboard = async () => {
//     try {
//       setLoading(true);
//       const [dashboardData, attendanceData] = await Promise.all([
//         analyticsService.getStudentDashboard(studentId, semesterId, academicSessionId),
//         attendanceService.getStudentAttendance(studentId, semesterId, academicSessionId),
//       ]);
//       setStats(dashboardData);
//       setAttendance(attendanceData);
//     } catch (error) {
//       console.error('Failed to load dashboard:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) {
//     return <div className="text-center py-12">Loading dashboard...</div>;
//   }

//   if (!stats?.studentStats || !attendance) {
//     return <div className="text-center py-12">No data available</div>;
//   }

//   const { studentStats } = stats;

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div>
//         <h1 className="text-3xl font-bold text-gray-900">My Dashboard</h1>
//         <p className="text-gray-500 mt-1">Track your academic progress</p>
//       </div>

//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between pb-2">
//             <CardTitle className="text-sm font-medium text-gray-600">
//               Overall Attendance
//             </CardTitle>
//             <Calendar className="h-4 w-4 text-gray-500" />
//           </CardHeader>
//           <CardContent>
//             <div className={`text-2xl font-bold ${getAttendanceColor(studentStats.overallAttendance)}`}>
//               {studentStats.overallAttendance.toFixed(1)}%
//             </div>
//             <p className="text-xs text-gray-500 mt-1">
//               {studentStats.overallAttendance >= 75 ? 'Eligible' : 'Below requirement'}
//             </p>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between pb-2">
//             <CardTitle className="text-sm font-medium text-gray-600">
//               Average Marks
//             </CardTitle>
//             <Award className="h-4 w-4 text-gray-500" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold text-blue-600">
//               {studentStats.averageMarks.toFixed(1)}%
//             </div>
//             <p className="text-xs text-gray-500 mt-1">{studentStats.performanceCategory}</p>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between pb-2">
//             <CardTitle className="text-sm font-medium text-gray-600">
//               Total Subjects
//             </CardTitle>
//             <BookOpen className="h-4 w-4 text-gray-500" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">{studentStats.totalSubjects}</div>
//             <p className="text-xs text-gray-500 mt-1">This semester</p>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between pb-2">
//             <CardTitle className="text-sm font-medium text-gray-600">
//               At Risk
//             </CardTitle>
//             <AlertCircle className="h-4 w-4 text-yellow-500" />
//           </CardHeader>
//           <CardContent>
//             <div className={`text-2xl font-bold ${studentStats.subjectsAtRisk > 0 ? 'text-red-600' : 'text-green-600'}`}>
//               {studentStats.subjectsAtRisk}
//             </div>
//             <p className="text-xs text-gray-500 mt-1">Subjects need attention</p>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Overall Summary */}
//       <Card>
//         <CardHeader>
//           <CardTitle>Attendance Summary</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
//             <div className="text-center p-4 bg-blue-50 rounded-lg">
//               <p className="text-3xl font-bold text-blue-600">
//                 {attendance.totalClassesConducted}
//               </p>
//               <p className="text-sm text-gray-600 mt-1">Total Classes</p>
//             </div>
//             <div className="text-center p-4 bg-green-50 rounded-lg">
//               <p className="text-3xl font-bold text-green-600">
//                 {attendance.totalClassesAttended}
//               </p>
//               <p className="text-sm text-gray-600 mt-1">Classes Attended</p>
//             </div>
//             <div className="text-center p-4 bg-purple-50 rounded-lg">
//               <p className="text-3xl font-bold text-purple-600">
//                 {attendance.overallAttendancePercentage.toFixed(1)}%
//               </p>
//               <p className="text-sm text-gray-600 mt-1">Percentage</p>
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Subject-wise Attendance */}
//       <Card>
//         <CardHeader>
//           <CardTitle>Subject-wise Attendance</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="space-y-3">
//             {attendance.subjectWiseAttendance.map((subject) => (
//               <div
//                 key={subject.subjectId}
//                 className="p-4 border rounded-lg hover:bg-gray-50"
//               >
//                 <div className="flex items-center justify-between mb-2">
//                   <div>
//                     <p className="font-medium">{subject.subjectName}</p>
//                     <p className="text-sm text-gray-500">{subject.subjectCode}</p>
//                   </div>
//                   <Badge
//                     variant={
//                       subject.eligibilityStatus === 'ELIGIBLE'
//                         ? 'success'
//                         : subject.eligibilityStatus === 'CONDITIONAL'
//                         ? 'warning'
//                         : 'destructive'
//                     }
//                   >
//                     {subject.eligibilityStatus}
//                   </Badge>
//                 </div>
                
//                 <div className="flex items-center justify-between text-sm">
//                   <div className="flex gap-4">
//                     <span className="text-gray-600">
//                       {subject.attendedClasses} / {subject.totalClasses} classes
//                     </span>
//                   </div>
//                   <span className={`font-bold ${getAttendanceColor(subject.attendancePercentage)}`}>
//                     {subject.attendancePercentage.toFixed(1)}%
//                   </span>
//                 </div>

//                 {/* Progress Bar */}
//                 <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
//                   <div
//                     className={`h-full transition-all ${
//                       subject.attendancePercentage >= 75
//                         ? 'bg-green-500'
//                         : subject.attendancePercentage >= 65
//                         ? 'bg-yellow-500'
//                         : 'bg-red-500'
//                     }`}
//                     style={{ width: `${Math.min(subject.attendancePercentage, 100)}%` }}
//                   />
//                 </div>

//                 {subject.classesNeededFor75 > 0 && (
//                   <p className="text-xs text-orange-600 mt-2">
//                     Attend {subject.classesNeededFor75} more consecutive classes to reach 75%
//                   </p>
//                 )}
//               </div>
//             ))}
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default StudentDashboard;









import React, { useEffect, useState } from 'react';
import {
  BookOpen,
  TrendingUp,
  AlertCircle,
  Award,
  Calendar,
  Target,
  Trophy,
  BarChart3,
  Bell,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import type {
  DashboardStatsResponse,
  StudentAttendanceResponse,
  Notification,
} from '../../types';
import { useAuthStore } from '../../store/authStore';
import { useNotificationStore } from '../../store/notificationStore';
import analyticsService from '../../services/analyticsService';
import attendanceService from '../../services/attendanceService';
import notificationService from '../../services/notificationService';
import { getAttendanceColor } from '../../lib/utils';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const StudentDashboardPage: React.FC = () => {
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStatsResponse | null>(null);
  const [attendance, setAttendance] = useState<StudentAttendanceResponse | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadDashboard();
    }
  }, [user]);

  const loadDashboard = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const [dashboardData, attendanceData, notifData] = await Promise.all([
        analyticsService.getStudentDashboard(
          user.referenceId,
          user.semesterId || 1,
          25
        ),
        attendanceService.getStudentAttendance(
          user.referenceId,
          user.semesterId || 1,
          25
        ),
        notificationService.getStudentNotifications(
          user.referenceId,
          user.sectionId || 1,
          user.semesterId || 1
        ),
      ]);
      setStats(dashboardData);
      setAttendance(attendanceData);
      setNotifications(notifData.slice(0, 3)); // Top 3 notifications
    } catch (error) {
      console.error('Failed to load dashboard:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const studentStats = stats?.studentStats;

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-2">Welcome, {user?.name}!</h1>
        <p className="text-purple-100">{attendance?.registerNumber}</p>
        <p className="text-sm text-purple-200 mt-1">
          {new Date().toLocaleDateString('en-IN', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
      </div>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Overall Attendance
            </CardTitle>
            <Calendar className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div
              className={`text-3xl font-bold ${getAttendanceColor(
                studentStats?.overallAttendance || 0
              )}`}
            >
              {studentStats?.overallAttendance.toFixed(1) || 0}%
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {studentStats && studentStats.overallAttendance >= 75
                ? '✓ Eligible for exam'
                : '⚠ Below requirement'}
            </p>
            {studentStats && studentStats.overallAttendance < 75 && (
              <div className="mt-2">
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-red-500"
                    style={{ width: `${studentStats.overallAttendance}%` }}
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Average Marks
            </CardTitle>
            <Award className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {studentStats?.averageMarks.toFixed(1) || 0}%
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Performance: {studentStats?.performanceCategory || 'N/A'}
            </p>
            <div className="mt-2">
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500"
                  style={{ width: `${studentStats?.averageMarks || 0}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Subjects
            </CardTitle>
            <BookOpen className="h-5 w-5 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">
              {studentStats?.totalSubjects || 0}
            </div>
            <p className="text-xs text-gray-500 mt-1">This semester</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              At Risk
            </CardTitle>
            <AlertCircle className="h-5 w-5 text-red-500" />
          </CardHeader>
          <CardContent>
            <div
              className={`text-3xl font-bold ${
                (studentStats?.subjectsAtRisk || 0) > 0 ? 'text-red-600' : 'text-green-600'
              }`}
            >
              {studentStats?.subjectsAtRisk || 0}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {(studentStats?.subjectsAtRisk || 0) > 0
                ? 'Need attention'
                : '✓ All on track'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Button
              onClick={() => navigate('/student-analytics')}
              className="h-24 flex flex-col items-center justify-center gap-2"
              variant="outline"
            >
              <BarChart3 className="h-8 w-8" />
              <span>My Analytics</span>
            </Button>
            <Button
              onClick={() => navigate('/top-performers')}
              className="h-24 flex flex-col items-center justify-center gap-2"
              variant="outline"
            >
              <Trophy className="h-8 w-8" />
              <span>Top Performers</span>
            </Button>
            <Button
              onClick={() => navigate('/timetable')}
              className="h-24 flex flex-col items-center justify-center gap-2"
              variant="outline"
            >
              <Calendar className="h-8 w-8" />
              <span>Timetable</span>
            </Button>
            <Button
              onClick={() => navigate('/attendance')}
              className="h-24 flex flex-col items-center justify-center gap-2"
              variant="outline"
            >
              <Target className="h-8 w-8" />
              <span>My Attendance</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-500" />
              Attendance Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Overall Progress */}
              <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Overall Progress</span>
                  <span className="text-2xl font-bold text-blue-600">
                    {attendance?.overallAttendancePercentage.toFixed(1) || 0}%
                  </span>
                </div>
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>
                    {attendance?.totalClassesAttended || 0} /{' '}
                    {attendance?.totalClassesConducted || 0} classes
                  </span>
                  <span>{attendance?.eligibilityStatus || 'N/A'}</span>
                </div>
                <div className="h-3 bg-white rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all ${
                      (attendance?.overallAttendancePercentage || 0) >= 75
                        ? 'bg-green-500'
                        : 'bg-red-500'
                    }`}
                    style={{
                      width: `${Math.min(attendance?.overallAttendancePercentage || 0, 100)}%`,
                    }}
                  />
                </div>
              </div>

              {/* Top 3 Subjects */}
              {attendance?.subjectWiseAttendance.slice(0, 3).map((subject) => (
                <div key={subject.subjectId} className="border rounded-lg p-3">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-medium text-sm">{subject.subjectName}</p>
                      <p className="text-xs text-gray-500">{subject.subjectCode}</p>
                    </div>
                    <Badge
                      variant={
                        subject.eligibilityStatus === 'ELIGIBLE'
                          ? 'default'
                          : 'destructive'
                      }
                      className="text-xs"
                    >
                      {subject.attendancePercentage.toFixed(1)}%
                    </Badge>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${
                        subject.attendancePercentage >= 75
                          ? 'bg-green-500'
                          : 'bg-red-500'
                      }`}
                      style={{ width: `${Math.min(subject.attendancePercentage, 100)}%` }}
                    />
                  </div>
                  {subject.classesNeededFor75 > 0 && (
                    <p className="text-xs text-orange-600 mt-1">
                      ⚠ Need {subject.classesNeededFor75} more classes for 75%
                    </p>
                  )}
                </div>
              ))}

              <Button
                variant="outline"
                onClick={() => navigate('/student-analytics')}
                className="w-full"
              >
                View All Subjects
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Notifications & Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-yellow-500" />
              Recent Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            {notifications.length > 0 ? (
              <div className="space-y-3">
                {notifications.map((notification) => (
                  <div
                    key={notification.notificationId}
                    className={`p-3 border-l-4 rounded ${
                      notification.priority === 'CRITICAL'
                        ? 'border-l-red-500 bg-red-50'
                        : notification.priority === 'HIGH'
                        ? 'border-l-orange-500 bg-orange-50'
                        : 'border-l-blue-500 bg-blue-50'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-1">
                      <p className="font-semibold text-sm">{notification.title}</p>
                      <Badge
                        variant={notification.priority === 'CRITICAL' ? 'destructive' : 'secondary'}
                        className="text-xs"
                      >
                        {notification.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-700">{notification.message}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(notification.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
                <Button variant="outline" className="w-full" onClick={() => {}}>
                  View All Notifications
                </Button>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Bell className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                <p>No new notifications</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Performance Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-500" />
            Performance Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Award className="h-8 w-8 mx-auto mb-2 text-blue-600" />
              <p className="text-2xl font-bold text-blue-600">
                {studentStats?.averageMarks.toFixed(1) || 0}%
              </p>
              <p className="text-sm text-gray-600">Average Marks</p>
              <p className="text-xs text-gray-500 mt-1">
                Category: {studentStats?.performanceCategory || 'N/A'}
              </p>
            </div>

            <div className="text-center p-4 bg-green-50 rounded-lg">
              <Target className="h-8 w-8 mx-auto mb-2 text-green-600" />
              <p className="text-2xl font-bold text-green-600">
                {studentStats?.totalSubjects || 0}
              </p>
              <p className="text-sm text-gray-600">Total Subjects</p>
              <p className="text-xs text-gray-500 mt-1">This semester</p>
            </div>

            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <Trophy className="h-8 w-8 mx-auto mb-2 text-purple-600" />
              <p className="text-2xl font-bold text-purple-600">
                {(studentStats?.totalSubjects || 0) - (studentStats?.subjectsAtRisk || 0)}
              </p>
              <p className="text-sm text-gray-600">On Track</p>
              <p className="text-xs text-gray-500 mt-1">Performing well</p>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg">
            <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
              <Target className="h-4 w-4" />
              Your Goals
            </h4>
            <ul className="space-y-2 text-sm">
              {studentStats && studentStats.overallAttendance < 75 && (
                <li className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                  <span>
                    Improve attendance to reach 75% requirement (Currently{' '}
                    {studentStats.overallAttendance.toFixed(1)}%)
                  </span>
                </li>
              )}
              {studentStats && studentStats.averageMarks < 60 && (
                <li className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                  <span>
                    Focus on improving marks (Current average:{' '}
                    {studentStats.averageMarks.toFixed(1)}%)
                  </span>
                </li>
              )}
              {studentStats &&
                studentStats.overallAttendance >= 75 &&
                studentStats.averageMarks >= 60 && (
                  <li className="flex items-start gap-2">
                    <Award className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>
                      Great job! You're meeting all requirements. Keep it up! 🎉
                    </span>
                  </li>
                )}
              <li className="flex items-start gap-2">
                <TrendingUp className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                <span>View detailed analytics to track your semester progress</span>
              </li>
            </ul>
            <Button
              onClick={() => navigate('/student-analytics')}
              className="w-full mt-3"
              size="sm"
            >
              View Detailed Analytics
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentDashboardPage;