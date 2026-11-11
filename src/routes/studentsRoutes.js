import { Router } from "express";
import {
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  deleteStudents,
} from "../controllers/studentsController.js";

const router = Router();

router.get("/students", getStudents);

router.get("/students/:studentId", getStudentById);

router.post("/students", createStudent);

router.delete("/students", deleteStudents);

router.delete("/students/:studentId", deleteStudent);

router.patch("/students/:studentId", updateStudent);

export default router;
