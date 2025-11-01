import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../store/useAuth";

export default function UpdateProfile() {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({
    name: "",
    bio: "",
    skills: "",
    experience: "",
  });

  
  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        bio: user.bio || "",
        skills: Array.isArray(user.skills) ? user.skills.join(", ") : user.skills || "",
        experience: user.experience || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");

      const payload = {
        name: form.name,
        bio: form.bio,
        skills: form.skills
          ? form.skills.split(",").map((s) => s.trim())
          : [],
        experience: form.experience,
      };

      const res = await axios.put(
        "http://localhost:5000/api/users/me",
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("✅ Backend Response:", res.data);
      alert(res.data.message);

      if (res.data.user) {
        const updatedUser = {
          ...res.data.user,
          token: user?.token || token, 
        };

       
        setUser(updatedUser);

    
        localStorage.setItem("user", JSON.stringify(updatedUser));
        localStorage.setItem("token", updatedUser.token);
      }
    } catch (error) {
      console.error("Update error:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Update failed");
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-gray-800 text-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-6">Update Profile</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Full Name"
          className="w-full border border-gray-700 bg-gray-800 text-white p-3 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
        />

        <textarea
          name="bio"
          value={form.bio}
          onChange={handleChange}
          placeholder="Your bio"
          className="w-full border border-gray-700 bg-gray-800 text-white p-3 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          rows={3}
        />

        <input
          name="skills"
          value={form.skills}
          onChange={handleChange}
          placeholder="Skills (comma separated)"
          className="w-full border border-gray-700 bg-gray-800 text-white p-3 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
        />

        <input
          name="experience"
          value={form.experience}
          onChange={handleChange}
          placeholder="Experience (e.g. 3 years)"
          className="w-full border border-gray-700 bg-gray-800 text-white p-3 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
        />

        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 transition text-white px-4 py-2 rounded-lg shadow-md"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}
