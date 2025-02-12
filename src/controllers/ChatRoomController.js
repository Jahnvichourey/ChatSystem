import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Creating chatroom
export const createChatRoom = async (req, res) => {
  const { userId } = req.body;
  try {
    const chatRoom = await prisma.chatRoom.create({
      data: {
        members: {
          create: userId.map((userId) => ({
            user: { connect: { id: userId } }, // connecting users to room
          })),
        },
      },
      include: {
        members: {
          select: {
            user: { select: { id: true, username: true } }, // returning the users
          },
        },
      },
    });
    res.status(201).json(chatRoom);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Getting all the chatroom associated with particular id
export const getChatRoomsByUserId = async (req, res) => {
  const { userId } = req.params;
  try {
    const chatRooms = await prisma.chatRoom.findMany({
      where: {
        members: { some: { userId } },
      },
      include: {
        members: {
          select: {
            user: { select: { id: true, username: true } }, // Return usernames
          },
        },
      },
    });
    res.json(chatRooms);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Deleting the room
export const deleteChatRoom = async (req, res) => {
  const { chatRoomId } = req.params;

  try {
    await prisma.chatRoomUser.deleteMany({ where: { chatRoomId } });
    const chatRoom = await prisma.chatRoom.delete({
      where: { id: chatRoomId },
    });
    res.json({ message: "Chat room deleted", chatRoom });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
