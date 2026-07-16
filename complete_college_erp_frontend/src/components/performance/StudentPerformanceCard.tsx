import React from 'react';
import { User, TrendingUp, TrendingDown, Minus, AlertTriangle, Award } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type{ StudentDetailedPerformance } from '@/types';
import { getRiskLevelColor, getAttendanceColor } from '@/lib/utils';

interface StudentPerformanceCardProps {
  student: StudentDetailedPerformance;
  onViewDetails: () => void;
  onSendNotification?: () => void;
}

const StudentPerformanceCard: React.FC<StudentPerformanceCardProps> = ({
  student,
  onViewDetails,
  onSendNotification,
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
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">{student.studentName}</h3>
              <p className="text-sm text-gray-500">{student.registerNumber}</p>
            </div>
          </div>
          <Badge className={getRiskLevelColor(student.riskLevel)}>
            {student.riskLevel}
          </Badge>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-center gap-1 mb-1">
              <p className={`text-2xl font-bold ${getAttendanceColor(student.overallAttendance)}`}>
                {student.overallAttendance.toFixed(1)}%
              </p>
              {getTrendIcon(student.attendanceTrend)}
            </div>
            <p className="text-xs text-gray-600">Attendance</p>
          </div>

          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="flex items-center justify-center gap-1 mb-1">
              <p className="text-2xl font-bold text-green-600">
                {student.overallAverageMarks.toFixed(1)}%
              </p>
              {getTrendIcon(student.performanceTrend)}
            </div>
            <p className="text-xs text-gray-600">Average Marks</p>
          </div>
        </div>

        {/* Alerts and Subjects */}
        <div className="flex items-center justify-between mb-4 text-sm">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-orange-500" />
            <span className="text-gray-600">
              {student.atRiskSubjects} subject{student.atRiskSubjects !== 1 ? 's' : ''} at risk
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Award className="h-4 w-4 text-blue-500" />
            <span className="text-gray-600">
              {student.activeAlerts.length} alert{student.activeAlerts.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button variant="outline" onClick={onViewDetails} className="flex-1">
            View Details
          </Button>
          {onSendNotification && (
            <Button onClick={onSendNotification} className="flex-1">
              Send Alert
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StudentPerformanceCard;