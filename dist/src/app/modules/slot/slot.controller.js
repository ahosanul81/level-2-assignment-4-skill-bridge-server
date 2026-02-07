import { catchAsync } from "../../middelware/catchAsync";
import sendResponse from "../../middelware/sendResponse";
import { slotService } from "./slot.service";
const getAllSlot = catchAsync(async (req, res, next) => {
    try {
        const result = await slotService.getAllSlotFromDB();
        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Slot fetched succesfully",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
const createSlot = catchAsync(async (req, res, next) => {
    try {
        const result = await slotService.createSlotIntoDB(req.body);
        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Booking session succesfully",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
export const slotController = { getAllSlot, createSlot };
