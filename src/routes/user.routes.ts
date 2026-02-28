import express from "express";
import { getAllUsers, deleteUser } from "../controllers/authentication/user.controller";

const Userrouter = express.Router();



Userrouter.get("/users", getAllUsers);
Userrouter.delete("/users/:id", deleteUser);

export default Userrouter;