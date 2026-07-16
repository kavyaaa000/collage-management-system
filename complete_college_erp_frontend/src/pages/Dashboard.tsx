// import React from 'react';
// import StaffDashboard from '@/components/dashboard/StaffDashboard';
// import StudentDashboard from '@/components/dashboard/StudentDashboard';

// interface DashboardProps {
//   userType: 'staff' | 'student';
//   userId: number;
//   semesterId?: number;
//   academicSessionId?: number;
// }

// const Dashboard: React.FC<DashboardProps> = ({
//   userType,
//   userId,
//   semesterId = 1,
//   academicSessionId = 25,
// }) => {
//   return (
//     <div>
//       {userType === 'staff' ? (
//         <StaffDashboard staffId={userId} />
//       ) : (
//         <StudentDashboard
//           studentId={userId}
//           semesterId={semesterId}
//           academicSessionId={academicSessionId}
//         />
//       )}
//     </div>
//   );
// };

// export default Dashboard;



import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart3, Users, TrendingUp, Trophy, Calendar, Bell } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import StaffDashboard from '@/components/dashboard/StaffDashboard';
import StudentDashboard from '@/components/dashboard/StudentDashboard';

interface DashboardProps {
  userType: 'STAFF' | 'STUDENT' | 'HOD' | 'ADMIN';
  userId: number;
  semesterId?: number;
  academicSessionId?: number;
}

const Dashboard: React.FC<DashboardProps> = ({
  userType,
  userId,
  semesterId = 1,
  academicSessionId = 25,
}) => {
  const navigate = useNavigate();

  // HOD Dashboard
  if (userType === 'HOD') {
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-8 rounded-lg">
          <h1 className="text-4xl font-bold mb-2">HOD Dashboard</h1>
          <p className="text-purple-100">Complete overview of all classes and students</p>
        </div>

        {/* Quick Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card 
            className="cursor-pointer hover:shadow-lg transition-shadow border-2 border-blue-200 bg-blue-50"
            onClick={() => navigate('/class-analytics')}
          >
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-500 rounded-lg">
                  <BarChart3 className="h-8 w-8 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-600">All Classes</p>
                  <p className="text-sm text-gray-600">View Analytics</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:shadow-lg transition-shadow border-2 border-green-200 bg-green-50"
            onClick={() => navigate('/students')}
          >
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-500 rounded-lg">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-600">All Students</p>
                  <p className="text-sm text-gray-600">View Performance</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:shadow-lg transition-shadow border-2 border-purple-200 bg-purple-50"
            onClick={() => navigate('/attendance')}
          >
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-500 rounded-lg">
                  <Calendar className="h-8 w-8 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-purple-600">Attendance</p>
                  <p className="text-sm text-gray-600">Mark for Any Class</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:shadow-lg transition-shadow border-2 border-yellow-200 bg-yellow-50"
            onClick={() => navigate('/analytics')}
          >
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-yellow-500 rounded-lg">
                  <TrendingUp className="h-8 w-8 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-yellow-600">Reports</p>
                  <p className="text-sm text-gray-600">Department Analytics</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>🎯 Quick Start Guide</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                <BarChart3 className="h-5 w-5 text-blue-600 mt-1" />
                <div>
                  <p className="font-semibold text-blue-900">Class Analytics</p>
                  <p className="text-sm text-blue-700">View comprehensive analytics for all classes with charts and comparisons</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                <Users className="h-5 w-5 text-green-600 mt-1" />
                <div>
                  <p className="font-semibold text-green-900">All Students</p>
                  <p className="text-sm text-green-700">Access detailed performance of every student across all classes</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
                <Calendar className="h-5 w-5 text-purple-600 mt-1" />
                <div>
                  <p className="font-semibold text-purple-900">Mark Attendance</p>
                  <p className="text-sm text-purple-700">You can mark attendance for ANY period in ANY class</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Also show staff dashboard */}
        <StaffDashboard staffId={userId} />
      </div>
    );
  }

  // Staff Dashboard  
  if (userType === 'STAFF' || userType === 'ADMIN') {
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-lg">
          <h1 className="text-4xl font-bold mb-2">Staff Dashboard</h1>
          <p className="text-blue-100">Manage your classes and students</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card 
            className="cursor-pointer hover:shadow-lg transition-shadow border-2 border-blue-200"
            onClick={() => navigate('/class-analytics')}
          >
            <CardContent className="pt-6 text-center">
              <BarChart3 className="h-12 w-12 mx-auto mb-4 text-blue-600" />
              <p className="text-xl font-bold">Class Analytics</p>
              <p className="text-sm text-gray-600 mt-2">View detailed class performance</p>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:shadow-lg transition-shadow border-2 border-green-200"
            onClick={() => navigate('/students')}
          >
            <CardContent className="pt-6 text-center">
              <Users className="h-12 w-12 mx-auto mb-4 text-green-600" />
              <p className="text-xl font-bold">My Students</p>
              <p className="text-sm text-gray-600 mt-2">Track student performance</p>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:shadow-lg transition-shadow border-2 border-purple-200"
            onClick={() => navigate('/attendance')}
          >
            <CardContent className="pt-6 text-center">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-purple-600" />
              <p className="text-xl font-bold">Mark Attendance</p>
              <p className="text-sm text-gray-600 mt-2">Today's sessions</p>
            </CardContent>
          </Card>
        </div>

        <StaffDashboard staffId={userId} />
      </div>
    );
  }

  // Student Dashboard
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white p-8 rounded-lg">
        <h1 className="text-4xl font-bold mb-2">Student Dashboard</h1>
        <p className="text-green-100">Track your academic progress</p>
      </div>

      {/* Quick Actions for Students */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card 
          className="cursor-pointer hover:shadow-lg transition-shadow border-2 border-blue-200"
          onClick={() => navigate('/student-analytics')}
        >
          <CardContent className="pt-6 text-center">
            <BarChart3 className="h-12 w-12 mx-auto mb-4 text-blue-600" />
            <p className="text-xl font-bold">My Analytics</p>
            <p className="text-sm text-gray-600 mt-2">Comprehensive performance analysis</p>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer hover:shadow-lg transition-shadow border-2 border-yellow-200"
          onClick={() => navigate('/top-performers')}
        >
          <CardContent className="pt-6 text-center">
            <Trophy className="h-12 w-12 mx-auto mb-4 text-yellow-600" />
            <p className="text-xl font-bold">Top Performers</p>
            <p className="text-sm text-gray-600 mt-2">View class toppers</p>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer hover:shadow-lg transition-shadow border-2 border-purple-200"
          onClick={() => navigate('/timetable')}
        >
          <CardContent className="pt-6 text-center">
            <Calendar className="h-12 w-12 mx-auto mb-4 text-purple-600" />
            <p className="text-xl font-bold">Timetable</p>
            <p className="text-sm text-gray-600 mt-2">View your schedule</p>
          </CardContent>
        </Card>
      </div>

      <StudentDashboard
        studentId={userId}
        semesterId={semesterId}
        academicSessionId={academicSessionId}
      />
    </div>
  );
};

export default Dashboard;