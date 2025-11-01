import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../store/useAuth";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const user = await login(data);
      if (user.role === "client") {
        navigate("/dashboard");
      } else if (user.role === "freelancer") {
        navigate("/my-applications");
      } else {
        navigate("/");
      }
    } catch (err) {
      alert(err.message || "Login failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-lg w-full max-w-md border border-gray-700">
        <h2 className="text-2xl font-bold text-center text-white mb-6">
          🔐 Login
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            {...register("email", { required: "Email is required" })}
            className="w-full px-4 py-2 rounded-lg bg-gray-900 border border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
          />
          {errors.email && (
            <p className="text-sm text-red-400">{errors.email.message}</p>
          )}

          <input
            type="password"
            placeholder="Password"
            {...register("password", { required: "Password is required" })}
            className="w-full px-4 py-2 rounded-lg bg-gray-900 border border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
          />
          {errors.password && (
            <p className="text-sm text-red-400">{errors.password.message}</p>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>

        <p className="text-sm text-center text-gray-400 mt-6">
          Don’t have an account?{" "}
          <Link to="/register" className="text-blue-400 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
