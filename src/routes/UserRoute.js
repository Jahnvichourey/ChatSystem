import express from "express";
import { createUser, getAllUsers, searchUser, updateUser, deleteUser } from "../controllers/UserController.js";

const router = express.Router();

// Create User
router.post("/", createUser);

// Get All users
router.get("/", getAllUsers);

// Get User by either objectId or email or by userId
router.get("/search", searchUser);

// Update User
router.put("/:id", updateUser);

// Delete User
router.delete("/:id", deleteUser);

export default router;
