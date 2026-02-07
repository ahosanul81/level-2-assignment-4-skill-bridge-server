import { prisma } from "../../../lib/prisma";
import { AppError } from "../../middelware/AppError";
export const isExistUser = async (userId) => {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
        throw new AppError(400, "User not found");
    }
    return user;
};
