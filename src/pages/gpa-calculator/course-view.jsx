import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
  SheetFooter,
  SheetDescription,
} from "@/components/ui/sheet";
import useStore from "@/store";
import AppLayout from "@/components/layout";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PlusCircle } from "lucide-react";

const CourseView = () => {
  const navigate = useNavigate();
  const { semesterIndex } = useParams();
  const [semesterGPA, setSemesterGPA] = useState("0.00");
  const {
    gpaCalculator: { semesters },
    addCourseToSemester,
  } = useStore();

  // Ensure semesterIndex is valid
  const semester =
    semesters && semesterIndex >= 0 && semesterIndex < semesters.length
      ? semesters[semesterIndex]
      : null;

  const [form, setForm] = useState({
    name: "",
    credits: "",
    marks: "",
  });

  // Calculate Semester GPA
  useEffect(() => {
    if (!semester?.courses?.length) {
      setSemesterGPA("0.00");
      return;
    }
    let totalQP = 0;
    let totalCredits = 0;
    semester.courses.forEach((course) => {
      const creditsNum = Number(course.credits);
      const marksNum = Number(course.marks);
      if (!isNaN(creditsNum) && !isNaN(marksNum) && creditsNum > 0) {
        totalQP += gradingScale(marksNum) * creditsNum;
        totalCredits += creditsNum;
      }
    });
    const calculatedGPA = totalCredits > 0 ? (totalQP / totalCredits).toFixed(2) : "0.00";
    setSemesterGPA(isNaN(parseFloat(calculatedGPA)) ? "0.00" : calculatedGPA);
  }, [semester]); // Dependency: semester object

  // Grading scale for GPA points calculation
  const gradingScale = (marks) => {
    marks = Number(marks);
    if (isNaN(marks)) return 0.0;
    if (marks >= 85) return 4.0; // A+, A
    if (marks >= 80) return 3.8; // A−
    if (marks >= 75) return 3.4; // B+
    if (marks >= 71) return 3.0; // B
    if (marks >= 68) return 2.8; // B−
    if (marks >= 64) return 2.4; // C+
    if (marks >= 61) return 2.0; // C
    if (marks >= 57) return 1.8; // C−
    if (marks >= 53) return 1.4; // D+
    if (marks >= 45) return 1.0; // D
    return 0.0; // F
  };

  // Grade letters for display
  const gradingLetter = (marks) => {
    marks = Number(marks);
    if (isNaN(marks)) return "N/A";
    if (marks >= 90) return "A+";
    if (marks >= 85) return "A";
    if (marks >= 80) return "A−";
    if (marks >= 75) return "B+";
    if (marks >= 71) return "B";
    if (marks >= 68) return "B−";
    if (marks >= 64) return "C+";
    if (marks >= 61) return "C";
    if (marks >= 57) return "C−";
    if (marks >= 53) return "D+";
    if (marks >= 45) return "D";
    return "F";
  };

  // Get background color based on grade letter
  const getGradeColor = (gradeLetter) => {
    switch (gradeLetter) {
      case "A+":
      case "A":
      case "A−":
      case "B+":
      case "B":
        return "bg-green-500 hover:bg-green-600";
      case "B−": // Orange for B-
        return "bg-orange-500 hover:bg-orange-600";
      case "C+":
      case "C":
      case "C−": // Red for C and lower
      case "D+":
      case "D":
      case "F":
        return "bg-red-500 hover:bg-red-600";
      default:
        return "bg-gray-400 hover:bg-gray-500";
    }
  };

  // Add course to semester state
  const handleAddCourse = () => {
    if (!form.name || !form.credits || !form.marks) {
      alert("Please fill in all course details.");
      return;
    }
    const creditsNum = Number(form.credits);
    const marksNum = Number(form.marks);

    if (isNaN(creditsNum) || creditsNum <= 0 || !Number.isInteger(creditsNum)) {
      alert("Please enter a valid positive integer for credit hours.");
      return;
    }
    if (isNaN(marksNum) || marksNum < 0 || marksNum > 100) {
      alert("Please enter marks between 0 and 100.");
      return;
    }

    addCourseToSemester(parseInt(semesterIndex), {
      name: form.name,
      credits: creditsNum,
      marks: marksNum,
    });
    setForm({ name: "", credits: "", marks: "" });
  };

  // Handle case where semester data isn't found
  if (!semester) {
    return (
      <AppLayout>
        <div className="p-6 text-center">
          <p className="text-red-600 font-semibold mb-4">
            Semester {Number(semesterIndex) + 1} not found.
          </p>
          <Button onClick={() => navigate("/gpa-calculator")}>
            Go Back to Semesters
          </Button>
        </div>
      </AppLayout>
    );
  }

  // Calculate progress for the bar (0 to 4.0 scale)
  const gpaProgress = (parseFloat(semesterGPA) / 4.0) * 100;

  return (
    <AppLayout>
      {/* Removed max-width here, added width and mx-auto below */}
      <div className="p-12 md:p-16 space-y-12">
        {/* Header Section - Kept centered */}
        <div className="text-center space-y-6 max-w-xl mx-auto"> {/* Centered header content */}
          <h1 className="text-5xl font-bold text-gray-800">Calculate Your GPA</h1>
          <div className="flex justify-between items-center px-4">
            <span className="text-2xl font-medium text-gray-600">
              {semester.name || `Semester ${Number(semesterIndex) + 1}`}
            </span>
            <span className="text-4xl font-bold text-green-600">{semesterGPA}</span>
          </div>
          <div className="bg-gray-200 rounded-full h-4 dark:bg-gray-700">
            <div
              className="bg-green-500 h-4 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${gpaProgress}%` }}
            ></div>
          </div>
        </div>

        {/* Bordered Container - Applied width w-[70%] and mx-auto */}
        <div className="w-[70%] mx-auto border-t-2 border-b-2 border-green-500 py-12 space-y-10">
          {/* Courses Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {semester.courses?.map((course, idx) => {
              const grade = gradingLetter(course.marks);
              const colorClass = getGradeColor(grade);
              return (
                <div
                  key={idx}
                  className={`flex items-center justify-between p-6 rounded-2xl text-white shadow-xl ${colorClass} transition-colors min-h-[120px]`}
                >
                  <div className="flex flex-col text-left space-y-1">
                    <span className="font-semibold text-2xl truncate" title={course.name}>
                      {course.name}
                    </span>
                    <span className="text-lg opacity-90">{course.credits} Credits</span>
                    <span className="text-lg opacity-90">{course.marks} Marks</span>
                  </div>
                  <div className="text-right pl-4">
                    <span className="font-bold text-6xl">{grade}</span>
                    <span className="block text-base opacity-90 -mt-1">Grade</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Add Course Button */}
          <div className="text-center mt-6">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="border-green-500 border-2 text-green-600 hover:bg-green-50 hover:text-green-700 font-semibold py-4 px-10 rounded-lg shadow-lg text-lg transform hover:scale-105 transition-transform">
                  <PlusCircle className="w-7 h-7 mr-3" />
                  Add a Course
                </Button>
              </SheetTrigger>
              {/* Sheet content remains the same */}
               <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Add Course to {semester.name || `Semester ${Number(semesterIndex) + 1}`}</SheetTitle>
                    <SheetDescription>
                      Enter the course details below.
                    </SheetDescription>
                  </SheetHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="course-name" className="text-right">
                        Name
                      </Label>
                      <Input
                        id="course-name"
                        placeholder="e.g., Calculus"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="course-credits" className="text-right">
                        Credits
                      </Label>
                      <Input
                        id="course-credits"
                        placeholder="e.g., 3"
                        type="number"
                        min="1"
                        step="1"
                        value={form.credits}
                        onChange={(e) => setForm({ ...form, credits: e.target.value })}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="course-marks" className="text-right">
                        Marks
                      </Label>
                      <Input
                         id="course-marks"
                         placeholder="0-100"
                         type="number"
                         min="0"
                         max="100"
                         value={form.marks}
                         onChange={(e) => setForm({ ...form, marks: e.target.value })}
                         className="col-span-3"
                       />
                    </div>
                  </div>
                  <SheetFooter>
                    <SheetClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </SheetClose>
                    <SheetClose asChild>
                       <Button onClick={handleAddCourse}>Add Course</Button>
                    </SheetClose>
                  </SheetFooter>
                </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default CourseView;