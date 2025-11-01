import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000, 
      ssl: true,                      
      tlsAllowInvalidCertificates: false,
    });
    console.log("✅ MongoDB Connected...");
  } catch (err) {
    console.error("❌ Error connecting DB:", err.message);
    process.exit(1);
  }
};

export default connectDB;
