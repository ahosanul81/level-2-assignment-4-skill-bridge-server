import { auth as betterAuth } from "../../lib/auth";
export const auth = (...roles) => {
    return async (req, res, next) => {
        try {
            // console.log(req.headers);
            const session = await betterAuth.api.getSession({
                headers: req.headers,
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
                id: session?.user?.id,
                email: session?.user?.email,
                name: session?.user?.name,
                role: session?.user?.role,
                emailVerified: session?.user?.emailVerified,
            };
            if (roles && !roles.includes(req.user.role)) {
                res.status(402).json({
                    success: false,
                    message: "You are not authorized user!!",
                });
            }
            next();
        }
        catch (error) {
            console.log(error);
        }
    };
};
