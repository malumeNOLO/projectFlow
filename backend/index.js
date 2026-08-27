import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import morgan from "morgan";

import routes from "./routes/index.js";

dotenv.config();
console.log(process.env.FRONTEND_URL);

const app = express();

app.use((req,res,next)=>{

    console.log("---------------");
    console.log("METHOD :",req.method);
    console.log("URL :",req.url);
    console.log("---------------");

    next();

});

app.use(express.json());
app.use(cors({
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));


app.use(morgan("dev"));

//db connection


mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB Connected Successfully.");
    })
    .catch((error) => {
        console.log("Error connecting to MongoDB", error);
    });


const Port = process.env.Port || 5000;

app.get("/", async(req, res) => {
    res.send("Welcome to the ProjectFlow API");
});

//http://localhost:5000/api-v1/auth/register
app.use("/api-v1", routes);

//error middleware
app.use((err, req, res, next) => {
    console.log(err);
    res.status(500).json({
        message: "Internal Server Error"
    });
});

//not found middleware
app.use((req, res, next) => {
    res.status(404).json({
        message: "Route not found"
    });

});



app.listen(Port, async () => {
    console.log(`Server is running on port ${Port}`);
});
