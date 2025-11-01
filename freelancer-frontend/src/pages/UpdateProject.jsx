import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function UpdateProject() {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: "",
    budgetMin: "",
    budgetMax: "",
    skillsRequired: "",
  });

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `http://localhost:5000/api/projects/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const project = res.data;
        setForm({
          title: project.title || "",
          description: project.description || "",
          budgetMin: project.budgetMin || "",
          budgetMax: project.budgetMax || "",
          skillsRequired: project.skillsRequired
            ? project.skillsRequired.join(", ")
            : "",
        });
      } catch (error) {
        console.error("Error loading project:", error);
      }
    };
    fetchProject();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/projects/${id}`,
        {
          ...form,
          skillsRequired: form.skillsRequired
            .split(",")
            .map((s) => s.trim()),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("✅ Project updated successfully!");
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Update failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-lg w-full max-w-lg">
        <h1 className="text-3xl font-bold text-white mb-6 text-center">
          ✏️ Update Project
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Project Title"
            className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
          />
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Project Description"
            className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
            rows="4"
          />
          <div className="flex space-x-4">
            <input
              type="number"
              name="budgetMin"
              value={form.budgetMin}
              onChange={handleChange}
              placeholder="Min Budget"
              className="w-1/2 p-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              name="budgetMax"
              value={form.budgetMax}
              onChange={handleChange}
              placeholder="Max Budget"
              className="w-1/2 p-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <input
            name="skillsRequired"
            value={form.skillsRequired}
            onChange={handleChange}
            placeholder="Skills (comma separated)"
            className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-200"
          >
            Update Project 🚀
          </button>
        </form>
      </div>
    </div>
  );
}
