import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../store/useAuth";

export default function ProjectList() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/projects");
        setProjects(res.data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) return <p className="p-6 text-gray-300">Loading projects...</p>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">Available Projects</h1>

        {user?.role === "client" && (
          <Link
            to="/create-project"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            + Create Project
          </Link>
        )}
      </div>

      {projects.length === 0 ? (
        <p className="text-gray-500">No projects available right now.</p>
      ) : (
        <ul className="space-y-4">
          {projects.map((project) => (
            <li
              key={project._id}
              className="bg-gray-800 border border-gray-700 p-5 rounded-lg shadow-md hover:shadow-lg transition"
            >
              <h2 className="text-xl font-bold text-white">{project.title}</h2>
              <p className="text-gray-300">{project.description}</p>
              <p className="text-sm text-gray-400">
                Budget: ${project.budgetMin || 0} - ${project.budgetMax || 0}
              </p>
              <p className="text-sm text-gray-400">
                Skills: {project.skillsRequired?.length > 0
                  ? project.skillsRequired.join(", ")
                  : "Not specified"}
              </p>
              <Link
                to={`/projects/${project._id}`}
                className="text-blue-400 hover:text-blue-500 mt-2 inline-block"
              >
                View Details →
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
