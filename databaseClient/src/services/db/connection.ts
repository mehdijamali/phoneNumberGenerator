import mongoose from "mongoose";

export const connect = async (
  database_uri: string,
  database_name: string,
  retries = 10,
  backoff = 1000
) => {
  if (database_uri && database_name)
    while (retries > 0 && mongoose.connection.readyState === 0) {
      try {
        console.log(`Attempting to connect to MongoDB ${database_uri}`);
        await mongoose
          .connect(database_uri, { dbName: database_name })
          .then((a) => console.log(a));
        console.log("Connected to MongoDB");
        return;
      } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        retries--;
        if (retries === 0) {
          console.error("Max retries reached. Failed to connect to MongoDB.");
          throw error;
        }
        console.log(`Retrying after ${backoff}ms...`);
        await new Promise((resolve) => setTimeout(resolve, backoff));
        backoff *= 2;
      }
    }
  else throw new Error("Database URI and name are required!");
};

export const disconnect = async () => {
  if (mongoose.connection.readyState !== 0) {
    try {
      await mongoose.disconnect();
      console.log("Disconnected from MongoDB");
    } catch (error) {
      console.error("Error disconnecting from MongoDB:", error);
    }
  }
};
