import student from "../models/student";
import user from "../models/user";
import comment from "../models/comment";
import mongoose from "mongoose";
import dateFormat from "dateformat";
import fs from "fs";
import path from "path";
import * as csv from "fast-csv";
import { date } from "../libs/dateformat";
import {
  materias1,
  materias2,
  materias3,
  materias4,
} from "../libs/subjects.js";
import { getComments } from "./comment_controller";
import { graduate, demote } from "./graduation_controller";
let now = new Date();

dateFormat.i18n = date;

//Lista de estudiantes
export const list = async (req, res) => {
   if(req.query){
        const {limit, page, students} = req.query 
        if (limit && isNaN(limit)) return res.status(400).json({message:'El limite de elementos no es un numero!'})
        if (page && isNaN(page)) return res.status(400).json({message:'El limite de paginas no es un numero!'})
        if (Number(students)) return res.status(400).json({message:'La busqueda no es una cadena!'}) 
    }

  console.log(req.query)


  let optionsPagination = {
      lean: false,
      limit: req.query && Number(req.query.limit) ? req.query.limit : 10,
      page: req.query && Number(req.query.page)  ? req.query.page : 1,
      select:{subjects:0, record:0}
    };

  let students 
  if(req.query.students === "graduados"){
  students = await student.paginate({school_year:"graduado"},optionsPagination) 
  }else{
    console.log('pass', req.query.students)
    students = await student.paginate({status: req.query.students === "activos" ? true : false, school_year: req.query.students === "graduados" ? "graduado" : { $ne: "graduado" }},optionsPagination)
  }


  if (students.totalDocs < 0) {
    return res.status(404).json({message:"Estudiantes no encontrados"});
  } 

  return res.json(students)
};

export const search = async (req, res)=>{
  if(req.query){
       const {limit, page, students} = req.query 
       if (limit && isNaN(limit)) return res.status(400).json({message:'El limite de elementos no es un numero!'})
       if (page && isNaN(page)) return res.status(400).json({message:'El limite de paginas no es un numero!'})
       if (Number(students)) return res.status(400).json({message:'La busqueda no es una cadena!'}) 
    }

  let optionsPagination = {
      lean: false,
      limit: req.query && Number(req.query.limit) ? req.query.limit : 10,
      page: req.query && Number(req.query.page)  ? req.query.page : 1,
      select:{subjects:0, record:0}
    };

  const {search} = req.body

  const students = await student.paginate({ $text: { $search: new RegExp('^' + search) },status: req.query.students === "activos" ? true : false, school_year: req.query.students === "graduados" ? "graduado" : { $ne: "graduado" } },optionsPagination)

  res.json(students)
}

export const inactive = async (req, res) => {

  if(req.query){
        const {limit, page} = req.query 
        if (limit && isNaN(limit)) return res.status(400).json({message:'query limit is not Number!'})
        if (page && isNaN(page)) return res.status(400).json({message:'query page is not Number!'})
    }

  let optionsPagination = {
      lean: false,
      limit: req.query && Number(req.query.limit) ? req.query.limit : 10,
      page: req.query && Number(req.query.page)  ? req.query.page : 1 
    };

  const studentsInactive = await student
    .find(
      { status: false, school_year: { $ne: "Graduado" } },
      { annual_comments: 0, subjects: 0, record: 0, comments: 0 }
    )
    .sort({ _id: -1 });
  
  const inactive = studentsInactive.length;

  if (!inactive) {
    return res.status(404).json({message:"Estudiantes inactivos no encontrados"});
  } 

  const list = await student.paginate({status: false, school_year: { $ne: "Graduado" }},optionsPagination)

  return res.json(list)
};

export const gradues = async (req, res) => {
  const studentsGradues = await student.find(
      { school_year: "Graduado" },
      { annual_comments: 0, subjects: 0, record: 0, comments: 0 }
    )
    .sort({ _id: -1 });

  if(req.query){
        const {limit, page} = req.query 
        if (limit && isNaN(limit)) return res.status(400).json({message:'query limit is not Number!'})
        if (page && isNaN(page)) return res.status(400).json({message:'query page is not Number!'})
    }

  let optionsPagination = {
      lean: false,
      limit: req.query && Number(req.query.limit) ? req.query.limit : 10,
      page: req.query && Number(req.query.page)  ? req.query.page : 1 
    };

  const gradues = studentsGradues.length;

  if (!gradues) {
    return res.status(404).json({message:"Estudiantes graduados no encontrados"});
  } 

  const list = await student.paginate({school_year: "Graduado"},optionsPagination)

  return res.json(list)

};

//Lista de estudiantes por curso
export const section = async (req, res) => {
  const studentsSection = await student
    .find(
      { status: true, school_year: req.body.school_year },
      { annual_comments: 0, subjects: 0, record: 0, comments: 0 }
    )
    .sort({ _id: -1 });
  const sections = studentsSection.length;
  if (!sections) {
    return res.status(404).json({message:`Estudiantes del curso ${req.body.school_year} no encontrados`});
  }

  if(req.query){
        const {limit, page} = req.query 
        if (limit && isNaN(limit)) return res.status(400).json({message:'query limit is not Number!'})
        if (page && isNaN(page)) return res.status(400).json({message:'query page is not Number!'})
    }

  let optionsPagination = {
      lean: false,
      limit: req.query && Number(req.query.limit) ? req.query.limit : 10,
      page: req.query && Number(req.query.page)  ? req.query.page : 1 
    }; 

  const list = await student.paginate({status: true, school_year: req.body.school_year},optionsPagination)

  return res.json(list)

};

//Lista de estudiantes de cada curso (indicador)
/*
export const sectionMax = async (req, res) => {

  const studentsSectionMax = await student
    .find(
      { status: true,},
      { annual_comments: 0, subjects: 0, record: 0, comments: 0,ci:0,firstname:0,lastname:0,last_modify:0,_id:0 }
    )
    .sort({ _id: -1 });

  let maxA = [] 
  let maxB = [] 
 
  for(var i = 0; i<5; i++){
    maxA[i] = studentsSectionMax.filter((el)=>{return el.school_year === `${i+1}-A`}).length
    maxB[i] = studentsSectionMax.filter((el)=>{return el.school_year === `${i+1}-B`}).length
  }

    return res.json({
      section1:{
      studentsTotalA:maxA[0],
      studentsTotalB:maxB[0]
       },
       section2:{
      studentsTotalA:maxA[1],
      studentsTotalB:maxB[1]
       },
       section3:{
      studentsTotalA:maxA[2],
      studentsTotalB:maxB[2]
       },
       section4:{
      studentsTotalA:maxA[3],
      studentsTotalB:maxB[3]
       },
       section5:{
      studentsTotalA:maxA[4],
      studentsTotalB:maxB[4]
       },

     })
     

    
};
*/
//Consulta Estudiante individual
export const showStudent = async (req, res) => {
  const validId = mongoose.Types.ObjectId.isValid(req.params.id);
  if (!validId) return res.status(402).json("Identificador no valido");

  const studentFind = await student.findById(req.params.id).populate("section",{students:0,_id:0,subjects:0}).populate("subjects",{fromYears:0});
  const comments = await getComments(req.params.id);

  if (studentFind) {
    res.json({ student: studentFind, comments: comments });
  } else {
    res.status(404).json("Estudiante no encontrado o eliminado");
  }
};

//Crear Estudiante Individual

export const createStudent = async (req, res) => {
  const { ci, firstname, lastname, school_year } = req.body;
 
  if(!Number(ci) || !Number.isInteger(Number(ci)) || Number(ci) < 0){
    return res.status(400).json("Parámetros en Cédula inválidos,solo números!")
  }

  if(ci.length < 4){
    return res.status(400).json("Cedula del estudiante invalida")
  }

  if (Number(ci) > 9999999999) {
    return res.status(400).json("Parámetros en Cédula inválidos limite numerico excedido (maximo 10 digitos)");
  }

  if (!/^[A-Za-záéíóúñ'´ ]+$/.test(firstname)) {
    return res.status(400).json("Parámetros en Nombre inválidos");
  }

  if(firstname.length > 30){
    return res.status(400).json("Nombres muy largos maximo 30 caracteres");
  }

  if (!/^[A-Za-záéíóúñ'´ ]+$/.test(lastname)) {
    return res.status(400).json("Parámetros en Apellido inválidos");
  }

   if(lastname.length > 30){
    return res.status(400).json("Apellidos muy largos maximo 30 caracteres");
  }

  const studentFind = await student.findOne({ ci: ci });

  if (studentFind)
    return res.status(400).json("El estudiante ha sido registrado anteriormente en el sistema!");

  const newStudent = new student({
    ci,
    firstname,
    lastname,
    last_modify: dateFormat(now, "dddd, d De mmmm , yyyy, h:MM:ss TT"),
  });

  const saveStudent = await newStudent.save();

  res.json("Estudiante registrado");
};

//Registro estudiante masivo

export const createStudents = (req, res) => {
  const archive = req.file.path;
  let rows = 1;
  let headerError = { exist: false, description: "" };
  let rowErrors = [];
  let studentsRegister = [];
  fs.createReadStream(archive)
    .pipe(csv.parse({ headers: true }))
    .on("headers", (header) => {
      if (
        header[0] !== "Cedula" ||
        header[1] !== "Nombre" ||
        header[2] !== "Apellido"
      ) {
        headerError.exist = true;
        headerError.description =
          "Las cabeceras no cumplen con el formato solicitado: Cedula | Nombre | Apellido";
      }
    })
    .on("error", (err) => {
      return;
    })
    .on("data", async (row) => {
      rows += 1;

      if (headerError.exist) {
        return;
      }

      if (!Number(row.Cedula) || Number(row.Cedula) > 9999999999) {
        return rowErrors.push("La cédula es invalida en la fila: " + rows);
      }

      if (!/^[A-Za-záéíóúñ'´ ]+$/.test(row.Nombre)) {
        return rowErrors.push("El nombre contiene números en la fila: " + rows);
      }
      
      if(row.Nombre.length > 28){
      return res.status(400).json("El nombre es muy largo en la fila: " + rows);
     }

      if(row.Apellido.length > 28){
      return res.status(400).json("El apellido es muy largo en la fila: " + rows);
     }

      if (!/^[A-Za-záéíóúñ'´ ]+$/.test(row.Apellido)) {
        return rowErrors.push(
          "El apellido contiene números en la fila: " + rows
        );
      }

      const studentFind = await student.findOne({
        $or: [{ ci: row.Cedula }, { firstName: row.Nombre }],
      });

      if (studentFind) {
        return;
      }

      if (studentsRegister.find((el) => el === row.Cedula)) {
        return;
      }

      studentsRegister.push(row.Cedula);

      const newStudent = new student({
        ci: row.Cedula,
        firstname: row.Nombre,
        lastname: row.Apellido,
        last_modify: dateFormat(now, "dddd, d De mmmm , yyyy, h:MM:ss TT"),
      });

      await newStudent.save();
    })

    .on("end", async () => {
      await fs.unlink("./public/csv/" + req.file.originalname, (err) => {
        console.log(err);
      });

      if (headerError.exist) {
        return res.status(400).json({
            message:
              "Ha ocurrido un error al procesar CSV, " +
              headerError.description,
          });
      }

      if (rowErrors.length !== 0) {
        return res.status(400).json({
            message: "Algunos estudiantes no pudieron ser añadidos!",
            errors: rowErrors,
          });
      }
      res.json({ message: "Todos los estudiantes del archivo CSV añadidos" });
    });
};

//Actualiza al estudiante (Solo Cedula,Nombre,apellido,sus notas de las materias y estado)

export const updateStudent = async (req, res) => {
  const { _id, ci, firstname, lastname, subjects, status } = await student.findById(
    req.params.id
  );

   const studentFind = await student.findOne({ ci: req.body.ci });

   if(!Number(req.body.ci) || !Number.isInteger(Number(req.body.ci)) || Number(req.body.ci) < 0){
    return res.status(400).json("Parámetros en Cédula inválidos,solo números!")
  }

  if (Number(req.body.ci) > 9999999999) {
    return res.status(400).json("Parámetros en Cédula inválidos limite numerico excedido (maximo 10 digitos)");
  }

  if (!/^[A-Za-záéíóúñ'´ ]+$/.test(req.body.firstname)) {
    return res.status(400).json("Parámetros en Nombre inválidos!");
  }

  if (!/^[A-Za-záéíóúñ'´ ]+$/.test(req.body.lastname)) {
    return res.status(400).json("Parámetros en Apellido inválidos!");
  }

 
  if(studentFind && studentFind.ci !== ci ){ 
    return res.status(400).json("Cambio de Cédula rechazado,la cédula la posee otro estudiante!");
  }

  await student.updateOne(
    { _id: req.params.id },
    {
      $set: {
        ci: req.body.ci ? req.body.ci : ci,
        firstname: req.body.firstname ? req.body.firstname : firstname,
        lastname: req.body.lastname ? req.body.lastname : lastname,
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
  let gradues = []
  for (const id of ids) {
    const res = await graduate(id);
    gradues.push(res)
  }

  if (ids.length === 1 && gradues[0] === true) {
    res.json("Estudiante graduado");
  }

  if(ids.length === 1 && gradues[0] === false){
    res.status(400).json("El estudiante no se puede graduar por no cumplir el minimo en la asignaturas (10 o mas en su promedio) o por estar inactivo")
  }

  if(ids.length > 1){
    const notGradues = gradues.filter((el)=>{return el === false})
    if(notGradues.length > 0){
      res.status(400).json('Algunos estudiantes no pudieron ser graduados por no cumplir el minimo en las asignaturas')
    }else{
      res.json("Estudiantes graduados");
    }
  }
};

//Degrada estudiante/s

export const demoteStudent = async (req, res) => {
  const ids = req.body;
  let demotes = []
  for (const id of ids) {
   const res = await demote(id);
   demotes.push(res)
  }

  if (ids.length === 1 && demotes[0] === true) {
    res.json("Estudiante reprobrado");
  }

  if(ids.length === 1 && demotes[0] === false){
    res.status(400).json("El estudiante no se puede reprobar por estar inactivo o ha alcanzado el minimo!")
  }

  if(ids.length > 1){
    const notDemotes = demotes.filter((el)=>{return el === false})
    if(notDemotes.length > 0){
      res.status(400).json('Algunos estudiantes no pudieron ser reprobrados por estar inactivos o han alcanzado el minimo!')
    }else{
      res.json("Estudiantes reprobrados");
    }
  } 


};

//Borrar estudiante/s

export const deleteStudents = async (req, res) => {
  const ids = req.body;

  for (const id of ids) {
    const validId = mongoose.Types.ObjectId.isValid(id);
    if (!validId) return res.status(400).json("ID invalido");
    await comment.deleteMany({ user: id });
    await student.findByIdAndDelete(id);
  }

  res.json("Estudiante/s Eliminado/s");
};
