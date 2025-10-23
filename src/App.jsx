import useStore from "./store";
import Home from "./pages/Home";
import { useEffect } from "react";
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/auth/login";
import SignupPage from "./pages/auth/signup";
import Dashboard from "./pages/main/dashboard";
import AskSeniorsPage from "./pages/askSeniors";
import Onboarding from "./pages/auth/onboarding";
import NotesPage from "./pages/main/notes/all-notes";
import CourseDetails from "./pages/main/course-details";
import ProtectedRoute from "./components/protected-route";
import QuizzesPage from "./pages/main/quizzes/all-quizzes";
import CourseView from "./pages/gpa-calculator/course-view";
import SemesterView from "./pages/gpa-calculator/semester-view";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PastPapersPage from "./pages/main/past-papers/all-past-papers";
import VideoLecturesPage from "./pages/main/video-lectures/all-videos";
import UploadNotes from "./pages/main/notes/upload-notes";
import UploadVideos from "./pages/main/video-lectures/upload-videos";
import UploadPastPapers from "./pages/main/past-papers/upload-past-papers";

function App() {
  const rehydrateAuth = useStore((state) => state.rehydrateAuth);

  useEffect(() => {
    rehydrateAuth();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="*" element={<NotFound />} />
        {/* Protected routes */}
        <Route
          path="/onboarding"
          element={
            <ProtectedRoute>
              <Onboarding />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/courses/:courseId/details"
          element={
            <ProtectedRoute>
              <CourseDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/courses/:courseId/notes"
          element={
            <ProtectedRoute>
              <NotesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/courses/:courseId/notes/upload"
          element={
            <ProtectedRoute>
              <UploadNotes />
            </ProtectedRoute>
          }
        />
        <Route
          path="/courses/:courseId/lectures"
          element={
            <ProtectedRoute>
              <VideoLecturesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/courses/:courseId/lectures/upload"
          element={
            <ProtectedRoute>
              <UploadVideos />
            </ProtectedRoute>
          }
        />
        <Route
          path="/courses/:courseId/past-papers"
          element={
            <ProtectedRoute>
              <PastPapersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/courses/:courseId/past-papers/upload"
          element={
            <ProtectedRoute>
              <UploadPastPapers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/courses/:courseId/quizzes"
          element={
            <ProtectedRoute>
              <QuizzesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ask-seniors"
          element={
            <ProtectedRoute>
              <AskSeniorsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/gpa-calculator"
          element={
            <ProtectedRoute>
              <SemesterView />
            </ProtectedRoute>
          }
        />
        <Route
          path="/gpa-calculator/:semesterIndex"
          element={
            <ProtectedRoute>
              <CourseView />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
