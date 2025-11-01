import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../store/useAuth.jsx";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const linkClasses = (path) =>
    `px-3 py-2 rounded-md text-sm font-medium transition ${
      location.pathname === path
        ? "bg-blue-500 text-white"
        : "text-gray-300 hover:bg-gray-700 hover:text-white"
    }`;

  return (
    <nav className="bg-gray-900 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link
            to="/"
            className="text-2xl font-bold text-white tracking-wide hover:text-blue-400 transition"
          >
            Freelancer<span className="text-blue-500">Hub</span>
          </Link>

          {/* Links */}
          <div className="flex items-center space-x-4">
            {!user ? (
              <>
                <Link to="/login" className={linkClasses("/login")}>
                  Login
                </Link>
                <Link to="/register" className={linkClasses("/register")}>
                  Register
                </Link>
              </>
            ) : (
              <>
                {user?.role === "client" && (
                  <>
                    <Link to="/dashboard" className={linkClasses("/dashboard")}>
                      Dashboard
                    </Link>
                    <Link
                      to="/create-project"
                      className={linkClasses("/create-project")}
                    >
                      Post Project
                    </Link>
                  </>
                )}

                {user?.role === "freelancer" && (
                  <>
                    <Link
                      to="/my-applications"
                      className={linkClasses("/my-applications")}
                    >
                      My Applications
                    </Link>
                    <Link
                      to="/update-profile"
                      className={linkClasses("/update-profile")}
                    >
                      Update Profile
                    </Link>
                  </>
                )}

                <Link to="/projects" className={linkClasses("/projects")}>
                  Browse Projects
                </Link>

                <button
                  onClick={handleLogout}
                  className="ml-3 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition shadow-sm"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
