import student from "../models/student";
import user from "../models/user";
import representative from '../models/representative'
import comment from "../models/comment";
import mongoose from "mongoose";
import dateFormat from "dateformat";
import fs from "fs";
import path from "path";
import * as csv from "fast-csv";
import readXlsxFile from 'read-excel-file/node'
import { date } from "../libs/dateformat";
import {
    materias1,
    materias2,
    materias3,
    materias4,
} from "../libs/subjects.js";
import { getComments } from "./comment_controller";
import { graduate, demote } from "./graduation_controller";
import { verifyForms } from '../middlewares'
let now = new Date();

dateFormat.i18n = date;

//Lista de estudiantes
export const list = async (req, res) => {
    if (req.query) {
        const { limit, page, students } = req.query
        if (limit && isNaN(limit)) return res.status(400).json({ message: 'El limite de elementos no es un numero!' })
        if (page && isNaN(page)) return res.status(400).json({ message: 'El limite de paginas no es un numero!' })
        if (Number(students)) return res.status(400).json({ message: 'La busqueda no es una cadena!' })
    }


    let optionsPagination = {
        lean: false,
        limit: req.query && Number(req.query.limit) ? req.query.limit : 10,
        page: req.query && Number(req.query.page) ? req.query.page : 1,
        select: { subjects: 0, record: 0 }
    };

    let students
    if (req.query.students === "graduados") {
        students = await student.paginate({ school_year: "graduado" }, optionsPagination)
    } else {
        console.log('pass', req.query.students)
        students = await student.paginate({ status: req.query.students === "activos" ? true : false, school_year: req.query.students === "graduados" ? "graduado" : { $ne: "graduado" } }, optionsPagination)
    }


    if (students.totalDocs < 0) {
        return res.status(404).json({ message: "Estudiantes no encontrados" });
    }

    return res.json(students)
};

//Search students for the bar search

export const search = async (req, res) => {
    if (req.query) {
        const { limit, page, students } = req.query
        if (limit && isNaN(limit)) return res.status(400).json({ message: 'El limite de elementos no es un numero!' })
        if (page && isNaN(page)) return res.status(400).json({ message: 'El limite de paginas no es un numero!' })
        if (Number(students)) return res.status(400).json({ message: 'La busqueda no es una cadena!' })
    }

    let optionsPagination = {
        lean: false,
        limit: req.query && Number(req.query.limit) ? req.query.limit : 10,
        page: req.query && Number(req.query.page) ? req.query.page : 1,
        select: { subjects: 0, record: 0, contact: 0 }
    };

    const { search } = req.body
    //const students = await student.searchPartial(search)
    const students = await student.paginate({$or: [
                { "firstname": new RegExp(search, "gi") },
                { "lastname": new RegExp(search, "gi") },
            ]},optionsPagination)

    res.json(students)
}

export const inactive = async (req, res) => {

    if (req.query) {
        const { limit, page } = req.query
        if (limit && isNaN(limit)) return res.status(400).json({ message: 'query limit is not Number!' })
        if (page && isNaN(page)) return res.status(400).json({ message: 'query page is not Number!' })
    }

    let optionsPagination = {
        lean: false,
        limit: req.query && Number(req.query.limit) ? req.query.limit : 10,
        page: req.query && Number(req.query.page) ? req.query.page : 1
    };

    const studentsInactive = await student
        .find({ status: false, school_year: { $ne: "Graduado" } }, { annual_comments: 0, subjects: 0, record: 0, comments: 0 })
        .sort({ _id: -1 });

    const inactive = studentsInactive.length;

    if (!inactive) {
        return res.status(404).json({ message: "Estudiantes inactivos no encontrados" });
    }

    const list = await student.paginate({ status: false, school_year: { $ne: "Graduado" } }, optionsPagination)

    return res.json(list)
};

export const gradues = async (req, res) => {
    const studentsGradues = await student.find({ school_year: "Graduado" }, { annual_comments: 0, subjects: 0, record: 0, comments: 0 })
        .sort({ _id: -1 });

    if (req.query) {
        const { limit, page } = req.query
        if (limit && isNaN(limit)) return res.status(400).json({ message: 'query limit is not Number!' })
        if (page && isNaN(page)) return res.status(400).json({ message: 'query page is not Number!' })
    }

    let optionsPagination = {
        lean: false,
        limit: req.query && Number(req.query.limit) ? req.query.limit : 10,
        page: req.query && Number(req.query.page) ? req.query.page : 1
    };

    const gradues = studentsGradues.length;

    if (!gradues) {
        return res.status(404).json({ message: "Estudiantes graduados no encontrados" });
    }

    const list = await student.paginate({ school_year: "Graduado" }, optionsPagination)

    return res.json(list)

};

//Lista de estudiantes por curso
export const section = async (req, res) => {
    const studentsSection = await student
        .find({ status: true, school_year: req.body.school_year }, { annual_comments: 0, subjects: 0, record: 0, comments: 0 })
        .sort({ _id: -1 });
    const sections = studentsSection.length;
    if (!sections) {
        return res.status(404).json({ message: `Estudiantes del curso ${req.body.school_year} no encontrados` });
    }

    if (req.query) {
        const { limit, page } = req.query
        if (limit && isNaN(limit)) return res.status(400).json({ message: 'query limit is not Number!' })
        if (page && isNaN(page)) return res.status(400).json({ message: 'query page is not Number!' })
    }

    let optionsPagination = {
        lean: false,
        limit: req.query && Number(req.query.limit) ? req.query.limit : 10,
        page: req.query && Number(req.query.page) ? req.query.page : 1
    };

    const list = await student.paginate({ status: true, school_year: req.body.school_year }, optionsPagination)

    return res.json(list)

};

//Saved score from subjects for student
export const saveScore = async (req, res) => {
    try {
        const id = req.params.id
        const scores = req.body.scores
        const studentFind = await student.findById(id)
        if (!studentFind) return res.status(404).json({ message: 'Student No Found' })
        if (studentFind.subjects.length !== scores.length) return res.status(400).json({ message: 'Scores length is not the same' })
        const invalidScores = scores.filter((el) => el.length !== 3)

        if (invalidScores.length > 0) return res.status(400).json({ message: 'The Array element in scores not is valid' })

        const scoreUpdate = studentFind.subjects.map((el,i)=>{return {subject:el.subject,scores:scores[i]}})

        await student.updateOne({_id:id},{$set:{subjects:scoreUpdate}})
        
        res.json(scores)
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Error fatal a ocurrido' })
    }

}

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

    const studentFind = await student.findById(req.params.id).populate("section", { students: 0, _id: 0, subjects: 0 }).populate("subjects.subject", { fromYears: 0 }).populate("representative");
    const comments = await getComments(req.params.id);

    if (studentFind) {
        res.json({ student: studentFind, comments: comments });
    } else {
        res.status(404).json("Estudiante no encontrado o eliminado");
    }
};

//Crear Estudiante Individual
export const createStudent = async (req, res) => {
    const { ci, firstname, lastname, contact, rep_data, section_id } = req.body;
    const checkRegister = await verifyForms.verifyCreate(req.body)
    let repRegister
    let newStudentRegister 
    if (checkRegister) return res.status(400).json({ message: checkRegister.message })
    console.log('pass checked student')
    newStudentRegister = {
        ci,
        firstname,
        lastname,
        contact: contact,
        section:section_id,
        last_modify: dateFormat(now, "dddd, d De mmmm , yyyy, h:MM:ss TT"),
    }
    // If exists id verify and register representative on student
    if (rep_data && rep_data.id) {
        const repFound = await representative.findOne({ _id: rep_data.id })
        if (!repFound) return res.status(400).json({ message: 'Representante no encontrado' })
        newStudentRegister.representative = repFound.id
    }
    if (rep_data && !rep_data.id) {
        console.log(rep_data)
        const checkRep = await verifyForms.verifyRep(rep_data)
        console.log(checkRep)
        if (checkRep === true) {
            //Register rep
            const newRep = new representative({
                ci: rep_data.ci,
                firstname: rep_data.firstname,
                lastname: rep_data.lastname,
                contact: rep_data.contact
            })
            const savedRep = await newRep.save()
            console.log(savedRep)
            newStudentRegister.representative = savedRep.id
        } else {
            return res.status(400).json({ message: checkRep.message })
        }
    }

    


    const newStudent = new student(newStudentRegister);

    const saveStudent = await newStudent.save();
    console.log(saveStudent)
    res.json({ message: "Estudiante registrado" });
};

//Mass registration of students

export const createStudents = async (req, res) => {
    const archive = req.file.path;
    let rowsCount = 1;
    let headerError = { exist: false, description: "" };
    let rowErrors = [];
    let studentsRegister = [];
    if (/[^.]+$/.exec(req.file.filename) == "csv") {
        fs.createReadStream(archive)
            .pipe(csv.parse({ headers: true }))
            .on("headers", (header) => {
                if (
                    header[0].toLowerCase() !== "cedula" ||
                    header[1].toLowerCase() !== "nombre" ||
                    header[2].toLowerCase() !== "apellido"
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
                rowsCount += 1;

                if (headerError.exist) {
                    return;
                }
                if (!Number(row[Object.keys(row)[0]])) {
                    return rowErrors.push(`La cedula del estudiante en la fila ${rowsCount} es invalida`);
                }

                if (!/^[A-Za-záéíóúñ'´ ]+$/.test(row[Object.keys(row)[1]])) {
                    return rowErrors.push(`El nombre del estudiante en la fila: ${rowsCount} contiene caracteres invalidos`);
                }

                if (!/^[A-Za-záéíóúñ'´ ]+$/.test(row[Object.keys(row)[2]])) {
                    return rowErrors.push(
                        `El apellido del estudiante en la fila: ${rowsCount} contiene caracteres invalidos`
                    );
                }

                if (row[Object.keys(row)[1]].length > 30) {
                    return rowErrors.push(`El nombre del estudiante en la fila: ${rowsCount} es muy largo`);
                }

                if (row[Object.keys(row)[2]].length > 30) {
                    return rowErrors.push(`El apellido del estudiante en la fila: ${rowsCount} contiene caracteres invalidos`);
                }


                const studentFind = await student.findOne({ ci: Number(row[Object.keys(row)[0]]) });

                if (studentFind) {
                    return rowErrors.push(`El estudiante de la fila: ${rowsCount} ha sido registrado anteriormente`);
                }

                if (studentsRegister.find((el) => el === Number(row[Object.keys(row)[0]]))) {
                    return;
                }

                const newStudent = new student({
                    ci: row[Object.keys(row)[0]],
                    firstname: row[Object.keys(row)[1]],
                    lastname: row[Object.keys(row)[2]],
                    last_modify: dateFormat(now, "dddd, d De mmmm , yyyy, h:MM:ss TT"),
                });

                await newStudent.save();
                studentsRegister.push(Number(row[Object.keys(row)[0]]));

            })

            .on("end", async () => {
                await fs.unlink("./public/csv/" + req.file.originalname, (err) => {
                    console.log(err);
                });

                if (headerError.exist) {
                    return res.status(400).json({
                        message: "Ha ocurrido un error al procesar CSV, " +
                            headerError.description,
                    });
                }

                if (rowErrors.length !== 0) {
                    return res.json({
                        message: "Algunos estudiantes no pudieron ser añadidos!",
                        errors: rowErrors,
                    });
                }
                res.json({ message: "Todos los estudiantes del archivo CSV añadidos" });
            });
    }
    //Check file xlsx 
    if (/[^.]+$/.exec(req.file.filename) == "xlsx") {
        let verify = true
        let list = []
        //Read the file
        await readXlsxFile(req.file.path).then((rows) => {
            if (
                rows[0][0].toLowerCase() !== "cedula" ||
                rows[0][1].toLowerCase() !== "nombre" ||
                rows[0][2].toLowerCase() !== "apellido"
            ) {
                headerError.exist = true;
                headerError.description =
                    "Las cabeceras no cumplen con el formato solicitado: Cedula | Nombre | Apellido";
                return res.status(400).json({ message: 'Problemas con las cabeceras del archivo', headerError })
            }
            rows.shift() //Delete headers from array

            list = rows
        })
        for (const row of list) {
            rowsCount += 1;
            //Verify and register
            verify = await verifyForms.verifyXls(row, rowsCount, studentsRegister)

            if (verify !== true) {
                rowErrors.push(verify.message)
            } else {
                const newStudent = new student({
                    ci: row[0],
                    firstname: row[1],
                    lastname: row[2],
                    last_modify: dateFormat(now, "dddd, d De mmmm , yyyy, h:MM:ss TT"),
                });

                await newStudent.save();
                studentsRegister.push(Number(row[0]));
            }
        }

        await fs.unlink("./public/csv/" + req.file.originalname, (err) => {
            console.log(err);
        });

        if (rowErrors.length !== 0) {
            return res.json({
                message: "Algunos estudiantes no pudieron ser añadidos!",
                errors: rowErrors,
            });
        }

        return res.json({ message: 'Todos los estudiantes del archivo han sido registrados' })
    }
};

//Update the student,if pass id in rep_data update the field representative
export const updateStudent = async (req, res) => {
    const { _id, ci, firstname, lastname, contact, rep_data } = await student.findById(
        req.params.id
    );

    const studentFind = await student.findOne({ ci: req.body.ci });

    if (!Number(req.body.ci) || !Number.isInteger(Number(req.body.ci)) || Number(req.body.ci) < 0) {
        return res.status(400).json("Parámetros en Cédula inválidos,solo números!")
    }


    if (!/^[A-Za-záéíóúñ'´ ]+$/.test(req.body.firstname)) {
        return res.status(400).json("Parámetros en Nombre inválidos!");
    }

    if (!/^[A-Za-záéíóúñ'´ ]+$/.test(req.body.lastname)) {
        return res.status(400).json("Parámetros en Apellido inválidos!");
    }


    if (studentFind && studentFind.ci !== ci) {
        return res.status(400).json("Cambio de Cédula rechazado,la cédula la posee otro estudiante!");
    }

    await student.updateOne({ _id: req.params.id }, {
        $set: {
            ci: req.body.ci ? req.body.ci : ci,
            firstname: req.body.firstname ? req.body.firstname : firstname,
            lastname: req.body.lastname ? req.body.lastname : lastname,
            status: req.body.status,
            contact: req.body.contact || contact,
            representative: rep_id,
            last_modify: dateFormat(now, "dddd, d De mmmm , yyyy, h:MM:ss TT"),
        },
    }, { upsert: true });
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

    if (ids.length === 1 && gradues[0] === false) {
        res.status(400).json("El estudiante no se puede graduar por no cumplir el minimo en la asignaturas (10 o mas en su promedio) o por estar inactivo")
    }

    if (ids.length > 1) {
        const notGradues = gradues.filter((el) => { return el === false })
        if (notGradues.length > 0) {
            res.status(400).json('Algunos estudiantes no pudieron ser graduados por no cumplir el minimo en las asignaturas')
        } else {
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

    if (ids.length === 1 && demotes[0] === false) {
        res.status(400).json("El estudiante no se puede reprobar por estar inactivo o ha alcanzado el minimo!")
    }

    if (ids.length > 1) {
        const notDemotes = demotes.filter((el) => { return el === false })
        if (notDemotes.length > 0) {
            res.status(400).json('Algunos estudiantes no pudieron ser reprobrados por estar inactivos o han alcanzado el minimo!')
        } else {
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
        const studentFound = student.findOne({_id:id})
        if(studentFound){
        const chest_student = chest.findOne({student:studentFound.id})
        if(chest_student){
            await chest.findByIdAndDelete(chest_student.id)
        }
        await comment.deleteMany({ user: id });
        await student.findByIdAndDelete(id);
        await section.updateOne({_id:studentFound.section},{$pull:{students:studentFound.id}})
    }
}

    res.json("Estudiante/s Eliminado/s");
};