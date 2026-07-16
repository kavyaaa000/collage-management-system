import React, { useEffect, useState } from 'react';
import { Search, Filter, Send } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import StudentPerformanceCard from '@/components/performance/StudentPerformanceCard';
import DetailedPerformanceView from '@/components/performance/DetailedPerformanceView';
import SendNotificationModal from '@/components/notifications/SendNotificationModal';
import type{ StudentDetailedPerformance } from '@/types';
import { useAuthStore } from '@/store/authStore';
import performanceService from '@/services/performanceService';
import { toast } from 'sonner';

const StudentsListPage: React.FC = () => {
  const user = useAuthStore((state) => state.user);
  const [students, setStudents] = useState<StudentDetailedPerformance[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<StudentDetailedPerformance[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [riskFilter, setRiskFilter] = useState<string>('ALL');
  const [selectedStudent, setSelectedStudent] = useState<StudentDetailedPerformance | null>(null);
  const [notificationStudent, setNotificationStudent] = useState<{
    id: number;
    name: string;
  } | null>(null);

  useEffect(() => {
    if (user?.userType === 'STAFF') {
      loadStudents();
    }
  }, [user]);

  useEffect(() => {
    filterStudents();
  }, [students, searchQuery, riskFilter]);

  const loadStudents = async () => {
    try {
      setLoading(true);
      const data = await performanceService.getClassPerformance(
        user?.semesterId || 1,
        user?.sectionId || 1,
        25 // academic session
      );
      setStudents(data);
    } catch (error) {
      toast.error('Failed to load students');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filterStudents = () => {
    let filtered = [...students];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (s) =>
          s.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.registerNumber.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Risk filter
    if (riskFilter !== 'ALL') {
      filtered = filtered.filter((s) => s.riskLevel === riskFilter);
    }

    setFilteredStudents(filtered);
  };

  const handleSendNotification = (studentId: number, studentName: string) => {
    setNotificationStudent({ id: studentId, name: studentName });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading students...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Student Performance</h1>
        <p className="text-gray-500 mt-1">
          Monitor and analyze student performance across all subjects
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search by name or register number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                value={riskFilter}
                onChange={(e) => setRiskFilter(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="ALL">All Risk Levels</option>
                <option value="CRITICAL">Critical</option>
                <option value="HIGH">High</option>
                <option value="MEDIUM">Medium</option>
                <option value="LOW">Low</option>
              </select>
            </div>

            <Button onClick={loadStudents} variant="outline">
              Refresh Data
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-blue-600">{students.length}</p>
            <p className="text-sm text-gray-600">Total Students</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-red-600">
              {students.filter((s) => s.riskLevel === 'CRITICAL').length}
            </p>
            <p className="text-sm text-gray-600">Critical Risk</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-orange-600">
              {students.filter((s) => s.riskLevel === 'HIGH').length}
            </p>
            <p className="text-sm text-gray-600">High Risk</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-green-600">
              {students.filter((s) => s.overallAttendance >= 75 && s.overallAverageMarks >= 60).length}
            </p>
            <p className="text-sm text-gray-600">Performing Well</p>
          </CardContent>
        </Card>
      </div>

      {/* Students Grid */}
      {filteredStudents.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500">No students found matching your criteria</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStudents.map((student) => (
            <StudentPerformanceCard
              key={student.studentId}
              student={student}
              onViewDetails={() => setSelectedStudent(student)}
              onSendNotification={() =>
                handleSendNotification(student.studentId, student.studentName)
              }
            />
          ))}
        </div>
      )}

      {/* Detailed View Modal */}
      {selectedStudent && (
        <DetailedPerformanceView
          student={selectedStudent}
          onClose={() => setSelectedStudent(null)}
        />
      )}

      {/* Send Notification Modal */}
      {notificationStudent && (
        <SendNotificationModal
          isOpen={true}
          onClose={() => setNotificationStudent(null)}
          studentId={notificationStudent.id}
          studentName={notificationStudent.name}
        />
      )}
    </div>
  );
};

export default StudentsListPage;