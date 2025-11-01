import { useNavigate } from "react-router-dom";
import ProjectForm from "../components/ProjectForm";
import axios from "axios";

export default function CreateProject() {
  const handleCreate = async ({ title, description, budgetMin, budgetMax, skillsRequired }) => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      const token = storedUser?.token;

      if (!token) {
        alert("You must be logged in as client to post a project");
        return;
      }

      await axios.post(
        "http://localhost:5000/api/projects",
        { title, description, budgetMin, budgetMax, skillsRequired },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("✅ Project created!");
    } catch (error) {
      console.error("Error creating project:", error);
      alert(error.response?.data?.message || "Failed to create project");
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gray-900 text-white">
      <h1 className="text-3xl m-auto font-bold mb-6 ml-20 mt-3">🚀 Post a New Project</h1>
      <ProjectForm onSubmit={handleCreate} />
    </div>
  );
}
