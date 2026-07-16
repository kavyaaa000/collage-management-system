// import React, { useEffect, useState } from 'react'
// import {
//   Calendar,
//   CheckCircle,
//   Clock,
//   TrendingUp,
//   AlertTriangle,
// } from 'lucide-react'
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
// import type { DashboardStatsResponse } from '@/types'
// import analyticsService from '@/services/analyticsService'
// import { getTodayISO } from '@/utils/dateUtils'


// interface StaffDashboardProps {
//   staffId: number;
// }

// const StaffDashboard: React.FC<StaffDashboardProps> = ({ staffId }) => {
//   const [stats, setStats] = useState<DashboardStatsResponse | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     loadDashboard();
//   }, [staffId]);

//   const loadDashboard = async () => {
//     try {
//       setLoading(true);
//       const data = await analyticsService.getStaffDashboard(staffId, getTodayISO());
//       setStats(data);
//     } catch (error) {
//       console.error('Failed to load dashboard:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) {
//     return <div className="text-center py-12">Loading dashboard...</div>;
//   }

//   if (!stats || !stats.staffStats) {
//     return <div className="text-center py-12">No data available</div>;
//   }

//   const { staffStats } = stats;

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div>
//         <h1 className="text-3xl font-bold text-gray-900">Staff Dashboard</h1>
//         <p className="text-gray-500 mt-1">Welcome back! Here's your overview for today</p>
//       </div>

//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between pb-2">
//             <CardTitle className="text-sm font-medium text-gray-600">
//               Total Classes
//             </CardTitle>
//             <Calendar className="h-4 w-4 text-gray-500" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">{staffStats.totalClasses}</div>
//             <p className="text-xs text-gray-500 mt-1">Today's schedule</p>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between pb-2">
//             <CardTitle className="text-sm font-medium text-gray-600">
//               Completed
//             </CardTitle>
//             <CheckCircle className="h-4 w-4 text-green-500" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold text-green-600">
//               {staffStats.completedClasses}
//             </div>
//             <p className="text-xs text-gray-500 mt-1">Attendance submitted</p>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between pb-2">
//             <CardTitle className="text-sm font-medium text-gray-600">
//               Pending
//             </CardTitle>
//             <Clock className="h-4 w-4 text-yellow-500" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold text-yellow-600">
//               {staffStats.pendingClasses}
//             </div>
//             <p className="text-xs text-gray-500 mt-1">Yet to be marked</p>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between pb-2">
//             <CardTitle className="text-sm font-medium text-gray-600">
//               Avg Attendance
//             </CardTitle>
//             <TrendingUp className="h-4 w-4 text-blue-500" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold text-blue-600">
//               {staffStats.averageAttendance.toFixed(1)}%
//             </div>
//             <p className="text-xs text-gray-500 mt-1">Class average</p>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Today's Schedule */}
//       {stats.todaySchedule && stats.todaySchedule.length > 0 && (
//         <Card>
//           <CardHeader>
//             <CardTitle>Today's Schedule</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-3">
//               {stats.todaySchedule.map((schedule) => (
//                 <div
//                   key={schedule.periodNumber}
//                   className="flex items-center justify-between p-3 border rounded-lg"
//                 >
//                   <div>
//                     <p className="font-medium">Period {schedule.periodNumber}: {schedule.subjectName}</p>
//                     <p className="text-sm text-gray-500">{schedule.roomNumber}</p>
//                   </div>
//                   <div>
//                     {schedule.status === 'SUBMITTED' ? (
//                       <span className="text-green-600 text-sm font-medium">✓ Submitted</span>
//                     ) : schedule.status === 'OPEN' ? (
//                       <span className="text-yellow-600 text-sm font-medium">⏱ Open</span>
//                     ) : (
//                       <span className="text-gray-500 text-sm">Not started</span>
//                     )}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </CardContent>
//         </Card>
//       )}

//       {/* At-Risk Students */}
//       {stats.atRiskStudents && stats.atRiskStudents.length > 0 && (
//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <AlertTriangle className="h-5 w-5 text-yellow-500" />
//               Students Requiring Attention
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-2">
//               {stats.atRiskStudents.slice(0, 5).map((student) => (
//                 <div
//                   key={student.studentId}
//                   className="flex items-center justify-between p-3 border rounded-lg"
//                 >
//                   <div>
//                     <p className="font-medium">{student.studentName}</p>
//                     <p className="text-sm text-gray-500">{student.registerNumber}</p>
//                   </div>
//                   <div className="text-right">
//                     <p className="text-sm">
//                       <span className="text-red-600 font-medium">
//                         {student.attendance.toFixed(1)}% attendance
//                       </span>
//                     </p>
//                     <p className="text-sm text-gray-500">
//                       {student.averageMarks.toFixed(1)}% marks
//                     </p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </CardContent>
//         </Card>
//       )}
//     </div>
//   );
// };

// export default StaffDashboard;









import React, { useEffect, useState } from 'react';
import {
  Calendar,
  CheckCircle,
  Clock,
  TrendingUp,
  Users,
  AlertTriangle,
  BarChart3,
  BookOpen,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import TodaySchedule from '@/components/timetable/TodaySchedule';
import type{ DashboardStatsResponse, ClassInfo } from '@/types';
import { useAuthStore } from '@/store/authStore';
import analyticsService from '@/services/analyticsService';
import classService from '@/services/classService';
import { getTodayISO } from '@/utils/dateUtils';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const StaffDashboardPage: React.FC = () => {
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStatsResponse | null>(null);
  const [classes, setClasses] = useState<ClassInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadDashboard();
      loadClasses();
    }
  }, [user]);

  const loadDashboard = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const data = await analyticsService.getStaffDashboard(user.referenceId, getTodayISO());
      setStats(data);
    } catch (error) {
      console.error('Failed to load dashboard:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const loadClasses = async () => {
    if (!user) return;

    try {
      const data = user.userType === 'HOD'
        ? await classService.getAllClasses()
        : await classService.getStaffClasses(user.referenceId);
      setClasses(data);
    } catch (error) {
      console.error('Failed to load classes:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const staffStats = stats?.staffStats;

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name}!</h1>
        <p className="text-blue-100">
          {user?.userType === 'HOD' ? 'Head of Department' : 'Faculty Member'} Dashboard
        </p>
        <p className="text-sm text-blue-200 mt-1">
          {new Date().toLocaleDateString('en-IN', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Today's Classes
            </CardTitle>
            <Calendar className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">
              {staffStats?.totalClasses || 0}
            </div>
            <p className="text-xs text-gray-500 mt-1">Total scheduled</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Completed
            </CardTitle>
            <CheckCircle className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {staffStats?.completedClasses || 0}
            </div>
            <p className="text-xs text-gray-500 mt-1">Attendance submitted</p>
            {staffStats && staffStats.totalClasses > 0 && (
              <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500"
                  style={{
                    width: `${(staffStats.completedClasses / staffStats.totalClasses) * 100}%`,
                  }}
                />
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Pending
            </CardTitle>
            <Clock className="h-5 w-5 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">
              {staffStats?.pendingClasses || 0}
            </div>
            <p className="text-xs text-gray-500 mt-1">Yet to be marked</p>
            {staffStats && staffStats.pendingClasses > 0 && (
              <Button
                size="sm"
                onClick={() => navigate('/attendance')}
                className="mt-2 w-full"
              >
                Mark Now
              </Button>
            )}
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Avg Attendance
            </CardTitle>
            <TrendingUp className="h-5 w-5 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">
              {staffStats?.averageAttendance.toFixed(1) || 0}%
            </div>
            <p className="text-xs text-gray-500 mt-1">Class average today</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              onClick={() => navigate('/attendance')}
              className="h-24 flex flex-col items-center justify-center gap-2"
              variant="outline"
            >
              <CheckCircle className="h-8 w-8" />
              <span>Mark Attendance</span>
            </Button>
            <Button
              onClick={() => navigate('/class-analytics')}
              className="h-24 flex flex-col items-center justify-center gap-2"
              variant="outline"
            >
              <BarChart3 className="h-8 w-8" />
              <span>View Analytics</span>
            </Button>
            <Button
              onClick={() => navigate('/students')}
              className="h-24 flex flex-col items-center justify-center gap-2"
              variant="outline"
            >
              <Users className="h-8 w-8" />
              <span>View Students</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Schedule */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-500" />
              Today's Schedule
            </CardTitle>
          </CardHeader>
          <CardContent>
            {stats?.todaySchedule && stats.todaySchedule.length > 0 ? (
              <div className="space-y-3">
                {stats.todaySchedule.map((schedule, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="font-bold text-blue-600">P{schedule.periodNumber}</span>
                      </div>
                      <div>
                        <p className="font-medium">{schedule.subjectName}</p>
                        <p className="text-sm text-gray-500">{schedule.roomNumber}</p>
                      </div>
                    </div>
                    <div>
                      {schedule.status === 'SUBMITTED' ? (
                        <Badge variant="default" className="bg-green-500">
                          ✓ Done
                        </Badge>
                      ) : schedule.status === 'OPEN' ? (
                        <Badge variant="secondary" className="bg-yellow-500 text-white">
                          Pending
                        </Badge>
                      ) : (
                        <Badge variant="outline">Scheduled</Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                <p>No classes scheduled for today</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* My Classes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-green-500" />
              My Classes ({classes.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {classes.length > 0 ? (
              <div className="space-y-3">
                {classes.slice(0, 5).map((classInfo) => (
                  <div
                    key={classInfo.classId}
                    className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                    onClick={() => navigate('/class-analytics')}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">{classInfo.className}</h4>
                      <Badge variant="outline">{classInfo.totalStudents} students</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-blue-500 rounded-full" />
                        <span className="text-gray-600">
                          Avg Attendance: {classInfo.averageAttendance?.toFixed(1) || 0}%
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                        <span className="text-gray-600">
                          Avg Marks: {classInfo.averageMarks?.toFixed(1) || 0}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <BookOpen className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                <p>No classes assigned</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* At-Risk Students */}
      {stats?.atRiskStudents && stats.atRiskStudents.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Students Requiring Attention ({stats.atRiskStudents.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {stats.atRiskStudents.slice(0, 6).map((student) => (
                <div
                  key={student.studentId}
                  className="p-4 border-2 border-red-200 bg-red-50 rounded-lg"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold">{student.studentName}</p>
                      <p className="text-sm text-gray-500">{student.registerNumber}</p>
                    </div>
                    <Badge variant="destructive">At Risk</Badge>
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Attendance:</span>
                      <span className="font-semibold text-red-600">
                        {student.attendance.toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Avg Marks:</span>
                      <span className="font-semibold text-orange-600">
                        {student.averageMarks.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => navigate(`/students`)}
                    className="w-full mt-3"
                  >
                    View Details
                  </Button>
                </div>
              ))}
            </div>
            {stats.atRiskStudents.length > 6 && (
              <div className="text-center mt-4">
                <Button variant="outline" onClick={() => navigate('/students')}>
                  View All {stats.atRiskStudents.length} Students
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StaffDashboardPage;