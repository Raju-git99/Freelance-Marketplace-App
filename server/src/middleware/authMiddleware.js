import jwt from "jsonwebtoken";
import User from "../models/User.js";

// export const protect = async (req, res, next) => {
//   let token;

//   if (
//     req.headers.authorization &&
//     req.headers.authorization.startsWith("Bearer")
//   ) {
//     try {
//       token = req.headers.authorization.split(" ")[1];
//       const decoded = jwt.verify(token, process.env.JWT_SECRET);

     
//       req.user = decoded;
//       next();
//     } catch (error) {
//       return res.status(401).json({ message: "Not authorized, token failed" });
//     }
//   }

//   if (!token) {
//     return res.status(401).json({ message: "Not authorized, no token" });
//   }
// };



export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      // Decode token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Fetch user from DB (with role, email etc.)
      const user = await User.findById(decoded.id).select("-passwordHash");

      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      // Attach full user object to request
      req.user = user;

      return next();
    } catch (error) {
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};


export const clientOnly = (req, res, next) => {
  if (req.user.role !== "client") {
    return res.status(403).json({ message: "Access denied, clients only" });
  }
  next();
};

export const freelancerOnly = (req, res, next) => {
  if (req.user.role !== "freelancer") {
    return res.status(403).json({ message: "Only freelancers can perform this action" });
  }
  next();
};
