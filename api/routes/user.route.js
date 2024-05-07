import express from "express";
import { registration } from "../controllers/user.controller.js";

const router = express.Router();

router.post('/reg', registration);

export default router;