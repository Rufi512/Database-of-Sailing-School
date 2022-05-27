import section from "../models/section"
import student from "../models/student";
import user from "../models/user";
import { date } from "../libs/dateformat";
import dateFormat from "dateformat";
import subject from '../models/subject'
const verifyFields = (req, res) => {
    if (!req.body.name || !req.body.year || !/^[A-Za-záéíóúñ'´ ]+$/.test(req.body.name) || !Number.isInteger(Number(req.body.year))) {
        res.status(400).json({ message: 'Datos invalidos' })
    }
}

const requestIds = async (id, sectionNew, isUpdated) => {
    let now = new Date();
    dateFormat.i18n = date;
    const studentFound = await student.findOne({ _id: id })
    if (!studentFound) return false
    // Return if the student is in section previous and if registing in the new section not yet register
    if(studentFound.section && !sectionNew)return { ci: studentFound.ci, firstname: studentFound.firstname, lastname: studentFound.lastname }

    if (!studentFound.section) {
        const res = await student.updateOne({ _id: id }, { $set: { section: sectionNew._id, last_modify: dateFormat(now, "dddd, d De mmmm , yyyy, h:MM:ss TT") } }, { upsert: true });
        return true
    }

    if (studentFound.section != sectionNew.id && isUpdated) {
        // Delete Students by section previous and assign new
        await section.updateMany({students:{$in: [studentFound.id]}},{ $pull: { students: studentFound.id } })
        await student.updateOne({ _id: id }, { $set: { section: sectionNew.id } }, { upsert: true });
        return true
    }

    // Denegate the change section if not update
    if (studentFound.section != sectionNew.id && !isUpdated){
        return { ci: studentFound.ci, firstname: studentFound.firstname, lastname: studentFound.lastname }
    }

    // Pass if section for student is the same 
    if (studentFound.section == sectionNew.id) return true

    return { ci: studentFound.ci, firstname: studentFound.firstname, lastname: studentFound.lastname }

}

export const create = async (req, res) => {
    verifyFields(req, res)
    const { name, year, students } = req.body
    const sectionCheck = await section.find({ name: name.toLowerCase() })
    if (sectionCheck.length > 0) return res.status(400).json({ message: 'Seccion con el mismo nombre ya existe!' })
    let arrayStudentsIds = []
    let arrayStudentsInvalid = []

    for (const id of students) {
        const res = await requestIds(id, false, false);
        if (res === true) {
            arrayStudentsIds.push(id)
        } else {
            arrayStudentsInvalid.push(res)
        }
    }

    const newSection = new section({
        name: name.toLowerCase(),
        year,
        arrayStudentsIds
    })

    const savedSection = await newSection.save()
    if (arrayStudentsInvalid) {
        return res.json({ section: savedSection, invalids: arrayStudentsInvalid })
    }

    return res.json({ section: savedSection })
}

export const sectionInfo = async (req, res) => {
    const sectionFound = await section.findById(req.params.id).populate("students",{subjects:0,record:0}).populate("subjects",{fromYears:0,score:0})
    if (!sectionFound) return res.status(404).json({ message: 'Seccion no encontrada!' })
    res.json(sectionFound)
}


export const list = async (req, res) => {
    if (req.query) {
        const { limit, page } = req.query
        if (limit && isNaN(limit)) return res.status(400).json({ message: 'El limite de elementos no es un numero!' })
        if (page && isNaN(page)) return res.status(400).json({ message: 'El limite de paginas no es un numero!' })
    }


    let optionsPagination = {
        lean: false,
        limit: req.query && Number(req.query.limit) ? req.query.limit : 10,
        page: req.query && Number(req.query.page) ? req.query.page : 1,
    };

    const sections = await section.paginate({}, optionsPagination)

    res.json(sections)
}


// Update info for students in section
export const update = async (req, res) => {
    let now = new Date();
    dateFormat.i18n = date;
    const { name, year, students, periodInitial, completionPeriod, isUpdate } = req.body
    let arrayStudentsIds = []
    let arrayStudentsInvalid = []
    let oldArrayStudentsIds = []
    if (name) {
        const sectionCheck = await section.find({ name: name.toLowerCase() })
        if (sectionCheck.length > 0) return res.status(400).json({ message: 'Seccion con el mismo nombre ya existe!' })
    }

    const sectionFound = await section.findById(req.params.id)
    if (sectionFound) {
        oldArrayStudentsIds = sectionFound.students
        for (const id of students) {
            const res = await requestIds(id, sectionFound, isUpdate || false);
            if (res === true) {
                arrayStudentsIds.push(id)
            } else {
                arrayStudentsInvalid.push(res)
            }
        }

    }

    for (const id of arrayStudentsIds) {
        const prevRegister = oldArrayStudentsIds.find((el) => {return el == id})
        if (prevRegister) {
            arrayStudentsIds = arrayStudentsIds.filter((el)=> {return el != id})
        }
    }

    const savedSection = await section.updateOne({
        _id: req.params.id
    }, {
        $set: {
            name: name ? name.toLowerCase : sectionFound.name.toLowerCase(),
            year: year || sectionFound.year,
            period_initial: periodInitial || sectionFound.period_initial,
            completion_period: completionPeriod || sectionFound.completion_period,
            last_modify: dateFormat(now, "dddd, d De mmmm , yyyy, h:MM:ss TT"),
            students: oldArrayStudentsIds.concat(arrayStudentsIds)
        }
    }, { upsert: true })

    if (arrayStudentsInvalid.length > 0) {
        return res.json({ section: sectionFound, invalids: arrayStudentsInvalid })
    }

    return res.json({ section: savedSection })
}


//Subjects

//Add subjects to section
export const addSubjectSection = async (req,res)=>{
    try{
        const {subjects,section_id} = req.body
        const sectionFound = section.findOne({_id:section_id})
        for(const verifySubject of subjects ){
           const foundSubject = subject.findOne({_id:section_id})
           if(!foundSubject) return res.status(404).json({message:'Alguna materia no ha sido encontrada'})
        }

    let listSubjects = subjects.map((el)=>{return {subject:el.id,scores:[]}})
        if(!sectionFound) return res.status(404).json({message:'Seccion no encontrada!'})
        await section.updateOne({_id:section_id},{$addToSet:{subjects:{$each: subjects}}})
        return res.json({message:'Materias a seccion añadida'})
    }catch(err){
        console.log(err)
        return res.status(500).json({message:'No se ha podido añadir las materias a la seccion'})
    }
}


//Delete subjects for the section
export const deleteSubjectsSection = async (req,res)=>{
    try{
        const {id} = req.params
        const {subjects} = req.body
        const sectionFound = section.findOne({_id:id})
        for(const verifySubject of subjects ){
           const foundSubject = subject.findOne({_id:id})
           if(!foundSubject) return res.status(404).json({message:'Alguna seccion no ha sido encontrada'})
        }
        if(!sectionFound) return res.status(404).json({message:'Seccion no encontrada!'})
        await section.updateOne({_id:id},{$pullAll:{subjects:subjects}})
        await student.updateMany({section:id},{$pullAll:{subjects:subjects}})
        return res.json({message:`Materia/s a seccion y estudiantes eliminadas`})
    }catch(err){
        console.log(err)
        return res.status(500).json({message:'No se ha podido borrar las materias a la seccion'})
    }
}