import React, { useEffect, useState } from 'react';
import { Trophy, Medal, Award, TrendingUp, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { TopPerformer } from '@/types/enhanced';
import { useAuthStore } from '@/store/authStore';
import topPerformerService from '@/services/topPerformerService';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const TopPerformersPage: React.FC = () => {
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();
  const [overallToppers, setOverallToppers] = useState<TopPerformer[]>([]);
  const [attendanceStars, setAttendanceStars] = useState<TopPerformer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadTopPerformers();
    }
  }, [user]);

  const loadTopPerformers = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      const classId = user.userType === 'STUDENT' 
        ? (user as any).classId || 1  // Get from student's class
        : 1;

      const [overall, attendance] = await Promise.all([
        topPerformerService.getTopPerformers(classId, user.semesterId || 1, 25),
        topPerformerService.getTopPerformersByCategory(classId, 'ATTENDANCE_STAR'),
      ]);

      // Filter only overall toppers
      setOverallToppers(overall.filter(p => p.category === 'OVERALL_TOPPER'));
      setAttendanceStars(attendance);
    } catch (error) {
      toast.error('Failed to load top performers');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-8 w-8 text-yellow-500" />;
      case 2:
        return <Medal className="h-8 w-8 text-gray-400" />;
      case 3:
        return <Award className="h-8 w-8 text-orange-500" />;
      default:
        return (
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
            <span className="font-bold text-blue-600">{rank}</span>
          </div>
        );
    }
  };

  const handleViewProfile = (studentId: number) => {
    navigate(`/student-analytics/${studentId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading top performers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-500 text-white p-8 rounded-lg">
        <div className="flex items-center gap-4 mb-4">
          <Trophy className="h-12 w-12" />
          <div>
            <h1 className="text-3xl font-bold">Top Performers</h1>
            <p className="text-yellow-100 mt-1">
              Celebrating excellence and achievement
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overall" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="overall">
            <Trophy className="h-4 w-4 mr-2" />
            Overall Toppers
          </TabsTrigger>
          <TabsTrigger value="attendance">
            <TrendingUp className="h-4 w-4 mr-2" />
            Attendance Stars
          </TabsTrigger>
        </TabsList>

        {/* Overall Toppers */}
        <TabsContent value="overall">
          <div className="space-y-4">
            {/* Top 3 Podium */}
            {overallToppers.length >= 3 && (
              <div className="grid grid-cols-3 gap-4 mb-8">
                {/* 2nd Place */}
                <Card className="border-2 border-gray-300">
                  <CardContent className="pt-6 text-center">
                    <Medal className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                    <h3 className="font-bold text-xl mb-1">
                      {overallToppers[1]?.studentName}
                    </h3>
                    <p className="text-sm text-gray-500 mb-2">
                      {overallToppers[1]?.registerNumber}
                    </p>
                    <div className="space-y-2">
                      <div className="text-center p-2 bg-gray-50 rounded">
                        <p className="text-2xl font-bold text-gray-600">
                          {overallToppers[1]?.overallPercentage.toFixed(1)}%
                        </p>
                        <p className="text-xs text-gray-500">Overall</p>
                      </div>
                      <Badge variant="secondary" className="w-full">
                        2nd Rank
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                {/* 1st Place */}
                <Card className="border-2 border-yellow-400 bg-yellow-50 transform scale-105">
                  <CardContent className="pt-6 text-center">
                    <Trophy className="h-20 w-20 mx-auto mb-4 text-yellow-500" />
                    <h3 className="font-bold text-2xl mb-1">
                      {overallToppers[0]?.studentName}
                    </h3>
                    <p className="text-sm text-gray-500 mb-2">
                      {overallToppers[0]?.registerNumber}
                    </p>
                    <div className="space-y-2">
                      <div className="text-center p-3 bg-yellow-100 rounded">
                        <p className="text-3xl font-bold text-yellow-700">
                          {overallToppers[0]?.overallPercentage.toFixed(1)}%
                        </p>
                        <p className="text-xs text-gray-600">Overall</p>
                      </div>
                      <Badge className="w-full bg-yellow-500">
                        🏆 1st Rank
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                {/* 3rd Place */}
                <Card className="border-2 border-orange-300">
                  <CardContent className="pt-6 text-center">
                    <Award className="h-16 w-16 mx-auto mb-4 text-orange-500" />
                    <h3 className="font-bold text-xl mb-1">
                      {overallToppers[2]?.studentName}
                    </h3>
                    <p className="text-sm text-gray-500 mb-2">
                      {overallToppers[2]?.registerNumber}
                    </p>
                    <div className="space-y-2">
                      <div className="text-center p-2 bg-orange-50 rounded">
                        <p className="text-2xl font-bold text-orange-600">
                          {overallToppers[2]?.overallPercentage.toFixed(1)}%
                        </p>
                        <p className="text-xs text-gray-500">Overall</p>
                      </div>
                      <Badge variant="secondary" className="w-full">
                        3rd Rank
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Remaining Performers */}
            <Card>
              <CardHeader>
                <CardTitle>Complete Leaderboard</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {overallToppers.map((performer) => (
                    <div
                      key={performer.performerId}
                      className={`flex items-center justify-between p-4 border-2 rounded-lg transition-all hover:shadow-md ${
                        performer.rankPosition <= 3
                          ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200'
                          : 'border-gray-200'
                      }`}
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div className="flex-shrink-0">
                          {getRankIcon(performer.rankPosition)}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-lg">
                            {performer.studentName}
                          </h4>
                          <p className="text-sm text-gray-500">
                            {performer.registerNumber}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-green-600">
                            {performer.overallPercentage.toFixed(1)}%
                          </p>
                          <p className="text-xs text-gray-500">Overall</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-blue-600">
                            {performer.attendancePercentage.toFixed(1)}%
                          </p>
                          <p className="text-xs text-gray-500">Attendance</p>
                        </div>
                        {performer.canViewProfile && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewProfile(performer.studentId)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Attendance Stars */}
        <TabsContent value="attendance">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-500" />
                Attendance Champions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {attendanceStars.map((performer, index) => (
                  <div
                    key={performer.performerId}
                    className={`p-4 border-2 rounded-lg ${
                      index === 0
                        ? 'bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200'
                        : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-2xl font-bold text-blue-600">
                          {performer.rankPosition}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-semibold">{performer.studentName}</h4>
                        <p className="text-sm text-gray-500">
                          {performer.registerNumber}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="text-center p-3 bg-blue-50 rounded">
                        <p className="text-2xl font-bold text-blue-600">
                          {performer.attendancePercentage.toFixed(1)}%
                        </p>
                        <p className="text-xs text-gray-600">Attendance</p>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded">
                        <p className="text-2xl font-bold text-green-600">
                          {performer.overallPercentage.toFixed(1)}%
                        </p>
                        <p className="text-xs text-gray-600">Overall</p>
                      </div>
                    </div>

                    {performer.canViewProfile && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewProfile(performer.studentId)}
                        className="w-full mt-3"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Profile
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TopPerformersPage;