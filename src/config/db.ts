import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

/**
 * ===============================
 * MongoDB Production Connection
 * ===============================
 */

const connectDB = async (): Promise<void> => {
  try {
    /* ================= ENV VALIDATION ================= */
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
      throw new Error("❌ MONGO_URI is not defined in environment variables");
    }

    /* ================= MONGOOSE STRICT SETTINGS ================= */
    mongoose.set("strictQuery", true);

    /* ================= CONNECTION OPTIONS ================= */
    const conn = await mongoose.connect(mongoUri, {
      maxPoolSize: 10, // connection pool size
      serverSelectionTimeoutMS: 5000, // timeout if DB not reachable
      socketTimeoutMS: 45000, // close sockets after 45 sec inactivity
      family: 4, // force IPv4
    });

    console.log(`✅ MongoDB Connected Successfully`);
    console.log(`📦 Host: ${conn.connection.host}`);
    console.log(`🗄 Database: ${conn.connection.name}`);

    /* ================= CONNECTION EVENTS ================= */

    mongoose.connection.on("connected", () => {
      console.log("🔵 Mongoose connected");
    });

    mongoose.connection.on("error", (err) => {
      console.error("🔴 Mongoose connection error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("🟡 Mongoose disconnected");
    });

    /* ================= GRACEFUL SHUTDOWN ================= */

    process.on("SIGINT", async () => {
      await mongoose.connection.close();
      console.log("🛑 MongoDB connection closed due to app termination");
      process.exit(0);
    });

  } catch (error: any) {
    console.error("❌ MongoDB connection failed:", error.message);

    // In production never expose full error
    if (process.env.NODE_ENV === "production") {
      process.exit(1);
    } else {
      console.error(error);
      process.exit(1);
    }
  }
};

export default connectDB;