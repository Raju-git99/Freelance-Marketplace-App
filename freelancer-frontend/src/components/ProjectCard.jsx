import { Link } from "react-router-dom";
import { useAuth } from "../store/useAuth";

export default function ProjectCard({ project }) {
  const { user } = useAuth();

  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow-md border border-gray-700 mb-4 hover:shadow-lg transition">
      <h3 className="text-xl font-semibold text-white">{project.title}</h3>
      <p className="text-gray-300 mt-2">{project.description?.slice(0, 100)}...</p>
      <p className="text-gray-400 mt-2">
        💰 Budget:{" "}
        <span className="text-green-400 font-medium">
          {project.budgetMin} - {project.budgetMax}
        </span>
      </p>

      <div className="mt-4 space-x-4">
        <Link
          to={`/projects/${project._id}`}
          className="text-blue-400 hover:text-blue-300 font-medium"
        >
          View Details
        </Link>

        {user?.role === "client" && (
          <Link
            to={`/projects/${project._id}/update`}
            className="text-yellow-400 hover:text-yellow-300 font-medium"
          >
            Update Project
          </Link>
        )}
      </div>
    </div>
  );
}

