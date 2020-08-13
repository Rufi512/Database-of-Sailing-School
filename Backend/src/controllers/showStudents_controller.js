const students = require('../models/students')
const show={}
show.showStudents = async (req,res)=>{
	const student = await students.find()
    res.json(student)
}

show.showStudent = async (req,res)=>{
	const student = await students.findById(req.params.id)
	res.json(student)
}




module.exports = show