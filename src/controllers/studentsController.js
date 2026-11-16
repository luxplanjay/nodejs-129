import createHttpError from "http-errors";
import { Student } from "../models/student.js";

// /students?page=2&perPage=15
export const getStudents = async (req, res) => {
  const { page = 1, perPage = 5 } = req.query;
  console.log(page, perPage);

  const students = await Student.find();
  res.status(200).json(students);
};

export const getStudentById = async (req, res) => {
  const { studentId } = req.params;

  const student = await Student.findOne({ _id: studentId });

  if (!student) {
    throw createHttpError(404, "Student not found");
  }

  res.status(200).json(student);
};

export const createStudent = async (req, res) => {
  const student = await Student.create(req.body);
  res.status(201).json(student);
};

export const deleteStudent = async (req, res) => {
  const { studentId } = req.params;

  const student = await Student.findOneAndDelete({ _id: studentId });

  if (!student) {
    throw createHttpError(404, "Student not found");
  }

  // res.status(204).send();
  res.status(200).json(student);
};

export const deleteStudents = async (req, res) => {
  // celebrate already validated id and converted it to an array
  const ids = req.query.id;

  const { deletedCount } = await Student.deleteMany({ _id: { $in: ids } });

  res.status(200).json({ deletedCount });
};

export const updateStudent = async (req, res) => {
  const { studentId } = req.params;

  const student = await Student.findOneAndUpdate({ _id: studentId }, req.body, {
    returnDocument: "after",
  });

  if (!student) {
    throw createHttpError(404, "Student not found");
  }

  res.status(200).json(student);
};
