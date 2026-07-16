import React from 'react';
import {
  X,
  TrendingUp,
  TrendingDown,
  Minus,
  AlertCircle,
  CheckCircle,
  Target,
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import type { StudentDetailedPerformance } from '../../types';
import { getAttendanceColor, getRiskLevelColor } from '../../lib/utils';

interface DetailedPerformanceViewProps {
  student: StudentDetailedPerformance;
  onClose: () => void;
}

const DetailedPerformanceView: React.FC<DetailedPerformanceViewProps> = ({
  student,
  onClose,
}) => {
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'IMPROVING':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'DECLINING':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-lg w-full max-w-4xl my-8" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white z-10">
          <div>
            <h2 className="text-2xl font-bold">{student.studentName}</h2>
            <p className="text-gray-500">{student.registerNumber}</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={getRiskLevelColor(student.riskLevel)}>
              {student.riskLevel} RISK
            </Badge>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Overall Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center gap-1 mb-2">
                  <p className={`text-3xl font-bold ${getAttendanceColor(student.overallAttendance)}`}>
                    {student.overallAttendance.toFixed(1)}%
                  </p>
                  {getTrendIcon(student.attendanceTrend)}
                </div>
                <p className="text-sm text-gray-600">Overall Attendance</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center gap-1 mb-2">
                  <p className="text-3xl font-bold text-green-600">
                    {student.overallAverageMarks.toFixed(1)}%
                  </p>
                  {getTrendIcon(student.performanceTrend)}
                </div>
                <p className="text-sm text-gray-600">Average Marks</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-3xl font-bold text-orange-600">{student.atRiskSubjects}</p>
                <p className="text-sm text-gray-600">At-Risk Subjects</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-3xl font-bold text-purple-600">
                  {student.predictedFinalMarks.toFixed(1)}%
                </p>
                <p className="text-sm text-gray-600">Predicted Final</p>
              </CardContent>
            </Card>
          </div>

          {/* Recommendations */}
          {student.recommendations && student.recommendations.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-blue-500" />
                  Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {student.recommendations.map((rec, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Subject-wise Attendance */}
          <Card>
            <CardHeader>
              <CardTitle>Subject-wise Attendance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {student.subjectWiseAttendance.map((subject, idx) => (
                  <div key={idx} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="font-medium">{subject.subjectName}</p>
                        <p className="text-sm text-gray-500">{subject.subjectCode}</p>
                      </div>
                      <div className="text-right">
                        <p className={`text-lg font-bold ${getAttendanceColor(subject.percentage)}`}>
                          {subject.percentage.toFixed(1)}%
                        </p>
                        <p className="text-sm text-gray-500">
                          {subject.attendedClasses}/{subject.totalClasses} classes
                        </p>
                      </div>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all ${
                          subject.percentage >= 75
                            ? 'bg-green-500'
                            : subject.percentage >= 65
                            ? 'bg-yellow-500'
                            : 'bg-red-500'
                        }`}
                        style={{ width: `${Math.min(subject.percentage, 100)}%` }}
                      />
                    </div>

                    {subject.classesNeededFor75 > 0 && (
                      <p className="text-xs text-orange-600 mt-2">
                        Attend {subject.classesNeededFor75} more consecutive classes to reach 75%
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Subject-wise Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Internal Marks Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Subject</th>
                      <th className="text-center p-2">Internal 1</th>
                      <th className="text-center p-2">Internal 2</th>
                      <th className="text-center p-2">Internal 3</th>
                      <th className="text-center p-2">Average</th>
                      <th className="text-center p-2">Trend</th>
                    </tr>
                  </thead>
                  <tbody>
                    {student.subjectWisePerformance.map((subject, idx) => (
                      <tr key={idx} className="border-b hover:bg-gray-50">
                        <td className="p-2">
                          <p className="font-medium">{subject.subjectName}</p>
                          <p className="text-xs text-gray-500">{subject.subjectCode}</p>
                        </td>
                        <td className="text-center p-2">{subject.internal1.toFixed(1)}</td>
                        <td className="text-center p-2">{subject.internal2.toFixed(1)}</td>
                        <td className="text-center p-2">{subject.internal3.toFixed(1)}</td>
                        <td className="text-center p-2">
                          <span className={`font-bold ${
                            subject.average >= 75
                              ? 'text-green-600'
                              : subject.average >= 60
                              ? 'text-blue-600'
                              : subject.average >= 50
                              ? 'text-yellow-600'
                              : 'text-red-600'
                          }`}>
                            {subject.average.toFixed(1)}
                          </span>
                        </td>
                        <td className="text-center p-2">
                          {getTrendIcon(subject.trend)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Active Alerts */}
          {student.activeAlerts && student.activeAlerts.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-red-500" />
                  Active Alerts ({student.activeAlerts.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {student.activeAlerts.map((alert, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-lg border ${
                        alert.severity === 'CRITICAL'
                          ? 'bg-red-50 border-red-200'
                          : alert.severity === 'WARNING'
                          ? 'bg-yellow-50 border-yellow-200'
                          : 'bg-blue-50 border-blue-200'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-1">
                        <p className="font-medium text-sm">{alert.alertType.replace(/_/g, ' ')}</p>
                        <Badge variant={alert.severity === 'CRITICAL' ? 'destructive' : 'secondary'}>
                          {alert.severity}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-700">{alert.message}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailedPerformanceView;