import { prisma } from "../../../lib/prisma";
import { AppError } from "../../middelware/AppError";
export const isExistStudentByUserId = async (studentId) => {
    const student = await prisma.student.findUnique({
        where: { userId: studentId },
    });
    if (!student) {
        throw new AppError(404, "This student has not found");
    }
    return student;
};
