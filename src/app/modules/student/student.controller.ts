import { catchAsync } from "../../middelware/catchAsync";
import sendResponse from "../../middelware/sendResponse";
import { studentService } from "./student.service";

const getAllStudent = catchAsync(async (req, res, next) => {
  try {
    const result = await studentService.getAllStudentFromDB();
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "All student fetched succesfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
});

export const studentController = {
  getAllStudent,
};
