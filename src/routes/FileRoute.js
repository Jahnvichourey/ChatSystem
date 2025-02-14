import express from "express";
import { createFile, searchFile, deleteFile } from "../controllers/FileController.js";
import Authenticate from "../middlewares/Authentication.js"
const router = express.Router();

// Creating file record
router.post("/",Authenticate, createFile);

// Searching through Id or Name
router.get("/search",Authenticate, searchFile);

// Deleting File
router.delete("/:id",Authenticate, deleteFile);

export default router;
