import dotenv from "dotenv";
dotenv.config();

import connectDB from "./src/config/db.js";
import app from "./src/app.js";

import projectRoutes from "./src/routes/projectRoutes.js";
import applicationRoutes from "./src/routes/application.routes.js";
import userRoutes from "./src/routes/user.routes.js";
import dashboardRoutes from "./src/routes/dashboardRoutes.js";

app.use("/api/dashboard", dashboardRoutes);


// ✅ Connect Database BEFORE starting server
connectDB();

// Middlewares
app.use("/api/projects", projectRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/users", userRoutes);



// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
