const upd = {};
const students = require("../models/students");

const {upgrade, degrade, update, comments, unComment} = require("./saveStudents_controller");



//Actualiza la informacion del estudiante, informacion basica y Academica
upd.updateStudentForm = async (req, res) => {
  const {id} = req.params;
  const {ci, firstName, lastName, subjects, status} = req.body;
  //Llamamos a la funcion encargada de modificar en la base de datos
  update(id, ci, firstName, lastName, subjects, status, res);
};


//Gradua al los estudiante 
upd.studentUpgrade = async (req, res) => {
  const ids = req.body;
  for (const id of ids) {

    await upgrade(id);

  }

  if (ids.length === 1) {
    res.json('Estudiante graduado')
  } else {
    res.json('Estudiantes graduados')

  }

};


//Degrada de grado a los estudiante
upd.studentDegrade = async (req, res) => {
  const ids = req.body;
  for (const id of ids) {

    await degrade(id);
  }
  if (ids === 1) {
    res.json('Estudiante degradado')
  } else {
    res.json('Estudiantes degradados')

  }
};

//Añade comentarios
upd.commitStudent = async (req, res) => {
  const {id} = req.params;
  const {comment} = req.body;
  comments(id, comment, res)

}

//Remueve comentarios
upd.deleteCommit = async (req, res) => {
  const {id} = req.params;
  const {index} = req.body;
  unComment(id, index, res)
}

module.exports = upd;
