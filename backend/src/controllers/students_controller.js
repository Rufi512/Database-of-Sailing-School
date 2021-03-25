import student from "../models/student";
import user from "../models/user";
import comment from "../models/comment";
import mongoose from "mongoose";
import dateFormat from "dateformat";
import fs from "fs";
import path from "path";
import * as csv from "fast-csv";
import { date } from "../libs/dateformat";
import { materias1, materias2, materias3, materias4} from "../libs/subjects.js";
import { getComments } from "./comment_controller";
import { graduate, demote } from "./graduation_controller";
let now = new Date();

dateFormat.i18n = date;

//Lista de estudiantes
export const active = async (req, res) => {
  const studentsActive = await student
    .find(
      { status: true, school_year: { $ne: "Graduado" } },
      { annual_comments: 0, subjects: 0, record: 0, comments: 0 }
    )
    .sort({ _id: -1 });
  const actives = studentsActive.length;

  if (!actives) {
    return res.status(404).json("Estudiantes activos no encontrados");
  } else {
    return res.json(studentsActive);
  }
};

export const inactive = async (req, res) => {
  const studentsInactive = await student
    .find(
      { status: false, school_year: { $ne: "Graduado" } },
      { annual_comments: 0, subjects: 0, record: 0, comments: 0 }
    )
    .sort({ _id: -1 });
  const inactive = studentsInactive.length;
  if (!inactive) {
    return res.status(404).json("Estudiantes inactivos no encontrados");
  } else {
    return res.json(studentsInactive);
  }
};

export const gradues = async (req, res) => {
  const studentsGradues = await student
    .find(
      { school_year: "Graduado" },
      { annual_comments: 0, subjects: 0, record: 0, comments: 0 }
    )
    .sort({ _id: -1 });
  const gradues = studentsGradues.length;
  if (!gradues) {
    return res.status(404).json("Estudiantes graduados no encontrados");
  } else {
    return res.json(studentsGradues);
  }
};

//Consulta Estudiante individual
export const showStudent = async (req, res) => {
  const validId = mongoose.Types.ObjectId.isValid(req.params.id);
  if (!validId) return res.status(402).json("Identificador no valido");

  const studentFind = await student.findById(req.params.id);
  const comments = await getComments(req.params.id);

  if (studentFind) {
    res.json({ student: studentFind, comments: comments });
  } else {
    res.status(404).json("Estudiante no encontrado o eliminado");
  }
};

//Crear Estudiante Individual

export const createStudent = async (req, res) => {
  const { ci, firstName, lastName, school_year } = req.body;

  const studentFind = await student.findOne({ ci: ci });

  if (studentFind)
    return res
      .status(400)
      .json("El estudiate ha sido registrado anteriormente en el sistema!");

  const newStudent = new student({
    ci,
    firstName,
    lastName,
    school_year,
    last_modify: dateFormat(now, "dddd, d De mmmm , yyyy, h:MM:ss TT"),
  });

  //Se le asigna la materias al estudiante correspondiente al año
  switch (school_year) {
    case "1-A":
    case "1-B": {
      newStudent.subjects = materias1;
      break;
    }

    case "2-A":
    case "2-B": {
      newStudent.subjects = materias2;
      break;
    }

    case "3-A":
    case "3-B": {
      newStudent.subjects = materias3;
      break;
    }

    case "4-A":
    case "4-B":
    case "5-A":
    case "5-B": {
      newStudent.subjects = materias4;
      break;
    }

    default:
      return res.status(400).json("Año escolar invalido");
  }

  const saveStudent = await newStudent.save();
  console.log(saveStudent);
  res.json("Estudiante registrado");
};

//Registro estudiante masivo

export const createStudents = (req, res) => {
  const archive = req.file.path;
  let studentsRegister = [];
  fs.createReadStream(archive)
    .pipe(csv.parse({ headers: true }))
    .on("error", (error) => console.error(error))
    .on("data", async (row) => {
      const studentFind = await student.findOne({
        $or: [{ ci: row.cedula }, { firstName: row.nombre }],
      });
      if (studentFind) {
        console.log(
          "Estudiante de cedula:" +
            row.cedula +
            " ha sido registrado anteriormente"
        );
        return;
      }

      if (studentsRegister.find((el) => el === row.cedula)) {
        console.log("la cedula:", row.cedula, " Repite!");
        return;
      }

      studentsRegister.push(row.cedula);

      const newStudent = new student({
        ci: row.cedula,
        firstName: row.nombre,
        lastName: row.apellido,
        school_year: row.curso,
        last_modify: dateFormat(now, "dddd, d De mmmm , yyyy, h:MM:ss TT"),
      });

      switch (row.curso) {
        case "1-A":
        case "1-B": {
          newStudent.subjects = materias1;
          break;
        }

        case "2-A":
        case "2-B": {
          newStudent.subjects = materias2;
          break;
        }

        case "3-A":
        case "3-B": {
          newStudent.subjects = materias3;
          break;
        }

        case "4-A":
        case "4-B":
        case "5-A":
        case "5-B": {
          newStudent.subjects = materias4;
          break;
        }
      }

      await newStudent.save();
    })

    .on("end", async () => {
      await fs.unlink("./public/csv/" + req.file.originalname, (err) => {
        console.log(err);
      });

      res.json("Todos los estudiantes del archivo CSV añadidos");
    });
};

//Actualiza al estudiante (Solo Cedula,nombre,apellido,sus notas de las materias y estado)

export const updateStudent = async (req, res) => {
  const { ci, firstName, lastName, subjects, status } = await student.findById(
    req.params.id
  );

  await student.updateOne(
    { _id: req.params.id },
    {
      $set: {
        ci: req.body.ci ? req.body.ci : ci,
        firstName: req.body.firstName ? req.body.firstName : firstName,
        lastName: req.body.lastName ? req.body.lastName : lastName,
        subjects: req.body.subjects ? req.body.subjects : subjects,
        status: req.body.status,
        last_modify: dateFormat(now, "dddd, d De mmmm , yyyy, h:MM:ss TT"),
      },
    }
  );
  res.json("Estudiante Actualizado!");
};

//Graduar estudiante/s

export const graduateStudent = async (req, res) => {
  const ids = req.body;
  for (const id of ids) {
    await graduate(id);
  }

  if (ids.length === 1) {
    res.json("Estudiante graduado");
  } else {
    res.json("Estudiantes graduados");
  }
};

//Degrada estudiante/s

export const demoteStudent = async (req, res) => {
  const ids = req.body;
  for (const id of ids) {
    await demote(id);
  }

  if (ids.length === 1) {
    res.json("Estudiante graduado");
  } else {
    res.json("Estudiantes graduados");
  }
};

//Borrar estudiante/s

export const deleteStudents = async (req, res) => {
  const ids = req.body;

  for (const id of ids) {
    const validId = mongoose.Types.ObjectId.isValid(id);
    if (!validId) return res.status(400).json('ID invalido')
      await comment.deleteMany({user:id});
      await student.findByIdAndDelete(id);
    
  }

  res.json("Estudiante/s Eliminado/s");
};
