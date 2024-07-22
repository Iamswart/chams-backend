import mongoose from "mongoose";
import config from "./config/config";



function dbConnect(): void {
  mongoose.connect(config.mongo_uri as string);

  mongoose.connection.on("connected", () => {
    console.log("Connected to MongoDB successfully");
  });

  mongoose.connection.on("error", (err) => {
    console.log("An error occurred while connecting to MongoDB");
    console.log(err);
  });
}

export default dbConnect;