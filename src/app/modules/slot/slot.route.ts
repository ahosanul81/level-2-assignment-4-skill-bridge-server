import express from "express";
import { slotController } from "./slot.controller";

const slotRouter = express.Router();

slotRouter.get("/", slotController.getAllSlot);
slotRouter.post("/add", slotController.createSlot);
export default slotRouter;
