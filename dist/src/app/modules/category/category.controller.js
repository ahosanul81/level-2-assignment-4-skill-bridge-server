import { catchAsync } from "../../middelware/catchAsync";
import sendResponse from "../../middelware/sendResponse";
import { categoryService } from "./category.service";
const getAllCategory = catchAsync(async (req, res, next) => {
    try {
        const result = await categoryService.getAllCategoryFromDB();
        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Get all category succesfully",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
const createCategory = catchAsync(async (req, res, next) => {
    try {
        const result = await categoryService.createCategoryIntoDB(req.body);
        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Created category succesfully",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
const deleteCategory = catchAsync(async (req, res, next) => {
    try {
        const result = await categoryService.deleteCategoryFromDB(req.params.categoryId);
        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Delete category succesfully",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
export const categoryController = {
    getAllCategory,
    createCategory,
    deleteCategory,
};
