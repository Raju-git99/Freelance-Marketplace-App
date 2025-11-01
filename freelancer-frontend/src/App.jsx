import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./store/useAuth.jsx";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProjectList from "./pages/ProjectList";
import ProjectDetail from "./pages/ProjectDetail";
import CreateProject from "./pages/CreateProject";
import MyApplications from "./pages/MyApplications.jsx";
import ProjectApplications from "./pages/ProjectApplications.jsx";
import UpdateProject from "./pages/UpdateProject.jsx";
import UpdateProfile from "./pages/UpdateProfile.jsx";
// import FreelancerDashboard from "./pages/FreelancerDashboard";


export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <div className="p-6 bg-[#0f172a] min-h-screen">
          <Routes>
            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected: User must be logged in */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <ProjectList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/projects"
              element={
                <ProtectedRoute>
                  <ProjectList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/projects/:id"
              element={
                <ProtectedRoute>
                  <ProjectDetail />
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
              path="/create-project"
              element={
                <ProtectedRoute>
                  <CreateProject />
                </ProtectedRoute>
              }
            />
            <Route path="/my-applications" element={<MyApplications />} />
            <Route path="/projects/:id/applications" element={<ProjectApplications />} />
            <Route path="/update-profile" element={<UpdateProfile />} />
            <Route path="/projects/:id/update" element={<UpdateProject />} />


            {/* <Route
              path="/freelancer/dashboard"
              element={
                <ProtectedRoute>
                  <FreelancerDashboard />
                </ProtectedRoute>
              }
            /> */}

          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
