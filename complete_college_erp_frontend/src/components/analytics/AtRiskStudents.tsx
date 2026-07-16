import React, { useEffect, useState } from 'react';
import { AlertTriangle, TrendingDown, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { AtRiskStudentResponse } from '@/types';
import analyticsService from '@/services/analyticsService';
import { getRiskLevelColor } from '@/lib/utils';

interface AtRiskStudentsProps {
  semesterId: number;
  academicSessionId: number;
}

const AtRiskStudents: React.FC<AtRiskStudentsProps> = ({
  semesterId,
  academicSessionId,
}) => {
  const [students, setStudents] = useState<AtRiskStudentResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAtRiskStudents();
  }, [semesterId, academicSessionId]);

  const loadAtRiskStudents = async () => {
    try {
      setLoading(true);
      const data = await analyticsService.getAtRiskStudents(semesterId, academicSessionId);
      setStudents(data);
    } catch (error) {
      console.error('Failed to load at-risk students:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          Loading at-risk students...
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-yellow-500" />
          At-Risk Students ({students.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {students.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <User className="h-12 w-12 mx-auto mb-2 text-gray-400" />
            <p>No students at risk</p>
          </div>
        ) : (
          <div className="space-y-4">
            {students.map((student) => (
              <div
                key={student.studentId}
                className="p-4 border rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-semibold text-lg">{student.studentName}</p>
                    <p className="text-sm text-gray-500">{student.registerNumber}</p>
                  </div>
                  <Badge className={getRiskLevelColor(student.riskLevel)}>
                    {student.riskLevel}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div className="text-center p-3 bg-red-50 rounded">
                    <p className="text-2xl font-bold text-red-600">
                      {student.avgAttendance.toFixed(1)}%
                    </p>
                    <p className="text-xs text-gray-600">Attendance</p>
                  </div>
                  <div className="text-center p-3 bg-orange-50 rounded">
                    <p className="text-2xl font-bold text-orange-600">
                      {student.avgMarks.toFixed(1)}%
                    </p>
                    <p className="text-xs text-gray-600">Average Marks</p>
                  </div>
                </div>

                {student.recommendations && student.recommendations.length > 0 && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
                    <p className="text-xs font-semibold text-yellow-800 mb-2">
                      Recommendations:
                    </p>
                    <ul className="text-xs text-yellow-700 space-y-1">
                      {student.recommendations.map((rec, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <TrendingDown className="h-3 w-3 mt-0.5 flex-shrink-0" />
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AtRiskStudents;