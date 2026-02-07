import { catchAsync } from "../../middelware/catchAsync";
import sendResponse from "../../middelware/sendResponse";
import { userService } from "./user.service";

const getSpecificUser = catchAsync(async (req, res, next) => {
  try {
    const result = await userService.getSpecificUserFromDB(
      req.params.userId as string,
    );
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "User fetched succesfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
});
const createUser = catchAsync(async (req, res, next) => {
  try {
    const result = await userService.createUserIntoDB(req.body);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "User created succesfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
});
const updateUser = catchAsync(async (req, res, next) => {
  try {
    const result = await userService.updateUserIntoDB(
      req.params.userId as string,
      req.body,
    );
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "User updated succesfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
});
export const userController = { getSpecificUser, createUser, updateUser };
