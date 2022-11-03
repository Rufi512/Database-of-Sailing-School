import section from "../models/section";
import student from "../models/student";
import user from "../models/user";
import mongoose from "mongoose";
import { addSubjectsNewStudentsSection } from "../controllers/subjects_controller";
import { date } from "../libs/dateformat";
import {verifySignup} from "../middlewares"
import dateFormat from "dateformat";
import subject from "../models/subject";
const verifyFields = (req, res) => {
    if (
        !req.body.name ||
        !req.body.year ||
        !/^[0-9A-Za-záéíóúñ'´ ]+$/.test(req.body.name) ||
        !Number.isInteger(Number(req.body.year)) ||
        req.body.name.length > 40
    ) {
        return { message: "Datos invalidos" };
    }

    if (!req.body.period_initial || !req.body.completion_period) {
        return { message: "Indique el periodo de inicio y de culminacion" };
    }

    let dt = new Date();
    const year_actual = dt.getFullYear().toString();

    if (req.body.year > 10) {
        return { message: "Año invalido" };
    }

    if (
        Number(req.body.period_initial) < Number(year_actual) ||
        Number(req.body.completion_period) < Number(year_actual)
    ) {
        return {
            message:
                "Los años de periodo de inicio y culminacion no pueden ser menor al año actual ",
        };
    }

    return false;
};

const requestIds = async (id, sectionNew, isUpdated) => {
    let now = new Date();
    dateFormat.i18n = date;
    const studentFound = await student.findOne({ _id: id });
    if (!studentFound) return false;

    //Denegate if student is graduate
    if (studentFound.graduate === true) {
        return {
            ci: studentFound.ci,
            firstname: studentFound.firstname,
            lastname: studentFound.lastname,
        };
    }

    // Return if the student is in section previous and if registing in the new section not yet register
    if (studentFound.section && !sectionNew)
        return {
            ci: studentFound.ci,
            firstname: studentFound.firstname,
            lastname: studentFound.lastname,
        };

    if (studentFound.section != sectionNew.id && isUpdated) {
        // Delete Students by section previous and assign new
        await section.updateMany(
            { students: { $in: [studentFound.id] } },
            { $pull: { students: studentFound.id } }
        );
        await student.updateOne(
            { _id: id },
            { $set: { section: sectionNew.id } },
            { upsert: true }
        );
        return true;
    }

    //New in section
    if (!studentFound.section) {
        const res = await student.updateOne(
            { _id: id },
            {
                $set: {
                    section: sectionNew.id,
                    last_modify: dateFormat(
                        now,
                        "dddd, d De mmmm , yyyy, h:MM:ss TT"
                    ),
                },
            },
            { upsert: true }
        );
        return true;
    }

    // Denegate the change section if not update
    if (studentFound.section != sectionNew.id && !isUpdated) {
        return {
            ci: studentFound.ci,
            firstname: studentFound.firstname,
            lastname: studentFound.lastname,
        };
    }

    // Pass if section for student is the same
    if (studentFound.section == sectionNew.id) return true;

    return {
        ci: studentFound.ci,
        firstname: studentFound.firstname,
        lastname: studentFound.lastname,
    };
};

export const create = async (req, res) => {
    try {
        const isInvalid = verifyFields(req, res);
        if (isInvalid) {
            return res.status(400).json({ message: isInvalid.message });
        }
        const { name, year, students, period_initial, completion_period } =
            req.body;
        const sectionCheck = await section.find({ name: name.toLowerCase() });
        if (sectionCheck.length > 0)
            return res
                .status(400)
                .json({ message: "Seccion con el mismo nombre ya existe!" });

        //Create the section

        const newSection = new section({
            name: name.toLowerCase(),
            year: year,
            period_initial,
            completion_period,
        });

        const savedSection = await newSection.save();
        //Saved students for the section
        let arrayStudentsIds = [];
        let arrayStudentsInvalid = [];
        if (students) {
            for (const id of students) {
                const res = await requestIds(id, savedSection, false);
                if (res === true) {
                    arrayStudentsIds.push(id);
                } else {
                    arrayStudentsInvalid.push(res);
                }
            }

            await section.updateOne(
                { _id: savedSection.id },
                {
                    $set: {
                        students: arrayStudentsIds,
                    },
                }
            );

            if (arrayStudentsInvalid) {
                return res.json({
                    section: savedSection,
                    invalids: arrayStudentsInvalid,
                });
            }
        }
        await verifySignup.registerLog(req,`Creo la seccion ${savedSection.name}`)
        return res.json({
            section: savedSection,
            message: "Seccíon actualizada",
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Error en el servidor" });
    }
};

export const sectionInfo = async (req, res) => {
    try {
        const sectionFound = await section
            .findById(req.params.id)
            .populate("students", { subjects: 0, record: 0 })
            .populate("subjects", { fromYears: 0, score: 0 });
        if (!sectionFound)
            return res.status(404).json({ message: "Seccion no encontrada!" });
        res.json(sectionFound);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Error en el servidor" });
    }
};

export const listSelects = async (req, res) => {
    const sections = await section.find(
        {},
        { name: 1, year: 1, period_initial: 1, completion_period: 1 }
    );
    let newList = [];
    for (const elm of sections) {
        newList.push({
            value: elm.id,
            label: `${elm.name} - Año:${elm.year} - periodo: ${elm.period_initial}/${elm.completion_period}`,
        });
    }
    res.json(newList);
};

export const list = async (req, res) => {
    try {
        if (req.query) {
            const { limit, page } = req.query;
            if (limit && isNaN(limit))
                return res.status(400).json({
                    message: "El limite de elementos no es un numero!",
                });
            if (page && isNaN(page))
                return res
                    .status(400)
                    .json({ message: "El limite de paginas no es un numero!" });
        }

        let optionsPagination = {
            lean: false,
            limit: req.query && Number(req.query.limit) ? req.query.limit : 10,
            page: req.query && Number(req.query.page) ? req.query.page : 1,
            populate: { path: "students", select: { _id: 1 } },
        };

        const sections = await section.paginate({}, optionsPagination);

        res.json(sections);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Error en el servidor" });
    }
};

// Update info for students in section
export const update = async (req, res) => {
    try {
        let now = new Date();
        dateFormat.i18n = date;
        const {
            name,
            year,
            students,
            period_initial,
            completion_period,
            isUpdate,
        } = req.body;
        console.log(req.body);
        let arrayStudentsIds = [];
        let arrayStudentsInvalid = [];
        let oldArrayStudentsIds = [];
        const sectionFound = await section.findById(req.params.id);
        if (!sectionFound) {
            res.status(404).json({
                message: "No se ha podido encontrar la seccion",
            });
        }

        if (name && sectionFound.name !== name.toLowerCase()) {
            const sectionCheck = await section.find({
                name: name.toLowerCase(),
            });
            if (sectionCheck.length > 0)
                return res
                    .status(400)
                    .json({
                        message: "Seccion con el mismo nombre ya existe!",
                    });
        }

        oldArrayStudentsIds = sectionFound.students;

        //Reach olds students and see for new students
        if (sectionFound && students) {
            for (const id of students) {
                const res = await requestIds(
                    id,
                    sectionFound,
                    isUpdate || false
                );
                if (res === true) {
                    arrayStudentsIds.push(id);
                } else {
                    arrayStudentsInvalid.push(res);
                }
            }

            for (const id of arrayStudentsIds) {
                const prevRegister = oldArrayStudentsIds.find((el) => {
                    return el == id;
                });
                if (prevRegister) {
                    arrayStudentsIds = arrayStudentsIds.filter((el) => {
                        return el != id;
                    });
                }
            }
        }

        //To edit data from section general

        if (name || year || period_initial || completion_period) {
            const isInvalid = verifyFields(req, res);
            if (isInvalid) {
                return res.status(400).json({ message: isInvalid.message });
            }
        }

        const savedSection = await section.updateOne(
            {
                _id: req.params.id,
            },
            {
                $set: {
                    name: name
                        ? name.toLowerCase()
                        : sectionFound.name.toLowerCase(),
                    year: year || sectionFound.year,
                    period_initial:
                        period_initial || sectionFound.period_initial,
                    completion_period:
                        completion_period || sectionFound.completion_period,
                    last_modify: dateFormat(
                        now,
                        "dddd, d De mmmm , yyyy, h:MM:ss TT"
                    ),
                    students: oldArrayStudentsIds.concat(arrayStudentsIds),
                },
            },
            { upsert: true }
        );

        await applySubjectsRegistered(req.params.id);

        if (arrayStudentsInvalid.length > 0) {
            return res.json({
                section: sectionFound,
                invalids: arrayStudentsInvalid,
            });
        }
        await verifySignup.registerLog(req,`Actualizo datos de la seccion ${savedSection.name}`)
        return res.json({ section: savedSection });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Error en el servidor" });
    }
};

//Add student to section if every register

export const addStudentsSectionRegistered = async (section_id, students) => {
    try {
        console.log("register section call", section_id);
        let now = new Date();
        dateFormat.i18n = date;
        let arrayStudentsIds = [];
        let arrayStudentsInvalid = [];
        let oldArrayStudentsIds = [];

        const sectionFound = await section.findById(section_id);
        if (sectionFound) {
            oldArrayStudentsIds = sectionFound.students;
            if (students) {
                for (const id of students) {
                    const res = await requestIds(id, sectionFound, false);
                    if (res === true) {
                        arrayStudentsIds.push(id);
                    } else {
                        arrayStudentsInvalid.push(res);
                    }
                }
            }
        }

        for (const id of arrayStudentsIds) {
            const prevRegister = oldArrayStudentsIds.find((el) => {
                return el == id;
            });
            if (prevRegister) {
                arrayStudentsIds = arrayStudentsIds.filter((el) => {
                    return el != id;
                });
            }
        }

        const savedSection = await section.updateOne(
            {
                _id: section_id,
            },
            {
                $set: {
                    last_modify: dateFormat(
                        now,
                        "dddd, d De mmmm , yyyy, h:MM:ss TT"
                    ),
                    students: oldArrayStudentsIds.concat(arrayStudentsIds),
                },
            },
            { upsert: true }
        );

        const stateSubjects = await applySubjectsRegistered(section_id);

        if (arrayStudentsInvalid.length > 0) {
            return {
                section: sectionFound,
                invalids: arrayStudentsInvalid,
                checked_subjects: stateSubjects,
            };
        }
        await verifySignup.registerLog(req,`Añadio estudiantes a la seccion ${savedSection.name}`)
        return { section: savedSection, checked_subjects: stateSubjects };
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Error en el servidor" });
    }
};

//Subjects

//Add subjects and update to section
export const applySubjectsRegistered = async (id) => {
    try {
        let sectionFound = await section.findOne({ _id: id });

        if (!sectionFound) return false;

        let listSubject = sectionFound.subjects.map((el) => {
            return { subject: el, scores: [] };
        });

        console.log("Array de estudiantes:", sectionFound.students);

        for (const studentRegister of sectionFound.students) {
            const studentFind = await student.findOne({ _id: studentRegister });
            console.log("Estudiante requerido", studentFind);
            if (studentFind) {
                let subjectsFromStudents = studentFind.subjects;
                // preserve the subjects not remove
                const subjectToStudent = listSubject.map((elm) => {
                    const prevSubject = subjectsFromStudents.find((item) => {
                        return (
                            item.subject.toString() == elm.subject.toString()
                        );
                    });

                    if (prevSubject) {
                        return prevSubject;
                    }

                    return elm;
                });
                console.log("subjects registradas", subjectToStudent);
                // Add if not subjects in student and is register and push to saved
                await student.updateOne(
                    { _id: studentFind.id },
                    { $set: { subjects: subjectToStudent } },
                    { upsert: true }
                );
            }
        }
        return true;
    } catch (err) {
        console.log(err);
        return false;
    }
};

export const deleteSection = async (req, res) => {
    try {
        const { section_id } = req.params;
        const sectionFound = section.findOne({ _id: section_id });
        if (!sectionFound)
            return res.status(404).json({ message: "Seccion no encontrada" });
        await section.deleteOne({ _id: mongoose.Types.ObjectId(section_id) });
        await student.updateMany({
            _id: sectionFound.students,
            $unset: { section: 1 },
            $set: { subjects: [] },
        });
        await verifySignup.registerLog(req,`Elimino la seccion ${sectionFound.name}`)
        res.json({ message: "Seccion Eliminada" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Error en el servidor" });
    }
};

export const deleteStudentsInSection = async (req, res) => {
    try {
        const { section_id } = req.params;
        let ObjectId = mongoose.Types.ObjectId;
        const { students } = req.body;

        let format = students.map((el) => ObjectId(el));
        const sectionFound = section.findOne({ _id: section_id });

        if (!sectionFound)
            return res.status(404).json({ message: "Seccion no encontrada" });

        await student.updateMany(
            { _id: { $in: format } },
            { $unset: { section: 1 }, $set: { subjects: [] } }
        );

        await section.updateOne(
            { _id: section_id },
            { $pullAll: { students: format } }
        );
        await verifySignup.registerLog(req,`Elimino estudiantes de la seccion ${savedSection.name}`)
        res.json({ message: "Estudiante/s eliminados de la seccion" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Error en el servidor" });
    }
};