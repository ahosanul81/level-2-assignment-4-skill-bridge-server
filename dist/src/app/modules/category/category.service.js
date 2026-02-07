import { prisma } from "../../../lib/prisma";
import { AppError } from "../../middelware/AppError";
const getAllCategoryFromDB = async () => {
    const result = await prisma.category.findMany();
    if (!result) {
        throw new AppError(404, "No category found");
    }
    return result;
};
const createCategoryIntoDB = async (payload) => {
    payload.slug = payload.name.trim().split(" ").join("-");
    const result = prisma.category.create({ data: payload });
    return result;
};
const deleteCategoryFromDB = async (categoryId) => {
    const result = await prisma.category.delete({ where: { id: categoryId } });
    return result;
};
export const categoryService = {
    getAllCategoryFromDB,
    createCategoryIntoDB,
    deleteCategoryFromDB,
};
