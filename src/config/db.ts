import bluebird from "bluebird";
import mongoose from "mongoose";
import l from "./logger";

const connectDB = async () => {
  try {
    mongoose.set("strictQuery", false);
    mongoose.Promise = bluebird;
    // @ts-ignore
    mongoose.connect(process.env.MONGODB_URI).then(() => {
      l.info("Database connected.");
    });
  } catch (error) {
    l.error("MongoDB connection error.\n" + error);
    process.exit(1);
  }
};

export default connectDB;
