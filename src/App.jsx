import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/dashboard";
import Home from "./pages/home";
import LoginPage from "./pages/login";
import SignupPage from "./pages/signup";
import NotFound from "./pages/notFound";
import ResourcesPage from "./pages/resources";
import AskSeniorsPage from "./pages/askSeniors";
import SupportPage from "./pages/support";
import SemesterView from "./pages/gpa-calculator/semester-view";
import CourseView from "./pages/gpa-calculator/course-view";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/resources" element={<ResourcesPage />} />
        <Route path="/ask-seniors" element={<AskSeniorsPage />} />
        <Route path="/support-groups" element={<SupportPage />} />
        <Route path="/gpa-calculator" element={<SemesterView />} />
        <Route path="/gpa-calculator/:semesterIndex" element={<CourseView />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
