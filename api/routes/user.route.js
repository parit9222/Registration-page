import express from "express";
import { deleteUser, details, getCurrentUser, registration, updateUser } from "../controllers/user.controller.js";

const router = express.Router();

router.post('/reg', registration);
router.get('/details', details);
router.put('/update/:id', updateUser);
router.delete('/delete/:id', deleteUser);
router.get('/current_user/:id', getCurrentUser);


export default router;