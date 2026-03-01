var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/app.ts
import express9 from "express";
import cors from "cors";

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
  "clientVersion": "7.4.2",
  "engineVersion": "94a226be1cf2967af2541cca5529f0f7ba866919",
  "activeProvider": "postgresql",
  "inlineSchema": '// This is your Prisma schema file,\n// learn more about it in the docs: https://pris.ly/d/prisma-schema\n\n// Looking for ways to speed up your queries, or scale easily with your serverless or edge functions?\n// Try Prisma Accelerate: https://pris.ly/cli/accelerate-init\n\ngenerator client {\n  provider = "prisma-client"\n  output   = "../generated/prisma"\n}\n\ndatasource db {\n  provider = "postgresql"\n}\n\nmodel Category {\n  id        String    @id @unique @default(uuid())\n  name      String\n  slug      String    @unique\n  isActive  Boolean   @default(true)\n  createdAt DateTime  @default(now())\n  updatedAt DateTime  @updatedAt\n  booking   Booking[]\n  tutors    Tutor[]\n\n  @@map("category")\n}\n\nmodel User {\n  id            String   @id @default(uuid())\n  name          String?\n  email         String\n  password      String\n  emailVerified Boolean  @default(true)\n  image         String?\n  createdAt     DateTime @default(now())\n  updatedAt     DateTime @updatedAt\n\n  role     UserRole   @default(STUDENT)\n  status   UserStatus @default(ACTIVE)\n  isActive Boolean?   @default(true)\n  tutor    Tutor?\n  student  Student?\n  admin    Admin?\n\n  @@unique([email])\n  @@map("user")\n}\n\nmodel Admin {\n  id           String  @id @default(uuid())\n  // relation with User (Better Auth)\n  userId       String  @unique\n  user         User    @relation(fields: [userId], references: [id], onDelete: Cascade)\n  name         String?\n  phone        String?\n  address      String?\n  profilePhoto String?\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n}\n\nmodel Student {\n  id           String  @id @default(uuid())\n  userId       String  @unique\n  user         User    @relation(fields: [userId], references: [id], onDelete: Cascade)\n  name         String?\n  bio          String? @db.VarChar(1000)\n  phone        String?\n  address      String?\n  profilePhoto String?\n\n  createdAt DateTime  @default(now())\n  updatedAt DateTime  @updatedAt\n  bookings  Booking[]\n  review    Review[]\n\n  @@map("student")\n}\n\nmodel Tutor {\n  id             String    @id @unique @default(uuid())\n  userId         String    @unique\n  user           User      @relation(fields: [userId], references: [id], onDelete: Cascade)\n  name           String?\n  categoryId     String?\n  category       Category? @relation(fields: [categoryId], references: [id], onDelete: Cascade)\n  bio            String?   @db.VarChar(1000)\n  slotId         String?\n  slot           Slot?     @relation(fields: [slotId], references: [id], onDelete: Cascade)\n  profilePhoto   String?\n  hourlyRate     Int?\n  experienceYear Int?\n  isVerified     Boolean?\n  createdAt      DateTime  @default(now())\n  updatedAt      DateTime  @updatedAt\n\n  availabilities Availability[]\n  review         Review[]\n  bookings       Booking[]\n\n  @@map("tutor")\n}\n\nmodel Availability {\n  id        String   @id @unique @default(uuid())\n  tutorId   String\n  tutor     Tutor    @relation(fields: [tutorId], references: [id], onDelete: Cascade)\n  slotId    String   @unique\n  slot      Slot     @relation(fields: [slotId], references: [id], onDelete: Cascade)\n  dayOfWeek WeekDay\n  startTime DateTime\n  endTime   DateTime\n  isBooked  Boolean\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@map("availability")\n}\n\nmodel Slot {\n  id           String        @id @unique @default(uuid())\n  startTime    String\n  endTime      String\n  createdAt    DateTime      @default(now())\n  updatedAt    DateTime      @updatedAt\n  availability Availability?\n  booking      Booking[]\n  tutors       Tutor[]\n}\n\nmodel Booking {\n  id         String        @id @unique @default(uuid())\n  studentId  String\n  student    Student       @relation(fields: [studentId], references: [userId], onDelete: Cascade)\n  categoryId String\n  category   Category      @relation(fields: [categoryId], references: [id], onDelete: Cascade)\n  tutorId    String\n  tutor      Tutor         @relation(fields: [tutorId], references: [id], onDelete: Cascade)\n  slotId     String\n  slot       Slot          @relation(fields: [slotId], references: [id], onDelete: Cascade)\n  // startDate  DateTime?\n  // endDate    DateTime?\n  // price      Int\n  status     BookingStatus @default(PENDING)\n  createdAt  DateTime      @default(now())\n  updatedAt  DateTime      @updatedAt\n  review     Review?       @relation(fields: [reviewId], references: [id])\n  reviewId   String?\n\n  @@map("booking")\n}\n\nmodel Review {\n  id        String    @id @unique @default(uuid())\n  // bookingId String?  @unique\n  // booking   Booking? @relation(fields: [bookingId], references: [id], onDelete: Cascade)\n  studentId String\n  student   Student   @relation(fields: [studentId], references: [id], onDelete: Cascade)\n  tutorId   String\n  tutor     Tutor     @relation(fields: [tutorId], references: [id], onDelete: Cascade)\n  rating    Int\n  comment   String    @db.VarChar(300)\n  createdAt DateTime  @default(now())\n  updatedAt DateTime  @updatedAt\n  bookings  Booking[]\n}\n\nenum UserRole {\n  STUDENT\n  TUTOR\n  ADMIN\n}\n\nenum UserStatus {\n  ACTIVE\n  BLOCKED\n  DELETED\n}\n\nenum WeekDay {\n  MONDAY\n  TUESDAY\n  WEDNESDAY\n  THURSDAY\n  FRIDAY\n  SATURDAY\n  SUNDAY\n}\n\nenum StudentStatus {\n  ACTIVE\n  INACTIVE\n  SUSPENDED\n  GRADUATED\n}\n\nenum BookingStatus {\n  PENDING\n  CONFIRMED\n  COMPLETED\n  CANCELLED\n}\n',
  "runtimeDataModel": {
    "models": {},
    "enums": {},
    "types": {}
  },
  "parameterizationSchema": {
    "strings": [],
    "graph": ""
  }
};
config.runtimeDataModel = JSON.parse('{"models":{"Category":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"slug","kind":"scalar","type":"String"},{"name":"isActive","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"booking","kind":"object","type":"Booking","relationName":"BookingToCategory"},{"name":"tutors","kind":"object","type":"Tutor","relationName":"CategoryToTutor"}],"dbName":"category"},"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"emailVerified","kind":"scalar","type":"Boolean"},{"name":"image","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"role","kind":"enum","type":"UserRole"},{"name":"status","kind":"enum","type":"UserStatus"},{"name":"isActive","kind":"scalar","type":"Boolean"},{"name":"tutor","kind":"object","type":"Tutor","relationName":"TutorToUser"},{"name":"student","kind":"object","type":"Student","relationName":"StudentToUser"},{"name":"admin","kind":"object","type":"Admin","relationName":"AdminToUser"}],"dbName":"user"},"Admin":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"AdminToUser"},{"name":"name","kind":"scalar","type":"String"},{"name":"phone","kind":"scalar","type":"String"},{"name":"address","kind":"scalar","type":"String"},{"name":"profilePhoto","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"Student":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"StudentToUser"},{"name":"name","kind":"scalar","type":"String"},{"name":"bio","kind":"scalar","type":"String"},{"name":"phone","kind":"scalar","type":"String"},{"name":"address","kind":"scalar","type":"String"},{"name":"profilePhoto","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"bookings","kind":"object","type":"Booking","relationName":"BookingToStudent"},{"name":"review","kind":"object","type":"Review","relationName":"ReviewToStudent"}],"dbName":"student"},"Tutor":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"TutorToUser"},{"name":"name","kind":"scalar","type":"String"},{"name":"categoryId","kind":"scalar","type":"String"},{"name":"category","kind":"object","type":"Category","relationName":"CategoryToTutor"},{"name":"bio","kind":"scalar","type":"String"},{"name":"slotId","kind":"scalar","type":"String"},{"name":"slot","kind":"object","type":"Slot","relationName":"SlotToTutor"},{"name":"profilePhoto","kind":"scalar","type":"String"},{"name":"hourlyRate","kind":"scalar","type":"Int"},{"name":"experienceYear","kind":"scalar","type":"Int"},{"name":"isVerified","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"availabilities","kind":"object","type":"Availability","relationName":"AvailabilityToTutor"},{"name":"review","kind":"object","type":"Review","relationName":"ReviewToTutor"},{"name":"bookings","kind":"object","type":"Booking","relationName":"BookingToTutor"}],"dbName":"tutor"},"Availability":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"tutorId","kind":"scalar","type":"String"},{"name":"tutor","kind":"object","type":"Tutor","relationName":"AvailabilityToTutor"},{"name":"slotId","kind":"scalar","type":"String"},{"name":"slot","kind":"object","type":"Slot","relationName":"AvailabilityToSlot"},{"name":"dayOfWeek","kind":"enum","type":"WeekDay"},{"name":"startTime","kind":"scalar","type":"DateTime"},{"name":"endTime","kind":"scalar","type":"DateTime"},{"name":"isBooked","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"availability"},"Slot":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"startTime","kind":"scalar","type":"String"},{"name":"endTime","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"availability","kind":"object","type":"Availability","relationName":"AvailabilityToSlot"},{"name":"booking","kind":"object","type":"Booking","relationName":"BookingToSlot"},{"name":"tutors","kind":"object","type":"Tutor","relationName":"SlotToTutor"}],"dbName":null},"Booking":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"studentId","kind":"scalar","type":"String"},{"name":"student","kind":"object","type":"Student","relationName":"BookingToStudent"},{"name":"categoryId","kind":"scalar","type":"String"},{"name":"category","kind":"object","type":"Category","relationName":"BookingToCategory"},{"name":"tutorId","kind":"scalar","type":"String"},{"name":"tutor","kind":"object","type":"Tutor","relationName":"BookingToTutor"},{"name":"slotId","kind":"scalar","type":"String"},{"name":"slot","kind":"object","type":"Slot","relationName":"BookingToSlot"},{"name":"status","kind":"enum","type":"BookingStatus"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"review","kind":"object","type":"Review","relationName":"BookingToReview"},{"name":"reviewId","kind":"scalar","type":"String"}],"dbName":"booking"},"Review":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"studentId","kind":"scalar","type":"String"},{"name":"student","kind":"object","type":"Student","relationName":"ReviewToStudent"},{"name":"tutorId","kind":"scalar","type":"String"},{"name":"tutor","kind":"object","type":"Tutor","relationName":"ReviewToTutor"},{"name":"rating","kind":"scalar","type":"Int"},{"name":"comment","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"bookings","kind":"object","type":"Booking","relationName":"BookingToReview"}],"dbName":null}},"enums":{},"types":{}}');
config.parameterizationSchema = {
  strings: JSON.parse('["where","orderBy","cursor","user","category","tutor","slot","availability","booking","tutors","_count","availabilities","student","bookings","review","admin","Category.findUnique","Category.findUniqueOrThrow","Category.findFirst","Category.findFirstOrThrow","Category.findMany","data","Category.createOne","Category.createMany","Category.createManyAndReturn","Category.updateOne","Category.updateMany","Category.updateManyAndReturn","create","update","Category.upsertOne","Category.deleteOne","Category.deleteMany","having","_min","_max","Category.groupBy","Category.aggregate","User.findUnique","User.findUniqueOrThrow","User.findFirst","User.findFirstOrThrow","User.findMany","User.createOne","User.createMany","User.createManyAndReturn","User.updateOne","User.updateMany","User.updateManyAndReturn","User.upsertOne","User.deleteOne","User.deleteMany","User.groupBy","User.aggregate","Admin.findUnique","Admin.findUniqueOrThrow","Admin.findFirst","Admin.findFirstOrThrow","Admin.findMany","Admin.createOne","Admin.createMany","Admin.createManyAndReturn","Admin.updateOne","Admin.updateMany","Admin.updateManyAndReturn","Admin.upsertOne","Admin.deleteOne","Admin.deleteMany","Admin.groupBy","Admin.aggregate","Student.findUnique","Student.findUniqueOrThrow","Student.findFirst","Student.findFirstOrThrow","Student.findMany","Student.createOne","Student.createMany","Student.createManyAndReturn","Student.updateOne","Student.updateMany","Student.updateManyAndReturn","Student.upsertOne","Student.deleteOne","Student.deleteMany","Student.groupBy","Student.aggregate","Tutor.findUnique","Tutor.findUniqueOrThrow","Tutor.findFirst","Tutor.findFirstOrThrow","Tutor.findMany","Tutor.createOne","Tutor.createMany","Tutor.createManyAndReturn","Tutor.updateOne","Tutor.updateMany","Tutor.updateManyAndReturn","Tutor.upsertOne","Tutor.deleteOne","Tutor.deleteMany","_avg","_sum","Tutor.groupBy","Tutor.aggregate","Availability.findUnique","Availability.findUniqueOrThrow","Availability.findFirst","Availability.findFirstOrThrow","Availability.findMany","Availability.createOne","Availability.createMany","Availability.createManyAndReturn","Availability.updateOne","Availability.updateMany","Availability.updateManyAndReturn","Availability.upsertOne","Availability.deleteOne","Availability.deleteMany","Availability.groupBy","Availability.aggregate","Slot.findUnique","Slot.findUniqueOrThrow","Slot.findFirst","Slot.findFirstOrThrow","Slot.findMany","Slot.createOne","Slot.createMany","Slot.createManyAndReturn","Slot.updateOne","Slot.updateMany","Slot.updateManyAndReturn","Slot.upsertOne","Slot.deleteOne","Slot.deleteMany","Slot.groupBy","Slot.aggregate","Booking.findUnique","Booking.findUniqueOrThrow","Booking.findFirst","Booking.findFirstOrThrow","Booking.findMany","Booking.createOne","Booking.createMany","Booking.createManyAndReturn","Booking.updateOne","Booking.updateMany","Booking.updateManyAndReturn","Booking.upsertOne","Booking.deleteOne","Booking.deleteMany","Booking.groupBy","Booking.aggregate","Review.findUnique","Review.findUniqueOrThrow","Review.findFirst","Review.findFirstOrThrow","Review.findMany","Review.createOne","Review.createMany","Review.createManyAndReturn","Review.updateOne","Review.updateMany","Review.updateManyAndReturn","Review.upsertOne","Review.deleteOne","Review.deleteMany","Review.groupBy","Review.aggregate","AND","OR","NOT","id","studentId","tutorId","rating","comment","createdAt","updatedAt","equals","in","notIn","lt","lte","gt","gte","not","contains","startsWith","endsWith","categoryId","slotId","BookingStatus","status","reviewId","startTime","endTime","every","some","none","WeekDay","dayOfWeek","isBooked","userId","name","bio","profilePhoto","hourlyRate","experienceYear","isVerified","phone","address","email","password","emailVerified","image","UserRole","role","UserStatus","isActive","slug","is","isNot","connectOrCreate","upsert","createMany","set","disconnect","delete","connect","updateMany","deleteMany","increment","decrement","multiply","divide"]'),
  graph: "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AwAAAAkAIAEAAC8AMAIAAAEAIAMAAAAJACABAAAvADACAAABACADAAAACQAgAQAALwAwAgAAAQAgCAgAALYEACAJAAC3BAAgqwEBAAAAAbABQAAAAAGxAUAAAAABywEBAAAAAdoBIAAAAAHbAQEAAAABARUAADMAIAarAQEAAAABsAFAAAAAAbEBQAAAAAHLAQEAAAAB2gEgAAAAAdsBAQAAAAEBFQAANQAwARUAADUAMAgIAACiBAAgCQAAowQAIKsBAQDYAgAhsAFAANoCACGxAUAA2gIAIcsBAQDYAgAh2gEgALUDACHbAQEA2AIAIQIAAAABACAVAAA4ACAGqwEBANgCACGwAUAA2gIAIbEBQADaAgAhywEBANgCACHaASAAtQMAIdsBAQDYAgAhAgAAAAkAIBUAADoAIAIAAAAJACAVAAA6ACADAAAAAQAgHAAAMwAgHQAAOAAgAQAAAAEAIAEAAAAJACADCgAAnwQAICIAAKEEACAjAACgBAAgCagBAADBAgAwqQEAAEEAEKoBAADBAgAwqwEBAIQCACGwAUAAhgIAIbEBQACGAgAhywEBAIQCACHaASAAnwIAIdsBAQCEAgAhAwAAAAkAIAEAAEAAMCEAAEEAIAMAAAAJACABAAAvADACAAABACARBQAAvgIAIAwAAL8CACAPAADAAgAgqAEAALkCADCpAQAARwAQqgEAALkCADCrAQEAAAABsAFAAJkCACGxAUAAmQIAIcABAAC8AtoBIssBAQCtAgAh0wEBAAAAAdQBAQCYAgAh1QEgALoCACHWAQEArQIAIdgBAAC7AtgBItoBIAC9AgAhAQAAAEQAIAEAAABEACARBQAAvgIAIAwAAL8CACAPAADAAgAgqAEAALkCADCpAQAARwAQqgEAALkCADCrAQEAmAIAIbABQACZAgAhsQFAAJkCACHAAQAAvALaASLLAQEArQIAIdMBAQCYAgAh1AEBAJgCACHVASAAugIAIdYBAQCtAgAh2AEAALsC2AEi2gEgAL0CACEGBQAAnAQAIAwAAJ0EACAPAACeBAAgywEAAPYCACDWAQAA9gIAINoBAAD2AgAgAwAAAEcAIAEAAEgAMAIAAEQAIAMAAABHACABAABIADACAABEACADAAAARwAgAQAASAAwAgAARAAgDgUAAJkEACAMAACaBAAgDwAAmwQAIKsBAQAAAAGwAUAAAAABsQFAAAAAAcABAAAA2gECywEBAAAAAdMBAQAAAAHUAQEAAAAB1QEgAAAAAdYBAQAAAAHYAQAAANgBAtoBIAAAAAEBFQAATAAgC6sBAQAAAAGwAUAAAAABsQFAAAAAAcABAAAA2gECywEBAAAAAdMBAQAAAAHUAQEAAAAB1QEgAAAAAdYBAQAAAAHYAQAAANgBAtoBIAAAAAEBFQAATgAwARUAAE4AMA4FAACHBAAgDAAAiAQAIA8AAIkEACCrAQEA2AIAIbABQADaAgAhsQFAANoCACHAAQAAhgTaASLLAQEA-gIAIdMBAQDYAgAh1AEBANgCACHVASAAtQMAIdYBAQD6AgAh2AEAAIUE2AEi2gEgAI4DACECAAAARAAgFQAAUQAgC6sBAQDYAgAhsAFAANoCACGxAUAA2gIAIcABAACGBNoBIssBAQD6AgAh0wEBANgCACHUAQEA2AIAIdUBIAC1AwAh1gEBAPoCACHYAQAAhQTYASLaASAAjgMAIQIAAABHACAVAABTACACAAAARwAgFQAAUwAgAwAAAEQAIBwAAEwAIB0AAFEAIAEAAABEACABAAAARwAgBgoAAIIEACAiAACEBAAgIwAAgwQAIMsBAAD2AgAg1gEAAPYCACDaAQAA9gIAIA6oAQAAsgIAMKkBAABaABCqAQAAsgIAMKsBAQCEAgAhsAFAAIYCACGxAUAAhgIAIcABAAC0AtoBIssBAQCQAgAh0wEBAIQCACHUAQEAhAIAIdUBIACfAgAh1gEBAJACACHYAQAAswLYASLaASAApgIAIQMAAABHACABAABZADAhAABaACADAAAARwAgAQAASAAwAgAARAAgDAMAAK4CACCoAQAAsQIAMKkBAAAkABCqAQAAsQIAMKsBAQAAAAGwAUAAmQIAIbEBQACZAgAhygEBAAAAAcsBAQCtAgAhzQEBAK0CACHRAQEArQIAIdIBAQCtAgAhAQAAAF0AIAEAAABdACAFAwAA-wMAIMsBAAD2AgAgzQEAAPYCACDRAQAA9gIAINIBAAD2AgAgAwAAACQAIAEAAGAAMAIAAF0AIAMAAAAkACABAABgADACAABdACADAAAAJAAgAQAAYAAwAgAAXQAgCQMAAIEEACCrAQEAAAABsAFAAAAAAbEBQAAAAAHKAQEAAAABywEBAAAAAc0BAQAAAAHRAQEAAAAB0gEBAAAAAQEVAABkACAIqwEBAAAAAbABQAAAAAGxAUAAAAABygEBAAAAAcsBAQAAAAHNAQEAAAAB0QEBAAAAAdIBAQAAAAEBFQAAZgAwARUAAGYAMAkDAACABAAgqwEBANgCACGwAUAA2gIAIbEBQADaAgAhygEBANgCACHLAQEA-gIAIc0BAQD6AgAh0QEBAPoCACHSAQEA-gIAIQIAAABdACAVAABpACAIqwEBANgCACGwAUAA2gIAIbEBQADaAgAhygEBANgCACHLAQEA-gIAIc0BAQD6AgAh0QEBAPoCACHSAQEA-gIAIQIAAAAkACAVAABrACACAAAAJAAgFQAAawAgAwAAAF0AIBwAAGQAIB0AAGkAIAEAAABdACABAAAAJAAgBwoAAP0DACAiAAD_AwAgIwAA_gMAIMsBAAD2AgAgzQEAAPYCACDRAQAA9gIAINIBAAD2AgAgC6gBAACwAgAwqQEAAHIAEKoBAACwAgAwqwEBAIQCACGwAUAAhgIAIbEBQACGAgAhygEBAIQCACHLAQEAkAIAIc0BAQCQAgAh0QEBAJACACHSAQEAkAIAIQMAAAAkACABAABxADAhAAByACADAAAAJAAgAQAAYAAwAgAAXQAgDwMAAK4CACANAACbAgAgDgAArwIAIKgBAACsAgAwqQEAACIAEKoBAACsAgAwqwEBAAAAAbABQACZAgAhsQFAAJkCACHKAQEAAAABywEBAK0CACHMAQEArQIAIc0BAQCtAgAh0QEBAK0CACHSAQEArQIAIQEAAAB1ACABAAAAdQAgCAMAAPsDACANAADUAwAgDgAA_AMAIMsBAAD2AgAgzAEAAPYCACDNAQAA9gIAINEBAAD2AgAg0gEAAPYCACADAAAAIgAgAQAAeAAwAgAAdQAgAwAAACIAIAEAAHgAMAIAAHUAIAMAAAAiACABAAB4ADACAAB1ACAMAwAA-AMAIA0AAPkDACAOAAD6AwAgqwEBAAAAAbABQAAAAAGxAUAAAAABygEBAAAAAcsBAQAAAAHMAQEAAAABzQEBAAAAAdEBAQAAAAHSAQEAAAABARUAAHwAIAmrAQEAAAABsAFAAAAAAbEBQAAAAAHKAQEAAAABywEBAAAAAcwBAQAAAAHNAQEAAAAB0QEBAAAAAdIBAQAAAAEBFQAAfgAwARUAAH4AMAwDAADjAwAgDQAA5AMAIA4AAOUDACCrAQEA2AIAIbABQADaAgAhsQFAANoCACHKAQEA2AIAIcsBAQD6AgAhzAEBAPoCACHNAQEA-gIAIdEBAQD6AgAh0gEBAPoCACECAAAAdQAgFQAAgQEAIAmrAQEA2AIAIbABQADaAgAhsQFAANoCACHKAQEA2AIAIcsBAQD6AgAhzAEBAPoCACHNAQEA-gIAIdEBAQD6AgAh0gEBAPoCACECAAAAIgAgFQAAgwEAIAIAAAAiACAVAACDAQAgAwAAAHUAIBwAAHwAIB0AAIEBACABAAAAdQAgAQAAACIAIAgKAADgAwAgIgAA4gMAICMAAOEDACDLAQAA9gIAIMwBAAD2AgAgzQEAAPYCACDRAQAA9gIAINIBAAD2AgAgDKgBAACrAgAwqQEAAIoBABCqAQAAqwIAMKsBAQCEAgAhsAFAAIYCACGxAUAAhgIAIcoBAQCEAgAhywEBAJACACHMAQEAkAIAIc0BAQCQAgAh0QEBAJACACHSAQEAkAIAIQMAAAAiACABAACJAQAwIQAAigEAIAMAAAAiACABAAB4ADACAAB1ACABAAAAEQAgAQAAABEAIAMAAAAHACABAAAQADACAAARACADAAAABwAgAQAAEAAwAgAAEQAgAwAAAAcAIAEAABAAMAIAABEAIBIDAAC7AwAgBAAAvAMAIAYAAN8DACALAAC9AwAgDQAAvwMAIA4AAL4DACCrAQEAAAABsAFAAAAAAbEBQAAAAAG9AQEAAAABvgEBAAAAAcoBAQAAAAHLAQEAAAABzAEBAAAAAc0BAQAAAAHOAQIAAAABzwECAAAAAdABIAAAAAEBFQAAkgEAIAyrAQEAAAABsAFAAAAAAbEBQAAAAAG9AQEAAAABvgEBAAAAAcoBAQAAAAHLAQEAAAABzAEBAAAAAc0BAQAAAAHOAQIAAAABzwECAAAAAdABIAAAAAEBFQAAlAEAMAEVAACUAQAwAQAAAAkAIAEAAAALACASAwAAkAMAIAQAAJEDACAGAADeAwAgCwAAkgMAIA0AAJQDACAOAACTAwAgqwEBANgCACGwAUAA2gIAIbEBQADaAgAhvQEBAPoCACG-AQEA-gIAIcoBAQDYAgAhywEBAPoCACHMAQEA-gIAIc0BAQD6AgAhzgECAI0DACHPAQIAjQMAIdABIACOAwAhAgAAABEAIBUAAJkBACAMqwEBANgCACGwAUAA2gIAIbEBQADaAgAhvQEBAPoCACG-AQEA-gIAIcoBAQDYAgAhywEBAPoCACHMAQEA-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_AgAgIwAA_gIAIAioAQAAlgIAMKkBAADSAQAQqgEAAJYCADCrAQEAhAIAIbABQACGAgAhsQFAAIYCACHCAQEAhAIAIcMBAQCEAgAhAwAAAAsAIAEAANEBADAhAADSAQAgAwAAAAsAIAEAAMABADACAAC9AQAgAQAAAAUAIAEAAAAFACADAAAAAwAgAQAABAAwAgAABQAgAwAAAAMAIAEAAAQAMAIAAAUAIAMAAAADACABAAAEADACAAAFACAOBAAA8AIAIAUAAPECACAGAADyAgAgDAAA7wIAIA4AAPwCACCrAQEAAAABrAEBAAAAAa0BAQAAAAGwAUAAAAABsQFAAAAAAb0BAQAAAAG-AQEAAAABwAEAAADAAQLBAQEAAAABARUAANoBACAJqwEBAAAAAawBAQAAAAGtAQEAAAABsAFAAAAAAbEBQAAAAAG9AQEAAAABvgEBAAAAAcABAAAAwAECwQEBAAAAAQEVAADcAQAwARUAANwBADABAAAAGAAgDgQAAOsCACAFAADsAgAgBgAA7QIAIAwAAOoCACAOAAD7AgAgqwEBANgCACGsAQEA2AIAIa0BAQDYAgAhsAFAANoCACGxAUAA2gIAIb0BAQDYAgAhvgEBANgCACHAAQAA6ALAASLBAQEA-gIAIQIAAAAFACAVAADgAQAgCasBAQDYAgAhrAEBANgCACGtAQEA2AIAIbABQADaAgAhsQFAANoCACG9AQEA2AIAIb4BAQDYAgAhwAEAAOgCwAEiwQEBAPoCACECAAAAAwAgFQAA4gEAIAIAAAADACAVAADiAQAgAQAAABgAIAMAAAAFACAcAADaAQAgHQAA4AEAIAEAAAAFACABAAAAAwAgBAoAAPcCACAiAAD5AgAgIwAA-AIAIMEBAAD2AgAgDKgBAACOAgAwqQEAAOoBABCqAQAAjgIAMKsBAQCEAgAhrAEBAIQCACGtAQEAhAIAIbABQACGAgAhsQFAAIYCACG9AQEAhAIAIb4BAQCEAgAhwAEAAI8CwAEiwQEBAJACACEDAAAAAwAgAQAA6QEAMCEAAOoBACADAAAAAwAgAQAABAAwAgAABQAgAQAAABoAIAEAAAAaACADAAAAGAAgAQAAGQAwAgAAGgAgAwAAABgAIAEAABkAMAIAABoAIAMAAAAYACABAAAZADACAAAaACAKBQAA9AIAIAwAAPMCACANAAD1AgAgqwEBAAAAAawBAQAAAAGtAQEAAAABrgECAAAAAa8BAQAAAAGwAUAAAAABsQFAAAAAAQEVAADyAQAgB6sBAQAAAAGsAQEAAAABrQEBAAAAAa4BAgAAAAGvAQEAAAABsAFAAAAAAbEBQAAAAAEBFQAA9AEAMAEVAAD0AQAwCgUAANwCACAMAADbAgAgDQAA3QIAIKsBAQDYAgAhrAEBANgCACGtAQEA2AIAIa4BAgDZAgAhrwEBANgCACGwAUAA2gIAIbEBQADaAgAhAgAAABoAIBUAAPcBACAHqwEBANgCACGsAQEA2AIAIa0BAQDYAgAhrgECANkCACGvAQEA2AIAIbABQADaAgAhsQFAANoCACECAAAAGAAgFQAA-QEAIAIAAAAYACAVAAD5AQAgAwAAABoAIBwAAPIBACAdAAD3AQAgAQAAABoAIAEAAAAYACAFCgAA0wIAICIAANYCACAjAADVAgAgZAAA1AIAIGUAANcCACAKqAEAAIMCADCpAQAAgAIAEKoBAACDAgAwqwEBAIQCACGsAQEAhAIAIa0BAQCEAgAhrgECAIUCACGvAQEAhAIAIbABQACGAgAhsQFAAIYCACEDAAAAGAAgAQAA_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AGAAgxQEAABgAIMYBAAAYACALqAEAALACADCpAQAAcgAQqgEAALACADCrAQEAhAIAIbABQACGAgAhsQFAAIYCACHKAQEAhAIAIcsBAQCQAgAhzQEBAJACACHRAQEAkAIAIdIBAQCQAgAhDAMAAK4CACCoAQAAsQIAMKkBAAAkABCqAQAAsQIAMKsBAQCYAgAhsAFAAJkCACGxAUAAmQIAIcoBAQCYAgAhywEBAK0CACHNAQEArQIAIdEBAQCtAgAh0gEBAK0CACEOqAEAALICADCpAQAAWgAQqgEAALICADCrAQEAhAIAIbABQACGAgAhsQFAAIYCACHAAQAAtALaASLLAQEAkAIAIdMBAQCEAgAh1AEBAIQCACHVASAAnwIAIdYBAQCQAgAh2AEAALMC2AEi2gEgAKYCACEHCgAAiAIAICIAALgCACAjAAC4AgAgsgEAAADYAQKzAQAAANgBCLQBAAAA2AEIuQEAALcC2AEiBwoAAIgCACAiAAC2AgAgIwAAtgIAILIBAAAA2gECswEAAADaAQi0AQAAANoBCLkBAAC1AtoBIgcKAACIAgAgIgAAtgIAICMAALYCACCyAQAAANoBArMBAAAA2gEItAEAAADaAQi5AQAAtQLaASIEsgEAAADaAQKzAQAAANoBCLQBAAAA2gEIuQEAALYC2gEiBwoAAIgCACAiAAC4AgAgIwAAuAIAILIBAAAA2AECswEAAADYAQi0AQAAANgBCLkBAAC3AtgBIgSyAQAAANgBArMBAAAA2AEItAEAAADYAQi5AQAAuALYASIRBQAAvgIAIAwAAL8CACAPAADAAgAgqAEAALkCADCpAQAARwAQqgEAALkCADCrAQEAmAIAIbABQACZAgAhsQFAAJkCACHAAQAAvALaASLLAQEArQIAIdMBAQCYAgAh1AEBAJgCACHVASAAugIAIdYBAQCtAgAh2AEAALsC2AEi2gEgAL0CACECsgEgAAAAAbkBIAChAgAhBLIBAAAA2AECswEAAADYAQi0AQAAANgBCLkBAAC4AtgBIgSyAQAAANoBArMBAAAA2gEItAEAAADaAQi5AQAAtgLaASICsgEgAAAAAbkBIACoAgAhFwMAAK4CACAEAADLAgAgBgAAzAIAIAsAAM0CACANAACbAgAgDgAArwIAIKgBAADJAgAwqQEAAAcAEKoBAAD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_wQAIOQBAAABACAFHAAA8wQAIB0AAP0EACDeAQAA9AQAIN8BAAD8BAAg5AEAABEAIAUcAADxBAAgHQAA-gQAIN4BAADyBAAg3wEAAPkEACDkAQAAvQEAIAwEAADwAgAgBQAA8QIAIAYAAPICACAMAADvAgAgqwEBAAAAAawBAQAAAAGtAQEAAAABsAFAAAAAAbEBQAAAAAG9AQEAAAABvgEBAAAAAcABAAAAwAECAxwAAPcEACDeAQAA-AQAIOQBAAB1ACADHAAA9QQAIN4BAAD2BAAg5AEAAAEAIAMcAADzBAAg3gEAAPQEACDkAQAAEQAgAxwAAPEEACDeAQAA8gQAIOQBAAC9AQAgAxwAAO8EACDeAQAA8AQAIOQBAAB1ACADHAAA7QQAIN4BAADuBAAg5AEAABEAIAQcAADeAgAw3gEAAN8CADDgAQAA4QIAIOQBAADiAgAwAAAAAAHhAQEAAAABBxwAAOgEACAdAADrBAAg3gEAAOkEACDfAQAA6gQAIOIBAAAYACDjAQAAGAAg5AEAABoAIAMcAADoBAAg3gEAAOkEACDkAQAAGgAgAAAABxwAAMkDACAdAADMAwAg3gEAAMoDACDfAQAAywMAIOIBAAANACDjAQAADQAg5AEAABYAIAscAADAAwAwHQAAxAMAMN4BAADBAwAw3wEAAMIDADDgAQAAwwMAIOEBAADiAgAw4gEAAOICADDjAQAA4gIAMOQBAADiAgAw5QEAAMUDADDmAQAA5QIAMAscAACDAwAwHQAAiAMAMN4BAACEAwAw3wEAAIUDADDgAQAAhgMAIOEBAACHAwAw4gEAAIcDADDjAQAAhwMAMOQBAACHAwAw5QEAAIkDADDmAQAAigMAMBADAAC7AwAgBAAAvAMAIAsAAL0DACANAAC_AwAgDgAAvgMAIKsBAQAAAAGwAUAAAAABsQFAAAAAAb0BAQAAAAHKAQEAAAABywEBAAAAAcwBAQAAAAHNAQEAAAABzgECAAAAAc8BAgAAAAHQASAAAAABAgAAABEAIBwAALoDACADAAAAEQAgHAAAugMAIB0AAI8DACABFQAA5wQAMBUDAACuAgAgBAAAywIAIAYAAMwCACALAADNAgAgDQAAmwIAIA4AAK8CACCoAQAAyQIAMKkBAAAHABCqAQAAyQIAMKsBAQAAAAGwAUAAmQIAIbEBQACZAgAhvQEBAK0CACG-AQEArQIAIcoBAQAAAAHLAQEArQIAIcwBAQCtAgAhzQEBAK0CACHOAQIAygIAIc8BAgDKAgAh0AEgAL0CACECAAAAEQAgFQAAjwMAIAIAAACLAwAgFQAAjAMAIA-oAQAAigMAMKkBAACLAwAQqgEAAIoDADCrAQEAmAIAIbABQACZAgAhsQFAAJkCACG9AQEArQIAIb4BAQCtAgAhygEBAJgCACHLAQEArQIAIcwBAQCtAgAhzQEBAK0CACHOAQIAygIAIc8BAgDKAgAh0AEgAL0CACEPqAEAAIoDADCpAQAAiwMAEKoBAACKAwAwqwEBAJgCACGwAUAAmQIAIbEBQACZAgAhvQEBAK0CACG-AQEArQIAIcoBAQCYAgAhywEBAK0CACHMAQEArQIAIc0BAQCtAgAhzgECAMoCACHPAQIAygIAIdABIAC9AgAhC6sBAQDYAgAhsAFAANoCACGxAUAA2gIAIb0BAQD6AgAhygEBANgCACHLAQEA-gIAIcwBAQD6AgAhzQEBAPoCACHOAQIAjQMAIc8BAgCNAwAh0AEgAI4DACEF4QECAAAAAecBAgAAAAHoAQIAAAAB6QECAAAAAeoBAgAAAAEB4QEgAAAAARADAACQAwAgBAAAkQMAIAsAAJIDACANAACUAwAgDgAAkwMAIKsBAQDYAgAhsAFAANoCACGxAUAA2gIAIb0BAQD6AgAhygEBANgCACHLAQEA-gIAIcwBAQD6AgAhzQEBAPoCACHOAQIAjQMAIc8BAgCNAwAh0AEgAI4DACEFHAAA1wQAIB0AAOUEACDeAQAA2AQAIN8BAADkBAAg5AEAAEQAIAccAADVBAAgHQAA4gQAIN4BAADWBAAg3wEAAOEEACDiAQAACQAg4wEAAAkAIOQBAAABACALHAAAqgMAMB0AAK8DADDeAQAAqwMAMN8BAACsAwAw4AEAAK0DACDhAQAArgMAMOIBAACuAwAw4wEAAK4DADDkAQAArgMAMOUBAACwAwAw5gEAALEDADALHAAAngMAMB0AAKMDADDeAQAAnwMAMN8BAACgAwAw4AEAAKEDACDhAQAAogMAMOIBAACiAwAw4wEAAKIDADDkAQAAogMAMOUBAACkAwAw5gEAAKUDADALHAAAlQMAMB0AAJkDADDeAQAAlgMAMN8BAACXAwAw4AEAAJgDACDhAQAA4gIAMOIBAADiAgAw4wEAAOICADDkAQAA4gIAMOUBAACaAwAw5gEAAOUCADAMBAAA8AIAIAYAAPICACAMAADvAgAgDgAA_AIAIKsBAQAAAAGsAQEAAAABsAFAAAAAAbEBQAAAAAG9AQEAAAABvgEBAAAAAcABAAAAwAECwQEBAAAAAQIAAAAFACAcAACdAwAgAwAAAAUAIBwAAJ0DACAdAACcAwAgARUAAOAEADACAAAABQAgFQAAnAMAIAIAAADmAgAgFQAAmwMAIAirAQEA2AIAIawBAQDYAgAhsAFAANoCACGxAUAA2gIAIb0BAQDYAgAhvgEBANgCACHAAQAA6ALAASLBAQEA-gIAIQwEAADrAgAgBgAA7QIAIAwAAOoCACAOAAD7AgAgqwEBANgCACGsAQEA2AIAIbABQADaAgAhsQFAANoCACG9AQEA2AIAIb4BAQDYAgAhwAEAAOgCwAEiwQEBAPoCACEMBAAA8AIAIAYAAPICACAMAADvAgAgDgAA_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-gIAIdEBAQD6AgAh0gEBAPoCACEKDQAA-QMAIA4AAPoDACCrAQEAAAABsAFAAAAAAbEBQAAAAAHLAQEAAAABzAEBAAAAAc0BAQAAAAHRAQEAAAAB0gEBAAAAAQIAAAB1ACAcAACPBAAgAwAAACIAIBwAAI8EACAdAACTBAAgDAAAACIAIA0AAOQDACAOAADlAwAgFQAAkwQAIKsBAQDYAgAhsAFAANoCACGxAUAA2gIAIcsBAQD6AgAhzAEBAPoCACHNAQEA-gIAIdEBAQD6AgAh0gEBAPoCACEKDQAA5AMAIA4AAOUDACCrAQEA2AIAIbABQADaAgAhsQFAANoCACHLAQEA-gIAIcwBAQD6AgAhzQEBAPoCACHRAQEA-gIAIdIBAQD6AgAhEAQAALwDACAGAADfAwAgCwAAvQMAIA0AAL8DACAOAAC-AwAgqwEBAAAAAbABQAAAAAGxAUAAAAABvQEBAAAAAb4BAQAAAAHLAQEAAAABzAEBAAAAAc0BAQAAAAHOAQIAAAABzwECAAAAAdABIAAAAAECAAAAEQAgHAAAlAQAIAMAAAAHACAcAACUBAAgHQAAmAQAIBIAAAAHACAEAACRAwAgBgAA3gMAIAsAAJIDACANAACUAwAgDgAAkwMAIBUAAJgEACCrAQEA2AIAIbABQADaAgAhsQFAANoCACG9AQEA-gIAIb4BAQD6AgAhywEBAPoCACHMAQEA-gIAIc0BAQD6AgAhzgECAI0DACHPAQIAjQMAIdABIACOAwAhEAQAAJEDACAGAADeAwAgCwAAkgMAIA0AAJQDACAOAACTAwAgqwEBANgCACGwAUAA2gIAIbEBQADaAgAhvQEBAPoCACG-AQEA-gIAIcsBAQD6AgAhzAEBAPoCACHNAQEA-gIAIc4BAgCNAwAhzwECAI0DACHQASAAjgMAIQMcAACUBAAg3gEAAJUEACDkAQAAEQAgAxwAAI8EACDeAQAAkAQAIOQBAAB1ACADHAAAigQAIN4BAACLBAAg5AEAAF0AIA4DAAD7AwAgBAAAuQQAIAYAALgEACALAAC6BAAgDQAA1AMAIA4AAPwDACC9AQAA9gIAIL4BAAD2AgAgywEAAPYCACDMAQAA9gIAIM0BAAD2AgAgzgEAAPYCACDPAQAA9gIAINABAAD2AgAgCAMAAPsDACANAADUAwAgDgAA_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-gIAIb4BAQD6AgAhygEBANgCACHLAQEA-gIAIcwBAQD6AgAhzQEBAPoCACHOAQIAjQMAIc8BAgCNAwAh0AEgAI4DACERAwAAkAMAIAQAAJEDACAGAADeAwAgDQAAlAMAIA4AAJMDACCrAQEA2AIAIbABQADaAgAhsQFAANoCACG9AQEA-gIAIb4BAQD6AgAhygEBANgCACHLAQEA-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_gQAIBMAAAAHACADAACQAwAgBAAAkQMAIAYAAN4DACALAACSAwAgDgAAkwMAIBUAAP4EACCrAQEA2AIAIbABQADaAgAhsQFAANoCACG9AQEA-gIAIb4BAQD6AgAhygEBANgCACHLAQEA-gIAIcwBAQD6AgAhzQEBAPoCACHOAQIAjQMAIc8BAgCNAwAh0AEgAI4DACERAwAAkAMAIAQAAJEDACAGAADeAwAgCwAAkgMAIA4AAJMDACCrAQEA2AIAIbABQADaAgAhsQFAANoCACG9AQEA-gIAIb4BAQD6AgAhygEBANgCACHLAQEA-gIAIcwBAQD6AgAhzQEBAPoCACHOAQIAjQMAIc8BAgCNAwAh0AEgAI4DACEDAAAACQAgHAAA9QQAIB0AAIEFACAJAAAACQAgCQAAowQAIBUAAIEFACCrAQEA2AIAIbABQADaAgAhsQFAANoCACHLAQEA2AIAIdoBIAC1AwAh2wEBANgCACEHCQAAowQAIKsBAQDYAgAhsAFAANoCACGxAUAA2gIAIcsBAQDYAgAh2gEgALUDACHbAQEA2AIAIQMAAAAiACAcAAD3BAAgHQAAhAUAIA0AAAAiACADAADjAwAgDgAA5QMAIBUAAIQFACCrAQEA2AIAIbABQADaAgAhsQFAANoCACHKAQEA2AIAIcsBAQD6AgAhzAEBAPoCACHNAQEA-gIAIdEBAQD6AgAh0gEBAPoCACELAwAA4wMAIA4AAOUDACCrAQEA2AIAIbABQADaAgAhsQFAANoCACHKAQEA2AIAIcsBAQD6AgAhzAEBAPoCACHNAQEA-gIAIdEBAQD6AgAh0gEBAPoCACEIqwEBAAAAAawBAQAAAAGtAQEAAAABsAFAAAAAAbEBQAAAAAG9AQEAAAABvgEBAAAAAcABAAAAwAECAwAAAAcAIBwAAO0EACAdAACIBQAgEwAAAAcAIAMAAJADACAEAACRAwAgBgAA3gMAIAsAAJIDACANAACUAwAgFQAAiAUAIKsBAQDYAgAhsAFAANoCACGxAUAA2gIAIb0BAQD6AgAhvgEBAPoCACHKAQEA2AIAIcsBAQD6AgAhzAEBAPoCACHNAQEA-gIAIc4BAgCNAwAhzwECAI0DACHQASAAjgMAIREDAACQAwAgBAAAkQMAIAYAAN4DACALAACSAwAgDQAAlAMAIKsBAQDYAgAhsAFAANoCACGxAUAA2gIAIb0BAQD6AgAhvgEBAPoCACHKAQEA2AIAIcsBAQD6AgAhzAEBAPoCACHNAQEA-gIAIc4BAgCNAwAhzwECAI0DACHQASAAjgMAIQMAAAAiACAcAADvBAAgHQAAiwUAIA0AAAAiACADAADjAwAgDQAA5AMAIBUAAIsFACCrAQEA2AIAIbABQADaAgAhsQFAANoCACHKAQEA2AIAIcsBAQD6AgAhzAEBAPoCACHNAQEA-gIAIdEBAQD6AgAh0gEBAPoCACELAwAA4wMAIA0AAOQDACCrAQEA2AIAIbABQADaAgAhsQFAANoCACHKAQEA2AIAIcsBAQD6AgAhzAEBAPoCACHNAQEA-gIAIdEBAQD6AgAh0gEBAPoCACEDCAYCCSsFCgAOBQQAAQUABQYABgwAAw4qCQQDAAQKAA0NJgIOJwkDBQgFDCMDDyUMBwMABAQKAQYMBgoACwsXBw0eAg4bCQQHDgcIDwIJEgUKAAgCBQAFBgAGAggTAAkUAAQFAAUKAAoMAAMNHAIBDR0AAwsfAA0hAA4gAAEDAAQCDSgADikAAggsAAktAAAAAAMKABMiABQjABUAAAADCgATIgAUIwAVAAADCgAaIgAbIwAcAAAAAwoAGiIAGyMAHAEDAAQBAwAEAwoAISIAIiMAIwAAAAMKACEiACIjACMBAwAEAQMABAMKACgiACkjACoAAAADCgAoIgApIwAqAwMABASXAQEGmAEGAwMABASeAQEGnwEGBQoALyIAMiMAM2QAMGUAMQAAAAAABQoALyIAMiMAM2QAMGUAMQIFAAUGAAYCBQAFBgAGAwoAOCIAOSMAOgAAAAMKADgiADkjADoAAAMKAD8iAEAjAEEAAAADCgA_IgBAIwBBBQQAAQUABQYABgwAAw7fAQkFBAABBQAFBgAGDAADDuUBCQMKAEYiAEcjAEgAAAADCgBGIgBHIwBIAgUABQwAAwIFAAUMAAMFCgBNIgBQIwBRZABOZQBPAAAAAAAFCgBNIgBQIwBRZABOZQBPEAIBES4BEjABEzEBFDIBFjQBFzYPGDcQGTkBGjsPGzwRHj0BHz4BID8PJEISJUMWJkUEJ0YEKEkEKUoEKksEK00ELE8PLVAXLlIEL1QPMFUYMVYEMlcEM1gPNFsZNVwdNl4MN18MOGEMOWIMOmMMO2UMPGcPPWgePmoMP2wPQG0fQW4MQm8MQ3APRHMgRXQkRnYDR3cDSHkDSXoDSnsDS30DTH8PTYABJU6CAQNPhAEPUIUBJlGGAQNShwEDU4gBD1SLASdVjAErVo0BBVeOAQVYjwEFWZABBVqRAQVbkwEFXJUBD12WASxemgEFX5wBD2CdAS1hoAEFYqEBBWOiAQ9mpQEuZ6YBNGinAQdpqAEHaqkBB2uqAQdsqwEHba0BB26vAQ9vsAE1cLIBB3G0AQ9ytQE2c7YBB3S3AQd1uAEPdrsBN3e8ATt4vgEGeb8BBnrBAQZ7wgEGfMMBBn3FAQZ-xwEPf8gBPIABygEGgQHMAQ-CAc0BPYMBzgEGhAHPAQaFAdABD4YB0wE-hwHUAUKIAdUBAokB1gECigHXAQKLAdgBAowB2QECjQHbAQKOAd0BD48B3gFDkAHhAQKRAeMBD5IB5AFEkwHmAQKUAecBApUB6AEPlgHrAUWXAewBSZgB7QEJmQHuAQmaAe8BCZsB8AEJnAHxAQmdAfMBCZ4B9QEPnwH2AUqgAfgBCaEB-gEPogH7AUujAfwBCaQB_QEJpQH-AQ-mAYECTKcBggJS"
};
async function decodeBase64AsWasm(wasmBase64) {
  const { Buffer: Buffer2 } = await import("buffer");
  const wasmArray = Buffer2.from(wasmBase64, "base64");
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
var prismaNamespace_exports = {};
__export(prismaNamespace_exports, {
  AdminScalarFieldEnum: () => AdminScalarFieldEnum,
  AnyNull: () => AnyNull2,
  AvailabilityScalarFieldEnum: () => AvailabilityScalarFieldEnum,
  BookingScalarFieldEnum: () => BookingScalarFieldEnum,
  CategoryScalarFieldEnum: () => CategoryScalarFieldEnum,
  DbNull: () => DbNull2,
  Decimal: () => Decimal2,
  JsonNull: () => JsonNull2,
  ModelName: () => ModelName,
  NullTypes: () => NullTypes2,
  NullsOrder: () => NullsOrder,
  PrismaClientInitializationError: () => PrismaClientInitializationError2,
  PrismaClientKnownRequestError: () => PrismaClientKnownRequestError2,
  PrismaClientRustPanicError: () => PrismaClientRustPanicError2,
  PrismaClientUnknownRequestError: () => PrismaClientUnknownRequestError2,
  PrismaClientValidationError: () => PrismaClientValidationError2,
  QueryMode: () => QueryMode,
  ReviewScalarFieldEnum: () => ReviewScalarFieldEnum,
  SlotScalarFieldEnum: () => SlotScalarFieldEnum,
  SortOrder: () => SortOrder,
  Sql: () => Sql2,
  StudentScalarFieldEnum: () => StudentScalarFieldEnum,
  TransactionIsolationLevel: () => TransactionIsolationLevel,
  TutorScalarFieldEnum: () => TutorScalarFieldEnum,
  UserScalarFieldEnum: () => UserScalarFieldEnum,
  defineExtension: () => defineExtension,
  empty: () => empty2,
  getExtensionContext: () => getExtensionContext,
  join: () => join2,
  prismaVersion: () => prismaVersion,
  raw: () => raw2,
  sql: () => sql
});
import * as runtime2 from "@prisma/client/runtime/client";
var PrismaClientKnownRequestError2 = runtime2.PrismaClientKnownRequestError;
var PrismaClientUnknownRequestError2 = runtime2.PrismaClientUnknownRequestError;
var PrismaClientRustPanicError2 = runtime2.PrismaClientRustPanicError;
var PrismaClientInitializationError2 = runtime2.PrismaClientInitializationError;
var PrismaClientValidationError2 = runtime2.PrismaClientValidationError;
var sql = runtime2.sqltag;
var empty2 = runtime2.empty;
var join2 = runtime2.join;
var raw2 = runtime2.raw;
var Sql2 = runtime2.Sql;
var Decimal2 = runtime2.Decimal;
var getExtensionContext = runtime2.Extensions.getExtensionContext;
var prismaVersion = {
  client: "7.4.2",
  engine: "94a226be1cf2967af2541cca5529f0f7ba866919"
};
var NullTypes2 = {
  DbNull: runtime2.NullTypes.DbNull,
  JsonNull: runtime2.NullTypes.JsonNull,
  AnyNull: runtime2.NullTypes.AnyNull
};
var DbNull2 = runtime2.DbNull;
var JsonNull2 = runtime2.JsonNull;
var AnyNull2 = runtime2.AnyNull;
var ModelName = {
  Category: "Category",
  User: "User",
  Admin: "Admin",
  Student: "Student",
  Tutor: "Tutor",
  Availability: "Availability",
  Slot: "Slot",
  Booking: "Booking",
  Review: "Review"
};
var TransactionIsolationLevel = runtime2.makeStrictEnum({
  ReadUncommitted: "ReadUncommitted",
  ReadCommitted: "ReadCommitted",
  RepeatableRead: "RepeatableRead",
  Serializable: "Serializable"
});
var CategoryScalarFieldEnum = {
  id: "id",
  name: "name",
  slug: "slug",
  isActive: "isActive",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var UserScalarFieldEnum = {
  id: "id",
  name: "name",
  email: "email",
  password: "password",
  emailVerified: "emailVerified",
  image: "image",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  role: "role",
  status: "status",
  isActive: "isActive"
};
var AdminScalarFieldEnum = {
  id: "id",
  userId: "userId",
  name: "name",
  phone: "phone",
  address: "address",
  profilePhoto: "profilePhoto",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var StudentScalarFieldEnum = {
  id: "id",
  userId: "userId",
  name: "name",
  bio: "bio",
  phone: "phone",
  address: "address",
  profilePhoto: "profilePhoto",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var TutorScalarFieldEnum = {
  id: "id",
  userId: "userId",
  name: "name",
  categoryId: "categoryId",
  bio: "bio",
  slotId: "slotId",
  profilePhoto: "profilePhoto",
  hourlyRate: "hourlyRate",
  experienceYear: "experienceYear",
  isVerified: "isVerified",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var AvailabilityScalarFieldEnum = {
  id: "id",
  tutorId: "tutorId",
  slotId: "slotId",
  dayOfWeek: "dayOfWeek",
  startTime: "startTime",
  endTime: "endTime",
  isBooked: "isBooked",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var SlotScalarFieldEnum = {
  id: "id",
  startTime: "startTime",
  endTime: "endTime",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var BookingScalarFieldEnum = {
  id: "id",
  studentId: "studentId",
  categoryId: "categoryId",
  tutorId: "tutorId",
  slotId: "slotId",
  status: "status",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  reviewId: "reviewId"
};
var ReviewScalarFieldEnum = {
  id: "id",
  studentId: "studentId",
  tutorId: "tutorId",
  rating: "rating",
  comment: "comment",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var SortOrder = {
  asc: "asc",
  desc: "desc"
};
var QueryMode = {
  default: "default",
  insensitive: "insensitive"
};
var NullsOrder = {
  first: "first",
  last: "last"
};
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
import jwt from "jsonwebtoken";

// src/config/index.ts
import { config as config2 } from "dotenv";
import path2 from "path";
config2({ path: path2.join(process.cwd(), ".env") });
var config_default = {
  database_url: process.env.DATABASE_URL,
  common: {
    node_env: process.env.NODE_ENV,
    port: process.env.PORT,
    client_app_url: process.env.CLIENT_APP_URL
  },
  jwt: {
    access_token_secret: process.env.ACCESS_TOKEN_SECRET,
    access_token_expires_in: process.env.ACCESS_TOKEN_EXPIRES_IN
  }
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
    const user = await prisma.user.create({ data: payload });
    userId = user.id;
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
    if (user.id) {
      if (!config_default.jwt.access_token_secret) {
        return;
      }
      const accessToken = jwt.sign(
        { email, role: user.role },
        config_default.jwt.access_token_secret,
        {
          expiresIn: config_default.jwt.access_token_expires_in
        }
      );
      return { accessToken };
    }
  } catch (error) {
    if (userId) {
      await prisma.user.delete({
        where: { id: userId }
      });
    }
    throw error;
  }
};
var loginUserIntoDB = async (payload) => {
  const { email, password } = payload;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new AppError(404, "User not found");
  }
  if (user.password !== password) {
    throw new AppError(404, "Password doesn't match");
  }
  if (!config_default.jwt.access_token_secret) {
    return;
  }
  const accessToken = jwt.sign(
    { email, role: user.role },
    config_default.jwt.access_token_secret,
    {
      expiresIn: config_default.jwt.access_token_expires_in
    }
  );
  return { accessToken };
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
var getMeFromDB = async (email) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new AppError(404, "User not found");
  }
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    emailVerified: user.emailVerified,
    image: user.image,
    role: user.role,
    status: user.status,
    isActive: user.isActive
  };
};
var userService = {
  getSpecificUserFromDB,
  createUserIntoDB,
  loginUserIntoDB,
  updateUserIntoDB,
  getMeFromDB
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
    res.cookie("accessToken", result?.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 1e3 * 60 * 60 * 24 * 180,
      path: "/"
    });
    return res.status(200).json({
      success: true,
      message: "User created succesfully"
    });
  } catch (error) {
    next(error);
  }
});
var loginUser = catchAsync(async (req, res, next) => {
  try {
    const result = await userService.loginUserIntoDB(req.body);
    res.cookie("accessToken", result?.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 1e3 * 60 * 60 * 24 * 180,
      path: "/"
    });
    return res.status(200).json({
      success: true,
      message: "Logged in successfully"
    });
  } catch (error) {
    next(error);
  }
});
var signOut = catchAsync(async (req, res, next) => {
  try {
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/"
    });
    return res.status(200).json({
      success: true,
      message: "signOut successfully"
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
var getMe = catchAsync(async (req, res, next) => {
  try {
    const result = await userService.getMeFromDB(req.user?.email);
    sendResponse_default(res, {
      statusCode: 200,
      success: true,
      message: "Get me succesfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
});
var userController = {
  getSpecificUser,
  createUser,
  loginUser,
  signOut,
  updateUser,
  getMe
};

// src/app/middelware/auth.ts
import jwt2 from "jsonwebtoken";
var auth = (...roles) => {
  return async (req, res, next) => {
    try {
      const token = req.cookies.accessToken;
      if (token) {
        const decoded = jwt2.verify(
          token,
          config_default.jwt.access_token_secret
        );
        const payload = decoded;
        const user = await prisma.user.findUnique({
          where: { email: payload.email }
        });
        if (!user) {
          throw new AppError(404, "You are not authorized");
        }
        req.user = {
          id: user.id,
          email: user.email,
          name: user?.name,
          role: user.role,
          emailVerified: user.emailVerified
        };
        if (roles && !roles.includes(user?.role)) {
          res.status(402).json({
            success: false,
            message: "You are not authorized user!"
          });
        }
        next();
      }
    } catch (error) {
      next(error);
    }
  };
};

// src/app/modules/user/user.route.ts
var userRouter = express2.Router();
userRouter.get("/:userId", userController.getSpecificUser);
userRouter.get(
  "/get/me",
  auth(UserRole.STUDENT, UserRole.ADMIN, UserRole.TUTOR),
  userController.getMe
);
userRouter.post("/signup", userController.createUser);
userRouter.post("/login", userController.loginUser);
userRouter.post("/sign-out", userController.signOut);
userRouter.patch(
  "/update/:userId",
  auth(UserRole.STUDENT, UserRole.ADMIN, UserRole.TUTOR),
  userController.updateUser
);
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
  const existingBooking = await prisma.booking.findFirst({
    where: {
      studentId,
      tutorId,
      slotId
    }
  });
  if (existingBooking) {
    throw new AppError(400, "You have already booked");
  }
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

// src/app/modules/booking/booking.route.ts
var bookingRouter = express7.Router();
bookingRouter.get(
  "/",
  auth(UserRole.TUTOR, UserRole.ADMIN),
  bookingController.getAllBookings
);
bookingRouter.post(
  "/booking-session",
  auth(UserRole.STUDENT),
  bookingController.bookingSession
);
bookingRouter.patch(
  "/booking-session/update/:bookingId",
  auth(UserRole.TUTOR, UserRole.ADMIN),
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
  auth(UserRole.STUDENT),
  reviewController.addReview
);
var review_route_default = reviewRouter;

// src/app.ts
import cookieParser from "cookie-parser";

// src/app/middelware/globalErrorHandler.ts
function globalErrorHandler(err, req, res, next) {
  let statusCode = 500;
  let message = "Somthing went wrong";
  let errorDetails = err;
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    errorDetails = err;
  } else if (err instanceof Error) {
    statusCode = 404;
    message = err.message;
    errorDetails = err;
  } else if (err instanceof prismaNamespace_exports.PrismaClientValidationError) {
    statusCode = 400;
    message = "You provided incorrect field or missing field";
    errorDetails = err;
  } else if (err instanceof prismaNamespace_exports.PrismaClientKnownRequestError) {
    const prismaClientKnownRequestError = {
      P1013: "The provided database string is invalid. {details}",
      P1014: "The underlying {kind} for model {model} does not exist.",
      P1015: "Your Prisma schema is using features that are not supported for the version of the database.\nDatabase version: {database_version}\nErrors:\n{errors}",
      P1016: "Your raw query had an incorrect number of parameters. Expected: {expected}, actual: {actual}.",
      P1017: "Server has closed the connection.",
      P2000: "The provided value for the column is too long for the column's type. Column: {column_name}",
      P2001: "The record searched for in the where condition ({model_name}.{argument_name} = {argument_value}) does not exist",
      P2002: "Unique constraint failed on the {constraint}",
      P2003: "Foreign key constraint failed on the field: {field_name}",
      P2004: "A constraint failed on the database: {database_error}",
      P2005: "The value {field_value} stored in the database for the field {field_name} is invalid for the field's type",
      P2006: "The provided value {field_value} for {model_name} field {field_name} is not valid",
      P2007: "Data validation error {database_error}",
      P2008: "Failed to parse the query {query_parsing_error} at {query_position}",
      P2009: "Failed to validate the query: {query_validation_error} at {query_position}",
      P2010: "Raw query failed. Code: {code}. Message: {message}",
      P2011: "Null constraint violation on the {constraint}",
      P2012: "Missing a required value at {path}",
      P2013: "Missing the required argument {argument_name} for field {field_name} on {object_name}.",
      P2014: "The change you are trying to make would violate the required relation '{relation_name}' between the {model_a_name} and {model_b_name} models.",
      P2015: "A related record could not be found. {details}",
      P2016: "Query interpretation error. {details}",
      P2017: "The records for relation {relation_name} between the {parent_name} and {child_name} models are not connected.",
      P2018: "The required connected records were not found. {details}",
      P2019: "Input error. {details}",
      P2020: "Value out of range for the type. {details}",
      P2021: "The table {table} does not exist in the current database.",
      P2022: "The column {column} does not exist in the current database.",
      P2023: "Inconsistent column data: {message}",
      P2024: "Timed out fetching a new connection from the connection pool. (Current connection pool timeout: {timeout}, connection limit: {connection_limit})",
      P2025: "An operation failed because it depends on one or more records that were required but not found. {cause}",
      P2026: "The current database provider doesn't support a feature that the query used: {feature}",
      P2027: "Multiple errors occurred on the database during query execution: {errors}",
      P2028: "Transaction API error: {error}",
      P2029: "Query parameter limit exceeded error: {message}",
      P2030: "Cannot find a fulltext index to use for the search, try adding a @@fulltext([Fields...]) to your schema",
      P2031: "Prisma needs to perform transactions, which requires your MongoDB server to be run as a replica set.",
      P2033: "A number used in the query does not fit into a 64 bit signed integer. Consider using BigInt as field type if you're trying to store large integers",
      P2034: "Transaction failed due to a write conflict or a deadlock. Please retry your transaction",
      P2035: "Assertion violation on the database: {database_error}",
      P2036: "Error in external connector (id {id})",
      P2037: "Too many database connections opened: {message}"
    };
    statusCode = 400;
    message = prismaClientKnownRequestError[err.code];
    errorDetails = err;
  } else if (err instanceof prismaNamespace_exports.PrismaClientUnknownRequestError) {
    statusCode = 500;
    message = "error ocurred ducring query execution";
  } else if (err instanceof prismaNamespace_exports.PrismaClientRustPanicError) {
    statusCode = 500;
    message = "This is a non-recoverable error which probably happens when the Prisma Query Engine has a panic";
  } else if (err instanceof prismaNamespace_exports.PrismaClientInitializationError) {
    statusCode = 500;
    message = "Error occur in initialization";
  }
  res.status(statusCode).json({
    statusCode,
    message,
    errorDetails
  });
}

// src/app.ts
var app = express9();
app.use(express9.json());
app.use(cookieParser());
var allowedOrigins = [config_default.common.client_app_url, "http://localhost:3000"];
app.use(
  cors({
    origin: function(origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true
  })
);
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
app.use(globalErrorHandler);
var app_default = app;

// src/index.ts
var index_default = app_default;
export {
  index_default as default
};
