import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import SessionList from '@/components/attendance/SessionList';
import AttendanceMarking from '@/components/attendance/AttendanceMarking';
import type{ AttendanceSession, Student } from '@/types';
// import { useStaffSessions } from '@/hooks/useAttendance';
import { useStaffSessions } from "../hooks/useAttendance";
import { getTodayISO } from '@/utils/dateUtils';
import attendanceService from '@/services/attendanceService';
import { toast } from 'sonner';

interface AttendancePageProps {
  staffId: number;
  semesterId: number;
  sectionId: number;
  academicSessionId: number;
}

const AttendancePage: React.FC<AttendancePageProps> = ({
  staffId,
  semesterId,
  sectionId,
  academicSessionId,
}) => {
  const [selectedDate, setSelectedDate] = useState(getTodayISO());
  const [selectedSession, setSelectedSession] = useState<AttendanceSession | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const { sessions, loading, refetch } = useStaffSessions(staffId, selectedDate);

  // Mock students - In real app, fetch from API
  useEffect(() => {
    // TODO: Fetch students for the section
    setStudents([]);
  }, [sectionId]);

  const handleSessionClick = async (session: AttendanceSession) => {
    setSelectedSession(session);
    // TODO: Fetch students for this session's section
  };

  const handleCreateSession = async (timetableId: number) => {
    try {
      await attendanceService.createSession({
        timetableId,
        attendanceDate: selectedDate,
        academicSessionId,
        createdBy: staffId,
      });
      toast.success('Session created successfully');
      refetch();
    } catch (error) {
      toast.error('Failed to create session');
      console.error(error);
    }
  };

  const handleComplete = () => {
    setSelectedSession(null);
    refetch();
  };

  if (selectedSession) {
    return (
      <div>
        <div className="mb-6">
          <Button variant="outline" onClick={() => setSelectedSession(null)}>
            ← Back to Sessions
          </Button>
        </div>
        <AttendanceMarking
          session={selectedSession}
          students={students}
          onComplete={handleComplete}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Attendance Management</h1>
          <p className="text-gray-500 mt-1">Mark and manage student attendance</p>
        </div>
      </div>

      <div className="flex gap-4">
        <Input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="max-w-xs"
        />
      </div>

      {loading ? (
        <div className="text-center py-12">Loading sessions...</div>
      ) : (
        <SessionList sessions={sessions} onSessionClick={handleSessionClick} />
      )}
    </div>
  );
};

export default AttendancePage;