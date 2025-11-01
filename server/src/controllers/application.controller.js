import Application from "../models/Application.js";
import Project from "../models/Project.js";


export const createApplication = async (req, res) => {
  try {
    console.log("User from token:", req.user);
    const { project, coverLetter, proposedRate } = req.body;

    if (!project || !coverLetter) {
      return res.status(400).json({ message: "Project and cover letter are required" });
    }

    // ✅ Make sure project exists
    const projectExists = await Project.findById(project);
    if (!projectExists) {
      return res.status(404).json({ message: "Project not found" });
    }

    // ✅ Prevent duplicate application
    const existingApp = await Application.findOne({
      freelancer: req.user.id,  
      project,
    });

    if (existingApp) {
      return res.status(400).json({ message: "You already applied to this project" });
    }

    // ✅ Create new application
    const application = await Application.create({
      freelancer: req.user.id,
      project,
      coverLetter,
      proposedRate,
    });

    res.status(201).json(application);
  } catch (error) {
    console.error("Create Application Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get all applications
export const getApplications = async (req, res) => {
  const apps = await Application.find()
    .populate("project", "title description")
    .populate("freelancer", "name email");
  res.json(apps);
};


export const getApplicationsByProject = async (req, res) => {
  try {
    const { projectId } = req.params;

    const applications = await Application.find({ project: projectId })
      .populate("freelancer", "name email"); // ✅ important

    if (!applications || applications.length === 0) {
      return res.json([]); // return empty array
    }

    res.json(applications);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};




//  Update application status (accept/reject)
export const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["accepted", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const application = await Application.findById(req.params.id).populate("project");
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    //  Only the client who owns the project can update
    if (application.project.client.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    application.status = status;
    await application.save();

    // if accepted, auto-reject other applications for this project
    if (status === "accepted") {
      await Application.updateMany(
        { project: application.project._id, _id: { $ne: application._id } },
        { $set: { status: "rejected" } }
      );
    }

    res.json({
      message: `Application ${status}`,
      application,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyApplications = async (req, res) => {
  try {
    const apps = await Application.find({ freelancer: req.user.id })
      .populate("project", "title description")
      .populate("freelancer", "name email");

    res.json(apps);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
