const students = require('../models/students')
const show={}

//Lista de estudiantes
show.showStudents = async (req,res)=>{
	const student = await students.find().sort({_id:-1})
    res.json(student)
}

//Muestra informacion del estudiante
show.showStudent = async (req,res)=>{
	const student = await students.findById(req.params.id)
	res.json(student)
}





module.exports = show