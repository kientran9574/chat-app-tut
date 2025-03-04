import mongoose from "mongoose";

let conn = null;

export const connectDB = async () => {
  if (conn) {
    console.log(`MongoDB already connected: ${conn.host}`);
    return conn;
  }
  try {
    const db = await mongoose.connect(process.env.MONGODB_URI);
    conn = db.connection;
    console.log(`MongoDB connected: ${conn.host}`);
    return conn;
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
};
