import createHttpError from "http-errors";
import { isValidObjectId } from "mongoose";
import { Student } from "../models/student.js";

export const getStudents = async (req, res) => {
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
  // ?id=a → "a", ?id=a&id=b → ["a", "b"], no id → undefined
  const ids = [].concat(req.query.id ?? []);

  if (ids.length === 0) {
    throw createHttpError(400, "Query parameter 'id' is required");
  }

  if (!ids.every((id) => isValidObjectId(id))) {
    throw createHttpError(400, "Invalid student id");
  }

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
