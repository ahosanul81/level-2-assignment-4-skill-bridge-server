import { toNodeHandler } from "better-auth/node";
import express, { Application } from "express";
import cors from "cors";
import { auth } from "./lib/auth";
import config from "./config";
import categoryRouter from "./app/modules/category/category.route";
import userRouter from "./app/modules/user/user.route";
import tutorRouter from "./app/modules/tutor/tutor.route";
import studentRouter from "./app/modules/student/student.route";
import slotRouter from "./app/modules/slot/slot.route";
import adminRouter from "./app/modules/admin/admin.route";
import bookingRouter from "./app/modules/booking/booking.route";
import reviewRouter from "./app/modules/review/review.route";
const app: Application = express();
// app.use(
//   cors({
//     origin: config.common.client_app_url || "http://localhost:3000", // client side url
//     credentials: true,
//   }),
// );
// Configure CORS to allow both production and Vercel preview deployments
const allowedOrigins = [
  process.env.APP_URL || "http://localhost:3000",
  process.env.PROD_APP_URL, // Production frontend URL
].filter(Boolean); // Remove undefined values

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, Postman, etc.)
      if (!origin) return callback(null, true);

      // Check if origin is in allowedOrigins or matches Vercel preview pattern
      const isAllowed =
        allowedOrigins.includes(origin) ||
        /^https:\/\/next-blog-client.*\.vercel\.app$/.test(origin) ||
        /^https:\/\/.*\.vercel\.app$/.test(origin); // Any Vercel deployment

      if (isAllowed) {
        callback(null, true);
      } else {
        callback(new Error(`Origin ${origin} not allowed by CORS`));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
    exposedHeaders: ["Set-Cookie"],
  }),
);

app.use(express.json());

app.all("/api/auth/*splat", toNodeHandler(auth));

app.use("/api/v1/category", categoryRouter);
app.use("/api/v1/slot", slotRouter);
app.use("/api/v1/booking", bookingRouter);
app.use("/api/v1/tutor", tutorRouter);
app.use("/api/v1/review", reviewRouter);
app.use("/api/v1/student", studentRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/user", userRouter);

app.get("/", (req, res) => {
  res.send("Skill Bridge server is running");
});

export default app;
