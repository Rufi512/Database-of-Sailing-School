const trunk = require('../models/trunk')
const students = require('../models/students')
let { materias1, materias2, materias3, materias4 } = require('../data/subjects.js');
const chest = {}


chest.saveStudent = async (req, res) => {
    //Actualizar seccion

    //Buscamos al estudiante
    const { id } = req.params
    const { ci, firstName, lastName, school_year, subjects } = req.body
    const student = await students.findById(req.params.id)
    const trunk_Id = await trunk.findById(id)
    const newtrunk = new trunk()
   
    if (!trunk_Id) {
        //Si no existe,se crean sus datos en el trunk
        saveStudent(id)
    } else { //Guarda sus datos actuales en el trunk

        if (student.school_year != school_year) {
            switch (student.school_year) {
                case '1-A':
                case '1-B':
                    {
                        const chess = await trunk.update({ _id: id }, {
                            $set: {
                                ci: student.ci,
                                firstName: student.firstName,
                                lastname: student.lastName,
                                notes1: {
                                    "school_year": student.school_year,
                                    "subjects": student.subjects
                                }

                            }
                        })

                        change(school_year)

                        break;

                    }

                case '2-A':
                case '2-B':
                    {
                        const chess = await trunk.update({ _id: id }, {
                            $set: {
                                ci: student.ci,
                                firstName: student.firstName,
                                lastname: student.lastName,
                                notes2: {
                                    "school_year": student.school_year,
                                    "subjects": student.subjects
                                }

                            }
                        })

                        change(school_year)

                        break;

                    }

                case '3-A':
                case '3-B':
                    {
                        const chess = await trunk.update({ _id: id }, {
                            $set: {
                                ci: student.ci,
                                firstName: student.firstName,
                                lastname: student.lastName,
                                notes3: {
                                    "school_year": student.school_year,
                                    "subjects": student.subjects
                                }

                            }
                        })

                        change(school_year)

                        break;

                    }

                case '4-A':
                case '4-B':
                    {
                        const chess = await trunk.update({ _id: id }, {
                            $set: {
                                ci: student.ci,
                                firstName: student.firstName,
                                lastname: student.lastName,
                                notes4: {
                                    "school_year": student.school_year,
                                    "subjects": student.subjects
                                }

                            }
                        })

                        change(school_year)

                        break;

                    }

                case '5-A':
                case '5-B':
                    {
                        const chess = await trunk.update({ _id: id }, {
                            $set: {
                                ci: student.ci,
                                firstName: student.firstName,
                                lastname: student.lastName,
                                notes5: {
                                    "school_year": student.school_year,
                                    "subjects": student.subjects
                                }

                            }
                        })

                        change(school_year)

                        break;

                    }
            }
        } 
    }




    //Guardar notas en trunk
    async function saveStudent(id) {
        //Comprobamos si han actualizado su año escolar
        if (student.school_year != school_year) {

            //Guarda las notas del año escolar anterior para luego cambiar sus materias

            switch (student.school_year) {
                case '1-A':
                case '1-B':
                    {
                        newtrunk.notes1 = {
                            "school_year": student.school_year,
                            "subjects": student.subjects
                        }



                        break;

                    }

                case '2-A':
                case '2-B':
                    {
                        newtrunk.notes2 = {
                            "school_year": student.school_year,
                            "subjects": student.subjects
                        }



                        break;

                    }

                case '3-A':
                case '3-B':
                    {
                        newtrunk.notes3 = {
                            "school_year": student.school_year,
                            "subjects": student.subjects
                        }


                        break;

                    }

                case '4-A':
                case '4-B':
                    {
                        newtrunk.notes4 = {
                            "school_year": student.school_year,
                            "subjects": student.subjects
                        }

                        break;

                    }

                case '5-A':
                case '5-B':
                    {
                        newtrunk.notes5 = {
                            "school_year": student.school_year,
                            "subjects": student.subjects
                        }


                        break;

                    }
            }
            //Llamamos la funcion para guardar sus notas actual en el trunk 
                newtrunk._id = student.id
                newtrunk.ci = student.ci,
                newtrunk.firstName = student.firstName,
                newtrunk.lastName = student.lastName,
                await newtrunk.save()
            //Actualiza la informacion del estudiante
                change(school_year)

        } 

    }


    //Actualiza el año escolar y las materias del estudiante
    async function change(school_year) {

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

            default:
                {
                    res.json('El año escolar no cumple con los parámetros')
                }
        }

    }


    async function update(subjects) {
        const student = await students.update({ _id: id }, {
            $set: {
                ci: ci,
                firstName: firstName,
                lastName: lastName,
                school_year: school_year,
                subjects: subjects
            }
        })
        res.json('Datos actualizados')
    }


}






module.exports = chest