import express from "express";
import { tutorController } from "./tutor.controller";

const tutorRouter = express.Router();

tutorRouter.get("/", tutorController.getAllTutor);
tutorRouter.get("/:tutorId", tutorController.getSpecificTutor);

export default tutorRouter;
