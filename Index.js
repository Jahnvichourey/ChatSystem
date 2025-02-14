import dotenv from 'dotenv';

dotenv.config();
import express from "express";
import { PrismaClient } from "@prisma/client";
import UserRoute from "./src/routes/UserRoute.js";
import FileRoute from "./src/routes/FileRoute.js";
import ChatRoute from "./src/routes/ChatRoute.js";
import ChatRoomRoute from "./src/routes/ChatRoomRoute.js";
import AuthenticateRoute from "./src/routes/Authenticate.js";
const prisma = new PrismaClient();
const app = express();
app.use(express.json());


app.use("/auth", AuthenticateRoute);
app.use("/user", UserRoute);
app.use("/file", FileRoute);
app.use("/chat", ChatRoute);
app.use("/chatroom", ChatRoomRoute);

// Start Server
app.listen(3000, () => {
  console.log("Server running on port 3000");
});