import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/api";
import axios from "axios";
import { useAuth } from "../store/useAuth";

export default function ProjectDetail() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const { user } = useAuth();
  const [coverLetter, setCoverLetter] = useState("");
  const [proposedRate, setProposedRate] = useState("");

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await api.get(`/projects/${id}`);
        setProject(res.data);
      } catch (error) {
        console.error("Error fetching project:", error);
      }
    };

    fetchProject();
  }, [id]);

  const handleApply = async (e) => {
    e.preventDefault();
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const token = user?.token;

      await axios.post(
        "http://localhost:5000/api/applications",
        {
          project: id,
          coverLetter,
          proposedRate,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Application submitted!");
      setCoverLetter("");
      setProposedRate("");
    } catch (error) {
      console.error("Error applying:", error);
      alert(error.response?.data?.message || "Failed to apply");
    }
  };

  if (!project) {
    return <p className="p-6 text-gray-300">Loading project details...</p>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-gray-800 text-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-3">{project.title}</h1>
      <p className="mb-4 text-gray-300">{project.description}</p>

      {/* Budget */}
      <p className="text-gray-400 mb-1">
        <strong className="text-white">Budget:</strong> ${project.budgetMin || 0} - ${project.budgetMax || 0}
      </p>

      {/* Skills */}
      {project.skillsRequired?.length > 0 ? (
        <p className="text-gray-400 mb-1">
          <strong className="text-white">Skills:</strong> {project.skillsRequired.join(", ")}
        </p>
      ) : (
        <p className="text-gray-500">No specific skills listed</p>
      )}

      {/* Client */}
      <p className="text-gray-400">
        <strong className="text-white">Posted by:</strong> {project.client?.name || "Unknown"}
      </p>

      {/* Apply Form */}
      {user?.role === "freelancer" && (
        <form onSubmit={handleApply} className="mt-6 space-y-4">
          <textarea
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
            placeholder="Write your cover letter..."
            required
            className="w-full border border-gray-700 bg-gray-800 text-white p-3 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            rows={4}
          />
          <input
            type="number"
            value={proposedRate}
            onChange={(e) => setProposedRate(e.target.value)}
            placeholder="Enter your proposed rate ($)"
            required
            className="w-full border border-gray-700 bg-gray-800 text-white p-3 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 transition text-white px-5 py-2 rounded-lg shadow-md"
          >
            Apply for this Project
          </button>
        </form>
      )}
    </div>
  );
}
