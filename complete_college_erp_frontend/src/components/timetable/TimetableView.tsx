import React from 'react';
import { Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Timetable } from '@/types';

interface TimetableViewProps {
  timetable: Timetable[];
}

const TimetableView: React.FC<TimetableViewProps> = ({ timetable }) => {
  const days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'];
  const periods = Array.from({ length: 8 }, (_, i) => i + 1);

  const getPeriodTime = (period: number): string => {
    const times = [
      '8:00 - 8:50',
      '8:50 - 9:40',
      '9:40 - 10:30',
      '10:30 - 11:20',
      '11:20 - 12:10', // Lunch
      '12:10 - 1:00',
      '1:00 - 1:50',
      '1:50 - 2:40',
    ];
    return times[period - 1] || '';
  };

  const getTimetableEntry = (day: string, period: number) => {
    return timetable.find(
      (entry) => entry.dayOfWeek === day && entry.periodNumber === period
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Timetable</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="border p-2 bg-gray-100 min-w-[100px]">
                  <Clock className="h-4 w-4 mx-auto" />
                </th>
                {days.map((day) => (
                  <th key={day} className="border p-2 bg-gray-100 min-w-[150px]">
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {periods.map((period) => (
                <tr key={period}>
                  <td className="border p-2 bg-gray-50 text-center">
                    <div className="font-semibold">P{period}</div>
                    <div className="text-xs text-gray-500">
                      {getPeriodTime(period)}
                    </div>
                  </td>
                  {days.map((day) => {
                    const entry = getTimetableEntry(day, period);
                    
                    if (!entry || !entry.subjectId) {
                      return (
                        <td key={day} className="border p-2 bg-gray-50 text-center">
                          {period === 5 ? (
                            <Badge variant="secondary">LUNCH BREAK</Badge>
                          ) : (
                            <span className="text-gray-400 text-sm">FREE</span>
                          )}
                        </td>
                      );
                    }

                    return (
                      <td key={day} className="border p-2 hover:bg-blue-50">
                        <div className="text-sm">
                          <p className="font-semibold text-blue-600">
                            Subject {entry.subjectId}
                          </p>
                          <p className="text-xs text-gray-600">
                            Staff {entry.staffId}
                          </p>
                          <p className="text-xs text-gray-500">
                            {entry.roomNumber}
                          </p>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default TimetableView;