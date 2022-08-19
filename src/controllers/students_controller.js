import student from "../models/student";
import user from "../models/user";
import section from "../models/section";
import representative from "../models/representative";
import comment from "../models/comment";
import mongoose from "mongoose";
import dateFormat from "dateformat";
import fs from "fs";
import { parsePhoneNumber } from "awesome-phonenumber";
import path from "path";
import * as csv from "fast-csv";
import readXlsxFile from "read-excel-file/node";
import { date } from "../libs/dateformat";
import { getComments } from "./comment_controller";
import { verifyForms } from "../middlewares";
import { addStudentsSectionRegistered } from "../controllers/sections_controller";

let now = new Date();

dateFormat.i18n = date;

//Lista de estudiantes
export const list = async (req, res) => {
    if (req.query) {
        const { limit, page, students } = req.query;
        if (limit && isNaN(limit))
            return res
                .status(400)
                .json({ message: "El limite de elementos no es un numero!" });
        if (page && isNaN(page))
            return res
                .status(400)
                .json({ message: "El limite de paginas no es un numero!" });
        if (Number(students))
            return res
                .status(400)
                .json({ message: "La busqueda no es una cadena!" });
    }

    let optionsPagination = {
        lean: false,
        limit: req.query && Number(req.query.limit) ? req.query.limit : 10,
        page: req.query && Number(req.query.page) ? req.query.page : 1,
        select: { subjects: 0, record: 0 },
        populate: { path: "section", select: { name: 1 } },
    };

    const students = await student.paginate(
        {
            $or: [
                { firstname: new RegExp(req.query.search, "gi") },
                { lastname: new RegExp(req.query.search, "gi") },
            ],
            $and: [
                { status: req.query.students === "activos" ? true : false },
                { graduate: req.query.students === "graduados" ? true : false },
                req.query.section && req.query.add
                    ? { section: { $exists: req.query.section || false } }
                    : {},
            ],
        },
        optionsPagination
    );

    if (students.totalDocs < 0) {
        return res.status(404).json({ message: "Estudiantes no encontrados" });
    }

    return res.json(students);
};

//Saved score from subjects for student
export const saveScore = async (req, res) => {
    try {
        const id = req.params.id;
        const scores = req.body.scores;
        const studentFind = await student.findById(id);
        if (!studentFind)
            return res.status(404).json({ message: "Student No Found" });
        if (studentFind.subjects.length !== scores.length)
            return res
                .status(400)
                .json({ message: "Scores length is not the same" });
        const invalidScores = scores.filter((el) => el.length !== 3);

        if (invalidScores.length > 0)
            return res
                .status(400)
                .json({ message: "The Array element in scores not is valid" });

        const scoreUpdate = studentFind.subjects.map((el, i) => {
            return { subject: el.subject, scores: scores[i] };
        });

        await student.updateOne(
            { _id: id },
            { $set: { subjects: scoreUpdate } }
        );

        res.json(scores);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Error fatal a ocurrido" });
    }
};

//Consulta Estudiante individual
export const showStudent = async (req, res) => {
    const validId = mongoose.Types.ObjectId.isValid(req.params.id);
    if (!validId) return res.status(402).json("Identificador no valido");

    const studentFind = await student
        .findById(req.params.id)
        .populate("section", { students: 0, _id: 0, subjects: 0 })
        .populate("subjects.subject", { fromYears: 0, _id: 0 })
        .populate("representative");

    if(!studentFind){
        return res.status(404).json("Estudiante no encontrado o eliminado");
    }

    const comments = await getComments(req.params.id);

    const listPhone = studentFind.contact.phone_numbers;
    studentFind.contact.phone_numbers = listPhone.map((el) => {
        return {
            countryCode: el.countryCode,
            number: el.number,
            formatted: parsePhoneNumber(el.number, el.countryCode).getNumber(),
        };
    });

    res.json({ student: studentFind, comments: comments });
    

};

//Crear Estudiante Individual
export const createStudent = async (req, res) => {
    const { ci, firstname, lastname, contact, rep_data, section_id } = req.body;
    let validSection = false;
    const checkRegister = await verifyForms.verifyCreate(req.body);
    let repRegister;
    let newStudentRegister;
    if (checkRegister)
        return res.status(400).json({ message: checkRegister.message });
    if (section_id || section_id !== "") {
        const sectionFound = await section.findById(section_id);
        if (!sectionFound)
            return res
                .status(404)
                .json({ message: "Seccion no especificada encontrada!" });
        validSection = true;
    }
    if (contact) {
        const listPhone = contact.phone_numbers;
        contact.phone_numbers = listPhone.map((el) => {
            return {
                countryCode: el.countryCode,
                number: el.number,
                formatted: parsePhoneNumber(
                    el.number,
                    el.countryCode
                ).getNumber(),
            };
        });
    }
    newStudentRegister = {
        ci,
        firstname,
        lastname,
        contact: contact,
        last_modify: dateFormat(now, "dddd, d De mmmm , yyyy, h:MM:ss TT"),
    };

    if (section_id && section_id !== "")
        newStudentRegister.section = section_id;

    // If exists id verify and register representative on student
    if (rep_data && rep_data.id) {
        const repFound = await representative.findOne({ _id: rep_data.id });
        if (!repFound)
            return res
                .status(400)
                .json({ message: "Representante no encontrado" });
        newStudentRegister.representative = repFound.id;
    }
    if (rep_data && !rep_data.id) {
        const checkRep = await verifyForms.verifyRep(rep_data);
        if (checkRep === true) {
            const listPhone = rep_data.contact.phone_numbers;
            rep_data.contact.phone_numbers = listPhone.map((el) => {
                return {
                    countryCode: el.countryCode,
                    number: el.number,
                    formatted: parsePhoneNumber(
                        el.number,
                        el.countryCode
                    ).getNumber(),
                };
            });
            //Register rep
            const newRep = new representative({
                ci: rep_data.ci,
                firstname: rep_data.firstname,
                lastname: rep_data.lastname,
                contact: rep_data.contact,
            });
            const savedRep = await newRep.save();
            newStudentRegister.representative = savedRep.id;
        } else {
            return res.status(400).json({ message: checkRep.message });
        }
    }

    const newStudent = new student(newStudentRegister);

    const saveStudent = await newStudent.save();
    if (validSection) {
        const addToSection = await addStudentsSectionRegistered(section_id, [
            saveStudent.id,
        ]);
    }
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

                const ci = row[Object.keys(row)[0]];

                if (
                    !Number(ci) ||
                    !Number.isInteger(Number(ci)) ||
                    Number(ci) < 0 ||
                    ci.length < 4
                ) {
                    return rowErrors.push(
                        `La cedula del estudiante en la fila ${rowsCount} es invalida`
                    );
                }

                if (!/^[A-Za-záéíóúñ'´ ]+$/.test(row[Object.keys(row)[1]])) {
                    return rowErrors.push(
                        `El nombre del estudiante en la fila: ${rowsCount} contiene caracteres invalidos`
                    );
                }

                if (!/^[A-Za-záéíóúñ'´ ]+$/.test(row[Object.keys(row)[2]])) {
                    return rowErrors.push(
                        `El apellido del estudiante en la fila: ${rowsCount} contiene caracteres invalidos`
                    );
                }

                if (row[Object.keys(row)[1]].length > 30) {
                    return rowErrors.push(
                        `El nombre del estudiante en la fila: ${rowsCount} es muy largo`
                    );
                }

                if (row[Object.keys(row)[2]].length > 30) {
                    return rowErrors.push(
                        `El apellido del estudiante en la fila: ${rowsCount} contiene caracteres invalidos`
                    );
                }

                const studentFind = await student.findOne({
                    ci: ci,
                });

                if (studentFind) {
                    return rowErrors.push(
                        `El estudiante de la fila: ${rowsCount} ha sido registrado anteriormente`
                    );
                }

                if (
                    studentsRegister.find(
                        (el) => el === ci
                    )
                ) {
                    return rowErrors.push(
                        `El estudiante de la fila: ${rowsCount} tiene una cedula que ya esta registrada `
                    );
                }

                const newStudent = new student({
                    ci: row[Object.keys(row)[0]],
                    firstname: row[Object.keys(row)[1]],
                    lastname: row[Object.keys(row)[2]],
                    last_modify: dateFormat(
                        now,
                        "dddd, d De mmmm , yyyy, h:MM:ss TT"
                    ),
                });

                const saveStudent = await newStudent.save();

                studentsRegister.push(ci);

                //if exist section row process to check and register
                let nameSection = row[Object.keys(row)[3]] || "";

                const sectionFound = await section.findOne({
                    name: nameSection,
                })

                if (sectionFound) {
                    const addToSection = await addStudentsSectionRegistered(
                        sectionFound.id,
                        [newStudent._id]
                    );
                }
            })

            .on("end", async () => {
                fs.unlink("./public/csv/" + req.file.originalname, (err) => {
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
                    return res.json({
                        message:
                            "Se presentaron algunos problemas al añadir estudiantes!",
                        errors: rowErrors,
                    });
                }
                return res.json({
                    message: "Todos los estudiantes del archivo CSV añadidos",
                });
            });
    }
    //Check file xlsx
    if (/[^.]+$/.exec(req.file.filename) == "xlsx") {
        let verify = true;
        let list = [];
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
                return res.status(400).json({
                    message: "Problemas con las cabeceras del archivo",
                    headerError,
                });
            }
            rows.shift(); //Delete headers from array

            list = rows;
        });
        for (const row of list) {
            rowsCount += 1;
            //Verify and register
            verify = await verifyForms.verifyXls(
                row,
                rowsCount,
                studentsRegister
            );

            if (verify !== true) {
                rowErrors.push(verify.message);
            } else {
                const newStudent = new student({
                    ci: row[0],
                    firstname: row[1],
                    lastname: row[2],
                    last_modify: dateFormat(
                        now,
                        "dddd, d De mmmm , yyyy, h:MM:ss TT"
                    ),
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

        return res.json({
            message: "Todos los estudiantes del archivo han sido registrados",
        });
    }
};

//Update the student,if pass id in rep_data update the field representative
export const updateStudent = async (req, res) => {
    const studentInfo = req.body;
    const studentInfoActual = await student.findById(req.params.id)
    const studentFind = await student.findOne({ ci: req.body.ci });
    const sectionFound = await section.findById(studentFind.section);

    if (studentInfo.graduate && sectionFound) {
        return res.status(400).json({
            message:
                "No puedes graduar el estudiante ya que actualmente esta cursando una seccion",
        });
    }

    if (
        !Number(req.body.ci) ||
        !Number.isInteger(Number(req.body.ci)) ||
        Number(req.body.ci) < 0
    ) {
        return res
            .status(400)
            .json("Parámetros en Cédula inválidos,solo números!");
    }

    if (!/^[A-Za-záéíóúñ'´ ]+$/.test(req.body.firstname)) {
        return res.status(400).json("Parámetros en Nombre inválidos!");
    }

    if (!/^[A-Za-záéíóúñ'´ ]+$/.test(req.body.lastname)) {
        return res.status(400).json("Parámetros en Apellido inválidos!");
    }

    if (studentFind && studentFind.ci !== studentInfo.ci) {
        return res
            .status(400)
            .json(
                "Cambio de Cédula rechazado,la cédula la posee otro estudiante!"
            );
    }

    await student.updateOne(
        { _id: req.params.id },
        {
            $set: {
                ci: req.body.ci ? req.body.ci : studentInfoActual.ci,
                firstname: req.body.firstname
                    ? req.body.firstname
                    : studentInfoActual.firstname,
                lastname: req.body.lastname
                    ? req.body.lastname
                    : studentInfoActual.lastname,
                graduate: studentInfo.graduate || studentInfoActual.graduate,
                status: req.body.status,
                contact: req.body.contact || studentInfoActual.contact,
                representative: studentInfo.rep_data && studentInfo.rep_data._id,
                last_modify: dateFormat(
                    now,
                    "dddd, d De mmmm , yyyy, h:MM:ss TT"
                ),
            },
            $unset:studentInfo.deleteSection ? {section:1} : {} && studentInfo.rep_data.id ? {representative:1} : {} 
        },
        { upsert: true }
    );

    res.json({ message: "Estudiante Actualizado!" });
};

//Borrar estudiante/s

export const deleteStudents = async (req, res) => {
    const ids = req.body;

    for (const id of ids) {
        const validId = mongoose.Types.ObjectId.isValid(id);
        if (!validId) return res.status(400).json("ID invalido");
        const studentFound = student.findOne({ _id: id });
        if (studentFound) {
            const chest_student = chest.findOne({ student: studentFound.id });
            if (chest_student) {
                await chest.findByIdAndDelete(chest_student.id);
            }
            await comment.deleteMany({ user: id });
            await student.findByIdAndDelete(id);
            await section.updateOne(
                { _id: studentFound.section },
                { $pull: { students: studentFound.id } }
            );
        }
    }

    res.json("Estudiante/s Eliminado/s");
};