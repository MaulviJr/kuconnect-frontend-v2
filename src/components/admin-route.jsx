import Loader from "./loader";
import useStore from "@/store";
import { Navigate } from "react-router-dom";

function AdminRoute({ children }) {
  const { isAuthenticated, rehydrated, user } = useStore((state) => state.auth);

  // If still rehydrating → show loader
  if (!rehydrated) {
    return <Loader fullScreen />;
  }

  // If not logged in → redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If logged in but not admin → redirect to dashboard
  if (!user?.role?.includes("admin")) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default AdminRoute;
