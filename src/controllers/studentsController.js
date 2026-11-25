import createHttpError from "http-errors";
import { Student } from "../models/student.js";

// /students?page=2&perPage=15&minAvgMark=5&studentGender=male&search=olf&sortBy=&sortOrder=
export const getStudents = async (req, res) => {
  const {
    page = 1,
    perPage = 5,
    minAvgMark,
    studentGender,
    search,
    sortBy = "_id",
    sortOrder = "asc",
  } = req.query;

  const skip = (page - 1) * perPage;
  const limit = perPage;

  const filter = {
    userId: { $eq: req.user._id },
  };

  if (minAvgMark !== undefined) {
    filter.avgMark = { $gte: minAvgMark };
  }

  if (studentGender !== undefined) {
    filter.gender = { $eq: studentGender };
  }

  if (search !== undefined) {
    filter.name = { $regex: RegExp.escape(search), $options: "i" };
  }

  const [students, totalItems] = await Promise.all([
    Student.find(filter)
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit),
    Student.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(totalItems / perPage);

  res.status(200).json({
    totalItems,
    totalPages,
    students,
  });
};

export const getStudentById = async (req, res) => {
  const { studentId } = req.params;

  const student = await Student.findOne({
    _id: studentId,
    userId: req.user._id,
  });

  if (!student) {
    throw createHttpError(404, "Student not found");
  }

  res.status(200).json(student);
};

export const createStudent = async (req, res) => {
  const student = await Student.create({
    ...req.body,
    userId: req.user._id,
  });
  res.status(201).json(student);
};

export const deleteStudent = async (req, res) => {
  const { studentId } = req.params;

  const student = await Student.findOneAndDelete({
    _id: studentId,
    userId: req.user._id,
  });

  if (!student) {
    throw createHttpError(404, "Student not found");
  }

  // res.status(204).send();
  res.status(200).json(student);
};

export const deleteStudents = async (req, res) => {
  // celebrate already validated id and converted it to an array
  const ids = req.query.id;

  const { deletedCount } = await Student.deleteMany({
    _id: { $in: ids },
    userId: req.user._id,
  });

  res.status(200).json({ deletedCount });
};

export const updateStudent = async (req, res) => {
  const { studentId } = req.params;

  const student = await Student.findOneAndUpdate(
    { _id: studentId, userId: req.user._id },
    req.body,
    {
      returnDocument: "after",
    },
  );

  if (!student) {
    throw createHttpError(404, "Student not found");
  }

  res.status(200).json(student);
};
