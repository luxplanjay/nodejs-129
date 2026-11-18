import { Segments, Joi } from "celebrate";
import { isValidObjectId } from "mongoose";

// /students?page=2&perPage=15
export const getStudentsSchema = {
  [Segments.QUERY]: Joi.object({
    page: Joi.number().integer().min(1),
    perPage: Joi.number().integer().min(5).max(20),
    minAvgMark: Joi.number().positive(),
    studentGender: Joi.string().valid("male", "female", "other"),
    search: Joi.string().trim().allow(""),
    sortBy: Joi.string().valid("name", "age", "avgMark", "createdAt"),
    sortOrder: Joi.string().valid("asc", "desc"),
  }),
};

export const createStudentSchema = {
  [Segments.BODY]: Joi.object({
    name: Joi.string().min(3).max(50).required(),
    age: Joi.number().integer().min(10).max(80).required(),
    gender: Joi.string().valid("male", "female", "other").required(),
    avgMark: Joi.number().min(2).max(15).required(),
    onDuty: Joi.boolean(),
  }),
};

// isValidObjectId("qweqweqwe") > true/false
const objectIdValidator = (value, helpers) => {
  // ✅ Якщо value це валідний ObjectId то повернути сам value
  if (isValidObjectId(value)) {
    return value;
  }

  // ❌ Якщо не підходить то helpers.message("помилка")
  return helpers.message("помилка валідаціі id");
};

export const studentIdParamSchema = {
  [Segments.PARAMS]: {
    studentId: Joi.string().custom(objectIdValidator).required(),
  },
};

export const updateStudentSchema = {
  [Segments.BODY]: Joi.object({
    name: Joi.string().min(3).max(50),
    age: Joi.number().integer().min(10).max(80),
    gender: Joi.string().valid("male", "female", "other"),
    avgMark: Joi.number().min(2).max(15),
    onDuty: Joi.boolean(),
  }).min(1),
  ...studentIdParamSchema,
};

// /students?id=a → ["a"], /students?id=a&id=b → ["a", "b"]
export const deleteStudentsSchema = {
  [Segments.QUERY]: Joi.object({
    id: Joi.array()
      .items(Joi.string().custom(objectIdValidator))
      .single()
      .min(1)
      .required(),
  }),
};
