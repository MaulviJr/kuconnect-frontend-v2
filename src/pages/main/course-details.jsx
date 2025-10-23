import AppLayout from "@/components/layout";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { CloudUpload, PlayCircle, FileText, HelpCircle } from "lucide-react";

export default function CourseDetails() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const options = [
    {
      label: "Lecture Notes",
      path: "notes",
      icon: <FileText className="w-8 h-8 text-white" />,
    },
    {
      label: "Video Lectures",
      path: "lectures",
      icon: <PlayCircle className="w-8 h-8 text-white" />,
    },
    // {
    //   label: "Prepare From Past Papers",
    //   path: "past-papers",
    //   icon: <FileText className="w-8 h-8 text-white" />,
    // },
    // {
    //   label: "Test Yourself With Quizzes",
    //   path: "quizzes",
    //   icon: <HelpCircle className="w-8 h-8 text-white" />,
    // },
  ];

  return (
    <AppLayout>
      <div className="flex flex-col items-center text-center py-10">
        <h1 className="text-3xl font-bold text-primary">
          What Do You Want to Do?
        </h1>

        <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-6 mt-10 w-full px-10 max-w-4xl">
          {options.map((opt) => (
            <Card
              key={opt.label}
              onClick={() => navigate(`/courses/${courseId}/${opt.path}`)}
              className="cursor-pointer hover:shadow-lg transition rounded-2xl overflow-hidden">
              <CardContent className="flex items-center justify-start p-6">
                <div className="bg-primary flex items-center justify-center p-4 rounded-xl">
                  {opt.icon}
                </div>
                <span className="ml-4 text-lg font-semibold text-primary text-left">
                  {opt.label}
                </span>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
