import useStore from "@/store";
import AppLayout from "@/components/layout";
import { useEffect, useState } from "react";
import { getCourses } from "@/apis/dashboard";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";

export default function Dashboard() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useStore((state) => state.auth);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await getCourses(user.department, user.semester);
        setCourses(data.courses || []);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    if (user?.department && user?.semester) {
      fetchCourses();
    }
  }, [user]);

  if (loading) {
    return <AppLayout>Loading courses...</AppLayout>;
  }

  if (error) {
    return <AppLayout>Error: {error}</AppLayout>;
  }

  return (
    <AppLayout>
      <div className="flex flex-col items-center text-center py-10">
        <h1 className="text-3xl font-bold text-primary">
          Welcome Back, {user?.firstName || "Student"}
        </h1>
        <p className="text-muted-foreground mt-2">
          These are the Courses Of Your Semester.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10 w-full px-10">
          {courses.map((course) => (
            <Card
              key={course.code}
              className="cursor-pointer hover:shadow-lg transition"
              onClick={() => navigate(`/courses/${course.code}`)}>
              <CardContent className="p-6">
                <div className="flex flex-col text-left space-y-1">
                  {/* Course Code */}
                  <span className="text-sm font-semibold text-muted-foreground">
                    {course.code}
                  </span>

                  {/* Short Name */}
                  <span className="text-2xl font-bold text-primary">
                    {course.shortName}
                  </span>

                  {/* Full Course Name */}
                  <span className="text-sm text-muted-foreground">
                    {course.name}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
