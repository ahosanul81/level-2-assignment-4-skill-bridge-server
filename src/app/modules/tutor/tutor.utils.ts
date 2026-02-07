import { prisma } from "../../../lib/prisma";
import { AppError } from "../../middelware/AppError";

export const isExistTutor = async (tutorId: string) => {
  const tutor = await prisma.tutor.findUnique({
    where: { id: tutorId },
  });
  if (!tutor) {
    throw new AppError(404, "This tutor has not found");
  }
  return tutor;
};
