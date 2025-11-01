import { useState } from "react";

export default function ProjectForm({ onSubmit, initialData = {} }) {
  const [formData, setFormData] = useState({
    title: initialData.title || "",
    description: initialData.description || "",
    budgetMin: initialData.budgetMin || "",
    budgetMax: initialData.budgetMax || "",
    skillsRequired: initialData.skillsRequired
      ? initialData.skillsRequired.join(", ")
      : "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const projectData = {
      ...formData,
      budgetMin: Number(formData.budgetMin),
      budgetMax: Number(formData.budgetMax),
      skillsRequired: formData.skillsRequired
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    };

    onSubmit(projectData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 max-w-lg mx-auto bg-gray-900 shadow-lg rounded-xl p-6 border border-gray-700 relative top-15"
    >
      <h2 className="text-2xl font-bold mb-4 text-white">Project Details</h2>

      <input
        type="text"
        name="title"
        value={formData.title}
        onChange={handleChange}
        placeholder="Project Title"
        required
        className="w-full p-2 rounded bg-gray-800 border border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
      />

      <textarea
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Project Description"
        required
        rows={4}
        className="w-full p-2 rounded bg-gray-800 border border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
      />

      <div className="flex space-x-2">
        <input
          type="number"
          name="budgetMin"
          value={formData.budgetMin}
          onChange={handleChange}
          placeholder="Min Budget"
          className="w-1/2 p-2 rounded bg-gray-800 border border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="number"
          name="budgetMax"
          value={formData.budgetMax}
          onChange={handleChange}
          placeholder="Max Budget"
          className="w-1/2 p-2 rounded bg-gray-800 border border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <input
        type="text"
        name="skillsRequired"
        value={formData.skillsRequired}
        onChange={handleChange}
        placeholder="Skills (comma separated)"
        className="w-full p-2 rounded bg-gray-800 border border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
      />

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition w-full"
      >
        Save Project
      </button>
    </form>
  );
}
