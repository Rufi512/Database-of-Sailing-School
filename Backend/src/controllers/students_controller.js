const fs = require('fs')
const csv = require('fast-csv')
const path = require('path')
const dateFormat = require('dateformat')
let student = require('../models/students')
let students = {}
var now = new Date();
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
            /*Se le asigna la materias al estudiante correspondiente al año*/
            let materias_student = []


            switch (school_year) {
                case '1-A':
                case '1-B':
                    {

                        materias_student.push(materias1)
                        return register()
                        break;
                    }

                case '2-A':
                case '2-B':
                    {
                        materias_student.push(materias2)
                        return register()
                        break;

                    }

                case '3-A':
                case '3-B':
                    {
                        materias_student.push(materias3)
                        return register()
                        break;

                    }

                case '4-A':
                case '4-B':
                case '5-A':
                case '5-B':
                    {
                        materias_student.push(materias4)
                        return register()
                        break;

                    }





            }
            /*Registra al estudiante en el sistema*/
            async function register() {

                let studentReg = new student()
                studentReg.ci = ci;
                studentReg.firstName = name;
                studentReg.lastName = lastName;
                studentReg.school_year = school_year;
                studentReg.subjects = materias_student;
                studentReg.created_at = dateFormat(now, "dddd, d De mmmm , yyyy, h:MM:ss TT");
                studentReg.save()
                await console.log('guardado')


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
        .on('data', row => {

            student.findOne({ ci: row.cedula }, function(err, exist) {
                    if (exist !== null) {
                        res.send('El estudiante existe')
                    } else {
                        let materias_student = []
                        switch (row.curso) {
                            case '1-A':
                            case '1-B':
                                {

                                    materias_student.push(materias1)
                                    return register()
                                    break;
                                }

                            case '2-A':
                            case '2-B':
                                {
                                    materias_student.push(materias2)
                                    return register()
                                    break;

                                }

                            case '3-A':
                            case '3-B':
                                {
                                    materias_student.push(materias3)
                                    return register()
                                    break;

                                }

                            case '4-A':
                            case '4-B':
                            case '5-A':
                            case '5-B':
                                {
                                    materias_student.push(materias4)
                                    return register()
                                    break;

                                }




                                async function register() {

                                    let studentReg = new student()
                                    studentReg.ci = row.cedula;
                                    studentReg.firstName = row.nombre;
                                    studentReg.lastName = row.apellido;
                                    studentReg.school_year = row.curso;
                                    studentReg.subjects = materias_student;
                                    studentReg.created_at = dateFormat(now, "dddd, d De mmmm , yyyy, h:MM:ss TT");
                                    studentReg.save()
                                    await console.log('guardado')


                                }

                        }
                    }





              })
        })


        .on('end', rowCount => res.send('Todos los estudiantes del archivo CSV añadidos'));


}


module.exports = students