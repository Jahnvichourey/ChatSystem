import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Creating file record
export const createFile = async (req, res) => {
  const { fileName, urlLocation, fileDescription, fileType } = req.body;
  try {
    const file = await prisma.file.create({
      data: { fileName, urlLocation, fileDescription, fileType },
    });
    res.status(201).json(file);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Searching through Id or Name
export const searchFile = async (req, res) => {
  const { _id, fileName } = req.query;
  try {
    const file = await prisma.file.findFirst({
      where: {
        OR: [
          { id: _id },
          { fileName: fileName },
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
};

// Deleting File
export const deleteFile = async (req, res) => {
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
};
