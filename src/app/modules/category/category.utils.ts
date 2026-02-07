import { prisma } from "../../../lib/prisma";
import { AppError } from "../../middelware/AppError";

export const isExistCategory = async (categoryId: string) => {
  const category = await prisma.category.findUnique({
    where: { id: categoryId },
  });
  if (!category) {
    throw new AppError(404, "This category has not found");
  }
  return category;
};
