import subject from '../models/subject';
import section from '../models/section';
import student from '../models/student';
import mongoose from 'mongoose'
const checkSubject = async (data, res, update) => {
    const { name, fromYears } = data
    if (!name || !fromYears) {
        return { status: false, message: 'Nombre o año ausente' }
    }

    const prevSubject = await subject.findOne({ name: name.toLowerCase() })

    if (prevSubject && !update) return { status: false, message: 'Materia previamente añadida' }
    if (prevSubject && update && !prevSubject.name == name.toLowerCase()) return { status: false, message: 'Ya hay una materia con el mismo nombre' }

    const verifyYears = fromYears.map((el) => {
        if (el > 0 && el < 6 && !isNaN(el)) {
            return el
        }
    })

    return { status: true, name: name.toLowerCase(), fromYears }

}


export const register = async (req, res) => {
    const data = await checkSubject(req.body, res, false);
    if (!data.status) return res.status(404).json(data.message)
    const newSubject = new subject({
        name: data.name,
        fromYears: data.fromYears
    })

    const savedSubject = await newSubject.save()

    return res.json(savedSubject)
}

export const list = async (req, res) => {
    const subjects = await subject.find()
    return res.json(subjects)
}


export const update = async (req, res) => {
    const data = await checkSubject(req.body, res, true);
    if (!data.status) return res.status(404).json(data.message)

    const newSubject = await subject.updateOne({ _id: req.params.id }, {
        $set: {
            name: data.name,
            fromYears: data.fromYears
        }
    }, { upsert: true })

    return res.json(newSubject)


}

//Assign subject to students in section in based to school_year actual

export const assign = async (req, res) => {
    try {
        //Obtains sections

        const sectionAssign = await section.findOne({ _id: req.body.section_id })
        let subjects = await subject.find({ 'fromYears': { $in: sectionAssign.year } }, { _id: 1 })
        const listIdSubjects = subjects.map((el)=> mongoose.Types.ObjectId(el))

        subjects = subjects.map((el)=>{return{subject:mongoose.Types.ObjectId(el),scores:[]}})

        //Obtain students for the sections

        for (const studentRegister of sectionAssign.students) {
            const studentFind = await student.findOne({ _id: studentRegister })
            let subjectToStudent = subjects

            // Verify if subject is already exists
            for(const oldSubjects of studentFind.subjects){
                subjectToStudent = subjectToStudent.filter((el)=> (el.subject == oldSubjects.subject))
                console.log(subjectToStudent)
            }
            console.log('subjects to student', studentFind.id, 'subjects ', subjectToStudent)
            // Add if not subjects in student and is register and push to saved
            await student.updateOne({_id:studentFind.id},{$addToSet:{subjects:{$each:subjectToStudent}}})

        }
            await section.updateOne({_id:sectionAssign.id},{$set:{subjects:listIdSubjects}},{upsert:true})
            
        res.json(subjects)
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Error fatal ocurrido' })
    }
}

//Assign section to students based to list section registered in the section xd

export const addSubjectsBySection = async (req,res) =>{
	try{
		let sectionFound = await section.findOne({ _id: req.body.section_id })
        let listSubject = sectionFound.subjects.map((el)=>{return {subject:el, scores:[]}})
		if(!listSubject) return res.status(400).json({message:'Seccion no encontrada'})
		for (const studentRegister of sectionFound.students) {
            const studentFind = await student.findOne({ _id: studentRegister })
            let subjectToStudent = listSubject
            // Verify if subject is already exists
            for(const oldSubjects of studentFind.subjects){
                subjectToStudent = subjectToStudent.filter((el)=> (el.subject == oldSubjects.subject))
            }
            // Add if not subjects in student and is register and push to saved
            await student.updateOne({_id:studentFind.id},{$addToSet:{subjects:{$each:subjectToStudent}}})

        }
		return res.json({message:'Materias Agregadas a estudiantes del curso actual', materias:listSubject})
	}catch(err){
		console.log(err)
		res.status(500).json({message:'Error fatal'})
	}
}

export const deleteSubject = async (req,res) =>{
	try{
		const {id} = req.body
		const subjectFind = subject.findOne({_id:id})
		if(subjectFind){
			await section.updateMany({"subjects": { "$in": [id] }},{$pull:{subjects:id}})
			await student.updateMany({"subjects": { "$in": [id] }},{$pull:{subject:id}})
			return res.json({message:`Materia: ${subjectFind.name[0].toUpperCase() + subjectFind.name[0].substring(1)} eliminada`})
		}
		return res.status(400).json({message:'No se ha podido eliminar la materia especificada'})
	}catch(err){
		console.log(err)
		res.status(500).json({message:'Ha ocurrido un error fatal en el servidor y no se ha podido eliminar la materia'})
	}
}