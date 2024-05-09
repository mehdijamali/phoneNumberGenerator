import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv?.config();

const DB_URI = `mongodb://${process.env.MONGO_INITDB_ROOT_USERNAME}:${process.env.MONGO_INITDB_ROOT_PASSWORD}@${process.env.MONGO_DB_HOST}:${process.env.MONGO_DB_PORT}`;

// Initialize the connection once
export const connect = async () => {
  if (mongoose.connection.readyState === 0) {
    // 0 = disconnected
    try {
      await mongoose.connect(DB_URI);
      console.log("Connected to MongoDB");
    } catch (error) {
      console.error("Error connecting to MongoDB:", error);
    }
  }
};

export const disconnect = async () => {
  if (mongoose.connection.readyState !== 0) {
    // Not disconnected
    try {
      await mongoose.disconnect();
      console.log("Disconnected from MongoDB");
    } catch (error) {
      console.error("Error disconnecting from MongoDB:", error);
    }
  }
};
