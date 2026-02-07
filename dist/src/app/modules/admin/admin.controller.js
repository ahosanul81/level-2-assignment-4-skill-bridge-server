import { catchAsync } from "../../middelware/catchAsync";
import sendResponse from "../../middelware/sendResponse";
import { adminService } from "./admin.service";
const getAllBoking = catchAsync(async (req, res, next) => {
    try {
        const result = await adminService.getAllBokingFromDB();
        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Get all booking  succesfully",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
export const adminController = { getAllBoking };
