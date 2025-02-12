import express from "express";
import { createFile, searchFile, deleteFile } from "../controllers/FileController.js";

const router = express.Router();

// Creating file record
router.post("/", createFile);

// Searching through Id or Name
router.get("/search", searchFile);

// Deleting File
router.delete("/:id", deleteFile);

export default router;
