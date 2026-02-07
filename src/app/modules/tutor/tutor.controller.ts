import { BookingStatus } from "../../../../generated/prisma/enums";
import { catchAsync } from "../../middelware/catchAsync";
import sendResponse from "../../middelware/sendResponse";
import { tutorService } from "./tutor.service";

const getAllTutor = catchAsync(async (req, res, next) => {
  try {
    const result = await tutorService.getAllTutorFromDB(
      req.query as {
        name: string;
        hourlyRate: string;
        experienceYear: string;
        isVerified: string;
        categoryName: string;
      },
    );
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "All tutor fetched succesfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
});
const getSpecificTutor = catchAsync(async (req, res, next) => {
  try {
    const result = await tutorService.getSpecificTutor(
      req.params.tutorId as string,
    );
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Specific tutor fetched succesfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
});

export const tutorController = {
  getAllTutor,
  getSpecificTutor,
};
