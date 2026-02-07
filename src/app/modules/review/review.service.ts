import { prisma } from "../../../lib/prisma";
import { isExistStudentByUserId } from "../student/student.utils";
import { isExistTutor } from "../tutor/tutor.utils";

const getAllReviewByTutorIdFromDB = async (tutorId: string) => {
  await isExistTutor(tutorId);
  const result = await prisma.review.findMany({
    where: { tutorId },
    include: { student: { select: { name: true, profilePhoto: true } } },
  });
  return result;
};

const addReviewIntoDB = async (payload: {
  userId: string;
  tutorId: string;
  rating: number;
  comment: string;
}) => {
  const { userId, tutorId } = payload;

  const student = await isExistStudentByUserId(userId);
  await isExistTutor(tutorId);
  const payloadData = {
    studentId: student.id,
    tutorId: payload.tutorId,
    rating: payload.rating,
    comment: payload.comment,
  };
  const result = await prisma.review.create({ data: payloadData });
  return result;
};

export const reviewService = { getAllReviewByTutorIdFromDB, addReviewIntoDB };
