const upd = {};
const students = require("../models/students");
const trunk = require("../models/trunk");
const {upgrade, degrade, update, comments, unComment} = require("./saveStudents_controller");
const {createChest, saveonChest, eraseOnChest} = require("./trunk_controller")



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
    const student = await students.findById(id);
    const chest = await trunk.findById(id);
    if (!chest) {
      //Si el chest no esta encontrado,se creara uno en base a su id
      await createChest(id, student.school_year, student.subjects);
    } else {
      await saveonChest(id, student.school_year, student.subjects);

    }

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
    await eraseOnChest(id)
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
