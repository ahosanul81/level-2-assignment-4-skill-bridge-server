import express from "express";
import { studentController } from "./student.controller";
const studentRouter = express.Router();
studentRouter.get("/", studentController.getAllStudent);
export default studentRouter;
