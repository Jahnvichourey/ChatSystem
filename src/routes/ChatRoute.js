import express from "express";
import { createChat, getChatsByUserId, deleteChat } from "../controllers/ChatController.js";
import Authenticate from "../middlewares/Authentication.js"
const router = express.Router();

// Creating chat
router.post("/", Authenticate,createChat);

// Searching the chats of user through Id
router.get("/:Id", Authenticate, getChatsByUserId);

// Deleting Chats
router.delete("/:id",Authenticate, deleteChat);

export default router;