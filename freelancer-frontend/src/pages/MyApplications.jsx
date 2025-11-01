import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../store/useAuth";
import { FileText, DollarSign } from "lucide-react";

export default function MyApplications() {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/applications/my", {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        });
        setApplications(res.data);
      } catch (error) {
        console.error("Error fetching applications:", error);
        alert(error.response?.data?.message || "Failed to load applications");
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchApplications();
  }, [user]);

  if (loading) return <p className="text-center text-gray-300">Loading applications...</p>;

  if (!applications.length)
    return <p className="text-center text-gray-400">You haven’t applied to any projects yet.</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-white flex items-center gap-2">
        <FileText className="text-blue-400" /> My Applications
      </h2>
      <div className="space-y-6">
        {applications.map((app) => (
          <div
            key={app._id}
            className="bg-gray-800 border border-gray-700 rounded-xl p-5 shadow-md hover:shadow-lg transition"
          >
            <h3 className="text-lg font-semibold text-white">{app.project?.title}</h3>
            <p className="text-gray-300 mt-1">{app.project?.description}</p>

            <div className="mt-3 space-y-1 text-sm">
              <p className="text-gray-300">
                <span className="font-medium text-white">Cover Letter:</span> {app.coverLetter}
              </p>
              {app.proposedRate && (
                <p className="text-gray-300 flex items-center gap-1">
                  <DollarSign size={14} className="text-green-400" />
                  Proposed Rate: ${app.proposedRate}
                </p>
              )}
              <p>
                <span className="font-medium text-white">Status:</span>{" "}
                <span
                  className={`${
                    app.status === "accepted"
                      ? "text-green-400"
                      : app.status === "rejected"
                      ? "text-red-400"
                      : "text-yellow-400"
                  } font-semibold`}
                >
                  {app.status || "pending"}
                </span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
