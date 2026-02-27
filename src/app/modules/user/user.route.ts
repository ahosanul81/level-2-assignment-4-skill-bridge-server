import express from "express";
import { userController } from "./user.controller";
import { auth } from "../../middelware/auth";
import { UserRole } from "../../../../generated/prisma/enums";

const userRouter = express.Router();
userRouter.get("/:userId", userController.getSpecificUser);
userRouter.get(
  "/get/me",
  auth(UserRole.STUDENT, UserRole.ADMIN, UserRole.TUTOR),
  userController.getMe,
);
userRouter.post("/signup", userController.createUser);
userRouter.post("/login", userController.loginUser);
userRouter.post("/sign-out", userController.signOut);
userRouter.patch(
  "/update/:userId",
  auth(UserRole.STUDENT, UserRole.ADMIN, UserRole.TUTOR),
  userController.updateUser,
);

export default userRouter;
