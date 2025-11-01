import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../store/useAuth";
import { Link } from "react-router-dom";
import { Folder, Trash2, Users, Eye } from "lucide-react";

export default function Dashboard() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const { user } = useAuth();

  const handleDelete = async (projectId) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;

    try {
      setLoading(true);
      await axios.delete(`http://localhost:5000/api/projects/${projectId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      setItems((prev) => prev.filter((p) => p._id !== projectId));
    } catch (error) {
      console.error("Error deleting project:", error.response?.data || error.message);
      alert("Failed to delete project. Try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      setLoading(true);
      try {
        const token = user?.token || localStorage.getItem("token");

        if (user.role === "client") {
          const res = await axios.get("http://localhost:5000/api/dashboard/client", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setItems(res.data.projects || []);
        } else if (user.role === "freelancer") {
          const res = await axios.get("http://localhost:5000/api/dashboard/freelancer", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setItems(res.data.applications || []);
        }
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (loading) {
    return <p className="text-center text-gray-300 mt-10">Loading your dashboard...</p>;
  }

  return (
    <div className="p-6 bg-[#0f172a] min-h-screen">
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2 text-white">
        <Folder className="text-yellow-400" />{" "}
        {user?.role === "client" ? "My Projects" : "My Applications"}
      </h1>

      {items.length === 0 ? (
        <p className="text-gray-400 text-center">
          {user?.role === "client"
            ? "You haven’t posted any projects yet."
            : "You haven’t applied to any projects yet."}
        </p>
      ) : (
        <ul className="space-y-6">
          {user?.role === "client"
            ? items.map((project) => (
                <li
                  key={project._id}
                  className="bg-gray-800 border border-gray-700 p-5 rounded-xl shadow-md flex justify-between items-center hover:shadow-lg transition"
                >
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-white">{project.title}</h2>
                    <p className="text-gray-300 mt-1">{project.description}</p>
                    <p className="text-sm text-gray-400 mt-2">
                      💰 Budget: ${project.budgetMin || 0} - ${project.budgetMax || 0}
                    </p>
                    {project.skillsRequired?.length > 0 && (
                      <p className="text-sm text-gray-400">
                        🛠 Skills: {project.skillsRequired.join(", ")}
                      </p>
                    )}

                    <div className="mt-3 flex flex-wrap gap-2">
                      <Link
                        to={`/projects/${project._id}`}
                        className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition"
                      >
                        <Eye size={16} /> View Details
                      </Link>
                      <Link
                        to={`/projects/${project._id}/applications`}
                        className="flex items-center gap-1 bg-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-green-700 transition"
                      >
                        <Users size={16} /> View Applicants
                      </Link>
                      <Link
                        to={`/projects/${project._id}/update`}
                        className="bg-yellow-500 text-black px-3 py-1.5 rounded-lg hover:bg-yellow-600 transition"
                      >
                        Update Project
                      </Link>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDelete(project._id)}
                    disabled={loading}
                    className="ml-4 px-4 py-2 flex items-center gap-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                  >
                    <Trash2 size={16} />
                    {loading ? "Deleting..." : "Delete"}
                  </button>
                </li>
              ))
            : items.map((app) => (
                <li
                  key={app._id}
                  className="bg-gray-800 border border-gray-700 p-5 rounded-xl shadow-md hover:shadow-lg transition"
                >
                  <h2 className="text-xl font-semibold text-white">{app.project.title}</h2>
                  <p className="text-gray-300 mt-1">{app.project.description}</p>
                  <p className="text-sm text-gray-400 mt-2">
                    💰 Budget: ${app.project.budgetMin || 0} - ${app.project.budgetMax || 0}
                  </p>
                  {app.project.skillsRequired?.length > 0 && (
                    <p className="text-sm text-gray-400">
                      🛠 Skills: {app.project.skillsRequired.join(", ")}
                    </p>
                  )}
                  <p className="mt-2 text-sm text-gray-300">
                    Status: <b className="text-white">{app.status}</b>
                  </p>
                  <Link
                    to={`/projects/${app.project._id}`}
                    className="inline-block mt-3 bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition"
                  >
                    View Details
                  </Link>
                </li>
              ))}
        </ul>
      )}
    </div>

  </div>
  );
}
