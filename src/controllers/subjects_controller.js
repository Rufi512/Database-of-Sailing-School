import subject from "../models/subject";
import section from "../models/section";
import student from "../models/student";
import { applySubjectsRegistered } from "./sections_controller";
import mongoose from "mongoose";

const checkSubject = async (data, res, update) => {
    const { name, fromYears } = data;
    if (!name || !fromYears) {
        return { status: false, message: "Nombre o año ausente" };
    }

    const prevSubject = await subject.findOne({ name: name.toLowerCase() });

    if (prevSubject && !update)
        return { status: false, message: "Materia previamente añadida" };
    if (prevSubject && update && !prevSubject.name == name.toLowerCase())
        return {
            status: false,
            message: "Ya hay una materia con el mismo nombre",
        };

    const verifyYears = fromYears.map((el) => {
        if (el > 0 && el < 11 && !isNaN(el)) {
            return el;
        }
    });

    return { status: true, name: name.toLowerCase(), fromYears };
};

export const register = async (req, res) => {
    const data = await checkSubject(req.body, res, false);
    if (!data.status) return res.status(404).json(data.message);
    if(!data.fromYears || data.fromYears.length === 0){
        return res.status(404).json({message: 'Especifique el año para la materia'})
    }
    const newSubject = new subject({
        name: data.name,
        fromYears: data.fromYears,
    });

    const savedSubject = await newSubject.save();

    return res.json(savedSubject);
};

export const list = async (req, res) => {
    if (req.query) {
        const { limit, page } = req.query;
        if (limit && isNaN(limit))
            return res
                .status(400)
                .json({ message: "El limite de elementos no es un numero!" });
        if (page && isNaN(page))
            return res
                .status(400)
                .json({ message: "El limite de paginas no es un numero!" });
    }

    let optionsPagination = {
        lean: false,
        limit: req.query && Number(req.query.limit) ? req.query.limit : 10,
        page: req.query && Number(req.query.page) ? req.query.page : 1,
    };

    const subjects = await subject.paginate({}, optionsPagination);

    return res.json(subjects);
};

export const listAvalaibleSection = async (req, res) => {
    const sectionFound = await section.findById(req.params.id);
    if (!sectionFound) {
        return res.status(404).json({ message: "Seccion no encontrada" });
    }
    const subjects = await subject.find({
        fromYears: { $in: sectionFound.year },
    });
    console.log(subjects);
    let newList = [];
    for (const elm of subjects) {
        newList.push({
            value: elm.id,
            label: `${elm.name[0].toUpperCase() + elm.name.substring(1)}`,
        });
    }

    return res.json(newList);
};

export const update = async (req, res) => {
    const data = await checkSubject(req.body, res, true);
    if (!data.status) return res.status(404).json(data.message);
    if(!data.fromYears || data.fromYears.length === 0){
        return res.status(404).json({message: 'Especifique el año para la materia'})
    }

    const newSubject = await subject.updateOne(
        { _id: req.params.id },
        {
            $set: {
                name: data.name,
                fromYears: data.fromYears,
            },
        },
        { upsert: true }
    );

    return res.json(newSubject);
};

//Assign subject to students in section in based to school_year actual

export const assign = async (req, res) => {
    try {
        //Obtains sections

        const sectionAssign = await section.findOne({
            _id: req.body.section_id,
        });
        let subjects = await subject.find(
            { fromYears: { $in: sectionAssign.year } },
            { _id: 1 }
        );
        const listIdSubjects = subjects.map((el) =>
            mongoose.Types.ObjectId(el)
        );

        subjects = subjects.map((el) => {
            return { subject: mongoose.Types.ObjectId(el), scores: [] };
        });

        //Obtain students for the sections

        for (const studentRegister of sectionAssign.students) {
            const studentFind = await student.findOne({ _id: studentRegister });
            let subjectToStudent = subjects;

            // Verify if subject is already exists
            for (const oldSubjects of studentFind.subjects) {
                subjectToStudent = subjectToStudent.filter(
                    (el) => el.subject == oldSubjects.subject
                );
                console.log(subjectToStudent);
            }
            console.log(
                "subjects to student",
                studentFind.id,
                "subjects ",
                subjectToStudent
            );
            // Add if not subjects in student and is register and push to saved
            await student.updateOne(
                { _id: studentFind.id },
                { $addToSet: { subjects: { $each: subjectToStudent } } }
            );
        }
        await section.updateOne(
            { _id: sectionAssign.id },
            { $set: { subjects: listIdSubjects } },
            { upsert: true }
        );

        res.json(subjects);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Error fatal ocurrido" });
    }
};

//update subjects registered in section

export const updateSubjectsBySection = async (req, res) => {
    try {
        const { subjects, applyYearSubjects } = req.body;
        console.log(req.body)
        const sectionFound = await section.findById(req.params.id);

        if (!sectionFound) {
            return res.status(404).json({ message: "Seccion no encontrada" });
        }

        // obtain list subjects avalaible in year
        const listSubjects = await subject.find(
            { fromYears: { $in: sectionFound.year } },
            { id: 1 }
        );

        //return list subject filtered
        subjects
            .map((elm) => {
                if (listSubjects.includes(elm.value)) {
                    return elm;
                }
                return null;
            })
            .filter((el) => el !== null);

        //Start assign to students
        await section.updateOne(
            { _id: req.params.id },
            { $set: { subjects: applyYearSubjects ? listSubjects : subjects } },
            { upsert: true }
        );

        const studentsApply = await applySubjectsRegistered(req.params.id);
        console.log('studentsApply', studentsApply)
        if (studentsApply) {
            return res.json({
                message: "Materia registradas a seccion y estudiantes",
            });
        } else {
            return res.status(400).json({
                message:
                    "No se pudieron registrar las materias a los estudiantes",
            });
        }
    } catch (e) {
        console.log(e);
        res.status(500).json({ message: "Error al procesar información" });
    }
};



export const deleteSubject = async (req, res) => {
    try {
        const { id } = req.body;
        const subjectFind = await subject.findOne({ _id: id });
        if (subjectFind) {
            await section.updateMany(
                { subjects: { $in: [id] } },
                { $pull: { subjects: id } }
            );
            await student.updateMany(
                { subjects: { $in: [id] } },
                { $pull: { subject: id } }
            );
            await subject.findByIdAndDelete(id);
            return res.json({
                message: `Materia: ${
                    subjectFind.name[0].toUpperCase() +
                    subjectFind.name.substring(1)
                } eliminada`,
            });
        }
        return res.status(404).json({
            message: "No se ha podido eliminar la materia especificada",
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message:
                "Ha ocurrido un error fatal en el servidor y no se ha podido eliminar la materia",
        });
    }
};