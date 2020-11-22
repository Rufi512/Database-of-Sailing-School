const students = require('../models/students')
const trunk = require('../models/trunk')
const show = {}

//Lista de estudiantes
show.showStudentsActive = async (req, res) => {
  const student = await students.find({'status': true}).sort({_id: -1})
  res.json(student)
}

show.showStudentsInactive = async (req, res) => {
  const student = await students.find({'status': false}).sort({_id: -1})
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


//Muestra las notas anteriores y actuales del estudiante (baul)

show.historyStudent = async (req, res) => {
  const chest = await trunk.findById(req.params.id)
  if (!chest) {
    res.json('Informacion no disponible')
  } else {
    res.json(chest)
  }

}


module.exports = show
