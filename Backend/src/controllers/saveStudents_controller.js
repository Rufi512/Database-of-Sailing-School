const students = require('../models/students')
const dateFormat = require('dateformat')
const { materias1, materias2, materias3, materias4 } = require('../data/subjects.js');
let now = new Date();
let { date } = require('../data/dateformat')
dateFormat.i18n = date

module.exports = {
// Registra al estudiante en el sistema

    register: async function(ci, firstName, lastName, school_year, subjects) {
        const studentReg = new students()
        studentReg.ci = ci;
        studentReg.firstName = firstName;
        studentReg.lastName = lastName;
        studentReg.school_year = school_year;
        studentReg.subjects = subjects;
        studentReg.last_modify = dateFormat(now, "dddd, d De mmmm , yyyy, h:MM:ss TT");
        await studentReg.save()
        console.log('guardado')
    },


    //Actualiza la informacion del estudiante (Notas y Grado)
    updateAll: async function(id,ci, firstName, lastName, school_year) {
        let subjects = materias1;
         switch (school_year) {
                case '1-A':
                case '1-B':
                    {

                       
                        subjects = materias1
                        break;
                    }

                case '2-A':
                case '2-B':
                    {
                       
                        subjects = materias2
                        break;

                    }

                case '3-A':
                case '3-B':
                    {
                        
                         subjects = materias3
                        break;

                    }

                case '4-A':
                case '4-B':
                case '5-A':
                case '5-B':
                    {
                       
                         subjects = materias4
                        break;

                    }
            }

        const student = await students.update({ _id: id }, {
            $set: {
                ci: ci,
                firstName: firstName,
                lastName: lastName,
                school_year: school_year,
                subjects: subjects,
                last_modify: dateFormat(now, "dddd, d De mmmm , yyyy, h:MM:ss TT")
            }
        })
        console.log('Estudiante Actualizado con nuevo grado')
    },


//Actualiza al estudiante (Solo Cedula,nombre,apellido,sus notas de las materias y estado)
    update: async function(id,ci,firstName,lastName,subjects,status){
        await students.update({_id:id},{
            $set:{
                ci:ci,
                firstName:firstName,
                lastName:lastName,
                subjects:subjects,
                status:status,
                last_modify:dateFormat(now, "dddd, d De mmmm , yyyy, h:MM:ss TT")
            }
        })
        
        console.log('Estudiante Actualizado')

    }

}