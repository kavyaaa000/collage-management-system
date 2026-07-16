import React, { useEffect, useState } from 'react';
import { Calendar, Clock, MapPin, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import type { Timetable } from '../../types';
import timetableService from '../../services/timetableService';
import { getDayOfWeek } from '../../lib/utils';

interface TodayScheduleProps {
  staffId: number;
}

const TodaySchedule: React.FC<TodayScheduleProps> = ({ staffId }) => {
  const [schedule, setSchedule] = useState<Timetable[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSchedule();
  }, [staffId]);

  const loadSchedule = async () => {
    try {
      setLoading(true);
      const data = await timetableService.getTodaySchedule(staffId);
      setSchedule(data.filter(t => t.subjectId)); // Filter out free periods
    } catch (error) {
      console.error('Failed to load schedule:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPeriodTime = (period: number): string => {
    const times = [
      '8:00 AM - 8:50 AM',
      '8:50 AM - 9:40 AM',
      '9:40 AM - 10:30 AM',
      '10:30 AM - 11:20 AM',
      '11:20 AM - 12:10 PM',
      '12:10 PM - 1:00 PM',
      '1:00 PM - 1:50 PM',
      '1:50 PM - 2:40 PM',
    ];
    return times[period - 1] || '';
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          Loading today's schedule...
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Today's Schedule - {getDayOfWeek()}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {schedule.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Clock className="h-12 w-12 mx-auto mb-2 text-gray-400" />
            <p>No classes scheduled for today</p>
          </div>
        ) : (
          <div className="space-y-3">
            {schedule.map((entry) => (
              <div
                key={entry.timetableId}
                className="p-4 border rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-semibold text-lg">
                      Subject {entry.subjectId}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        Period {entry.periodNumber}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {entry.roomNumber}
                      </span>
                    </div>
                  </div>
                  <Badge variant="outline">
                    {getPeriodTime(entry.periodNumber)}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TodaySchedule;