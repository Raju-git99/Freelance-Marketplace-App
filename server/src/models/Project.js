import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  client: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  budgetMin: Number,
  budgetMax: Number,
  skillsRequired: [String],
  status: { type: String, enum: ["open", "in_review", "closed"], default: "open" }
}, { timestamps: true });

export default mongoose.model("Project", projectSchema);
