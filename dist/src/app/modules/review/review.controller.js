import { catchAsync } from "../../middelware/catchAsync";
import sendResponse from "../../middelware/sendResponse";
import { reviewService } from "./review.service";
const getAllReviewByTutorId = catchAsync(async (req, res, next) => {
    try {
        const result = await reviewService.getAllReviewByTutorIdFromDB(req.params.tutorId);
        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Fetched all review successfully",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
const addReview = catchAsync(async (req, res, next) => {
    try {
        const result = await reviewService.addReviewIntoDB(req.body);
        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Added review successfully",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
export const reviewController = { getAllReviewByTutorId, addReview };
