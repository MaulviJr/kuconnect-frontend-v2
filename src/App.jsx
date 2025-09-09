import useStore from "./store";
import Home from "./pages/home";
import { useEffect } from "react";
import LoginPage from "./pages/login";
import SignupPage from "./pages/signup";
import NotFound from "./pages/notFound";
import Dashboard from "./pages/dashboard";
import AskSeniorsPage from "./pages/askSeniors";
import ProtectedRoute from "./components/protected-route";
import CourseView from "./pages/gpa-calculator/course-view";
import SemesterView from "./pages/gpa-calculator/semester-view";
import { BrowserRouter, Routes, Route } from "react-router-dom";

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
