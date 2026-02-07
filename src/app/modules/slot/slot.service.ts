import { prisma } from "../../../lib/prisma";
import { AppError } from "../../middelware/AppError";

const getAllSlotFromDB = async () => {
  const result = await prisma.slot.findMany();
  if (!result) {
    throw new AppError(404, "No slot found");
  }

  return result;
};

const createSlotIntoDB = async (payload: {
  startTime: string;
  endTime: string;
}) => {
  const result = await prisma.slot.create({ data: payload });
  return result;
};
export const slotService = { getAllSlotFromDB, createSlotIntoDB };
