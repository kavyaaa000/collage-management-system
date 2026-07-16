import React, { useState, useEffect } from 'react';
import { BarChart3, Users, TrendingUp, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ClassSelector from '@/components/class/ClassSelector';
import SubjectAnalyticsChart from '@/components/analytics/SubjectAnalyticsChart';
import PerformanceDistributionChart from '@/components/analytics/PerformanceDistributionChart';
import AttendanceComparisonChart from '@/components/analytics/AttendanceComparisonChart';
import TopPerformersTable from '@/components/analytics/TopPerformersTable';
import type{ ClassInfo, ClassAnalytics } from '@/types/enhanced';
import classService from '@/services/classService';
import { toast } from 'sonner';

const ClassAnalyticsPage: React.FC = () => {
  const [selectedClass, setSelectedClass] = useState<ClassInfo | null>(null);
  const [analytics, setAnalytics] = useState<ClassAnalytics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (selectedClass) {
      loadAnalytics();
    }
  }, [selectedClass]);

  const loadAnalytics = async () => {
    if (!selectedClass) return;

    try {
      setLoading(true);
      setError(null);
      
      console.log('Loading analytics for class:', selectedClass.classId);
      
      const data = await classService.getClassAnalytics(selectedClass.classId, 25);
      
      console.log('Analytics data received:', data);
      
      setAnalytics(data);
      toast.success('Analytics loaded successfully');
    } catch (error: any) {
      console.error('Failed to load analytics:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to load analytics';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Class Analytics</h1>
        <p className="text-gray-500 mt-1">Comprehensive class performance insights</p>
      </div>

      {/* Class Selector */}
      <ClassSelector
        onClassSelect={setSelectedClass}
        selectedClassId={selectedClass?.classId}
      />

      {/* Error Display */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="py-4">
            <div className="flex items-center gap-2 text-red-700">
              <AlertCircle className="h-5 w-5" />
              <p>Error: {error}</p>
            </div>
            <p className="text-sm text-red-600 mt-2">
              Please check the browser console for more details
            </p>
          </CardContent>
        </Card>
      )}

      {loading && (
        <Card>
          <CardContent className="py-12 text-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-500">Loading analytics...</p>
          </CardContent>
        </Card>
      )}

      {!loading && !error && analytics && (
        <>
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Total Students
                </CardTitle>
                <Users className="h-4 w-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.totalStudents}</div>
                <p className="text-xs text-gray-500 mt-1">In this class</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Avg Attendance
                </CardTitle>
                <BarChart3 className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {analytics.avgClassAttendance?.toFixed(1) || '0.0'}%
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Range: {analytics.minAttendance?.toFixed(1) || '0'}% - {analytics.maxAttendance?.toFixed(1) || '0'}%
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Avg Performance
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {analytics.avgClassMarks?.toFixed(1) || '0.0'}%
                </div>
                <p className="text-xs text-gray-500 mt-1">Class average</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  At Risk
                </CardTitle>
                <AlertCircle className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {analytics.studentsBelow75Attendance || 0}
                </div>
                <p className="text-xs text-gray-500 mt-1">Below 75% attendance</p>
              </CardContent>
            </Card>
          </div>

          {/* Charts and Analytics */}
          {analytics.subjectAnalytics && analytics.subjectAnalytics.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Subject-wise Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <SubjectAnalyticsChart data={analytics.subjectAnalytics} />
              </CardContent>
            </Card>
          )}

          {analytics.performanceDistribution && analytics.performanceDistribution.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Performance Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <PerformanceDistributionChart data={analytics.performanceDistribution} />
              </CardContent>
            </Card>
          )}

          {analytics.topPerformers && analytics.topPerformers.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Top Performers</CardTitle>
              </CardHeader>
              <CardContent>
                <TopPerformersTable students={analytics.topPerformers} />
              </CardContent>
            </Card>
          )}
        </>
      )}

      {!loading && !error && !analytics && selectedClass && (
        <Card>
          <CardContent className="py-12 text-center text-gray-500">
            <p>No analytics data available for this class</p>
            <p className="text-sm mt-2">Try selecting a different class or check if data exists in the database</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ClassAnalyticsPage;