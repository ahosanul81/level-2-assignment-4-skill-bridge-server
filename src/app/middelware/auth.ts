import { NextFunction, Request, Response } from "express";
import { auth as betterAuth } from "../../lib/auth";
import { UserRole } from "../../../generated/prisma/enums";

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
      // console.log(req.headers);

      const session = await betterAuth.api.getSession({
        headers: req.headers as any,
      });
      // console.log(session);
      if (!session) {
        res.status(402).json({
          success: false,
          message: "You are not authorized user!",
        });
      }
      if (!session?.user.emailVerified) {
        res.status(402).json({
          success: false,
          message: "Your email verifaction required",
        });
      }
      req.user = {
        id: session?.user?.id as string,
        email: session?.user?.email as string,
        name: session?.user?.name as string,
        role: session?.user?.role as string,
        emailVerified: session?.user?.emailVerified as boolean,
      };

      if (roles && !roles.includes(req.user.role as UserRole)) {
        res.status(402).json({
          success: false,
          message: "You are not authorized user!!",
        });
      }

      next();
    } catch (error) {
      console.log(error);
    }
  };
};
