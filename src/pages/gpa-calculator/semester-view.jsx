import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose,
  SheetDescription,
} from "@/components/ui/sheet";
import useStore from "@/store";
import AppLayout from "@/components/layout";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const SemesterView = () => {
  const navigate = useNavigate();
  const { gpaCalculator, setCGPA, addSemester } = useStore();
  const { semesters, cgpa } = gpaCalculator;

  const [form, setForm] = useState({
    name: "",
    year: "",
  });

  useEffect(() => {
    if (!semesters.length) {
      setCGPA(0);
      return;
    }
    let totalQualityPoints = 0;
    let totalCredits = 0;

    semesters.forEach((sem) => {
      let semGPA = 0;
      if (sem.courses && sem.courses.length > 0) {
        const points = sem.courses.reduce(
          (acc, c) => acc + calculateGPA(c.marks) * c.credits,
          0
        );
        const creds = sem.courses.reduce((acc, c) => acc + c.credits, 0);
        semGPA = creds ? points / creds : 0;
      }
      totalQualityPoints += semGPA * sem.totalCredits;
      totalCredits += sem.totalCredits;
    });

    const newCGPA = totalCredits
      ? (totalQualityPoints / totalCredits).toFixed(2)
      : 0;
    setCGPA(newCGPA);
  }, [semesters, setCGPA]);

  const calculateSemesterGPA = (sem) => {
    if (!sem.courses?.length) return 0;
    let totalQP = 0;
    let totalCredits = 0;
    sem.courses.forEach((c) => {
      totalQP += calculateGPA(c.marks) * c.credits;
      totalCredits += c.credits;
    });
    return (totalQP / totalCredits).toFixed(2);
  };

  const calculateGPA = (marks) => {
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

  const handleAddSemester = () => {
    addSemester({
      ...form,
      numberOfCourses: 0,
      totalCredits: 0,
      courses: [],
    });
    setForm({ name: "", year: "" });
  };

  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">GPA Calculator</h1>
          <Sheet>
            <SheetTrigger asChild>
              <Button>Add Semester</Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Add Semester</SheetTitle>
                <SheetDescription>
                  Fill in the details of your semester below.
                </SheetDescription>
              </SheetHeader>
              <div className="grid flex-1 auto-rows-min gap-6 px-4">
                <div className="grid gap-3">
                  <Label>Semester Name</Label>
                  <Input
                    placeholder="e.g. Spring"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>
                <div className="grid gap-3">
                  <Label>Year</Label>
                  <Input
                    placeholder="e.g. 2025"
                    value={form.year}
                    onChange={(e) => setForm({ ...form, year: e.target.value })}
                  />
                </div>
              </div>
              <SheetFooter>
                <SheetClose asChild>
                  <Button onClick={handleAddSemester}>Add</Button>
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
            CGPA: <span className="text-lg">{cgpa || 0}</span>
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {semesters.map((sem, index) => (
            <Card
              key={index}
              className="cursor-pointer hover:shadow-lg transition"
              onClick={() => navigate(`/gpa-calculator/${index}`)}>
              <CardHeader>
                <CardTitle>{sem.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Year: {sem.year}</p>
                <p>Courses: {sem.numberOfCourses}</p>
                <p>Total Credits: {sem.totalCredits}</p>
                <p>Semester GPA: {calculateSemesterGPA(sem)}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
};

export default SemesterView;
