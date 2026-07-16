import React, { useState, useEffect } from 'react';
import { Check, X, Clock, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Student, AttendanceSession, StudentAttendanceData } from '@/types';
import { toast } from 'sonner';
import attendanceService from '@/services/attendanceService';

interface AttendanceMarkingProps {
  session: AttendanceSession;
  students: Student[];
  onComplete: () => void;
}

const AttendanceMarking: React.FC<AttendanceMarkingProps> = ({
  session,
  students,
  onComplete,
}) => {
  const [attendanceData, setAttendanceData] = useState<Map<number, StudentAttendanceData>>(
    new Map()
  );
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Initialize all students as absent
    const initialData = new Map<number, StudentAttendanceData>();
    students.forEach((student) => {
      initialData.set(student.studentId, {
        studentId: student.studentId,
        status: 'ABSENT',
      });
    });
    setAttendanceData(initialData);
  }, [students]);

  const handleStatusChange = (
    studentId: number,
    status: 'PRESENT' | 'ABSENT' | 'ON_DUTY' | 'MEDICAL_LEAVE'
  ) => {
    setAttendanceData((prev) => {
      const newMap = new Map(prev);
      const existing = newMap.get(studentId);
      newMap.set(studentId, {
        ...existing!,
        status,
      });
      return newMap;
    });
  };

  const handleMarkAll = (status: 'PRESENT' | 'ABSENT') => {
    setAttendanceData((prev) => {
      const newMap = new Map(prev);
      students.forEach((student) => {
        newMap.set(student.studentId, {
          studentId: student.studentId,
          status,
        });
      });
      return newMap;
    });
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      const attendanceList = Array.from(attendanceData.values());
      
      await attendanceService.bulkMarkAttendance({
        sessionId: session.sessionId,
        attendanceList,
        markedBy: 1, // TODO: Get from auth context
      });

      toast.success('Attendance saved successfully');
      onComplete();
    } catch (error) {
      toast.error('Failed to save attendance');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async () => {
    try {
      await handleSave();
      await attendanceService.submitSession(session.sessionId, 1); // TODO: Get staffId from auth
      toast.success('Attendance submitted successfully');
      onComplete();
    } catch (error) {
      toast.error('Failed to submit attendance');
      console.error(error);
    }
  };

  const presentCount = Array.from(attendanceData.values()).filter(
    (d) => d.status === 'PRESENT' || d.status === 'ON_DUTY'
  ).length;
  const absentCount = students.length - presentCount;
  const attendancePercentage = students.length > 0
    ? ((presentCount / students.length) * 100).toFixed(1)
    : 0;

  return (
    <div className="space-y-4">
      {/* Summary Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Mark Attendance</CardTitle>
            <Badge variant={session.status === 'OPEN' ? 'warning' : 'success'}>
              {session.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">{students.length}</p>
              <p className="text-sm text-gray-600">Total Students</p>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">{presentCount}</p>
              <p className="text-sm text-gray-600">Present</p>
            </div>
            <div className="text-center p-3 bg-red-50 rounded-lg">
              <p className="text-2xl font-bold text-red-600">{absentCount}</p>
              <p className="text-sm text-gray-600">Absent</p>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <p className="text-2xl font-bold text-purple-600">{attendancePercentage}%</p>
              <p className="text-sm text-gray-600">Attendance</p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleMarkAll('PRESENT')}
              className="flex-1"
            >
              <Check className="h-4 w-4 mr-2" />
              Mark All Present
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleMarkAll('ABSENT')}
              className="flex-1"
            >
              <X className="h-4 w-4 mr-2" />
              Mark All Absent
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Student List */}
      <Card>
        <CardHeader>
          <CardTitle>Students ({students.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {students.map((student) => {
              const status = attendanceData.get(student.studentId)?.status || 'ABSENT';
              
              return (
                <div
                  key={student.studentId}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex-1">
                    <p className="font-medium">{student.studentName}</p>
                    <p className="text-sm text-gray-500">{student.registerNumber}</p>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant={status === 'PRESENT' ? 'default' : 'outline'}
                      onClick={() => handleStatusChange(student.studentId, 'PRESENT')}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant={status === 'ABSENT' ? 'destructive' : 'outline'}
                      onClick={() => handleStatusChange(student.studentId, 'ABSENT')}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant={status === 'ON_DUTY' ? 'secondary' : 'outline'}
                      onClick={() => handleStatusChange(student.studentId, 'ON_DUTY')}
                      title="On Duty"
                    >
                      OD
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-2 justify-end">
        <Button
          variant="outline"
          onClick={handleSave}
          disabled={saving || session.status !== 'OPEN'}
        >
          <Save className="h-4 w-4 mr-2" />
          Save Draft
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={saving || session.status !== 'OPEN'}
        >
          <Clock className="h-4 w-4 mr-2" />
          Submit Attendance
        </Button>
      </div>
    </div>
  );
};

export default AttendanceMarking;