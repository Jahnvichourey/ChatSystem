import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Create User
export const createUser = async (req, res) => {
  const { userId, username, email } = req.body;
  try {
    const user = await prisma.user.create({
      data: { userId, username, email },
    });
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get All users
export const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get User by either objectId or email or by userId
export const searchUser = async (req, res) => {
  const { _id, email, userId } = req.query; // database attributes
  try {
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { id: _id }, //
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
};

// Update User
export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { username, email, userId } = req.body;
  try {
    const user = await prisma.user.update({
      where: { id },
      data: { username, email, userId },
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Deleting a User
export const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await prisma.user.delete({ where: { id } });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
