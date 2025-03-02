import mongoose from "mongoose";

const MONGO_URI = "mongodb://localhost:27017";
const MONGO_DB = "pr_coder";
const MONGO_USER = "root";
const MONGO_PASS = "root";


export const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI, {
            dbName: MONGO_DB,
            auth: {
                username: MONGO_USER,
                password: MONGO_PASS
            }
        });
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1);
    }
};