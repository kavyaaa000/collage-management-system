import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  TrendingUp,
  Award,
  BarChart3,
  Target,
  Calendar,
  BookOpen,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SemesterWiseChart from '@/components/analytics/SemesterWiseChart';
import SubjectComparisonChart from '@/components/analytics/SubjectComparisonChart';
import TrendChart from '@/components/analytics/TrendChart';
import type{ StudentComprehensiveAnalytics } from '@/types/enhanced';
import { useAuthStore } from '@/store/authStore';
import studentAnalyticsService from '@/services/studentAnalyticsService';
import { toast } from 'sonner';

const StudentComprehensiveAnalyticsPage: React.FC = () => {
  const { studentId: paramStudentId } = useParams<{ studentId: string }>();
  const user = useAuthStore((state) => state.user);
  const [analytics, setAnalytics] = useState<StudentComprehensiveAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  const studentId = paramStudentId ? parseInt(paramStudentId) : user?.referenceId;

  useEffect(() => {
    if (studentId) {
      loadAnalytics();
    }
  }, [studentId]);

  const loadAnalytics = async () => {
    if (!studentId) return;

    try {
      setLoading(true);
      const data = await studentAnalyticsService.getComprehensiveAnalytics(studentId);
      setAnalytics(data);
    } catch (error) {
      toast.error('Failed to load analytics');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading comprehensive analytics...</p>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-gray-500">
          No analytics data available
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-lg">
        <h1 className="text-3xl font-bold">{analytics.studentName}</h1>
        <p className="text-blue-100 mt-1">{analytics.registerNumber}</p>
        {analytics.className && (
          <p className="text-blue-100 mt-1">{analytics.className}</p>
        )}
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Overall Attendance
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">
              {analytics.overallAttendance.toFixed(1)}%
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Trend: {analytics.trendAnalysis.attendanceTrend}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Overall Marks
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {analytics.overallAverageMarks.toFixed(1)}%
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Trend: {analytics.trendAnalysis.performanceTrend}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              CGPA
            </CardTitle>
            <Award className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">
              {analytics.cgpa.toFixed(2)}
            </div>
            <p className="text-xs text-gray-500 mt-1">Current CGPA</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Achievements
            </CardTitle>
            <Target className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">
              {analytics.achievements.length}
            </div>
            <p className="text-xs text-gray-500 mt-1">Total achievements</p>
          </CardContent>
        </Card>
      </div>

      {/* Recommendations */}
      {analytics.recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-500" />
              Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {analytics.recommendations.map((rec, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Tabs for Different Analytics Views */}
      <Tabs defaultValue="semester" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="semester">
            <Calendar className="h-4 w-4 mr-2" />
            Semester-wise
          </TabsTrigger>
          <TabsTrigger value="subjects">
            <BookOpen className="h-4 w-4 mr-2" />
            Subject Comparison
          </TabsTrigger>
          <TabsTrigger value="trends">
            <TrendingUp className="h-4 w-4 mr-2" />
            Trends
          </TabsTrigger>
          <TabsTrigger value="achievements">
            <Award className="h-4 w-4 mr-2" />
            Achievements
          </TabsTrigger>
        </TabsList>

        {/* Semester-wise Analytics */}
        <TabsContent value="semester">
          <Card>
            <CardHeader>
              <CardTitle>Semester-wise Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <SemesterWiseChart data={analytics.semesterAnalytics} />
              
              <div className="mt-6 space-y-4">
                {analytics.semesterAnalytics.map((semester) => (
                  <div key={semester.semesterId} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-lg">
                        Semester {semester.semesterNo}
                      </h3>
                      <div className="flex gap-4">
                        <Badge variant="outline">
                          SGPA: {semester.sgpa.toFixed(2)}
                        </Badge>
                        {semester.classRank && (
                          <Badge variant="secondary">
                            Rank: {semester.classRank}
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="text-center p-3 bg-blue-50 rounded">
                        <p className="text-2xl font-bold text-blue-600">
                          {semester.attendancePercentage.toFixed(1)}%
                        </p>
                        <p className="text-xs text-gray-600">Attendance</p>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded">
                        <p className="text-2xl font-bold text-green-600">
                          {semester.averageMarks.toFixed(1)}%
                        </p>
                        <p className="text-xs text-gray-600">Avg Marks</p>
                      </div>
                      <div className="text-center p-3 bg-purple-50 rounded">
                        <p className="text-2xl font-bold text-purple-600">
                          {semester.subjects.length}
                        </p>
                        <p className="text-xs text-gray-600">Subjects</p>
                      </div>
                      <div className="text-center p-3 bg-yellow-50 rounded">
                        <p className="text-2xl font-bold text-yellow-600">
                          {semester.sgpa.toFixed(2)}
                        </p>
                        <p className="text-xs text-gray-600">SGPA</p>
                      </div>
                    </div>

                    {/* Subject Details */}
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left p-2">Subject</th>
                            <th className="text-center p-2">Attendance</th>
                            <th className="text-center p-2">Int 1</th>
                            <th className="text-center p-2">Int 2</th>
                            <th className="text-center p-2">Int 3</th>
                            <th className="text-center p-2">Average</th>
                            <th className="text-center p-2">Trend</th>
                          </tr>
                        </thead>
                        <tbody>
                          {semester.subjects.map((subject, idx) => (
                            <tr key={idx} className="border-b hover:bg-gray-50">
                              <td className="p-2">
                                <p className="font-medium">{subject.subjectName}</p>
                                <p className="text-xs text-gray-500">{subject.subjectCode}</p>
                              </td>
                              <td className="text-center p-2">
                                <span className={`font-semibold ${
                                  subject.attendance >= 75 ? 'text-green-600' : 'text-red-600'
                                }`}>
                                  {subject.attendance.toFixed(1)}%
                                </span>
                              </td>
                              <td className="text-center p-2">{subject.internal1.toFixed(0)}</td>
                              <td className="text-center p-2">{subject.internal2.toFixed(0)}</td>
                              <td className="text-center p-2">{subject.internal3.toFixed(0)}</td>
                              <td className="text-center p-2">
                                <span className="font-semibold">{subject.average.toFixed(1)}</span>
                              </td>
                              <td className="text-center p-2">
                                <Badge
                                  variant={
                                    subject.trend === 'IMPROVING'
                                      ? 'default'
                                      : subject.trend === 'DECLINING'
                                      ? 'destructive'
                                      : 'secondary'
                                  }
                                >
                                  {subject.trend}
                                </Badge>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Subject Comparison */}
        <TabsContent value="subjects">
          <Card>
            <CardHeader>
              <CardTitle>Subject-wise Comparison with Class</CardTitle>
            </CardHeader>
            <CardContent>
              <SubjectComparisonChart data={analytics.subjectComparisons} />

              <div className="mt-6 space-y-3">
                {analytics.subjectComparisons.map((subject, idx) => (
                  <div key={idx} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-semibold">{subject.subjectName}</h4>
                        <p className="text-sm text-gray-500">
                          {subject.subjectCode} • Semester {subject.semesterId}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Badge
                          variant={subject.aboveAverage ? 'default' : 'secondary'}
                        >
                          {subject.performanceCategory}
                        </Badge>
                        <Badge variant="outline">
                          Rank: {subject.studentRank}
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="text-center p-2 bg-blue-50 rounded">
                        <p className="text-sm font-semibold text-blue-600">
                          {subject.studentMarks.toFixed(1)}%
                        </p>
                        <p className="text-xs text-gray-600">Your Marks</p>
                      </div>
                      <div className="text-center p-2 bg-gray-50 rounded">
                        <p className="text-sm font-semibold text-gray-600">
                          {subject.classAvgMarks.toFixed(1)}%
                        </p>
                        <p className="text-xs text-gray-600">Class Avg</p>
                      </div>
                      <div className="text-center p-2 bg-green-50 rounded">
                        <p className="text-sm font-semibold text-green-600">
                          {subject.classHighest.toFixed(1)}%
                        </p>
                        <p className="text-xs text-gray-600">Highest</p>
                      </div>
                      <div className="text-center p-2 bg-purple-50 rounded">
                        <p className="text-sm font-semibold text-purple-600">
                          {subject.percentile.toFixed(1)}th
                        </p>
                        <p className="text-xs text-gray-600">Percentile</p>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-3">
                      <div className="flex justify-between text-xs text-gray-600 mb-1">
                        <span>0%</span>
                        <span>Class Avg: {subject.classAvgMarks.toFixed(1)}%</span>
                        <span>100%</span>
                      </div>
                      <div className="relative h-3 bg-gray-200 rounded-full">
                        <div
                          className="absolute h-full bg-blue-500 rounded-full"
                          style={{ width: `${subject.studentMarks}%` }}
                        />
                        <div
                          className="absolute h-full w-1 bg-red-500"
                          style={{ left: `${subject.classAvgMarks}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Trends */}
        <TabsContent value="trends">
          <Card>
            <CardHeader>
              <CardTitle>Performance Trends Across Semesters</CardTitle>
            </CardHeader>
            <CardContent>
              <TrendChart data={analytics.trendAnalysis.semesterTrends} />

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-blue-500" />
                    Attendance Trend
                  </h4>
                  <Badge
                    variant={
                      analytics.trendAnalysis.attendanceTrend === 'IMPROVING'
                        ? 'default'
                        : analytics.trendAnalysis.attendanceTrend === 'DECLINING'
                        ? 'destructive'
                        : 'secondary'
                    }
                    className="mb-3"
                  >
                    {analytics.trendAnalysis.attendanceTrend}
                  </Badge>
                  <p className="text-sm text-gray-600">
                    Your attendance trend shows a{' '}
                    {analytics.trendAnalysis.attendanceTrend.toLowerCase()} pattern
                    across semesters.
                  </p>
                </div>

                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-500" />
                    Performance Trend
                  </h4>
                  <Badge
                    variant={
                      analytics.trendAnalysis.performanceTrend === 'IMPROVING'
                        ? 'default'
                        : analytics.trendAnalysis.performanceTrend === 'DECLINING'
                        ? 'destructive'
                        : 'secondary'
                    }
                    className="mb-3"
                  >
                    {analytics.trendAnalysis.performanceTrend}
                  </Badge>
                  <p className="text-sm text-gray-600">
                    Your academic performance shows a{' '}
                    {analytics.trendAnalysis.performanceTrend.toLowerCase()} trend
                    over time.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Achievements */}
        <TabsContent value="achievements">
          <Card>
            <CardHeader>
              <CardTitle>Your Achievements</CardTitle>
            </CardHeader>
            <CardContent>
              {analytics.achievements.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Award className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <p>No achievements yet. Keep working hard!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {analytics.achievements.map((achievement, idx) => (
                    <div
                      key={idx}
                      className="border-2 border-yellow-200 bg-yellow-50 rounded-lg p-4"
                    >
                      <div className="flex items-start gap-3">
                        <Award className="h-8 w-8 text-yellow-500 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-lg mb-1">
                            {achievement.title}
                          </h4>
                          <p className="text-sm text-gray-700 mb-2">
                            {achievement.description}
                          </p>
                          <div className="flex gap-2">
                            <Badge variant="secondary">
                              Semester {achievement.semesterId}
                            </Badge>
                            <Badge variant="outline">
                              Rank: {achievement.rank}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StudentComprehensiveAnalyticsPage;