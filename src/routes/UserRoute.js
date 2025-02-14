import express from "express";
import { createUser, getAllUsers, searchUser, updateUser, deleteUser, getProfile } from "../controllers/UserController.js";

// Import Authenticate middleware correctly
import Authenticate from "../middlewares/Authentication.js";

const router = express.Router();

// Create User
router.post("/", Authenticate, createUser);

// Get All users
router.get("/",Authenticate, getAllUsers);

// Get User by either objectId or email or by userId
router.get("/search", Authenticate, searchUser);

// Update User
router.put("/:id",Authenticate, updateUser);

// Delete User
router.delete("/:id", Authenticate,deleteUser);

// Protect routes (optional example)
router.get("/profile", Authenticate, getProfile);

export default router;
