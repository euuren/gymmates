import { Navigate, Outlet } from "react-router-dom";
import { isAuthenticated } from "../../helpers/Auth";

const ProtectedRoute = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};

export default ProtectedRoute;