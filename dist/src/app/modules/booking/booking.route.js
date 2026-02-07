import express from "express";
import { bookingController } from "./booking.controller";
import { auth } from "../../middelware/auth";
import { UserRole } from "../../../../generated/prisma/enums";
const bookingRouter = express.Router();
bookingRouter.get("/", auth(UserRole.TUTOR, UserRole.ADMIN), bookingController.getAllBookings);
bookingRouter.post("/booking-session", auth(UserRole.STUDENT), bookingController.bookingSession);
bookingRouter.patch("/booking-session/update/:bookingId", auth(UserRole.TUTOR, UserRole.ADMIN), bookingController.updateBookingStatus);
export default bookingRouter;
