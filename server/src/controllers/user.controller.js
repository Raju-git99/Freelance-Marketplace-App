import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js"; // adjust path if needed

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create user using correct field
    const user = await User.create({
      name,
      email,
      passwordHash: hashedPassword, // ✅ matches schema
      role
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
     console.error("Register error:", error);
    // console.error("Register error:", error.message, error.stack);
    res.status(500).json({ message: "Server error during registration" });
  }
};

// export const loginUser = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const user = await User.findOne({ email });
//     if (!user) return res.status(400).json({ message: "Invalid credentials" });

//     const isMatch = await bcrypt.compare(password, user.passwordHash);
//     if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

//     res.json({
//       _id: user._id,
//       name: user.name,
//       email: user.email,
//       role: user.role,
//       token: generateToken(user._id, user.role), // ✅ FIXED
//     });
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      bio: user.bio || "",
      skills: user.skills || [],
      experience: user.experience || "",
      token: generateToken(user._id, user.role), 
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// export const updateMe = async (req, res) => {
//   try {
//     const updates = req.body;

//     const user = await User.findById(req.user._id);
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     // Basic updates
//     if (updates.name) user.name = updates.name;

//     // Freelancer-specific fields
//     if (user.role === "freelancer") {
//       if (updates.bio) user.bio = updates.bio;
//       if (updates.skills) user.skills = updates.skills;
//       if (updates.experience) user.experience = updates.experience;
//     }

//     // Client-specific fields
//     if (user.role === "client") {
//       if (updates.company) user.company = updates.company;
//       if (updates.bio || updates.skills || updates.experience) {
//         return res.status(403).json({
//           message: "Clients cannot update bio, skills, or experience",
//         });
//       }
//     }

//     await user.save();

//     res.json({
//       message: "Profile updated successfully",
//       user: {
//         _id: user._id,
//         name: user.name,
//         email: user.email,
//         role: user.role,
//         bio: user.bio,
//         skills: user.skills,
//         experience: user.experience,
//         company: user.company,
//       },
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: "Server error",
//       error: error.message,
//     });
//   }
// };




// // ✅ Generate JWT Token
// const generateToken = (_id, role) => {
//   return jwt.sign({ _id, role }, process.env.JWT_SECRET, {
//     expiresIn: "30d",
//   });
// };

// // ✅ Register User
// export const registerUser = async (req, res) => {
//   try {
//     const { name, email, password, role } = req.body;

//     if (!name || !email || !password) {
//       return res.status(400).json({ message: "All fields are required" });
//     }

//     // check if user exists
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ message: "User already exists" });
//     }

//     // hash password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // create user
//     const user = await User.create({
//       name,
//       email,
//       passwordHash: hashedPassword,
//       role,
//     });

//     res.status(201).json({
//       message: "User registered successfully",
//       user: {
//         _id: user._id,
//         name: user.name,
//         email: user.email,
//         role: user.role,
//       },
//       token: generateToken(user._id, user.role),
//     });
//   } catch (error) {
//     console.error("Register error:", error.message);
//     res.status(500).json({ message: "Server error during registration" });
//   }
// };

// // ✅ Login User
// export const loginUser = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const user = await User.findOne({ email });
//     if (!user) return res.status(400).json({ message: "Invalid credentials" });

//     const isMatch = await bcrypt.compare(password, user.passwordHash);
//     if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

//     res.json({
//       _id: user._id,
//       name: user.name,
//       email: user.email,
//       role: user.role,
//       token: generateToken(user._id, user.role), // ✅ always use _id
//     });
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };

// // ✅ Get User Profile (Protected)
// export const getProfile = async (req, res) => {
//   try {
//     const user = await User.findById(req.user._id).select("-passwordHash"); // ✅ fixed

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     res.json(user);
//   } catch (error) {
//     res.status(500).json({
//       message: "Error fetching profile",
//       error: error.message,
//     });
//   }
// };

//  Get Current User
export const updateMe = async (req, res) => {
  try {
    const userId = req.user.id; // set by authMiddleware
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }


    user.name = req.body.name || user.name;
    user.bio = req.body.bio || user.bio;
    user.skills = req.body.skills || user.skills;
    user.experience = req.body.experience || user.experience;

   
    const updatedUser = await user.save();

    res.json({
      message: "Profile updated successfully",
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        bio: updatedUser.bio,
        skills: updatedUser.skills,
        experience: updatedUser.experience,
      },
    });
  } catch (err) {
    console.error("UpdateMe error:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-passwordHash");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching user info",
      error: error.message,
    });
  }
};

// // ✅ Update Current User
// export const updateMe = async (req, res) => {
//   try {
//     const updates = req.body;

//     const user = await User.findById(req.user._id);
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     // Basic updates
//     if (updates.name) user.name = updates.name;

//     // Freelancer-specific fields
//     if (user.role === "freelancer") {
//       if (updates.bio) user.bio = updates.bio;
//       if (updates.skills) user.skills = updates.skills;
//       if (updates.experience) user.experience = updates.experience;
//     }

//     // Client-specific fields
//     if (user.role === "client") {
//       if (updates.company) user.company = updates.company;
//       if (updates.bio || updates.skills || updates.experience) {
//         return res.status(403).json({
//           message: "Clients cannot update bio, skills, or experience",
//         });
//       }
//     }

//     await user.save();

//     res.json({
//       message: "Profile updated successfully",
//       user: {
//         _id: user._id,
//         name: user.name,
//         email: user.email,
//         role: user.role,
//         bio: user.bio,
//         skills: user.skills,
//         experience: user.experience,
//         company: user.company,
//       },
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: "Server error",
//       error: error.message,
//     });
//   }
// };