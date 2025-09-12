import useStore from "./store";
import Home from "./pages/home";
import { useEffect } from "react";
import NotFound from "./pages/notFound";
import Dashboard from "./pages/dashboard";
import LoginPage from "./pages/auth/login";
import SignupPage from "./pages/auth/signup";
import AskSeniorsPage from "./pages/askSeniors";
import Onboarding from "./pages/auth/onboarding";
import ProtectedRoute from "./components/protected-route";
import CourseView from "./pages/gpa-calculator/course-view";
import SemesterView from "./pages/gpa-calculator/semester-view";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  const rehydrateAuth = useStore((state) => state.rehydrateAuth);
  const rehydrateOnboarding = useStore((state) => state.rehydrateOnboarding);

  useEffect(() => {
    rehydrateAuth();
    rehydrateOnboarding();
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
