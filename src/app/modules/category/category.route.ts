import express from "express";
import { categoryController } from "./category.controller";

const categoryRouter = express.Router();
categoryRouter.get("/", categoryController.getAllCategory);
categoryRouter.post("/create-category", categoryController.createCategory);
categoryRouter.delete(
  "/delete-category/:categoryId",
  categoryController.deleteCategory,
);

export default categoryRouter;
