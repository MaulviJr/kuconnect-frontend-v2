import useStore from "@/store";
import { Navigate, useLocation } from "react-router-dom";

function ProtectedRoute({ children }) {
  const location = useLocation();
  const { completed } = useStore((state) => state.onboarding);
  const { isAuthenticated, rehydrated } = useStore((state) => state.auth);

  // If still rehydrating, show loader
  if (!rehydrated) {
    return <div>Loading...</div>;
  }

  // If not logged in → redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If logged in but onboarding not completed → redirect to onboarding
  if (!completed && location.pathname !== "/onboarding") {
    return <Navigate to="/onboarding" replace />;
  }

  // If onboarding is already completed but user tries to access onboarding page → redirect to dashboard
  if (
    completed &&
    (location.pathname === "/onboarding" ||
      location.pathname === "/onboarding/")
  ) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default ProtectedRoute;
