const fs = require('fs')
const csv = require('fast-csv')
const path = require('path')
let students = {}
const {register} = require('./saveStudents_controller.js')
const student = require('../models/students')
const { materias1, materias2, materias3, materias4 } = require('../data/subjects.js');


//Registro de estudiante Individual
students.createStudent = async (req, res) => {
    const { ci, firstName, lastName, school_year } = req.body


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

                       
                         register(ci,firstName,lastName,school_year,materias1)
                        break;
                    }

                case '2-A':
                case '2-B':
                    {
                       
                         register(ci,firstName,lastName,school_year,materias2)
                        break;

                    }

                case '3-A':
                case '3-B':
                    {
                        
                         register(ci,firstName,lastName,school_year,materias3)
                        break;

                    }

                case '4-A':
                case '4-B':
                case '5-A':
                case '5-B':
                    {
                       
                         register(ci,firstName,lastName,school_year,materias4)
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
                if (exist !== null) {
                   console.log('El estudiante de cedula: ' + row.cedula + ' Ya se encuentra registrado')
                } else {
                    switch (row.curso) {
                        case '1-A':
                        case '1-B':
                            {

                                
                                register(row.cedula,row.nombre,row.apellido,row.curso,materias1)
                                break;
                            }

                        case '2-A':
                        case '2-B':
                            {
                               
                                register(row.cedula,row.nombre,row.apellido,row.curso,materias2)
                                break;

                            }

                        case '3-A':
                        case '3-B':
                            {
                              
                                register(row.cedula,row.nombre,row.apellido,row.curso,materias3)
                                break;

                            }

                        case '4-A':
                        case '4-B':
                        case '5-A':
                        case '5-B':
                            {
                                
                                register(row.cedula,row.nombre,row.apellido,row.curso,materias4)
                                break;

                            }
                    }
                }
            })
        })

        .on('end', () =>{ 
           res.json('Todos los estudiantes del archivo CSV añadidos')
    });

}



module.exports = students