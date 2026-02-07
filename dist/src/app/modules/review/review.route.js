import express from "express";
import { reviewController } from "./review.controller";
import { auth } from "../../middelware/auth";
import { UserRole } from "../../../../generated/prisma/enums";
const reviewRouter = express.Router();
reviewRouter.get("/:tutorId", reviewController.getAllReviewByTutorId);
reviewRouter.post("/add-review", auth(UserRole.STUDENT), reviewController.addReview);
export default reviewRouter;
