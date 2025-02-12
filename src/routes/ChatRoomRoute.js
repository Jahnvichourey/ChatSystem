import express from "express";
import { createChatRoom, getChatRoomsByUserId, deleteChatRoom } from "../controllers/ChatRoomController.js";

const router = express.Router();

// Creating chatroom
router.post("/", createChatRoom);

// Getting all the chatroom associated with particular id
router.get("/:userId", getChatRoomsByUserId);

// Deleting the room
router.delete("/:chatRoomId", deleteChatRoom);

export default router;
