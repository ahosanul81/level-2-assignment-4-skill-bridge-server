import { prisma } from "../../../lib/prisma";
import { AppError } from "../../middelware/AppError";

export const isExistBooking = async (bookingId: string) => {
  const result = await prisma.booking.findUnique({ where: { id: bookingId } });
  if (!result) {
    throw new AppError(404, "Booking not found");
  }
};
