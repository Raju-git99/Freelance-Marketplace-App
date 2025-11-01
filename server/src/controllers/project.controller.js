import Project from "../models/Project.js";

export const createProject = async (req, res) => {
  try {
    const { title, description, budgetMin, budgetMax, skillsRequired } = req.body;

    // Ensure only client can post
    if (req.user.role !== "client") {
      return res.status(403).json({ message: "Only clients can post projects" });
    }

    const project = new Project({
      title,
      description,
      budgetMin,
      budgetMax,
      skillsRequired,
      client: req.user.id,
    });

    await project.save();
    res.status(201).json({ message: "Project created successfully", project });
  } catch (error) {
    res.status(500).json({ message: "Error creating project", error });
  }
};



// ✅ Get all projects
// export const getProjects = async (req, res) => {
//   try {
//     const projects = await Project.find().populate("client", "name email");
//     res.status(200).json(projects);
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching projects", error });
//   }
// };
// ✅ Get all projects
export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({})
      .populate("client", "_id name email"); 

    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// ✅ Get project by ID
export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate("client", "name email");
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ message: "Error fetching project", error });
  }
};

// export const updateProject = async (req, res) => {
//   try {
//     const project = await Project.findById(req.params.id);

//     if (!project) {
//       return res.status(404).json({ message: "Project not found" });
//     }
//     project.title = req.body.title || project.title;
//     project.description = req.body.description || project.description;
//     project.budget = req.body.budget || project.budget;
//     project.skillsRequired = req.body.skillsRequired || project.skillsRequired;
//     project.deadline = req.body.deadline || project.deadline;
//     project.category = req.body.category || project.category;
//     project.status = req.body.status || project.status;

//     const updatedProject = await project.save();
//     res.json(updatedProject);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
export const updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    project.title = req.body.title || project.title;
    project.description = req.body.description || project.description;
    project.budgetMin = req.body.budgetMin ?? project.budgetMin;
    project.budgetMax = req.body.budgetMax ?? project.budgetMax;
    project.skillsRequired = req.body.skillsRequired || project.skillsRequired;
    project.status = req.body.status || project.status;

    const updatedProject = await project.save();
    res.json(updatedProject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    await project.deleteOne();
    res.json({ message: "Project deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Get projects created by the logged-in client
export const getMyProjects = async (req, res) => {
  try {
    const projects = await Project.find({ client: req.user._id });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




