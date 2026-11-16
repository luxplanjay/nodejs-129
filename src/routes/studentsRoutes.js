import { Router } from "express";
import { celebrate } from "celebrate";
import {
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  deleteStudents,
} from "../controllers/studentsController.js";
import {
  createStudentSchema,
  deleteStudentsSchema,
  getStudentsSchema,
  studentIdParamSchema,
  updateStudentSchema,
} from "../validations/studentsValidation.js";

const router = Router();

router.get("/students", celebrate(getStudentsSchema), getStudents);

router.get(
  "/students/:studentId",
  celebrate(studentIdParamSchema),
  getStudentById,
);

router.post("/students", celebrate(createStudentSchema), createStudent);

router.delete("/students", celebrate(deleteStudentsSchema), deleteStudents);

router.delete(
  "/students/:studentId",
  celebrate(studentIdParamSchema),
  deleteStudent,
);

router.patch(
  "/students/:studentId",
  celebrate(updateStudentSchema),
  updateStudent,
);

export default router;
