import createHttpError from "http-errors";
import { Student } from "../models/student.js";

export const getStudents = async (req, res) => {
  const students = await Student.find();
  res.status(200).json(students);
};

export const getStudentById = async (req, res) => {
  const { studentId } = req.params;

  // const student = await Student.findById(studentId);
  const student = await Student.findOne({ _id: studentId });

  if (!student) {
    // return res.status(404).json({ message: "Student not found!" });
    throw createHttpError(404, "Student not found");
  }

  res.status(200).json(student);
};

export const createStudent = (req, res) => {
  res.status(201).json({
    id: Date.now(),
    ...req.body,
  });
};

export const updateStudent = (req, res) => {
  res.status(200).json({});
};

export const deleteStudent = (req, res) => {
  res.status(200).json({});
};
