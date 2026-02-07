import { prisma } from "../../../lib/prisma";
import { AppError } from "../../middelware/AppError";
import { isExistCategory } from "../category/category.utils";
import { isExistSlot } from "../slot/slot.utils";
import { isExistStudentByUserId } from "../student/student.utils";
import { isExistTutor } from "../tutor/tutor.utils";
const getAllBookingsFromDB = async () => {
    const result = await prisma.booking.findMany({
        select: {
            id: true,
            student: { select: { id: true, name: true } },
            tutor: { select: { id: true, name: true } },
            slot: { select: { startTime: true, endTime: true } },
            category: { select: { name: true } },
            status: true,
            createdAt: true,
            updatedAt: true,
        },
    });
    return result;
};
const bookingSessionIntoDB = async (payload) => {
    const { studentId, categoryId, slotId, tutorId } = payload;
    console.log(payload);
    await isExistStudentByUserId(studentId);
    await isExistCategory(categoryId);
    await isExistTutor(tutorId);
    await isExistSlot(slotId);
    const result = await prisma.booking.create({ data: payload });
    return result;
};
const updateBookingStatusIntoDB = async (bookingId, status) => {
    // console.log(bookingId, status);
    const isExistBooking = await prisma.booking.findUnique({
        where: { id: bookingId },
    });
    if (!isExistBooking) {
        throw new AppError(404, "Booking not found");
    }
    const result = await prisma.booking.update({
        where: { id: bookingId },
        data: { status },
    });
    return result;
};
export const bookingSerive = {
    getAllBookingsFromDB,
    bookingSessionIntoDB,
    updateBookingStatusIntoDB,
};
