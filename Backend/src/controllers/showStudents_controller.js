const students = require('../models/students')

const show = {}

//Lista de estudiantes
show.showStudentsActive = async (req, res) => {
  const student = await students.find({'status': true,'school_year':{$ne:'Graduado'}}).sort({_id: -1})
  res.json(student)
}

show.showStudentsInactive = async (req, res) => {
  const student = await students.find({'status': false,'school_year':{$ne:'Graduado'}}).sort({_id: -1})
  res.json(student)
}

show.showStudentsGradues = async (req, res) => {
  const student = await students.find({'school_year': 'Graduado'}).sort({_id: -1})
  res.json(student)
}

//Muestra informacion del estudiante
show.showStudent = async (req, res) => {
  const student = await students.findById(req.params.id)
  res.json(student)
}





module.exports = show
