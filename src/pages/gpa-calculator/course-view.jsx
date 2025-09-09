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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const CourseView = () => {
  const navigate = useNavigate();
  const { semesterIndex } = useParams();
  const [semesterGPA, setSemesterGPA] = useState(0);
  const {
    gpaCalculator: { semesters },
    addCourseToSemester,
  } = useStore();
  const semester = semesters[semesterIndex];
  const [form, setForm] = useState({
    name: "",
    credits: "",
    marks: "",
  });

  useEffect(() => {
    if (!semester?.courses?.length) {
      setSemesterGPA(0);
      return;
    }
    let totalQP = 0;
    let totalCredits = 0;
    semester.courses.forEach((course) => {
      totalQP += gradingScale(course.marks) * course.credits;
      totalCredits += course.credits;
    });
    setSemesterGPA((totalQP / totalCredits).toFixed(2));
  }, [semester]);

  if (!semester) {
    return (
      <div className="p-6">
        <p>Semester not found</p>
        <Button onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    );
  }

  const gradingScale = (marks) => {
    if (marks >= 90) return 4.0;
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

  const handleAddCourse = () => {
    addCourseToSemester(parseInt(semesterIndex), {
      name: form.name,
      credits: Number(form.credits),
      marks: Number(form.marks),
    });
    setForm({ name: "", credits: "", marks: "" });
  };

  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Calculate Your GPA</h1>
          <Sheet>
            <SheetTrigger asChild>
              <Button>Add Course</Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Add Course</SheetTitle>
                <SheetDescription>
                  Enter the course information to add it to this semester.
                </SheetDescription>
              </SheetHeader>
              <div className="grid flex-1 auto-rows-min gap-6 px-4">
                <div className="grid gap-3">
                  <Label>Course Name</Label>
                  <Input
                    placeholder="Course Name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>
                <div className="grid gap-3">
                  <Label>Credit Hours</Label>
                  <Input
                    placeholder="Credit Hours"
                    type="number"
                    value={form.credits}
                    onChange={(e) =>
                      setForm({ ...form, credits: e.target.value })
                    }
                  />
                </div>
                <div className="grid gap-3">
                  <Label>Marks Obtained</Label>
                  <Input
                    placeholder="Marks Obtained (out of 100)"
                    type="number"
                    value={form.marks}
                    onChange={(e) =>
                      setForm({ ...form, marks: e.target.value })
                    }
                  />
                </div>
              </div>
              <SheetFooter>
                <SheetClose asChild>
                  <Button onClick={handleAddCourse}>Add</Button>
                </SheetClose>
                <SheetClose asChild>
                  <Button variant="outline">Cancel</Button>
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>

        <div>
          <p className="font-medium">
            Semester GPA: <span className="text-lg">{semesterGPA}</span>
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {semester.courses.map((course, idx) => (
            <Card key={idx}>
              <CardHeader>
                <CardTitle>{course.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Credits: {course.credits}</p>
                <p>Marks: {course.marks}</p>
                <p>Grade: {gradingLetter(course.marks)}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
};

export default CourseView;
