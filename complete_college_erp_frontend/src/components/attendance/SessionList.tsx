import React from 'react';
import { Calendar, Clock, Users, CheckCircle, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { AttendanceSession } from '@/types';
import { formatTime } from '@/lib/utils';

interface SessionListProps {
  sessions: AttendanceSession[];
  onSessionClick: (session: AttendanceSession) => void;
}

const SessionList: React.FC<SessionListProps> = ({
  sessions = [],
  onSessionClick,
}) => {

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'SUBMITTED':
        return <Badge variant="success">Submitted</Badge>;
      case 'LOCKED':
        return <Badge variant="secondary">Locked</Badge>;
      default:
        return <Badge variant="warning">Open</Badge>;
    }
  };

  const getAttendanceColor = (percentage: number) => {
    if (percentage >= 75) return 'text-green-600';
    if (percentage >= 65) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-4">
      {sessions.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <AlertCircle className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">No sessions found for today</p>
          </CardContent>
        </Card>
      ) : (
        sessions.map((session) => (
          <Card key={session.sessionId} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-lg">{session.subjectName}</h3>
                    {getStatusBadge(session.status)}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>Period {session.periodNumber}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{session.totalStudents} Students</span>
                    </div>
                  </div>

                  {session.status !== 'OPEN' && (
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-green-600 font-medium">
                          {session.presentCount} Present
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-red-600" />
                        <span className="text-red-600 font-medium">
                          {session.absentCount} Absent
                        </span>
                      </div>
                      <div className={`font-bold ${getAttendanceColor(session.attendancePercentage || 0)}`}>
                        {session.attendancePercentage?.toFixed(1)}%
                      </div>
                    </div>
                  )}
                </div>

                <div className="ml-4">
                  {session.status === 'OPEN' ? (
                    <Button onClick={() => onSessionClick(session)}>
                      Mark Attendance
                    </Button>
                  ) : (
                    <Button variant="outline" onClick={() => onSessionClick(session)}>
                      View Details
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};

export default SessionList;