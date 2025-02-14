// src/controllers/ChatController.js
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Creating Chat
export const createChat = async (req, res) => {
  const { senderId, receiverId, message, fileId, fileName } = req.body;
  try {
    const chat = await prisma.chat.create({
      data: { senderId, receiverId, message, fileId, fileName },
      include: {
        // will return the name of sender and receiver along with name of file attached
        sender: { select: { id: true, username: true } },
        receiver: { select: { id: true, username: true } },
        file: { select: { id: true, fileName: true } },
      },
    });

    res.status(201).json(chat);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Searching the chats of user through Id
export const getChatsByUserId = async (req, res) => {
  const { Id } = req.params;
  try {
    const chats = await prisma.chat.findMany({
      where: {
        OR: [{ senderId: Id }, { receiverId: Id }],
      },
      orderBy: { createdAt: "desc" },
      include: {
        sender: true,
        receiver: true,
        file: true,
      },
    });

    if (!chats.length) {
      return res.status(404).json({ message: "No chats found" });
    }
    res.json(chats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Deleting Chats
export const deleteChat = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId;
  try {
    const chat = await prisma.chat.update({
      where: { id },
      data: { isDeleted: true, deletedAt: new Date() },
    });
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }
    res.json({ message: "Chat marked as deleted", chat });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
