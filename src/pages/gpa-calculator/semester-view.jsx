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

const SemesterView = () => {
  const navigate = useNavigate();
  const { gpaCalculator, setCGPA, addSemester } = useStore();
  const { semesters, cgpa } = gpaCalculator;

  const [form, setForm] = useState({
    name: "",
    year: "",
  });

  // Total number of semesters to display
  const totalSemesters = 8;

  useEffect(() => {
    if (!semesters.length) {
      setCGPA("0.00"); // Use string "0.00" for consistency
      return;
    }
    let totalQualityPoints = 0;
    let totalCredits = 0;

    semesters.forEach((sem) => {
      if (sem.courses && sem.courses.length > 0) {
        const semesterPoints = sem.courses.reduce(
          (acc, c) => acc + calculateGPA(Number(c.marks)) * Number(c.credits),
          0
        );
        const semesterCredits = sem.courses.reduce(
          (acc, c) => acc + Number(c.credits),
          0
        );
        if (!isNaN(semesterPoints) && !isNaN(semesterCredits) && semesterCredits > 0) {
          totalQualityPoints += semesterPoints;
          totalCredits += semesterCredits;
        }
      }
    });

    const newCGPA = totalCredits
      ? (totalQualityPoints / totalCredits).toFixed(2)
      : "0.00";
    setCGPA(isNaN(parseFloat(newCGPA)) ? "0.00" : newCGPA);
  }, [semesters]); // Only depends on semesters now

  const calculateSemesterGPA = (sem) => {
    if (!sem.courses?.length) return "0.00";
    let totalQP = 0;
    let totalCredits = 0;
    sem.courses.forEach((c) => {
      const creditsNum = Number(c.credits);
      const marksNum = Number(c.marks);
      if (!isNaN(creditsNum) && !isNaN(marksNum) && creditsNum > 0) {
        totalQP += calculateGPA(marksNum) * creditsNum;
        totalCredits += creditsNum;
      }
    });
    const calculatedGPA = totalCredits ? (totalQP / totalCredits).toFixed(2) : "0.00";
    return isNaN(parseFloat(calculatedGPA)) ? "0.00" : calculatedGPA;
  };

  const calculateGPA = (marks) => {
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

  const handleAddSemester = () => {
    if (form.year && (isNaN(Number(form.year)) || form.year.length !== 4)) {
      alert("Please enter a valid 4-digit year.");
      return;
    }
    const nextSemesterName = `Semester ${semesters.length + 1}`;
    addSemester({
      name: form.name || nextSemesterName,
      year: form.year,
      numberOfCourses: 0,
      totalCredits: 0,
      courses: [],
    });
    setForm({ name: "", year: "" });
  };

  const getGpaColor = (gpa) => {
    const gpaNum = parseFloat(gpa);
    if (isNaN(gpaNum)) return "bg-gray-400 hover:bg-gray-500";
    if (gpaNum >= 3.0) return "bg-green-500 hover:bg-green-600";
    if (gpaNum >= 2.6) return "bg-orange-500 hover:bg-orange-600";
    return "bg-red-500 hover:bg-red-600";
  };

  // --- Calculate CGPA progress for the bar ---
  const cgpaProgress = (parseFloat(cgpa) / 4.0) * 100;
  // ---

  return (
    <AppLayout>
      <div className="p-8 md:p-12 space-y-10">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-800">GPA Calculator</h1>
          {semesters.length < totalSemesters && (
            <Sheet>
              <SheetTrigger asChild>
                <Button className="bg-green-600 hover:bg-green-700 text-white">Add Semester</Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Add Semester {semesters.length + 1}</SheetTitle>
                  <SheetDescription>
                    Fill in the details for the new semester.
                  </SheetDescription>
                </SheetHeader>
                <div className="space-y-4 py-4">
                  <div>
                    <Label htmlFor="semester-name">Name (Optional)</Label>
                    <Input
                      id="semester-name"
                      placeholder={`Default: Semester ${semesters.length + 1}`}
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="semester-year">Year</Label>
                    <Input
                      id="semester-year"
                      placeholder="e.g., 2025"
                      value={form.year}
                      onChange={(e) => setForm({ ...form, year: e.target.value })}
                      className="mt-1"
                      type="number"
                      maxLength="4"
                    />
                  </div>
                </div>
                <SheetFooter>
                  <SheetClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </SheetClose>
                  <SheetClose asChild>
                    <Button onClick={handleAddSemester}>Add</Button>
                  </SheetClose>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          )}
        </div>

        <div className="w-[75%] lg:w-[80%] mx-auto space-y-10">
          {/* CGPA Display */}
          <div className="text-center space-y-5"> {/* Added space-y for progress bar */}
            <h2 className="text-4xl font-bold text-gray-800">
              CGPA <span className="text-green-600 tracking-widest">-------</span>{" "}
              <span className="text-green-600">{cgpa || "0.00"}</span>
            </h2>
             {/* --- CGPA Progress Bar --- */}
             <div className="max-w-xl mx-auto bg-gray-200 rounded-full h-3.5 dark:bg-gray-700"> {/* Adjusted width */}
               <div
                 className="bg-green-500 h-3.5 rounded-full transition-all duration-500 ease-out"
                 style={{ width: `${cgpaProgress}%` }}
               ></div>
             </div>
             {/* --- End Progress Bar --- */}
          </div>

          {/* Semesters Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {Array.from({ length: totalSemesters }, (_, index) => {
              const sem = semesters[index];
              const semesterNumber = index + 1;

              if (sem) {
                const semGpa = calculateSemesterGPA(sem);
                const gpaColor = getGpaColor(semGpa);

                return (
                  <div
                    key={index}
                    className={`cursor-pointer transition duration-300 ease-in-out transform hover:scale-[1.03] rounded-2xl p-6 text-white text-center flex flex-col justify-center items-center h-48 shadow-lg ${gpaColor}`}
                    onClick={() => navigate(`/gpa-calculator/${index}`)}
                  >
                    <span className="font-semibold text-xl">
                      {sem.name || `Semester ${index + 1}`}
                    </span>
                    <span className="font-bold text-6xl mt-1">
                      GPA {semGpa}
                    </span>
                    {sem.year && <span className="text-sm opacity-80 mt-1">Year: {sem.year}</span>}
                  </div>
                );
              }

              return (
                <div
                  key={index}
                  className="bg-green-100/60 rounded-2xl p-6 text-green-800/80 text-center flex flex-col justify-center items-center h-48 border-2 border-dashed border-green-300 hover:bg-green-100/80 transition-colors"
                >
                  <span className="font-semibold text-xl">
                    Semester {semesterNumber}
                  </span>
                  <span className="text-sm mt-2">(No data added)</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default SemesterView;