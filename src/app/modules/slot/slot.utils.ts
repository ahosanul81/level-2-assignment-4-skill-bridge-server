import { prisma } from "../../../lib/prisma";
import { AppError } from "../../middelware/AppError";

export const isExistSlot = async (slotId: string) => {
  const slot = await prisma.slot.findUnique({
    where: { id: slotId },
  });
  if (!slot) {
    throw new AppError(404, "This slot has not found");
  }
  return slot;
};
