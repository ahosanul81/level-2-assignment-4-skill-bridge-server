import { UserRole } from "../../../../generated/prisma/enums";
import { prisma } from "../../../lib/prisma";
import { auth } from "../../../lib/auth";
import { isExistUser } from "./user.utils";
const getSpecificUserFromDB = async (userId) => {
    const user = await isExistUser(userId);
    switch (user.role) {
        case UserRole.TUTOR:
            const tutor = await prisma.tutor.findUnique({
                where: { userId },
                include: {
                    user: { select: { name: true, role: true } },
                    slot: { select: { id: true, startTime: true, endTime: true } },
                    category: { select: { name: true } },
                },
            });
            return tutor;
        case UserRole.STUDENT:
            const student = await prisma.student.findUnique({
                where: { userId },
                include: {
                    user: { select: { name: true, role: true } },
                },
            });
            console.log(student);
            return student;
        case UserRole.ADMIN:
            const admin = await prisma.admin.findUnique({
                where: { userId },
                include: {
                    user: { select: { name: true, role: true } },
                },
            });
            return admin;
        default:
            break;
    }
};
const createUserIntoDB = async (payload) => {
    const { name, email, password, role } = payload;
    let userId = null;
    try {
        const user = await auth.api.signUpEmail({
            body: {
                name,
                email,
                password,
                role,
            },
        });
        userId = user.user.id;
        await prisma.user.update({
            where: { id: userId },
            data: { emailVerified: true },
        });
        switch (role) {
            case UserRole.STUDENT:
                await prisma.student.create({
                    data: { userId },
                });
                break;
            case UserRole.TUTOR:
                await prisma.tutor.create({
                    data: { userId },
                });
                break;
            case UserRole.ADMIN:
                await prisma.admin.create({
                    data: { userId },
                });
                break;
        }
        return user;
    }
    catch (error) {
        if (userId) {
            await prisma.user.delete({
                where: { id: userId },
            });
        }
        throw error;
    }
};
const updateUserIntoDB = async (userId, payload) => {
    const user = await isExistUser(userId);
    switch (user.role) {
        case UserRole.STUDENT:
            const student = await prisma.student.update({
                where: { userId },
                data: payload,
            });
            return student;
        case UserRole.TUTOR:
            const tutor = await prisma.tutor.update({
                where: { userId },
                data: payload,
            });
            return tutor;
        case UserRole.ADMIN:
            const admin = await prisma.admin.update({
                where: { userId },
                data: payload,
            });
            return admin;
    }
};
export const userService = {
    getSpecificUserFromDB,
    createUserIntoDB,
    updateUserIntoDB,
};
