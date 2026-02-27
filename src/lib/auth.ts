import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import config from "../config";

// export const auth = betterAuth({
//   database: prismaAdapter(prisma, {
//     provider: "postgresql",
//   }),

//   trustedOrigins: [
//     config.common.client_app_url!, // example: http://localhost:3000 OR https://yourdomain.com
//   ],

//   user: {
//     additionalFields: {
//       role: {
//         type: "string",
//         defaultValue: "STUDENT",
//         required: true,
//       },
//       status: {
//         type: "string",
//         defaultValue: "ACTIVE",
//       },
//       isActive: {
//         type: "boolean",
//         defaultValue: true,
//       },
//     },
//   },

//   // ⭐ VERY IMPORTANT SESSION CONFIG
//   session: {
//     expiresIn: 60 * 60 * 24 * 7, // ✅ session valid 7 days
//     updateAge: 60 * 60 * 24, // ✅ refresh session every 1 day

//     cookieCache: {
//       enabled: true,
//       maxAge: 60 * 5, // ✅ 5 min cache (recommended)
//     },
//   },

//   advanced: {
//     defaultCookieAttributes: {
//       sameSite: "none",
//       secure: true,
//     },
//     cookiePrefix: "better-auth",

//     // ✅ secure only in production
//     useSecureCookies: true, // must be true in prod (HTTPS)
//     crossSubDomainCookies: {
//       enabled: true, // allow cross-domain
//     },

//     disableCSRFCheck: true,
//   },

//   emailAndPassword: {
//     enabled: true,
//     autoSignIn: true,
//     requireEmailVerification: false,
//   },
// });

const isProd = config.common.node_env === "production";

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  trustedOrigins: [config.common.client_app_url!],

  user: {
    additionalFields: {
      role: { type: "string", defaultValue: "STUDENT", required: true },
      status: { type: "string", defaultValue: "ACTIVE" },
      isActive: { type: "boolean", defaultValue: true },
    },
  },

  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 minutes
    },
  },

  advanced: {
    cookiePrefix: "better-auth",
    useSecureCookies: process.env.NODE_ENV === "production",
    crossSubDomainCookies: {
      enabled: false,
    },
    disableCSRFCheck: true, // Allow requests without Origin header (Postman, mobile apps, etc.)
  },

  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    requireEmailVerification: false,
  },
});
