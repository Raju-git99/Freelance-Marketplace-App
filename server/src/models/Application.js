import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
  project: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
  freelancer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // 👈 must reference User
  coverLetter: { type: String, required: true },
  proposedRate: { type: Number },
  status: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" }
}, { timestamps: true });

export default mongoose.model("Application", applicationSchema);
