import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogDescription,
} from "@/components/ui/dialog";
import useStore from "@/store";
import AppLayout from "@/components/layout";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import React, { useState, useEffect } from "react";
import { Separator } from "@/components/ui/separator";

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
        if (
          !isNaN(semesterPoints) &&
          !isNaN(semesterCredits) &&
          semesterCredits > 0
        ) {
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
    const calculatedGPA = totalCredits
      ? (totalQP / totalCredits).toFixed(2)
      : "0.00";
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
      <div className="p-8  md:p-14  space-y-10">
        

        <div className="mx-auto ">
          {/* CGPA Display */}
          <div className=" max-w-[1000px] mx-auto mb-4 pl-3 ">
            {" "}
            {/* Added space-y for progress bar */}
            <h2 className="font-poppins text-4xl font-semibold text-black/80">
              CGPA :
              <span className="ml-3 text-green-600">{cgpa || "0.00"}</span>
            </h2>
            {/* --- CGPA Progress Bar --- */}
            {/* --- End Progress Bar --- */}
          </div>

                  <Separator className="h-[2px]! max-w-[1000px] mx-auto" />


          {/* Semesters Grid - show existing semesters and one placeholder to add next */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-[900px] mt-12 mx-auto">
            {semesters.map((sem, index) => {
              const semGpa = calculateSemesterGPA(sem);
              const gpaColor = getGpaColor(semGpa);

              return (
                <div
                  key={index}
                  className={`cursor-pointer transition duration-300 ease-in-out transform hover:scale-[1.03] rounded-2xl p-6 text-white text-center flex flex-col justify-center items-center h-48 shadow-lg ${gpaColor}`}
                  onClick={() => navigate(`/gpa-calculator/${index}`)}
                >
                  <span className="font-semibold font-jost text-gray-200 text-xl">
                    {sem.name || `Semester ${index + 1}`}
                  </span>
                  <span className="font-bold font-poppins text-[40px] mt-1">
                    GPA {semGpa}
                  </span>
                  {sem.year && (
                    <span className="text-sm opacity-80 mt-1">
                      Year: {sem.year}
                    </span>
                  )}
                </div>
              );
            })}

            {/* Placeholder card to add next semester */}
            {semesters.length < totalSemesters && (
              <Dialog>
                <DialogTrigger asChild>
                  <div className="bg-green-100/60 rounded-2xl p-6 text-green-800/80 text-center flex flex-col justify-center items-center h-48 border-2 border-dashed border-green-300 hover:bg-green-100/80 transition-colors cursor-pointer">
                    <span className="font-semibold text-xl">Add Semester</span>
                    <span className="text-sm mt-2">Click to add</span>
                  </div>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      Add Semester {semesters.length + 1}
                    </DialogTitle>
                    <DialogDescription>
                      Fill in the details for the new semester.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div>
                      <Label htmlFor="semester-name">Name (Optional)</Label>
                      <Input
                        id="semester-name"
                        placeholder={`Default: Semester ${
                          semesters.length + 1
                        }`}
                        value={form.name}
                        onChange={(e) =>
                          setForm({ ...form, name: e.target.value })
                        }
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="semester-year">Year</Label>
                      <Input
                        id="semester-year"
                        placeholder="e.g., 2025"
                        value={form.year}
                        onChange={(e) =>
                          setForm({ ...form, year: e.target.value })
                        }
                        className="mt-1"
                        type="number"
                        maxLength="4"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <DialogClose asChild>
                      <Button onClick={handleAddSemester}>Add</Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default SemesterView;
