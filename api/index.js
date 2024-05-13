import express from "express";
import mongoose from "mongoose";
import dotenv from 'dotenv';
import registration from './routes/user.route.js';
import bodyParser from "body-parser";
import { fileURLToPath } from 'url'; // Import fileURLToPath
import path from "path";
dotenv.config();

// Get the directory name using fileURLToPath and dirname
const __dirname = path.dirname(fileURLToPath(import.meta.url));

mongoose.connect(process.env.MONGO).then(() => {
    console.log("Connected with MongoDB!");
}).catch((err) => {
    console.log(err);
});

const app = express();
app.use(express.json());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false }))
app.use(express.urlencoded({ limit: '10mb', extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

app.listen(3000, () => {
    console.log("Server is running on port 3000!");
});

app.use('/api/user', registration);
