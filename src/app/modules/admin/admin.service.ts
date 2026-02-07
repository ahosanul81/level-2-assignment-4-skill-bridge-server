import { BookingStatus } from "../../../../generated/prisma/enums";
import { prisma } from "../../../lib/prisma";
import { AppError } from "../../middelware/AppError";

const getAllBokingFromDB = async () => {
  const result = await prisma.booking.findMany();
  if (!result) {
    throw new AppError(404, "No booking found");
  }
  return result;
};

export const adminService = { getAllBokingFromDB };
