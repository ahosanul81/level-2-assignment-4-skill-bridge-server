// src/app.ts
import { toNodeHandler } from "better-auth/node";
import express9 from "express";
import cors from "cors";

// src/lib/auth.ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

// src/lib/prisma.ts
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

// generated/prisma/client.ts
import * as path from "path";
import { fileURLToPath } from "url";

// generated/prisma/internal/class.ts
import * as runtime from "@prisma/client/runtime/client";
var config = {
  "previewFeatures": [],
  "clientVersion": "7.3.0",
  "engineVersion": "9d6ad21cbbceab97458517b147a6a09ff43aa735",
  "activeProvider": "postgresql",
  "inlineSchema": '// This is your Prisma schema file,\n// learn more about it in the docs: https://pris.ly/d/prisma-schema\n\n// Looking for ways to speed up your queries, or scale easily with your serverless or edge functions?\n// Try Prisma Accelerate: https://pris.ly/cli/accelerate-init\n\ngenerator client {\n  provider = "prisma-client"\n  output   = "../generated/prisma"\n}\n\ndatasource db {\n  provider = "postgresql"\n}\n\nmodel Category {\n  id        String    @id @unique @default(uuid())\n  name      String\n  slug      String    @unique\n  isActive  Boolean   @default(true)\n  createdAt DateTime  @default(now())\n  updatedAt DateTime  @updatedAt\n  booking   Booking[]\n  tutors    Tutor[]\n\n  @@map("category")\n}\n\nmodel User {\n  id            String    @id @default(uuid())\n  name          String?\n  email         String\n  emailVerified Boolean   @default(true)\n  image         String?\n  createdAt     DateTime  @default(now())\n  updatedAt     DateTime  @updatedAt\n  sessions      Session[]\n  accounts      Account[]\n\n  role     UserRole   @default(STUDENT)\n  status   UserStatus @default(ACTIVE)\n  isActive Boolean?   @default(true)\n  tutor    Tutor?\n  student  Student?\n  admin    Admin?\n\n  @@unique([email])\n  @@map("user")\n}\n\nmodel Admin {\n  id           String  @id @default(uuid())\n  // relation with User (Better Auth)\n  userId       String  @unique\n  user         User    @relation(fields: [userId], references: [id], onDelete: Cascade)\n  name         String?\n  phone        String?\n  address      String?\n  profilePhoto String?\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n}\n\nmodel Student {\n  id           String  @id @default(uuid())\n  userId       String  @unique\n  user         User    @relation(fields: [userId], references: [id], onDelete: Cascade)\n  name         String?\n  bio          String? @db.VarChar(1000)\n  phone        String?\n  address      String?\n  profilePhoto String?\n\n  createdAt DateTime  @default(now())\n  updatedAt DateTime  @updatedAt\n  bookings  Booking[]\n  review    Review[]\n\n  @@map("student")\n}\n\nmodel Tutor {\n  id             String    @id @unique @default(uuid())\n  userId         String    @unique\n  user           User      @relation(fields: [userId], references: [id], onDelete: Cascade)\n  name           String?\n  categoryId     String?\n  category       Category? @relation(fields: [categoryId], references: [id], onDelete: Cascade)\n  bio            String?   @db.VarChar(1000)\n  slotId         String?\n  slot           Slot?     @relation(fields: [slotId], references: [id], onDelete: Cascade)\n  profilePhoto   String?\n  hourlyRate     Int?\n  experienceYear Int?\n  isVerified     Boolean?\n  createdAt      DateTime  @default(now())\n  updatedAt      DateTime  @updatedAt\n\n  availabilities Availability[]\n  review         Review[]\n  bookings       Booking[]\n\n  @@map("tutor")\n}\n\nmodel Availability {\n  id        String   @id @unique @default(uuid())\n  tutorId   String\n  tutor     Tutor    @relation(fields: [tutorId], references: [id], onDelete: Cascade)\n  slotId    String   @unique\n  slot      Slot     @relation(fields: [slotId], references: [id], onDelete: Cascade)\n  dayOfWeek WeekDay\n  startTime DateTime\n  endTime   DateTime\n  isBooked  Boolean\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@map("availability")\n}\n\nmodel Slot {\n  id           String        @id @unique @default(uuid())\n  startTime    String\n  endTime      String\n  createdAt    DateTime      @default(now())\n  updatedAt    DateTime      @updatedAt\n  availability Availability?\n  booking      Booking[]\n  tutors       Tutor[]\n}\n\nmodel Booking {\n  id         String        @id @unique @default(uuid())\n  studentId  String\n  student    Student       @relation(fields: [studentId], references: [userId], onDelete: Cascade)\n  categoryId String\n  category   Category      @relation(fields: [categoryId], references: [id], onDelete: Cascade)\n  tutorId    String\n  tutor      Tutor         @relation(fields: [tutorId], references: [id], onDelete: Cascade)\n  slotId     String\n  slot       Slot          @relation(fields: [slotId], references: [id], onDelete: Cascade)\n  // startDate  DateTime?\n  // endDate    DateTime?\n  // price      Int\n  status     BookingStatus @default(PENDING)\n  createdAt  DateTime      @default(now())\n  updatedAt  DateTime      @updatedAt\n  review     Review?       @relation(fields: [reviewId], references: [id])\n  reviewId   String?\n\n  @@map("booking")\n}\n\nmodel Review {\n  id        String    @id @unique @default(uuid())\n  // bookingId String?  @unique\n  // booking   Booking? @relation(fields: [bookingId], references: [id], onDelete: Cascade)\n  studentId String\n  student   Student   @relation(fields: [studentId], references: [id], onDelete: Cascade)\n  tutorId   String\n  tutor     Tutor     @relation(fields: [tutorId], references: [id], onDelete: Cascade)\n  rating    Int\n  comment   String    @db.VarChar(300)\n  createdAt DateTime  @default(now())\n  updatedAt DateTime  @updatedAt\n  bookings  Booking[]\n}\n\nmodel Session {\n  id        String   @id\n  expiresAt DateTime\n  token     String\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n  ipAddress String?\n  userAgent String?\n  userId    String\n  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@unique([token])\n  @@index([userId])\n  @@map("session")\n}\n\nmodel Account {\n  id                    String    @id\n  accountId             String\n  providerId            String\n  userId                String\n  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)\n  accessToken           String?\n  refreshToken          String?\n  idToken               String?\n  accessTokenExpiresAt  DateTime?\n  refreshTokenExpiresAt DateTime?\n  scope                 String?\n  password              String?\n  createdAt             DateTime  @default(now())\n  updatedAt             DateTime  @updatedAt\n\n  @@index([userId])\n  @@map("account")\n}\n\nmodel Verification {\n  id         String   @id\n  identifier String\n  value      String\n  expiresAt  DateTime\n  createdAt  DateTime @default(now())\n  updatedAt  DateTime @updatedAt\n\n  @@index([identifier])\n  @@map("verification")\n}\n\nenum UserRole {\n  STUDENT\n  TUTOR\n  ADMIN\n}\n\nenum UserStatus {\n  ACTIVE\n  BLOCKED\n  DELETED\n}\n\nenum WeekDay {\n  MONDAY\n  TUESDAY\n  WEDNESDAY\n  THURSDAY\n  FRIDAY\n  SATURDAY\n  SUNDAY\n}\n\nenum StudentStatus {\n  ACTIVE\n  INACTIVE\n  SUSPENDED\n  GRADUATED\n}\n\nenum BookingStatus {\n  PENDING\n  CONFIRMED\n  COMPLETED\n  CANCELLED\n}\n',
  "runtimeDataModel": {
    "models": {},
    "enums": {},
    "types": {}
  }
};
config.runtimeDataModel = JSON.parse('{"models":{"Category":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"slug","kind":"scalar","type":"String"},{"name":"isActive","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"booking","kind":"object","type":"Booking","relationName":"BookingToCategory"},{"name":"tutors","kind":"object","type":"Tutor","relationName":"CategoryToTutor"}],"dbName":"category"},"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"emailVerified","kind":"scalar","type":"Boolean"},{"name":"image","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"sessions","kind":"object","type":"Session","relationName":"SessionToUser"},{"name":"accounts","kind":"object","type":"Account","relationName":"AccountToUser"},{"name":"role","kind":"enum","type":"UserRole"},{"name":"status","kind":"enum","type":"UserStatus"},{"name":"isActive","kind":"scalar","type":"Boolean"},{"name":"tutor","kind":"object","type":"Tutor","relationName":"TutorToUser"},{"name":"student","kind":"object","type":"Student","relationName":"StudentToUser"},{"name":"admin","kind":"object","type":"Admin","relationName":"AdminToUser"}],"dbName":"user"},"Admin":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"AdminToUser"},{"name":"name","kind":"scalar","type":"String"},{"name":"phone","kind":"scalar","type":"String"},{"name":"address","kind":"scalar","type":"String"},{"name":"profilePhoto","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"Student":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"StudentToUser"},{"name":"name","kind":"scalar","type":"String"},{"name":"bio","kind":"scalar","type":"String"},{"name":"phone","kind":"scalar","type":"String"},{"name":"address","kind":"scalar","type":"String"},{"name":"profilePhoto","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"bookings","kind":"object","type":"Booking","relationName":"BookingToStudent"},{"name":"review","kind":"object","type":"Review","relationName":"ReviewToStudent"}],"dbName":"student"},"Tutor":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"TutorToUser"},{"name":"name","kind":"scalar","type":"String"},{"name":"categoryId","kind":"scalar","type":"String"},{"name":"category","kind":"object","type":"Category","relationName":"CategoryToTutor"},{"name":"bio","kind":"scalar","type":"String"},{"name":"slotId","kind":"scalar","type":"String"},{"name":"slot","kind":"object","type":"Slot","relationName":"SlotToTutor"},{"name":"profilePhoto","kind":"scalar","type":"String"},{"name":"hourlyRate","kind":"scalar","type":"Int"},{"name":"experienceYear","kind":"scalar","type":"Int"},{"name":"isVerified","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"availabilities","kind":"object","type":"Availability","relationName":"AvailabilityToTutor"},{"name":"review","kind":"object","type":"Review","relationName":"ReviewToTutor"},{"name":"bookings","kind":"object","type":"Booking","relationName":"BookingToTutor"}],"dbName":"tutor"},"Availability":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"tutorId","kind":"scalar","type":"String"},{"name":"tutor","kind":"object","type":"Tutor","relationName":"AvailabilityToTutor"},{"name":"slotId","kind":"scalar","type":"String"},{"name":"slot","kind":"object","type":"Slot","relationName":"AvailabilityToSlot"},{"name":"dayOfWeek","kind":"enum","type":"WeekDay"},{"name":"startTime","kind":"scalar","type":"DateTime"},{"name":"endTime","kind":"scalar","type":"DateTime"},{"name":"isBooked","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"availability"},"Slot":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"startTime","kind":"scalar","type":"String"},{"name":"endTime","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"availability","kind":"object","type":"Availability","relationName":"AvailabilityToSlot"},{"name":"booking","kind":"object","type":"Booking","relationName":"BookingToSlot"},{"name":"tutors","kind":"object","type":"Tutor","relationName":"SlotToTutor"}],"dbName":null},"Booking":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"studentId","kind":"scalar","type":"String"},{"name":"student","kind":"object","type":"Student","relationName":"BookingToStudent"},{"name":"categoryId","kind":"scalar","type":"String"},{"name":"category","kind":"object","type":"Category","relationName":"BookingToCategory"},{"name":"tutorId","kind":"scalar","type":"String"},{"name":"tutor","kind":"object","type":"Tutor","relationName":"BookingToTutor"},{"name":"slotId","kind":"scalar","type":"String"},{"name":"slot","kind":"object","type":"Slot","relationName":"BookingToSlot"},{"name":"status","kind":"enum","type":"BookingStatus"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"review","kind":"object","type":"Review","relationName":"BookingToReview"},{"name":"reviewId","kind":"scalar","type":"String"}],"dbName":"booking"},"Review":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"studentId","kind":"scalar","type":"String"},{"name":"student","kind":"object","type":"Student","relationName":"ReviewToStudent"},{"name":"tutorId","kind":"scalar","type":"String"},{"name":"tutor","kind":"object","type":"Tutor","relationName":"ReviewToTutor"},{"name":"rating","kind":"scalar","type":"Int"},{"name":"comment","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"bookings","kind":"object","type":"Booking","relationName":"BookingToReview"}],"dbName":null},"Session":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"token","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"ipAddress","kind":"scalar","type":"String"},{"name":"userAgent","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"SessionToUser"}],"dbName":"session"},"Account":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"accountId","kind":"scalar","type":"String"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"AccountToUser"},{"name":"accessToken","kind":"scalar","type":"String"},{"name":"refreshToken","kind":"scalar","type":"String"},{"name":"idToken","kind":"scalar","type":"String"},{"name":"accessTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"refreshTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"scope","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"account"},"Verification":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"identifier","kind":"scalar","type":"String"},{"name":"value","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"verification"}},"enums":{},"types":{}}');
async function decodeBase64AsWasm(wasmBase64) {
  const { Buffer } = await import("buffer");
  const wasmArray = Buffer.from(wasmBase64, "base64");
  return new WebAssembly.Module(wasmArray);
}
config.compilerWasm = {
  getRuntime: async () => await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.mjs"),
  getQueryCompilerWasmModule: async () => {
    const { wasm } = await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.wasm-base64.mjs");
    return await decodeBase64AsWasm(wasm);
  },
  importName: "./query_compiler_fast_bg.js"
};
function getPrismaClientClass() {
  return runtime.getPrismaClient(config);
}

// generated/prisma/internal/prismaNamespace.ts
import * as runtime2 from "@prisma/client/runtime/client";
var getExtensionContext = runtime2.Extensions.getExtensionContext;
var NullTypes2 = {
  DbNull: runtime2.NullTypes.DbNull,
  JsonNull: runtime2.NullTypes.JsonNull,
  AnyNull: runtime2.NullTypes.AnyNull
};
var TransactionIsolationLevel = runtime2.makeStrictEnum({
  ReadUncommitted: "ReadUncommitted",
  ReadCommitted: "ReadCommitted",
  RepeatableRead: "RepeatableRead",
  Serializable: "Serializable"
});
var defineExtension = runtime2.Extensions.defineExtension;

// generated/prisma/enums.ts
var UserRole = {
  STUDENT: "STUDENT",
  TUTOR: "TUTOR",
  ADMIN: "ADMIN"
};

// generated/prisma/client.ts
globalThis["__dirname"] = path.dirname(fileURLToPath(import.meta.url));
var PrismaClient = getPrismaClientClass();

// src/lib/prisma.ts
var connectionString = `${process.env.DATABASE_URL}`;
var adapter = new PrismaPg({ connectionString });
var prisma = new PrismaClient({ adapter });

// src/config/index.ts
import { config as config2 } from "dotenv";
import path2 from "path";
config2({ path: path2.join(process.cwd(), ".env") });
var config_default = {
  database_url: process.env.DATABASE_URL,
  common: {
    port: process.env.PORT,
    client_app_url: process.env.CLIENT_APP_URL
  }
};

// src/lib/auth.ts
var auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql"
  }),
  trustedOrigins: [config_default.common.client_app_url],
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "STUDENT",
        required: true
      },
      status: {
        type: "string",
        defaultValue: "ACTIVE",
        required: false
      },
      isActive: {
        type: "boolean",
        defaultValue: true,
        required: false
      }
    }
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    requireEmailVerification: false
  }
});

// src/app/modules/category/category.route.ts
import express from "express";

// src/app/middelware/catchAsync.ts
var catchAsync = (fn) => {
  return async (req, res, next) => Promise.resolve(fn(req, res, next)).catch((error) => next(error));
};

// src/app/middelware/sendResponse.ts
var sendResponse = (res, data) => {
  res.status(data?.statusCode).json({
    success: data?.success,
    message: data?.message,
    meta: data?.meta,
    data: data?.data
  });
};
var sendResponse_default = sendResponse;

// src/app/middelware/AppError.ts
var AppError = class extends Error {
  statusCode;
  constructor(statusCode, message, stack) {
    super(message);
    this.statusCode = statusCode;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
};

// src/app/modules/category/category.service.ts
var getAllCategoryFromDB = async () => {
  const result = await prisma.category.findMany();
  if (!result) {
    throw new AppError(404, "No category found");
  }
  return result;
};
var createCategoryIntoDB = async (payload) => {
  payload.slug = payload.name.trim().split(" ").join("-");
  const result = prisma.category.create({ data: payload });
  return result;
};
var deleteCategoryFromDB = async (categoryId) => {
  const result = await prisma.category.delete({ where: { id: categoryId } });
  return result;
};
var categoryService = {
  getAllCategoryFromDB,
  createCategoryIntoDB,
  deleteCategoryFromDB
};

// src/app/modules/category/category.controller.ts
var getAllCategory = catchAsync(async (req, res, next) => {
  try {
    const result = await categoryService.getAllCategoryFromDB();
    sendResponse_default(res, {
      statusCode: 200,
      success: true,
      message: "Get all category succesfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
});
var createCategory = catchAsync(async (req, res, next) => {
  try {
    const result = await categoryService.createCategoryIntoDB(req.body);
    sendResponse_default(res, {
      statusCode: 200,
      success: true,
      message: "Created category succesfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
});
var deleteCategory = catchAsync(async (req, res, next) => {
  try {
    const result = await categoryService.deleteCategoryFromDB(
      req.params.categoryId
    );
    sendResponse_default(res, {
      statusCode: 200,
      success: true,
      message: "Delete category succesfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
});
var categoryController = {
  getAllCategory,
  createCategory,
  deleteCategory
};

// src/app/modules/category/category.route.ts
var categoryRouter = express.Router();
categoryRouter.get("/", categoryController.getAllCategory);
categoryRouter.post("/create-category", categoryController.createCategory);
categoryRouter.delete(
  "/delete-category/:categoryId",
  categoryController.deleteCategory
);
var category_route_default = categoryRouter;

// src/app/modules/user/user.route.ts
import express2 from "express";

// src/app/modules/user/user.utils.ts
var isExistUser = async (userId) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new AppError(400, "User not found");
  }
  return user;
};

// src/app/modules/user/user.service.ts
var getSpecificUserFromDB = async (userId) => {
  const user = await isExistUser(userId);
  switch (user.role) {
    case UserRole.TUTOR:
      const tutor = await prisma.tutor.findUnique({
        where: { userId },
        include: {
          user: { select: { name: true, role: true } },
          slot: { select: { id: true, startTime: true, endTime: true } },
          category: { select: { name: true } }
        }
      });
      return tutor;
    case UserRole.STUDENT:
      const student = await prisma.student.findUnique({
        where: { userId },
        include: {
          user: { select: { name: true, role: true } }
        }
      });
      console.log(student);
      return student;
    case UserRole.ADMIN:
      const admin = await prisma.admin.findUnique({
        where: { userId },
        include: {
          user: { select: { name: true, role: true } }
        }
      });
      return admin;
    default:
      break;
  }
};
var createUserIntoDB = async (payload) => {
  const { name, email, password, role } = payload;
  let userId = null;
  try {
    const user = await auth.api.signUpEmail({
      body: {
        name,
        email,
        password,
        role
      }
    });
    userId = user.user.id;
    await prisma.user.update({
      where: { id: userId },
      data: { emailVerified: true }
    });
    switch (role) {
      case UserRole.STUDENT:
        await prisma.student.create({
          data: { userId }
        });
        break;
      case UserRole.TUTOR:
        await prisma.tutor.create({
          data: { userId }
        });
        break;
      case UserRole.ADMIN:
        await prisma.admin.create({
          data: { userId }
        });
        break;
    }
    return user;
  } catch (error) {
    if (userId) {
      await prisma.user.delete({
        where: { id: userId }
      });
    }
    throw error;
  }
};
var updateUserIntoDB = async (userId, payload) => {
  const user = await isExistUser(userId);
  switch (user.role) {
    case UserRole.STUDENT:
      const student = await prisma.student.update({
        where: { userId },
        data: payload
      });
      return student;
    case UserRole.TUTOR:
      const tutor = await prisma.tutor.update({
        where: { userId },
        data: payload
      });
      return tutor;
    case UserRole.ADMIN:
      const admin = await prisma.admin.update({
        where: { userId },
        data: payload
      });
      return admin;
  }
};
var userService = {
  getSpecificUserFromDB,
  createUserIntoDB,
  updateUserIntoDB
};

// src/app/modules/user/user.controller.ts
var getSpecificUser = catchAsync(async (req, res, next) => {
  try {
    const result = await userService.getSpecificUserFromDB(
      req.params.userId
    );
    sendResponse_default(res, {
      statusCode: 200,
      success: true,
      message: "User fetched succesfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
});
var createUser = catchAsync(async (req, res, next) => {
  try {
    const result = await userService.createUserIntoDB(req.body);
    sendResponse_default(res, {
      statusCode: 200,
      success: true,
      message: "User created succesfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
});
var updateUser = catchAsync(async (req, res, next) => {
  try {
    const result = await userService.updateUserIntoDB(
      req.params.userId,
      req.body
    );
    sendResponse_default(res, {
      statusCode: 200,
      success: true,
      message: "User updated succesfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
});
var userController = { getSpecificUser, createUser, updateUser };

// src/app/modules/user/user.route.ts
var userRouter = express2.Router();
userRouter.get("/:userId", userController.getSpecificUser);
userRouter.post("/signup", userController.createUser);
userRouter.patch("/update/:userId", userController.updateUser);
var user_route_default = userRouter;

// src/app/modules/tutor/tutor.route.ts
import express3 from "express";

// src/app/modules/tutor/tutor.service.ts
var getAllTutorFromDB = async (query) => {
  const { name, hourlyRate, experienceYear, isVerified, categoryName } = query;
  const andCondition = [];
  if (name) {
    andCondition.push({ name: { contains: name, mode: "insensitive" } });
  }
  if (hourlyRate) {
    const formated = hourlyRate.split("-");
    andCondition.push({
      hourlyRate: { gte: Number(formated[0]), lte: Number(formated[1]) }
    });
  }
  if (experienceYear) {
    const formated = experienceYear.split("-");
    andCondition.push({
      experienceYear: { gte: Number(formated[0]), lte: Number(formated[1]) }
    });
  }
  if (isVerified) {
    andCondition.push({ isVerified: isVerified === "true" ? true : false });
  }
  if (categoryName) {
    andCondition.push({
      category: { name: { equals: categoryName, mode: "insensitive" } }
    });
  }
  const result = await prisma.tutor.findMany({
    where: {
      AND: andCondition
    },
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { id: true, email: true } },
      category: { select: { id: true, name: true } },
      slot: { select: { id: true, startTime: true, endTime: true } }
    }
  });
  return result;
};
var getSpecificTutor = async (tutorId) => {
  const tutor = await prisma.tutor.findUnique({
    where: { id: tutorId },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          role: true,
          status: true,
          isActive: true
        }
      }
    }
  });
  if (!tutor) {
    throw new AppError(404, "This tutor has not found");
  }
  return tutor;
};
var tutorService = {
  getAllTutorFromDB,
  getSpecificTutor
};

// src/app/modules/tutor/tutor.controller.ts
var getAllTutor = catchAsync(async (req, res, next) => {
  try {
    const result = await tutorService.getAllTutorFromDB(
      req.query
    );
    sendResponse_default(res, {
      statusCode: 200,
      success: true,
      message: "All tutor fetched succesfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
});
var getSpecificTutor2 = catchAsync(async (req, res, next) => {
  try {
    const result = await tutorService.getSpecificTutor(
      req.params.tutorId
    );
    sendResponse_default(res, {
      statusCode: 200,
      success: true,
      message: "Specific tutor fetched succesfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
});
var tutorController = {
  getAllTutor,
  getSpecificTutor: getSpecificTutor2
};

// src/app/modules/tutor/tutor.route.ts
var tutorRouter = express3.Router();
tutorRouter.get("/", tutorController.getAllTutor);
tutorRouter.get("/:tutorId", tutorController.getSpecificTutor);
var tutor_route_default = tutorRouter;

// src/app/modules/student/student.route.ts
import express4 from "express";

// src/app/modules/student/student.service.ts
var getAllStudentFromDB = async () => {
};
var studentService = {
  getAllStudentFromDB
};

// src/app/modules/student/student.controller.ts
var getAllStudent = catchAsync(async (req, res, next) => {
  try {
    const result = await studentService.getAllStudentFromDB();
    sendResponse_default(res, {
      statusCode: 200,
      success: true,
      message: "All student fetched succesfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
});
var studentController = {
  getAllStudent
};

// src/app/modules/student/student.route.ts
var studentRouter = express4.Router();
studentRouter.get("/", studentController.getAllStudent);
var student_route_default = studentRouter;

// src/app/modules/slot/slot.route.ts
import express5 from "express";

// src/app/modules/slot/slot.service.ts
var getAllSlotFromDB = async () => {
  const result = await prisma.slot.findMany();
  if (!result) {
    throw new AppError(404, "No slot found");
  }
  return result;
};
var createSlotIntoDB = async (payload) => {
  const result = await prisma.slot.create({ data: payload });
  return result;
};
var slotService = { getAllSlotFromDB, createSlotIntoDB };

// src/app/modules/slot/slot.controller.ts
var getAllSlot = catchAsync(async (req, res, next) => {
  try {
    const result = await slotService.getAllSlotFromDB();
    sendResponse_default(res, {
      statusCode: 200,
      success: true,
      message: "Slot fetched succesfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
});
var createSlot = catchAsync(async (req, res, next) => {
  try {
    const result = await slotService.createSlotIntoDB(req.body);
    sendResponse_default(res, {
      statusCode: 200,
      success: true,
      message: "Booking session succesfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
});
var slotController = { getAllSlot, createSlot };

// src/app/modules/slot/slot.route.ts
var slotRouter = express5.Router();
slotRouter.get("/", slotController.getAllSlot);
slotRouter.post("/add", slotController.createSlot);
var slot_route_default = slotRouter;

// src/app/modules/admin/admin.route.ts
import express6 from "express";
var adminRouter = express6.Router();
var admin_route_default = adminRouter;

// src/app/modules/booking/booking.route.ts
import express7 from "express";

// src/app/modules/category/category.utils.ts
var isExistCategory = async (categoryId) => {
  const category = await prisma.category.findUnique({
    where: { id: categoryId }
  });
  if (!category) {
    throw new AppError(404, "This category has not found");
  }
  return category;
};

// src/app/modules/slot/slot.utils.ts
var isExistSlot = async (slotId) => {
  const slot = await prisma.slot.findUnique({
    where: { id: slotId }
  });
  if (!slot) {
    throw new AppError(404, "This slot has not found");
  }
  return slot;
};

// src/app/modules/student/student.utils.ts
var isExistStudentByUserId = async (studentId) => {
  const student = await prisma.student.findUnique({
    where: { userId: studentId }
  });
  if (!student) {
    throw new AppError(404, "This student has not found");
  }
  return student;
};

// src/app/modules/tutor/tutor.utils.ts
var isExistTutor = async (tutorId) => {
  const tutor = await prisma.tutor.findUnique({
    where: { id: tutorId }
  });
  if (!tutor) {
    throw new AppError(404, "This tutor has not found");
  }
  return tutor;
};

// src/app/modules/booking/booking.service.ts
var getAllBookingsFromDB = async () => {
  const result = await prisma.booking.findMany({
    select: {
      id: true,
      student: { select: { id: true, name: true } },
      tutor: { select: { id: true, name: true } },
      slot: { select: { startTime: true, endTime: true } },
      category: { select: { name: true } },
      status: true,
      createdAt: true,
      updatedAt: true
    }
  });
  return result;
};
var bookingSessionIntoDB = async (payload) => {
  const { studentId, categoryId, slotId, tutorId } = payload;
  console.log(payload);
  await isExistStudentByUserId(studentId);
  await isExistCategory(categoryId);
  await isExistTutor(tutorId);
  await isExistSlot(slotId);
  const result = await prisma.booking.create({ data: payload });
  return result;
};
var updateBookingStatusIntoDB = async (bookingId, status) => {
  const isExistBooking = await prisma.booking.findUnique({
    where: { id: bookingId }
  });
  if (!isExistBooking) {
    throw new AppError(404, "Booking not found");
  }
  const result = await prisma.booking.update({
    where: { id: bookingId },
    data: { status }
  });
  return result;
};
var bookingSerive = {
  getAllBookingsFromDB,
  bookingSessionIntoDB,
  updateBookingStatusIntoDB
};

// src/app/modules/booking/booking.controller.ts
var getAllBookings = catchAsync(async (req, res, next) => {
  try {
    const result = await bookingSerive.getAllBookingsFromDB();
    sendResponse_default(res, {
      statusCode: 200,
      success: true,
      message: "Get all Booking succesfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
});
var bookingSession = catchAsync(async (req, res, next) => {
  try {
    const result = await bookingSerive.bookingSessionIntoDB(req.body);
    sendResponse_default(res, {
      statusCode: 200,
      success: true,
      message: "Booking session succesfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
});
var updateBookingStatus = catchAsync(async (req, res, next) => {
  try {
    const result = await bookingSerive.updateBookingStatusIntoDB(
      req.params.bookingId,
      req.body.status
    );
    console.log(result);
    sendResponse_default(res, {
      statusCode: 200,
      success: true,
      message: "Update Booking status succesfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
});
var bookingController = {
  getAllBookings,
  bookingSession,
  updateBookingStatus
};

// src/app/middelware/auth.ts
var auth2 = (...roles) => {
  return async (req, res, next) => {
    try {
      const session = await auth.api.getSession({
        headers: req.headers
      });
      if (!session) {
        res.status(402).json({
          success: false,
          message: "You are not authorized user!"
        });
      }
      if (!session?.user.emailVerified) {
        res.status(402).json({
          success: false,
          message: "Your email verifaction required"
        });
      }
      req.user = {
        id: session?.user?.id,
        email: session?.user?.email,
        name: session?.user?.name,
        role: session?.user?.role,
        emailVerified: session?.user?.emailVerified
      };
      if (roles && !roles.includes(req.user.role)) {
        res.status(402).json({
          success: false,
          message: "You are not authorized user!!"
        });
      }
      next();
    } catch (error) {
      console.log(error);
    }
  };
};

// src/app/modules/booking/booking.route.ts
var bookingRouter = express7.Router();
bookingRouter.get(
  "/",
  auth2(UserRole.TUTOR, UserRole.ADMIN),
  bookingController.getAllBookings
);
bookingRouter.post(
  "/booking-session",
  auth2(UserRole.STUDENT),
  bookingController.bookingSession
);
bookingRouter.patch(
  "/booking-session/update/:bookingId",
  auth2(UserRole.TUTOR, UserRole.ADMIN),
  bookingController.updateBookingStatus
);
var booking_route_default = bookingRouter;

// src/app/modules/review/review.route.ts
import express8 from "express";

// src/app/modules/review/review.service.ts
var getAllReviewByTutorIdFromDB = async (tutorId) => {
  await isExistTutor(tutorId);
  const result = await prisma.review.findMany({
    where: { tutorId },
    include: { student: { select: { name: true, profilePhoto: true } } }
  });
  return result;
};
var addReviewIntoDB = async (payload) => {
  const { userId, tutorId } = payload;
  const student = await isExistStudentByUserId(userId);
  await isExistTutor(tutorId);
  const payloadData = {
    studentId: student.id,
    tutorId: payload.tutorId,
    rating: payload.rating,
    comment: payload.comment
  };
  const result = await prisma.review.create({ data: payloadData });
  return result;
};
var reviewService = { getAllReviewByTutorIdFromDB, addReviewIntoDB };

// src/app/modules/review/review.controller.ts
var getAllReviewByTutorId = catchAsync(async (req, res, next) => {
  try {
    const result = await reviewService.getAllReviewByTutorIdFromDB(
      req.params.tutorId
    );
    sendResponse_default(res, {
      statusCode: 200,
      success: true,
      message: "Fetched all review successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
});
var addReview = catchAsync(async (req, res, next) => {
  try {
    const result = await reviewService.addReviewIntoDB(req.body);
    sendResponse_default(res, {
      statusCode: 200,
      success: true,
      message: "Added review successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
});
var reviewController = { getAllReviewByTutorId, addReview };

// src/app/modules/review/review.route.ts
var reviewRouter = express8.Router();
reviewRouter.get("/:tutorId", reviewController.getAllReviewByTutorId);
reviewRouter.post(
  "/add-review",
  auth2(UserRole.STUDENT),
  reviewController.addReview
);
var review_route_default = reviewRouter;

// src/app.ts
var app = express9();
app.use(
  cors({
    origin: config_default.common.client_app_url || "http://localhost:3000",
    // client side url
    credentials: true
  })
);
app.use(express9.json());
app.all("/api/auth/*splat", toNodeHandler(auth));
app.use("/api/v1/category", category_route_default);
app.use("/api/v1/slot", slot_route_default);
app.use("/api/v1/booking", booking_route_default);
app.use("/api/v1/tutor", tutor_route_default);
app.use("/api/v1/review", review_route_default);
app.use("/api/v1/student", student_route_default);
app.use("/api/v1/admin", admin_route_default);
app.use("/api/v1/user", user_route_default);
app.get("/", (req, res) => {
  res.send("Skill Bridge server is running");
});
var app_default = app;

// src/index.ts
var index_default = app_default;
export {
  index_default as default
};
