import { create } from "zustand";
import { devtools } from "zustand/middleware";

export const useStore = create(
  devtools((set) => ({
    gpaCalculator: {
      cgpa: 0,
      semesters: [],
    },

    setCGPA: (cgpa) =>
      set((state) => ({
        gpaCalculator: {
          ...state.gpaCalculator,
          cgpa,
        },
      })),

    addSemester: (semester) =>
      set((state) => ({
        gpaCalculator: {
          ...state.gpaCalculator,
          semesters: [...state.gpaCalculator.semesters, semester],
        },
      })),

    addCourseToSemester: (semesterIndex, course) =>
      set((state) => {
        const semesters = [...state.gpaCalculator.semesters];
        semesters[semesterIndex] = {
          ...semesters[semesterIndex],
          courses: [...semesters[semesterIndex].courses, course],
          numberOfCourses: semesters[semesterIndex].numberOfCourses + 1,
          totalCredits: semesters[semesterIndex].totalCredits + course.credits,
        };
        return {
          gpaCalculator: {
            ...state.gpaCalculator,
            semesters,
          },
        };
      }),
  }))
);
