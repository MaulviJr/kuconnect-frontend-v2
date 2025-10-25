const LOCAL_KEY = "gpaCalculator";

const createGpaCalculatorSlice = (set, get) => {
  // Load initial state from localStorage when available
  let initial = { cgpa: "0.00", semesters: [] };
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    if (raw) {
      initial = JSON.parse(raw);
    }
  } catch (err) {
    // ignore JSON errors and keep defaults
    // console.error("Failed to read gpaCalculator from localStorage:", err);
  }

  const persist = (next) => {
    try {
      localStorage.setItem(LOCAL_KEY, JSON.stringify(next));
    } catch (err) {
      console.error("Failed to persist gpaCalculator:", err);
    }
  };

  return {
    gpaCalculator: initial,

    setCGPA: (cgpa) =>
      set((state) => {
        const next = { ...state.gpaCalculator, cgpa };
        persist(next);
        return { gpaCalculator: next };
      }),

    addSemester: (semester) =>
      set((state) => {
        const next = {
          ...state.gpaCalculator,
          semesters: [
            ...state.gpaCalculator.semesters,
            { ...semester, courses: [], numberOfCourses: 0, totalCredits: 0 },
          ],
        };
        persist(next);
        return { gpaCalculator: next };
      }),

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

        const next = { ...state.gpaCalculator, semesters };
        persist(next);
        return { gpaCalculator: next };
      }),

    updateCourseInSemester: (semesterIndex, courseIndex, updatedCourse) =>
      set((state) => {
        const semesters = [...state.gpaCalculator.semesters];
        const sem = semesters[semesterIndex];
        const courses = [...sem.courses];
        // Update totalCredits
        const prevCredits = courses[courseIndex]?.credits || 0;
        courses[courseIndex] = updatedCourse;
        semesters[semesterIndex] = {
          ...sem,
          courses,
          totalCredits: sem.totalCredits - prevCredits + updatedCourse.credits,
        };
        const next = { ...state.gpaCalculator, semesters };
        persist(next);
        return { gpaCalculator: next };
      }),

    removeSemester: (semesterIndex) =>
      set((state) => {
        const semesters = [...state.gpaCalculator.semesters];
        semesters.splice(semesterIndex, 1);
        const next = { ...state.gpaCalculator, semesters };
        persist(next);
        return { gpaCalculator: next };
      }),
  };
};

export default createGpaCalculatorSlice;
