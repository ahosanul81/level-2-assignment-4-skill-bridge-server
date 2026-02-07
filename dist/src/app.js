import { toNodeHandler } from "better-auth/node";
import express from "express";
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
const app = express();
app.use(cors({
    origin: config.common.client_app_url || "http://localhost:3000", // client side url
    credentials: true,
}));
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
