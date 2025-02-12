import express from "express";
import { createChat, getChatsByUserId, deleteChat } from "../controllers/ChatController.js";

const router = express.Router();

// Creating chat
router.post("/", createChat);

// Searching the chats of user through Id
router.get("/:Id", getChatsByUserId);

// Deleting Chats
router.delete("/:id", deleteChat);

export default router;