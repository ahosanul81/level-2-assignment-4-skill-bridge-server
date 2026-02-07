import express from "express";
import { userController } from "./user.controller";
const userRouter = express.Router();
userRouter.get("/:userId", userController.getSpecificUser);
userRouter.post("/signup", userController.createUser);
userRouter.patch("/update/:userId", userController.updateUser);
export default userRouter;
