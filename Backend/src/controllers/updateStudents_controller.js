const upd = {};
const students = require("../models/students");
const trunk = require("../models/trunk");
const { updateAll,update,comments,unComment } = require("./saveStudents_controller");
const {saveChest,saveonChest} = require("./trunk_controller")

//Actualiza la informacion del estudiante, informacion basica
upd.updateStudent = async (req, res) => {
    const { id } = req.params;
    const { ci, firstName, lastName } = req.body;
    //Llamamos a la funcion encargada de modificar en la base de datos
    updateAll(id, ci, firstName, lastName);
};

//Actualiza la informacion del estudiante, informacion basica y Academica
upd.updateStudentForm = async (req, res) => {
    const { id } = req.params;
    const { ci, firstName, lastName,subjects,status } = req.body;
    //Llamamos a la funcion encargada de modificar en la base de datos
    update(id, ci, firstName, lastName,subjects,status,res);
};


//Se activara con el boton para subir de grado al estudiante
upd.upgradeStudent = async (req, res) => {
    const { id } = req.params;
    const { ci, firstName, lastName, school_year} = req.body;
    const student = await students.findById(id);
    const chest = await trunk.findById(id);
    
    if (!chest) {
        //Si el chest no esta encontrado,se creara uno en base a su id,pero primero añadira sus notas en su respetiva posicion
        saveChest(id,student.school_year, student.subjects);
    } else {
        saveonChest(id, student.school_year, student.subjects);

    }
    
    updateAll(id, ci, firstName, lastName, school_year);
};

//Añade comentarios
upd.commitStudent = async(req,res)=>{
    const {id} = req.params;
    const {comment} = req.body;
    comments(id,comment,res)
    
       }

//Remueve comentarios
upd.deleteCommit = async(req,res)=>{
    const {id} = req.params;
    const {index} = req.body;
    unComment(id,index,res)
   }

module.exports = upd;