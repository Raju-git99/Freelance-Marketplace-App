import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../store/useAuth.jsx";
import axios from "axios";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "client",
  });
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/users/register", {
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
      });
      console.log(res.data);
      alert("Registration Successful! Go to Login");
      navigate("/login");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-900">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-8 rounded-lg shadow-lg w-96"
      >
        <h2 className="text-2xl font-bold mb-4 text-white">Create an Account</h2>
        {error && <p className="text-red-400 mb-2">{error}</p>}

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          className="w-full border border-gray-700 bg-gray-700 text-white p-3 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-green-500"
          value={form.name}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email Address"
          className="w-full border border-gray-700 bg-gray-700 text-white p-3 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-green-500"
          value={form.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full border border-gray-700 bg-gray-700 text-white p-3 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-green-500"
          value={form.password}
          onChange={handleChange}
          required
        />

        <select
          name="role"
          className="w-full border border-gray-700 bg-gray-700 text-white p-3 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-green-500"
          value={form.role}
          onChange={handleChange}
        >
          <option value="client">Client</option>
          <option value="freelancer">Freelancer</option>
        </select>

        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 transition text-white p-3 rounded-lg shadow-md"
        >
          Register
        </button>

        <p className="mt-4 text-sm text-gray-400">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-400 hover:underline">
            Login here
          </Link>
        </p>
      </form>
    </div>
  );
}
