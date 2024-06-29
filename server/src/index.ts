import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoute from "./routes/auth";

dotenv.config()
const app=express();

app.use(express.json());

app.use(cors())

app.use('/auth',authRoute)

const PORT=process.env.PORT

app.listen(PORT,() => {
    console.log(`Server is running on ${PORT}`);
})