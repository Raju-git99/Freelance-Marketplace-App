import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Users, Mail, DollarSign } from "lucide-react";

export default function ProjectApplications() {
  const { id: projectId } = useParams();
  const [applications, setApplications] = useState([]);

  const fetchApps = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `http://localhost:5000/api/applications/project/${projectId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setApplications(res.data);
    } catch (error) {
      console.error("Error fetching applications:", error);
    }
  };

  useEffect(() => {
    if (projectId) fetchApps();
  }, [projectId]);

  const handleStatusUpdate = async (appId, status) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `http://localhost:5000/api/applications/${appId}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchApps();
    } catch (error) {
      console.error("Error updating status:", error);
      alert(error.response?.data?.message || "Failed to update status");
    }
  };

  if (!applications.length) {
    return <p className="p-6 text-gray-400">No applications yet.</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-white flex items-center gap-2">
        <Users className="text-green-400" /> Applicants for this Project
      </h1>

      <div className="space-y-6">
        {applications.map((app) => (
          <div
            key={app._id}
            className="bg-gray-800 border border-gray-700 p-5 rounded-xl shadow-md hover:shadow-lg transition"
          >
            <p className="font-bold text-lg text-white">{app.freelancer?.name || "Unknown User"}</p>
            <p className="text-gray-400 flex items-center gap-1">
              <Mail size={14} /> {app.freelancer?.email || "No email"}
            </p>
            <p className="mt-2 text-gray-300">{app.coverLetter}</p>
            <p className="mt-2 flex items-center gap-1 text-gray-300">
              <DollarSign size={14} className="text-green-400" />
              <strong>Proposed Rate:</strong> ${app.proposedRate}
            </p>
            <p className="mt-1">
              <strong className="text-white">Status:</strong>{" "}
              <span
                className={
                  app.status === "pending"
                    ? "text-yellow-400"
                    : app.status === "accepted"
                    ? "text-green-400"
                    : "text-red-400"
                }
              >
                {app.status}
              </span>
            </p>

            {app.status === "pending" && (
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => handleStatusUpdate(app._id, "accepted")}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                >
                  Accept
                </button>
                <button
                  onClick={() => handleStatusUpdate(app._id, "rejected")}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
