import mongoose from "mongoose";

const mongoDBUrl = process.env.MONGODB_URL;

if (!mongoDBUrl) {
    throw new Error("MONGODB_URL is not defined in the environment variables.");
}

let cached = global.mongoose

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null }
}


const connectDB = async () => {
    if (cached.conn) {
        return cached.conn;
    }

    // if no connection is cached, create a new one
    if (!cached.promise) {
        cached.promise = mongoose.connect(mongoDBUrl).then((mongoose) => {
            return mongoose.connection;
        })
    }

    try {
        const conn = await cached.promise;
        return conn;

    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        throw error;
    }
}
export default connectDB;