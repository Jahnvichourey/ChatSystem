import express from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const app = express();
app.use(express.json());

// Create User
app.post("/user", async (req, res) => {
  const { userId, username, email } = req.body;
  try {
    const user = await prisma.user.create({
      data: { userId, username, email },
    });
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//Get All user
app.get("/user", async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});

// Get User by either objectIdor email or by userId
app.get("/user/search", async (req, res) => {
  const { _id,email, userId } = req.query;// database attributes
  try {
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          {id: _id},//
          { email: email },
          { userId: userId },
        ],
      },
    });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update User
app.put("/user/:id", async (req, res) => {
  const { id } = req.params;
  const { username, email, userId  } = req.body;
  try {
    const user = await prisma.user.update({
      where: { id },
      data: { username, email, userId },
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//Deleting a User
app.delete("/user/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const user = await prisma.user.delete({ where: { id } });
    res.json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});

//creating file record
app.post ("/file",async(req,res)=>{
  const {fileName,urlLocation, fileDescription, fileType } = req.body;
  try {
    const file = await prisma.file.create({
    data: { fileName, urlLocation, fileDescription, fileType },
    });
      res.status(201).json(file);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//Searching through Id or Name
app.get("/file/search", async (req, res) => {
  const { _id,fileName } = req.query;
  try {
    const file = await prisma.file.findFirst({
      where: { 
        OR:[
          {id:_id},
          {fileName:fileName}
        ],
      },
    });
    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }
    res.json(file);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//Deleteing File
app.delete("/file/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const file = await prisma.file.update({
      where: { id },
      data: { isDeleted: true, deletedAt: new Date() },
    });

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    res.json({ message: "File marked as deleted", file });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//Creating Chat
app.post("/chat", async (req, res) => {
  const { senderId, receiverId, message, fileId ,fileName} = req.body;
  try {
    const chat = await prisma.chat.create({
      data: { senderId, receiverId, message, fileId, fileName },
      include: {//will return the name of sender and receiver along with name of file attacted 
        sender: { select: { id: true, username: true } }, 
        receiver: { select: { id:true, username:true } },
        file : {select:{id:true, fileName: true}},
      },
    });

    res.status(201).json(chat);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// Searching the chats  of user through Id
app.get("/chat/:Id", async (req, res) => {
  const { Id } = req.params;
  try {
    const chats = await prisma.chat.findMany({
      where: {
        OR: [{ senderId: Id }, { receiverId: Id }],
      },
      orderBy: { createdAt: "desc" },
      include: {sender: true,receiver: true, file: true, 
      },
    });

    if (!chats.length) {
      return res.status(404).json({ message: "No chats found" });
    }res.json(chats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//Deleting Chats
app.delete("/chat/:id", async (req, res) => {
  const { id } = req.params;
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
});
//Creating chatroom
app.post("/chatroom", async (req, res) => {
  const { userId } = req.body; 
  try {
    const chatRoom = await prisma.chatRoom.create({
      data: {
        members: {create: userId.map((userId) => ({
            user: { connect: { id: userId } }, // connecting users to room
          })),
        },
      },
      include: {
        members: {select: {user: { select: { id: true, username: true } },//returning the users
          },
        },
      },
    });
    res.status(201).json(chatRoom);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
//getting all the chatroom associated with particular id
app.get("/chatrooms/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const chatRooms = await prisma.chatRoom.findMany({
      where: {members: {some: { userId },},
      },
      include: {members: {select: {
            user: { select: { id: true, username: true } }, // Return usernames
          },},
      },
    });
    res.json(chatRooms);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//deleting the room
app.delete("/chatroom/:chatRoomId", async (req, res) => {
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
});

// Start Server
app.listen(3000, () => {
  console.log("Server running on port 3000");
});
