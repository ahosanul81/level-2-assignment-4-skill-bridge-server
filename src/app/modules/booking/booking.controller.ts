import { BookingStatus } from "../../../../generated/prisma/enums";
import { catchAsync } from "../../middelware/catchAsync";
import sendResponse from "../../middelware/sendResponse";
import { bookingSerive } from "./booking.service";

const getAllBookings = catchAsync(async (req, res, next) => {
  try {
    const result = await bookingSerive.getAllBookingsFromDB();
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Get all Booking succesfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
});
const bookingSession = catchAsync(async (req, res, next) => {
  try {
    const result = await bookingSerive.bookingSessionIntoDB(req.body);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Booking session succesfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
});

const updateBookingStatus = catchAsync(async (req, res, next) => {
  try {
    const result = await bookingSerive.updateBookingStatusIntoDB(
      req.params.bookingId as string,
      req.body.status as BookingStatus,
    );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Update Booking status succesfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
});

export const bookingController = {
  getAllBookings,
  bookingSession,
  updateBookingStatus,
};
