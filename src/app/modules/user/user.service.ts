import { UserRole } from "../../../../generated/prisma/enums";
import { prisma } from "../../../lib/prisma";
import { auth } from "../../../lib/auth";
import { Admin, Student, Tutor } from "../../../../generated/prisma/browser";
import { isExistUser } from "./user.utils";
import { AppError } from "../../middelware/AppError";
import jwt, { Secret } from "jsonwebtoken";
import config from "../../../config";
const getSpecificUserFromDB = async (userId: string) => {
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

const createUserIntoDB = async (payload: {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}) => {
  const { name, email, password, role } = payload;

  let userId: string | null = null;
  try {
    const user = await prisma.user.create({ data: payload });

    userId = user.id;
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
    if (user.id) {
      if (!config.jwt.access_token_secret) {
        return;
      }
      const accessToken = jwt.sign(
        { email, role: user.role },
        config.jwt.access_token_secret as string,
        {
          expiresIn: config.jwt
            .access_token_expires_in as jwt.SignOptions["expiresIn"],
        },
      );

      return { accessToken };
    }
  } catch (error) {
    if (userId) {
      await prisma.user.delete({
        where: { id: userId },
      });
    }
    throw error;
  }
};
const loginUserIntoDB = async (payload: {
  email: string;
  password: string;
}) => {
  const { email, password } = payload;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new AppError(404, "User not found");
  }

  if (user.password !== password) {
    throw new AppError(404, "Password doesn't match");
  }

  if (!config.jwt.access_token_secret) {
    return;
  }
  const accessToken = jwt.sign(
    { email, role: user.role },
    config.jwt.access_token_secret as string,
    {
      expiresIn: config.jwt
        .access_token_expires_in as jwt.SignOptions["expiresIn"],
    },
  );

  return { accessToken };
};

const updateUserIntoDB = async (
  userId: string,
  payload: Tutor | Student | Admin,
) => {
  // console.log(payload);
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
const getMeFromDB = async (email: string) => {
  // console.log(email);
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new AppError(404, "User not found");
  }
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    emailVerified: user.emailVerified,
    image: user.image,
    role: user.role,
    status: user.status,
    isActive: user.isActive,
  };
};

export const userService = {
  getSpecificUserFromDB,
  createUserIntoDB,
  loginUserIntoDB,
  updateUserIntoDB,
  getMeFromDB,
};
