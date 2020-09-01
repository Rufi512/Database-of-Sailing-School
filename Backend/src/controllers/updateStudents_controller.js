const upd = {}
const students = require('../models/students')
let { materias1, materias2, materias3, materias4 } = require('../data/subjects.js');

upd.updateStudent = async(req,res)=>{
	const {ci,firstName,lastName,school_year} = req.body
	const {id} = req.params

	switch (school_year) {
                case '1-A':
                case '1-B':
                    {

                       
                        return update(materias1)
                        break;
                    }

                case '2-A':
                case '2-B':
                    {
                       
                        return update(materias2)
                        break;

                    }

                case '3-A':
                case '3-B':
                    {
                        
                        return update(materias3)
                        break;

                    }

                case '4-A':
                case '4-B':
                case '5-A':
                case '5-B':
                    {
                       
                        return update(materias4)
                        break;

                    }

                    default:{
                    	res.json('El año escolar no cumple con los parámetros')
                    }
            }

//Actualiza los datos del estudiante
async function update(subjects){

	 const student = await students.update({_id: id},{ $set:
      {
      	ci:ci,
        firstName: firstName,
        lastName:lastName,
        school_year:school_year,
 		    subjects:subjects
      }
   })
	res.json(student)
	console.log('Estudiante Actualizado')
}
}


//Actualizar Informacion

upd.updateBasic = async (req,res)=>{
    const {id} = req.params
    const student = await students.update({_id:id},req.body)
    res.json(student)
}


module.exports = upd