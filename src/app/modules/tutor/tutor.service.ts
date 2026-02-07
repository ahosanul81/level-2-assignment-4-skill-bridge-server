import { TutorWhereInput } from "../../../../generated/prisma/models";
import { prisma } from "../../../lib/prisma";
import { AppError } from "../../middelware/AppError";

const getAllTutorFromDB = async (query: {
  name: string;
  hourlyRate: string;
  experienceYear: string;
  isVerified: string;
  categoryName: string;
}) => {
  const { name, hourlyRate, experienceYear, isVerified, categoryName } = query;

  const andCondition: TutorWhereInput[] = [];
  if (name) {
    // andCondition.push({ name });
    andCondition.push({ name: { contains: name, mode: "insensitive" } });
  }
  if (hourlyRate) {
    const formated = hourlyRate.split("-");
    andCondition.push({
      hourlyRate: { gte: Number(formated[0]), lte: Number(formated[1]) },
    });
  }
  if (experienceYear) {
    const formated = experienceYear.split("-");
    andCondition.push({
      experienceYear: { gte: Number(formated[0]), lte: Number(formated[1]) },
    });
  }
  if (isVerified) {
    andCondition.push({ isVerified: isVerified === "true" ? true : false });
  }
  if (categoryName) {
    andCondition.push({
      category: { name: { equals: categoryName, mode: "insensitive" } },
    });
  }

  const result = await prisma.tutor.findMany({
    where: {
      AND: andCondition,
    },

    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { id: true, email: true } },
      category: { select: { id: true, name: true } },
      slot: { select: { id: true, startTime: true, endTime: true } },
    },
  });

  return result;
};

const getSpecificTutor = async (tutorId: string) => {
  const tutor = await prisma.tutor.findUnique({
    where: { id: tutorId },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          role: true,
          status: true,
          isActive: true,
        },
      },
    },
  });
  if (!tutor) {
    throw new AppError(404, "This tutor has not found");
  }
  return tutor;
};

export const tutorService = {
  getAllTutorFromDB,
  getSpecificTutor,
};
