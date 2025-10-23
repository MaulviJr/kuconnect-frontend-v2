import useStore from "@/store";
import AppLayout from "@/components/layout";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, courses } = useStore((state) => state.auth);

  // No need for loading state or API calls - courses come from auth state

  return (
    <AppLayout>
      <div className="flex flex-col items-center text-center py-10">
        <h1 className="text-3xl font-bold text-primary">
          Welcome Back, {user?.name || "Student"}
        </h1>
        <p className="text-muted-foreground mt-2">
          These are the Courses Of Your Semester.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10 w-full px-10">
          {courses.map((course) => (
            <Card
              key={course.id}
              className="cursor-pointer hover:shadow-lg transition"
              onClick={() => navigate(`/courses/${course.id}/details`)}>
              <CardContent className="p-6">
                <div className="flex flex-col text-left space-y-1">
                  {/* Course Code */}
                  <span className="text-sm font-semibold text-muted-foreground">
                    {course.code}
                  </span>

                  {/* Course Title */}
                  <span className="text-2xl font-bold text-primary">
                    {course.title}
                  </span>

                  {/* Course Description */}
                  <span className="text-sm text-muted-foreground">
                    {course.description}
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
