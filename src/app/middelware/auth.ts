import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { UserRole } from "../../../generated/prisma/enums";
import config from "../../config";
import { AppError } from "./AppError";
import { prisma } from "../../lib/prisma";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        name: string;
        role: string;
        emailVerified: boolean;
      };
    }
  }
}
export const auth = (...roles: UserRole[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // console.log(req.headers.cookie);
      const token = req.headers.cookie?.split("=")[1].split(";")[0];
      // const token = req.cookies?.accessToken;
      // if (!token) {
      //   throw new AppError(404, "Token not found");
      // }
      // console.log(token);
      if (token) {
        const decoded = jwt.verify(
          token,
          config.jwt.access_token_secret as string,
        );
        const payload = decoded as IJwtPayload;

        const user = await prisma.user.findUnique({
          where: { email: payload.email },
        });
        if (!user) {
          throw new AppError(404, "You are not authorized");
        }
        req.user = {
          id: user.id,
          email: user.email,
          name: user?.name as string,
          role: user.role,
          emailVerified: user.emailVerified,
        };

        if (roles && !roles.includes(user?.role as UserRole)) {
          res.status(402).json({
            success: false,
            message: "You are not authorized user!",
          });
        }

        next();
      }
    } catch (error) {
      next(error);
    }
  };
};
