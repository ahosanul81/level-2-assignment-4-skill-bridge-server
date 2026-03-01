import config from "../../../config";
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

    // res.cookie("accessToken", result?.accessToken, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === "production",
    //   sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    //   maxAge: 1000 * 60 * 60 * 24 * 180,
    //   path: "/",
    // });
    res.cookie("accessToken", result?.accessToken, {
      httpOnly: true,
      secure: true, // REQUIRED for HTTPS
      sameSite: "none", // REQUIRED for cross-domain
      maxAge: 1000 * 60 * 60 * 24 * 180,
      path: "/",
    });
    return res.status(200).json({
      success: true,
      message: "User created succesfully",
    });
  } catch (error) {
    next(error);
  }
});
const loginUser = catchAsync(async (req, res, next) => {
  try {
    const result = await userService.loginUserIntoDB(req.body);
    // const { accessToken } = result;

    // res.cookie("accessToken", result?.accessToken, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === "production",
    //   sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    //   maxAge: 1000 * 60 * 60 * 24 * 180,
    //   path: "/",
    // });
    res.cookie("accessToken", result?.accessToken, {
      httpOnly: true,
      secure: true, // REQUIRED for HTTPS
      sameSite: "none", // REQUIRED for cross-domain
      maxAge: 1000 * 60 * 60 * 24 * 180,
      path: "/",
    });

    return res.status(200).json({
      success: true,
      message: "Logged in successfully",
    });
  } catch (error) {
    next(error);
  }
});
const signOut = catchAsync(async (req, res, next) => {
  try {
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
    });
    //     res.clearCookie("accessToken", {
    //   httpOnly: true,
    //   secure: false,
    //   sameSite: "lax",
    //   path: "/",
    // });

    return res.status(200).json({
      success: true,
      message: "signOut successfully",
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
const getMe = catchAsync(async (req, res, next) => {
  try {
    const result = await userService.getMeFromDB(req.user?.email as string);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Get me succesfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
});
export const userController = {
  getSpecificUser,
  createUser,
  loginUser,
  signOut,
  updateUser,
  getMe,
};
