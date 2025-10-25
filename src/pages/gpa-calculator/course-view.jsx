import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import useStore from "@/store";
import AppLayout from "@/components/layout";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PlusCircle, Trash2, Pencil } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const CourseView = () => {
  const navigate = useNavigate();
  const { semesterIndex: semesterIndexParam } = useParams();
  const semesterIndex = parseInt(semesterIndexParam, 10);

  const [semesterGPA, setSemesterGPA] = useState("0.00");
  const {
    gpaCalculator: { semesters },
    addCourseToSemester,
    updateCourseInSemester,
    removeSemester,
  } = useStore();

  const semester =
    Array.isArray(semesters) &&
    semesterIndex >= 0 &&
    semesterIndex < semesters.length
      ? semesters[semesterIndex]
      : null;

  const [form, setForm] = useState({ name: "", credits: "", marks: "" });
  const [editIdx, setEditIdx] = useState(null); // index of course being edited
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  // Grading helpers
  const gradingScale = (marks) => {
    marks = Number(marks);
    if (isNaN(marks)) return 0.0;
    if (marks >= 85) return 4.0;
    if (marks >= 80) return 3.8;
    if (marks >= 75) return 3.4;
    if (marks >= 71) return 3.0;
    if (marks >= 68) return 2.8;
    if (marks >= 64) return 2.4;
    if (marks >= 61) return 2.0;
    if (marks >= 57) return 1.8;
    if (marks >= 53) return 1.4;
    if (marks >= 45) return 1.0;
    return 0.0;
  };

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

  const getGradeColor = (gradeLetter) => {
    switch (gradeLetter) {
      case "A+":
      case "A":
      case "A−":
      case "B+":
      case "B":
        return "bg-green-500 hover:bg-green-600";
      case "B−":
        return "bg-orange-500 hover:bg-orange-600";
      case "C+":
      case "C":
      case "C−":
      case "D+":
      case "D":
      case "F":
        return "bg-red-500 hover:bg-red-600";
      default:
        return "bg-gray-400 hover:bg-gray-500";
    }
  };

  // Calculate Semester GPA when semester changes
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
    const calculatedGPA =
      totalCredits > 0 ? (totalQP / totalCredits).toFixed(2) : "0.00";
    setSemesterGPA(isNaN(parseFloat(calculatedGPA)) ? "0.00" : calculatedGPA);
  }, [semester]);

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

    addCourseToSemester(semesterIndex, {
      name: form.name,
      credits: creditsNum,
      marks: marksNum,
    });
    setForm({ name: "", credits: "", marks: "" });
  };

  // Edit course logic
  const handleEditCourse = (idx) => {
    const course = semester.courses[idx];
    setForm({
      name: course.name,
      credits: String(course.credits),
      marks: String(course.marks),
    });
    setEditIdx(idx);
    setEditDialogOpen(true);
  };

  const handleUpdateCourse = () => {
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
    updateCourseInSemester(semesterIndex, editIdx, {
      name: form.name,
      credits: creditsNum,
      marks: marksNum,
    });
    setEditDialogOpen(false);
    setEditIdx(null);
    setForm({ name: "", credits: "", marks: "" });
  };

  // Delete semester logic
  const handleDeleteSemester = () => {
    if (
      window.confirm(
        "Are you sure you want to delete this semester and all its courses?"
      )
    ) {
      removeSemester(semesterIndex);
      navigate("/gpa-calculator");
    }
  };

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

  const gpaProgress = (parseFloat(semesterGPA) / 4.0) * 100;

  return (
    <AppLayout>
      <div className="p-10 md:p-14 ">
        <div className="pl-4 mx-auto mb-2 max-w-[900px] flex items-center justify-between">
          <h1 className="text-[32px] font-semibold font-poppins  text-black/80">
            {semester.name || `Semester ${Number(semesterIndex) + 1}`}
          </h1>
          <button
            title="Delete Semester"
            onClick={handleDeleteSemester}
            className="ml-4 p-2 rounded-full hover:bg-red-100"
          >
            <Trash2 className="w-6 h-6 text-red-500" />
          </button>
        </div>
        <Separator className={"max-w-[900px] !h-[2px] mx-auto"} />
        <div className="mx-auto space-y-10 mt-12">
          <div className="max-w-[800px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {semester.courses?.map((course, idx) => {
              const grade = gradingLetter(course.marks);
              const colorClass = getGradeColor(grade);
              return (
                <div
                  key={idx}
                  className={`relative flex items-center justify-between px-8 p-6 rounded-2xl text-white shadow-xl ${colorClass} transition-colors min-h-[120px]`}
                >
                  {/* Edit icon top right */}
                  <button
                    title="Edit Course"
                    onClick={() => handleEditCourse(idx)}
                    className="absolute top-2 cursor-pointer right-2.5 p-1 rounded-full bg-white/70 hover:bg-white"
                  >
                    <Pencil className="w-4.5 h-4.5 text-black/60 " />
                  </button>
                  <div className="flex flex-col text-left space-y-1">
                    <span
                      className="font-semibold text-2xl truncate"
                      title={course.name}
                    >
                      {course.name}
                    </span>
                    <span className="text-lg opacity-90">
                      {course.credits} Credits
                    </span>
                    <span className="text-lg opacity-90">
                      {course.marks} Marks
                    </span>
                  </div>
                  <div className="text-right pl-4">
                    <span className="font-bold font-poppins text-6xl">
                      {grade}
                    </span>
                  </div>
                </div>
              );
            })}

            {/* Placeholder to add a course */}
            <Dialog>
              <DialogTrigger asChild>
                <div className="flex items-center justify-center p-6 rounded-2xl bg-gray-50 border-2 border-dashed border-gray-200 cursor-pointer hover:bg-gray-100 min-h-[120px]">
                  <div className="text-center">
                    <PlusCircle className="mx-auto w-8 h-8 text-green-600 mb-2" />
                    <div className="font-semibold text-lg text-gray-700">
                      Add Course
                    </div>
                    <div className="text-sm text-gray-500">Click to add</div>
                  </div>
                </div>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    Add Course to{" "}
                    {semester.name || `Semester ${Number(semesterIndex) + 1}`}
                  </DialogTitle>
                  <DialogDescription>
                    Enter the course details below.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="course-name" className="text-right">
                      Name
                    </Label>
                    <Input
                      id="course-name"
                      placeholder="e.g., Calculus"
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
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
                      onChange={(e) =>
                        setForm({ ...form, credits: e.target.value })
                      }
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
                      onChange={(e) =>
                        setForm({ ...form, marks: e.target.value })
                      }
                      className="col-span-3"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <DialogClose asChild>
                    <Button onClick={handleAddCourse}>Add Course</Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Edit Course Dialog */}
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Course</DialogTitle>
              <DialogDescription>
                Update the course details below.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-course-name" className="text-right">
                  Name
                </Label>
                <Input
                  id="edit-course-name"
                  placeholder="e.g., Calculus"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-course-credits" className="text-right">
                  Credits
                </Label>
                <Input
                  id="edit-course-credits"
                  placeholder="e.g., 3"
                  type="number"
                  min="1"
                  step="1"
                  value={form.credits}
                  onChange={(e) =>
                    setForm({ ...form, credits: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-course-marks" className="text-right">
                  Marks
                </Label>
                <Input
                  id="edit-course-marks"
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
            <DialogFooter>
              <DialogClose asChild>
                <Button
                  variant="outline"
                  onClick={() => setEditDialogOpen(false)}
                >
                  Cancel
                </Button>
              </DialogClose>
              <DialogClose asChild>
                <Button onClick={handleUpdateCourse}>Update Course</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
};

export default CourseView;
