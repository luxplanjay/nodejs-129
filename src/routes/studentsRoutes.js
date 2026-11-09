import { Router } from "express";
import {
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
} from "../controllers/studentsController.js";

const router = Router();

router.get("/students", getStudents);

router.get("/students/:studentId", getStudentById);

router.post("/students", createStudent);

router.patch("/students/:studentId", updateStudent);

router.delete("/students/:studentId", deleteStudent);

export default router;
