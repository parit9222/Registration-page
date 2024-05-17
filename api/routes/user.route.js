import express from "express";
import { deleteUser, details, getCurrentUser, registration, updateUser } from "../controllers/user.controller.js";

const router = express.Router();

router.post('/reg', registration);
router.get('/details', details);
router.delete('/delete/:id', deleteUser);
router.put('/update/:id', updateUser);
router.get('/current_user/:id', getCurrentUser);


export default router;