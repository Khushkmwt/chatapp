import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import cors from "cors";
import authRoutes from "./routes/auth.route.js";
import contactRoutes from "./routes/contact.route.js";
import setupSocket from "./socket.js";
import messagesRoutes from "./routes/messages.route.js";
import channelRoutes from "./routes/channel.route.js";

dotenv.config()
const app = express()
const port = process.env.port || 3001
const databaseUrl = process.env.DATABASE_URL
app.use(cors({
    origin:[process.env.ORIGIN],
    methods:["Get","Post","Petch","Put" ,"DELETE"],
    credentials:true
}))
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", process.env.ORIGIN); // Must match Vercel's URL
    res.header("Access-Control-Allow-Credentials", "true");       // Required for cookies
    res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,PATCH,OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    
    if (req.method === "OPTIONS") {
        return res.sendStatus(200); // Properly handle preflight
    }

    next();
});

app.use("/uploads/profiles",express.static("uploads/profiles"))
app.use("/uploads/files",express.static("uploads/files"))
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use("/api/auth",authRoutes)
app.use("/api/contacts" ,contactRoutes)
app.use("/api/messages" ,messagesRoutes)
app.use("/api/channel",channelRoutes)
const server = app.listen(port,() =>{
    console.log(`Server is running on port ${port}`)
});
setupSocket(server)

mongoose.connect(databaseUrl).then(() =>{
    console.log("Connected to database")
}).catch(
    (err) =>{
        console.log(err)
    }
)