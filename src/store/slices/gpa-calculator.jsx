const createGpaCalculatorSlice = (set, get) => ({
  gpaCalculator: {
    cgpa: 0,
    semesters: [], // [{ semesterName, courses: [], numberOfCourses, totalCredits }]
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
        semesters: [
          ...state.gpaCalculator.semesters,
          { ...semester, courses: [], numberOfCourses: 0, totalCredits: 0 },
        ],
      },
    })),

  addCourseToSemester: (semesterIndex, course) =>
    set((state) => {
      const semesters = [...state.gpaCalculator.semesters];
      const sem = semesters[semesterIndex];

      semesters[semesterIndex] = {
        ...sem,
        courses: [...sem.courses, course],
        numberOfCourses: sem.numberOfCourses + 1,
        totalCredits: sem.totalCredits + course.credits,
      };

      return {
        gpaCalculator: {
          ...state.gpaCalculator,
          semesters,
        },
      };
    }),
});

export default createGpaCalculatorSlice;
