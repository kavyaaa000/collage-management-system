import React, { useEffect, useState } from 'react';
import { GraduationCap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type{ ClassInfo } from '@/types/enhanced';
import classService from '@/services/classService';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'sonner';

interface ClassSelectorProps {
  onClassSelect: (classInfo: ClassInfo) => void;
  selectedClassId?: number;
}

const ClassSelector: React.FC<ClassSelectorProps> = ({ onClassSelect, selectedClassId }) => {
  const user = useAuthStore((state) => state.user);
  const [classes, setClasses] = useState<ClassInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadClasses();
  }, [user]);

  const loadClasses = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const data = user.userType === 'HOD' 
        ? await classService.getAllClasses()
        : await classService.getStaffClasses(user.referenceId);
      setClasses(data);
      
      // Auto-select first class if none selected
      if (data.length > 0 && !selectedClassId) {
        onClassSelect(data[0]);
      }
    } catch (error) {
      toast.error('Failed to load classes');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-gray-500 mt-2">Loading classes...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GraduationCap className="h-5 w-5" />
          Select Class
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {classes.map((classInfo) => (
            <button
              key={classInfo.classId}
              onClick={() => onClassSelect(classInfo)}
              className={`p-4 border-2 rounded-lg text-left transition-all hover:shadow-md ${
                selectedClassId === classInfo.classId
                  ? 'border-primary bg-primary/5'
                  : 'border-gray-200 hover:border-primary/50'
              }`}
            >
              <h3 className="font-semibold text-lg mb-2">{classInfo.className}</h3>
              <div className="space-y-1 text-sm text-gray-600">
                <p>Students: {classInfo.totalStudents}</p>
                {classInfo.averageAttendance && (
                  <p>Avg Attendance: {classInfo.averageAttendance.toFixed(1)}%</p>
                )}
                {classInfo.averageMarks && (
                  <p>Avg Marks: {classInfo.averageMarks.toFixed(1)}%</p>
                )}
              </div>
            </button>
          ))}
        </div>

        {classes.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <GraduationCap className="h-12 w-12 mx-auto mb-2 text-gray-400" />
            <p>No classes assigned</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ClassSelector;