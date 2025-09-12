import Loader from "./loader";
import useStore from "@/store";
import { Navigate, useLocation } from "react-router-dom";

function ProtectedRoute({ children }) {
  const location = useLocation();
  const { isAuthenticated, rehydrated, user } = useStore((state) => state.auth);

  // If still rehydrating → show loader
  if (!rehydrated) {
    return <Loader fullScreen />;
  }

  // If not logged in → redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If logged in but onboarding not completed → redirect to onboarding
  if (!user?.completed && location.pathname !== "/onboarding") {
    return <Navigate to="/onboarding" replace />;
  }

  // If onboarding is completed but user tries to access onboarding → redirect to dashboard
  if (
    user?.completed &&
    (location.pathname === "/onboarding" ||
      location.pathname === "/onboarding/")
  ) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default ProtectedRoute;
