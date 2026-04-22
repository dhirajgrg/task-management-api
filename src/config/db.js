import dns from "dns";
import mongoose from "mongoose";

dns.setServers(["8.8.8.8", "8.8.4.4"]);

const mongo_uri = process.env.MONGO_URI.replace(
  "<db_password>",
  process.env.DB_PASSWORD,
);

const connectDB=async()=>{
    try {
        const conn=await mongoose.connect(mongo_uri)
        console.log(`MongoDB Connected: ${conn.connection.host}`)
    } catch (error) {
        console.error(`unable to connect to database: ${error.message}`);
        process.exit(1);
    }
}

export default connectDB;