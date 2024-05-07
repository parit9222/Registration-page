import express from "express";
import mongoose from "mongoose";
import dotenv from 'dotenv';
import registration from './routes/user.route.js'
dotenv.config();

mongoose.connect(process.env.MONGO).then(() => {
    console.log("Connected with MongoDB!");
}).catch((err) => {
    console.log(err);
});

const app = express();
app.use(express.json());

app.listen(3000, () => {
    console.log("Server is runing on  port 3000!");
});

app.use('/api/user', registration);