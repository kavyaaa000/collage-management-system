import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TimetableView from '@/components/timetable/TimetableView';
import TodaySchedule from '@/components/timetable/TodaySchedule';
// import { useTimetable } from '@/hooks/useTimetable';
import { useTimetable } from "../hooks/useTimetable";

interface TimetablePageProps {
  userType: 'staff' | 'student';
  userId: number;
  semesterId: number;
  sectionId: number;
}

const TimetablePage: React.FC<TimetablePageProps> = ({
  userType,
  userId,
  semesterId,
  sectionId,
}) => {
  const { timetable, loading } = useTimetable(semesterId, sectionId);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Timetable</h1>
        <p className="text-gray-500 mt-1">View your weekly schedule</p>
      </div>

      <Tabs defaultValue="week" className="space-y-6">
        <TabsList>
          <TabsTrigger value="week">Weekly View</TabsTrigger>
          {userType === 'staff' && (
            <TabsTrigger value="today">Today's Schedule</TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="week">
          {loading ? (
            <div className="text-center py-12">Loading timetable...</div>
          ) : (
            <TimetableView timetable={timetable} />
          )}
        </TabsContent>

        {userType === 'staff' && (
          <TabsContent value="today">
            <TodaySchedule staffId={userId} />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default TimetablePage;