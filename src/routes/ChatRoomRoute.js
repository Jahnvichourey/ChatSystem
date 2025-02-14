import express from "express";
import { createChatRoom, getChatRoomsByUserId, deleteChatRoom } from "../controllers/ChatRoomController.js";
import Authenticate from "../middlewares/Authentication.js"
const router = express.Router();

// Creating chatroom
router.post("/", Authenticate,createChatRoom);

// Getting all the chatroom associated with particular id
router.get("/:userId", Authenticate, getChatRoomsByUserId);

// Deleting the room
router.delete("/:chatRoomId", Authenticate, deleteChatRoom);

export default router;
