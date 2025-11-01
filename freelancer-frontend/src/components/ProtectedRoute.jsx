// import { Navigate } from "react-router-dom";
// import { useAuth } from "../store/useAuth.js";

// export default function ProtectedRoute({ children }) {
//   const { token } = useAuth();

//   if (!token) {
//     return <Navigate to="/login" replace />;
//   }

//   return children;
// }

// src/components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, allowedRoles }) {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Check if role is allowed
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

