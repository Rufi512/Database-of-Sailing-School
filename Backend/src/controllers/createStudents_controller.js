const fs = require('fs')
const csv = require('fast-csv')
const path = require('path')
const dateFormat = require('dateformat')
let student = require('../models/students')
let students = {}
let now = new Date();
let { date } = require('../data/dateformat')
dateFormat.i18n = date


let { materias1, materias2, materias3, materias4 } = require('../data/subjects.js');


//Registro de estudiante Individual
students.createStudent = async (req, res) => {
    const { ci, name, lastName, school_year } = req.body


    /*Nos aseguramos que el estudiante no exista en el sistema*/

    await student.findOne({ ci: ci }, function(err, exist) {

        if (exist !== null) {
            res.json('El estudiante ya se encuentra registrado en el sistema!')
            console.log('El estudiante ya se encuentra registrado')
        } else {

			res.json('null')
            
            //Se le asigna la materias al estudiante correspondiente al año

            switch (school_year) {
                case '1-A':
                case '1-B':
                    {

                       
                        return register(ci,name,lastName,school_year,materias1)
                        break;
                    }

                case '2-A':
                case '2-B':
                    {
                       
                        return register(ci,name,lastName,school_year,materias2)
                        break;

                    }

                case '3-A':
                case '3-B':
                    {
                        
                        return register(ci,name,lastName,school_year,materias3)
                        break;

                    }

                case '4-A':
                case '4-B':
                case '5-A':
                case '5-B':
                    {
                       
                        return register(ci,name,lastName,school_year,materias4)
                        break;

                    }
            }
        }
    })
}





//Registro de estudiantes masivo
students.createStudents = (req, res) => {
    const archive = req.file.path
    fs.createReadStream(archive)
        .pipe(csv.parse({ headers: true }))
        .on('error', error => console.error(error))
        .on('data', async (row) => {

            await student.findOne({ ci: row.cedula }, function(err, exist) {
                if (err || exist !== null) {
                   console.log('El estudiante de cedula: ' + row.cedula + ' Ya se encuentra registrado')
                } else {

                    switch (row.curso) {
                        case '1-A':
                        case '1-B':
                            {

                                
                                return register(row.cedula,row.nombre,row.apellido,row.curso,materias1)
                                break;
                            }

                        case '2-A':
                        case '2-B':
                            {
                               
                                return register(row.cedula,row.nombre,row.apellido,row.curso,materias2)
                                break;

                            }

                        case '3-A':
                        case '3-B':
                            {
                              
                                return register(row.cedula,row.nombre,row.apellido,row.curso,materias3)
                                break;

                            }

                        case '4-A':
                        case '4-B':
                        case '5-A':
                        case '5-B':
                            {
                                
                                return register(row.cedula,row.nombre,row.apellido,row.curso,materias4)
                                break;

                            }
                    }
                }
            })
        })

        .on('end', rowCount => res.send('Todos los estudiantes del archivo CSV añadidos'));

}

// Registra al estudiante en el sistema
            async function register(ci,name,lastName,school_year,subjects) {
                const studentReg = new student()
                studentReg.ci = ci;
                studentReg.firstName = name;
                studentReg.lastName = lastName;
                studentReg.school_year = school_year;
                studentReg.subjects = subjects;
                studentReg.created_at = dateFormat(now, "dddd, d De mmmm , yyyy, h:MM:ss TT");
                await studentReg.save()
                console.log('guardado')
                


            }

module.exports = students